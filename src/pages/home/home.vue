<template>
  <div class="home-page">
    <!-- Toast 容器 -->
    <div class="toast-container" id="toast-container"></div>
    <!-- Alert 容器 -->
    <div class="hidden" id="alert-container"></div>
    <!-- 顶部导航栏 -->
    <div class="navbar">
      <div class="navbar-start">
        <button class="nav-button" @click="onMenuClick">
          <span class="iconify" data-icon="heroicons:bars-3" data-width="24"></span>
        </button>
      </div>
      <div class="navbar-center">
        <h1 class="page-title">方言转写</h1>
      </div>
      <div class="navbar-end">
        <button class="nav-button" @click="onUserClick">
          <span class="iconify" data-icon="heroicons:user-circle" data-width="24"></span>
        </button>
      </div>
    </div>
    <!-- 主体内容 -->
    <main class="main-content">
      <div style="position: relative;">
        <!-- 最近使用 -->
        <div class="section recent-usage">
          <h2 class="section-title">最近使用</h2>
          <div class="scroll-container">
            <div class="card-container">
              <div class="recent-card primary-card">
                <div class="card-body">
                  <div class="card-header">
                    <span class="iconify text-primary" data-icon="heroicons:microphone" data-width="20"></span>
                    <h3 class="card-title">会议记录</h3>
                  </div>
                  <p class="card-time">7月1日 · 10:30</p>
                  <div class="card-content">
                    <p class="content-text">关于新产品设计方案的讨论，重点包括界面风格、交互流程和功能优先级...</p>
                  </div>
                </div>
              </div>
              <div class="recent-card secondary-card">
                <div class="card-body">
                  <div class="card-header">
                    <span class="iconify text-secondary" data-icon="heroicons:chat-bubble-left-right" data-width="20"></span>
                    <h3 class="card-title">聊天记录</h3>
                  </div>
                  <p class="card-time">6月30日 · 15:45</p>
                  <div class="card-content">
                    <p class="content-text">关于如何优化语音转写精度的讨论，使用新的神经网络模型可以提升...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 功能入口网格 -->
        <div class="section function-grid">
          <h2 class="section-title">功能入口</h2>
          <div class="grid-container">
            <button class="function-card primary-function" @click="navigateTo('/pages/chat-mode/chat-mode')">
              <div class="function-card-body">
                <div class="function-icon primary-icon">
                  <span class="iconify text-white" data-icon="heroicons:microphone" data-width="32"></span>
                </div>
                <span class="function-text">实时转写</span>
              </div>
            </button>
            <button class="function-card secondary-function" @click="navigateTo('/pages/chat-mode/chat-mode')">
              <div class="function-card-body">
                <div class="function-icon secondary-icon">
                  <span class="iconify text-white" data-icon="heroicons:chat-bubble-left-right" data-width="32"></span>
                </div>
                <span class="function-text">聊天模式</span>
              </div>
            </button>
            <button class="function-card accent-function" @click="navigateTo('/pages/dictionary/dictionary')">
              <div class="function-card-body">
                <div class="function-icon accent-icon">
                  <span class="iconify text-white" data-icon="heroicons:book-open" data-width="32"></span>
                </div>
                <span class="function-text">方言词典</span>
              </div>
            </button>
            <button class="function-card info-function" @click="onHistoryClick">
              <div class="function-card-body">
                <div class="function-icon info-icon">
                  <span class="iconify text-white" data-icon="heroicons:clock" data-width="32"></span>
                </div>
                <span class="function-text">历史记录</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

function navigateTo(url) {
  uni.navigateTo({
    url: url
  })
}

function onMenuClick() {
  showToast('菜单功能即将开放', 'info')
}

function onUserClick() {
  showToast('个人资料功能即将开放', 'info')
}

function onHistoryClick() {
  showToast('历史记录功能即将开放', 'info')
}

// Toast 简易实现
function showToast(message, type = 'info', duration = 2000) {
  uni.showToast({
    title: message,
    icon: type === 'info' ? 'none' : type,
    duration: duration
  })
}

onMounted(() => {
  console.log('Home page mounted')
})
</script>

<style scoped>
/* 基础样式 */
.home-page {
  background-color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* 导航栏样式 */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background-color: #ffffff;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  z-index: 30;
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
  transition: all 0.2s;
}

/* 主体内容 */
.main-content {
  flex: 1 1 0%;
  overflow: auto;
  padding: 1.5rem 1rem 5rem 1rem;
}

/* 区块样式 */
.section {
  margin-bottom: 1.5rem;
  position: relative;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

/* 滚动容器 */
.scroll-container {
  overflow-x: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scroll-container::-webkit-scrollbar {
  display: none;
}

/* 卡片容器 */
.card-container {
  display: flex;
  gap: 1rem;
  padding-bottom: 0.5rem;
}

/* 最近使用卡片 */
.recent-card {
  min-width: 10rem;
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
}

.primary-card {
  background-color: #eff6ff;
}

.secondary-card {
  background-color: #f8fafc;
}

.card-body {
  padding: 1rem;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card-title {
  font-size: 0.875rem;
  font-weight: 500;
}

.card-time {
  font-size: 0.75rem;
  color: #4b5563;
  margin-top: 0.25rem;
}

.card-content {
  margin-top: 0.5rem;
  background-color: #f3f4f6;
  padding: 0.5rem;
  border-radius: 0.375rem;
  max-height: 3rem;
  overflow: hidden;
}

.content-text {
  font-size: 0.75rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 功能网格 */
.grid-container {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.function-card {
  border-radius: 0.75rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s;
  cursor: pointer;
}

.function-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.primary-function {
  background-color: #eff6ff;
}

.secondary-function {
  background-color: #f8fafc;
}

.accent-function {
  background-color: #fdf4ff;
}

.info-function {
  background-color: #f0f9ff;
}

.function-card-body {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.function-icon {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.primary-icon {
  background-color: #2563eb;
}

.secondary-icon {
  background-color: #475569;
}

.accent-icon {
  background-color: #c026d3;
}

.info-icon {
  background-color: #0ea5e9;
}

.function-text {
  font-size: 0.875rem;
  font-weight: 500;
  text-align: center;
}

/* 颜色样式 */
.text-primary {
  color: #2563eb;
}

.text-secondary {
  color: #475569;
}

.text-white {
  color: #ffffff;
}
</style>