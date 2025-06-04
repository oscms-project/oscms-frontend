<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <!-- 顶部导航栏 -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center">
        <button class="flex items-center text-gray-700 hover:text-gray-900" @click="confirmExit">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
            <path d="m15 18-6-6 6-6"></path>
          </svg>
          <span class="text-lg font-medium">返回练习列表</span>
        </button>
      </div>

      <!-- 计时器 -->
      <div class="bg-white shadow-md rounded-lg px-4 py-2 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
          class="mr-2 text-gray-600">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        <span class="font-medium">做题时长: {{ formatTime(elapsedTime) }}</span>
      </div>
    </div>

    <!-- 防作弊警告 -->
    <div v-if="showWarning" class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <div class="flex items-center justify-center text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <h3 class="text-xl font-bold text-center mb-2">警告</h3>
        <p class="text-center mb-4">{{ warningMessage }}</p>
        <p class="text-center text-sm text-gray-500 mb-4">检测到可能的作弊行为，已记录。多次违规可能会影响成绩。</p>
        <div class="flex justify-center">
          <button class="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg"
            @click="dismissWarning">
            我知道了
          </button>
        </div>
      </div>
    </div>

    <!-- 练习内容 -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">{{ exercise.title }}</h1>
        <div class="text-sm text-gray-500">
          总分: {{ exercise.totalPoints }} 分
        </div>
      </div>

      <!-- 练习说明 -->
      <div class="bg-gray-50 rounded-lg p-4 mb-6">
        <h2 class="font-medium mb-2">练习说明:</h2>
        <p>{{ exercise.description }}</p>
        <div class="mt-2 text-sm text-gray-500">
          <p>• 请独立完成，不要切换页面或复制粘贴</p>
          <p>• 提交后将无法修改，请确认后再提交</p>
          <p v-if="exercise.timeLimit">• 时间限制: {{ exercise.timeLimit }} 分钟</p>
        </div>
      </div>

      <!-- 选择题 -->
      <div v-if="exercise.type === 'choice'">
        <div v-for="(question, qIndex) in exercise.questions" :key="qIndex" class="mb-8">
          <div class="mb-2 font-medium">{{ qIndex + 1 }}. {{ question.text }}</div>
          <div class="ml-4 space-y-2">
            <div v-for="(option, oIndex) in question.options" :key="oIndex"
              class="flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-50"
              :class="{ 'bg-green-50 border border-green-200': answers[qIndex] === oIndex }"
              @click="selectAnswer(qIndex, oIndex)">
              <div class="w-6 h-6 rounded-full flex items-center justify-center border mr-2"
                :class="{ 'bg-green-500 border-green-500 text-white': answers[qIndex] === oIndex, 'border-gray-300': answers[qIndex] !== oIndex }">
                {{ ['A', 'B', 'C', 'D'][oIndex] }}
              </div>
              <div>{{ option }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 编程题 -->
      <div v-if="exercise.type === 'programming'">
        <div v-for="(question, qIndex) in exercise.questions" :key="qIndex" class="mb-8">
          <div class="mb-2 font-medium">{{ qIndex + 1 }}. {{ question.text }}</div>
          <div class="mb-2 text-sm text-gray-600">{{ question.description }}</div>

          <!-- 代码编辑器 -->
          <div class="border rounded-lg overflow-hidden">
            <div class="bg-gray-100 px-4 py-2 border-b flex justify-between items-center">
              <span>{{ question.language }}</span>
              <div class="text-sm text-gray-500">请在此编写代码</div>
            </div>
            <textarea v-model="codeAnswers[qIndex]" class="w-full p-4 font-mono text-sm h-64 focus:outline-none"
              placeholder="在此编写代码..." @copy="detectCopy" @paste="detectPaste" @cut="detectCut"></textarea>
          </div>
        </div>
      </div>

      <!-- 提交按钮 -->
      <div class="mt-8 flex justify-between items-center">
        <div class="text-sm text-gray-500">
          <span v-if="exercise.timeLimit">剩余时间: {{ formatTime(remainingTime) }}</span>
        </div>
        <div class="flex space-x-4">
          <button class="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-lg"
            @click="confirmSubmit">
            提交答案
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router'
import { getAssignmentQuestions, submitAssignmentAnswers } from '@/api/assignment'
import { useCourseStore } from '@/stores/course';
import { useUserStore } from '@/stores/user';
const userStore = useUserStore();
const courseStore = useCourseStore();
const router = useRouter();
// 练习数据 - 使用接口数据
const exercise = ref({
  id: 'ex-002',
  title: '栈与队列实现',
  type: 'programming',
  questions: []
});

// 答案状态
const answers = ref([]);
const codeAnswers = ref([]);

// 初始化答案数组
if (exercise.value.type === 'choice') {
  answers.value = new Array(exercise.value.questions.length).fill(null);
} else if (exercise.value.type === 'programming') {
  codeAnswers.value = new Array(exercise.value.questions.length).fill('');
}

// 选择答案
const selectAnswer = (questionIndex, optionIndex) => {
  answers.value[questionIndex] = optionIndex;
};

// 计时器相关
const startTime = ref(Date.now());
const elapsedTime = ref(0);
const remainingTime = computed(() => {
  if (!exercise.value.timeLimit) return 0;
  const timeLimit = exercise.value.timeLimit * 60; // 转换为秒
  return Math.max(0, timeLimit - elapsedTime.value);
});

// 格式化时间（秒 -> mm:ss）
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// 更新计时器
let timerInterval;
const updateTimer = () => {
  elapsedTime.value = Math.floor((Date.now() - startTime.value) / 1000);

  // 如果设置了时间限制且时间已到，自动提交
  if (exercise.value.timeLimit && remainingTime.value <= 0) {
    clearInterval(timerInterval);
    submitExercise();
  }
};

// 防作弊相关
const showWarning = ref(false);
const warningMessage = ref('');
const warningCount = ref(0);

// 检测页面失焦（切换标签页或窗口）
const handleVisibilityChange = () => {
  if (document.hidden) {
    warningCount.value++;
    warningMessage.value = '检测到您切换了页面！请不要在考试期间浏览其他网页。';
    showWarning.value = true;
  }
};

// 检测复制操作
const detectCopy = (event) => {
  event.preventDefault();
  warningCount.value++;
  warningMessage.value = '检测到复制操作！请不要在考试期间复制内容。';
  showWarning.value = true;
};

// 检测粘贴操作
const detectPaste = (event) => {
  event.preventDefault();
  warningCount.value++;
  warningMessage.value = '检测到粘贴操作！请不要在考试期间粘贴内容。';
  showWarning.value = true;
};

// 检测剪切操作
const detectCut = (event) => {
  event.preventDefault();
  warningCount.value++;
  warningMessage.value = '检测到剪切操作！请不要在考试期间剪切内容。';
  showWarning.value = true;
};

// 关闭警告
const dismissWarning = () => {
  showWarning.value = false;
};

// 确认退出
const confirmExit = () => {
  if (confirm('确定要退出吗？未保存的进度将会丢失。')) {
        router.push({ name: 'StudentCourses'});
  } else {
    console.log('用户取消了退出操作');
  }
};

// 确认提交
const confirmSubmit = () => {
  if (confirm('确定要提交吗？提交后将无法修改答案。')) {
    submitExercise();
  }
};

// 提交练习
const submitExercise = async () => {
  try {
    const assignmentId = userStore.currentAssignmentId;
    const classId = courseStore.currentClassId; // 假设班级id也在store里
    const studentId = userStore.userId;

    // 构造 answers 数组
    const answersArr = exercise.value.questions.map((question, index) => ({
      questionId: question.id,
      response: exercise.value.type === 'choice'
        ? answers.value[index]?.toString()
        : codeAnswers.value[index]
    }))

    await submitAssignmentAnswers(classId, assignmentId, { studentId, answers: answersArr })

    alert('答案已提交')
    router.push({ name: 'ExerciseFeedback', params: { id: exercise.value.id } })
  } catch (e) {
    alert(e.message || '提交失败')
  }
}

// 组件挂载时
onMounted(async () => {
  // 启动计时器
  timerInterval = setInterval(updateTimer, 1000);

  // 添加页面可见性变化事件监听
  document.addEventListener('visibilitychange', handleVisibilityChange);

  // 禁用右键菜单
  document.addEventListener('contextmenu', (e) => e.preventDefault());

  try {
    const assignmentId = userStore.currentAssignmentId;
    const questions = await getAssignmentQuestions(assignmentId);
    const exerciseId = courseStore.currentExerciseId;
    console.log('获取练习信息，ID:', exerciseId);
    // 检查是否有有效的练习ID
    if (!exerciseId) {
      console.error('未找到练习ID');
      alert('未找到练习信息');
      router.push('/student/courses'); // 返回课程页面
      return;
    }
    exercise.value = {
      questions
    }
    if (exercise.value.type === 'choice') {
      answers.value = new Array(exercise.value.questions.length).fill(null);
    } else if (exercise.value.type === 'programming') {
      codeAnswers.value = new Array(exercise.value.questions.length).fill('');
    }
  } catch (e) {
    console.error('获取题目失败:', e.message || '请求失败')
  }
});

// 组件卸载时
onUnmounted(() => {
  // 清除计时器
  clearInterval(timerInterval);

  // 移除事件监听
  document.removeEventListener('visibilitychange', handleVisibilityChange);
});
</script>

<style scoped>
/* 禁用文本选择 */
.disable-select {
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}
</style>