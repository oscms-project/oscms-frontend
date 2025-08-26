<template>
  <div class="course-card" :style="{ backgroundColor: course.bgColor }">
    <div class="course-image" :style="{ backgroundImage: `url(${course.image})` }">
      <h3 class="course-title">{{ course.title || course.name }}</h3>
    </div>
    <div class="course-info">
      <h4>{{ course.title || course.name }}</h4>
      <slot name="desc">
        <!-- 默认展示教师或课程代码 -->
        <p v-if="course.teacher" class="teacher">教师：{{ course.teacher }}</p>
        <p v-if="course.code" class="course-code">课程代码：{{ course.code }}</p>
      </slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  course: {
    type: Object,
    required: true
  }
});
</script>

<style scoped>
.course-card {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}
.course-card:hover {
  transform: translateY(-5px);
}
.course-image {
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background-size: cover;
  background-position: center;
}
.course-title {
  font-size: 20px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}
.course-info {
  padding: 15px;
  background-color: white;
}
.course-info h4 {
  margin: 0 0 5px;
  font-size: 16px;
  color: #333;
}
.teacher, .course-code {
  margin: 0;
  color: #666;
  font-size: 14px;
}
</style>