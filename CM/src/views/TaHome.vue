<template>
  <div class="teacher-homepage">
    <!-- 页眉用户信息组件区域 -->
    <BaseHeader :user="teacherInfo" @avatar-click="navigateToUserProfile" />
    <!-- 轮播图区域 -->
    <BaseCarousel />

    <!-- 课程资源区域 -->
    <div class="course-resources">
      <div class="section-header">
        <h2>我的课程</h2>
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
            <h3 class="course-title">{{ course.name }}</h3>
          </div>
          <div class="course-info">
            <h4>{{ course.name }}</h4>
            <p class="course-code">课程代码：{{ course.code }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 页脚区域 -->
    <BaseFooter />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { useCourseStore } from '@/stores/course';
import { useRouter } from 'vue-router';
import { getUser } from '@/api/user'
import { getCourses, createCourse as apiCreateCourse } from '@/api/course'
import BaseCarousel from '@/components/BaseCarousel.vue'
import BaseHeader from '@/components/BaseHeader.vue'
import BaseFooter from '@/components/BaseFooter.vue'
import headImage from '@/assets/head.jpg';

const userStore = useUserStore();
const courseStore = useCourseStore();
const router = useRouter(); // 添加路由器

const navigateToUserProfile = () => {
  console.log("TaHome.vue: navigateToUserProfile called. Attempting to navigate to TeacherProfile.");
  router.push({ name: 'TeacherProfile' });
};
const teacherInfo = ref({
  // 使用store中的信息初始化
  name: userStore.name,
  id: userStore.userId,
  avatar: headImage,
  role: userStore.role
});


// 教师课程数据
const allCourses = ref([]);

// 只展示进行中的课程
const filteredCourses = computed(() =>
  allCourses.value.filter(course => !course.completed)
);



// 获取token和userId
function getUserId() {
  return localStorage.getItem('userId');
}

// 获取教师信息
const fetchTeacherInfo = async () => {
  try {
    if (!userStore.userId) {
      teacherInfo.value.name = '未登录';
      return;
    }
    const res = await getUser(userStore.userId);
    if (res.data && res.data.data) {
      const userData = res.data.data;
      teacherInfo.value.name = userData.username || userData.name || '';
      teacherInfo.value.avatar = userData.avatar || '';
      
      // 更新store
      userStore.updateUserInfo({
        name: userData.username || userData.name,
        avatar: userData.avatar
      });
    }
  } catch (e) {
    console.error('获取教师信息失败', e);
  }
};

// 获取教师教授的所有课程
const fetchTeacherCourses = async () => {
  try {
    // 只查自己教授的课程
  const res = await getCourses({ teacherId: userStore.userId });
    if (res.data && res.data.data) {
      allCourses.value = res.data.data.map(course => ({
        name: course.name,
        code: course.code,
        image: course.image || 'https://placeholder.svg?height=200&width=300',
        bgColor: course.bgColor || '#0a4d8c',
        completed: course.completed || false,
        id: course.id
      }));
    } else {
      allCourses.value = [];
    }
  } catch (e) {
    console.error('获取课程失败', e);
    allCourses.value = [];
  }
};



// 课程详情页导航函数
const navigateToCourseDetail = (course) => {
  // 使用 courseStore 存储当前选中的课程ID
  courseStore.setCurrentCourseId(course.id);
  
  // 使用简洁的URL进行导航
  router.push(`/ta/courses`);
};

onMounted(() => {
  fetchTeacherInfo();
  fetchTeacherCourses();
});

onUnmounted(() => {
  if (slideInterval) {
    clearInterval(slideInterval);
  }
});
</script>

<style scoped>
/* 复用student-homepage的样式，略有调整 */
.teacher-homepage {
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
  color: #333;
  background-color: #f0f7ff;
  min-height: 100vh;
}

.course-resources {
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
  cursor: pointer;
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
.course-code {
  margin: 0;
  color: #666;
  font-size: 14px;
}


.form-group {
  margin-bottom: 15px;
}
.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
}
.course-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}
.course-input:focus {
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
</style>