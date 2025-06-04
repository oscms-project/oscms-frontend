import axios from 'axios'

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

/**
 * 学生向指定班级的作业提交答案
 * @param {string} classId
 * @param {string} assignmentId
 * @param {object} data { studentId, answers }
 * @returns {Promise<Object>} 提交结果
 */
export function submitAssignmentAnswers(classId, assignmentId, data) {
    return axios
        .post(`/api/classes/${classId}/assignments/${assignmentId}/submissions`, data)
        .then(res => {
            if (res.data && res.data.code === 201) {
                return res.data.data
            } else {
                throw new Error(res.data?.message || '提交失败')
            }
        })
}

/**
 * 获取单次提交详情
 * @param {string} submissionId
 * @returns {Promise<Object>} 提交详情对象
 */
export function getSubmissionDetail(submissionId) {
    return axios
        .get(`/api/submissions/${submissionId}`)
        .then(res => {
            if (res.data && res.data.code === 200) {
                return res.data.data
            } else {
                throw new Error(res.data?.message || '获取提交详情失败')
            }
        })
}
