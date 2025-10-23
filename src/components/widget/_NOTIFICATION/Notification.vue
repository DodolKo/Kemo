<template>
  <AppWidget variant="compact" size="lg" :width="1" :height="2">
    <template #header>
      <div class="flex items-center gap-2">
        <h3 class="text-primary font-semibold text-sm">Notifications</h3>
        <span v-if="unreadCount > 0" class="unread-badge">{{ unreadCount }}</span>
      </div>
    </template>

    <!-- Notification List Inline -->
    <div class="notification-list-wrapper">
      <div class="notifications-container">
        <TransitionGroup name="notification-list">
          <div v-for="notification in visibleNotifications" :key="notification.id" class="notification-item" :class="[`type-${notification.type}`, { 'is-read': notification.read }]" @click="markAsRead(notification.id)">
            <div v-if="!notification.read" class="unread-indicator" />
            <div class="notification-icon" :class="`icon-${notification.type}`">{{ getIcon(notification.type) }}</div>
            <div class="notification-content">
              <div class="notification-title">{{ notification.title }}</div>
              <div class="notification-message">{{ notification.message }}</div>
              <div class="notification-time">{{ formatTime(notification.timestamp) }}</div>
            </div>
            <button class="delete-btn" @click.stop="removeNotification(notification.id)" title="Remove">✕</button>
          </div>
        </TransitionGroup>
        <div v-if="visibleNotifications.length === 0" class="empty-state">
          <span class="empty-icon">🔔</span>
          <p class="empty-text">No notifications</p>
        </div>
      </div>
      <div class="notification-actions">
        <button class="action-btn" @click="markAllAsRead" :disabled="unreadCount === 0">✓ Mark all read</button>
        <button class="action-btn" @click="clearAll" :disabled="notifications.length === 0">🗑️ Clear all</button>
      </div>
    </div>

    <template #footer>
      <div class="notification-footer">
        <div class="footer-stat"><span class="footer-label">Total</span><span class="footer-value">{{ totalCount }}</span></div>
        <div class="footer-stat"><span class="footer-label">Unread</span><span class="footer-value unread-value">{{ unreadCount }}</span></div>
        <span class="text-muted text-xs ml-auto">Live</span>
      </div>
    </template>
  </AppWidget>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import AppWidget from '@/components/ui/AppWidget.vue'

const props = defineProps({
  maxVisible: { type: Number, default: 5 },
  autoGenerate: { type: Boolean, default: true }
})

const notifications = ref([])
const notificationTemplates = [
  { type: 'info', title: 'System Update', message: 'New features available' },
  { type: 'success', title: 'Task Completed', message: 'Your workout goal was achieved' },
  { type: 'warning', title: 'Low Battery', message: 'Battery is below 20%' },
  { type: 'error', title: 'Connection Lost', message: 'Unable to sync data' },
  { type: 'info', title: 'New Message', message: 'You have 3 unread messages' },
  { type: 'success', title: 'Achievement Unlocked', message: '7 day streak!' },
  { type: 'warning', title: 'Meeting Reminder', message: 'Meeting starts in 10 minutes' },
  { type: 'info', title: 'Weather Alert', message: 'Rain expected this afternoon' }
]

let notificationInterval = null

const visibleNotifications = computed(() => notifications.value.slice(0, props.maxVisible))
const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)
const totalCount = computed(() => notifications.value.length)

function createNotification(template = null) {
  if (!template) template = notificationTemplates[Math.floor(Math.random() * notificationTemplates.length)]
  const notification = {
    id: Date.now() + Math.random(),
    type: template.type,
    title: template.title,
    message: template.message,
    timestamp: Date.now(),
    read: false
  }
  notifications.value.unshift(notification)
  if (notifications.value.length > 20) notifications.value = notifications.value.slice(0, 20)
}

function markAsRead(id) {
  const notification = notifications.value.find(n => n.id === id)
  if (notification && !notification.read) notification.read = true
}

function markAllAsRead() { notifications.value.forEach(n => { n.read = true }) }

function removeNotification(id) {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index !== -1) notifications.value.splice(index, 1)
}

function clearAll() { notifications.value = [] }

function getIcon(type) { return { info: 'ℹ️', success: '✅', warning: '⚠️', error: '❌' }[type] || 'ℹ️' }

function formatTime(timestamp) {
  const now = Date.now()
  const diff = now - timestamp
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  if (days > 0) return `${days}d ago`
  if (hours > 0) return `${hours}h ago`
  if (minutes > 0) return `${minutes}m ago`
  return 'Just now'
}

onMounted(() => {
  setTimeout(() => createNotification(), 500)
  setTimeout(() => createNotification(), 1500)
  if (props.autoGenerate) {
    notificationInterval = setInterval(() => {
      if (Math.random() < 0.3) createNotification()
    }, 10000)
  }
})

onBeforeUnmount(() => { if (notificationInterval) clearInterval(notificationInterval) })

defineExpose({ addNotification: createNotification, markAsRead, markAllAsRead, clearAll, getUnreadCount: () => unreadCount.value })
</script>

