import axios from '@/utils/request'
//当前教师的所有课程
export function getCourses(params) {
  return axios.get('/api/courses', { params })
}

export function createCourse(data) {
  const { teacherId, ...courseData } = data;  // 分离teacherId和课程数据
  return axios.post(`/api/courses?teacherId=${teacherId}`, courseData);  // teacherId作为查询参数
}
export function getCourseDetail(courseId) {
  return axios.get(`/api/courses/${courseId}`)
}

export function updateCourse(courseId, data) {
  return axios.put(`/api/courses/${courseId}`, data)
}

export function deleteCourse(courseId) {
  return axios.delete(`/api/courses/${courseId}`)
}

export function getCourseClasses(courseId) {
  return axios.get(`/api/courses/${courseId}/classes`)
}

export function uploadCourseResource(courseId, formData) {
  return axios.post(`/api/courses/${courseId}/resources`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}