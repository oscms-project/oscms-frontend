import axios from '@/utils/request'

export function getExercises(params) {
  return axios.get('/exercises', { params })
}

export function createExercise(data) {
  return axios.post('/exercises', data)
}

export function createExerciseTemplate(data) {
  return axios.post('/exercises/templates', data)
}

export function getExerciseTemplates() {
  return axios.get('/exercises/templates')
}

export function getAssignmentSubmissions(assignmentId) {
  return axios.get(`/assignments/${assignmentId}/submissions`)
}

export function submitAssignment(assignmentId, data) {
  return axios.post(`/assignments/${assignmentId}/submissions`, data)
}