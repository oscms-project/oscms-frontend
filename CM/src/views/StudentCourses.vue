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
   <!-- Course Card -->
<div class="course-card">
  <div class="course-image">
    <div class="course-title">{{ courseData?.name || '加载中...' }}</div>
    <div class="course-status">{{ courseData?.status || '已发布' }}</div>
  </div>
  <div class="course-info">
    <div class="teacher-info">
      <span class="teacher-icon">👨‍🏫</span>
      <span class="teacher-name">教师：{{ courseData?.teacherName || route.query.courseTeacher || '未知教师' }}</span>
      <span class="course-time" v-if="courseData?.assistants">助教：{{ courseData.assistants }}</span>
    </div>
    <div class="course-tags" v-if="courseData?.tags && courseData.tags.length">
      <span class="tag" v-for="tag in courseData.tags" :key="tag">{{ tag }}</span>
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
    <div class="outline-item" v-for="(item, idx) in courseOutline" :key="idx">
      <div class="outline-number">{{ item.chapter || (idx+1) }}</div>
      <div class="outline-content">
        <h4>{{ item.title }}</h4>
        <p>{{ item.description }}</p>
        <div class="outline-meta">
          <span v-if="item.hours">学时：{{ item.hours }}</span>
          <span v-if="item.difficulty">难度：{{ item.difficulty }}</span>
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
    <div class="chapter-item" v-for="(chapter, idx) in courseChapters" :key="chapter.id || idx">
      <div class="chapter-header">
        <span class="chapter-title">{{ chapter.title }}</span>
        <span class="chapter-progress" v-if="chapter.progress">{{ chapter.progress }}%</span>
      </div>
      <div class="chapter-lessons" v-if="chapter.lessons">
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

    <!-- filepath: e:\test\git_test\CM\src\views\StudentCourses.vue -->
<!-- Course Materials -->
<div v-if="activeTab === 'materials'" class="tab-content">
  <div class="content-header">
    <h3>📁 课程资料</h3>
  </div>
  <div class="filter-container">
    <label for="chapter-filter">按章节筛选：</label>
    <select 
      id="chapter-filter" 
      v-model="selectedChapter" 
      class="chapter-filter"
    >
      <option value="all">全部章节</option>
      <option 
        v-for="outline in availableChapters" 
        :key="outline.chapter"
          :value="outline.chapter"
      >
        第{{ outline.chapter }}章
      </option>
    </select>
  </div>
  <div class="materials-list">
    <div class="material-item" v-for="material in filteredMaterials" :key="material.id">
      <!-- 文件类型图标 -->
      <div class="material-icon">{{ getFileIcon(material.filename) }}</div>
      <div class="material-info">
        <!-- 资料标题 -->
        <div class="material-name">{{ material.filename }}</div>
        <div class="material-meta">
          <!-- 上传时间 -->
         <span>上传时间：{{ material.updatedAt }}</span>
          <!-- 章节信息 -->
          <span v-if="material.chapterOrder">章节：{{ material.chapterOrder }}</span>
        </div>
      </div>
      <!-- 下载按钮链接到文件URL -->
      <!-- <a 
        :href="material.url" 
        class="download-btn" 
        target="_blank" 
        :download="material.filename"
      >
        下载
      </a> -->
       <!-- 下载按钮链接到文件URL -->
      <button 
        class="download-btn" 
        @click="downloadFile(material.url, material.filename)"
      >
        下载
      </button>
    </div>
  </div>
  <!-- filepath: e:\test\git_test\CM\src\views\StudentCourses.vue -->
<div class="filter-container">
  <label for="chapter-filter">按章节筛选：</label>
  <select 
    id="chapter-filter" 
    v-model="selectedChapter" 
    class="chapter-filter"
  >
    <option value="all">全部章节</option>
    <option 
      v-for="outline in availableChapters" 
      :key="outline.chapter"
      :value="outline.chapter"
    >
      第{{ outline.chapter }}章
    </option>
  </select>
  <label for="type-filter" style="margin-left: 24px;">按类型筛选：</label>
  <select 
    id="type-filter" 
    v-model="selectedType" 
    class="chapter-filter"
  >
    <option value="all">全部类型</option>
    <option v-for="type in availableTypes" :key="type" :value="type">
      {{ type.toUpperCase() }}
    </option>
  </select>
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
        </div>
        <div class="practice-stats">
        </div>
      </div>
      <div class="practice-actions">
        <button 
          class="action-btn primary"
          @click="startExercise(practice)"
        >开始做题</button>
        <button
          class="action-btn secondary" 
          :disabled="practice.wrongCount === 0"
          @click="retryWrongQuestions(practice)"
        >错题重做</button>
        <button 
          class="action-btn tertiary" 
          :disabled="practice.attempts === 0"
          @click="viewLastRecord(practice)"
  >查看上次练习记录</button>
      </div>
    </div>
  </div>
