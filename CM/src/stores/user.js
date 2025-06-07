import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useLocalStorage } from '@vueuse/core'  // 添加这行导入
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
  const name = useLocalStorage('cm-username', '')
  const role = useLocalStorage('cm-role', '')
  const avatar = ref('')
  const isLoggedIn = computed(() => !!token.value)

  // 初始化 - 从token中解析用户信息
  // 修改 initUserFromToken 函数来正确解析后端返回的 token 数据
function initUserFromToken() {
  const payload = parseJwt(token.value)
  if (payload) {
    // 直接使用 payload 中的字段，不再使用 username 兜底
    userId.value = payload.userId || userId.value
    name.value = payload.username || ''
    role.value = payload.roles && payload.roles.length > 0 ? payload.roles[0] : ''
    // 不再期望 avatar 等其他字段从 token 中获取
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