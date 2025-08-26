import * as courseDetailsApi from '../../src/api/courseDetails'
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

describe('courseDetails.js API', () => {
  test('getCourseDetails 正常返回', async () => {
    axios.get.mockResolvedValue({ data: { code: 200, data: {} } })
    const res = await courseDetailsApi.getCourseDetails('cid')
    expect(res.data.code).toBe(200)
  })
  test('getCourseDetails 错误返回', async () => {
    axios.get.mockRejectedValue({ response: { status: 404 } })
    await expect(courseDetailsApi.getCourseDetails('bad')).rejects.toBeTruthy()
  })

  test('getCourseOutline 正常返回', async () => {
    axios.get.mockResolvedValue({ data: { code: 200, data: { outline: {} } } })
    const res = await courseDetailsApi.getCourseOutline('cid')
    expect(res.data.code).toBe(200)
  })
  test('getCourseOutline 错误返回', async () => {
    axios.get.mockRejectedValue(new Error('outline not found'))
    await expect(courseDetailsApi.getCourseOutline('bad')).rejects.toThrow('outline not found')
  })

  test('updateCourseOutline 正常返回', async () => {
    axios.put.mockResolvedValue({ data: { code: 200, data: { updated: true } } })
    const res = await courseDetailsApi.updateCourseOutline('cid', { title: 'new' })
    expect(res.data.data.updated).toBe(true)
  })
  test('updateCourseOutline 错误返回', async () => {
    axios.put.mockRejectedValue(new Error('update failed'))
    await expect(courseDetailsApi.updateCourseOutline('bad', {})).rejects.toThrow('update failed')
  })

  test('getCourseResources 正常返回', async () => {
    axios.get.mockResolvedValue({ data: { code: 200, data: [{ id: 'r1' }] } })
    const res = await courseDetailsApi.getCourseResources('cid')
    expect(res.data.data[0].id).toBe('r1')
  })
  test('getCourseResources 错误返回', async () => {
    axios.get.mockRejectedValue(new Error('resources fail'))
    await expect(courseDetailsApi.getCourseResources('bad')).rejects.toThrow('resources fail')
  })

  test('uploadCourseResource 正常返回', async () => {
    axios.post.mockResolvedValue({ data: { code: 200, data: { resourceId: 'res1' } } })
    const res = await courseDetailsApi.uploadCourseResource('cid', {})
    expect(res.data.data.resourceId).toBe('res1')
  })
  test('uploadCourseResource 错误返回', async () => {
    axios.post.mockRejectedValue(new Error('upload failed'))
    await expect(courseDetailsApi.uploadCourseResource('cid', {})).rejects.toThrow('upload failed')
  })

  test('getResourceVersions 正常返回', async () => {
    axios.get.mockResolvedValue({ data: { code: 200, data: [{ version: 1 }] } })
    const res = await courseDetailsApi.getResourceVersions('m1')
    expect(res.data.data[0].version).toBe(1)
  })
  test('getResourceVersions 错误返回', async () => {
    axios.get.mockRejectedValue(new Error('versions fail'))
    await expect(courseDetailsApi.getResourceVersions('bad')).rejects.toThrow('versions fail')
  })

  test('getResourceVersion 正常返回', async () => {
    axios.get.mockResolvedValue({ data: { code: 200, data: { id: 'v1' } } })
    const res = await courseDetailsApi.getResourceVersion('m1', 1)
    expect(res.data.data.id).toBe('v1')
  })
  test('getResourceVersion 错误返回', async () => {
    axios.get.mockRejectedValue(new Error('version not found'))
    await expect(courseDetailsApi.getResourceVersion('m1', 99)).rejects.toThrow('version not found')
  })

  test('updateCourseChapters 正常返回', async () => {
    axios.put.mockResolvedValue({ data: { code: 200, data: { chaptersUpdated: true } } })
    const res = await courseDetailsApi.updateCourseChapters('cid', { chapters: [] })
    expect(res.data.data.chaptersUpdated).toBe(true)
  })
  test('updateCourseChapters 错误返回', async () => {
    axios.put.mockRejectedValue(new Error('chapters update failed'))
    await expect(courseDetailsApi.updateCourseChapters('cid', {})).rejects.toThrow('chapters update failed')
  })

  test('getCourseClasses 正常返回', async () => {
    axios.get.mockResolvedValue({ data: { code: 200, data: [{ id: 'class1' }] } })
    const res = await courseDetailsApi.getCourseClasses('cid')
    expect(res.data.data[0].id).toBe('class1')
  })
  test('getCourseClasses 错误返回', async () => {
    axios.get.mockRejectedValue(new Error('classes fail'))
    await expect(courseDetailsApi.getCourseClasses('bad')).rejects.toThrow('classes fail')
  })

  test('getClassStudents 正常返回', async () => {
    axios.get.mockResolvedValue({ data: { code: 200, data: [{ id: 's1' }] } })
    const res = await courseDetailsApi.getClassStudents('class1')
    expect(res.data.data[0].id).toBe('s1')
  })
  test('getClassStudents 错误返回', async () => {
    axios.get.mockRejectedValue(new Error('students fail'))
    await expect(courseDetailsApi.getClassStudents('bad')).rejects.toThrow('students fail')
  })

  test('getClassAssignments 正常返回', async () => {
    axios.get.mockResolvedValue({ data: { code: 200, data: [{ id: 'a1' }] } })
    const res = await courseDetailsApi.getClassAssignments('class1')
    expect(res.data.data[0].id).toBe('a1')
  })
  test('getClassAssignments 错误返回', async () => {
    axios.get.mockRejectedValue(new Error('assignments fail'))
    await expect(courseDetailsApi.getClassAssignments('bad')).rejects.toThrow('assignments fail')
  })

})