</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { useCourseStore } from '@/stores/course';
import { useRoute } from 'vue-router'; 
import { getCourseDetail } from '@/api/course'; // 确保导入API
import { getMaterials } from '@/api/materials';
import { getStudentClassInCourse } from '@/api/class'; // 新增
// 添加这个导入
import { getClassAssignments } from '@/api/class';
import { useRouter } from 'vue-router';
const router = useRouter();

const userStore = useUserStore();
const courseStore = useCourseStore();
const activeTab = ref('outline');
// 从路由参数中获取课程信息
const route = useRoute()
const courseId = computed(() => courseStore.currentCourseId) // 修改为从store获取
const courseData = ref(null)
const courseOutline = ref([])
const courseChapters = ref([])
const courseMaterials = ref([])
const onlinePractices = ref([])
const classId = ref(null) 
// 假设班级ID可以从课程详情或其他API获得，这里先用courseId代替
const tabs = [
  { key: 'outline', label: '课程大纲' },
  { key: 'chapters', label: '课程章节' },
  { key: 'materials', label: '课程资料' },
  { key: 'practice', label: '在线练习' }
]

const startExercise = (practice) => {
  // 使用store保存练习ID
  courseStore.setCurrentExerciseId(practice.id);
  
  // 跳转到简洁的URL，无需查询参数
  router.push('/exercise/:id');
};
const retryWrongQuestions = (practice) => {
  // 确保只有当有错题时才能点击
  if (practice.wrongCount === 0) return;
  
  // 使用store保存练习ID
  courseStore.setCurrentExerciseId(practice.id);
  
  // 跳转到错题重做页面，使用纯路径
  router.push('/retry/:id');
};
const viewLastRecord = (practice) => {
  // 确保只有当有练习记录时才能点击
  if (practice.attempts === 0) return;
  
  // 使用store保存练习ID
  courseStore.setCurrentExerciseId(practice.id);
  
  // 跳转到练习反馈页面，使用纯路径
  router.push(`/feedback/:id`);
};
// 添加加载状态和错误处理
const loading = ref(true);
const error = ref('');

