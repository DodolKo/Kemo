<template>
  <AppContent>
    <!-- Overview Dashboard - Mix of key widgets -->
    
    <!-- ECG original -->
    <AppWidget variant="compact" size="xs" rounded="full" :width="1" :height="2">
      <ECGGraph 
        :seconds="0.75" 
        :smoothing="3" 
        :amplitude="0.28"
        vertical-align="bottom"
        auto-start 
        simulation
      />
    </AppWidget>
    
    <!-- Key health widget -->
    <AppWidget variant="compact" size="lg" :width="1" :height="1">
      <Oximeter auto-start simulation />
    </AppWidget>
    
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
import EmotionAVE from "@/components/widget/_ROBOT/EmotionAVE.vue"
import Battery from "@/components/widget/_ROBOT/Battery.vue"
import Connection from "@/components/widget/_ROBOT/Connection.vue"
import WeatherCompact from "@/components/widget/_WEATHER/WeatherCompact.vue"
import Activity from "@/components/widget/_ACTIVITY/Activity.vue"
import Calendar from "@/components/widget/_CALENDAR/Calendar.vue"
</script>

