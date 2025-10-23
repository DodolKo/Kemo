<template>
  <AppContent>
    <!-- Tools Dashboard - Productivity widgets -->
    
    <Timer />
    <Progress />
    <Notification />
    <Calendar />
    <Activity />
    <QuickActions />
    
  </AppContent>
</template>

<script setup>
import AppContent from "@/components/layout/AppContent.vue"
import Timer from "@/components/widget/_TIMER/Timer.vue"
import Progress from "@/components/widget/_PROGRESS/Progress.vue"
import Notification from "@/components/widget/_NOTIFICATION/Notification.vue"
import Calendar from "@/components/widget/_CALENDAR/Calendar.vue"
import Activity from "@/components/widget/_ACTIVITY/Activity.vue"
import QuickActions from "@/components/widget/_QUICKACTIONS/QuickActions.vue"
</script>

