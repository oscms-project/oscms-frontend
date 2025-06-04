import axios from '@/utils/request'

export function getClasses(params) {
  return axios.get('/classes', { params })
}

export function createClass(data) {
  return axios.post('/classes', data)
}

export function getClassStudents(classId) {
  return axios.get(`/classes/${classId}/students`)
}

export function importClassStudents(classId, data) {
  return axios.post(`/classes/${classId}/students`, data)
}

export function assignExercise(classId, data) {
  return axios.post(`/classes/${classId}/assignments`, data)
}

export function getClassAssignments(classId) {
  return axios.get(`/classes/${classId}/assignments`)
}

// 获取指定学生在某课程中的班级信息
export function getStudentClassInCourse(userId, courseId) {
  return axios.get(`/users/${userId}/courses/${courseId}/class`)
}