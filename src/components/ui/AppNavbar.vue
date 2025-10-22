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
                    @click="activeTab = tab.id"
                />
            </li>
        </ul>
    </nav>
</template>



<script setup>
import { ref, computed } from 'vue'
import AppButton from './AppButton.vue'

const activeTab = ref('home')

// Configuration commune pour tous les boutons
const buttonConfig = {
  variant: 'primary',
  size: 'sm',
  iconSize: 'sm'
}

// Configuration des onglets
const tabs = [
  { id: 'home', icon: 'home', text: 'Home' },
  { id: 'heart', icon: 'heart', text: 'Heart' },
  { id: 'chart', icon: 'chart-bar', text: 'Stats' },
  { id: 'settings', icon: 'settings', text: 'Settings' }
]
</script>




<style>

</style>