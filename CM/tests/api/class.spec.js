import * as classApi from '../../src/api/class'
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

describe('class.js API', () => {
  // getClasses
  test('getClasses 正常返回', async () => {
    axios.get.mockResolvedValue({ data: { code: 200, data: [{ id: 'c1' }] } })
    const res = await classApi.getClasses({})
    expect(res.data.data[0].id).toBe('c1')
  })
  test('getClasses 错误返回', async () => {
    axios.get.mockRejectedValue(new Error('fail'))
    await expect(classApi.getClasses(null)).rejects.toThrow('fail')
  })

  // createClass
  test('createClass 正常返回', async () => {
    axios.post.mockResolvedValue({ data: { code: 201, data: { id: 'c1' } } })
    const res = await classApi.createClass({ name: '班级', code: '1', courseId: 'cid' })
    expect(res.data.data.id).toBe('c1')
  })
  test('createClass 错误返回', async () => {
    axios.post.mockRejectedValue(new Error('fail'))
    await expect(classApi.createClass({})).rejects.toThrow('fail')
  })

  // getClassStudents
  test('getClassStudents 正常返回', async () => {
    axios.get.mockResolvedValue({ data: { code: 200, data: [{ id: 's1' }] } })
    const res = await classApi.getClassStudents('cid')
    expect(res.data.data[0].id).toBe('s1')
  })
  test('getClassStudents 错误返回', async () => {
    axios.get.mockRejectedValue(new Error('fail'))
    await expect(classApi.getClassStudents('bad')).rejects.toThrow('fail')
  })

  // importClassStudents
  test('importClassStudents 正常返回', async () => {
    axios.post.mockResolvedValue({ data: { code: 200, data: { importedCount: 2 } } })
    const res = await classApi.importClassStudents('cid', { studentIds: ['s1', 's2'] })
    expect(res.data.data.importedCount).toBe(2)
  })
  test('importClassStudents 错误返回', async () => {
    axios.post.mockRejectedValue(new Error('fail'))
    await expect(classApi.importClassStudents('cid', {})).rejects.toThrow('fail')
  })

  // assignExercise
  test('assignExercise 正常返回', async () => {
    axios.post.mockResolvedValue({ data: { code: 201, data: { id: 'a1' } } })
    const res = await classApi.assignExercise('cid', { title: '作业' })
    expect(res.data.data.id).toBe('a1')
  })
  test('assignExercise 错误返回', async () => {
    axios.post.mockRejectedValue(new Error('fail'))
    await expect(classApi.assignExercise('cid', {})).rejects.toThrow('fail')
  })

  // getClassAssignments
  test('getClassAssignments 正常返回', async () => {
    axios.get.mockResolvedValue({ data: { code: 200, data: [{ id: 'a1' }] } })
    const res = await classApi.getClassAssignments('cid')
    expect(res.data.data[0].id).toBe('a1')
  })
  test('getClassAssignments 错误返回', async () => {
    axios.get.mockRejectedValue(new Error('fail'))
    await expect(classApi.getClassAssignments('bad')).rejects.toThrow('fail')
  })

  // getStudentClassInCourse
  test('getStudentClassInCourse 正常返回', async () => {
    axios.get.mockResolvedValue({ data: { code: 200, data: { id: 'cl1' } } })
    const res = await classApi.getStudentClassInCourse('u1', 'c1')
    expect(res.data.data.id).toBe('cl1')
  })
  test('getStudentClassInCourse 错误返回', async () => {
    axios.get.mockRejectedValue(new Error('fail'))
    await expect(classApi.getStudentClassInCourse('u1', 'bad')).rejects.toThrow('fail')
  })

  // getStudentAssignmentSummary
  test('getStudentAssignmentSummary 正常返回', async () => {
    axios.get.mockResolvedValue({ data: { code: 200, data: { summary: 1 } } })
    const res = await classApi.getStudentAssignmentSummary('cid', 'sid')
    expect(res.data.data.summary).toBe(1)
  })
  test('getStudentAssignmentSummary 错误返回', async () => {
    axios.get.mockRejectedValue(new Error('fail'))
    await expect(classApi.getStudentAssignmentSummary('bad', 'sid')).rejects.toThrow('fail')
  })

  // getStudentClasses
  test('getStudentClasses 正常返回', async () => {
    axios.get.mockResolvedValue({ data: { code: 200, data: [{ id: 'cl1' }] } })
    const res = await classApi.getStudentClasses('sid')
    expect(res.data.data[0].id).toBe('cl1')
  })
  test('getStudentClasses 错误返回', async () => {
    axios.get.mockRejectedValue(new Error('fail'))
    await expect(classApi.getStudentClasses('bad')).rejects.toThrow('fail')
  })

  // enrollClassById
  test('enrollClassById 正常返回', async () => {
    axios.post.mockResolvedValue({ data: { code: 200, data: { success: true } } })
    const res = await classApi.enrollClassById('cid')
    expect(res.data.data.success).toBe(true)
  })
  test('enrollClassById 错误返回', async () => {
    axios.post.mockRejectedValue(new Error('fail'))
    await expect(classApi.enrollClassById('bad')).rejects.toThrow('fail')
  })

  // importClassTAs
  test('importClassTAs 正常返回', async () => {
    axios.post.mockResolvedValue({ data: { code: 200, data: { importedCount: 1 } } })
    const res = await classApi.importClassTAs('cid', { taIds: ['t1'] })
    expect(res.data.data.importedCount).toBe(1)
  })
  test('importClassTAs 错误返回', async () => {
    axios.post.mockRejectedValue(new Error('fail'))
    await expect(classApi.importClassTAs('cid', {})).rejects.toThrow('fail')
  })
})
