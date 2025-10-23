<script setup>
import AppHeader from "@/components/layout/AppHeader.vue"
import AppContent from "@/components/layout/AppContent.vue"
import AppFooter from "@/components/layout/AppFooter.vue"

import AppWidget from "@/components/ui/AppWidget.vue"
import ECGGraph from "@/components/widget/_ECG/ECGGraph.vue"

// Import des nouveaux widgets
import Stats from "@/components/widget/_STATS/Stats.vue"

// Widgets individuels pour métriques système
import CPU from "@/components/widget/_STATS/CPU.vue"
import RAM from "@/components/widget/_STATS/RAM.vue"
import Disk from "@/components/widget/_STATS/Disk.vue"
import Temp from "@/components/widget/_STATS/Temp.vue"

import Weather from "@/components/widget/_WEATHER/Weather.vue"
import Timer from "@/components/widget/_TIMER/Timer.vue"
import Progress from "@/components/widget/_PROGRESS/Progress.vue"
import Notification from "@/components/widget/_NOTIFICATION/Notification.vue"
import Calendar from "@/components/widget/_CALENDAR/Calendar.vue"
import Activity from "@/components/widget/_ACTIVITY/Activity.vue"
import QuickActions from "@/components/widget/_QUICKACTIONS/QuickActions.vue"

</script>

<template>
  <div class="min-h-screen flex flex-col items-center bg-gray-200 dark:bg-gray-800">
    <AppHeader  />
    
    <AppContent>

      <!-- Ton ECG Widget original -->
      <AppWidget 
        variant="compact" 
        size="xs"
        rounded="full"
        :width="1"
        :height="2"
      >
        <ECGGraph 
          :seconds="0.75" 
          :smoothing="3" 
          :amplitude="0.28"
          vertical-align="bottom"
          auto-start 
          simulation
        />
      </AppWidget>

      <!-- Tes AppWidget vides -->
      <AppWidget 
        variant="compact" 
        size="xs"
        rounded="full"
        :width="2"
        :height="1"
      />

      <AppWidget 
        variant="compact" 
        size="xs"
        rounded="full"
        :width="2"
        :height="2"
      />

      <!-- Nouveaux widgets créés -->
      
      <!-- System Monitor - Widget principal (garde pour comparaison) -->
      <Stats />
      
      <!-- Widgets individuels avec jauges circulaires -->
      <CPU />
      <RAM />
      <Disk />
      <Temp />
      
      <!-- Autres widgets -->
      <Weather />
      <Timer />
      <Progress />
      <Notification />
      <Calendar />
      <Activity />
      <QuickActions />

    </AppContent>

    <AppFooter />
  </div>
</template>

