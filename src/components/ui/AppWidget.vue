<template>
  <div class="widget-shape widget-style p-md m-md" :class="widgetClasses">
    <!-- Header -->
    <header v-if="$slots.header" class="app-widget-header">
      <slot name="header" />
    </header>

    <!-- Content -->
    <div class="app-widget-content">
      <slot />
    </div>

    <!-- Footer -->
    <footer v-if="$slots.footer" class="app-widget-footer">
      <slot name="footer" />
    </footer>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'compact', 'minimal'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  rounded: {
    type: String,
    default: 'xl',
    validator: (value) => ['none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full'].includes(value)
  },
  shadow: {
    type: String,
    default: 'sm',
    validator: (value) => ['none', 'sm', 'md', 'lg', 'xl', '2xl'].includes(value)
  },
  border: {
    type: Boolean,
    default: true
  }
})

const widgetClasses = computed(() => {
  const classes = ['app-widget']
  
  // Variant styles
  classes.push(`app-widget--${props.variant}`)
  
  // Size styles
  classes.push(`app-widget--${props.size}`)
  
  return classes.join(' ')
})
</script>


