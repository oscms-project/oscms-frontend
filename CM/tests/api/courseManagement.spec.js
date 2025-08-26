import * as courseManagementApi from '../../src/api/courseManagement'
import request from '@/utils/request'
// robust mock @/utils/request，支持 mockResolvedValue 和 mockRejectedValue
vi.mock('@/utils/request', () => {
  const fn = vi.fn()
  fn.mockResolvedValue = (...args) => fn.mockImplementation(() => Promise.resolve(...args))
  fn.mockRejectedValue = (...args) => fn.mockImplementation(() => Promise.reject(...args))
  return {
    __esModule: true,
    default: fn
  }
})
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
describe('courseManagement.js API', () => {
  // getCourseStats
  test('getCourseStats 正常返回', async () => {
    request.mockResolvedValue({ data: { code: 200, data: { stats: 1 } } })
    const res = await courseManagementApi.getCourseStats('cid')
    expect(res.data.data.stats).toBe(1)
  })
  test('getCourseStats 错误返回', async () => {
    request.mockRejectedValue(new Error('not found'))
    await expect(courseManagementApi.getCourseStats('bad')).rejects.toThrow('not found')
  })

  // getClassStudents
  test('getClassStudents 正常返回', async () => {
    request.mockResolvedValue({ data: { code: 200, data: [{ id: 's1' }] } })
    const res = await courseManagementApi.getClassStudents('cid')
    expect(res.data.data[0].id).toBe('s1')
  })
  test('getClassStudents 错误返回', async () => {
    request.mockRejectedValue(new Error('fail'))
    await expect(courseManagementApi.getClassStudents('bad')).rejects.toThrow('fail')
  })

  // importStudents
  test('importStudents 正常返回', async () => {
    request.mockResolvedValue({ data: { code: 200, data: { importedCount: 2 } } })
    const res = await courseManagementApi.importStudents('cid', ['s1', 's2'])
    expect(res.data.data.importedCount).toBe(2)
  })
  test('importStudents 错误返回', async () => {
    request.mockRejectedValue(new Error('导入失败'))
    await expect(courseManagementApi.importStudents('cid', [])).rejects.toThrow('导入失败')
  })

  // getClassAssignments
  test('getClassAssignments 正常返回', async () => {
    request.mockResolvedValue({ data: { code: 200, data: [{ id: 'a1' }] } })
    const res = await courseManagementApi.getClassAssignments('cid')
    expect(res.data.data[0].id).toBe('a1')
  })
  test('getClassAssignments 错误返回', async () => {
    request.mockRejectedValue(new Error('fail'))
    await expect(courseManagementApi.getClassAssignments('bad')).rejects.toThrow('fail')
  })

  // exportCourseGrades
  test('exportCourseGrades 正常返回', async () => {
    request.mockResolvedValue({ data: { code: 200 }, blob: new Blob() })
    const res = await courseManagementApi.exportCourseGrades('cid')
    expect(res.data.code).toBe(200)
  })
  test('exportCourseGrades 错误返回', async () => {
    request.mockRejectedValue(new Error('导出失败'))
    await expect(courseManagementApi.exportCourseGrades('bad')).rejects.toThrow('导出失败')
  })

  // sendAssignmentReminder
  test('sendAssignmentReminder 正常返回', async () => {
    request.mockResolvedValue({ data: { code: 200, data: { success: true } } })
    const res = await courseManagementApi.sendAssignmentReminder('aid', ['s1'])
    expect(res.data.data.success).toBe(true)
  })
  test('sendAssignmentReminder 错误返回', async () => {
    request.mockRejectedValue(new Error('提醒失败'))
    await expect(courseManagementApi.sendAssignmentReminder('aid', ['s1'])).rejects.toThrow('提醒失败')
  })

  // getStudentsProgress
  test('getStudentsProgress 正常返回', async () => {
    request.mockResolvedValue({ data: { code: 200, data: [{ id: 's1' }] } })
    const res = await courseManagementApi.getStudentsProgress('cid')
    expect(res.data.data[0].id).toBe('s1')
  })
  test('getStudentsProgress 错误返回', async () => {
    request.mockRejectedValue(new Error('fail'))
    await expect(courseManagementApi.getStudentsProgress('bad')).rejects.toThrow('fail')
  })

  // getCourseDetail
  test('getCourseDetail 正常返回', async () => {
    request.mockResolvedValue({ data: { code: 200, data: { id: 'c1' } } })
    const res = await courseManagementApi.getCourseDetail('cid')
    expect(res.data.data.id).toBe('c1')
  })
  test('getCourseDetail 错误返回', async () => {
    request.mockRejectedValue(new Error('fail'))
    await expect(courseManagementApi.getCourseDetail('bad')).rejects.toThrow('fail')
  })

  // getUserDetail
  test('getUserDetail 正常返回', async () => {
    request.mockResolvedValue({ data: { code: 200, data: { id: 'u1' } } })
    const res = await courseManagementApi.getUserDetail('uid')
    expect(res.data.data.id).toBe('u1')
  })
  test('getUserDetail 错误返回', async () => {
    request.mockRejectedValue(new Error('fail'))
    await expect(courseManagementApi.getUserDetail('bad')).rejects.toThrow('fail')
  })

  // getAssignmentDetail
  test('getAssignmentDetail 正常返回', async () => {
    request.mockResolvedValue({ data: { code: 200, data: { id: 'a1' } } })
    const res = await courseManagementApi.getAssignmentDetail('aid')
    expect(res.data.data.id).toBe('a1')
  })
  test('getAssignmentDetail 错误返回', async () => {
    request.mockRejectedValue(new Error('fail'))
    await expect(courseManagementApi.getAssignmentDetail('bad')).rejects.toThrow('fail')
  })

  // updateAssignment
  test('updateAssignment 正常返回', async () => {
    request.mockResolvedValue({ data: { code: 200, data: { id: 'a1' } } })
    const res = await courseManagementApi.updateAssignment('aid', { title: '新作业' })
    expect(res.data.data.id).toBe('a1')
  })
  test('updateAssignment 错误返回', async () => {
    request.mockRejectedValue(new Error('fail'))
    await expect(courseManagementApi.updateAssignment('bad', {})).rejects.toThrow('fail')
  })

  // getAssignmentSubmissions
  test('getAssignmentSubmissions 正常返回', async () => {
    request.mockResolvedValue({ data: { code: 200, data: [{ id: 's1' }] } })
    const res = await courseManagementApi.getAssignmentSubmissions('cid', 'aid')
    expect(res.data.data[0].id).toBe('s1')
  })
  test('getAssignmentSubmissions 错误返回', async () => {
    request.mockRejectedValue(new Error('fail'))
    await expect(courseManagementApi.getAssignmentSubmissions('bad', 'aid')).rejects.toThrow('fail')
  })

  // getAssignmentStats
  test('getAssignmentStats 正常返回', async () => {
    request.mockResolvedValue({ data: { code: 200, data: { stat: 1 } } })
    const res = await courseManagementApi.getAssignmentStats('aid')
    expect(res.data.data.stat).toBe(1)
  })
  test('getAssignmentStats 错误返回', async () => {
    request.mockRejectedValue(new Error('fail'))
    await expect(courseManagementApi.getAssignmentStats('bad')).rejects.toThrow('fail')
  })

  // getAssignmentChapters
  test('getAssignmentChapters 正常返回', async () => {
    request.mockResolvedValue({ data: { code: 200, data: [{ id: 'ch1' }] } })
    const res = await courseManagementApi.getAssignmentChapters('cid')
    expect(res.data.data[0].id).toBe('ch1')
  })
  test('getAssignmentChapters 错误返回', async () => {
    request.mockRejectedValue(new Error('fail'))
    await expect(courseManagementApi.getAssignmentChapters('bad')).rejects.toThrow('fail')
  })

  // getStudentDetails
  test('getStudentDetails 正常返回', async () => {
    request.mockResolvedValue({ data: { code: 200, data: { id: 's1' } } })
    const res = await courseManagementApi.getStudentDetails('sid')
    expect(res.data.data.id).toBe('s1')
  })
  test('getStudentDetails 错误返回', async () => {
    request.mockRejectedValue(new Error('fail'))
    await expect(courseManagementApi.getStudentDetails('bad')).rejects.toThrow('fail')
  })

  // getBatchAssignmentStats
  test('getBatchAssignmentStats 正常返回', async () => {
    request.mockResolvedValue({ data: { code: 200, data: [{ stat: 1 }] } })
    const res = await courseManagementApi.getBatchAssignmentStats(['a1', 'a2'])
    expect(res.data.data[0].stat).toBe(1)
  })
  test('getBatchAssignmentStats 错误返回', async () => {
    request.mockRejectedValue(new Error('fail'))
    await expect(courseManagementApi.getBatchAssignmentStats([])).rejects.toThrow('fail')
  })

  // updateAssignmentChapter
  test('updateAssignmentChapter 正常返回', async () => {
    request.mockResolvedValue({ data: { code: 200, data: { chapterId: 'ch1' } } })
    const res = await courseManagementApi.updateAssignmentChapter('aid', 'ch1')
    expect(res.data.data.chapterId).toBe('ch1')
  })
  test('updateAssignmentChapter 错误返回', async () => {
    request.mockRejectedValue(new Error('fail'))
    await expect(courseManagementApi.updateAssignmentChapter('aid', 'bad')).rejects.toThrow('fail')
  })

  // getCourseChapters
  // test('getCourseChapters 正常返回', async () => {
  //   // getCourseChapters 依赖 getCourseDetail 返回 response.data.chapters
  //   vi.spyOn(courseManagementApi, 'getCourseDetail').mockResolvedValue({ data: { data: { chapters: [{ id: 'ch1' }] } } })
  //   const res = await courseManagementApi.getCourseChapters('cid')
  //   expect(res).toEqual([{ id: 'ch1' }])
  // })
  // test('getCourseChapters 错误返回', async () => {
  //   vi.spyOn(courseManagementApi, 'getCourseDetail').mockResolvedValue({ data: { data: {} } })
  //   const res = await courseManagementApi.getCourseChapters('cid')
  //   expect(res).toEqual([])
  // })

  // getStudentAssignmentSummary
  test('getStudentAssignmentSummary 正常返回', async () => {
    request.mockResolvedValue({ data: { code: 200, data: { summary: 1 } } })
    const res = await courseManagementApi.getStudentAssignmentSummary('cid', 'sid')
    expect(res.data.data.summary).toBe(1)
  })
  test('getStudentAssignmentSummary 错误返回', async () => {
    request.mockRejectedValue(new Error('fail'))
    await expect(courseManagementApi.getStudentAssignmentSummary('bad', 'sid')).rejects.toThrow('fail')
  })

  // createClass
  test('createClass 正常返回', async () => {
    request.mockResolvedValue({ data: { code: 201, data: { id: 'c1' } } })
    const res = await courseManagementApi.createClass({ name: '新班级' })
    expect(res.data.data.id).toBe('c1')
  })
  test('createClass 错误返回', async () => {
    request.mockRejectedValue(new Error('fail'))
    await expect(courseManagementApi.createClass({})).rejects.toThrow('fail')
  })

  // removeStudentFromClass
  test('removeStudentFromClass 正常返回', async () => {
    request.mockResolvedValue({ data: { code: 200, data: { success: true } } })
    const res = await courseManagementApi.removeStudentFromClass('cid', 'sid')
    expect(res.data.data.success).toBe(true)
  })
  test('removeStudentFromClass 错误返回', async () => {
    request.mockRejectedValue(new Error('fail'))
    await expect(courseManagementApi.removeStudentFromClass('cid', 'sid')).rejects.toThrow('fail')
  })
})
