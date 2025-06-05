import { defineStore } from 'pinia'

import { ref } from 'vue'

export const useCourseStore = defineStore('course', () => {
  // 当前选中的课程ID
  const currentCourseId = ref('')
  //选中的在线练习id
   const currentExerciseId = ref('')
  // 设置当前课程ID的方法
  function setCurrentCourseId(courseId) {
    currentCourseId.value = courseId
  }
  function setCurrentExerciseId(exerciseId) {
    currentExerciseId.value = exerciseId
  }
  return {
    currentCourseId,
    setCurrentCourseId,
     currentExerciseId,
    setCurrentExerciseId,
  }
}
)