const fetchAllCourseInfo = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    console.log("正在获取课程详情，ID:", courseId.value);
    
    // 1. 获取课程详情（课程名称、章节、大纲等基本信息）
    const res = await getCourseDetail(courseId.value);
    console.log("课程详情API返回:", res);
    
    if (res.data && res.data.data) {
      courseData.value = res.data.data;
      //处理大纲数据
     if (typeof res.data.data.outline === 'string') {
    // 如果大纲是字符串，将其封装为对象数组
    courseOutline.value = [
      {
        chapter: 1,
        title: '课程大纲',
        description: res.data.data.outline
      }
    ];
  } else if (Array.isArray(res.data.data.outline)) {
    // 如果已经是数组，直接使用
    courseOutline.value = res.data.data.outline;
  } else {
    // 默认为空数组
    courseOutline.value = [];
  }
  
      courseChapters.value = res.data.data.chapters || [];
      console.log("课程基本信息处理完成:", courseData.value);
      console.log("大纲数据:", courseOutline.value);
      console.log("章节数据:", courseChapters.value);
    } else {
      console.error("课程详情API返回数据格式异常");
      error.value = "无法获取课程详情";
      return;
    }

    // 2. 获取该学生在此课程中所在的班级ID
    try {
      console.log("查询学生班级，学生ID:", userStore.userId, "课程ID:", courseId.value);
      const classRes = await getStudentClassInCourse(userStore.userId, courseId.value);
      console.log("班级信息API返回:", classRes);
      
      if (classRes.data && classRes.data.data && classRes.data.data.id) {
        classId.value = classRes.data.data.id;
        console.log("获取到班级ID:", classId.value);
        
        // 3. 用班级id获取该班级的资料
        try {
          const matRes = await getMaterials(classId.value);
          console.log("课程资料API返回:", matRes);
          if (matRes.data && matRes.data.data) {
            courseMaterials.value = matRes.data.data;
            console.log("班级资料获取成功:", courseMaterials.value);
          } else {
            console.warn("班级资料为空或格式异常");
            courseMaterials.value = [];
          }
        } catch (err) {
          console.error("获取班级资料失败:", err);
          courseMaterials.value = [];
        }
        
        // 4. 用班级id获取该班级的练习
        try {
          const pracRes = await getClassAssignments(classId.value);
          console.log("班级练习API返回:", pracRes);
          if (pracRes.data && pracRes.data.data) {
            onlinePractices.value = pracRes.data.data;
            console.log("班级练习获取成功:", onlinePractices.value);
          } else {
            console.warn("班级练习为空或格式异常");
            onlinePractices.value = [];
          }
        } catch (err) {
          console.error("获取班级练习失败:", err);
          onlinePractices.value = [];
        }
      } else {
        console.error("未找到学生所在班级");
        error.value = "未找到您在此课程中的班级信息";
      }
    } catch (e) {
      console.error('获取班级信息失败:', e);
      error.value = "无法获取班级信息";
    }
  } catch (e) {
    console.error('课程详情获取失败:', e);
    error.value = "获取课程信息失败";
  } finally {
    loading.value = false;
  }
};
// 添加在script部分的ref引用列表中
const selectedChapter = ref('all'); // 默认显示全部章节
const selectedType = ref('all'); // 默认显示全部类型
// 修改可用的章节列表，仅使用courseChapters中的章节
const availableChapters = computed(() => {
  // 只从课程章节中获取章节列表
  return courseChapters.value
    .map(chapter => ({
      chapter: chapter.order , // 使用章节的序号
      title: chapter.title
    }))
    .sort((a, b) => a.chapter - b.chapter); // 按章节序号排序
});
// 计算所有出现过的资料类型
const availableTypes = computed(() => {
  const types = new Set();
  courseMaterials.value.forEach(material => {
    const ext = material.filename?.split('.').pop()?.toLowerCase();
    if (ext) types.add(ext);
  });
  return Array.from(types);
});
// 根据选中的章节过滤资料
const filteredMaterials_c = computed(() => {
  if (selectedChapter.value === 'all') {
    return courseMaterials.value; // 返回所有资料
  } else {
    // 过滤属于选定章节的资料
    return courseMaterials.value.filter(material => 
      material.chapterOrder === selectedChapter.value
    );
  }
});
//根据资料类型筛选资料
const filteredMaterials = computed(() => {
  let filtered = courseMaterials.value;
  if (selectedChapter.value !== 'all') {
    filtered = filtered.filter(material => material.chapterOrder === selectedChapter.value);
  }
  if (selectedType.value !== 'all') {
    filtered = filtered.filter(material => {
      const ext = material.filename?.split('.').pop()?.toLowerCase();
      return ext === selectedType.value;
    });
  }
  return filtered;
});
// 完善下载函数
const downloadFile = (url, filename) => {
  fetch(url)
    .then(response => response.blob())
    .then(blob => {
      // 创建一个临时的URL对象
      const fileURL = window.URL.createObjectURL(blob);
      // 创建一个链接元素
      const fileLink = document.createElement('a');
      fileLink.href = fileURL;
      fileLink.setAttribute('download', filename);
      // 模拟点击下载
      document.body.appendChild(fileLink);
      fileLink.click();
      // 清理
      document.body.removeChild(fileLink);
      window.URL.revokeObjectURL(fileURL);
    })
    .catch(error => {
      console.error('下载文件失败:', error);
      alert('下载文件失败，请稍后重试');
    });
};

// 添加日期格式化函数
const formatDate = (dateString) => {
  console.log('格式化日期:', dateString);
  if (!dateString) return '未知时间';
  
  try {
    // 尝试解析日期字符串
    const date = new Date(dateString);
    
    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      return dateString; // 如果解析失败，返回原始字符串
    }
    
    // 格式化为 YYYY-MM-DD HH:MM 格式
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  } catch (e) {
    console.error('日期格式化失败:', e);
    return dateString; // 出现异常时返回原始字符串
  }
};

// 根据文件名确定图标
const getFileIcon = (filename) => {
  if (!filename) return '📁';
  
  const extension = filename.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf': return '📄';
    case 'doc':
    case 'docx': return '📝';
    case 'ppt':
    case 'pptx': return '📊';
    case 'xls':
    case 'xlsx': return '📈';
    case 'zip':
    case 'rar': return '🗜️';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif': return '🖼️';
    default: return '📁';
  }
};
onMounted(() => {
  fetchAllCourseInfo()
})

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
/* 添加到<style>部分 */
.download-btn {
  background-color: #1e88e5;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
  white-space: nowrap;
  min-width: 70px;
}

.download-btn:hover {
  background-color: #1565c0;
}

.material-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 10px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.material-info {
  flex: 1;
  margin: 0 15px;
}

.material-icon {
  font-size: 24px;
  width: 32px;
  text-align: center;
}
/* 添加在<style>部分 */
.filter-container {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.chapter-filter {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  margin-left: 12px;
  background-color: white;
  font-size: 14px;
  min-width: 200px;
}

.chapter-filter:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

label {
  font-size: 14px;
  font-weight: 500;
  color: #4b5563;
}
</style>