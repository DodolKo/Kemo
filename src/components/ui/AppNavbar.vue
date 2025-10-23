<template>
    <nav class="frame-shape frame-style m-lg px-2">
        <ul class="navbar-layout">
            <li v-for="tab in tabs" :key="tab.id">
                <AppButton 
                    :icon-only="activeTab !== tab.id ? tab.icon : ''"
                    :icon-left="activeTab === tab.id ? tab.icon : ''"
                    :text="activeTab === tab.id ? tab.text : ''"
                    :variant="buttonConfig.variant"
                    :size="buttonConfig.size"
                    :icon-size="buttonConfig.iconSize"
                    @click="navigateToRoute(tab.id)"
                />
            </li>
        </ul>
    </nav>
</template>



<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import AppButton from './AppButton.vue'

const router = useRouter()
const route = useRoute()

// Configuration commune pour tous les boutons
const buttonConfig = {
  variant: 'primary',
  size: 'sm',
  iconSize: 'sm'
}

// Configuration des onglets avec leurs routes correspondantes
const tabs = [
  { id: 'home', icon: 'home', text: 'Home', route: '/' },
  { id: 'heart', icon: 'heart', text: 'Heart', route: '/health' },
  { id: 'chart', icon: 'chart-bar', text: 'Stats', route: '/system' },
  { id: 'settings', icon: 'settings', text: 'Settings', route: '/tools' }
]

// Computed pour déterminer l'onglet actif basé sur la route actuelle
const activeTab = computed(() => {
  const currentPath = route.path
  const currentTab = tabs.find(tab => tab.route === currentPath)
  return currentTab ? currentTab.id : 'home'
})

// Fonction pour naviguer vers une route
const navigateToRoute = (tabId) => {
  const tab = tabs.find(t => t.id === tabId)
  if (tab) {
    router.push(tab.route)
  }
}
</script>




<style>

</style>