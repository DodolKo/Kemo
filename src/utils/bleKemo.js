// --- UUIDs standard + custom (doivent matcher ton firmware ESP32) ---
const SVC_HRS   = 'heart_rate';                  // 0x180D
const CH_HRMM   = 'heart_rate_measurement';      // 0x2A37

const SVC_KEMO  = '5b3a0001-8c3a-4b1c-9a5e-8b8d9a0f0001';
const CH_SPO2   = '5b3a0002-8c3a-4b1c-9a5e-8b8d9a0f0001';
const CH_STATUS = '5b3a0003-8c3a-4b1c-9a5e-8b8d9a0f0001';

// ECG streaming (custom service for AD8232 bridge)
const SVC_ECG   = '5b3a0011-8c3a-4b1c-9a5e-8b8d9a0f0001';
const CH_ECG    = '5b3a0012-8c3a-4b1c-9a5e-8b8d9a0f0001';

// État interne
let device = null;
let server = null;
let hrmm = null, chSpO2 = null, chStatus = null, chECG = null;
let onUpdate = (_state) => {}; // callback externe (BPM/SpO2/connected)
let onECGChunk = (_chunkOrNull) => {}; // callback externe (Float32Array chunk | null)

// Util: parse paquet HRS (0x2A37)
function parseHRM(dv) {
  let i = 0;
  const flags = dv.getUint8(i++);
  const hr16  = (flags & 0x01) !== 0;
  const scSup = (flags & 0x02) !== 0;   // sensor contact supported
  const scDet = (flags & 0x04) !== 0;   // sensor contact detected
  const bpm   = hr16 ? dv.getUint16(i, true) : dv.getUint8(i);
  return { bpm, sensorContactSupported: scSup, sensorContactDetected: scDet };
}

// Expose: brancher ton callback UI/store
export function setUpdateHandler(cb) { onUpdate = cb || onUpdate; }

export function setECGHandler(cb) { onECGChunk = cb || onECGChunk; }

export async function connectKemo() {
  if (!('bluetooth' in navigator)) throw new Error('Web Bluetooth non supporté');
  // Filtre sur le préfixe de nom que tu as mis dans le firmware ("Kemo-...")
  // On essaie d'abord les filtres stricts (production). Si aucun appareil
  // n'est sélectionné / trouvé, on propose un fallback de debug avec
  // acceptAllDevices pour aider au diagnostic.
  const filterOptions = {
    filters: [{ namePrefix: 'Kemo-' }],
    optionalServices: [SVC_HRS, SVC_KEMO, SVC_ECG]
  };

  try {
    device = await navigator.bluetooth.requestDevice(filterOptions);
  } catch (err) {
    // Si l'utilisateur annule explicitement la popup, on relance l'erreur
    // vers l'appelant. Mais si la raison est qu'aucun appareil n'a été
    // trouvé avec les filtres, on propose un fallback pour debug.
    console.warn('requestDevice with filters failed:', err);
    // Fallback debug: accepter tous les appareils (à n'utiliser que pour debug)
    device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: [SVC_HRS, SVC_KEMO, SVC_ECG]
    });
  }

  device.addEventListener('gattserverdisconnected', () => {
    onUpdate({ connected: false });
    try { onECGChunk(null); } catch (e) {}
  });

  server = await device.gatt.connect();
  // Mark as connected early; services below are best-effort
  onUpdate({ connected: true });

  // Helper: ensure server is connected (reconnect if needed) before using services
  async function ensureConnected() {
    if (!device) throw new Error('No device');
    if (!device.gatt.connected) {
      try {
        server = await device.gatt.connect();
        onUpdate({ connected: true });
      } catch (err) {
        // rethrow so callers can decide
        throw err;
      }
    }
    return server;
  }

  // --- HRS (BPM) ---
  try {
    const s = await ensureConnected();
    const hrs = await s.getPrimaryService(SVC_HRS);
    hrmm = await hrs.getCharacteristic(CH_HRMM);
    await hrmm.startNotifications();
    hrmm.addEventListener('characteristicvaluechanged', (ev) => {
      const { bpm, sensorContactDetected } = parseHRM(ev.target.value);
      const bpmVal = sensorContactDetected && bpm > 0 ? bpm : null;
      onUpdate({ bpm: bpmVal });
    });
  } catch (e) {
    console.warn('HRS service not found or failed:', e);
  }

  // --- KEMO (SpO2 + status) --- (optional)
  try {
    const s2 = await ensureConnected();
    const kemo = await s2.getPrimaryService(SVC_KEMO);
    chSpO2 = await kemo.getCharacteristic(CH_SPO2);
    chStatus = await kemo.getCharacteristic(CH_STATUS);

    await chSpO2.startNotifications();
    await chStatus.startNotifications();

    let spo2Valid = false;

    chStatus.addEventListener('characteristicvaluechanged', (ev) => {
      spo2Valid = ev.target.value.getUint8(0) === 1;
    });

    chSpO2.addEventListener('characteristicvaluechanged', (ev) => {
      const v = ev.target.value.getUint8(0);
      const spo2 = (spo2Valid && v !== 255) ? v : null; // 255 = none
      onUpdate({ spo2 });
    });
  } catch (e) {
    console.warn('Kemo SpO2 service not found or failed (optional):', e);
  }

  // --- ECG (custom) ---
  try {
    const s3 = await ensureConnected();
    const ecgSvc = await s3.getPrimaryService(SVC_ECG);
    chECG = await ecgSvc.getCharacteristic(CH_ECG);
    await chECG.startNotifications();
    console.log('[BLE] ✓ ECG notifications started');
    
    let chunkCount = 0;
    chECG.addEventListener('characteristicvaluechanged', (ev) => {
      const dv = ev.target.value;
      const count = dv.byteLength >> 1; // /2
      const arr = new Float32Array(count);
      
      for (let i = 0; i < count; i++) {
        const s = dv.getInt16(i * 2, true); // little-endian int16
        // ESP32 envoie signal centré * 8 pour gain
        // Normalisation réaliste: int16 max ~±16384 (après gain x8) → ±1.0
        // Diviser par 16384 garde l'amplitude relative correcte
        arr[i] = s / 16384.0;
      }
      
      // Log seulement toutes les 200 chunks (~1x par 4 secondes à 250Hz/20samples)
      if (chunkCount % 200 === 0) {
        const min = Math.min(...arr);
        const max = Math.max(...arr);
        console.log(`[BLE ECG] #${chunkCount}: ${count} samples, range: ${min.toFixed(2)} to ${max.toFixed(2)}`);
      }
      chunkCount++;
      
      try { onECGChunk(arr); } catch (e) { console.error('[BLE ECG] Handler error:', e); }
    });
  } catch (e) {
    // ECG service not available (older firmware) → ignore
    console.warn('[BLE] ECG service not available (optional)');
  }
  return device;
}

export async function disconnectKemo() {
  try {
    if (device && device.gatt.connected) device.gatt.disconnect();
  } finally {
    device = server = hrmm = chSpO2 = chStatus = null;
    onUpdate({ connected: false });
  }
}
