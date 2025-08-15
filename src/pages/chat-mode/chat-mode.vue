<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { DwebAudioView } from '@/utils/dwebaudioview'

// 定义消息类型接口
interface Message {
  id: number
  role?: 'user' | 'system'
  type: 'text' | 'system' | 'translation' | 'divider' | 'audio'
  text: string
  time?: string
  duration?: string
}

// 定义历史记录项接口
interface HistoryItem {
  title: string
  preview: string
  time: string
}

// 添加波形条高度的响应式数组
const waveHeights = ref<number[]>(Array(20).fill(10))  // 初始高度都是10%
let id = 0
const chatHistory = ref<Message[]>([
  { id: id++, role: 'system', type: 'system', text: '欢迎来到聊天模式！', time: '14:30' },
  { id: id++, role: 'user', type: 'text', text: '你好，帮我翻译一下"天气真好"用英语怎么说？', time: '14:31' },
  { id: id++, role: 'system', type: 'translation', text: '"The weather is really nice."', time: '14:31' },
  { id: id++, type: 'divider', text: '以下是今天的新消息' },
])
const inputText = ref<string>('')
const realtimeMode = ref<boolean>(false)
const isRecording = ref<boolean>(false)
const showHistoryPanel = ref<boolean>(false)
const historyItems = ref<HistoryItem[]>([
  { title: '英语学习咨询', preview: '你好，能帮我翻译"今天天气很好"吗？', time: '09:00' },
  { title: '方言翻译', preview: '帮我把"你吃饭了吗"翻译成粤语', time: '昨天' },
  { title: '词汇查询', preview: '请问"啥子"是什么意思？', time: '上周' }
])
const activeHistoryIndex = ref<number>(0)
let waveAnimationInterval: number | null = null

// 音频视图和相关变量
const audioView = ref<DwebAudioView | null>(null)
const mediaRecorder = ref<MediaRecorder | null>(null)
const audioChunks = ref<Blob[]>([])
const dataArray = ref<Uint8Array | null>(null)
const bufferLength = ref<number>(0)

// 初始化音频视图
function initAudioView() {
  if (!audioView.value) {
    audioView.value = new DwebAudioView()
    if (audioView.value.analyser) {
      audioView.value.analyser.fftSize = 256
      bufferLength.value = audioView.value.analyser.fftSize
      dataArray.value = new Uint8Array(bufferLength.value)
    }
  }
}

function sendMessage(): void {
  const text = inputText.value.trim()
  if (!text) return
  chatHistory.value.push({ id: id++, role: 'user', type: 'text', text, time: getTime() })
  inputText.value = ''
  // 模拟系统回复
  setTimeout(() => {
    if (realtimeMode.value) {
      chatHistory.value.push({ id: id++, role: 'system', type: 'system', text: '实时转写结果：' + text, time: getTime() })
    } else {
      chatHistory.value.push({ id: id++, role: 'system', type: 'system', text: '收到：' + text, time: getTime() })
    }
  }, 800)
}

function getTime(): string {
  const d = new Date()
  return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0')
}

function goBack(): void {
if (typeof window !== 'undefined' && window.history) {
  window.history.back()
}
}

function onSettingsClick(): void {
try {
    uni.showToast({
      title: '设置功能即将开放',
      icon: 'none'
    })
  } catch (error) {
    // 降级处理，使用window.alert
    if (typeof window !== 'undefined' && window.alert) {
      window.alert('设置功能即将开放');
    }
  }
}

function toggleHistoryPanel(): void {
  showHistoryPanel.value = !showHistoryPanel.value
}

function loadHistory(index: number): void {
  activeHistoryIndex.value = index
  // 这里可以添加加载历史记录的逻辑
  uni.showToast({
    title: '加载历史记录: ' + historyItems.value[index].title,
    icon: 'none'
  })
  // 关闭历史面板
  showHistoryPanel.value = false
}

function onRealtimeModeChange(): void {
  if (!realtimeMode.value) {
    stopRecording()
  }
}

function toggleRecording(): void {
  if (isRecording.value) {
    stopRecording()
  } else {
    startRecording()
  }
}

