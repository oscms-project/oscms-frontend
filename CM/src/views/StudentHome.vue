<template>
  <div class="student-homepage">
    <!-- 页眉用户信息组件区域 -->
    <BaseHeader :user="studentInfo" @avatar-click="navigateToUserProfile" />
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
          @click="navigateToCourseDetail(course)"
        >
          <div class="course-image" :style="{ backgroundImage: `url(${course.image})` }">
            <h3 class="course-title">{{ course.title }}</h3>
          </div>
          <div class="course-info">
            <h4>{{ course.title }}</h4>
            
          </div>
        </div>
      </div>
    </div>
    
    <!-- 学习进度区域 -->
    <!-- filepath: e:\test\git_test\CM\src\views\StudentHome.vue -->
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
        <!-- 添加课程概览信息 -->
        <div class="progress-overview">
          <span class="progress-label">已完成练习：<b>{{ course.completedUnits }}</b></span>
          <span class="progress-label">未完成练习：<b>{{ course.uncompletedUnits }}</b></span>
          <span class="progress-label">总练习数：{{ course.totalUnits }}</span>
        </div>
        <!-- 已完成的练习进度条（蓝色） -->
        <div class="progress-bar-container">
          <div class="progress-bar completed" :style="{ width: (course.completedUnits / course.totalUnits * 100) + '%' }"></div>
        </div>
        <!-- 未完成的练习进度条（灰色） -->
        <div class="progress-bar-container">
          <div class="progress-bar uncompleted" :style="{ width: (course.uncompletedUnits / course.totalUnits * 100) + '%' }"></div>
        </div>
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
import { useCourseStore } from '@/stores/course'
import { useRouter } from 'vue-router';
const router = useRouter();
//api中封装的方法
import { getUser, getUserCourses } from '@/api/user'
import { getStudentClasses, getStudentAssignmentSummary , enrollClassById} from '@/api/class';
//component中封装的组件
import BaseCarousel from '@/components/BaseCarousel.vue'
import BaseHeader from '@/components/BaseHeader.vue'
import BaseFooter from '@/components/BaseFooter.vue'
import BaseWindow from '@/components/BaseWindow.vue';
import headImage from '@/assets/head.jpg';
// 学生信息（初始为空，登录后获取）
const userStore = useUserStore();
const courseStore = useCourseStore()
const studentInfo = ref({
  name: userStore.name,
  id: userStore.userId,
  avatar: headImage
});

const navigateToUserProfile = () => {
  console.log("StudentHome.vue: navigateToUserProfile called. Attempting to navigate to TeacherProfile.");
  router.push({ name: 'TeacherProfile' }); // 使用命名路由
};

// 课程详情页导航函数
const navigateToCourseDetail = (course) => {
  // 使用store保存课程ID而非路由参数
  courseStore.setCurrentCourseId(course.id)
  
  // 跳转到简洁的URL，无需查询参数
  router.push('/student/courses')
};

// 加入课程弹窗状态
const showJoinCourseModal = ref(false);
const courseCode = ref('');

// 加入课程方法
const joinCourse = async () => {
  if (!courseCode.value) {
    alert('请输入班级ID');
    return;
  }
  
  try {
    // 发送实际的API请求
    const res = await enrollClassById(courseCode.value, userStore.userId);
    
    if (res.data && res.data.code === 200) {
      alert('成功加入课程！');
      
      // 重置并关闭弹窗
      courseCode.value = '';
      showJoinCourseModal.value = false;
      
      // 刷新课程列表和进度数据
      fetchStudentCoursesList();
      fetchStudentCourses();
    } else {
      alert(res.data?.message || '加入课程失败，请检查班级ID');
    }
  } catch (error) {
    console.error('加入课程失败:', error);
    alert(error.response?.data?.message || '加入课程失败，请稍后再试');
  }
};


// 课程选项卡
const courseTabs = ref(['进行中', '已结课']);
const activeTab = ref(0);

// 测试课程数据
const testCourses = ref([
  
]);

// 后端课程数据
const realCourses = ref([]);
const fetchStudentCoursesList = async () => {
  try {
    const res = await getUserCourses(userStore.userId);
    if (res.data && res.data.data) {
      realCourses.value = res.data.data.map(c => ({
        id: c.id,
        title: c.name,
        teacher: c.teacherName || '未知教师',
        image: c.image || 'https://placeholder.svg?height=200&width=300',
        bgColor: '#2196f3',
        type: c.completed ? 1 : 0 // 1: 已结课, 0: 进行中
      }));
    }
  } catch (e) {
    console.error('获取课程列表失败', e);
  }
};
// 合并课程数据
const courses = computed(() => [...testCourses.value, ...realCourses.value]);

// 课程状态筛选
const filteredCourses = computed(() => {
  return courses.value.filter(course => course.type === activeTab.value);
});

// 测试进度数据
const testStudentCourses = ref([
]);
// 修改fetchStudentCourses函数中组装进度数据的部分
// 修改相关代码：
// realStudentCourses.value.push({
//   title: course.title,
//   completedUnits,
//   totalUnits,
//   uncompletedUnits: totalUnits - completedUnits // 添加未完成练习数
// });

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
    // 1. 获取学生加入的所有班级及其课程信息
    const classesRes = await getStudentClasses(userStore.userId);
    const studentClasses = classesRes.data?.data || [];
    
    // 2. 清空之前的进度数据
    realStudentCourses.value = [];
    
    // 3. 遍历每个班级，查作业完成情况
    for (const cls of studentClasses) {
      try {
        // 检查classId是否有效
        if (!cls.classId) {
          console.warn('跳过无效的班级数据:', cls);
          continue;
        }
        
        const summaryRes = await getStudentAssignmentSummary(cls.classId, userStore.userId);
        if (summaryRes.data && summaryRes.data.data) {
          const summary = summaryRes.data.data;
          // 4. 组装进度数据，显示课程名
          realStudentCourses.value.push({
            title: cls.courseName, // 用接口返回的课程名
            completedUnits: summary.completedAssignments,
            totalUnits: summary.totalAssignments,
            uncompletedUnits: summary.pendingAssignments
          });
        }
      } catch (err) {
        console.error(`获取班级${cls.className || cls.classId}的作业进度失败:`, err);
      }
    }
  } catch (e) {
    console.error('获取班级或进度失败', e);
  }
};
onMounted(() => {
// if (!userStore.isLoggedIn) {
//     // 处理未登录状态...
//     router.push('/login');
//     return;
//   } 
  // 获取用户信息
  fetchStudentInfo();
   fetchStudentCoursesList();
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
/* 修改进度条样式 */
.progress-overview {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 13px;
}

.progress-label {
  color: #666;
}

.progress-bar-container {
  height: 8px;
  background-color: #f0f0f0;
  border-radius: 4px;
  margin-bottom: 5px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  border-radius: 4px;
}

.progress-bar.completed {
  background-color: #1e88e5; /* 蓝色进度条 */
}

.progress-bar.uncompleted {
  background-color: #bdbdbd; /* 灰色进度条 */
}

.progress-details {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #666;
  margin-bottom: 10px;
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