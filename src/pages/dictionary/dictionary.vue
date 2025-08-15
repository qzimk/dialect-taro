<template>
  <div class="dictionary-page">
    <!-- 顶部导航栏 -->
    <div class="navbar">
      <button class="nav-button" @click="goBack">
        <span class="iconify" data-icon="heroicons:arrow-left" data-width="24"></span>
      </button>
      <h1 class="page-title">方言词典</h1>
      <button class="nav-button" @click="onSearchClick">
        <span class="iconify" data-icon="heroicons:magnifying-glass" data-width="24"></span>
      </button>
    </div>
    
    <!-- 方言切换 -->
    <div class="dialect-tabs">
      <div class="scroll-container">
        <button v-for="dialect in dialects" :key="dialect.value" 
                class="dialect-btn" :class="dialect.value===selectedDialect ? 'active-dialect' : 'inactive-dialect'"
                @click="selectDialect(dialect.value)">
          {{ dialect.label }}
        </button>
      </div>
    </div>
    
    <!-- 搜索框 -->
    <div class="search-container">
      <div class="search-wrapper">
        <input v-model="search" 
               class="search-input" 
               placeholder="搜索字词/释义/例句..." />
        <span class="search-icon">
          <span class="iconify" data-icon="heroicons:magnifying-glass" data-width="20"></span>
        </span>
      </div>
    </div>
    
    <!-- 词条列表 -->
    <div class="entries-container">
      <div v-if="filteredEntries.length === 0" class="empty-state">
        <div class="empty-icon">
          <span class="iconify" data-icon="heroicons:search" data-width="64"></span>
        </div>
        <p class="empty-title">暂无相关词条</p>
        <p class="empty-subtitle">尝试搜索其他关键词或切换方言</p>
      </div>
      <div class="entries-list">
        <div v-for="entry in filteredEntries" :key="entry.id" class="entry-card">
          <div class="entry-header">
            <span class="entry-word">{{ entry.word }}</span>
            <button v-if="entry.audio" class="audio-btn">
              <span class="iconify" data-icon="heroicons:speaker-wave" data-width="18"></span>
            </button>
          </div>
          <div class="entry-definition"><span class="definition-label">释义：</span>{{ entry.definition }}</div>
          <div class="entry-example"><span class="example-label">例句：</span>{{ entry.example }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const dialects = [
  { label: '粤语', value: 'cantonese' },
  { label: '四川话', value: 'sichuanese' },
  { label: '东北话', value: 'dongbei' },
  { label: '上海话', value: 'shanghainese' },
  { label: '湖南话', value: 'hunanese' },
  { label: '闽南话', value: 'minnan' },
  { label: '客家话', value: 'hakka' },
  { label: '河南话', value: 'henan' },
  { label: '山东话', value: 'shandong' },
  { label: '河北话', value: 'hebei' },
  { label: '吴语', value: 'wuyu' },
]
const selectedDialect = ref(dialects[0].value)
const search = ref('')

// 示例数据
const entries = ref([
  { id: 1, dialect: 'cantonese', word: '靓仔', definition: '帅哥', example: '呢位靓仔好有型。', audio: '' },
  { id: 2, dialect: 'cantonese', word: '冇', definition: '没有', example: '我今日冇带伞。', audio: '' },
  { id: 3, dialect: 'sichuanese', word: '雄起', definition: '加油、振作', example: '四川队雄起！', audio: '' },
  { id: 4, dialect: 'dongbei', word: '杠杠的', definition: '非常好', example: '你这活儿干得杠杠的。', audio: '' },
  { id: 5, dialect: 'shanghainese', word: '阿拉', definition: '我', example: '阿拉上海宁。', audio: '' },
  { id: 6, dialect: 'hunanese', word: '霸蛮', definition: '蛮横、霸道', example: '这个人太霸蛮了。', audio: '' },
  { id: 7, dialect: 'minnan', word: '厝', definition: '房子', example: '这是我家厝。', audio: '' },
  { id: 8, dialect: 'hakka', word: '涯', definition: '我', example: '涯系客家人。', audio: '' },
])

const filteredEntries = computed(() => {
  return entries.value.filter(e =>
    e.dialect === selectedDialect.value &&
    (e.word.includes(search.value) || e.definition.includes(search.value) || e.example.includes(search.value))
  )
})

function selectDialect(val) {
  selectedDialect.value = val
}

function playAudio(url) {
  if (!url) {
    uni.showToast({
      title: '暂无音频',
      icon: 'none'
    })
    return
  }
  // 这里是播放音频的逻辑
  const audio = new Audio(url)
  audio.play().catch(err => {
    uni.showToast({
      title: '播放失败',
      icon: 'none'
    })
    console.error('播放音频失败:', err)
  })
}

function goBack() {
  uni.navigateBack()
}

function onSearchClick() {
  // 聚焦搜索框
  const searchInput = document.querySelector('input[placeholder*="搜索"]')
  if (searchInput) {
    searchInput.focus()
  }
}
</script>

<style scoped>
/* 页面容器 */
.dictionary-page {
  max-width: 480px;
  margin: 0 auto;
  background-color: #fff;
  box-shadow: 0 0 8px rgba(0,0,0,0.04);
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

@media (max-width: 500px) {
  .dictionary-page {
    max-width: 100vw;
    box-shadow: none;
  }
}

/* 导航栏 */
.navbar {
  background-color: #2563eb;
  color: white;
  position: sticky;
  top: 0;
  z-index: 30;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
}

.nav-button {
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.2s;
  background-color: transparent;
  border: none;
  color: white;
  cursor: pointer;
}

.nav-button:hover {
  background-color: #1d4ed8;
}

/* 方言切换标签 */
.dialect-tabs {
  position: sticky;
  top: 68px;
  z-index: 20;
  background-color: white;
  border-bottom: 1px solid #f3f4f6;
  padding: 0.75rem 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.scroll-container {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scroll-container::-webkit-scrollbar {
  display: none;
}

.dialect-btn {
  padding: 0.5rem 1rem;
  white-space: nowrap;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
}

.active-dialect {
  background-color: #2563eb;
  color: white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.inactive-dialect {
  background-color: #f3f4f6;
  color: #4b5563;
}

.inactive-dialect:hover {
  background-color: #e5e7eb;
}

/* 搜索框 */
.search-container {
  padding: 1rem;
  background-color: white;
  border-bottom: 1px solid #f3f4f6;
}

.search-wrapper {
  position: relative;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border-radius: 0.75rem;
  border: 1px solid #e5e7eb;
  outline: none;
  transition: all 0.3s;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.search-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

/* 词条列表 */
.entries-container {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem 1rem;
  background-color: #f9fafb;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 3rem 0;
}

.empty-icon {
  width: 4rem;
  height: 4rem;
  margin: 0 auto 1rem;
  color: #bfdbfe;
}

.empty-title {
  font-size: 1.125rem;
  font-weight: 500;
  color: #374151;
}

.empty-subtitle {
  font-size: 0.875rem;
  margin-top: 0.5rem;
  color: #6b7280;
}

/* 词条项 */
.entries-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.entry-card {
  background-color: white;
  border-radius: 0.75rem;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s;
  border: 1px solid #f3f4f6;
}

.entry-card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transform: translateY(-1px);
}

.entry-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.entry-word {
  font-weight: 700;
  font-size: 1.25rem;
  color: #1d4ed8;
}

.audio-btn {
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: #eff6ff;
  color: #2563eb;
  transition: background-color 0.2s;
  border: none;
  cursor: pointer;
}

.audio-btn:hover {
  background-color: #dbeafe;
}

.entry-definition {
  color: #374151;
  margin-bottom: 0.5rem;
}

.definition-label {
  color: #6b7280;
  font-weight: 500;
}

.entry-example {
  font-size: 0.875rem;
  color: #6b7280;
}

.example-label {
  font-weight: 500;
}
</style>