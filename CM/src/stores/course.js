import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import router from '@/router' // 导入路由实例
import { ref } from 'vue'

export const useCourseStore = defineStore('course', () => {
  // 使用useLocalStorage替换普通ref，实现持久化
  // 当前选中的课程ID
  const currentCourseId = useLocalStorage('cm-current-course-id', '')
  // 选中的在线练习id
  const currentExerciseId = useLocalStorage('cm-current-exercise-id', '')
  // 当前提交ID
  const currentSubmissionId = useLocalStorage('cm-current-submission-id', '')
  // 错题重做相关状态
  const retryExerciseId = useLocalStorage('cm-retry-exercise-id', '')
  const retrySubmissionId = useLocalStorage('cm-retry-submission-id', '')
  //批改页面
  const currentAssignmentId = ref('')
  const currentAssignmentTitle = ref('')
  const isGradingMode = ref(false)
  const currentClassId = ref('')
  const currentClassName = ref('')
  // 设置当前课程ID的方法 - 函数保持不变
  function setCurrentCourseId(courseId) {
    currentCourseId.value = courseId
  }

  function setCurrentExerciseId(exerciseId) {
    currentExerciseId.value = exerciseId
  }

  function setCurrentSubmissionId(submissionId) {
    currentSubmissionId.value = submissionId
  }

  // 设置错题重做信息
  function setRetryInfo(exerciseId, submissionId) {
    retryExerciseId.value = exerciseId
    retrySubmissionId.value = submissionId
  }

  // 清除错题重做信息
  function clearRetryInfo() {
    retryExerciseId.value = ''
    retrySubmissionId.value = ''
  }
  // 批改页面相关方法
  function startGrading(assignmentId, assignmentTitle, classId, className) {
    currentAssignmentId.value = assignmentId
    currentAssignmentTitle.value = assignmentTitle
    currentClassId.value = classId
    currentClassName.value = className
    isGradingMode.value = true
  }

  function exitGrading() {
    currentAssignmentId.value = ''
    currentAssignmentTitle.value = ''
    currentClassId.value = ''
    currentClassName.value = ''
    isGradingMode.value = false
  }

  // 导航到批改页面
  async function navigateToGrading(exercise, classId, className) {
    try {
      if (!exercise?.id) {
        throw new Error('练习信息不完整')
      }

      if (!classId) {
        throw new Error('请先选择班级')
      }

      // 开始批改模式
      startGrading(exercise.id, exercise.title, classId, className)
      
      // 导航到批改页面
      await router.push({
        name: 'TeacherGradeExercise',
        params: { 
          id: exercise.id 
        }
      })
    } catch (error) {
      console.error('导航到批改页面时出错:', error)
      alert(error.message || '导航到批改页面失败，请重试')
      // 如果导航失败，退出批改模式
      exitGrading()
    }
  }

  // 清除所有状态
  function clearState() {
    currentCourseId.value = ''
    currentExerciseId.value = ''
    currentSubmissionId.value = ''
    clearRetryInfo()
  }

  return {
    currentCourseId,
    setCurrentCourseId,
    currentExerciseId,
    setCurrentExerciseId,
    currentSubmissionId,
    setCurrentSubmissionId,
    retryExerciseId,
    retrySubmissionId,
    setRetryInfo,
    clearRetryInfo,
     // 批改页面相关
    currentAssignmentId,
    currentAssignmentTitle,
    currentClassId,
    currentClassName,
    isGradingMode,
    startGrading,
    exitGrading,
    navigateToGrading,
    clearState
  }
})