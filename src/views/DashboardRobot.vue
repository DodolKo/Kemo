<template>
  <AppContent>
    <!-- Robot Dashboard - Kemo-specific widgets -->
    
    <!-- Personality & Emotions -->
    <PersonalityOCEAN />
    <EmotionAVE />
    
    <!-- Sensors & Recognition -->
    <GazeTracking />
    <FaceRecognition />
    
    <!-- Activity & Energy -->
    <MotionActivity />
    <EnergyTimeline />
    
    <!-- Basic status -->
    <Emotion />
    <Battery />
    <Connection />
    
    <!-- Sensors -->
    <Distance />
    <Light />
    <Sound />
    <Uptime />
    
    <!-- Voice -->
    <VoiceCommand />
    
  </AppContent>
</template>

<script setup>
import AppContent from "@/components/layout/AppContent.vue"
import PersonalityOCEAN from "@/components/widget/_ROBOT/PersonalityOCEAN.vue"
import EmotionAVE from "@/components/widget/_ROBOT/EmotionAVE.vue"
import GazeTracking from "@/components/widget/_ROBOT/GazeTracking.vue"
import FaceRecognition from "@/components/widget/_ROBOT/FaceRecognition.vue"
import MotionActivity from "@/components/widget/_ROBOT/MotionActivity.vue"
import EnergyTimeline from "@/components/widget/_ROBOT/EnergyTimeline.vue"
import Emotion from "@/components/widget/_ROBOT/Emotion.vue"
import Battery from "@/components/widget/_ROBOT/Battery.vue"
import Connection from "@/components/widget/_ROBOT/Connection.vue"
import Distance from "@/components/widget/_ROBOT/Distance.vue"
import Light from "@/components/widget/_ROBOT/Light.vue"
import Sound from "@/components/widget/_ROBOT/Sound.vue"
import Uptime from "@/components/widget/_ROBOT/Uptime.vue"
import VoiceCommand from "@/components/widget/_ROBOT/VoiceCommand.vue"
</script>

