import * as authApi from '../../src/api/auth'
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
describe('auth.js API', () => {
  // register
  test('register 正常返回', async () => {
    axios.post.mockResolvedValue({ data: { code: 201, data: { userId: 'u1' } } })
    const res = await authApi.register({ username: 'test', password: '123', role: 'student' })
    expect(res.data.code).toBe(201)
    expect(res.data.data.userId).toBe('u1')
  })
  test('register 错误返回', async () => {
    axios.post.mockRejectedValue(new Error('fail'))
    await expect(authApi.register({})).rejects.toThrow('fail')
  })

  // login
  test('login 正常返回', async () => {
    axios.post.mockResolvedValue({ data: { code: 200, data: { token: 'abc' } } })
    const res = await authApi.login({ username: 'test', password: '123' })
    expect(res.data.code).toBe(200)
    expect(res.data.data.token).toBe('abc')
  })
  test('login 错误返回', async () => {
    axios.post.mockRejectedValue(new Error('fail'))
    await expect(authApi.login({ username: 'bad', password: 'bad' })).rejects.toThrow('fail')
  })
})
