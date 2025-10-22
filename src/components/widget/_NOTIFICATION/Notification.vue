<template>
  <AppWidget variant="compact" size="lg" :width="1" :height="2">
    <!-- Header -->
    <template #header>
      <div class="flex items-center gap-2">
        <h3 class="text-primary font-semibold text-sm">Notifications</h3>
        <span v-if="unreadCount > 0" class="unread-badge">{{ unreadCount }}</span>
      </div>
    </template>

    <!-- Notification List -->
    <NotificationList
      ref="notificationListRef"
      :max-visible="maxVisible"
      :auto-generate="autoGenerate"
      @update:notifications="handleNotificationsUpdate"
      @notification:read="handleNotificationRead"
      @notification:removed="handleNotificationRemoved"
    />

    <!-- Footer -->
    <template #footer>
      <div class="notification-footer">
        <div class="footer-stat">
          <span class="footer-label">Total</span>
          <span class="footer-value">{{ totalCount }}</span>
        </div>
        <div class="footer-stat">
          <span class="footer-label">Unread</span>
          <span class="footer-value unread-value">{{ unreadCount }}</span>
        </div>
        <span class="text-muted text-xs ml-auto">Live</span>
      </div>
    </template>
  </AppWidget>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppWidget from '@/components/ui/AppWidget.vue'
import NotificationList from './NotificationList.vue'

// ============================================================================
// PROPS
// ============================================================================

const props = defineProps({
  maxVisible: {
    type: Number,
    default: 5
  },
  autoGenerate: {
    type: Boolean,
    default: true
  }
})

// ============================================================================
// STATE
// ============================================================================

const notificationListRef = ref(null)
const notifications = ref([])

// ============================================================================
// COMPUTED
// ============================================================================

const totalCount = computed(() => notifications.value.length)

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

// ============================================================================
// METHODS
// ============================================================================

function handleNotificationsUpdate(updatedNotifications) {
  notifications.value = updatedNotifications
}

function handleNotificationRead(notification) {
  console.log('Notification read:', notification.title)
}

function handleNotificationRemoved(notification) {
  console.log('Notification removed:', notification.title)
}

function addNotification(notification) {
  if (notificationListRef.value) {
    notificationListRef.value.addNotification(notification)
  }
}

function markAllAsRead() {
  if (notificationListRef.value) {
    notificationListRef.value.markAllAsRead()
  }
}

function clearAll() {
  if (notificationListRef.value) {
    notificationListRef.value.clearAll()
  }
}

// ============================================================================
// EXPOSE
// ============================================================================

defineExpose({
  addNotification,
  markAllAsRead,
  clearAll,
  getUnreadCount: () => unreadCount.value,
  getNotifications: () => notifications.value
})
</script>

<style scoped>
/* Badge non lu */
.unread-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.375rem;
  font-size: 0.65rem;
  font-weight: 700;
  color: white;
  background: #ef4444;
  border-radius: 9999px;
  animation: pulse-badge 2s ease-in-out infinite;
}

@keyframes pulse-badge {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 4px rgba(239, 68, 68, 0);
  }
}

/* Footer */
.notification-footer {
  display: flex;
  align-items: center;
  gap: 1.5rem;
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

.unread-value {
  color: rgb(59, 130, 246);
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
</style>

