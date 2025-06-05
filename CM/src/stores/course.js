import { defineStore } from 'pinia'

export const useCourseStore = defineStore('course', {
  state: () => ({
    currentExerciseId: null,
    currentSubmissionId: null,
    retryExerciseId: null,     // 新增：错题重做的练习ID
    retrySubmissionId: null,   // 新增：错题重做的提交ID
  }),

  actions: {
    setCurrentExerciseId(id) {
      this.currentExerciseId = id
    },
    setCurrentSubmissionId(id) {
      this.currentSubmissionId = id
    },
    // 新增：设置错题重做相关信息
    setRetryInfo(exerciseId, submissionId) {
      this.retryExerciseId = exerciseId
      this.retrySubmissionId = submissionId
    },
    // 新增：清除错题重做信息
    clearRetryInfo() {
      this.retryExerciseId = null
      this.retrySubmissionId = null
    }
  }
})