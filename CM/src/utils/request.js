import axios from 'axios'
import { useUserStore } from '@/stores/user'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '', // 使用环境变量，默认为空字符串（相对路径）
  timeout: 10000
})
//请求拦截器
instance.interceptors.request.use(
  config => {
    // 获取 store 中的 token (这是在组件外使用 store 的特殊方式)
    const userStore = useUserStore()
    const token = userStore.token
    
    // 如果有 token 则添加到 Authorization 请求头
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    
    return config
  },
  error => {
    console.error('请求拦截器错误:', error)
    return Promise.reject(error)
  }
)

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
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)
export default instance