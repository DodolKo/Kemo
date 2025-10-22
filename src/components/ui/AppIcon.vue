<template>
  <component 
    :is="iconComponent" 
    :class="iconClass"
    :aria-label="ariaLabel"
  />
</template>

<script setup>
import { computed } from 'vue'
// Importez les icônes Heroicons avec leurs noms officiels
import { 
  HomeIcon, 
  UserIcon, 
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  Bars3Icon,
  XMarkIcon,
  HeartIcon,
  StarIcon,
  BellIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ShareIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  BookmarkIcon,
  ChartBarIcon,
  ChartPieIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  Squares2X2Icon
} from '@heroicons/vue/24/outline'

// Importez les versions "solid" pour l'état actif
import { 
  HeartIcon as HeartSolidIcon,
  StarIcon as StarSolidIcon,
  BookmarkIcon as BookmarkSolidIcon
} from '@heroicons/vue/24/solid'

const props = defineProps({
  name: {
    type: String,
    required: true,
    validator: (value) => {
      const availableIcons = [
        'home', 'user', 'settings', 'search', 'menu', 'close',
        'heart', 'star', 'bookmark', 'bell', 'mail', 'phone', 
        'calendar', 'edit', 'delete', 'download', 'upload', 'share',
        'arrow-left', 'arrow-right', 'arrow-up', 'arrow-down',
        'chart-bar', 'chart-pie', 'document', 'clipboard',
        'clock', 'warning', 'success', 'info', 'grid'
      ]
      return availableIcons.includes(value)
    }
  },

  size: {
    type: [String, Number],
    default: 'md',
    validator: (value) => {
      const validSizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl']
      return validSizes.includes(value) || typeof value === 'number'
    }
  },

  color: {
    type: String,
    default: 'currentColor'
  },

  active: {
    type: Boolean,
    default: false
  },

  ariaLabel: {
    type: String,
    default: ''
  },

  customClass: {
    type: String,
    default: ''
  }
})

// Mapping des noms d'icônes vers les composants Heroicons
const iconMap = {
  home: HomeIcon,
  user: UserIcon,
  settings: Cog6ToothIcon,
  search: MagnifyingGlassIcon,
  menu: Bars3Icon,
  close: XMarkIcon,
  heart: HeartIcon,
  star: StarIcon,
  bookmark: BookmarkIcon,
  bell: BellIcon,
  mail: EnvelopeIcon,
  phone: PhoneIcon,
  calendar: CalendarIcon,
  edit: PencilIcon,
  delete: TrashIcon,
  download: ArrowDownTrayIcon,
  upload: ArrowUpTrayIcon,
  share: ShareIcon,
  'arrow-left': ArrowLeftIcon,
  'arrow-right': ArrowRightIcon,
  'arrow-up': ChevronUpIcon,
  'arrow-down': ChevronDownIcon,
  'chart-bar': ChartBarIcon,
  'chart-pie': ChartPieIcon,
  document: DocumentTextIcon,
  clipboard: ClipboardDocumentListIcon,
  clock: ClockIcon,
  warning: ExclamationTriangleIcon,
  success: CheckCircleIcon,
  info: InformationCircleIcon,
  grid: Squares2X2Icon
}

// Mapping pour les icônes en état actif
const activeIconMap = {
  heart: HeartSolidIcon,
  star: StarSolidIcon,
  bookmark: BookmarkSolidIcon
}

const iconComponent = computed(() => {
  // Si l'icône est active et a une version solid, utilisez-la
  if (props.active && activeIconMap[props.name]) {
    return activeIconMap[props.name]
  }
  
  return iconMap[props.name] || HomeIcon
})

const iconClass = computed(() => {
  const baseClasses = 'inline-block transition-all duration-200 m-2'
  const sizeClass = typeof props.size === 'string' ? `icon-${props.size}` : ''
  const activeClass = props.active ? 'text-red-500' : ''
  const customClass = props.customClass ? ` ${props.customClass}` : ''
  
  return `${baseClasses} ${sizeClass} ${activeClass}${customClass}`.trim()
})

const ariaLabel = computed(() => {
  const state = props.active ? 'active' : 'inactive'
  return props.ariaLabel || `${props.name} icon ${state}`
})
</script>

<style>
@reference "tailwindcss";

@layer utilities {
  .icon-xs {
    @apply w-4 h-4;
  }
  
  .icon-sm {
    @apply w-6 h-6;
  }
  
  .icon-md {
    @apply w-8 h-8;
  }
  
  .icon-lg {
    @apply w-10 h-10;
  }
  
  .icon-xl {
    @apply w-12 h-12;
  }
  
  .icon-2xl {
    @apply w-14 h-14;
  }
  
  .icon-3xl {
    @apply w-16 h-16;
  }
}
</style> 