// 更新startRecording函数
function startRecording(): void {
  isRecording.value = true
  chatHistory.value.push({ id: id++, type: 'divider', text: '开始实时转写' })

  // 请求录音权限并开始录音
  navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {
      initAudioView()

      // 创建媒体录制器
      mediaRecorder.value = new MediaRecorder(stream)
      audioChunks.value = []

      // 设置数据可用事件处理
      mediaRecorder.value.ondataavailable = event => {
        if (event.data.size > 0) {
          audioChunks.value.push(event.data)
        }
      }

      // 开始录制
      mediaRecorder.value.start()

      // 连接音频流到分析器
      if (audioView.value && audioView.value.audioCtx && audioView.value.analyser) {
        const source = audioView.value.audioCtx.createMediaStreamSource(stream)
        source.connect(audioView.value.analyser)
      }

      // 启动波形动画
      startWaveAnimation()
    })
    .catch(error => {
      console.error('录音权限请求失败:', error)
      uni.showToast({
        title: '录音权限请求失败',
        icon: 'none'
      })
      isRecording.value = false
    })
}

// 更新stopRecording函数
function stopRecording(): void {
  if (isRecording.value) {
    isRecording.value = false
    chatHistory.value.push({ id: id++, type: 'divider', text: '结束实时转写' })

    // 停止录制
    if (mediaRecorder.value && mediaRecorder.value.state !== 'inactive') {
      mediaRecorder.value.stop()
      mediaRecorder.value.onstop = () => {
        // 处理录制的音频数据
        const audioBlob = new Blob(audioChunks.value, { type: 'audio/wav' })
        // 这里可以添加音频转文本的逻辑
        chatHistory.value.push({
          id: id++,
          role: 'user',
          type: 'audio',
          text: '音频转写结果将显示在这里',
          time: getTime(),
          duration: '00:05'
        })
      }
    }

    // 停止波形动画
    stopWaveAnimation()
  }
}

function startWaveAnimation(): void {
  if (waveAnimationInterval) return

  // 使用requestAnimationFrame实现平滑动画
  function animate() {
    if (!isRecording.value) return

    if (audioView.value && audioView.value.analyser && dataArray.value) {
      // 获取音频数据
      audioView.value.analyser.getByteTimeDomainData(dataArray.value)

      // 更新波形条高度
      const step = Math.floor(bufferLength.value / waveHeights.value.length)
      waveHeights.value = waveHeights.value.map((_, index) => {
        // 从音频数据中采样
        const dataIndex = index * step
        const value = dataArray.value[dataIndex] / 128.0
        // 转换为高度百分比 (10% - 100%)
        return Math.floor(value * 90) + 10
      })
    }

    waveAnimationInterval = requestAnimationFrame(animate)
  }

  animate()
}

function stopWaveAnimation(): void {
  if (waveAnimationInterval) {
    cancelAnimationFrame(waveAnimationInterval)
    waveAnimationInterval = null
  }

  // 重置波形高度
  waveHeights.value = Array(20).fill(10)
}

onUnmounted(() => {
  stopWaveAnimation()
})
</script>

