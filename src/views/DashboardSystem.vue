<template>
  <AppContent>
    <!-- System Dashboard - Performance & Environment -->
    
    <!-- Overview -->
    <Stats />
    
    <!-- Individual metrics -->
    <CPU />
    <RAM />
    <Disk />
    <Temp />
    
    <!-- Weather -->
    <Weather />
    <WeatherCompact />
    
  </AppContent>
</template>

<script setup>
import AppContent from "@/components/layout/AppContent.vue"
import Stats from "@/components/widget/_STATS/Stats.vue"
import CPU from "@/components/widget/_STATS/CPU.vue"
import RAM from "@/components/widget/_STATS/RAM.vue"
import Disk from "@/components/widget/_STATS/Disk.vue"
import Temp from "@/components/widget/_STATS/Temp.vue"
import Weather from "@/components/widget/_WEATHER/Weather.vue"
import WeatherCompact from "@/components/widget/_WEATHER/WeatherCompact.vue"
</script>

