<template>
  <AppContent>
    <!-- Overview Dashboard - Mix of key widgets -->
    
    <!-- ECG original -->
    <AppWidget variant="compact" size="xs" rounded="full" :width="1" :height="1">
      <ECGGraph 
        :seconds="3.5" 
        :smoothing="3" 
        :amplitude="0.35"
        vertical-align="bottom"
        auto-start 
        simulation
      />
    </AppWidget>
    
    <!-- Key health widget -->
    <AppWidget variant="compact" size="xs" :width="1" :height="1">
      <Oximeter 
        :seconds="3.5"
        :smoothing="2"
        :amplitude="0.35"
        vertical-align="bottom"
        offset="0"
        auto-start
        simulation
        :show-pulse="true"
      />
    </AppWidget>
    
    <!-- Vitals Display - Nouveau widget BLE -->
    <VitalsDisplay />
    
    <!-- Robot emotion -->
    <EmotionAVE />
    
    <!-- Steps -->
    <Steps />
    
    <!-- System overview -->
    <Stats />
    
    <!-- Weather -->
    <WeatherCompact />
    
    <!-- Robot status -->
    <Battery />
    <Connection />
    
    <!-- Activities -->
    <Activity />
    <Calendar />
    
  </AppContent>
</template>

<script setup>
import AppContent from "@/components/layout/AppContent.vue"
import AppWidget from "@/components/ui/AppWidget.vue"
import ECGGraph from "@/components/widget/_ECG/ECGGraph.vue"
import Stats from "@/components/widget/_STATS/Stats.vue"
import Oximeter from "@/components/widget/_HEALTH/Oximeter.vue"
import Steps from "@/components/widget/_HEALTH/Steps.vue"
import VitalsDisplay from "@/components/widget/_HEALTH/VitalsDisplay.vue"
import EmotionAVE from "@/components/widget/_ROBOT/EmotionAVE.vue"
import Battery from "@/components/widget/_ROBOT/Battery.vue"
import Connection from "@/components/widget/_ROBOT/Connection.vue"
import WeatherCompact from "@/components/widget/_WEATHER/WeatherCompact.vue"
import Activity from "@/components/widget/_ACTIVITY/Activity.vue"
import Calendar from "@/components/widget/_CALENDAR/Calendar.vue"
</script>

