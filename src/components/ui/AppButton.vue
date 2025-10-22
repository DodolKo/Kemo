<template>
  <component 
    :is="buttonComponent"
    :class="buttonClasses"
    :disabled="disabled"
    :aria-label="ariaLabel"
    @click="handleClick"
    @mouseenter="isHovered = true; $emit('mouseenter', $event)"
    @mouseleave="isHovered = false; $emit('mouseleave', $event)"
    @focus="isFocused = true; $emit('focus', $event)"
    @blur="isFocused = false; $emit('blur', $event)"
  >
    <!-- Mode icône seule -->
    <AppIcon 
      v-if="iconOnly" 
      :name="iconOnly" 
      :size="iconSize" 
      :active="iconActive" 
      class="icon" 
    />
    
    <!-- Mode avec contenu -->
    <template v-else>
      <AppIcon 
        v-if="iconLeft" 
        :name="iconLeft" 
        :size="iconSize" 
        :active="iconActive" 
        class="icon mr-2" 
      />
      
      <span 
        v-if="text" 
        :class="textClasses"
      >
        {{ text }}
      </span>
      
      <AppIcon 
        v-if="iconRight" 
        :name="iconRight" 
        :size="iconSize" 
        :active="iconActive" 
        class="icon ml-2" 
      />
    </template>
    
    <slot />
  </component>
</template>
  
<script setup>
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import AppIcon from './AppIcon.vue'
import { getButtonClasses, getTextClasses } from '@/utils/styleUtils.js'

const props = defineProps({
  variant: { 
    type: String, 
    default: 'primary', 
    validator: v => ['primary', 'secondary', 'outline', 'ghost', 'danger'].includes(v) 
  },
  size: { 
    type: String, 
    default: 'md', 
    validator: v => ['xs', 'sm', 'md', 'lg', 'xl'].includes(v) 
  },
  text: { 
    type: String, 
    default: '' 
  },
  iconLeft: { 
    type: String, 
    default: '' 
  },
  iconRight: { 
    type: String, 
    default: '' 
  },
  iconOnly: { 
    type: String, 
    default: '' 
  },
  iconSize: { 
    type: String, 
    default: 'sm' 
  },
  iconActive: { 
    type: Boolean, 
    default: false 
  },
  to: { 
    type: [String, Object], 
    default: null 
  },
  disabled: { 
    type: Boolean, 
    default: false 
  },
  loading: { 
    type: Boolean, 
    default: false 
  },
  customClass: { 
    type: String, 
    default: '' 
  },
  ariaLabel: { 
    type: String, 
    default: '' 
  }
})

const emit = defineEmits(['click', 'mouseenter', 'mouseleave', 'focus', 'blur'])

const isHovered = ref(false)
const isFocused = ref(false)
const isPressed = ref(false)

const buttonComponent = computed(() => props.to ? RouterLink : 'button')

const buttonClasses = computed(() => 
  getButtonClasses({
    size: props.size,
    variant: props.variant,
    iconOnly: !!props.iconOnly,
    isHovered: isHovered.value,
    isPressed: isPressed.value,
    customClass: props.customClass
  })
)

const textClasses = computed(() => 
  getTextClasses({ color: 'primary', size: 'sm', weight: 'medium' }) + (props.loading ? ' opacity-70' : '')
)

const handleClick = (event) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>