<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
    <!-- 顶部导航栏 -->
    <header class="sticky top-0 z-10 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-white shadow-lg">
      <div class="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
        <div class="flex items-center space-x-4">
          <button @click="goBack" class="p-2.5 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50" title="返回上一页">
            <ArrowLeftIcon class="w-5 h-5" />
          </button>
          <h1 class="text-2xl font-bold tracking-tight">教师课程平台</h1>
        </div>
        <div class="flex items-center space-x-4">
          <button class="p-2.5 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50">
            <bell-icon class="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>

    <!-- 主要内容区域 -->
    <div class="max-w-7xl mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- 侧边栏导航 -->
        <aside class="md:col-span-1">
          <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
            <!-- 个人信息卡片 -->
            <div class="relative">
              <!-- 顶部装饰背景 -->
              <div class="h-32 bg-gradient-to-r from-blue-600 to-blue-400 rounded-t-2xl">
                <div class="absolute inset-0 opacity-20">
                  <div class="absolute -top-4 -right-4 w-32 h-32 bg-white rounded-full opacity-20"></div>
                  <div class="absolute top-10 -left-10 w-40 h-40 bg-white rounded-full opacity-10"></div>
                </div>
              </div>

              <!-- 头像和基本信息 -->
              <div class="relative px-6 pb-6 flex flex-col items-center">
                <div class="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-blue-300 p-1 shadow-xl transform -translate-y-1/2 mb-10">
                  <div class="w-full h-full rounded-full bg-white p-0.5 overflow-hidden">
                    <img :src="teacher.avatar" alt="教师头像" class="w-full h-full object-cover rounded-full" />
                  </div>
                </div>

                <div class="text-center -mt-6">
                  <h2 class="text-xl font-bold text-gray-800">{{ teacher.name }}</h2>
                  <p class="text-blue-600 font-medium">{{ teacher.title }}</p>
                  <div class="mt-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {{ teacher.department }}
                  </div>
                </div>
              </div>
            </div>

            <!-- 导航菜单 -->
            <nav class="px-4 pb-6 space-y-2">
              <button
                v-for="(item, index) in navItems"
                :key="index"
                @click="activeTab = item.id"
                :class="[
                  'w-full text-left px-5 py-3.5 rounded-xl flex items-center space-x-3.5 transition-all duration-300',
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-md transform scale-102'
                    : 'text-gray-700 hover:bg-blue-50'
                ]"
              >
                <component :is="item.icon" class="w-5 h-5" />
                <span class="font-medium">{{ item.name }}</span>
              </button>
            </nav>
          </div>
        </aside>

        <!-- 主内容区 -->
        <main class="md:col-span-3">
          <div class="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
            <!-- 个人信息 Tab -->
            <div v-if="activeTab === 'profile'" class="p-8">
              <div class="flex justify-between items-center mb-8">
                <h3 class="text-2xl font-bold text-gray-800 flex items-center">
                  <user-icon class="w-6 h-6 mr-2 text-blue-600" />
                  个人信息
                </h3>
                <button
                  @click="isEditing = !isEditing"
                  class="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center"
                >
                  <pencil-icon v-if="!isEditing" class="w-4 h-4 mr-2" />
                  <check-icon v-else class="w-4 h-4 mr-2" />
                  {{ isEditing ? '保存修改' : '编辑资料' }}
                </button>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="space-y-6">
                  <div class="group">
                    <label class="block text-sm font-medium text-gray-600 mb-2 group-hover:text-blue-600 transition-colors">姓名</label>
                    <input
                      v-if="isEditing"
                      v-model="teacher.name"
                      class="w-full p-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    />
                    <p v-else class="p-3.5 bg-blue-50 rounded-xl text-gray-800 border border-blue-100">{{ teacher.name }}</p>
                  </div>

                  <div class="group">
                    <label class="block text-sm font-medium text-gray-600 mb-2 group-hover:text-blue-600 transition-colors">职称</label>
                    <input
                      v-if="isEditing"
                      v-model="teacher.title"
                      class="w-full p-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    />
                    <p v-else class="p-3.5 bg-blue-50 rounded-xl text-gray-800 border border-blue-100">{{ teacher.title }}</p>
                  </div>

                  <div class="group">
                    <label class="block text-sm font-medium text-gray-600 mb-2 group-hover:text-blue-600 transition-colors">手机号码</label>
                    <input
                      v-if="isEditing"
                      v-model="teacher.phone"
                      class="w-full p-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    />
                    <p v-else class="p-3.5 bg-blue-50 rounded-xl text-gray-800 border border-blue-100">{{ teacher.phone }}</p>
                  </div>
                </div>

                <div class="space-y-6">
                  <div class="group">
                    <label class="block text-sm font-medium text-gray-600 mb-2 group-hover:text-blue-600 transition-colors">邮箱</label>
                    <input
                      v-if="isEditing"
                      v-model="teacher.email"
                      class="w-full p-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    />
                    <p v-else class="p-3.5 bg-blue-50 rounded-xl text-gray-800 border border-blue-100">{{ teacher.email }}</p>
                  </div>

                  <div class="group">
                    <label class="block text-sm font-medium text-gray-600 mb-2 group-hover:text-blue-600 transition-colors">所属院系</label>
                    <select
                      v-if="isEditing"
                      v-model="teacher.department"
                      class="w-full p-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    >
                      <option v-for="dept in departments" :key="dept" :value="dept">{{ dept }}</option>
                    </select>
                    <p v-else class="p-3.5 bg-blue-50 rounded-xl text-gray-800 border border-blue-100">{{ teacher.department }}</p>
                  </div>

                  <div class="group">
                    <label class="block text-sm font-medium text-gray-600 mb-2 group-hover:text-blue-600 transition-colors">研究方向</label>
                    <textarea
                      v-if="isEditing"
                      v-model="teacher.research"
                      rows="3"
                      class="w-full p-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    ></textarea>
                    <p v-else class="p-3.5 bg-blue-50 rounded-xl text-gray-800 border border-blue-100">{{ teacher.research }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 账号安全 Tab -->
            <div v-if="activeTab === 'security'" class="p-8">
              <div class="flex items-center mb-8">
                <lock-icon class="w-6 h-6 mr-2 text-blue-600" />
                <h3 class="text-2xl font-bold text-gray-800">账号安全</h3>
              </div>

              <div class="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border border-blue-100 shadow-sm">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div class="mb-4 md:mb-0">
                    <h4 class="text-lg font-semibold text-gray-800 mb-1">登录密码</h4>
                    <p class="text-gray-500">定期更改密码可以保护账号安全</p>
                    <p class="text-sm text-blue-600 mt-2">上次更新时间: {{ teacher.passwordLastUpdated }}</p>
                  </div>
                  <button
                    @click="showPasswordModal = true"
                    class="px-5 py-2.5 bg-white border-2 border-blue-500 text-blue-600 rounded-xl hover:bg-blue-50 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 flex items-center justify-center"
                  >
                    <key-icon class="w-4 h-4 mr-2" />
                    修改密码
                  </button>
                </div>

                <!-- 安全提示卡片 -->
                <div class="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start">
                  <alert-circle-icon class="w-5 h-5 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h5 class="font-medium text-yellow-800 mb-1">安全提示</h5>
                    <p class="text-sm text-yellow-700">
                      为了保障您的账号安全，建议使用强密码并定期更换。请勿在不同平台使用相同的密码，也不要将密码告知他人。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 教学概况 Tab -->
            <div v-if="activeTab === 'teaching'" class="p-8">
              <div class="flex items-center mb-8">
                <book-open-icon class="w-6 h-6 mr-2 text-blue-600" />
                <h3 class="text-2xl font-bold text-gray-800">教学概况</h3>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div class="bg-gradient-to-br from-blue-600 to-blue-400 rounded-2xl p-6 text-white shadow-lg transform transition-transform duration-300 hover:scale-105">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-blue-100 font-medium mb-1">当前课程</p>
                      <div class="text-4xl font-bold">{{ teacher.stats.courseCount }}</div>
                    </div>
                    <div class="bg-white bg-opacity-20 p-3 rounded-xl">
                      <book-icon class="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div class="mt-4 text-sm text-blue-100">
                    本学期共开设 {{ teacher.stats.courseCount }} 门课程
                  </div>
                </div>

                <div class="bg-gradient-to-br from-blue-500 to-blue-300 rounded-2xl p-6 text-white shadow-lg transform transition-transform duration-300 hover:scale-105">
                  <div class="flex items-center justify-between">
                    <div>
                      <p class="text-blue-100 font-medium mb-1">学生总数</p>
                      <div class="text-4xl font-bold">{{ teacher.stats.studentCount }}</div>
                    </div>
                    <div class="bg-white bg-opacity-20 p-3 rounded-xl">
                      <users-icon class="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div class="mt-4 text-sm text-blue-100">
                    共有 {{ teacher.stats.studentCount }} 名学生选修您的课程
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
                <div class="p-6 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-white">
                  <h4 class="font-semibold text-gray-800 flex items-center">
                    <calendar-icon class="w-5 h-5 mr-2 text-blue-600" />
                    本学期课程
                  </h4>
                </div>
                <div class="overflow-x-auto">
                  <table class="min-w-full">
                    <thead>
                      <tr class="bg-gradient-to-r from-gray-50 to-white">
                        <th class="py-4 px-6 text-left text-sm font-semibold text-gray-600">课程名称</th>
                        <th class="py-4 px-6 text-left text-sm font-semibold text-gray-600">学生人数</th>
                        <th class="py-4 px-6 text-left text-sm font-semibold text-gray-600">课时</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(course, index) in teacher.courses" :key="index"
                          class="border-t border-gray-100 hover:bg-blue-50 transition-colors duration-150">
                        <td class="py-4 px-6 text-gray-800 font-medium">{{ course.name }}</td>
                        <td class="py-4 px-6 text-gray-800">
                          <div class="flex items-center">
                            <users-icon class="w-4 h-4 text-blue-500 mr-2" />
                            {{ course.students }}
                          </div>
                        </td>
                        <td class="py-4 px-6 text-gray-800">
                          <div class="flex items-center">
                            <clock-icon class="w-4 h-4 text-blue-500 mr-2" />
                            {{ course.hours }}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>

    <!-- 修改密码弹窗 -->
    <div v-if="showPasswordModal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 transform transition-all duration-300 scale-100">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-gray-800 flex items-center">
            <key-icon class="w-5 h-5 mr-2 text-blue-600" />
            修改密码
          </h3>
          <button @click="closePasswordModal" class="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors">
            <x-icon class="h-6 w-6" />
          </button>
        </div>

        <form @submit.prevent="changePassword" class="space-y-5">
          <div class="group">
            <label for="currentPassword" class="block text-sm font-medium text-gray-600 mb-2 group-hover:text-blue-600 transition-colors">当前密码</label>
            <div class="relative">
              <input
                :type="showCurrentPassword ? 'text' : 'password'"
                id="currentPassword"
                v-model="passwordForm.currentPassword"
                class="w-full p-3.5 pl-11 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                :class="{'border-red-500 ring-1 ring-red-500': passwordErrors.currentPassword}"
                placeholder="请输入当前密码"
                required
              />
              <lock-icon class="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <button
                type="button"
                @click="showCurrentPassword = !showCurrentPassword"
                class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
              >
                <eye-icon v-if="!showCurrentPassword" class="h-5 w-5" />
                <eye-off-icon v-else class="h-5 w-5" />
              </button>
            </div>
            <p v-if="passwordErrors.currentPassword" class="mt-2 text-sm text-red-600 flex items-center">
              <alert-circle-icon class="h-4 w-4 mr-1" />
              {{ passwordErrors.currentPassword }}
            </p>
          </div>

          <div class="group">
            <label for="newPassword" class="block text-sm font-medium text-gray-600 mb-2 group-hover:text-blue-600 transition-colors">新密码</label>
            <div class="relative">
              <input
                :type="showNewPassword ? 'text' : 'password'"
                id="newPassword"
                v-model="passwordForm.newPassword"
                class="w-full p-3.5 pl-11 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                :class="{'border-red-500 ring-1 ring-red-500': passwordErrors.newPassword}"
                placeholder="请输入新密码"
                required
              />
              <key-icon class="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <button
                type="button"
                @click="showNewPassword = !showNewPassword"
                class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
              >
                <eye-icon v-if="!showNewPassword" class="h-5 w-5" />
                <eye-off-icon v-else class="h-5 w-5" />
              </button>
            </div>
            <p v-if="passwordErrors.newPassword" class="mt-2 text-sm text-red-600 flex items-center">
              <alert-circle-icon class="h-4 w-4 mr-1" />
              {{ passwordErrors.newPassword }}
            </p>

            <!-- 密码强度指示器 -->
            <div v-if="passwordForm.newPassword" class="mt-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm text-gray-600">密码强度</span>
                <span class="text-sm font-medium px-2.5 py-0.5 rounded-full" :class="passwordStrengthBadgeColor">{{ passwordStrengthText }}</span>
              </div>
              <div class="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-500"
                  :class="passwordStrengthBarColor"
                  :style="`width: ${passwordStrength * 25}%`"
                ></div>
              </div>
              <ul class="mt-3 text-sm text-gray-600 space-y-2">
                <li class="flex items-center" :class="{'text-green-600': hasMinLength}">
                  <div class="w-5 h-5 mr-2 flex items-center justify-center">
                    <check-icon v-if="hasMinLength" class="h-4 w-4" />
                    <x-icon v-else class="h-4 w-4 text-gray-400" />
                  </div>
                  至少8个字符
                </li>
                <li class="flex items-center" :class="{'text-green-600': hasUpperCase}">
                  <div class="w-5 h-5 mr-2 flex items-center justify-center">
                    <check-icon v-if="hasUpperCase" class="h-4 w-4" />
                    <x-icon v-else class="h-4 w-4 text-gray-400" />
                  </div>
                  至少包含一个大写字母
                </li>
                <li class="flex items-center" :class="{'text-green-600': hasLowerCase}">
                  <div class="w-5 h-5 mr-2 flex items-center justify-center">
                    <check-icon v-if="hasLowerCase" class="h-4 w-4" />
                    <x-icon v-else class="h-4 w-4 text-gray-400" />
                  </div>
                  至少包含一个小写字母
                </li>
                <li class="flex items-center" :class="{'text-green-600': hasNumber}">
                  <div class="w-5 h-5 mr-2 flex items-center justify-center">
                    <check-icon v-if="hasNumber" class="h-4 w-4" />
                    <x-icon v-else class="h-4 w-4 text-gray-400" />
                  </div>
                  至少包含一个数字
                </li>
              </ul>
            </div>
          </div>

          <div class="group">
            <label for="confirmPassword" class="block text-sm font-medium text-gray-600 mb-2 group-hover:text-blue-600 transition-colors">确认新密码</label>
            <div class="relative">
              <input
                :type="showConfirmPassword ? 'text' : 'password'"
                id="confirmPassword"
                v-model="passwordForm.confirmPassword"
                class="w-full p-3.5 pl-11 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                :class="{'border-red-500 ring-1 ring-red-500': passwordErrors.confirmPassword}"
                placeholder="请再次输入新密码"
                required
              />
              <check-icon class="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
              >
                <eye-icon v-if="!showConfirmPassword" class="h-5 w-5" />
                <eye-off-icon v-else class="h-5 w-5" />
              </button>
            </div>
            <p v-if="passwordErrors.confirmPassword" class="mt-2 text-sm text-red-600 flex items-center">
              <alert-circle-icon class="h-4 w-4 mr-1" />
              {{ passwordErrors.confirmPassword }}
            </p>
          </div>

          <div class="pt-4">
            <button
              type="submit"
              class="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              :disabled="isSubmitting"
            >
              <div class="flex items-center justify-center">
                <loader-icon v-if="isSubmitting" class="animate-spin h-5 w-5 mr-2" />
                <span>{{ isSubmitting ? '提交中...' : '确认修改' }}</span>
              </div>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  BellIcon,
  UserIcon,
  LockIcon,
  BookOpenIcon,
  PencilIcon,
  CheckIcon,
  XIcon,
  EyeIcon,
  EyeOffIcon,
  ArrowLeftIcon,
  AlertCircleIcon,
  KeyIcon,
  BookIcon,
  UsersIcon,
  CalendarIcon,
  ClockIcon,
  LoaderIcon
} from 'lucide-vue-next'

