import axios from '@/utils/request'

export function getClasses(params) {
  return axios.get('/api/classes', { params })
}

export function createClass(data) {
  return axios.post('/api/classes', data)
}

export function getClassStudents(classId) {
  return axios.get(`/api/classes/${classId}/students`)
}

export function importClassStudents(classId, data) {
  return axios.post(`/api/classes/${classId}/students`, data)
}

export function assignExercise(classId, data) {
  return axios.post(`/api/classes/${classId}/assignments`, data)
}

export function getClassAssignments(classId) {
  return axios.get(`/api/classes/${classId}/assignments`)
}

// 获取指定学生在某课程中的班级信息
export function getStudentClassInCourse(userId, courseId) {
  return axios.get(`/api/users/${userId}/courses/${courseId}/class`)
}

// 获取学生在特定班级中的作业完成情况摘要
export function getStudentAssignmentSummary(classId, studentId) {
  return axios.get(`/api/classes/${classId}/students/${studentId}/assignment-summary`);
}

// 获取学生加入的所有班级
export function getStudentClasses(studentId) {
  return axios.get(`/api/users/${studentId}/classes/info`);
}

// 学生加入班级
export function enrollClassById(classId) {
  return axios.post(`/api/classes/${classId}/enroll`);
}

// 批量添加助教到班级
export function importClassTAs(classId, data) {
  return axios.post(`/api/classes/${classId}/tas`, data)
}