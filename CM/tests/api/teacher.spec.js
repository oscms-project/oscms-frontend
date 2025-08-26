// robust mock @/utils/request，支持 mockResolvedValue 和 mockRejectedValue
vi.mock('@/utils/request', () => {
  const fn = vi.fn()
  fn.mockResolvedValue = (value) => fn.mockImplementation(() => Promise.resolve(value))
  fn.mockRejectedValue = (err) => fn.mockImplementation(() => Promise.reject(err))
  return {
    __esModule: true,
    default: fn
  }
})

import * as teacherApi from '../../src/api/teacher'
import request from '@/utils/request'

describe('teacher.js API', () => {
  test('getTeacherProfile 正常返回', async () => {
    request.mockResolvedValue({ data: { code: 200, data: {} } })
    const res = await teacherApi.getTeacherProfile('uid')
    // 只断言 res.data.code，若 res 或 res.data 为 undefined 则直接 fail
    expect(res && res.data && res.data.code).toBe(200)
  })
  test('getTeacherProfile 错误返回', async () => {
    request.mockRejectedValue(new Error('Request failed'))
    await expect(teacherApi.getTeacherProfile('bad')).rejects.toThrow('Request failed')
  })

  test('updateTeacherProfile 正常返回', async () => {
    request.mockResolvedValue({ data: { code: 200, data: { id: 'uid', name: 'updated' } } })
    const res = await teacherApi.updateTeacherProfile('uid', { name: 'updated' })
    expect(res.data.data.name).toBe('updated')
  })
  test('updateTeacherProfile 错误返回', async () => {
    request.mockRejectedValue(new Error('update failed'))
    await expect(teacherApi.updateTeacherProfile('uid', {})).rejects.toThrow('update failed')
  })

  test('getTeacherCourses 正常返回', async () => {
    request.mockResolvedValue({ data: { code: 200, data: [{ id: 'course1' }] } })
    const res = await teacherApi.getTeacherCourses('t1')
    expect(res.data.data[0].id).toBe('course1')
  })
  test('getTeacherCourses 错误返回', async () => {
    request.mockRejectedValue(new Error('fetch failed'))
    await expect(teacherApi.getTeacherCourses('t1')).rejects.toThrow('fetch failed')
  })

  test('changePassword 正常返回', async () => {
    request.mockResolvedValue({ data: { code: 200, data: { success: true } } })
    const res = await teacherApi.changePassword('uid', { oldPassword: 'a', newPassword: 'b' })
    expect(res.data.data.success).toBe(true)
  })
  test('changePassword 错误返回', async () => {
    request.mockRejectedValue(new Error('change failed'))
    await expect(teacherApi.changePassword('uid', {})).rejects.toThrow('change failed')
  })

  // ...为每个API函数补充正反用例...
})
