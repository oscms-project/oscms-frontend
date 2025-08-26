import * as materialsApi from '../../src/api/materials'
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

describe('materials.js API', () => {
  test('getMaterials 正常返回', async () => {
    axios.get.mockResolvedValue({ data: { code: 200, data: [] } })
    const res = await materialsApi.getMaterials('cid', {})
    expect(res.data.code).toBe(200)
  })
  test('getMaterials 错误返回', async () => {
    axios.get.mockRejectedValue({ response: { status: 404 } })
    await expect(materialsApi.getMaterials('bad', {})).rejects.toBeTruthy()
  })

  // getCourseMaterials
  test('getCourseMaterials 正常返回', async () => {
    axios.get.mockResolvedValue({ data: { code: 200, data: [{ id: 'r1' }] } })
    const res = await materialsApi.getCourseMaterials('course1', {})
    expect(res.data.data[0].id).toBe('r1')
  })
  test('getCourseMaterials 错误返回', async () => {
    axios.get.mockRejectedValue(new Error('fail'))
    await expect(materialsApi.getCourseMaterials('bad', {})).rejects.toThrow('fail')
  })

  // uploadMaterial
  test('uploadMaterial 正常返回', async () => {
    axios.post.mockResolvedValue({ data: { code: 200, data: { id: 'm1' } } })
    const res = await materialsApi.uploadMaterial('class1', {})
    expect(res.data.data.id).toBe('m1')
  })
  test('uploadMaterial 错误返回', async () => {
    axios.post.mockRejectedValue(new Error('upload failed'))
    await expect(materialsApi.uploadMaterial('class1', {})).rejects.toThrow('upload failed')
  })

  // uploadCourseMaterialFile
  test('uploadCourseMaterialFile 正常返回', async () => {
    axios.post.mockResolvedValue({ data: { code: 200, data: { id: 'm2' } } })
    const res = await materialsApi.uploadCourseMaterialFile('course1', {})
    expect(res.data.data.id).toBe('m2')
  })
  test('uploadCourseMaterialFile 错误返回', async () => {
    axios.post.mockRejectedValue(new Error('upload failed'))
    await expect(materialsApi.uploadCourseMaterialFile('course1', {})).rejects.toThrow('upload failed')
  })

})
