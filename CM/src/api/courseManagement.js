import request from '@/utils/request'

// 获取课程统计信息
export const getCourseStats = (courseId) => {
  return request({
    url: `/courses/${courseId}/stats`,
    method: 'get'
  })
}

// 获取班级学生列表
export const getClassStudents = (classId) => {
  return request({
    url: `/classes/${classId}/students`,
    method: 'get'
  })
}

// 导入学生
export const importStudents = (classId, studentIds) => {
  return request({
    url: `/classes/${classId}/students`,
    method: 'post',
    data: { studentIds }
  })
}

// 获取班级作业列表
export const getClassAssignments = (classId) => {
  return request({
    url: `/classes/${classId}/assignments`,
    method: 'get'
  })
}

// 导出课程成绩
export const exportCourseGrades = (courseId) => {
  return request({
    url: `/courses/${courseId}/grades/export`,
    method: 'get',
    responseType: 'blob'
  })
}

// 发送作业提醒
export const sendAssignmentReminder = (assignmentId, studentIds) => {
  return request({
    url: `/assignments/${assignmentId}/remind`,
    method: 'post',
    data: { studentIds }
  })
}

// 获取学生进度
export const getStudentsProgress = (courseId) => {
  return request({
    url: `/courses/${courseId}/students/progress`,
    method: 'get'
  })
}

// 获取课程详情（包含章节信息）
export const getCourseDetail = (courseId) => {
  return request({
    url: `/courses/${courseId}`,
    method: 'get'
  })
}

// 获取用户详细信息
export const getUserDetail = (userId) => {
  return request({
    url: `/users/${userId}`,
    method: 'get'
  })
}

// 获取作业详情
export const getAssignmentDetail = (assignmentId) => {
  return request({
    url: `/assignments/${assignmentId}`,
    method: 'get'
  })
}

// 更新作业信息
export const updateAssignment = (assignmentId, data) => {
  return request({
    url: `/assignments/${assignmentId}`,
    method: 'put',
    data
  })
}

// 获取作业的提交记录
export const getAssignmentSubmissions = (classId, assignmentId) => {
  return request({
    url: `/classes/${classId}/assignments/${assignmentId}/submissions`,
    method: 'get'
  })
}

// 新增: 获取作业统计信息
export const getAssignmentStats = (assignmentId) => {
  return request({
    url: `/assignments/${assignmentId}/stats`,
    method: 'get'
  })
}

// 新增: 获取课程章节信息
export const getAssignmentChapters = (courseId) => {
  return request({
    url: `/courses/${courseId}/chapters`,
    method: 'get'
  })
}

// 新增: 获取学生详细信息（包含联系方式等）
export const getStudentDetails = (studentId) => {
  return request({
    url: `/students/${studentId}/details`,
    method: 'get'
  })
}

// 新增: 批量获取作业统计信息
export const getBatchAssignmentStats = (assignmentIds) => {
  return request({
    url: '/assignments/stats/batch',
    method: 'post',
    data: { assignmentIds }
  })
}

// 新增: 更新作业章节信息
export const updateAssignmentChapter = (assignmentId, chapterId) => {
  return request({
    url: `/assignments/${assignmentId}/chapter`,
    method: 'put',
    data: { chapterId }
  })
}

// 获取课程章节信息
export const getCourseChapters = (courseId) => {
  return getCourseDetail(courseId).then(response => {
    return response.data.chapters || []
  })
} 