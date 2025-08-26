import * as exerciseApi from '../../src/api/exercise'
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

describe('exercise.js API', () => {
  // getExercises
  test('getExercises 正常返回', async () => {
    axios.get.mockResolvedValue({ data: { code: 200, data: [{ id: 'e1' }] } })
    const res = await exerciseApi.getExercises({})
    expect(res.data.data[0].id).toBe('e1')
  })
  test('getExercises 错误返回', async () => {
    axios.get.mockRejectedValue(new Error('fail'))
    await expect(exerciseApi.getExercises(null)).rejects.toThrow('fail')
  })

  // createExercise
  test('createExercise 正常返回', async () => {
    axios.post.mockResolvedValue({ data: { code: 201, data: { id: 'e1' } } })
    const res = await exerciseApi.createExercise({ title: '练习' })
    expect(res.data.data.id).toBe('e1')
  })
  test('createExercise 错误返回', async () => {
    axios.post.mockRejectedValue(new Error('fail'))
    await expect(exerciseApi.createExercise({})).rejects.toThrow('fail')
  })

  // createExerciseTemplate
  test('createExerciseTemplate 正常返回', async () => {
    axios.post.mockResolvedValue({ data: { code: 201, data: { id: 't1' } } })
    const res = await exerciseApi.createExerciseTemplate({ title: '模板' })
    expect(res.data.data.id).toBe('t1')
  })
  test('createExerciseTemplate 错误返回', async () => {
    axios.post.mockRejectedValue(new Error('fail'))
    await expect(exerciseApi.createExerciseTemplate({})).rejects.toThrow('fail')
  })

  // getExerciseTemplates
  test('getExerciseTemplates 正常返回', async () => {
    axios.get.mockResolvedValue({ data: { code: 200, data: [{ id: 't1' }] } })
    const res = await exerciseApi.getExerciseTemplates()
    expect(res.data.data[0].id).toBe('t1')
  })
  test('getExerciseTemplates 错误返回', async () => {
    axios.get.mockRejectedValue(new Error('fail'))
    await expect(exerciseApi.getExerciseTemplates()).rejects.toThrow('fail')
  })

  // getAssignmentSubmissions
  test('getAssignmentSubmissions 正常返回', async () => {
    axios.get.mockResolvedValue({ data: { code: 200, data: [{ id: 's1' }] } })
    const res = await exerciseApi.getAssignmentSubmissions('cid', 'aid')
    expect(res.data.data[0].id).toBe('s1')
  })
  test('getAssignmentSubmissions 错误返回', async () => {
    axios.get.mockRejectedValue(new Error('fail'))
    await expect(exerciseApi.getAssignmentSubmissions('bad', 'aid')).rejects.toThrow('fail')
  })

  // submitAssignment
  test('submitAssignment 正常返回', async () => {
    axios.post.mockResolvedValue({ data: { code: 201, data: { id: 's1' } } })
    const res = await exerciseApi.submitAssignment('aid', { answer: 'A' })
    expect(res.data.data.id).toBe('s1')
  })
  test('submitAssignment 错误返回', async () => {
    axios.post.mockRejectedValue(new Error('fail'))
    await expect(exerciseApi.submitAssignment('aid', {})).rejects.toThrow('fail')
  })

  // createQuestion
  test('createQuestion 正常返回', async () => {
    axios.post.mockResolvedValue({ data: { code: 201, data: { id: 'q1' } } })
    const res = await exerciseApi.createQuestion({ title: '题目' })
    expect(res.data.data.id).toBe('q1')
  })
  test('createQuestion 错误返回', async () => {
    axios.post.mockRejectedValue(new Error('fail'))
    await expect(exerciseApi.createQuestion({})).rejects.toThrow('fail')
  })
})
