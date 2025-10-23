# 📦 Widget Library - Kemo App

Documentation complète de tous les widgets disponibles dans l'application Kemo.

---

## 📊 Widgets Système (STATS)

### Stats (2x1)
**Chemin**: `@/components/widget/_STATS/Stats.vue`  
**Taille**: 2x1  
**Description**: Vue d'ensemble des métriques système avec graphiques miniatures  
**Métriques**: CPU, RAM, Disk, Temperature  
**Props**:
- `updateInterval` (Number, default: 2000): Intervalle de mise à jour en ms
- `simulation` (Boolean, default: true): Active la simulation de données
- `autoStart` (Boolean, default: true): Démarre automatiquement

### CPU (1x1)
**Chemin**: `@/components/widget/_STATS/CPU.vue`  
**Taille**: 1x1  
**Description**: Jauge circulaire pour l'utilisation CPU  
**Couleurs dynamiques**:
- Vert (#10b981): < 50%
- Orange (#f59e0b): 50-75%
- Rouge (#ef4444): > 75%  
**Effet**: Glow dynamique qui suit la couleur

### RAM (1x1)
**Chemin**: `@/components/widget/_STATS/RAM.vue`  
**Taille**: 1x1  
**Description**: Jauge circulaire pour l'utilisation RAM  
**Couleurs dynamiques**:
- Bleu (#3b82f6): < 60%
- Orange (#f59e0b): 60-80%
- Rouge (#ef4444): > 80%  
**Effet**: Glow dynamique qui suit la couleur

### Disk (1x1)
**Chemin**: `@/components/widget/_STATS/Disk.vue`  
**Taille**: 1x1  
**Description**: Jauge circulaire pour l'utilisation disque  
**Couleurs dynamiques**:
- Violet (#8b5cf6): < 70%
- Orange (#f59e0b): 70-85%
- Rouge (#ef4444): > 85%  
**Effet**: Glow dynamique qui suit la couleur

### Temp (1x1)
**Chemin**: `@/components/widget/_STATS/Temp.vue`  
**Taille**: 1x1  
**Description**: Jauge circulaire pour la température système  
**Plage**: 30-100°C  
**Couleurs dynamiques**:
- Vert (#10b981): < 50°C
- Orange (#f59e0b): 50-70°C
- Rouge (#ef4444): > 70°C  
**Effet**: Glow dynamique qui suit la couleur

---

## 🌤️ Widgets Météo (WEATHER)

### Weather (2x1)
**Chemin**: `@/components/widget/_WEATHER/Weather.vue`  
**Taille**: 2x1  
**Description**: Widget météo complet avec détails  
**Informations**: Température, condition, humidité, vent  
**Animation**: Icône météo animée

### WeatherCompact (1x1)
**Chemin**: `@/components/widget/_WEATHER/WeatherCompact.vue`  
**Taille**: 1x1  
**Description**: Version compacte avec température et icône uniquement  
**Optimisation**: Idéal pour les petits espaces

---

## 🤖 Widgets Robot Kemo (ROBOT)

### Emotion (1x1)
**Chemin**: `@/components/widget/_ROBOT/Emotion.vue`  
**Taille**: 1x1  
**Description**: Affiche l'émotion actuelle du robot  
**Émotions**: Happy, Sad, Angry, Surprised, Neutral, etc.

### Battery (1x1)
**Chemin**: `@/components/widget/_ROBOT/Battery.vue`  
**Taille**: 1x1  
**Description**: Niveau de batterie avec barre de progression  
**Couleurs dynamiques**: Vert > Jaune > Rouge selon le niveau

### Connection (1x1)
**Chemin**: `@/components/widget/_ROBOT/Connection.vue`  
**Taille**: 1x1  
**Description**: État de la connexion (WiFi/Bluetooth)  
**États**: Connected, Disconnected, Connecting

### Distance (1x1)
**Chemin**: `@/components/widget/_ROBOT/Distance.vue`  
**Taille**: 1x1  
**Description**: Capteur de distance/proximité  
**Unité**: Centimètres (cm)

### Light (1x1)
**Chemin**: `@/components/widget/_ROBOT/Light.vue`  
**Taille**: 1x1  
**Description**: Niveau de lumière ambiante  
**Plage**: 0-100%

### Sound (1x1)
**Chemin**: `@/components/widget/_ROBOT/Sound.vue`  
**Taille**: 1x1  
**Description**: Niveau sonore ambiant  
**Unité**: Décibels (dB)

### Uptime (1x1)
**Chemin**: `@/components/widget/_ROBOT/Uptime.vue`  
**Taille**: 1x1  
**Description**: Temps de fonctionnement du robot  
**Format**: HH:MM:SS

### VoiceCommand (1x2)
**Chemin**: `@/components/widget/_ROBOT/VoiceCommand.vue`  
**Taille**: 1x2  
**Description**: Liste des commandes vocales récentes  
**Historique**: Dernières commandes avec timestamps

---

## 🧠 Widgets Avancés Kemo (ROBOT - Advanced)

### PersonalityOCEAN (2x2)
**Chemin**: `@/components/widget/_ROBOT/PersonalityOCEAN.vue`  
**Taille**: 2x2  
**Description**: Radar chart de la personnalité OCEAN  
**Traits**:
- **O**: Openness (Ouverture)
- **C**: Conscientiousness (Conscience)
- **E**: Extraversion
- **A**: Agreeableness (Amabilité)
- **N**: Neuroticism (Névrosisme)  
**Visualisation**: Polygone en toile d'araignée avec glow  
**Mise à jour**: Lente (5 secondes) pour stabilité  
**Props**:
- `updateInterval` (Number, default: 5000)
- `simulation` (Boolean, default: true)
- `autoStart` (Boolean, default: true)  
**Méthodes**:
- `setTrait(name, value)`: Définir une valeur de trait (0-100)

### EmotionAVE (2x2)
**Chemin**: `@/components/widget/_ROBOT/EmotionAVE.vue`  
**Taille**: 2x2  
**Description**: Modèle d'émotion 3D (Arousal-Valence-Endurance)  
**Dimensions**:
- **Arousal**: Niveau d'activation/énergie (0-100)
- **Valence**: Positivité/négativité (0-100)
- **Endurance**: Stamina/persistance (0-100)  
**Émotions détectées**: Excited, Happy, Calm, Alert, Neutral, Relaxed, Stressed, Sad, Tired  
**Visualisation**: Espace 2D avec cercle d'endurance  
**Couleurs dynamiques**: Selon l'émotion détectée  
**Props**:
- `updateInterval` (Number, default: 3000)
- `simulation` (Boolean, default: true)
- `autoStart` (Boolean, default: true)  
**Méthodes**:
- `setValues(arousal, valence, endurance)`: Définir les valeurs AVE

### GazeTracking (2x1)
**Chemin**: `@/components/widget/_ROBOT/GazeTracking.vue`  
**Taille**: 2x1  
**Description**: Suivi de la direction du regard  
**Directions**: Center, Up, Down, Left, Right, Top Left, Top Right, Bottom Left, Bottom Right  
**Visualisation**: Grille avec point de regard animé  
**Données**: Coordonnées X/Y (0-100%) avec niveau de confiance  
**Couleurs dynamiques**: Par direction  
**Props**:
- `updateInterval` (Number, default: 2000)
- `simulation` (Boolean, default: true)
- `autoStart` (Boolean, default: true)  
**Méthodes**:
- `setGaze(x, y)`: Définir la position du regard (0-100%)

### FaceRecognition (1x2)
**Chemin**: `@/components/widget/_ROBOT/FaceRecognition.vue`  
**Taille**: 1x2  
**Description**: Reconnaissance faciale avancée  
**Statistiques**:
- Nombre total de visages détectés
- Visages familiers vs inconnus
- Pourcentages avec pie chart  
**Liste récente**: 3 derniers visages détectés  
**Visualisation**: Graphique circulaire avec stats détaillées  
**Props**:
- `updateInterval` (Number, default: 4000)
- `simulation` (Boolean, default: true)
- `autoStart` (Boolean, default: true)  
**Méthodes**:
- `addFace(name, isFamiliar)`: Ajouter une détection de visage

### MotionActivity (2x1)
**Chemin**: `@/components/widget/_ROBOT/MotionActivity.vue`  
**Taille**: 2x1  
**Description**: Graphique d'activité de mouvement  
**Métriques**:
- Distance parcourue (mètres)
- Vitesse actuelle (m/s)
- Nombre de virages  
**États**: Idle, Moving, Walking, Running  
**Visualisation**: Graphique en temps réel avec aire remplie  
**Couleurs dynamiques**: Selon l'état d'activité  
**Props**:
- `updateInterval` (Number, default: 1500)
- `simulation` (Boolean, default: true)
- `autoStart` (Boolean, default: true)
- `maxPoints` (Number, default: 40): Points de données max  
**Méthodes**:
- `addActivity(value)`: Ajouter un point d'activité (0-100)

### EnergyTimeline (2x1)
**Chemin**: `@/components/widget/_ROBOT/EnergyTimeline.vue`  
**Taille**: 2x1  
**Description**: Timeline énergie et humeur  
**Graphiques**: Deux lignes (énergie + humeur) sur période  
**Période**: 6 heures par défaut  
**Visualisation**: Double ligne avec aires remplies  
**Couleurs**:
- Orange (#f59e0b): Énergie
- Bleu (#3b82f6): Humeur  
**Props**:
- `updateInterval` (Number, default: 2000)
- `simulation` (Boolean, default: true)
- `autoStart` (Boolean, default: true)
- `hours` (Number, default: 6): Nombre d'heures affichées  
**Méthodes**:
- `addData(energy, mood)`: Ajouter un point de données

---

## ⏱️ Widget Timer (TIMER)

### Timer (2x1)
**Chemin**: `@/components/widget/_TIMER/Timer.vue`  
**Taille**: 2x1  
**Description**: Chronomètre/compte à rebours  
**Modes**: Stopwatch, Countdown  
**Contrôles**: Start, Pause, Reset

---

## 📈 Widget Progression (PROGRESS)

### Progress (2x1)
**Chemin**: `@/components/widget/_PROGRESS/Progress.vue`  
**Taille**: 2x1  
**Description**: Suivi de progression d'objectifs  
**Visualisation**: Barre de progression avec pourcentage  
**Objectifs multiples**: Support de plusieurs objectifs simultanés

---

## 🔔 Widget Notifications (NOTIFICATION)

### Notification (1x2)
**Chemin**: `@/components/widget/_NOTIFICATION/Notification.vue`  
**Taille**: 1x2  
**Description**: Liste des notifications récentes  
**Types**: Info, Success, Warning, Error  
**Historique**: Dernières notifications avec timestamps

---

## 📅 Widget Calendrier (CALENDAR)

### Calendar (2x2)
**Chemin**: `@/components/widget/_CALENDAR/Calendar.vue`  
**Taille**: 2x2  
**Description**: Vue calendrier mensuelle  
**Fonctionnalités**: Navigation mois, événements marqués  
**Visualisation**: Grille de calendrier interactive

---

## 🎨 Widget Activité (ACTIVITY)

### Activity (2x1)
**Chemin**: `@/components/widget/_ACTIVITY/Activity.vue`  
**Taille**: 2x1  
**Description**: Heatmap d'activité (style GitHub)  
**Période**: Derniers mois  
**Visualisation**: Grille avec intensité de couleur

---

## ⚡ Widget Actions Rapides (QUICKACTIONS)

### QuickActions (2x1)
**Chemin**: `@/components/widget/_QUICKACTIONS/QuickActions.vue`  
**Taille**: 2x1  
**Description**: Boutons d'actions rapides  
**Actions**: Personnalisables avec icônes et callbacks

---

## ❤️ Widget ECG (ECG)

### ECGGraph
**Chemin**: `@/components/widget/_ECG/ECGGraph.vue`  
**Taille**: Personnalisable (1x2 par défaut)  
**Description**: Graphique ECG en temps réel  
**Fonctionnalités**:
- Détection de battements cardiaques
- Calcul BPM
- Animation fluide avec canvas  
**Props**:
- `seconds` (Number, default: 1): Durée visible
- `smoothing` (Number, default: 5): Lissage du signal
- `amplitude` (Number, default: 0.3): Amplitude des pics
- `verticalAlign` (String, default: 'center'): Alignement vertical
- `autoStart` (Boolean, default: false)
- `simulation` (Boolean, default: false)

---

## 🎯 Props Communes

La plupart des widgets partagent ces props:

- **updateInterval** (Number): Intervalle de mise à jour en millisecondes
- **simulation** (Boolean): Active le mode simulation avec données aléatoires
- **autoStart** (Boolean): Démarre automatiquement au montage du composant

## 🎨 Système de Couleurs

### Couleurs Dynamiques (Status)
- 🟢 **Vert** (#10b981): Bon état / Faible usage
- 🔵 **Bleu** (#3b82f6): Moyen / Neutre
- 🟣 **Violet** (#8b5cf6): Modéré
- 🟠 **Orange** (#f59e0b): Attention / Usage élevé
- 🔴 **Rouge** (#ef4444): Critique / Usage maximum
- ⚪ **Gris** (#9ca3af): Inactif / Neutre

### Effets Visuels
Tous les widgets avec jauges/graphiques utilisent:
- **Glow dynamique**: `drop-shadow` qui suit la couleur
- **Transitions fluides**: 0.3s à 1s selon le contexte
- **Animations**: `cubic-bezier(0.4, 0, 0.2, 1)` pour le natural motion

## 📱 Responsive Design

Tous les widgets sont optimisés pour:
- **Desktop**: Affichage complet avec tous les détails
- **Mobile**: Polices et espacements adaptés
- **Grid Layout**: S'adaptent automatiquement dans `AppContent`

## 🔧 Méthodes Exposées

Les widgets exposent généralement:
- `start()`: Démarre les mises à jour
- `stop()`: Arrête les mises à jour
- Méthodes de données spécifiques (voir détails par widget)

## 📊 Performances

### Optimisations Appliquées
- ✅ Pas d'animations rapides aléatoires (problème mobile résolu)
- ✅ Intervalles de mise à jour optimisés (1-5 secondes)
- ✅ Transitions CSS au lieu de JS
- ✅ Nettoyage automatique (`onBeforeUnmount`)
- ✅ Computed properties pour les calculs
- ✅ Props pour désactiver la simulation en production

---

## 🚀 Utilisation

### Import d'un widget
```vue
<script setup>
import CPU from '@/components/widget/_STATS/CPU.vue'
</script>

<template>
  <CPU :updateInterval="2000" simulation autoStart />
</template>
```

### Personnalisation avec AppWidget
```vue
<AppWidget variant="compact" size="lg" :width="2" :height="1">
  <MonContenu />
</AppWidget>
```

---

## 🏥 Widgets Santé (HEALTH)

### Oximeter (1x1)
**Chemin**: `@/components/widget/_HEALTH/Oximeter.vue`  
**Taille**: 1x1  
**Description**: Oxymètre de pouls (SpO2)  
**Plage**: 85-100%  
**Couleurs dynamiques**:
- Vert (#10b981): ≥ 95% - Normal
- Orange (#f59e0b): 90-94% - Low
- Rouge (#ef4444): < 90% - Critical  
**Visualisation**: Jauge circulaire avec indicateur de statut

### HeartRate (1x1)
**Chemin**: `@/components/widget/_HEALTH/HeartRate.vue`  
**Taille**: 1x1  
**Description**: Rythme cardiaque en BPM  
**Plage**: 40-180 BPM  
**Couleurs dynamiques**:
- Bleu (#3b82f6): < 60 BPM - Bradycardia
- Vert (#10b981): 60-100 BPM - Normal
- Orange (#f59e0b): 100-140 BPM - Elevated
- Rouge (#ef4444): > 140 BPM - Tachycardia  
**Animation**: Battement de cœur synchronisé avec BPM  
**Props**:
- `updateInterval` (Number, default: 1000)
- `simulation` (Boolean, default: true)
- `autoStart` (Boolean, default: true)

### BloodPressure (1x1)
**Chemin**: `@/components/widget/_HEALTH/BloodPressure.vue`  
**Taille**: 1x1  
**Description**: Pression artérielle (systolique/diastolique)  
**Valeurs**: SYS/DIA en mmHg  
**Statuts**:
- Normal: < 120/80
- Elevated: 120-129/<80
- Stage 1 Hypertension: 130-139/85-89
- Stage 2 Hypertension: 140-179/90-119
- Hypertensive Crisis: ≥ 180/120  
**Affichage**: Valeurs duales + pulse pressure + barres de progression  
**Props**:
- `updateInterval` (Number, default: 3000)
- `simulation` (Boolean, default: true)
- `autoStart` (Boolean, default: true)  
**Méthodes**:
- `setValues(systolic, diastolic)`: Définir les valeurs

### BodyTemperature (1x1)
**Chemin**: `@/components/widget/_HEALTH/BodyTemperature.vue`  
**Taille**: 1x1  
**Description**: Température corporelle en °C  
**Plage**: 35-40°C  
**Couleurs dynamiques**:
- Bleu (#3b82f6): < 36.1°C - Hypothermia
- Vert (#10b981): 36.1-37.2°C - Normal
- Orange (#f59e0b): 37.3-38.0°C - Low Fever
- Orange foncé (#fb923c): 38.1-39.0°C - Moderate Fever
- Rouge (#ef4444): > 39.0°C - High Fever  
**Visualisation**: Thermomètre avec mercure animé et échelle graduée  
**Props**:
- `updateInterval` (Number, default: 2500)
- `simulation` (Boolean, default: true)
- `autoStart` (Boolean, default: true)

### RespiratoryRate (1x1)
**Chemin**: `@/components/widget/_HEALTH/RespiratoryRate.vue`  
**Taille**: 1x1  
**Description**: Fréquence respiratoire  
**Plage**: 8-30 breaths/min  
**Couleurs dynamiques**:
- Bleu (#3b82f6): < 12 - Bradypnea
- Vert (#10b981): 12-20 - Normal
- Orange (#f59e0b): 20-25 - Elevated
- Rouge (#ef4444): > 25 - Tachypnea  
**Visualisation**: Forme de poumon avec animation de respiration  
**Animation**: Cycle de respiration synchronisé avec la fréquence  
**Props**:
- `updateInterval` (Number, default: 2000)
- `simulation` (Boolean, default: true)
- `autoStart` (Boolean, default: true)

### Steps (2x1)
**Chemin**: `@/components/widget/_HEALTH/Steps.vue`  
**Taille**: 2x1  
**Description**: Podomètre avec tracking d'activité  
**Métriques**:
- Nombre de pas avec objectif
- Distance parcourue (km)
- Calories brûlées (kcal)
- Minutes actives  
**Visualisation**: Compteur principal + anneau de progression + grille de stats  
**Couleurs dynamiques**: Selon le % de l'objectif atteint  
**Props**:
- `updateInterval` (Number, default: 3000)
- `simulation` (Boolean, default: true)
- `autoStart` (Boolean, default: true)
- `dailyGoal` (Number, default: 10000)  
**Méthodes**:
- `addSteps(count)`: Ajouter des pas
- `reset()`: Réinitialiser le compteur

---

## 🗺️ Navigation & Dashboards

### Structure des Dashboards
L'application utilise **Vue Router** pour naviguer entre différents dashboards catégorisés :

#### 🏠 Home Dashboard
**Route**: `/`  
**Description**: Vue d'ensemble avec widgets clés  
**Widgets**: ECG, HeartRate, Oximeter, EmotionAVE, Steps, Stats, WeatherCompact, Battery, Connection, Activity, Calendar

#### 🏥 Health Dashboard
**Route**: `/health`  
**Description**: Tous les widgets santé  
**Widgets**: ECG, HeartRate, Oximeter, BloodPressure, BodyTemperature, RespiratoryRate, Steps, Activity

#### 🤖 Robot Dashboard
**Route**: `/robot`  
**Description**: Widgets spécifiques à Kemo  
**Widgets**: PersonalityOCEAN, EmotionAVE, GazeTracking, FaceRecognition, MotionActivity, EnergyTimeline, Emotion, Battery, Connection, Distance, Light, Sound, Uptime, VoiceCommand

#### 💻 System Dashboard
**Route**: `/system`  
**Description**: Métriques système et environnement  
**Widgets**: Stats, CPU, RAM, Disk, Temp, Weather, WeatherCompact

#### ⚡ Tools Dashboard
**Route**: `/tools`  
**Description**: Outils de productivité  
**Widgets**: Timer, Progress, Notification, Calendar, Activity, QuickActions

### AppNav Component
**Chemin**: `@/components/layout/AppNav.vue`  
**Description**: Navigation bottom bar (mobile) / top bar (desktop)  
**Features**:
- Navigation tactile optimisée mobile
- Icônes émojis pour chaque catégorie
- Indicateur visuel pour la page active
- Responsive (bottom mobile, sticky top desktop)

---

## 🎨 Nouveautés Design

### EmotionAVE Redesign
Le widget **EmotionAVE** a été complètement redesigné avec :
- **Circumplex Model**: Visualisation 2D Arousal-Valence
- **Badge d'intensité émotionnelle**: Pourcentage basé sur la distance du centre
- **Quadrants colorés**: Gradients radiaux pour chaque zone émotionnelle
- **Ring d'endurance**: Épaisseur dynamique selon l'endurance
- **Cards métriques**: 3 cartes avec icônes, valeurs et barres de progression
- **Détection d'émotion**: 12 états émotionnels (Excited, Happy, Content, Calm, Alert, Neutral, Relaxed, Peaceful, Stressed, Anxious, Sad, Tired)

---

## 📱 Mobile-First Design

### Optimisations Mobile
Tous les widgets sont conçus **mobile-first** avec :
- **Responsive breakpoints**: 640px (mobile), 768px (tablet), 1024px+ (desktop)
- **Safe areas**: Support des notches et barres système
- **Touch-friendly**: Tailles de boutons/zones tactiles optimisées (44x44px min)
- **Bottom navigation**: Navigation fixe en bas sur mobile
- **Polices adaptatives**: Tailles qui s'adaptent à chaque breakpoint
- **Grid flexible**: Layout qui s'adapte automatiquement

### AppContent Spacing
Le composant `AppContent` gère automatiquement :
- Padding top pour le header fixe
- **Padding bottom** pour la navigation mobile (24px sur mobile, 20px sur desktop)
- Safe area insets pour iOS

---

**Total des widgets**: 35 widgets  
**Dashboards**: 5 catégories  
**Dernière mise à jour**: 2025  
**Auteur**: Kemo App Team 🤖

