import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useDateTimeStore = defineStore('dateTime', () => {
  const currentDate = ref(new Date())
  
  // Mise à jour automatique de la date/heure
  const updateDateTime = () => {
    currentDate.value = new Date()
  }
  
  // Formatage de la date selon le style de l'image
  const formattedDate = computed(() => {
    const date = currentDate.value
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    }
    return date.toLocaleDateString('fr-FR', options)
  })
  
  // Formatage de l'heure
  const formattedTime = computed(() => {
    const date = currentDate.value
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  })
  
  // Formatage complet date + heure
  const formattedDateTime = computed(() => {
    return `${formattedDate.value} - ${formattedTime.value}`
  })
  
  // Démarrer la mise à jour automatique
  const startAutoUpdate = () => {
    // Mise à jour toutes les secondes
    setInterval(updateDateTime, 1000)
  }
  
  return {
    currentDate,
    formattedDate,
    formattedTime,
    formattedDateTime,
    updateDateTime,
    startAutoUpdate
  }
})
