import * as assignmentApi from '../../src/api/assignment'
import axios from 'axios'
vi.mock('axios', async () => {
  const actualAxios = await vi.importActual('axios')
  const mockGet = vi.fn()
  const mockPost = vi.fn()
  const mockPut = vi.fn()
  const mockDelete = vi.fn()
  const mockInstance = {
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() }
    },
    get: mockGet,
    post: mockPost,
    put: mockPut,
    delete: mockDelete
  }
  return {
    __esModule: true,
    ...actualAxios,
    default: {
      ...actualAxios.default,
      create: vi.fn(() => mockInstance),
      get: mockGet,
      post: mockPost,
      put: mockPut,
      delete: mockDelete
    }
  }
})

describe('assignment.js API', () => {
  // getAssignmentQuestions
  test('getAssignmentQuestions 正常返回', async () => {
    axios.get.mockResolvedValue({ data: { code: 200, data: [{ id: 'q1' }] } })
    const res = await assignmentApi.getAssignmentQuestions('a1')
    expect(res).toEqual([{ id: 'q1' }])
  })
  test('getAssignmentQuestions 错误返回', async () => {
    axios.get.mockResolvedValue({ data: { code: 400, message: 'fail' } })
    await expect(assignmentApi.getAssignmentQuestions('a1')).rejects.toThrow('fail')
    await expect(assignmentApi.getAssignmentQuestions('')).rejects.toThrow('作业ID不能为空')
  })

  // submitAssignmentAnswers
  test('submitAssignmentAnswers 正常返回', async () => {
    axios.post.mockResolvedValue({ data: { code: 201, data: { id: 's1' } } })
    const res = await assignmentApi.submitAssignmentAnswers('c1', 'a1', { studentId: 's1', answers: [] })
    expect(res).toEqual({ id: 's1' })
  })
  test('submitAssignmentAnswers 错误返回', async () => {
    axios.post.mockResolvedValue({ data: { code: 400, message: '提交失败' } })
    await expect(assignmentApi.submitAssignmentAnswers('c1', 'a1', {})).rejects.toThrow('提交失败')
  })

  // getSubmissionDetail
  test('getSubmissionDetail 正常返回', async () => {
    axios.get.mockResolvedValue({ data: { code: 200, data: { id: 'sub1' } } })
    const res = await assignmentApi.getSubmissionDetail('sub1')
    expect(res).toEqual({ id: 'sub1' })
  })
  test('getSubmissionDetail 错误返回', async () => {
    axios.get.mockResolvedValue({ data: { code: 400, message: 'fail' } })
    await expect(assignmentApi.getSubmissionDetail('sub1')).rejects.toThrow('fail')
    await expect(assignmentApi.getSubmissionDetail('')).rejects.toThrow('提交ID不能为空')
  })

  // getQuestionBank
  test('getQuestionBank 正常返回', async () => {
    axios.get.mockResolvedValue({ data: { code: 200, data: [{ id: 'q1' }] } })
    const res = await assignmentApi.getQuestionBank({})
    expect(res).toEqual([{ id: 'q1' }])
  })
  test('getQuestionBank 错误返回', async () => {
    axios.get.mockResolvedValue({ data: { code: 400, message: '题库错误' } })
    await expect(assignmentApi.getQuestionBank({})).rejects.toThrow('题库错误')
  })

  // importQuestionsToAssignment
  test('importQuestionsToAssignment 正常返回', async () => {
    axios.post.mockResolvedValue({ data: { code: 200, data: { success: true } } })
    const res = await assignmentApi.importQuestionsToAssignment('a1', ['q1'])
    expect(res).toEqual({ success: true })
  })
  test('importQuestionsToAssignment 错误返回', async () => {
    axios.post.mockResolvedValue({ data: { code: 400, message: '导入题目失败' } })
    await expect(assignmentApi.importQuestionsToAssignment('a1', ['q1'])).rejects.toThrow('导入题目失败')
  })

  // createAssignment
  test('createAssignment 正常返回', async () => {
    axios.post.mockResolvedValue({ data: { code: 201, data: { id: 'a1' } } })
    const res = await assignmentApi.createAssignment('c1', { title: '作业' })
    expect(res).toEqual({ id: 'a1' })
  })
  test('createAssignment 错误返回', async () => {
    axios.post.mockResolvedValue({ data: { code: 400, message: '布置作业失败' } })
    await expect(assignmentApi.createAssignment('c1', {})).rejects.toThrow('布置作业失败')
  })

  // getAssignmentSubmissions
  test('getAssignmentSubmissions 正常返回', async () => {
    axios.get.mockResolvedValue({ data: { code: 200, data: [{ id: 's1' }] } })
    const res = await assignmentApi.getAssignmentSubmissions('c1', 'a1')
    expect(res).toEqual([{ id: 's1' }])
  })
  test('getAssignmentSubmissions 错误返回', async () => {
    axios.get.mockResolvedValue({ data: { code: 400, message: '获取提交列表失败' } })
    await expect(assignmentApi.getAssignmentSubmissions('c1', 'a1')).rejects.toThrow('获取提交列表失败')
  })

  // getAssignmentSubmissionsList
  test('getAssignmentSubmissionsList 正常返回', async () => {
    axios.get.mockResolvedValue({ data: { code: 200, data: [{ id: 's1' }] } })
    const res = await assignmentApi.getAssignmentSubmissionsList('c1', 'a1')
    expect(res).toEqual([{ id: 's1' }])
  })
  test('getAssignmentSubmissionsList 错误返回', async () => {
    axios.get.mockResolvedValue({ data: { code: 400, message: '获取提交列表失败' } })
    await expect(assignmentApi.getAssignmentSubmissionsList('c1', 'a1')).rejects.toThrow('获取提交列表失败')
  })

  // gradeSubmission
  test('gradeSubmission 正常返回', async () => {
    axios.put.mockResolvedValue({ data: { code: 200, data: { id: 'sub1' } } })
    const res = await assignmentApi.gradeSubmission('sub1', [{ questionId: 'q1', score: 5 }])
    expect(res).toEqual({ id: 'sub1' })
  })
  test('gradeSubmission 错误返回', async () => {
    axios.put.mockResolvedValue({ data: { code: 400, message: '批改失败' } })
    await expect(assignmentApi.gradeSubmission('sub1', [])).rejects.toThrow('批改失败')
  })

  // createQuestionInBank
  test('createQuestionInBank 正常返回', async () => {
    axios.post.mockResolvedValue({ data: { code: 201, data: { id: 'q1' } } })
    const res = await assignmentApi.createQuestionInBank({ title: '题目', type: 'choice', choices: [], correctAnswer: '', score: 5 })
    expect(res).toEqual({ id: 'q1' })
  })
  test('createQuestionInBank 错误返回', async () => {
    axios.post.mockResolvedValue({ data: { code: 400, message: '创建题目失败' } })
    await expect(assignmentApi.createQuestionInBank({})).rejects.toThrow('创建题目失败')
  })

  // getLatestSubmission
  test('getLatestSubmission 正常返回', async () => {
    axios.get.mockResolvedValue({ data: { code: 200, data: { id: 'sub1' } } })
    const res = await assignmentApi.getLatestSubmission('a1')
    expect(res.data).toEqual({ id: 'sub1' })
  })
  test('getLatestSubmission 错误返回', async () => {
    axios.get.mockResolvedValue({ data: { code: 400, message: '获取最新提交失败' } })
    await expect(assignmentApi.getLatestSubmission('a1')).rejects.toThrow('获取最新提交失败')
    await expect(assignmentApi.getLatestSubmission('')).rejects.toThrow('作业ID不能为空')
  })
})
