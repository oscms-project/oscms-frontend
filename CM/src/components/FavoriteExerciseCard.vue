<template>
  <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 ease-in-out">
    <div class="p-6">
      <div class="flex justify-between items-start mb-3">
        <h3 class="text-xl font-semibold text-gray-800 leading-tight" :title="exercise.title || '题目加载中...'">
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

      <p v-if="exercise.description" class="text-gray-600 text-sm mb-4">
        {{ exercise.description }}
      </p>
      <p v-else class="text-gray-400 text-sm italic mb-4">
        暂无题目描述。
      </p>

      <div class="flex flex-wrap gap-2 mb-4">
        <span 
          v-if="exercise.type"
          class="px-3 py-1 text-xs font-medium rounded-full"
          :class="typeBadgeClass" 
        >
          {{ formattedExerciseType }}
        </span>
        <span 
          v-if="exercise.difficulty"
          class="px-3 py-1 text-xs font-medium rounded-full"
          :class="difficultyBadgeClass"
        >
          {{ exercise.difficulty === 'easy' ? '简单' : exercise.difficulty === 'medium' ? '中等' : exercise.difficulty === 'hard' ? '困难' : exercise.difficulty || '未知难度' }}
        </span>
        <span
          v-if="exercise.score !== null && exercise.score !== undefined"
          class="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700"
        >
          分值: {{ exercise.score }}
        </span>
      </div>

      <!-- Choices (if applicable) -->
      <div v-if="isChoiceType && exercise.choices && exercise.choices.length" class="mb-4">
        <h4 class="text-sm font-semibold text-gray-700 mb-1">选项:</h4>
        <ul class="list-none pl-0 space-y-1 text-sm">
          <li v-for="(choice, index) in exercise.choices" :key="choice.id || index" 
              class="p-1.5 rounded bg-gray-50 border border-gray-100">
            <span class="font-medium text-gray-600">{{ choice.label || String.fromCharCode(65 + index) }}.</span>
            <!-- 兼容所有常见字段，兜底只展示所有字段值拼接，不显示key和引号 -->
            {{
              choice.text ||
              choice.content ||
              choice.optionText ||
              choice.value ||
              choice.labelText ||
              choice.title ||
              Object.values(choice).filter(v => typeof v === 'string' && v.trim() && v !== choice.label).join('，')
            }}
          </li>
        </ul>
      </div>

      <!-- Correct Answer -->
      <div v-if="exercise.correctAnswer !== null && exercise.correctAnswer !== undefined" class="mb-4">
        <h4 class="text-sm font-semibold text-gray-700 mb-1">正确答案:</h4>
        <div class="p-1.5 rounded bg-green-50 text-green-800 text-sm border border-green-200 whitespace-pre-wrap">
          {{ formattedCorrectAnswer }}
        </div>
      </div>

      <!-- "View Exercise" button removed -->
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  exercise: {
    type: Object,
    required: true,
    default: () => ({
      id: null,
      title: '加载中...',
      description: '',
      type: '', // e.g., SINGLE_CHOICE, MULTIPLE_CHOICE, SHORT_ANSWER, CODING
      difficulty: '', // e.g., easy, medium, hard
      score: null,
      choices: [], // Array of objects: { id, label, text/content }
      correctAnswer: null // String or Array of strings (for MULTIPLE_CHOICE)
    })
  }
});

defineEmits(['remove-favorite']);

const formattedExerciseType = computed(() => {
  const type = props.exercise.type;
  switch (type) {
    case 'choice': // General fallback or if API uses this
    case 'SINGLE_CHOICE':
      return '单选题';
    case 'MULTIPLE_CHOICE':
      return '多选题';
    case 'programming': // General fallback
    case 'CODING':
      return '编程题';
    case 'SHORT_ANSWER':
      return '简答题';
    case 'FILL_IN_BLANK':
      return '填空题';
    default:
      return props.exercise.type || '未知类型';
  }
});

const typeBadgeClass = computed(() => {
  const type = props.exercise.type;
  switch (type) {
    case 'choice':
    case 'SINGLE_CHOICE':
    case 'MULTIPLE_CHOICE':
      return 'bg-sky-100 text-sky-700';
    case 'programming':
    case 'CODING':
      return 'bg-emerald-100 text-emerald-700';
    case 'SHORT_ANSWER':
      return 'bg-amber-100 text-amber-700';
    case 'FILL_IN_BLANK':
      return 'bg-purple-100 text-purple-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
});

const difficultyBadgeClass = computed(() => {
  const difficulty = props.exercise.difficulty;
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

const isChoiceType = computed(() => {
  const type = props.exercise.type;
  return type === 'choice' || type === 'SINGLE_CHOICE' || type === 'MULTIPLE_CHOICE';
});

const formattedCorrectAnswer = computed(() => {
  const exercise = props.exercise;
  if (exercise.correctAnswer === null || exercise.correctAnswer === undefined) return '未提供';

  if (isChoiceType.value) {
    const answers = Array.isArray(exercise.correctAnswer) ? exercise.correctAnswer : [exercise.correctAnswer];
    if (exercise.choices && exercise.choices.length > 0) {
      const answerTexts = answers.map(ans => {
        // Attempt to find choice by label (e.g., 'A'), id, or even direct text match if label/id is not the answer key
        const choice = exercise.choices.find(c => 
          String(c.label).toUpperCase() === String(ans).toUpperCase() || 
          String(c.id) === String(ans) ||
          (c.text && String(c.text).trim() === String(ans).trim()) || // Less common, but possible
          (c.content && String(c.content).trim() === String(ans).trim()) // Alias for text
        );
        return choice ? `${choice.label || ans}. ${choice.text || choice.content}` : ans;
      });
      return answerTexts.join('; ');
    }
    return answers.join(', '); // Fallback if choices are not detailed or don't match
  }
  // For non-choice questions, correctAnswer might be a string or an array of strings (e.g. fill-in-the-blank)
  if (Array.isArray(exercise.correctAnswer)) {
    return exercise.correctAnswer.join('; ');
  }
  return String(exercise.correctAnswer);
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
