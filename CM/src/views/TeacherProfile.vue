<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
    <!-- 顶部导航栏 -->
    <header class="sticky top-0 z-10 bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 text-white shadow-lg">
      <div class="max-w-7xl mx-auto flex justify-between items-center py-4 px-6">
        <div class="flex items-center space-x-4">
          <button @click="goBack" class="p-2.5 bg-white bg-opacity-20 rounded-full hover:bg-opacity-30 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50" title="返回上一页">
            <ArrowLeftIcon class="w-5 h-5" />
          </button>
          <h1 class="text-2xl font-bold tracking-tight">个人信息</h1>
        </div>
        <div class="flex items-center space-x-4">
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
              <div class="relative px-8 pt-6 pb-8 flex flex-col items-center">


                <div class="text-center">
                  <h2 class="text-xl font-bold text-gray-800">{{ teacher.name }}</h2>
                  <p class="text-blue-600 font-medium">{{ teacher.title }}</p>

                </div>
              </div>
            </div>

            <!-- 导航菜单 -->
            <nav class="px-4 pb-6 space-y-3">
              <button
                v-for="(item, index) in navItems"
                :key="index"
                @click="activeTab = item.id"
                :class="[
                  'w-full text-left px-5 py-4 rounded-xl flex items-center space-x-3.5 transition-all duration-300',
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
              </div>

              <div v-if="isLoading" class="text-center py-10">
                <p class="text-gray-500">正在加载用户信息...</p>
              </div>
              <div v-else-if="teacher && teacher.id" class="space-y-6">
                <div class="group p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <label class="block text-sm font-medium text-gray-500 mb-1">用户ID</label>
                  <div class="flex items-center">
                    <FingerprintIcon class="w-5 h-5 mr-2 text-blue-500" />
                    <p class="text-lg text-gray-800">{{ teacher.id }}</p>
                  </div>
                </div>

                <div class="group p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <label class="block text-sm font-medium text-gray-500 mb-1">用户名</label>
                  <div class="flex items-center">
                    <UserIcon class="w-5 h-5 mr-2 text-blue-500" />
                    <p class="text-lg text-gray-800">{{ teacher.name }}</p>
                  </div>
                </div>

                <div class="group p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <label class="block text-sm font-medium text-gray-500 mb-1">角色</label>
                  <div class="flex items-center">
                    <ShieldIcon class="w-5 h-5 mr-2 text-blue-500" />
                    <p class="text-lg text-gray-800">{{ teacher.title }}</p>
                  </div>
                </div>

                <div class="group p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <label class="block text-sm font-medium text-gray-500 mb-1">邮箱</label>
                  <div class="flex items-center justify-between">
                    <div v-if="!isEditingEmail" class="flex items-center">
                      <MailIcon class="w-5 h-5 mr-2 text-blue-500" />
                      <p class="text-lg text-gray-800">{{ teacher.email }}</p>
                    </div>
                    <div v-else class="flex-grow mr-2">
                      <input
                        type="email"
                        v-model="editableEmail"
                        class="w-full px-3 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                        :disabled="isSavingEmail"
                        placeholder="请输入新邮箱地址"
                      />
                      <p v-if="emailError" class="text-xs text-red-600 mt-1">{{ emailError }}</p>
                    </div>
                    <div class="flex items-center space-x-2 flex-shrink-0">
                      <button
                        v-if="!isEditingEmail"
                        @click="startEditEmail"
                        class="p-1.5 text-blue-600 hover:text-blue-800 transition-colors rounded-full hover:bg-blue-100"
                        title="编辑邮箱"
                      >
                        <PencilIcon class="w-5 h-5" />
                      </button>
                      <template v-if="isEditingEmail">
                        <button
                          @click="saveEmail"
                          :disabled="isSavingEmail"
                          class="p-1.5 text-green-600 hover:text-green-800 disabled:text-gray-400 disabled:bg-gray-100 transition-colors rounded-full hover:bg-green-100"
                          title="保存"
                        >
                          <SaveIcon v-if="!isSavingEmail" class="w-5 h-5" />
                          <LoaderIcon v-else class="w-5 h-5 animate-spin" />
                        </button>
                        <button
                          @click="cancelEditEmail"
                          :disabled="isSavingEmail"
                          class="p-1.5 text-red-600 hover:text-red-800 disabled:text-gray-400 disabled:bg-gray-100 transition-colors rounded-full hover:bg-red-100"
                          title="取消"
                        >
                          <XIcon class="w-5 h-5" />
                        </button>
                      </template>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center py-10">
                <p class="text-gray-500">无法加载用户信息。</p>
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
          </div>
        </main>
      </div>
    </div>

    <!-- 修改密码弹窗 -->
    <div v-if="showPasswordModal" class="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 transform transition-all duration-300 scale-100">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-gray-800 flex items-center">
            <KeyIcon class="w-5 h-5 mr-2 text-blue-600" />
            修改密码
          </h3>
          <button @click="closePasswordModal" class="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors">
            <XIcon class="h-6 w-6" />
          </button>
        </div>

        <form @submit.prevent="handleChangePassword" class="space-y-5">

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
              <KeyIcon class="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <button
                type="button"
                @click="showNewPassword = !showNewPassword"
                class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
              >
                <EyeIcon v-if="!showNewPassword" class="h-5 w-5" />
                <EyeOffIcon v-else class="h-5 w-5" />
              </button>
            </div>
            <p v-if="passwordErrors.newPassword" class="mt-2 text-sm text-red-600 flex items-center">
              <AlertCircleIcon class="h-4 w-4 mr-1" />
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
                    <CheckIcon v-if="hasMinLength" class="h-4 w-4" />
                    <XIcon v-else class="h-4 w-4 text-gray-400" />
                  </div>
                  至少8个字符
                </li>
                <li class="flex items-center" :class="{'text-green-600': hasUpperCase}">
                  <div class="w-5 h-5 mr-2 flex items-center justify-center">
                    <CheckIcon v-if="hasUpperCase" class="h-4 w-4" />
                    <XIcon v-else class="h-4 w-4 text-gray-400" />
                  </div>
                  至少包含一个大写字母
                </li>
                <li class="flex items-center" :class="{'text-green-600': hasLowerCase}">
                  <div class="w-5 h-5 mr-2 flex items-center justify-center">
                    <CheckIcon v-if="hasLowerCase" class="h-4 w-4" />
                    <XIcon v-else class="h-4 w-4 text-gray-400" />
                  </div>
                  至少包含一个小写字母
                </li>
                <li class="flex items-center" :class="{'text-green-600': hasNumber}">
                  <div class="w-5 h-5 mr-2 flex items-center justify-center">
                    <CheckIcon v-if="hasNumber" class="h-4 w-4" />
                    <XIcon v-else class="h-4 w-4 text-gray-400" />
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
              <CheckIcon class="absolute left-3.5 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600"
              >
                <EyeIcon v-if="!showConfirmPassword" class="h-5 w-5" />
                <EyeOffIcon v-else class="h-5 w-5" />
              </button>
            </div>
            <p v-if="passwordErrors.confirmPassword" class="mt-2 text-sm text-red-600 flex items-center">
              <AlertCircleIcon class="h-4 w-4 mr-1" />
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
                <LoaderIcon v-if="isSubmitting" class="animate-spin h-5 w-5 mr-2" />
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
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowLeftIcon,
  BellIcon,
  UserCircleIcon,
  // LockClosedIcon, // Removed as it caused build error, replaced with LockIcon
  UserIcon,
  LockIcon,
  KeyIcon,
  AlertCircleIcon,
  EyeIcon,
  EyeOffIcon,
  FingerprintIcon,
  ShieldIcon,
  MailIcon,
  XIcon,        // For modal close
  CheckIcon,    // For password criteria & input
  LoaderIcon,  // For submitting state
  PencilIcon, // For editing email
  SaveIcon    // For saving email
} from 'lucide-vue-next';
import { useUserStore } from '@/stores/user';
import { getUser, updateUser } from '@/api/user'; // updateUser for password change

