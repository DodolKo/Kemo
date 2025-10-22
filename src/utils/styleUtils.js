/**
 * Utilitaires de style composables
 * Règle : Jamais de Tailwind CSS pur dans un composant sans commentaire
 */

// === CONFIGURATION CENTRALISÉE ===
const CONFIG = {
  colors: {
    primary: 'text-black dark:text-white',
    secondary: 'text-gray-600 dark:text-gray-300', 
    muted: 'text-gray-500 dark:text-gray-400',
    branding: 'text-branding',
    white: 'text-white dark:text-black',
    danger: 'text-red-500 dark:text-red-400',
    success: 'text-green-500 dark:text-green-400'
  },
  sizes: {
    xs: 'text-xs', sm: 'text-sm', base: 'text-base', lg: 'text-lg', xl: 'text-xl', '2xl': 'text-2xl'
  },
  spacing: {
    xs: 'p-xs', sm: 'p-sm', md: 'p-md', lg: 'p-lg', xl: 'p-xl'
  },
  buttons: {
    sizes: { xs: 'btn-xs', sm: 'btn-sm', md: 'btn-md', lg: 'btn-lg', xl: 'btn-xl' },
    iconSizes: { xs: 'btn-icon-xs', sm: 'btn-icon-sm', md: 'btn-icon-md', lg: 'btn-icon-lg', xl: 'btn-icon-xl' },
    variants: { primary: 'btn-primary', secondary: 'btn-secondary', outline: 'btn-outline', ghost: 'btn-ghost', danger: 'btn-danger' }
  }
}

// === EXPORTS COMPATIBILITÉ ===
export const TEXT_COLORS = CONFIG.colors
export const TEXT_SIZES = CONFIG.sizes
export const PADDING = CONFIG.spacing
export const BUTTON_SIZES = CONFIG.buttons.sizes
export const BUTTON_ICON_SIZES = CONFIG.buttons.iconSizes
export const BUTTON_VARIANTS = CONFIG.buttons.variants

// === FONCTIONS UTILITAIRES ===
export const composeClasses = (...classes) => classes.filter(Boolean).join(' ')

export const getButtonClasses = ({ size = 'md', variant = 'primary', iconOnly = false, isHovered = false, isPressed = false, customClass = '' }) => 
  composeClasses(
    'btn-base',
    iconOnly ? CONFIG.buttons.iconSizes[size] : CONFIG.buttons.sizes[size],
    CONFIG.buttons.variants[variant],
    isHovered ? 'btn-hover' : '',
    isPressed ? 'btn-pressed' : '',
    customClass
  )

export const getTextClasses = ({ color = 'primary', size = 'base', weight = 'normal' }) => 
  composeClasses(CONFIG.colors[color], CONFIG.sizes[size], `font-${weight}`)

export const getSpacingClasses = ({ padding, margin, rounded }) => 
  composeClasses(
    padding ? CONFIG.spacing[padding] : '',
    margin ? CONFIG.spacing[margin] : '',
    rounded ? `rounded-${rounded}` : ''
  )
