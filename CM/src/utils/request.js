import axios from 'axios'
import { useUserStore } from '@/stores/user'

const instance = axios.create({
  baseURL: 'http://localhost:8080', // 根据 openapi servers 配置
  timeout: 10000
})

instance.interceptors.request.use(config => {
  // 从 Pinia store 获取最新 token
  const userStore = useUserStore()
  if (userStore.token) {
    config.headers.Authorization = `Bearer ${userStore.token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

// 添加响应拦截器，处理 token 失效情况
instance.interceptors.response.use(
  response => {
    return response
  }, 
  error => {
    // 处理 401 未授权错误（token过期或无效）
    if (error.response && error.response.status === 401) {
      const userStore = useUserStore()
      userStore.logout() // 清除用户信息和token
      
      // 跳转到登录页
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
export default instance