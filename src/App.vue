<script setup>
import AppHeader from "@/components/layout/AppHeader.vue"
import AppFooter from "@/components/layout/AppFooter.vue"

import { RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen flex flex-col items-center bg-gray-200 dark:bg-gray-800">
    <AppHeader />
    
    <RouterView />

    <AppFooter />
  </div>
</template>

