<template>
  <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 ease-in-out">
    <div class="p-6">
      <div class="flex justify-between items-start mb-3">
        <h3 class="text-xl font-semibold text-gray-800 leading-tight truncate" :title="exercise.title || '题目加载中...'">
          {{ exercise.title || '题目加载中...' }}
        </h3>
        <button 
          @click="$emit('remove-favorite', exercise.id)" 
          class="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-red-300"
          title="取消收藏"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" stroke="none">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      <p v-if="exercise.description" class="text-gray-600 text-sm mb-4 h-10 overflow-hidden text-ellipsis">
        {{ exercise.description }}
      </p>
      <p v-else class="text-gray-400 text-sm italic mb-4 h-10">
        暂无题目描述。
      </p>

      <div class="flex flex-wrap gap-2 mb-6">
        <span 
          v-if="exercise.type"
          class="px-3 py-1 text-xs font-medium rounded-full"
          :class="typeBadgeClass(exercise.type)"
        >
          {{ exercise.type === 'choice' ? '选择题' : exercise.type === 'programming' ? '编程题' : exercise.type || '未知类型' }}
        </span>
        <span 
          v-if="exercise.difficulty"
          class="px-3 py-1 text-xs font-medium rounded-full"
          :class="difficultyBadgeClass(exercise.difficulty)"
        >
          {{ exercise.difficulty === 'easy' ? '简单' : exercise.difficulty === 'medium' ? '中等' : exercise.difficulty === 'hard' ? '困难' : exercise.difficulty || '未知难度' }}
        </span>
      </div>

      <button 
        @click="$emit('view-exercise', exercise.id)"
        class="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75 transition-all duration-300 ease-in-out transform hover:-translate-y-0.5"
      >
        查看题目
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

defineProps({
  exercise: {
    type: Object,
    required: true,
    default: () => ({ // Default structure for placeholder/loading state
      id: null,
      title: '加载中...', 
      description: '',
      type: '',
      difficulty: ''
    })
  }
});

defineEmits(['remove-favorite', 'view-exercise']);

const typeBadgeClass = computed(() => (type) => {
  switch (type) {
    case 'choice':
      return 'bg-sky-100 text-sky-700';
    case 'programming':
      return 'bg-emerald-100 text-emerald-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
});

const difficultyBadgeClass = computed(() => (difficulty) => {
  switch (difficulty) {
    case 'easy':
      return 'bg-green-100 text-green-700';
    case 'medium':
      return 'bg-yellow-100 text-yellow-700';
    case 'hard':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
});
</script>

<style scoped>
/* Add any additional scoped styles if Tailwind isn't enough */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.h-10 {
  height: 2.5rem; /* for description line clamping, approx 2 lines */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2; /* Standard property */
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
