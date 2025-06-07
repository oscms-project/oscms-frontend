<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-5xl mx-auto">
      <header class="mb-10 text-center">
        <h1 class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700 sm:text-5xl">
          我的收藏夹
        </h1>
        <p class="mt-3 text-lg text-gray-600">
          您收藏的题目都在这里，方便随时回顾和练习。
        </p>
      </header>

      <!-- Loading State -->
      <div v-if="isLoading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        <div v-for="n in 6" :key="n" class="bg-white rounded-xl shadow-lg p-6 animate-pulse">
          <div class="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div class="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div class="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
          <div class="flex gap-2 mb-6">
            <div class="h-5 bg-gray-200 rounded-full w-16"></div>
            <div class="h-5 bg-gray-200 rounded-full w-16"></div>
          </div>
          <div class="h-10 bg-gray-300 rounded-lg w-full"></div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white rounded-xl shadow-lg p-10 text-center">
        <div class="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-600 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">加载失败</h2>
        <p class="text-gray-500">无法加载您收藏的题目，请稍后再试。</p>
        <p class="text-sm text-red-500 mt-1">{{ error.message || '未知错误' }}</p>
        <button @click="fetchFavorites" class="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          重试
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="favorites.length === 0" class="bg-white rounded-xl shadow-lg p-12 text-center">
         <div class="inline-flex items-center justify-center h-20 w-20 rounded-full bg-blue-100 text-blue-600 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="h-12 w-12 text-blue-600">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
        </div>
        <h2 class="text-3xl font-semibold text-gray-700 mb-3">空空如也</h2>
        <p class="text-gray-500 mb-8 text-lg">您还没有收藏任何题目哦！</p>
      </div>

      <!-- Content: Favorite Exercises Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        <FavoriteExerciseCard 
          v-for="exercise in favorites" 
          :key="exercise.id" 
          :exercise="exercise"
          @remove-favorite="handleRemoveFavorite"
          @view-exercise="handleViewExercise"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { getFavoriteExercises } from '@/api/user'; // Assuming you added it to user.js
// If you created favorites.js, use: import { getFavoriteExercises } from '@/api/favorites';
import FavoriteExerciseCard from '@/components/FavoriteExerciseCard.vue';

const router = useRouter();
const userStore = useUserStore();

const favorites = ref([]);
const isLoading = ref(true);
const error = ref(null);

const fetchFavorites = async () => {
  isLoading.value = true;
  error.value = null;
  if (!userStore.userId) {
    // This case should ideally be handled by route guards or earlier checks
    console.warn('用户未登录或用户ID无效');
    error.value = { message: '请先登录后再查看收藏。' };
    isLoading.value = false;
    favorites.value = []; // Clear favorites if user is not logged in
    return;
  }
  try {
    const data = await getFavoriteExercises(userStore.userId);
    favorites.value = data;
  } catch (err) {
    console.error('Failed to fetch favorite exercises:', err);
    error.value = err;
  } finally {
    isLoading.value = false;
  }
};

const handleRemoveFavorite = (exerciseId) => {
  // Placeholder: Implement API call to remove favorite
  console.log('Attempting to remove favorite:', exerciseId);
  // Example: favorites.value = favorites.value.filter(ex => ex.id !== exerciseId);
  // Show a success/error message
  alert(`模拟取消收藏题目 ID: ${exerciseId}。请对接实际API。`);
  // After successful API call, refetch or filter locally:
  // fetchFavorites(); 
  // OR
  favorites.value = favorites.value.filter(fav => fav.id !== exerciseId);
};

const handleViewExercise = (exerciseId) => {
  // Placeholder: Navigate to the exercise details page
  console.log('Viewing exercise:', exerciseId);
  // Example: router.push(`/exercises/${exerciseId}`);
  alert(`模拟查看题目 ID: ${exerciseId}。请实现跳转逻辑。`);
};


onMounted(() => {
  fetchFavorites();
});

</script>

<style>
/* Remove the old scoped styles. All styling is now done with Tailwind CSS. */
/* If you have global styles affecting this page, they would be in your main CSS file. */
</style>
