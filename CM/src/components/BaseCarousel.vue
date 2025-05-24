<!-- 轮播图组件 -->
<template>
  <div class="carousel-container">
    <div class="carousel" ref="carousel">
      <div 
        v-for="(slide, index) in slides" 
        :key="index" 
        class="carousel-slide"
        :class="{ active: currentSlide === index }"
      >
        <img :src="slide.image" :alt="slide.title" class="carousel-image" />
        <div class="carousel-content">
          <h2>{{ slide.title }}</h2>
          <p>{{ slide.description }}</p>
        </div>
      </div>
    </div>
    <div class="carousel-indicators">
      <span 
        v-for="(_, index) in slides" 
        :key="index"
        class="indicator"
        :class="{ active: currentSlide === index }"
        @click="setSlide(index)"
      ></span>
    </div>
    <button class="carousel-control prev" @click="prevSlide">
      <span class="arrow">&#10094;</span>
    </button>
    <button class="carousel-control next" @click="nextSlide">
      <span class="arrow">&#10095;</span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import pic1 from '@/assets/pic_1.png'
import pic13 from '@/assets/pic_13.png'
import login from '@/assets/login.png'

const slides = [
  { image: login },
  {
    image: pic1,
    title: '让教学变得更简单',
    description: '智慧教育平台助力教学创新'
  },
  {
    image: pic13,
    title: '个性化学习体验',
    description: '为每位学生提供定制化学习路径'
  }
];

const currentSlide = ref(0);
let slideInterval = null;
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.length;
};
const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.length) % slides.length;
};
const setSlide = (index) => {
  currentSlide.value = index;
};
onMounted(() => {
  slideInterval = setInterval(nextSlide, 5000);
});
onUnmounted(() => {
  if (slideInterval) clearInterval(slideInterval);
});
</script>



<style scoped>
.carousel-container {
  position: relative;
  height: 600px;
  overflow: hidden;
  margin-bottom: 20px;
}
.carousel {
  width: 100%;
  height: 100%;
  position: relative;
}
.carousel-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}
.carousel-slide.active {
  opacity: 1;
}
.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.carousel-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}
.carousel-content h2 {
  font-size: 36px;
  margin-bottom: 10px;
}
.carousel-indicators {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
}
.indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: background-color 0.3s;
}
.indicator.active {
  background-color: white;
}
.carousel-control {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.3);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s;
}
.carousel-control:hover {
  background-color: rgba(0, 0, 0, 0.5);
}
.prev {
  left: 20px;
}
.next {
  right: 20px;
}
@media (max-width: 768px) {
  .course-list {
    grid-template-columns: 1fr;
  }
  .carousel-container {
    height: 300px;
  }
  .carousel-content h2 {
    font-size: 24px;
  }
}
</style>