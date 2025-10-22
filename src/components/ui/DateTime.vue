<template>
  <div class="flex flex-row items-center space-x-2">
    <div v-if="showDate" class="text-primary text-sm font-normal leading-tight">
      {{ dateTimeStore.formattedDate }}
    </div>
    <div v-if="showTime" class="text-primary text-sm font-normal leading-tight">
      {{ dateTimeStore.formattedTime }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useDateTimeStore } from '@/stores/dateTime'

interface Props {
  date?: boolean
  time?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  date: true,
  time: true
})

const dateTimeStore = useDateTimeStore()

const showDate = computed(() => props.date)
const showTime = computed(() => props.time)

onMounted(() => {
  dateTimeStore.startAutoUpdate()
})
</script>

<style>
    @import "tailwindcss";
</style>