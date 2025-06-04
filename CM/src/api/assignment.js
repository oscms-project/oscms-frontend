import axios from 'axios'

/**
 * 获取作业详情
 * @param {string} assignmentId
 * @returns {Promise<Object>} 作业详情对象
 */
export function getAssignmentInfo(assignmentId) {
    return axios
        .get(`/api/assignments/${assignmentId}`)
        .then(res => {
            if (res.data && res.data.code === 200) {
                return res.data.data
            } else {
                throw new Error(res.data?.message || '获取作业详情失败')
            }
        })
}

/**
 * 获取作业下的全部题目
 * @param {string} assignmentId
 * @returns {Promise<Array>} 题目数组
 */
export function getAssignmentQuestions(assignmentId) {
    return axios
        .get(`/api/assignments/${assignmentId}/questions`)
        .then(res => {
            if (res.data && res.data.code === 200) {
                return res.data.data
            } else {
                throw new Error(res.data?.message || '获取题目失败')
            }
        })
}
