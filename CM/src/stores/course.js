import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCourseStore = defineStore('course', () => {
  // 当前选中的课程ID
  const currentCourseId = ref('')
  
  // 设置当前课程ID的方法
  function setCurrentCourseId(courseId) {
    currentCourseId.value = courseId
  }
  
  return {
    currentCourseId,
    setCurrentCourseId
  }
})