const router = useRouter()

// 导航项
const navItems = [
  { id: 'profile', name: '个人信息', icon: UserIcon },
  { id: 'security', name: '账号安全', icon: LockIcon },
  { id: 'teaching', name: '教学概况', icon: BookOpenIcon },
]

// 所属院系列表
const departments = [
  '计算机科学与技术学院',
  '数学学院',
  '物理学院',
  '化学学院',
  '生物学院',
  '经济学院',
  '管理学院'
]

// 教师信息
const teacher = ref({
  name: '张教授',
  title: '副教授',
  avatar: '/placeholder.svg?height=200&width=200',
  email: 'zhang.professor@university.edu',
  phone: '13800138000',
  department: '计算机科学与技术学院',
  research: '人工智能、机器学习、自然语言处理',
  passwordLastUpdated: '2023-09-15',
  stats: {
    courseCount: 4,
    studentCount: 210
  },
  courses: [
    { name: '数据结构', students: 65, hours: 48 },
    { name: '算法分析', students: 42, hours: 32 },
    { name: '机器学习导论', students: 56, hours: 48 },
    { name: '自然语言处理', students: 47, hours: 32 }
  ]
})

// 页面状态
const activeTab = ref('profile')
const isEditing = ref(false)

// 返回上一页
const goBack = () => {
  router.back()
}