<style scoped>
.unread-badge { display: inline-flex; align-items: center; justify-content: center; min-width: 1.25rem; height: 1.25rem; padding: 0 0.375rem; font-size: 0.65rem; font-weight: 700; color: white; background: #ef4444; border-radius: 9999px; animation: pulse-badge 2s ease-in-out infinite; }
@keyframes pulse-badge { 0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); } 50% { transform: scale(1.05); box-shadow: 0 0 0 4px rgba(239, 68, 68, 0); } }
.notification-footer { display: flex; align-items: center; gap: 1.5rem; }
.footer-stat { display: flex; flex-direction: column; gap: 0.125rem; }
.footer-label { font-size: 0.75rem; line-height: 1rem; color: rgb(156, 163, 175); }
.footer-value { font-size: 0.875rem; line-height: 1.25rem; font-weight: 600; color: rgb(229, 231, 235); }
.unread-value { color: rgb(59, 130, 246); }
.notification-list-wrapper { position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; box-sizing: border-box; }
.notifications-container { flex: 1; overflow-y: auto; padding: 0.75rem; display: flex; flex-direction: column; gap: 0.5rem; }
.notifications-container::-webkit-scrollbar { width: 4px; }
.notifications-container::-webkit-scrollbar-track { background: rgba(75, 85, 99, 0.2); }
.notifications-container::-webkit-scrollbar-thumb { background: rgba(75, 85, 99, 0.5); border-radius: 2px; }
.notification-item { position: relative; display: flex; align-items: start; gap: 0.75rem; padding: 0.75rem; background: rgba(31, 41, 55, 0.4); border-left: 3px solid transparent; border-radius: 0.5rem; cursor: pointer; transition: all 0.2s ease; }
.notification-item:hover { background: rgba(31, 41, 55, 0.6); transform: translateX(4px); }
.notification-item.is-read { opacity: 0.6; }
.notification-item.type-info { border-left-color: #3b82f6; }
.notification-item.type-success { border-left-color: #10b981; }
.notification-item.type-warning { border-left-color: #f59e0b; }
.notification-item.type-error { border-left-color: #ef4444; }
.unread-indicator { position: absolute; top: 0.75rem; right: 0.75rem; width: 8px; height: 8px; background: #3b82f6; border-radius: 50%; animation: pulse-dot 2s ease-in-out infinite; }
@keyframes pulse-dot { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.2); } }
.notification-icon { flex-shrink: 0; width: 2rem; height: 2rem; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; border-radius: 0.375rem; filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.2)); }
.icon-info { background: rgba(59, 130, 246, 0.2); }
.icon-success { background: rgba(16, 185, 129, 0.2); }
.icon-warning { background: rgba(245, 158, 11, 0.2); }
.icon-error { background: rgba(239, 68, 68, 0.2); }
.notification-content { flex: 1; display: flex; flex-direction: column; gap: 0.25rem; }
.notification-title { font-size: 0.875rem; font-weight: 600; color: rgba(229, 231, 235, 1); line-height: 1.25; }
.notification-message { font-size: 0.75rem; color: rgba(156, 163, 175, 1); line-height: 1.4; }
.notification-time { font-size: 0.65rem; color: rgba(107, 114, 128, 1); margin-top: 0.125rem; }
.delete-btn { flex-shrink: 0; width: 1.5rem; height: 1.5rem; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; color: rgba(156, 163, 175, 0.5); background: transparent; border: none; border-radius: 0.25rem; cursor: pointer; opacity: 0; transition: all 0.2s ease; }
.notification-item:hover .delete-btn { opacity: 1; }
.delete-btn:hover { color: #ef4444; background: rgba(239, 68, 68, 0.1); }
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem; padding: 2rem; text-align: center; }
.empty-icon { font-size: 3rem; opacity: 0.3; }
.empty-text { font-size: 0.875rem; color: rgba(156, 163, 175, 1); }
.notification-actions { display: flex; gap: 0.5rem; padding: 0.75rem; border-top: 1px solid rgba(75, 85, 99, 0.3); }
.action-btn { flex: 1; padding: 0.5rem; font-size: 0.75rem; font-weight: 600; border-radius: 0.375rem; background: rgba(75, 85, 99, 0.3); color: rgba(229, 231, 235, 1); border: 1px solid rgba(75, 85, 99, 0.5); cursor: pointer; transition: all 0.2s ease; font-family: inherit; }
.action-btn:hover:not(:disabled) { background: rgba(75, 85, 99, 0.5); transform: translateY(-1px); }
.action-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.notification-list-enter-active, .notification-list-leave-active { transition: all 0.3s ease; }
.notification-list-enter-from { opacity: 0; transform: translateX(-20px); }
.notification-list-leave-to { opacity: 0; transform: translateX(20px); }
.notification-list-move { transition: transform 0.3s ease; }
.flex { display: flex; }
.items-center { align-items: center; }
.gap-2 { gap: 0.5rem; }
.text-primary { color: rgb(229, 231, 235); }
.text-muted { color: rgb(156, 163, 175); }
.font-semibold { font-weight: 600; }
.text-sm { font-size: 0.875rem; line-height: 1.25rem; }
.text-xs { font-size: 0.75rem; line-height: 1rem; }
.ml-auto { margin-left: auto; }
</style>
