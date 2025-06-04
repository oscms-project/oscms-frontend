<template>
  <div class="teacher-homepage">
    <!-- 页眉用户信息组件区域 -->
    <BaseHeader :user="teacherInfo" />
    <!-- 轮播图区域 -->
    <BaseCarousel />

    <!-- 课程资源区域 -->
    <div class="course-resources">
      <div class="section-header">
        <h2>我的课程</h2>
        <a href="#" class="view-more" @click.prevent="showCreateCourseModal = true">创建课程 &gt;</a>
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

    <!-- 创建课程弹窗 -->
    <BaseWindow :show="showCreateCourseModal" title="创建新课程" @close="showCreateCourseModal = false">
      <div class="form-group">
        <label for="course-name">课程名称</label>
        <input 
          type="text" 
          id="course-name" 
          v-model="newCourse.name" 
          placeholder="请输入课程名称" 
          class="course-input"
        />
      </div>
      <div class="form-group">
        <label for="course-code">课程代码</label>
        <input 
          type="text" 
          id="course-code" 
          v-model="newCourse.code" 
          placeholder="请输入课程代码" 
          class="course-input"
        />
      </div>
      <div class="form-group">
    <label for="course-outline">课程大纲</label>
    <textarea
      id="course-outline"
      v-model="newCourse.outline"
      placeholder="请输入课程大纲"
      class="course-input"
      rows="3"
    ></textarea>
  </div>
    <div class="form-group">
    <label for="course-assessment">课程考核方式</label>
    <input 
      type="text" 
      id="course-assessment" 
      v-model="newCourse.assessment"
      placeholder="例如：平时+期末考试"
      class="course-input"
    />
  </div>
  <div class="form-group">
    <label for="course-chapters">课程章节（用逗号分隔）</label>
    <input 
      type="text" 
      id="course-chapters" 
      v-model="newCourse.chapters"
      placeholder="例如：绪论,第一章,第二章"
      class="course-input"
    />
  </div>
      <template #footer>
        <button class="confirm-button" @click="createCourse">确认创建</button>
      </template>
    </BaseWindow>

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
import BaseWindow from '@/components/BaseWindow.vue'

///JWT解码函数
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

const userStore = useUserStore();
const courseStore = useCourseStore();
const router = useRouter(); // 添加路由器
const teacherInfo = ref({
  // 使用store中的信息初始化
  name: userStore.name,
  id: userStore.userId,
  avatar: userStore.avatar,
  role: userStore.role
});


// 教师课程数据
const allCourses = ref([]);

// 只展示进行中的课程
const filteredCourses = computed(() =>
  allCourses.value.filter(course => !course.completed)
);

// 创建课程弹窗
const showCreateCourseModal = ref(false);
const newCourse = ref({
   name: '',
  code: '',
  outline: '',
  assessment: '',
  chapters: '', // 用逗号分隔的字符串
});

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

// 创建课程
const createCourse = async () => {
  if (
    !newCourse.value.name ||
    !newCourse.value.code ||
    !newCourse.value.outline ||
    !newCourse.value.assessment ||
    !newCourse.value.chapters

  ) {
    alert('请填写完整课程信息');
    return;
  }
  try {
    // 处理章节为数组
    // 处理章节为数组 - 优化版本
const chaptersArr = newCourse.value.chapters
  .split(',')
  .map(s => s.trim()) // 先清除每个章节的前后空格
  .filter(title => title.length > 0) // 过滤掉空章节名
  .map((title, index) => ({
    title, // 章节名称
    order: index + 1 // 章节序号，从1开始递增
  }));

    const res = await apiCreateCourse({
      name: newCourse.value.name,
      code: newCourse.value.code,
      outline: newCourse.value.outline,
      assessment: newCourse.value.assessment,
      chapters: chaptersArr,
      teacherId: userStore.userId // 使用userStore而不是localStorage
    });
    if (res.data && (res.data.code === 200 || res.data.success)) {
      alert('课程创建成功！');
      showCreateCourseModal.value = false;
      newCourse.value = {
        name: '',
        code: '',
        outline: '',
        assessment: '',
        chapters: '',
      };
      fetchTeacherCourses();
    } else {
      alert(res.data?.message || '课程创建失败，请重试');
    }
  } catch (e) {
    alert('课程创建失败，请重试');
  }
};

// 课程详情页导航函数
const navigateToCourseDetail = (course) => {
  // 使用 courseStore 存储当前选中的课程ID
  courseStore.setCurrentCourseId(course.id);
  
  // 使用简洁的URL进行导航
  router.push(`/teacher/courses`);
};

onMounted(() => {
  // 不再需要解析token，直接使用store中信息
  // if (!userStore.isLoggedIn) {
  //   // 处理未登录状态
  //   router.push('/login');
  //   return;
  // }
  /*
  if (!userStore.isLoggedIn) {
    // 处理未登录状态
    router.push('/login');
    return;
  }
  */
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