import axios from '@/utils/request'
//注册接口，注册成功则返回用户id,username,role,email
export function register(data) {
  return axios.post('/api/auth/register', data)
}
//登录接口，登录成功返回token
export function login(data) {
  return axios.post('/api/auth/login', data)
}