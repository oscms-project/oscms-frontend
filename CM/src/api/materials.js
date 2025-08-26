import axios from '@/utils/request'

// 修改前: return axios.get(`/materials/${classId}`, { params })
export function getMaterials(classId, params) {
  return axios.get(`/classes/${classId}/resources`, { params })
}

export function getCourseMaterials(courseId, params) {
  return axios.get(`/courses/${courseId}/resources`, { params })
}

export function uploadMaterial(classId, formData) {
  return axios.post(`/materials/${classId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export function uploadCourseMaterialFile(courseId, formData) {
  return axios.post(`/courses/${courseId}/resources`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}