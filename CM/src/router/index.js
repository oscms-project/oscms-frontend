import { createRouter, createWebHistory } from 'vue-router'

// 路由配置
const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('@/views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue')
  },
  {
    path: '/student-home',
    name: 'StudentHome',
    component: () => import('@/views/StudentHome.vue')
  },
  {
    path: '/teacherhome',
    name: 'TeacherHome',
    component: () => import('@/views/TeacherHome.vue')
  },
  {
    path: '/student/courses',
    name: 'StudentCourses',
    component: () => import('@/views/StudentCourses.vue')
  },
  {
    path: '/teacher/courses',
    name: 'TeacherCourses',
    component: () => import('@/views/CourseDetails.vue')
  },
 
  {
    path: '/course/:id/management',
    name: 'CourseManagement',
    component: () => import('@/views/CourseManagement.vue')
  },
  {
    path: '/teacher/profile',
    name: 'TeacherProfile',
    component: () => import('@/views/TeacherProfile.vue')
  },
  {
    path: '/exercise/:id',
    name: 'ExercisePage',
    component: () => import('@/views/ExercisePage.vue'),
    meta: { requiresAuth: true, role: 'student' }
  },
  {
    path: '/feedback/:id',
    name: 'ExerciseFeedback',
    component: () => import('@/views/ExerciseFeedback.vue'),
    meta: { requiresAuth: true, role: 'student' }
  },
  {
    path: '/retry/:id',
    name: 'IncorrectQuestionsRetry',
    component: () => import('@/views/IncorrectQuestionsRetry.vue'),
    meta: { requiresAuth: true, role: 'student' }
  },
  {
    path: '/teacher/create',
    name: 'TeacherCreateTask',
    component: () => import('@/views/TeacherCreateTask.vue'),
    meta: { requiresAuth: true, role: 'teacher' }
  },
  {
    path: '/teacher/grade/:id',
    name: 'TeacherGradeExercise',
    component: () => import('@/views/TeacherGradeExercise.vue'),
    meta: { requiresAuth: true, role: 'teacher' }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router