// --- UUIDs standard + custom (doivent matcher ton firmware ESP32) ---
const SVC_HRS   = 'heart_rate';                  // 0x180D
const CH_HRMM   = 'heart_rate_measurement';      // 0x2A37

const SVC_KEMO  = '5b3a0001-8c3a-4b1c-9a5e-8b8d9a0f0001';
const CH_SPO2   = '5b3a0002-8c3a-4b1c-9a5e-8b8d9a0f0001';
const CH_STATUS = '5b3a0003-8c3a-4b1c-9a5e-8b8d9a0f0001';

// État interne
let device = null;
let server = null;
let hrmm = null, chSpO2 = null, chStatus = null;
let onUpdate = (_state) => {}; // callback externe

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

export async function connectKemo() {
  if (!('bluetooth' in navigator)) throw new Error('Web Bluetooth non supporté');
  // Filtre sur le préfixe de nom que tu as mis dans le firmware ("Kemo-...")
  // On essaie d'abord les filtres stricts (production). Si aucun appareil
  // n'est sélectionné / trouvé, on propose un fallback de debug avec
  // acceptAllDevices pour aider au diagnostic.
  const filterOptions = {
    filters: [{ namePrefix: 'Kemo-' }],
    optionalServices: [SVC_HRS, SVC_KEMO]
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
      optionalServices: [SVC_HRS, SVC_KEMO]
    });
  }

  device.addEventListener('gattserverdisconnected', () => {
    onUpdate({ connected: false });
  });

  server = await device.gatt.connect();

  // --- HRS (BPM) ---
  const hrs = await server.getPrimaryService(SVC_HRS);
  hrmm = await hrs.getCharacteristic(CH_HRMM);
  await hrmm.startNotifications();
  hrmm.addEventListener('characteristicvaluechanged', (ev) => {
    const { bpm, sensorContactDetected } = parseHRM(ev.target.value);
    // Convention: si pas de contact ou bpm==0 => null
    const bpmVal = sensorContactDetected && bpm > 0 ? bpm : null;
    onUpdate({ bpm: bpmVal });
  });

  // --- KEMO (SpO2 + status) ---
  const kemo = await server.getPrimaryService(SVC_KEMO);
  chSpO2 = await kemo.getCharacteristic(CH_SPO2);
  chStatus = await kemo.getCharacteristic(CH_STATUS);

  await chSpO2.startNotifications();
  await chStatus.startNotifications();

  let spo2Valid = false;

  chStatus.addEventListener('characteristicvaluechanged', (ev) => {
    spo2Valid = ev.target.value.getUint8(0) === 1;
    // on n’émet pas ici: on attend la valeur spo2 pour un update cohérent
  });

  chSpO2.addEventListener('characteristicvaluechanged', (ev) => {
    const v = ev.target.value.getUint8(0);
    const spo2 = (spo2Valid && v !== 255) ? v : null; // 255 = none
    onUpdate({ spo2 });
  });

  onUpdate({ connected: true });
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
