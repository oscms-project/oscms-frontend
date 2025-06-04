import axios from '@/utils/request'

// 获取课程基本信息
export function getCourseDetails(courseId) {
  return axios.get(`/courses/${courseId}`)
}

// 获取课程大纲
export function getCourseOutline(courseId) {
  return axios.get(`/courses/${courseId}`)
}

// 更新课程大纲
export function updateCourseOutline(courseId, outline) {
  return axios.put(`/courses/${courseId}`, {
    outline
  })
}

// 获取课程资源列表
export function getCourseResources(courseId) {
  return axios.get(`/courses/${courseId}/resources`)
}

// 上传课程资源
export function uploadCourseResource(courseId, formData) {
  return axios.post(`/courses/${courseId}/resources`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

// 获取资源历史版本
export function getResourceVersions(materialId) {
  return axios.get(`/materials/${materialId}/versions`)
}

// 获取指定版本的资源详情
export function getResourceVersion(materialId, version) {
  return axios.get(`/materials/${materialId}/versions/${version}`)
}

// 更新课程章节
export function updateCourseChapters(courseId, chapters) {
  // 将 chapters 数组转换为 JSON 字符串，并通过 outline 字段发送
  const outlineString = JSON.stringify(chapters);
  return axios.put(`/courses/${courseId}`, {
    outline: outlineString // 使用 outline 字段
  });
}

// 获取课程下的所有班级
export function getCourseClasses(courseId) {
  return axios.get(`/courses/${courseId}/classes`)
}

// 获取班级学生列表
export function getClassStudents(classId) {
  return axios.get(`/classes/${classId}/students`)
}

// 获取班级作业列表
export function getClassAssignments(classId) {
  return axios.get(`/classes/${classId}/assignments`)
} 