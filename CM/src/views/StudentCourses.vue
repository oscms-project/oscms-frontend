<template>
  <div class="course-detail-container">
    <!-- Header -->
    <div class="header">
      <div class="header-content">
        <div class="logo-section">
          <div class="logo-circle"></div>
          <span class="university-name">北京航空航天大学 | 智学北航</span>
        </div>
        <div class="user-info">
          <div class="avatar"></div>
          <div class="user-details">
            <div class="username">张腾月</div>
            <div class="user-id">23371309</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Course Card -->
    <div class="course-card">
      <div class="course-image">
        <div class="course-title">操作系统</div>
        <div class="course-status">已发布</div>
      </div>
      <div class="course-info">
        <div class="teacher-info">
          <span class="teacher-icon">👨‍🏫</span>
          <span class="teacher-name">教师：孙海龙,牛红璋</span>
          <span class="course-time">时间：郭明明码,武江阳,安安帆</span>
        </div>
        <div class="course-tags">
          <span class="tag">小航学伴</span>
          <span class="tag">AI直播</span>
        </div>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="nav-tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.key"
        :class="['nav-tab', { active: activeTab === tab.key }]"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Content Area -->
    <div class="content-area">
      <!-- Course Outline -->
      <div v-if="activeTab === 'outline'" class="tab-content">
        <div class="content-header">
          <h3>📋 课程大纲</h3>
        </div>
        <div class="outline-list">
          <div class="outline-item" v-for="item in courseOutline" :key="item.id">
            <div class="outline-number">{{ item.chapter }}</div>
            <div class="outline-content">
              <h4>{{ item.title }}</h4>
              <p>{{ item.description }}</p>
              <div class="outline-meta">
                <span>学时：{{ item.hours }}</span>
                <span>难度：{{ item.difficulty }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Course Chapters -->
      <div v-if="activeTab === 'chapters'" class="tab-content">
        <div class="content-header">
          <h3>📚 课程章节</h3>
        </div>
        <div class="chapters-list">
          <div class="chapter-item" v-for="chapter in courseChapters" :key="chapter.id">
            <div class="chapter-header">
              <span class="chapter-title">{{ chapter.title }}</span>
              <span class="chapter-progress">{{ chapter.progress }}%</span>
            </div>
            <div class="chapter-lessons">
              <div class="lesson-item" v-for="lesson in chapter.lessons" :key="lesson.id">
                <span class="lesson-icon">{{ lesson.type === 'video' ? '🎥' : '📄' }}</span>
                <span class="lesson-title">{{ lesson.title }}</span>
                <span class="lesson-duration">{{ lesson.duration }}</span>
                <span :class="['lesson-status', lesson.completed ? 'completed' : 'pending']">
                  {{ lesson.completed ? '已完成' : '未完成' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Course Materials -->
      <div v-if="activeTab === 'materials'" class="tab-content">
        <div class="content-header">
          <h3>📁 课程资料</h3>
        </div>
        <div class="materials-list">
          <div class="material-item" v-for="material in courseMaterials" :key="material.id">
            <div class="material-icon">{{ material.type === 'pdf' ? '📄' : material.type === 'ppt' ? '📊' : '📁' }}</div>
            <div class="material-info">
              <div class="material-name">{{ material.name }}</div>
              <div class="material-meta">
                <span>大小：{{ material.size }}</span>
                <span>上传时间：{{ material.uploadTime }}</span>
              </div>
            </div>
            <button class="download-btn">下载</button>
          </div>
        </div>
      </div>

      <!-- Online Practice -->
      <div v-if="activeTab === 'practice'" class="tab-content">
        <div class="content-header">
          <h3>💻 在线练习</h3>
          <button class="practice-report-btn">练习报告</button>
        </div>
        <div class="practice-list">
          <div class="practice-item" v-for="practice in onlinePractices" :key="practice.id">
            <div class="practice-info">
              <h4>{{ practice.title }}</h4>
              <div class="practice-meta">
                <span>题目数量：{{ practice.questionCount }}题</span>
                <span>时间限制：{{ practice.timeLimit }}分钟</span>
                <span>最高分：{{ practice.bestScore }}分</span>
              </div>
              <div class="practice-stats">
                <span>完成次数：{{ practice.attempts }}次</span>
                <span>错题数：{{ practice.wrongCount }}题</span>
              </div>
            </div>
            <div class="practice-actions">
              <button class="action-btn primary">开始做题</button>
              <button class="action-btn secondary" :disabled="practice.wrongCount === 0">错题重做</button>
              <button class="action-btn tertiary" :disabled="practice.attempts === 0">查看上次记录</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const activeTab = ref('outline')

const tabs = [
  { key: 'outline', label: '课程大纲' },
  { key: 'chapters', label: '课程章节' },
  { key: 'materials', label: '课程资料' },
  { key: 'practice', label: '在线练习' }
]

const courseOutline = [
  {
    id: 1,
    chapter: '第一章',
    title: '操作系统概述',
    description: '介绍操作系统的基本概念、发展历史和主要功能',
    hours: '4学时',
    difficulty: '基础'
  },
  {
    id: 2,
    chapter: '第二章',
    title: '进程管理',
    description: '进程的概念、进程调度算法、进程同步与通信',
    hours: '8学时',
    difficulty: '中等'
  },
  {
    id: 3,
    chapter: '第三章',
    title: '内存管理',
    description: '内存分配策略、虚拟内存、页面置换算法',
    hours: '6学时',
    difficulty: '中等'
  }
]

const courseChapters = [
  {
    id: 1,
    title: '第一章 操作系统概述',
    progress: 100,
    lessons: [
      { id: 1, title: '1.1 操作系统的概念', type: 'video', duration: '25分钟', completed: true },
      { id: 2, title: '1.2 操作系统的发展', type: 'video', duration: '30分钟', completed: true },
      { id: 3, title: '1.3 课后练习', type: 'document', duration: '15分钟', completed: true }
    ]
  },
  {
    id: 2,
    title: '第二章 进程管理',
    progress: 60,
    lessons: [
      { id: 4, title: '2.1 进程的概念', type: 'video', duration: '35分钟', completed: true },
      { id: 5, title: '2.2 进程调度', type: 'video', duration: '40分钟', completed: true },
      { id: 6, title: '2.3 进程同步', type: 'video', duration: '45分钟', completed: false }
    ]
  }
]

const courseMaterials = [
  {
    id: 1,
    name: '操作系统概述.pdf',
    type: 'pdf',
    size: '2.5MB',
    uploadTime: '2024-01-15'
  },
  {
    id: 2,
    name: '进程管理课件.ppt',
    type: 'ppt',
    size: '5.2MB',
    uploadTime: '2024-01-20'
  },
  {
    id: 3,
    name: '实验指导书.pdf',
    type: 'pdf',
    size: '1.8MB',
    uploadTime: '2024-01-25'
  }
]

const onlinePractices = [
  {
    id: 1,
    title: '第一章测试 - 操作系统基础概念',
    questionCount: 20,
    timeLimit: 30,
    bestScore: 85,
    attempts: 2,
    wrongCount: 3
  },
  {
    id: 2,
    title: '第二章测试 - 进程管理',
    questionCount: 25,
    timeLimit: 45,
    bestScore: 92,
    attempts: 1,
    wrongCount: 2
  },
  {
    id: 3,
    title: '综合练习 - 期中测试',
    questionCount: 50,
    timeLimit: 90,
    bestScore: 0,
    attempts: 0,
    wrongCount: 0
  }
]
</script>

<style scoped>
.course-detail-container {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.header {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  padding: 12px 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-circle {
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.university-name {
  font-size: 18px;
  font-weight: 500;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 36px;
  height: 36px;
  background: #87ceeb;
  border-radius: 50%;
}

.username {
  font-size: 14px;
  font-weight: 500;
}

.user-id {
  font-size: 12px;
  opacity: 0.8;
}

.course-card {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
  display: flex;
  gap: 20px;
  align-items: center;
}

.course-image {
  width: 300px;
  height: 160px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  color: white;
  position: relative;
}

.course-title {
  font-size: 24px;
  font-weight: bold;
}

.course-status {
  background: #4ade80;
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  align-self: flex-start;
}

.course-info {
  flex: 1;
}

.teacher-info {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  color: #666;
}

.teacher-icon {
  font-size: 16px;
}

.course-tags {
  display: flex;
  gap: 10px;
}

.tag {
  background: #3b82f6;
  color: white;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
}

.nav-tabs {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
}

.nav-tab {
  flex: 1;
  padding: 16px 20px;
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.nav-tab:hover {
  background: rgba(255, 255, 255, 0.1);
}

.nav-tab.active {
  background: rgba(255, 255, 255, 0.2);
  font-weight: 600;
}

.nav-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: white;
}

.content-area {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.tab-content {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f1f5f9;
}

.content-header h3 {
  margin: 0;
  font-size: 20px;
  color: #1e293b;
}

.practice-report-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

.practice-report-btn:hover {
  background: #2563eb;
}

.outline-list, .chapters-list, .materials-list, .practice-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.outline-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.outline-number {
  background: #3b82f6;
  color: white;
  width: 80px;
  height: 40px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
}

.outline-content h4 {
  margin: 0 0 8px 0;
  color: #1e293b;
}

.outline-content p {
  margin: 0 0 12px 0;
  color: #64748b;
  line-height: 1.5;
}

.outline-meta {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #64748b;
}

.chapter-item {
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.chapter-header {
  background: #f8fafc;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chapter-title {
  font-weight: 600;
  color: #1e293b;
}

.chapter-progress {
  color: #3b82f6;
  font-weight: 600;
}

.chapter-lessons {
  padding: 16px;
}

.lesson-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #f1f5f9;
}

.lesson-item:last-child {
  border-bottom: none;
}

.lesson-icon {
  font-size: 16px;
}

.lesson-title {
  flex: 1;
  color: #1e293b;
}

.lesson-duration {
  color: #64748b;
  font-size: 14px;
}

.lesson-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.lesson-status.completed {
  background: #dcfce7;
  color: #166534;
}

.lesson-status.pending {
  background: #fef3c7;
  color: #92400e;
}

.material-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.material-icon {
  font-size: 24px;
}

.material-info {
  flex: 1;
}

.material-name {
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.material-meta {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: #64748b;
}

.download-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}

.download-btn:hover {
  background: #2563eb;
}

.practice-item {
  display: flex;
  gap: 20px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  align-items: center;
}

.practice-info {
  flex: 1;
}

.practice-info h4 {
  margin: 0 0 12px 0;
  color: #1e293b;
  font-size: 18px;
}

.practice-meta, .practice-stats {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: #64748b;
  margin-bottom: 8px;
}

.practice-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  min-width: 120px;
}

.action-btn.primary {
  background: #3b82f6;
  color: white;
}

.action-btn.primary:hover {
  background: #2563eb;
}

.action-btn.secondary {
  background: #f59e0b;
  color: white;
}

.action-btn.secondary:hover {
  background: #d97706;
}

.action-btn.tertiary {
  background: #6b7280;
  color: white;
}

.action-btn.tertiary:hover {
  background: #4b5563;
}

.action-btn:disabled {
  background: #e5e7eb;
  color: #9ca3af;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .course-card {
    flex-direction: column;
    align-items: stretch;
  }
  
  .course-image {
    width: 100%;
  }
  
  .nav-tabs {
    flex-direction: column;
  }
  
  .practice-item {
    flex-direction: column;
    align-items: stretch;
  }
  
  .practice-actions {
    flex-direction: row;
    justify-content: space-between;
  }
  
  .action-btn {
    flex: 1;
    min-width: auto;
  }
}
</style>