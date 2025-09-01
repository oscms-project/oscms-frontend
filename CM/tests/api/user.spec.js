import * as userApi from '../../src/api/user'
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

describe('user.js API', () => {
  test('getUser 正常返回', async () => {
    axios.get.mockResolvedValue({ data: { code: 200, data: { id: 'u1' } } })
    const res = await userApi.getUser('u1')
    expect(res.data.code).toBe(200)
    expect(res.data.data.id).toBe('u1')
  })
  test('getUser 错误返回', async () => {
    axios.get.mockRejectedValue({ response: { status: 404 } })
    await expect(userApi.getUser('bad')).rejects.toBeTruthy()
  })

  // getFavoriteExercises
  test('getFavoriteExercises 正常返回', async () => {
    axios.get.mockResolvedValue({ data: { code: 200, data: [{ id: 'q1' }] } })
    const res = await userApi.getFavoriteExercises('s1')
    expect(res[0].id).toBe('q1')
  })
  test('getFavoriteExercises 错误返回 (缺少 studentId)', async () => {
    await expect(userApi.getFavoriteExercises()).rejects.toThrow('学生ID不能为空')
  })

  // updateUser
  test('updateUser 正常返回', async () => {
    axios.put.mockResolvedValue({ data: { code: 200, data: { id: 'u1', name: 'new' } } })
    const res = await userApi.updateUser('u1', { name: 'new' })
    expect(res.data.data.name).toBe('new')
  })
  test('updateUser 错误返回', async () => {
    axios.put.mockRejectedValue(new Error('update failed'))
    await expect(userApi.updateUser('bad', {})).rejects.toThrow('update failed')
  })

  // getUserCourses
  test('getUserCourses 正常返回', async () => {
    axios.get.mockResolvedValue({ data: { code: 200, data: [{ id: 'c1' }] } })
    const res = await userApi.getUserCourses('u1')
    expect(res.data.data[0].id).toBe('c1')
  })
  test('getUserCourses 错误返回', async () => {
    axios.get.mockRejectedValue(new Error('fail'))
    await expect(userApi.getUserCourses('bad')).rejects.toThrow('fail')
  })

  // getUserCourseClass
  test('getUserCourseClass 正常返回', async () => {
    axios.get.mockResolvedValue({ data: { code: 200, data: { id: 'class1' } } })
    const res = await userApi.getUserCourseClass('u1', 'c1')
    expect(res.data.data.id).toBe('class1')
  })
  test('getUserCourseClass 错误返回', async () => {
    axios.get.mockRejectedValue(new Error('fail'))
    await expect(userApi.getUserCourseClass('u1', 'bad')).rejects.toThrow('fail')
  })

  // addFavoriteExercise
  // test('addFavoriteExercise 正常返回', async () => {
  //   axios.post.mockResolvedValue({ data: { code: 200, data: { success: true } } })
  //   const res = await userApi.addFavoriteExercise('s1', 'q1')
  //   expect(res.code).toBe(200)
  // })
  // test('addFavoriteExercise 错误返回 (缺少 questionId)', async () => {
  //   await expect(userApi.addFavoriteExercise('s1')).rejects.toThrow('题目ID不能为空')
  // })

})
