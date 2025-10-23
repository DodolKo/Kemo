<template>
  <AppContent>
    <!-- Health Dashboard - All health widgets -->
    
    <!-- ECG -->
    <AppWidget variant="compact" size="xs" rounded="full" :width="2" :height="1">
      <ECGGraph 
        :seconds="4.5" 
        :smoothing="5" 
        :amplitude="0.35"
        vertical-align="bottom"
        offset="64"
        auto-start 
        simulation
      />
    </AppWidget>
    
    <AppWidget variant="compact" size="lg" :width="2" :height="1">
      <Oximeter 
        :seconds="4.5"
        :smoothing="2"
        :amplitude="0.35"
        vertical-align="bottom"
        offset="64"
        auto-start
        simulation
        :show-pulse="true"
      />
    </AppWidget>
    
    <AppWidget variant="compact" size="lg" :width="1" :height="1">
      <BloodPressure />
    </AppWidget>
    
    <AppWidget variant="compact" size="lg" :width="1" :height="1">
      <BodyTemperature />
    </AppWidget>
    
    <AppWidget variant="compact" size="lg" :width="1" :height="1">
      <RespiratoryRate />
    </AppWidget>
    
    <!-- Activity -->
    <Steps />
    
    <!-- History -->
    <Activity />
    
  </AppContent>
</template>

<script setup>
import AppContent from "@/components/layout/AppContent.vue"
import AppWidget from "@/components/ui/AppWidget.vue"
import ECGGraph from "@/components/widget/_ECG/ECGGraph.vue"
import Oximeter from "@/components/widget/_HEALTH/Oximeter.vue"
import BloodPressure from "@/components/widget/_HEALTH/BloodPressure.vue"
import BodyTemperature from "@/components/widget/_HEALTH/BodyTemperature.vue"
import RespiratoryRate from "@/components/widget/_HEALTH/RespiratoryRate.vue"
import Steps from "@/components/widget/_HEALTH/Steps.vue"
import Activity from "@/components/widget/_ACTIVITY/Activity.vue"
</script>