// 修改密码相关状态
const showPasswordModal = ref(false)
const showCurrentPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)
const isSubmitting = ref(false)

// 密码表单数据
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 密码错误信息
const passwordErrors = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 密码强度检查
const hasMinLength = computed(() => passwordForm.newPassword.length >= 8)
const hasUpperCase = computed(() => /[A-Z]/.test(passwordForm.newPassword))
const hasLowerCase = computed(() => /[a-z]/.test(passwordForm.newPassword))
const hasNumber = computed(() => /[0-9]/.test(passwordForm.newPassword))

// 计算密码强度 (0-4)
const passwordStrength = computed(() => {
  let strength = 0
  if (hasMinLength.value) strength++
  if (hasUpperCase.value) strength++
  if (hasLowerCase.value) strength++
  if (hasNumber.value) strength++
  return strength
})

// 密码强度文本
const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value
  if (strength === 0) return '非常弱'
  if (strength === 1) return '弱'
  if (strength === 2) return '中等'
  if (strength === 3) return '强'
  return '非常强'
})

// 密码强度颜色
const passwordStrengthColor = computed(() => {
  const strength = passwordStrength.value
  if (strength === 0) return 'text-red-500'
  if (strength === 1) return 'text-red-500'
  if (strength === 2) return 'text-yellow-500'
  if (strength === 3) return 'text-green-500'
  return 'text-green-600'
})