<template>
  <div class="chat-page">
    <!-- 顶部导航栏 -->
    <div class="navbar">
      <div class="navbar-start">
        <button class="nav-button" @click="goBack">
          <span class="iconify" data-icon="heroicons:arrow-left" data-width="24"></span>
        </button>
      </div>
      <div class="navbar-center">
        <h1 class="page-title">聊天模式</h1>
      </div>
      <div class="navbar-end">
        <button class="nav-button" @click="onSettingsClick">
          <span class="iconify" data-icon="heroicons:cog-6-tooth" data-width="24"></span>
        </button>
      </div>
    </div>
    
    <!-- 聊天历史区域 -->
    <div class="chat-history">
      <div id="chat-messages" class="message-container">
        <div v-for="msg in chatHistory" :key="msg.id" class="message-bubble" :class="msg.role === 'user' ? 'user-message' : 'system-message'">
          <div v-if="msg.type === 'divider'" class="divider-message">
            <span class="divider-text">{{ msg.text }}</span>
          </div>
          <div v-else class="message-content" :class="msg.type === 'translation' ? 'translation-result' : ''">
            <div class="message-text">{{ msg.text }}</div>
            <div class="message-time">{{ msg.time }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 输入区和模式切换 -->
    <div class="input-area">
      <div class="mode-toggle">
        <label class="toggle-label">
          <input type="checkbox" v-model="realtimeMode" @change="onRealtimeModeChange"/>
          <span class="toggle-text">实时转写模式</span>
        </label>
      </div>
      
      <!-- 文本输入区域 - 根据实时模式切换显示 -->
      <div class="input-wrapper" v-if="!realtimeMode">
        <input v-model="inputText" @keyup.enter="sendMessage"
               class="message-input"
               placeholder="请输入消息..." />
        <button class="send-button" @click="sendMessage">
          <span class="iconify" data-icon="heroicons:paper-plane" data-width="20"></span>
        </button>
      </div>
      
      <!-- 音频波形UI - 实时模式下显示 -->
  <div class="audio-wave-container" v-else>

    <div class="audio-controls">
      <button class="record-button" @click="toggleRecording">
        <span class="iconify" :data-icon="isRecording ? 'heroicons:stop' : 'heroicons:microphone'" data-width="24"></span>
      </button>
    </div>
    <div class="wave-animation">
      <div v-for="(height, index) in waveHeights" :key="index" 
           :class="['wave-bar', 'bar-' + (index + 1)]" 
           :style="{ height: `${height}%` }"></div>
    </div>
  </div>

  </div> <!-- 输入区和模式切换 结尾 -->
    
    <!-- 悬浮历史记录按钮 -->
    <button class="history-button" @click="toggleHistoryPanel">
      <span class="iconify" data-icon="heroicons:history" data-width="24"></span>
    </button>
    
    <!-- 历史记录面板 -->
    <div class="history-panel" :class="showHistoryPanel ? 'panel-visible' : ''">
      <div class="panel-header">
        <span class="iconify panel-icon" data-icon="heroicons:history" data-width="18"></span>
        <span class="panel-title">历史记录</span>
        <button class="close-button" @click="toggleHistoryPanel">
          <span class="iconify" data-icon="heroicons:x-mark" data-width="18"></span>
        </button>
      </div>
      <div class="panel-list">
        <div class="history-item" :class="activeHistoryIndex === index ? 'active-history' : ''"
             v-for="(item, index) in historyItems" :key="index" @click="loadHistory(index)">
          <div class="item-title">{{ item.title }}</div>
          <div class="item-preview">{{ item.preview }}</div>
          <div class="item-time">{{ item.time }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 页面容器 */
.chat-page {
  font-family: 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif;
  background-color: #f8fafc;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* 导航栏 */
.navbar {
  background-color: white;
  position: sticky;
  top: 0;
  z-index: 30;
  border-bottom: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
}

.navbar-start, .navbar-center, .navbar-end {
  display: flex;
  align-items: center;
}

.navbar-center {
  flex: 1;
  justify-content: center;
}

.page-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
}

.nav-button {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border: none;
  color: #4b5563;
  cursor: pointer;
}

/* 聊天历史区域 */
.chat-history {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background-color: #f8fafc;
}

.message-container {
  max-width: 28rem;
  margin: 0 auto;
}

.message-bubble {
  margin-bottom: 1.5rem;
}

.user-message {
  text-align: right;
}

.system-message {
  text-align: left;
}

.message-content {
  display: inline-block;
  padding: 1rem 1.25rem;
  border-radius: 1.5rem;
  max-width: 80%;
}

.user-message .message-content {
  background: linear-gradient(90deg, #007aff 0%, #00c6fb 100%);
  color: #fff;
  border-bottom-right-radius: 0.5rem;
}

.system-message .message-content {
  background: linear-gradient(90deg, #e0f7fa 0%, #b2ebf2 100%);
  color: #222;
  border-bottom-left-radius: 0.5rem;
}

.translation-result {
  background: linear-gradient(90deg, #e0f7fa 0%, #b2ebf2 100%);
  color: #007aff;
  font-weight: bold;
}

.message-text {
  font-size: 1.1rem;
}

.message-time {
  font-size: 0.75rem;
  margin-top: 0.25rem;
  opacity: 0.7;
}

.divider-message {
  text-align: center;
  margin: 0.5rem 0;
}

.divider-text {
  background-color: #f3f4f6;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  color: #6b7280;
}

/* 输入区 */
.input-area {
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  background-color: white;
}

.mode-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  position: relative;
}

.toggle-label input[type="checkbox"] {
  position: relative;
  width: 40px;
  height: 20px;
  appearance: none;
  -webkit-appearance: none;
  background-color: #e5e7eb;
  border-radius: 10px;
  outline: none;
  transition: background-color 0.3s;
  z-index: 1;
}

.toggle-label input[type="checkbox"]:checked {
  background-color: #007aff;
}

.toggle-label input[type="checkbox"]::before {
  content: '';
  position: absolute;
  width: 16px;
  height: 16px;
  background-color: white;
  border-radius: 50%;
  top: 2px;
  left: 2px;
  transition: transform 0.3s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.toggle-label input[type="checkbox"]:checked::before {
  transform: translateX(20px);
}

/* 额外添加一个背景元素以增强兼容性 */
.toggle-label::after {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 20px;
  background-color: #e5e7eb;
  border-radius: 10px;
  z-index: 0;
  pointer-events: none;
}

.toggle-label input[type="checkbox"]:checked + .toggle-text + .toggle-label::after {
  background-color: #007aff;
}

.toggle-text {
  font-size: 0.875rem;
  color: #4b5563;
  position: relative;
  z-index: 2;
}

.input-wrapper {
  display: flex;
  gap: 0.5rem;
}

.message-input {
  flex: 1;
  border: 1px solid #d1d5db;
  border-radius: 1.5rem;
  padding: 0.5rem 1rem;
  outline: none;
}

.message-input:focus {
  outline: none;
  border-color: #007aff;
  box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.2);
}

.send-button {
  background: linear-gradient(90deg, #007aff 0%, #00c6fb 100%);
  color: white;
  border: none;
  border-radius: 1.5rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 音频波形UI样式 */
.audio-wave-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0;
}

.wave-animation {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 3px;
  width: 100%;
  height: 60px;
  margin-bottom: 1rem;
}

.wave-bar {
  width: 4px;
  height: 10%;
  background: linear-gradient(180deg, #007aff 0%, #00c6fb 100%);
  border-radius: 2px;
  transition: height 0.1s ease;
}

/* 为不同的波形条添加延迟，使动画更自然 */
.bar-1 { transition-delay: 0.02s; }
.bar-2 { transition-delay: 0.04s; }
.bar-3 { transition-delay: 0.06s; }
.bar-4 { transition-delay: 0.08s; }
.bar-5 { transition-delay: 0.1s; }
.bar-6 { transition-delay: 0.12s; }
.bar-7 { transition-delay: 0.14s; }
.bar-8 { transition-delay: 0.16s; }
.bar-9 { transition-delay: 0.18s; }
.bar-10 { transition-delay: 0.2s; }
.bar-11 { transition-delay: 0.22s; }
.bar-12 { transition-delay: 0.24s; }
.bar-13 { transition-delay: 0.26s; }
.bar-14 { transition-delay: 0.28s; }
.bar-15 { transition-delay: 0.3s; }
.bar-16 { transition-delay: 0.32s; }
.bar-17 { transition-delay: 0.34s; }
.bar-18 { transition-delay: 0.36s; }
.bar-19 { transition-delay: 0.38s; }
.bar-20 { transition-delay: 0.4s; }

.audio-controls {
  display: flex;
  justify-content: center;
}

.record-button {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #ff3b30;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(255, 59, 48, 0.2);
}

/* 历史记录按钮 */
.history-button {
  position: fixed;
  bottom: 6rem;
  right: 1rem;
  width: 3rem;
  height: 3rem;
  background: linear-gradient(90deg, #007aff 0%, #00c6fb 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: none;
  cursor: pointer;
  z-index: 40;
}

/* 历史记录面板 */
.history-panel {
  position: fixed;
  right: 0;
  top: 0;
  width: 17.5rem;
  height: 100vh;
  background-color: white;
  box-shadow: -2px 0 5px rgba(0,0,0,0.1);
  transform: translateX(100%);
  transition: transform 0.3s ease;
  z-index: 50;
}

.panel-visible {
  transform: translateX(0);
}

.panel-header {
  background-color: white;
  padding: 0.75rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
}

.panel-icon {
  margin-right: 0.5rem;
}

.panel-title {
  font-weight: 500;
}

.close-button {
  margin-left: auto;
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;
}

.panel-list {
  overflow-y: auto;
  max-height: calc(100vh - 3.5rem);
  padding: 0.5rem;
}

.history-item {
  padding: 0.75rem;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
}

.history-item:hover {
  background-color: #f9fafb;
}

.active-history {
  background-color: #eff6ff;
}

.item-title {
  font-weight: 500;
  font-size: 0.875rem;
}

.item-preview {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-time {
  font-size: 0.75rem;
  color: #9ca3af;
  margin-top: 0.25rem;
}

/* 响应式调整 */
@media (max-width: 500px) {
  .history-panel {
    width: 100%;
  }
}
</style>