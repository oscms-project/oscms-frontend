import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCourseStore = defineStore('course', () => {
  // 当前选中的课程ID
  const currentCourseId = ref('')
  // 选中的在线练习id
  const currentExerciseId = ref('')
  // 当前提交ID
  const currentSubmissionId = ref('')
  // 错题重做相关状态
  const retryExerciseId = ref('')
  const retrySubmissionId = ref('')

  // 设置当前课程ID的方法
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