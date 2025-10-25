# Bluetooth Setup - Kemo App

## 📡 Vue d'ensemble

L'intégration Bluetooth permet à votre PWA de se connecter à un appareil ESP32 "Kemo" pour recevoir des données de santé en temps réel (BPM et SpO₂).

## 🎯 Composants créés

### 1. **VitalsDisplay.vue** - Widget d'affichage
- **Localisation**: `src/components/widget/_HEALTH/VitalsDisplay.vue`
- **Fonction**: Affiche les valeurs BPM et SpO₂ au centre
- **Interaction**: Cliquez sur le widget pour ouvrir le modal de connexion

### 2. **BluetoothConnect.vue** - Modal de connexion
- **Localisation**: `src/components/modals/BluetoothConnect.vue`
- **Fonction**: Gère la connexion/déconnexion Bluetooth
- **Features**:
  - Bouton de connexion/déconnexion
  - Affichage du statut de connexion
  - Messages d'erreur informatifs
  - Informations de compatibilité

### 3. **useVitals.ts** - Store Pinia
- **Localisation**: `src/stores/useVitals.ts`
- **État**: `connected`, `bpm`, `spo2`
- **Action**: `update()` pour mettre à jour les valeurs

### 4. **bleKemo.js** - Gestion Bluetooth
- **Localisation**: `src/utils/bleKemo.js`
- **Fonctions principales**:
  - `connectKemo()` - Initie la connexion BLE
  - `disconnectKemo()` - Déconnecte l'appareil
  - `setUpdateHandler()` - Configure le callback pour les mises à jour

## 🔧 Configuration ESP32

### UUIDs requis
Assurez-vous que votre firmware ESP32 utilise ces UUIDs :

**Service Heart Rate Standard (0x180D)**
- Characteristic: `heart_rate_measurement` (0x2A37)

**Service Custom Kemo**
- Service UUID: `5b3a0001-8c3a-4b1c-9a5e-8b8d9a0f0001`
- SpO2 Characteristic: `5b3a0002-8c3a-4b1c-9a5e-8b8d9a0f0001`
- Status Characteristic: `5b3a0003-8c3a-4b1c-9a5e-8b8d9a0f0001`

### Nom de l'appareil
Le nom Bluetooth de votre ESP32 **doit commencer par "Kemo-"** (ex: "Kemo-001", "Kemo-Medical", etc.)

## 🌐 Compatibilité navigateurs

### ✅ Supporté
- **Chrome** (Desktop & Android)
- **Edge** (Desktop & Android)
- **Opera** (Desktop & Android)

### ⚠️ Limitations
- **Safari/iOS**: Support très limité ou absent
- **Firefox**: Pas de support Web Bluetooth natif

### 🔒 Prérequis
- **HTTPS requis** (ou `localhost` pour le développement)
- **Geste utilisateur** : La connexion doit être initiée par un clic/tap

## 🚀 Utilisation

### 1. Démarrage de l'application
```bash
npm run dev
```

### 2. Connexion à l'ESP32
1. Accédez au dashboard
2. Cliquez sur le widget **VitalsDisplay**
3. Dans le modal, cliquez sur **"Connect Device"**
4. Sélectionnez votre appareil Kemo dans la popup du navigateur
5. Les données commencent à s'afficher automatiquement

### 3. Déconnexion
1. Cliquez à nouveau sur le widget ou
2. Ouvrez le modal et cliquez sur **"Disconnect"**

## 🧪 Test de compatibilité

### Dans la console du navigateur :
```javascript
// Vérifier le support Web Bluetooth
if ('bluetooth' in navigator) {
  console.log('✅ Web Bluetooth supporté');
} else {
  console.log('❌ Web Bluetooth non supporté');
}
```

## 📱 Déploiement PWA

### Pour tester en production :
1. Déployez votre app sur un serveur HTTPS
2. Installez la PWA sur votre appareil
3. Assurez-vous que le navigateur sous-jacent supporte Web Bluetooth

### Exemple de configuration HTTPS locale (avec vite) :
```javascript
// vite.config.js
export default {
  server: {
    https: true, // Active HTTPS en dev
  }
}
```

## 🐛 Dépannage

### "Web Bluetooth non supporté"
- Vérifiez que vous utilisez Chrome/Edge
- Assurez-vous d'être en HTTPS (ou localhost)

### "No device found"
- Vérifiez que l'ESP32 est allumé
- Confirmez que le nom commence par "Kemo-"
- Assurez-vous que l'ESP32 n'est pas déjà connecté à un autre appareil

### "Connection must be initiated by user interaction"
- La connexion BLE doit être déclenchée par un clic utilisateur
- Ne tentez pas de connexion automatique au chargement de la page

### Valeurs "--" affichées
- L'appareil est connecté mais ne reçoit pas de données valides
- Vérifiez que les capteurs sont bien positionnés sur l'ESP32
- Consultez les logs de l'ESP32 pour vérifier l'envoi des données

## 📊 Format des données

### BPM (Battements par minute)
- **Type**: `number | null`
- **Plage**: 0-220 (valeurs typiques: 60-100)
- **null**: Pas de contact détecté ou données invalides

### SpO₂ (Saturation en oxygène)
- **Type**: `number | null`
- **Plage**: 0-100 (valeurs typiques: 95-100)
- **null**: Données invalides ou capteur non détecté

## 🔄 Architecture

```
User Click (Widget)
    ↓
openModal('BluetoothConnect')
    ↓
BluetoothConnect.vue
    ↓
connectKemo() [bleKemo.js]
    ↓
navigator.bluetooth.requestDevice()
    ↓
ESP32 Connection
    ↓
Notifications BLE
    ↓
setUpdateHandler() callback
    ↓
useVitals.update()
    ↓
VitalsDisplay.vue (reactive update)
```

## 📝 Notes importantes

1. **Connexion persistante**: La connexion BLE reste active même si vous fermez le modal
2. **Reconnexion**: Si la connexion est perdue, vous devrez vous reconnecter manuellement
3. **Performance**: Les notifications BLE sont légères et n'impactent pas les performances
4. **Batterie**: Une connexion BLE active consomme de la batterie (ESP32 et appareil mobile)

## 🎨 Personnalisation

### Modifier les couleurs du widget
Éditez `/src/components/widget/_HEALTH/VitalsDisplay.vue` :
```css
.vital-value {
  color: rgba(243, 244, 246, 1); /* Changez cette couleur */
}
```

### Ajouter plus de métriques
1. Ajoutez les caractéristiques dans `bleKemo.js`
2. Étendez le store `useVitals.ts`
3. Mettez à jour `VitalsDisplay.vue` pour afficher les nouvelles données

## 📚 Ressources

- [Web Bluetooth API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API)
- [Web Bluetooth Spec](https://webbluetoothcg.github.io/web-bluetooth/)
- [ESP32 BLE Examples](https://github.com/espressif/arduino-esp32/tree/master/libraries/BLE)

---

**Créé pour Kemo App - MVP Bluetooth Integration**

