import axios from '@/utils/request'
//获取用户信息，包括用户名，id，role,email等
export function getUser(userId) {
  return axios.get(`/users/${userId}`)
}
//更新个人信息
export function updateUser(userId, data) {
  return axios.put(`/users/${userId}`, data)
}
//获取指定id学生参与的所有课程，返回course数组，包含课程章节，id，名称，大纲，作业，老师等信息
export function getUserCourses(userId) {
  return axios.get(`/users/${userId}/courses`)
}
//获取指定学生在某课程中的班级信息，包含班级id，名称，代码，所属课程id
export function getUserCourseClass(userId, courseId) {
  return axios.get(`/users/${userId}/courses/${courseId}/class`)
}