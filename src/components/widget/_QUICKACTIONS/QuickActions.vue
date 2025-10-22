<template>
  <AppWidget variant="compact" size="lg" :width="1" :height="2">
    <!-- Header -->
    <template #header>
      <div class="flex items-center gap-2">
        <span class="actions-icon">⚡</span>
        <h3 class="text-primary font-semibold text-sm">Quick Actions</h3>
      </div>
    </template>

    <!-- Quick Actions Grid -->
    <div class="quick-actions-wrapper">
      <div class="actions-grid">
        <button
          v-for="action in actions"
          :key="action.id"
          class="action-button"
          :class="[`color-${action.color}`, { disabled: action.disabled }]"
          :disabled="action.disabled"
          @click="handleAction(action)"
        >
          <div class="action-icon-wrapper">
            <span class="action-icon">{{ action.icon }}</span>
            <div v-if="action.badge" class="action-badge">{{ action.badge }}</div>
          </div>
          <span class="action-label">{{ action.label }}</span>
          <span v-if="action.shortcut" class="action-shortcut">{{ action.shortcut }}</span>
        </button>
      </div>

      <!-- Section personnalisation -->
      <div class="customization-section">
        <button class="customize-btn" @click="toggleCustomize">
          {{ isCustomizing ? '✓ Done' : '⚙️ Customize' }}
        </button>
      </div>
    </div>

    <!-- Footer -->
    <template #footer>
      <div class="actions-footer">
        <div class="footer-stat">
          <span class="footer-label">Actions</span>
          <span class="footer-value">{{ activeActionsCount }}/{{ totalActionsCount }}</span>
        </div>
        <span class="text-muted text-xs ml-auto">{{ lastActionTime }}</span>
      </div>
    </template>
  </AppWidget>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppWidget from '@/components/ui/AppWidget.vue'

// ============================================================================
// PROPS
// ============================================================================

const props = defineProps({
  customActions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['action:triggered'])

// ============================================================================
// STATE
// ============================================================================

const isCustomizing = ref(false)
const lastActionTime = ref('Never')

// Actions prédéfinies
const actions = ref([
  {
    id: 1,
    icon: '📧',
    label: 'Email',
    color: 'blue',
    shortcut: 'E',
    disabled: false,
    badge: null
  },
  {
    id: 2,
    icon: '📱',
    label: 'Messages',
    color: 'green',
    shortcut: 'M',
    disabled: false,
    badge: '3'
  },
  {
    id: 3,
    icon: '📅',
    label: 'Calendar',
    color: 'purple',
    shortcut: 'C',
    disabled: false,
    badge: null
  },
  {
    id: 4,
    icon: '🎵',
    label: 'Music',
    color: 'pink',
    shortcut: null,
    disabled: false,
    badge: null
  },
  {
    id: 5,
    icon: '⚙️',
    label: 'Settings',
    color: 'gray',
    shortcut: 'S',
    disabled: false,
    badge: null
  },
  {
    id: 6,
    icon: '🔔',
    label: 'Alerts',
    color: 'orange',
    shortcut: 'A',
    disabled: false,
    badge: '5'
  },
  {
    id: 7,
    icon: '💾',
    label: 'Backup',
    color: 'teal',
    shortcut: null,
    disabled: false,
    badge: null
  },
  {
    id: 8,
    icon: '🔒',
    label: 'Security',
    color: 'red',
    shortcut: null,
    disabled: false,
    badge: null
  }
])

// ============================================================================
// COMPUTED
// ============================================================================

const activeActionsCount = computed(() => {
  return actions.value.filter(a => !a.disabled).length
})

const totalActionsCount = computed(() => {
  return actions.value.length
})

// ============================================================================
// METHODS
// ============================================================================

/**
 * Gère le clic sur une action
 */
function handleAction(action) {
  if (action.disabled) return
  
  console.log('Action triggered:', action.label)
  
  // Mettre à jour le temps de dernière action
  const now = new Date()
  lastActionTime.value = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
  
  // Émettre l'événement
  emit('action:triggered', {
    id: action.id,
    label: action.label,
    timestamp: now
  })
  
  // Effet visuel (optionnel)
  if (action.badge) {
    // Simuler la lecture des notifications
    setTimeout(() => {
      action.badge = null
    }, 300)
  }
}

/**
 * Toggle le mode personnalisation
 */
function toggleCustomize() {
  isCustomizing.value = !isCustomizing.value
}

/**
 * Active/désactive une action
 */
function toggleAction(actionId) {
  const action = actions.value.find(a => a.id === actionId)
  if (action) {
    action.disabled = !action.disabled
  }
}

// ============================================================================
// EXPOSE
// ============================================================================

defineExpose({
  triggerAction: (actionId) => {
    const action = actions.value.find(a => a.id === actionId)
    if (action) handleAction(action)
  },
  getActions: () => actions.value,
  setActionBadge: (actionId, badge) => {
    const action = actions.value.find(a => a.id === actionId)
    if (action) action.badge = badge
  }
})
</script>

<style scoped>
.quick-actions-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  box-sizing: border-box;
  gap: 1rem;
}

