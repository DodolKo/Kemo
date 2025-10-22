<template>
  <div ref="gridElement" class="app-grid" :class="gridClasses">
    <slot />
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'

const gridElement = ref(null)

const props = defineProps({
  // Nombre de colonnes (2 à 4)
  columns: {
    type: Number,
    default: 2,
    validator: (value) => value >= 2 && value <= 4
  },
  // Nombre de lignes minimum (la grille peut s'étendre automatiquement)
  rows: {
    type: Number,
    default: undefined // Pas de limite, la grille s'étend automatiquement
  },
  // Espacement entre les éléments
  gap: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  // Responsive breakpoints
  responsive: {
    type: Boolean,
    default: true
  }
})

const gridClasses = computed(() => {
  const classes = ['grid']

  // Gap
  const gapMap = {
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8'
  }
  classes.push(gapMap[props.gap])

  // Auto-flow pour remplir les espaces vides
  classes.push('grid-flow-dense')

  // Colonnes responsives — deux widgets côte à côte sur mobile
  if (props.responsive) {
    // Mobile: 2 cols, Small/Medium increase selon props.columns
    classes.push('grid-cols-2')               // mobile par défaut (2 widgets côte à côte)
    if (props.columns >= 3) classes.push('sm:grid-cols-3')
    if (props.columns >= 4) classes.push('md:grid-cols-4')
  } else {
    // Fixe
    classes.push(`grid-cols-${props.columns}`)
  }

  // Grille avec lignes automatiques (pas de limite)

  return classes.join(' ')
})

// Fonction pour calculer la hauteur des lignes pour maintenir le ratio 1:1
function updateRowHeight() {
  if (!gridElement.value) return
  
  const gapPixels = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32
  }[props.gap]
  
  const gridWidth = gridElement.value.offsetWidth
  const columns = props.columns
  const totalGap = gapPixels * (columns - 1)
  const cellWidth = (gridWidth - totalGap) / columns
  
  // Appliquer la hauteur calculée
  gridElement.value.style.gridAutoRows = `${cellWidth}px`
}

// Observer les changements de taille
let resizeObserver = null

onMounted(() => {
  updateRowHeight()
  
  resizeObserver = new ResizeObserver(() => {
    updateRowHeight()
  })
  
  if (gridElement.value) {
    resizeObserver.observe(gridElement.value)
  }
})

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
})
</script>

<style scoped>
.app-grid {
  width: 100%;
  min-height: 0;
  display: grid;
  /* La hauteur des lignes est calculée dynamiquement par JS pour maintenir ratio 1:1 */
  grid-auto-rows: 150px; /* Valeur par défaut avant calcul JS */
}

/* Les widgets occupent l'espace selon leur grid-column et grid-row */
.app-grid > * {
  position: relative;
  width: 100%;
  height: 100%;
  display: block;
  overflow: hidden;
  /* Les widgets s'adaptent aux cellules qu'ils occupent */
}
</style>
