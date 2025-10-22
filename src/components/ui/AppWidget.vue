<template>
  <div 
    ref="widgetElement"
    class="app-widget"
    :style="widgetStyle"
  >
    <div class="widget-shape widget-style widget-border">
      <!-- Header -->
      <header v-if="$slots.header" class="widget-header">
        <slot name="header" />
      </header>

      <!-- Content -->
      <div class="widget-content">
        <slot />
      </div>

      <!-- Footer -->
      <footer v-if="$slots.footer" class="widget-footer">
        <slot name="footer" />
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// ============================================================================
// PROPS
// ============================================================================

const props = defineProps({
  // Largeur en colonnes (combien de cellules de largeur)
  width: {
    type: Number,
    default: 1,
    validator: (value) => value >= 1 && value <= 4
  },
  // Hauteur en lignes (combien de cellules de hauteur)
  height: {
    type: Number,
    default: 1,
    validator: (value) => value >= 1 && value <= 4
  },
  // Variants optionnels pour le style
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'minimal', 'compact'].includes(value)
  },
  // Taille optionnelle
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  // Arrondi
  rounded: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'full', 'none'].includes(value)
  }
})

// ============================================================================
// COMPUTED
// ============================================================================

const widgetElement = ref(null)

// Style dynamique pour occuper plusieurs cellules de la grille
const widgetStyle = computed(() => {
  return {
    gridColumn: `span ${props.width}`,
    gridRow: `span ${props.height}`
  }
})

// ============================================================================
// EXPOSE
// ============================================================================

defineExpose({
  widgetElement
})
</script>

<style scoped>
@reference "tailwindcss";
/* Container du widget qui occupe les cellules de la grille */
.app-widget {
  position: relative;
  width: 100%;
  height: 100%;
  display: block;
}

/* Le widget-shape remplit complètement son conteneur */
.widget-shape {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
}

/* Styles pour le contenu du widget */
.widget-style {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.widget-border {
  @apply border-2 border-gray-100/25 dark:border-gray-700/50;
}

.widget-header {
  @apply px-4 py-3 border-b border-gray-700;
  flex-shrink: 0;
}

.widget-content {
  flex: 1;
  overflow: hidden;
  min-height: 0;
  display: flex;
  flex-direction: column;
  position: relative;
}

.widget-footer {
  @apply px-4 py-3 border-t border-gray-700;
  flex-shrink: 0;
}

/* Responsive */
@media (max-width: 640px) {
  .widget-header,
  .widget-footer {
    @apply px-3 py-2;
  }
}
</style>