const router = useRouter()
const userStore = useUserStore();

// Refs for email editing
const isEditingEmail = ref(false);
const editableEmail = ref('');
const emailError = ref('');
const isSavingEmail = ref(false);

// 导航项
const navItems = ref([
  { id: 'profile', name: '个人信息', icon: UserCircleIcon },
  { id: 'security', name: '账号安全', icon: LockIcon } // Replaced LockClosedIcon with LockIcon
])

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
  id: null,
  name: '', // Will store username
  title: '', // Will store role
  email: '',
  // department, phone, researchInterests, officeHours are kept for potential future use
  // but not actively managed by the current API calls in this component.
  // Consider removing if they are definitively not needed or managed elsewhere.
  department: '',
  phone: '',
  researchInterests: [],
  officeHours: '',
  passwordLastUpdated: '' // For password change feature, will be updated on successful change
})

// 页面状态
const activeTab = ref('profile')
// const isEditing = ref(false) // Removed
const isLoading = ref(true) // Set to true initially for loading user profile

// 加载教师信息
const validateEmailFormat = (email) => {
  if (!email) return '邮箱不能为空';
  // Basic email regex, consider a more robust one if needed
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return '请输入有效的邮箱地址';
  return '';
};

const startEditEmail = () => {
  isEditingEmail.value = true;
  editableEmail.value = teacher.value.email;
  emailError.value = ''; // Clear previous errors
};

const cancelEditEmail = () => {
  isEditingEmail.value = false;
  emailError.value = '';
  // Optionally reset editableEmail to teacher.value.email if needed, though not strictly necessary if not saved
};