// 密码强度徽章颜色
const passwordStrengthBadgeColor = computed(() => {
  const strength = passwordStrength.value
  if (strength === 0) return 'bg-red-100 text-red-800'
  if (strength === 1) return 'bg-red-100 text-red-800'
  if (strength === 2) return 'bg-yellow-100 text-yellow-800'
  if (strength === 3) return 'bg-green-100 text-green-800'
  return 'bg-green-100 text-green-800'
})

// 密码强度条颜色
const passwordStrengthBarColor = computed(() => {
  const strength = passwordStrength.value
  if (strength === 0) return 'bg-red-500'
  if (strength === 1) return 'bg-red-500'
  if (strength === 2) return 'bg-yellow-500'
  if (strength === 3) return 'bg-green-500'
  return 'bg-green-600'
})

// 关闭密码修改弹窗
const closePasswordModal = () => {
  showPasswordModal.value = false
  resetPasswordForm()
}

// 重置密码表单
const resetPasswordForm = () => {
  passwordForm.currentPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  passwordErrors.currentPassword = ''
  passwordErrors.newPassword = ''
  passwordErrors.confirmPassword = ''
  showCurrentPassword.value = false
  showNewPassword.value = false
  showConfirmPassword.value = false
}

// 验证密码表单
const validatePasswordForm = () => {
  let isValid = true

  // 重置错误信息
  passwordErrors.currentPassword = ''
  passwordErrors.newPassword = ''
  passwordErrors.confirmPassword = ''

  // 验证当前密码
  if (!passwordForm.currentPassword) {
    passwordErrors.currentPassword = '请输入当前密码'
    isValid = false
  }

  // 验证新密码
  if (!passwordForm.newPassword) {
    passwordErrors.newPassword = '请输入新密码'
    isValid = false
  } else if (passwordForm.newPassword.length < 8) {
    passwordErrors.newPassword = '密码长度至少为8个字符'
    isValid = false
  } else if (passwordStrength.value < 3) {
    passwordErrors.newPassword = '密码强度不足，请设置更复杂的密码'
    isValid = false
  } else if (passwordForm.newPassword === passwordForm.currentPassword) {
    passwordErrors.newPassword = '新密码不能与当前密码相同'
    isValid = false
  }

  // 验证确认密码
  if (!passwordForm.confirmPassword) {
    passwordErrors.confirmPassword = '请确认新密码'
    isValid = false
  } else if (passwordForm.confirmPassword !== passwordForm.newPassword) {
    passwordErrors.confirmPassword = '两次输入的密码不一致'
    isValid = false
  }

  return isValid
}

// 修改密码
const changePassword = async () => {
  if (!validatePasswordForm()) return

  try {
    isSubmitting.value = true

    // 模拟API请求
    await new Promise(resolve => setTimeout(resolve, 1500))

    // 更新密码最后修改时间
    teacher.value.passwordLastUpdated = new Date().toLocaleDateString()

    // 显示成功消息
    alert('密码修改成功！')

    // 关闭弹窗
    closePasswordModal()
  } catch (error) {
    console.error('修改密码失败:', error)
    alert('修改密码失败，请稍后重试')
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style>
/* 只保留必要的自定义样式 */
.scale-102 {
  transform: scale(1.02);
}

/* 移除其他自定义样式，改用 Tailwind 类 */
</style>
