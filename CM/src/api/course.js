import axios from '@/utils/request'
//当前教师的所有课程
export function getCourses(params) {
  return axios.get('/courses', { params })
}

export function createCourse(data) {
  return axios.post('/courses', data)
}

export function getCourseDetail(courseId) {
  return axios.get(`/courses/${courseId}`)
}

export function updateCourse(courseId, data) {
  return axios.put(`/courses/${courseId}`, data)
}

export function deleteCourse(courseId) {
  return axios.delete(`/courses/${courseId}`)
}

export function getCourseClasses(courseId) {
  return axios.get(`/courses/${courseId}/classes`)
}

export function uploadCourseResource(courseId, formData) {
  return axios.post(`/courses/${courseId}/resources`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}