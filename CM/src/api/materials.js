import axios from '@/utils/request'

// 修改前: return axios.get(`/materials/${classId}`, { params })
export function getMaterials(classId, params) {
  return axios.get(`/api/classes/${classId}/resources`, { params })
}

export function getCourseMaterials(courseId, params) {
  return axios.get(`/api/courses/${courseId}/resources`, { params })
}

export function uploadMaterial(classId, formData) {
  return axios.post(`/api/materials/${classId}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export function uploadCourseMaterialFile(courseId, formData) {
  return axios.post(`/api/courses/${courseId}/resources`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

// 新增：获取资料的所有版本
export function getMaterialVersions(materialId) {
  return axios.get(`/api/materials/${materialId}/versions`)
}

// 新增：获取资料的指定版本
export function getMaterialVersion(materialId, version) {
  return axios.get(`/api/materials/${materialId}/versions/${version}`)
}