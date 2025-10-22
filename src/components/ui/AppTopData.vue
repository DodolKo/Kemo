<template>
    <div class="frame-shape frame-style m-lg px-2">
        <!-- Icône menu en haut à droite -->
        <div class="absolute right-2 z-10">
            <AppButton 
                icon-only="grid"
                variant="ghost"
                size="sm"
                icon-size="sm"
                @click="() => console.log('Menu clicked')"
            />
        </div>
        
        <!-- Contenu principal -->
        <div class="flex flex-col space-y-2 pt-8">
            <!-- Salutation -->
            <div class="flex items-baseline">
                <span class="text-primary text-lg font-normal ml-1">Hey, </span>
                <span class="text-branding text-lg font-semibold ml-1">{{ userPseudo }}!</span>
            </div>
            
            <!-- Date et heure -->
            <DateTime :date="true" :time="true" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DateTime from './DateTime.vue'
import AppButton from './AppButton.vue'

const userPseudo = ref<string>('')

// Charger les données utilisateur
const loadUserData = async () => {
  try {
    const response = await fetch('/user.json')
    const userData = await response.json()
    userPseudo.value = userData.pseudo
  } catch (error) {
    console.error('Erreur lors du chargement des données utilisateur:', error)
    userPseudo.value = 'Utilisateur'
  }
}

onMounted(() => {
  loadUserData()
})
</script>

<style>
    @import "tailwindcss";
</style>