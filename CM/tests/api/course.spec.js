import * as courseApi from '../../src/api/course'
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

describe('course.js API', () => {
  test('getCourses 正常返回', async () => {
    axios.get.mockResolvedValue({ data: { code: 200, data: [] } })
    const res = await courseApi.getCourses({})
    expect(res.data.code).toBe(200)
  })
  test('getCourses 错误返回', async () => {
    axios.get.mockRejectedValue({ response: { status: 400 } })
    await expect(courseApi.getCourses(null)).rejects.toBeTruthy()
  })

  test('createCourse 正常返回', async () => {
    axios.post.mockResolvedValue({ data: { code: 201 } })
    const res = await courseApi.createCourse({ teacherId: 't1', name: 'c', code: '1' })
    expect(res.data.code).toBe(201)
  })
  test('createCourse 错误返回', async () => {
    axios.post.mockRejectedValue({ response: { status: 400 } })
    await expect(courseApi.createCourse({})).rejects.toBeTruthy()
  })

  test('getCourseDetail 正常返回', async () => {
    axios.get.mockResolvedValue({ data: { code: 200, data: { id: 'c1' } } })
    const res = await courseApi.getCourseDetail('c1')
    expect(res.data.data.id).toBe('c1')
  })
  test('getCourseDetail 错误返回', async () => {
    axios.get.mockRejectedValue(new Error('not found'))
    await expect(courseApi.getCourseDetail('bad')).rejects.toThrow('not found')
  })

  test('updateCourse 正常返回', async () => {
    axios.put.mockResolvedValue({ data: { code: 200, data: { id: 'c1', name: 'updated' } } })
    const res = await courseApi.updateCourse('c1', { name: 'updated' })
    expect(res.data.data.name).toBe('updated')
  })
  test('updateCourse 错误返回', async () => {
    axios.put.mockRejectedValue(new Error('update failed'))
    await expect(courseApi.updateCourse('bad', {})).rejects.toThrow('update failed')
  })

  test('deleteCourse 正常返回', async () => {
    axios.delete.mockResolvedValue({ data: { code: 200, data: { success: true } } })
    const res = await courseApi.deleteCourse('c1')
    expect(res.data.data.success).toBe(true)
  })
  test('deleteCourse 错误返回', async () => {
    axios.delete.mockRejectedValue(new Error('delete failed'))
    await expect(courseApi.deleteCourse('bad')).rejects.toThrow('delete failed')
  })

  test('getCourseClasses 正常返回', async () => {
    axios.get.mockResolvedValue({ data: { code: 200, data: [{ id: 'class1' }] } })
    const res = await courseApi.getCourseClasses('c1')
    expect(res.data.data[0].id).toBe('class1')
  })
  test('getCourseClasses 错误返回', async () => {
    axios.get.mockRejectedValue(new Error('fail'))
    await expect(courseApi.getCourseClasses('bad')).rejects.toThrow('fail')
  })

  test('uploadCourseResource 正常返回', async () => {
    axios.post.mockResolvedValue({ data: { code: 200, data: { resourceId: 'r1' } } })
    const fakeForm = {} // 不依赖真实 FormData，axios 被 mock
    const res = await courseApi.uploadCourseResource('c1', fakeForm)
    expect(res.data.data.resourceId).toBe('r1')
  })
  test('uploadCourseResource 错误返回', async () => {
    axios.post.mockRejectedValue(new Error('upload failed'))
    await expect(courseApi.uploadCourseResource('c1', {})).rejects.toThrow('upload failed')
  })

})
