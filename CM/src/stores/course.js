import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
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
    clearState
  }
})