/* Grille d'actions */
.actions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  flex: 1;
  overflow-y: auto;
  padding-right: 0.25rem;
}

/* Scrollbar */
.actions-grid::-webkit-scrollbar {
  width: 4px;
}

.actions-grid::-webkit-scrollbar-track {
  background: rgba(75, 85, 99, 0.2);
}

.actions-grid::-webkit-scrollbar-thumb {
  background: rgba(75, 85, 99, 0.5);
  border-radius: 2px;
}

/* Bouton d'action */
.action-button {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 0.75rem;
  background: rgba(31, 41, 55, 0.4);
  border: 2px solid transparent;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
  min-height: 5rem;
}

.action-button:hover:not(.disabled) {
  background: rgba(31, 41, 55, 0.6);
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.action-button:active:not(.disabled) {
  transform: translateY(-2px);
}

.action-button.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* Couleurs par action */
.action-button.color-blue:hover:not(.disabled) {
  border-color: rgba(59, 130, 246, 0.5);
  background: rgba(59, 130, 246, 0.1);
}

.action-button.color-green:hover:not(.disabled) {
  border-color: rgba(16, 185, 129, 0.5);
  background: rgba(16, 185, 129, 0.1);
}

.action-button.color-purple:hover:not(.disabled) {
  border-color: rgba(139, 92, 246, 0.5);
  background: rgba(139, 92, 246, 0.1);
}

.action-button.color-pink:hover:not(.disabled) {
  border-color: rgba(236, 72, 153, 0.5);
  background: rgba(236, 72, 153, 0.1);
}

.action-button.color-gray:hover:not(.disabled) {
  border-color: rgba(156, 163, 175, 0.5);
  background: rgba(156, 163, 175, 0.1);
}

.action-button.color-orange:hover:not(.disabled) {
  border-color: rgba(245, 158, 11, 0.5);
  background: rgba(245, 158, 11, 0.1);
}

.action-button.color-teal:hover:not(.disabled) {
  border-color: rgba(20, 184, 166, 0.5);
  background: rgba(20, 184, 166, 0.1);
}

.action-button.color-red:hover:not(.disabled) {
  border-color: rgba(239, 68, 68, 0.5);
  background: rgba(239, 68, 68, 0.1);
}

/* Icône d'action */
.action-icon-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-icon {
  font-size: 2rem;
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.2));
}

/* Badge */
.action-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 700;
  color: white;
  background: #ef4444;
  border-radius: 9999px;
  border: 2px solid rgba(31, 41, 55, 1);
  animation: pulse-badge 2s ease-in-out infinite;
}

@keyframes pulse-badge {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

/* Label */
.action-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(229, 231, 235, 1);
  text-align: center;
}

/* Raccourci clavier */
.action-shortcut {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  font-size: 0.65rem;
  font-weight: 700;
  color: rgba(156, 163, 175, 0.5);
  padding: 0.125rem 0.375rem;
  background: rgba(75, 85, 99, 0.3);
  border-radius: 0.25rem;
  font-family: 'SF Mono', 'Monaco', 'Courier New', monospace;
}

/* Section personnalisation */
.customization-section {
  display: flex;
  justify-content: center;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(75, 85, 99, 0.3);
}

.customize-btn {
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 0.375rem;
  background: rgba(75, 85, 99, 0.3);
  color: rgba(229, 231, 235, 1);
  border: 1px solid rgba(75, 85, 99, 0.5);
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.customize-btn:hover {
  background: rgba(75, 85, 99, 0.5);
  transform: translateY(-2px);
}

/* Footer */
.actions-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.footer-stat {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.footer-label {
  font-size: 0.75rem;
  line-height: 1rem;
  color: rgb(156, 163, 175);
}

.footer-value {
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 600;
  color: rgb(229, 231, 235);
}

.actions-icon {
  font-size: 1rem;
}

/* Utility classes */
.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.gap-2 {
  gap: 0.5rem;
}

.text-primary {
  color: rgb(229, 231, 235);
}

.text-muted {
  color: rgb(156, 163, 175);
}

.font-semibold {
  font-weight: 600;
}

.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
}

.ml-auto {
  margin-left: auto;
}

/* Responsive */
@media (max-width: 640px) {
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .action-button {
    min-height: 4rem;
  }
}
</style>

