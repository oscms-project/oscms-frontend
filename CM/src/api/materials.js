import axios from '@/utils/request'

export function getMaterials(classId, params) {
  return axios.get(`/materials/${classId}`, { params })
}

export function uploadMaterial(classId, formData) {
  return axios.post(`/materials/${classId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}