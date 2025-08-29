import axios from '@/utils/request'
//获取用户信息，包括用户名，id，role,email等
export function getUser(userId) {
  return axios.get(`/api/users/${userId}`)
}
// 获取用户收藏的题目列表
export function getFavoriteExercises(studentId) {
    if (!studentId) {
        return Promise.reject(new Error('学生ID不能为空'));
    }
    // 假设你项目中已经配置了axios实例，例如 request
    // 如果没有，你需要确保 axios.get 的基础URL和认证头已正确配置
    // 或者使用项目中已有的 request 工具
    return axios.get(`/api/users/${studentId}/favorites`)
        .then(response => {
            // 假设 ApiResponseQuestionList 的结构是 { code: number, message: string, data: Question[] }
            if (response.data && response.data.code === 200 && Array.isArray(response.data.data)) {
                return response.data.data; // 返回题目数组
            } else if (response.data && response.data.code !== 200) {
                // 处理业务逻辑层面的错误（HTTP状态码可能仍为200，但code非200）
                throw new Error(response.data.message || '获取收藏题目失败');
            } else {
                // 响应数据结构不符合预期
                console.warn('Unexpected response structure for favorite exercises:', response.data);
                throw new Error('获取收藏题目失败：响应数据格式不正确');
            }
        })
        .catch(error => {
            console.error('API Error fetching favorite exercises:', error.message);
            // 尝试从 Axios 错误对象中提取后端返回的更具体的错误信息
            if (error.response && error.response.data && error.response.data.message) {
                throw new Error(error.response.data.message);
            } else if (error.message) {
                // 如果是网络错误或其他 Axios 错误，使用 error.message
                throw new Error(error.message);
            }
            // Fallback 错误
            throw new Error('获取收藏题目时发生未知错误');
        });
}
//更新个人信息
export function updateUser(userId, data) {
  return axios.put(`/api/users/${userId}`, data)
}
//获取指定id学生参与的所有课程，返回course数组，包含课程章节，id，名称，大纲，作业，老师等信息
export function getUserCourses(userId) {
  return axios.get(`/api/users/${userId}/courses`)
}
//获取指定学生在某课程中的班级信息，包含班级id，名称，代码，所属课程id
export function getUserCourseClass(userId, courseId) {
  return axios.get(`/api/users/${userId}/courses/${courseId}/class`)
}

// 学生收藏题目
// 学生收藏题目 - 修正后的接口
export function addFavoriteExercise( questionId,studentId) {
  if (!studentId) {
    return Promise.reject(new Error('学生ID不能为空'));
  }
  
  if (!questionId) {
    return Promise.reject(new Error('题目ID不能为空'));
  }
  

  return axios.post(`/api/questions/${questionId}/favorite?studentId=${studentId}`)
    .then(response => {
      // 如果后端返回统一格式的响应，解析响应数据
      if (response.data && response.data.code === 200) {
        return response.data; // 返回成功响应
      } else if (response.data && response.data.code !== 200) {
        // 处理业务逻辑层面的错误（HTTP状态码可能仍为200，但code非200）
        throw new Error(response.data.message || '收藏题目失败');
      } else {
        // 响应数据结构不符合预期
        console.warn('Unexpected response structure for adding favorite:', response.data);
        throw new Error('收藏题目失败：响应数据格式不正确');
      }
    })
    .catch(error => {
      console.error('API Error adding favorite exercise:', error.message);
      // 尝试从 Axios 错误对象中提取后端返回的更具体的错误信息
      if (error.response && error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      } else if (error.message) {
        // 如果是网络错误或其他 Axios 错误，使用 error.message
        throw new Error(error.message);
      }
      // Fallback 错误
      throw new Error('收藏题目时发生未知错误');
    });
}

