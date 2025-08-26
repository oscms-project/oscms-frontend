import axios from '@/utils/request'

export function getLearningRecords() {
  return axios.get('/records/learning')
}

export function getExerciseRecords() {
  return axios.get('/records/exercise')
}