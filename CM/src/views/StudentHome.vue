<template>
  <div class="student-homepage">
    <!-- 页眉用户信息组件区域 -->
    <BaseHeader :user="studentInfo" />
    <!-- 轮播图区域 -->
    <BaseCarousel />

    <!-- 课程资源区域 -->
    <div class="course-resources">
      <div class="section-header">
        <h2>我的课程资源</h2>
         <a href="#" class="view-more" @click.prevent="showJoinCourseModal = true">加入课程 &gt;</a>
      </div>
      <div class="course-tabs">
        <div 
          v-for="(tab, index) in courseTabs" 
          :key="index"
          class="tab"
          :class="{ active: activeTab === index }"
          @click="activeTab = index"
        >
          {{ tab }}
        </div>
      </div>
      <div class="course-list">
        <div 
          v-for="(course, index) in filteredCourses" 
          :key="index"
          class="course-card"
          :style="{ backgroundColor: course.bgColor }"
        >
          <div class="course-image" :style="{ backgroundImage: `url(${course.image})` }">
            <h3 class="course-title">{{ course.title }}</h3>
          </div>
          <div class="course-info">
            <h4>{{ course.title }}</h4>
            <p class="teacher">{{ course.teacher }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 学习进度区域 -->
    <div class="learning-progress">
      <div class="section-header">
        <h2>我的学习进度</h2>
      </div>
      <div class="progress-cards">
        <div 
          v-for="(course, index) in allStudentCourses" 
          :key="index"
          class="progress-card"
        >
          <div class="progress-info">
            <h4>{{ course.title }}</h4>
            <div class="progress-bar-container">
              <div class="progress-bar" :style="{ width: course.progress + '%' }"></div>
            </div>
            <div class="progress-details">
              <span>已完成: {{ course.completedUnits }}/{{ course.totalUnits }}</span>
              <span>{{ course.progress }}%</span>
            </div>
          </div>
          <div class="course-actions">
            <button class="continue-btn">继续学习</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 通知公告区域 -->
    <div class="announcements">
      <div class="section-header">
        <h2>通知公告</h2>
        <a href="#" class="view-more">查看更多 &gt;</a>
      </div>
      <div class="announcement-list">
        <div 
          v-for="(notice, index) in announcements" 
          :key="index"
          class="announcement-item"
        >
          <div class="notice-date">
            <div class="day">{{ notice.day }}</div>
            <div class="month">{{ notice.month }}</div>
          </div>
          <div class="notice-content">
            <h4>{{ notice.title }}</h4>
            <p>{{ notice.content }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 页脚区域 -->
   <BaseFooter />
    <!-- 加入课程弹窗 -->
   <BaseWindow :show="showJoinCourseModal" title="加入课程" @close="showJoinCourseModal = false">
  <div class="form-group">
    <label for="course-code">请输入课程代码</label>
    <input 
      type="text" 
      id="course-code" 
      v-model="courseCode" 
      placeholder="例如: CS101" 
      class="course-code-input"
    />
  </div>
  <template #footer>
    <button class="confirm-button" @click="joinCourse">确认</button>
  </template>
</BaseWindow>

  </div>
</template>



<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';
const router = useRouter();
//api中封装的方法
import { getUser, getUserCourses } from '@/api/user'
import { getCourseDetail } from '@/api/course'
import { getExerciseRecords } from '@/api/record'
//component中封装的组件
import BaseCarousel from '@/components/BaseCarousel.vue'
import BaseHeader from '@/components/BaseHeader.vue'
import BaseFooter from '@/components/BaseFooter.vue'
import BaseWindow from '@/components/BaseWindow.vue';

// 学生信息（初始为空，登录后获取）
const userStore = useUserStore();
const studentInfo = ref({
  name: userStore.name,
  id: userStore.userId,
  avatar: userStore.avatar
});


// function parseJwt(token) {
//   if (!token) return null;
//   const base64Url = token.split('.')[1];
//   if (!base64Url) return null;
//   const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
//   const jsonPayload = decodeURIComponent(
//     atob(base64)
//       .split('')
//       .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
//       .join('')
//   );
//   return JSON.parse(jsonPayload);
// }
// 加入课程弹窗状态
const showJoinCourseModal = ref(false);
const courseCode = ref('');

// 加入课程方法
const joinCourse = () => {
  if (!courseCode.value) {
    alert('请输入课程代码');
    return;
  }
 // 这里可以添加实际的加入课程API调用
  console.log('加入课程:', courseCode.value);
  
  // 模拟加入成功
  alert(`成功加入课程: ${courseCode.value}`);
  
  // 重置并关闭弹窗
  courseCode.value = '';
  showJoinCourseModal.value = false;
  
  // 刷新课程列表
  fetchStudentCourses();
};


// 课程选项卡
const courseTabs = ref(['进行中', '已结课']);
const activeTab = ref(0);

// 测试课程数据
const testCourses = ref([
  {
    title: '操作系统',
    teacher: '孙海龙',
    image: 'https://placeholder.svg?height=200&width=300',
    bgColor: '#0a4d8c',
    type: 0
  },
  {
    title: '人工智能',
    teacher: '张晶',
    image: 'https://placeholder.svg?height=200&width=300',
    bgColor: '#ff7e45',
    type: 0
  },
  {
    title: '数据管理技术',
    teacher: '黄坚',
    image: 'https://placeholder.svg?height=200&width=300',
    bgColor: '#2e1a7a',
    type: 0
  },
  {
    title: '面向对象程序设计',
    teacher: '高祥',
    image: 'https://placeholder.svg?height=200&width=300',
    bgColor: '#b71c1c',
    type: 1
  },
  {
    title: '算法分析与设计',
    teacher: '宋友',
    image: 'https://placeholder.svg?height=200&width=300',
    bgColor: '#1565c0',
    type: 1
  },
  {
    title: '计算机硬件基础',
    teacher: '牛建伟',
    image: 'https://placeholder.svg?height=200&width=300',
    bgColor: '#42a5f5',
    type: 1
  },
]);

// 后端课程数据
const realCourses = ref([]);

// 合并课程数据
const courses = computed(() => [...testCourses.value, ...realCourses.value]);

// 课程状态筛选
const filteredCourses = computed(() => {
  return courses.value.filter(course => course.type === activeTab.value);
});

// 测试进度数据
const testStudentCourses = ref([
  {
    title: '操作系统',
    progress: 75,
    completedUnits: 9,
    totalUnits: 12
  },
  {
    title: '人工智能',
    progress: 60,
    completedUnits: 6,
    totalUnits: 10
  },
  {
    title: '数据管理技术',
    progress: 30,
    completedUnits: 3,
    totalUnits: 10
  },
]);

// 后端进度数据
const realStudentCourses = ref([]);

// 合并进度数据
const allStudentCourses = computed(() => [...testStudentCourses.value, ...realStudentCourses.value]);

// 通知公告测试数据
const announcements = ref([
  {
    title: '关于2025年春季学期期末考试安排的通知',
    content: '各位同学，2025年春季学期期末考试将于6月20日开始，请做好相关准备...',
    day: '15',
    month: '5月'
  },
  {
    title: '关于举办第十届大学生创新创业大赛的通知',
    content: '为促进大学生创新创业能力的培养，学校将于下月举办第十届创新创业大赛...',
    day: '10',
    month: '5月'
  },
  {
    title: '2025年暑期社会实践活动报名通知',
    content: '2025年暑期社会实践活动报名现已开始，请有意向参加的同学于5月30日前完成报名...',
    day: '05',
    month: '5月'
  }
]);

// 获取token
function getToken() {
  return localStorage.getItem('token');
}
function getUserId() {
  return localStorage.getItem('userId');
}
// 获取当前登录学生信息
const fetchStudentInfo = async () => {
  try {
    if (!userStore.userId) {
      studentInfo.value.name = '未登录';
      return;
    }
    const res = await getUser(userStore.userId);
    if (res.data && res.data.data) {
      const userData = res.data.data;
      studentInfo.value.name = userData.username || userData.name || '';
      studentInfo.value.avatar = userData.avatar || '';
      
      // 更新store
      userStore.updateUserInfo({
        name: userData.username || userData.name,
        avatar: userData.avatar
      });
    }
  } catch (e) {
    console.error('获取学生信息失败', e);
  }
};

// 获取学生课程和进度
const fetchStudentCourses = async () => {
  try {
    // 1. 获取学生课程
    const res = await getUserCourses(userStore.userId);
    if (res.data && res.data.data) {
      // 组装课程数据
      realCourses.value = res.data.data.map(c => ({
        title: c.name,
        teacher: c.teacherName || '未知教师',
        image: 'https://placeholder.svg?height=200&width=300',
        bgColor: '#2196f3',
        type: c.completed ? 1 : 0, // 1: 已结课, 0: 进行中
        id: c.id
      }));

      // 2. 获取每门课程的章节数和进度
      for (const course of realCourses.value) {
        // 获取课程详情
          const detailRes = await getCourseDetail(course.id);
        const chapters = detailRes.data?.data?.chapters || [];
        const totalUnits = chapters.length;

        // 获取练习记录
        const exerciseRes = await getExerciseRecords();
        const exerciseRecords = exerciseRes.data?.data || [];
        // 统计该课程已完成的练习数
        const completedUnits = exerciseRecords.filter(
          r => r.courseId === course.id && r.status === 'submitted'
        ).length;

        // 组装进度数据
        realStudentCourses.value.push({
          title: course.title,
          progress: totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0,
          completedUnits,
          totalUnits
        });
      }
    }
  } catch (e) {
    // 失败时不影响测试样例展示
    console.error('获取课程或进度失败', e);
  }
};

onMounted(() => {
if (!userStore.isLoggedIn) {
    // 处理未登录状态...
    router.push('/login');
    return;
  } 
  // 获取用户信息
  fetchStudentInfo();
  
  // 获取课程数据
  fetchStudentCourses();
});


</script>




<style scoped>
/* 全局样式 */
.student-homepage {
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  color: #333;
  background-color: #f0f7ff;
  min-height: 100vh;
}


/* 课程资源区域样式 */
.course-resources, .learning-progress, .announcements {
  padding: 20px;
  margin-bottom: 30px;
  background-color: rgba(0,0,0,0);
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  font-size: 20px;
  font-weight: 500;
  color: #333;
}

.view-more {
  color: #666;
  text-decoration: none;
  font-size: 14px;
}

.course-tabs {
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.tab {
  padding: 10px 20px;
  cursor: pointer;
  position: relative;
  color: #666;
  font-size: 16px;
}

.tab.active {
  color: #0056b3;
  font-weight: 500;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #0056b3;
}

.course-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.course-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.course-card:hover {
  transform: translateY(-5px);
}

.course-image {
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background-size: cover;
  background-position: center;
}

.course-title {
  font-size: 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.course-info {
  padding: 15px;
  background-color: white;
}

.course-info h4 {
  margin: 0 0 5px;
  font-size: 16px;
  color: #333;
}

.teacher {
  margin: 0;
  color: #666;
  font-size: 14px;
}

/* 学习进度区域样式 */
.progress-cards {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.progress-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
  border-left: 4px solid #0056b3;
}

.progress-info {
  flex: 1;
}

.progress-info h4 {
  margin: 0 0 10px;
  font-size: 16px;
}

.progress-bar-container {
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  margin-bottom: 5px;
}

.progress-bar {
  height: 100%;
  background-color: #0056b3;
  border-radius: 4px;
}

.progress-details {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
}

.continue-btn {
  padding: 6px 12px;
  background-color: #0056b3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.continue-btn:hover {
  background-color: #003d82;
}

/* 通知公告区域样式 */
.announcement-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.announcement-item {
  display: flex;
  padding: 15px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.notice-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 60px;
  margin-right: 15px;
  background-color: #0056b3;
  color: white;
  border-radius: 4px;
  padding: 5px;
}

.day {
  font-size: 20px;
  font-weight: bold;
}

.month {
  font-size: 12px;
}

.notice-content {
  flex: 1;
}

.notice-content h4 {
  margin: 0 0 5px;
  font-size: 16px;
}

.notice-content p {
  margin: 0;
  color: #666;
  font-size: 14px;
}


/* 弹窗样式 */

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
}

.course-code-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.course-code-input:focus {
  outline: none;
  border-color: #0056b3;
  box-shadow: 0 0 0 2px rgba(0, 86, 179, 0.2);
}


.confirm-button {
  padding: 8px 20px;
  background-color: #0056b3;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.confirm-button:hover {
  background-color: #003d82;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .course-list {
    grid-template-columns: 1fr;
  }
  
  .carousel-container {
    height: 300px;
  }
  
  .carousel-content h2 {
    font-size: 24px;
  }
  
  .progress-card {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .course-actions {
    margin-top: 10px;
    align-self: flex-end;
  }
}
</style>