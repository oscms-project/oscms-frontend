import axios from '@/utils/request'

export function getExercises(params) {
  return axios.get('/api/exercises', { params })
}

export function createExercise(data) {
  return axios.post('/api/exercises', data)
}

export function createExerciseTemplate(data) {
  return axios.post('/api/exercises/templates', data)
}

export function getExerciseTemplates() {
  return axios.get('/api/exercises/templates')
}

// 获取当前班级id下的某个作业的所有提交
export function getAssignmentSubmissions(classId, assignmentId) {
  return axios.get(`/api/classes/${classId}/assignments/${assignmentId}/submissions`)
}

export function submitAssignment(assignmentId, data) {
  return axios.post(`/api/assignments/${assignmentId}/submissions`, data)
}

export function createQuestion(data) {
  return axios.post('/api/questions', data);
}

