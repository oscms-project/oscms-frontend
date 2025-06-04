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
             <div class="username">{{ userStore.name }}</div>
            <div class="user-id">{{ userStore.userId }}</div>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios' // Make sure to install axios if you haven't already

const router = useRouter()

// 用户信息 - 可以从实际的用户认证系统中获取
const user = ref({
    id: '12345',
    username: 'student001',
    name: '张三',
    role: 'student',
    email: 'student001@example.com',
    college: '计算机科学与技术学院',
    avatar: '/placeholder.svg?height=40&width=40'
});

// 课程信息 - 应该从路由参数或实际课程数据中获取
const course = ref({
    id: 'course-123', // This should be dynamically set based on the current course
    name: '数据结构与算法',
    code: 'CS101'
});

// 用户菜单显示状态
const showUserMenu = ref(false);

// 提示框状态
const showAlert = ref(false);
const alertMessage = ref('');

// 显示提示信息
const showMessage = (message) => {
    alertMessage.value = message;
    showAlert.value = true;

    // 2秒后自动关闭
    setTimeout(() => {
        showAlert.value = false;
    }, 2000);
};

// 练习列表数据 - 将从API获取
const exercises = ref([]);
const loading = ref(false);
const error = ref(null);

// 格式化日期时间
const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return '';
    const date = new Date(dateTimeStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

// 获取练习结束时间
const getEndTime = (exercise) => {
    const openTime = new Date(exercise.openTime);
    const endTime = new Date(openTime);
    endTime.setDate(endTime.getDate() + 7); // 假设练习有效期为7天
    return endTime.toISOString();
};

// 获取练习状态
const getExerciseStatus = (exercise) => {
    const now = new Date();
    const openTime = new Date(exercise.openTime);

    // 假设练习有效期为7天
    const endTime = new Date(openTime);
    endTime.setDate(endTime.getDate() + 7);

    if (now < openTime) {
        return 'upcoming'; // 未开始
    } else if (now > endTime) {
        return 'expired'; // 已截止
    } else {
        return 'in-progress'; // 进行中
    }
};

// 获取状态文本
const getStatusText = (status) => {
    switch (status) {
        case 'expired':
            return '已截止';
        case 'in-progress':
            return '进行中';
        case 'upcoming':
            return '未开始';
        default:
            return '';
    }
};

// 返回上一页
const goBack = () => {
    // 实际应用中可能需要返回上一页
    router.back();
};

// 进入练习
const enterExercise = (exercise) => {
    const status = getExerciseStatus(exercise);

    if (status === 'upcoming') {
        showMessage('别着急，老师还没开放');
        return;
    }

    if (status === 'expired' && !exercise.allowResubmit && exercise.submission) {
        showMessage('很遗憾，练习已截止');
        return;
    }

    router.push({ name: 'ExercisePage', params: { id: exercise.id } })
        .then(() => {
            console.log('Navigation to ExercisePage successful');
        })
        .catch(err => {
            console.error('Navigation to ExercisePage failed:', err);
        });
};

// 获取练习列表
const fetchExercises = async () => {
    loading.value = true;
    error.value = null;
    
    try {
        // Get courseId from the current course
        const courseId = course.value.id;
        
        // Make API call to get exercises
        const response = await axios.get(`/exercises`, {
            params: {
                courseId: courseId
            }
        });
        
        // Check if the response is successful
        if (response.data && response.data.code === 200) {
            exercises.value = response.data.data || [];
        } else {
            throw new Error(response.data.message || 'Failed to fetch exercises');
        }
    } catch (err) {
        console.error('Error fetching exercises:', err);
        error.value = err.message || 'Failed to fetch exercises';
    } finally {
        loading.value = false;
    }
};

// 组件挂载时获取练习列表
onMounted(() => {
    fetchExercises();
});
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