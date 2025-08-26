import * as recordApi from '../../src/api/record'
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

describe('record.js API', () => {
  test('getLearningRecords 正常返回', async () => {
    axios.get.mockResolvedValue({ data: { code: 200, data: [] } })
    const res = await recordApi.getLearningRecords()
    expect(res.data.code).toBe(200)
  })
  test('getLearningRecords 错误返回', async () => {
    axios.get.mockRejectedValue({ response: { status: 500 } })
    await expect(recordApi.getLearningRecords()).rejects.toBeTruthy()
  })
  test('getExerciseRecords 正常返回', async () => {
    axios.get.mockResolvedValue({ data: { code: 200, data: [{ id: 'e1' }] } })
    const res = await recordApi.getExerciseRecords()
    expect(res.data.data[0].id).toBe('e1')
  })
  test('getExerciseRecords 错误返回', async () => {
    axios.get.mockRejectedValue(new Error('fail'))
    await expect(recordApi.getExerciseRecords()).rejects.toThrow('fail')
  })

})
