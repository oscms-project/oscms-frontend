import axios from '@/utils/request'
//获取用户信息，包括用户名，id，role,email等
export function getUser(userId) {
  return axios.get(`/users/${userId}`)
}
// 获取用户收藏的题目列表
export function getFavoriteExercises(studentId) {
    if (!studentId) {
        return Promise.reject(new Error('学生ID不能为空'));
    }
    // 假设你项目中已经配置了axios实例，例如 request
    // 如果没有，你需要确保 axios.get 的基础URL和认证头已正确配置
    // 或者使用项目中已有的 request 工具
    return axios.get(`/users/${studentId}/favorites`)
        .then(response => {
            // 根据你的 OpenAPI 定义，响应体直接是 ApiResponseQuestionList
            // 假设 ApiResponseQuestionList 的实际数据在 response.data.data
            // 并且 code === 200 表示成功
            if (response.data && response.data.code === 200 && Array.isArray(response.data.data)) {
                return response.data.data; // 返回题目数组
            } else if (response.data && response.data.code !== 200) {
                throw new Error(response.data.message || '获取收藏题目失败');
            }
            // 如果后端直接返回题目数组，且没有 code/message 包装
            // else if (Array.isArray(response.data)) { 
            //    return response.data; 
            // }
            else {
                // 根据实际情况调整错误处理和数据提取逻辑
                console.warn('Unexpected response structure for favorite exercises:', response.data);
                return []; // 或者抛出错误
            }
        })
        .catch(error => {
            console.error('API Error fetching favorite exercises:', error);
            throw error; // 重新抛出，让调用者处理UI
        });
}
//更新个人信息
export function updateUser(userId, data) {
  return axios.put(`/users/${userId}`, data)
}
//获取指定id学生参与的所有课程，返回course数组，包含课程章节，id，名称，大纲，作业，老师等信息
export function getUserCourses(userId) {
  return axios.get(`/users/${userId}/courses`)
}
//获取指定学生在某课程中的班级信息，包含班级id，名称，代码，所属课程id
export function getUserCourseClass(userId, courseId) {
  return axios.get(`/users/${userId}/courses/${courseId}/class`)
}