import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

// JWT解码函数
function parseJwt(token) {
  if (!token) return null;
  const base64Url = token.split('.')[1];
  if (!base64Url) return null;
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  try {
    const jsonPayload = decodeURIComponent(
      atob(base64)
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('JWT parsing error:', e);
    return null;
  }
}

export const useUserStore = defineStore('user', () => {
  // 状态
  const token = ref(localStorage.getItem('token') || '')
  const userId = ref(localStorage.getItem('userId') || '')
  const name = ref('')
  const role = ref('')
  const avatar = ref('')
  const isLoggedIn = computed(() => !!token.value)

  // 初始化 - 从token中解析用户信息
  function initUserFromToken() {
    const payload = parseJwt(token.value)
    if (payload) {
      name.value = payload.username || payload.name || ''
      role.value = payload.role || ''
      // 其他可能存在的信息...
    }
  }

  // 登录
  function login(loginData) {
    token.value = loginData.token
    userId.value = loginData.userId
    localStorage.setItem('token', loginData.token)
    localStorage.setItem('userId', loginData.userId)
    initUserFromToken()
  }

  // 登出
  function logout() {
    token.value = ''
    userId.value = ''
    name.value = ''
    role.value = ''
    avatar.value = ''
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
  }

  // 更新用户信息
  function updateUserInfo(userInfo) {
    name.value = userInfo.name || name.value
    avatar.value = userInfo.avatar || avatar.value
    // 更新其他需要的字段...
  }

  // 初始化检查登录状态
  if (token.value) {
    initUserFromToken()
  }

  return {
    token,
    userId,
    name,
    role,
    avatar,
    isLoggedIn,
    login,
    logout,
    updateUserInfo
  }
})