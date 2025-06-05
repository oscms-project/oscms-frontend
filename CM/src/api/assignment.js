import axios from 'axios'

/**
 * 获取作业下的全部题目
 * @param {string} assignmentId
 * @returns {Promise<Array>} 题目数组
 */
export function getAssignmentQuestions(assignmentId) {
    if (!assignmentId) {
        return Promise.reject(new Error('作业ID不能为空'));
    }
    return axios
        .get(`/assignments/${assignmentId}/questions`)
        .then(res => {
            if (res.data && res.data.code === 200) {
                return res.data.data;
            } else {
                throw new Error(res.data?.message || '获取题目失败');
            }
        });
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
        .post(`/classes/${classId}/assignments/${assignmentId}/submissions`, data)
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
    if (!submissionId) {
        return Promise.reject(new Error('提交ID不能为空'));
    }
    return axios
        .get(`/submissions/${submissionId}`)
        .then(res => {
            if (res.data && res.data.code === 200) {
                return res.data.data;
            } else {
                throw new Error(res.data?.message || '获取提交详情失败');
            }
        });
}

/**
 * 列出题库中所有题目
 * @param {Object} params 可选参数，如 { courseId }
 * @returns {Promise<Array>}
 */
export function getQuestionBank(params = {}) {
    return axios
        .get('/questions', { params })
        .then(res => {
            if (res.data && res.data.code === 200) {
                return res.data.data
            } else {
                throw new Error(res.data?.message || '获取题库失败')
            }
        })
}

/**
 * 从题库导入题目到作业
 * @param {string} assignmentId
 * @param {Array<string>} questionIds
 * @returns {Promise<Object>}
 */
export function importQuestionsToAssignment(assignmentId, questionIds) {
    return axios
        .post(`/assignments/${assignmentId}/questions`, { ids: questionIds })
        .then(res => {
            if (res.data && res.data.code === 200) {
                return res.data.data
            } else {
                throw new Error(res.data?.message || '导入题目失败')
            }
        })
}

/**
 * 老师给某个班级布置作业
 * @param {string} classId
 * @param {Object} assignmentData
 * @returns {Promise<Object>}
 */
export function createAssignment(classId, assignmentData) {
    return axios
        .post(`/classes/${classId}/assignments`, assignmentData)
        .then(res => {
            if (res.data && res.data.code === 201) {
                return res.data.data
            } else {
                throw new Error(res.data?.message || '布置作业失败')
            }
        })
}

/**
 * 获取某班级下某作业的全部提交（教师端）
 * @param {string} classId
 * @param {string} assignmentId
 * @returns {Promise<Array>} 提交列表
 */
export function getAssignmentSubmissions(classId, assignmentId) {
    return axios
        .get(`/classes/${classId}/assignments/${assignmentId}/submissions`)
        .then(res => {
            if (res.data && res.data.code === 200) {
                return res.data.data;
            } else {
                throw new Error(res.data?.message || '获取提交列表失败');
            }
        });
}

/**
 * 教师批改主观题
 * @param {string} submissionId
 * @param {Array} grades 形如 [{ questionId, score, feedback }]
 * @returns {Promise<Object>} 更新后的提交详情
 */
export function gradeSubmission(submissionId, grades) {
    return axios
        .put(`/submissions/${submissionId}/grade`, { grades })
        .then(res => {
            if (res.data && res.data.code === 200) {
                return res.data.data;
            } else {
                throw new Error(res.data?.message || '批改失败');
            }
        });
}