const saveEmail = async () => {
  emailError.value = validateEmailFormat(editableEmail.value);
  if (emailError.value) {
    return; // Validation failed
  }

  if (editableEmail.value === teacher.value.email) {
    isEditingEmail.value = false; // No change, just exit edit mode
    return;
  }

  isSavingEmail.value = true;
  try {
    const payload = { email: editableEmail.value };
    // Assuming userStore.userId holds the ID of the user whose email is being changed
    const response = await updateUser(userStore.userId, payload);

    if (response && response.data && response.data.code === 200) {
      teacher.value.email = editableEmail.value; // Update local display
      isEditingEmail.value = false; // Exit edit mode
      alert('邮箱更新成功！');
      // Optionally, if the backend returns the full updated user object:
      // userStore.setUser(response.data.data); // Update user store
      // teacher.value = { ...teacher.value, ...response.data.data }; // Update local teacher ref
    } else {
      // Handle specific API error messages
      emailError.value = (response && response.data && response.data.message) || '更新邮箱失败，请重试。';
      alert(emailError.value);
    }
  } catch (error) {
    console.error('保存邮箱失败:', error);
    const backendError = error.response && error.response.data && error.response.data.message;
    emailError.value = backendError || '保存邮箱时发生网络或服务器错误，请稍后重试。';
    alert(emailError.value);
  } finally {
    isSavingEmail.value = false;
  }
};

const loadTeacherProfile = async () => {
  isLoading.value = true;
  try {
    const userId = userStore.userId;
    if (!userId) {
      console.error('User ID not found in store.');
      // TODO: Display error to user that userId is missing
      teacher.value.id = null; // Ensure teacher object reflects error state
      isLoading.value = false;
      return;
    }

    // Fetch user info from /users/{userId} using the getUser function
    // getUser is expected to return a response where response.data is the actual payload from server
    // And the server returns { code: 200, message: "success", data: { id, username, role, email } }
    const response = await getUser(userId);
    
    // Check if response and response.data and response.data.data are valid
    if (response && response.data && response.data.data && response.data.code === 200) {
      const userInfo = response.data.data;
      teacher.value.id = userInfo.id;
      teacher.value.name = userInfo.username; // Display username as name
      teacher.value.title = userInfo.role;    // Display role as title
      teacher.value.email = userInfo.email;

      // Clear fields not provided by this API endpoint
      teacher.value.phone = '';
      teacher.value.department = ''; // Department display in sidebar is removed
      teacher.value.research = '';
      // courses and stats fields are removed from teacher object
      // passwordLastUpdated can be kept or managed separately if needed
    } else {
      console.error('Failed to fetch user info or data is not in expected format:', response);
      teacher.value.id = null; // Indicate data loading failure
      // TODO: Display error to user based on response message or generic error
    }
  } catch (error) {
    console.error('加载教师信息失败:', error);
    teacher.value.id = null; // Indicate data loading failure
    // TODO: Display a generic error message to the user
  } finally {
    isLoading.value = false;
  }
};

// saveTeacherProfile function removed as editing these fields is removed.

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
  newPassword: '',
  confirmPassword: ''
})

// 密码错误信息
const passwordErrors = reactive({
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
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
  passwordErrors.newPassword = ''
  passwordErrors.confirmPassword = ''
  // showCurrentPassword.value = false; // No longer needed
  showNewPassword.value = false
  showConfirmPassword.value = false
}

// 验证密码表单
const validatePasswordForm = () => {
  let isValid = true

  // 重置错误信息
  passwordErrors.newPassword = ''
  passwordErrors.confirmPassword = ''

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
const handleChangePassword = async () => {
  if (!validatePasswordForm()) return

  try {
    isSubmitting.value = true;
    const userId = userStore.userId;
    // The backend API for PUT /users/{userId} expects the new password directly,
    // and other user details like email. The currentPassword is for client-side validation
    // or a dedicated 'change-password' endpoint which might validate oldPassword on the server.
    // For this updateUser endpoint, we send the new password as 'password'.
    const payload = {
      email: teacher.value.email, // Send existing email
      password: passwordForm.newPassword // Send new password
    };
    await updateUser(userId, payload);

    // 更新密码最后修改时间
    teacher.value.passwordLastUpdated = new Date().toLocaleDateString()

    // 显示成功消息
    alert('密码修改成功！')

    // 关闭弹窗
    closePasswordModal()
  } catch (error) {
    console.error('修改密码失败:', error.response ? error.response.data : error.message);
    // Display more specific error from backend if available
    const errorMessage = error.response && error.response.data && error.response.data.message 
                       ? error.response.data.message 
                       : '修改密码失败，请稍后重试。';
    alert(errorMessage);
  } finally {
    isSubmitting.value = false
  }
}

// 监听编辑状态变化
// Watch for isEditing removed as isEditing is removed.

// 页面加载时获取数据
onMounted(() => {
  // 如果需要使用静态数据进行测试，注释掉下面这行，并取消注释上面的静态数据
  loadTeacherProfile()
})
</script>

<style>
/* 只保留必要的自定义样式 */
.scale-102 {
  transform: scale(1.02);
}

/* 移除其他自定义样式，改用 Tailwind 类 */
</style>
