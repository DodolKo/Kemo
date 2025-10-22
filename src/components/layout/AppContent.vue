<template>
  <main class="layout-content bg-green-500/0">
    <AppGrid :columns="2" gap="xs" responsive>
      <slot />
    </AppGrid>
  </main>
</template>

<script setup>
import AppGrid from './AppGrid.vue'
// minimal content wrapper using bg-{color}-500/25
</script>

<style scoped>
/* layout delegated to Tailwind */
</style>


