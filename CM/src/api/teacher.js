import request from '@/utils/request'  // 假设你有一个request工具

// 获取教师个人信息
export const getTeacherProfile = (userId) => {
  return request({
    url: `/users/${userId}`,
    method: 'get'
  })
}

// 更新教师个人信息
export const updateTeacherProfile = (userId, data) => {
  return request({
    url: `/users/${userId}`,
    method: 'put',
    data
  })
}

// 获取教师课程列表
export const getTeacherCourses = (teacherId) => {
  return request({
    url: '/courses',
    method: 'get',
    params: { teacherId }
  })
}

// 修改密码 (需要后端添加此接口)
export const changePassword = (userId, data) => {
  return request({
    url: `/users/${userId}/password`,
    method: 'put',
    data
  })
} 