<template>
  <div :class="bubbleClass" class="mb-4 flex" :style="bubbleStyle">
    <div :class="contentClass" class="p-3 max-w-[85%]">
      <template v-if="msg.type === 'text'">
        <p>{{ msg.text }}</p>
      </template>
      <template v-else-if="msg.type === 'translation'">
        <p class="font-semibold mb-1 text-info">翻译结果：</p>
        <p>{{ msg.text }}</p>
      </template>
      <template v-else-if="msg.type === 'audio'">
        <div class="flex items-center gap-2">
          <span class="iconify" data-icon="heroicons:speaker-wave" data-width="20"></span>
          <span class="text-sm">{{ msg.duration || '语音' }}</span>
        </div>
      </template>
      <template v-else-if="msg.type === 'file'">
        <div class="flex items-center gap-3 bg-primary-content/10 rounded-lg p-2">
          <span class="iconify" data-icon="heroicons:document" data-width="20"></span>
          <div>
            <p class="font-medium text-sm truncate">{{ msg.filename }}</p>
            <p class="text-xs opacity-80">{{ msg.filesize }}</p>
          </div>
        </div>
      </template>
      <template v-else-if="msg.type === 'system'">
        <p class="text-base-content/70">{{ msg.text }}</p>
      </template>
      <template v-else-if="msg.type === 'divider'">
        <div class="flex items-center justify-center my-6">
          <div class="h-px bg-base-300 flex-1"></div>
          <span class="mx-3 text-xs text-base-content/60">{{ msg.text }}</span>
          <div class="h-px bg-base-300 flex-1"></div>
        </div>
      </template>
    </div>
    <span v-if="msg.time && msg.type !== 'divider'" class="text-xs text-base-content/50 mt-1 ml-1 self-end">{{ msg.time }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({
  msg: { type: Object, required: true }
})
const bubbleClass = computed(() => {
  if (props.msg.type === 'divider') return ''
  if (props.msg.role === 'user') return 'flex-col items-end'
  return 'flex-col items-start'
})
const contentClass = computed(() => {
  const t = props.msg.type
  if (t === 'system') return 'bg-base-200 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl'
  if (t === 'translation') return 'bg-info/10 border-l-4 border-info rounded-tr-2xl rounded-br-2xl rounded-bl-2xl'
  if (t === 'audio') return 'bg-primary text-primary-content rounded-tl-2xl rounded-bl-2xl rounded-br-2xl flex items-center gap-2'
  if (t === 'file') return 'bg-primary text-primary-content rounded-tl-2xl rounded-bl-2xl rounded-br-2xl'
  if (t === 'divider') return ''
  if (props.msg.role === 'user') return 'bg-primary text-primary-content rounded-tl-2xl rounded-bl-2xl rounded-br-2xl'
  return 'bg-base-200 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl'
})
const bubbleStyle = computed(() => {
  if (props.msg.type === 'divider') return ''
  return {}
})
</script>

<style scoped>
/* 可根据需要自定义气泡样式 */
</style>
