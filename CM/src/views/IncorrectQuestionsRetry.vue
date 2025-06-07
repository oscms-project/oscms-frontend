<template>
    <div class="min-h-screen bg-gray-50 p-4">
        <!-- 顶部导航栏 -->
        <div class="flex justify-between items-center mb-6">
            <div class="flex items-center">
                <button class="flex items-center text-gray-700 hover:text-gray-900" @click="confirmExit">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="mr-2">
                        <path d="m15 18-6-6 6-6"></path>
                    </svg>
                    <span class="text-lg font-medium">返回练习反馈</span>
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

        <!-- 错题重做标题 -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <div class="flex justify-between items-center">
                <div>
                    <h1 class="text-2xl font-bold">{{ exercise.title }} 错题重做</h1>
                    <p class="text-sm text-gray-500 mt-1">仅显示上次做错的题目，共 {{ incorrectQuestions.length }} 题</p>
                </div>
                <div class="flex items-center">
                    <span class="text-sm text-gray-500 mr-2">进度: {{ currentQuestionIndex + 1 }}/{{
                        incorrectQuestions.length }}</span>
                    <div class="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div class="h-full bg-green-500"
                            :style="{ width: `${((currentQuestionIndex + 1) / incorrectQuestions.length) * 100}%` }">
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 题目内容 -->
        <div v-if="incorrectQuestions.length > 0" class="bg-white rounded-lg shadow-md p-6 mb-6">
            <div v-if="currentQuestion.type === 'choice'">
                <!-- 选择题 -->
                <div class="mb-6">
                    <div class="flex items-start">
                        <span class="font-medium mr-2">{{ currentQuestionIndex + 1 }}.</span>
                        <div>
                            <div class="font-medium">{{ currentQuestion.title }}</div>
                            <div class="text-sm text-gray-500 mt-1">{{ currentQuestion.score }} 分</div>
                        </div>
                    </div>

                    <div class="ml-6 space-y-2 mt-4">
                        <div v-for="(choice, oIndex) in currentQuestion.choices" :key="oIndex"
                            class="flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-50"
                            :class="{ 'bg-green-50 border border-green-200': newAnswers[currentQuestionIndex] === oIndex }"
                            @click="!questionSubmitted[currentQuestionIndex] && selectAnswer(oIndex)">
                            <div class="w-6 h-6 rounded-full flex items-center justify-center border mr-2"
                                :class="{ 'bg-green-500 border-green-500 text-white': newAnswers[currentQuestionIndex] === oIndex, 'border-gray-300': newAnswers[currentQuestionIndex] !== oIndex }">
                                {{ ['A', 'B', 'C', 'D'][oIndex] }}
                            </div>
                            <div>{{ choice }}</div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else>
                <!-- 编程题 -->
                <div class="mb-6">
                    <div class="flex items-start">
                        <span class="font-medium mr-2">{{ currentQuestionIndex + 1 }}.</span>
                        <div>
                            <div class="font-medium">{{ currentQuestion.title }}</div>
                            <div class="text-sm text-gray-500 mt-1">{{ currentQuestion.score }} 分</div>
                        </div>
                    </div>

                    <div class="ml-6 mt-4">
                        <div class="mb-2 text-sm text-gray-600">{{ currentQuestion.description }}</div>

                        <!-- 代码编辑器 -->
                        <div class="border rounded-lg overflow-hidden">
                            <div class="bg-gray-100 px-4 py-2 border-b flex justify-between items-center">
                                <span>{{ currentQuestion.language }}</span>
                                <div class="text-sm text-gray-500">请在此作答</div>
                            </div>
                            <textarea v-model="newCodeAnswers[currentQuestionIndex]"
                                class="w-full p-4 font-mono text-sm h-64 focus:outline-none" placeholder="在此作答..."
                                @copy="detectCopy" @paste="detectPaste" @cut="detectCut"
                                :disabled="questionSubmitted[currentQuestionIndex]"></textarea>
                        </div>

                        <!-- 上次测试结果 -->
                        <div v-if="currentQuestion.testResults" class="mt-4">
                            <div class="text-sm font-medium text-gray-700 mb-1">上次测试结果:</div>
                            <div class="border rounded-lg overflow-hidden">
                                <div v-for="(test, tIndex) in currentQuestion.testResults" :key="tIndex"
                                    class="border-b last:border-b-0 p-3"
                                    :class="{ 'bg-green-50': test.passed, 'bg-red-50': !test.passed }">
                                    <div class="flex items-center">
                                        <div class="w-5 h-5 rounded-full flex items-center justify-center mr-2"
                                            :class="{ 'bg-green-500 text-white': test.passed, 'bg-red-500 text-white': !test.passed }">
                                            <svg v-if="test.passed" xmlns="http://www.w3.org/2000/svg" width="14"
                                                height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                            <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                                stroke-linecap="round" stroke-linejoin="round">
                                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                                <line x1="6" y1="6" x2="18" y2="18"></line>
                                            </svg>
                                        </div>
                                        <div class="text-sm font-medium">测试 {{ tIndex + 1 }}: {{ test.name }}</div>
                                    </div>
                                    <div class="mt-2 text-sm">
                                        <div><span class="font-medium">输入:</span> {{ test.input }}</div>
                                        <div><span class="font-medium">期望输出:</span> {{ test.expectedOutput }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- 答案解析部分 - 只在题目提交后显示 -->
            <div v-if="questionSubmitted[currentQuestionIndex]" class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 class="text-lg font-bold text-blue-800 mb-2">答案解析</h3>
                
                <div class="mb-4">
                    <div class="font-medium text-gray-700">正确答案:</div>
                    <div v-if="currentQuestion.type === 'choice'" 
                         class="mt-2 px-4 py-2 bg-green-100 border border-green-200 rounded text-green-800 font-bold">
                        {{ formatCorrectAnswer(getCurrentQuestionCorrectAnswer) }}
                    </div>
                    <pre v-else 
                         class="mt-2 p-4 bg-gray-100 border border-gray-200 rounded text-gray-800 overflow-x-auto font-mono text-sm">{{ getCurrentQuestionCorrectAnswer }}</pre>
                </div>
                
                <div v-if="currentQuestion.explanation">
                    <div class="font-medium text-gray-700">解析说明:</div>
                    <p class="mt-2 px-4 py-2 bg-yellow-50 border border-yellow-200 rounded">
                        {{ currentQuestion.explanation }}
                    </p>
                </div>
            </div>

            <!-- 导航按钮 -->
            <div class="flex justify-between mt-6">
                <button class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-6 rounded-lg"
                    :disabled="currentQuestionIndex === 0"
                    :class="{ 'opacity-50 cursor-not-allowed': currentQuestionIndex === 0 }" @click="previousQuestion">
                    上一题
                </button>
                
                <!-- 当前题未提交时显示提交按钮 -->
                <button v-if="!questionSubmitted[currentQuestionIndex]"
                    class="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-lg"
                    @click="submitCurrentQuestion">
                    提交答案
                </button>
                
                <div>
                    <button v-if="currentQuestionIndex < incorrectQuestions.length - 1"
                        class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg"
                        :disabled="!questionSubmitted[currentQuestionIndex]"
                        :class="{ 'opacity-50 cursor-not-allowed': !questionSubmitted[currentQuestionIndex] }"
                        @click="nextQuestion">
                        下一题
                    </button>
                    
                    <button v-else 
                        class="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-6 rounded-lg"
                        :disabled="!allQuestionsSubmitted"
                        :class="{ 'opacity-50 cursor-not-allowed': !allQuestionsSubmitted }"
                        @click="confirmSubmit">
                        完成练习
                    </button>
                </div>
            </div>
        </div>

        <div v-else class="bg-white rounded-lg shadow-md p-6 mb-6 text-center py-8">
            <p class="text-gray-500">没有需要重做的题目</p>
            <button class="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg"
                @click="goBackToFeedback">
                返回练习反馈
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCourseStore } from '@/stores/course';
import { getSubmissionDetail, getAssignmentQuestions } from '@/api/assignment';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const courseStore = useCourseStore();
const userStore = useUserStore();

// 提示框状态
const showAlert = ref(false);
const alertMessage = ref('');

// 显示提示信息
const showMessage = (message) => {
    alertMessage.value = message;
    showAlert.value = true;

    // 2秒后自动关闭
    setTimeout(() => {
        showAlert.value = false;
    }, 2000);
};

// 获取练习和提交信息
const exercise = ref({});
const previousSubmission = ref({});
const loading = ref(true);
const questionSubmitted = ref([]);

onMounted(async () => {
    loading.value = true;
    // 从 store 获取练习ID和提交ID
    // 改为使用currentSubmissionId
    const exerciseId = courseStore.currentExerciseId;
    const submissionId = courseStore.currentSubmissionId;
    
    // 验证ID是否存在
    if (!exerciseId || !submissionId) {
        throw new Error('练习信息不完整');
    }
    
    // 获取练习详情和提交详情
    const [questions, submission] = await Promise.all([
        getAssignmentQuestions(exerciseId),
        getSubmissionDetail(submissionId)
    ]);
    
    exercise.value = {
        ...submission.assignment,
        questions
    };
    previousSubmission.value = submission;
    
    // 初始化题目提交状态跟踪数组
    setTimeout(() => {
        questionSubmitted.value = new Array(incorrectQuestionIndices.value.length).fill(false);
    }, 100);
    
    // 启动计时器
    startTime.value = Date.now();
    timerInterval = setInterval(updateTimer, 1000);
    
    // 添加防作弊监听
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    document.addEventListener('copy', detectCopy);
    document.addEventListener('paste', detectPaste);
  
    loading.value = false;
});

// 错题索引计算 - 使用correct字段
const incorrectQuestionIndices = computed(() => {
  if (!previousSubmission.value || !previousSubmission.value.answers) return [];
  
  // 创建一个问题ID到索引的映射表
  const questionIndexMap = {};
  exercise.value.questions?.forEach((question, index) => {
    questionIndexMap[question.id] = index;
  });

  // 筛选出incorrect=false的题目的索引
  return previousSubmission.value.answers
    .filter(answer => answer.correct === false) // 只保留错误的题目
    .map(answer => questionIndexMap[answer.questionId])
    .filter(index => index !== undefined); // 过滤掉未匹配的题目
});

// 错题列表
const incorrectQuestions = computed(() => {
    if (!exercise.value.questions) return [];
    return incorrectQuestionIndices.value.map(index => exercise.value.questions[index]);
});

// 当前题目索引
const currentQuestionIndex = ref(0);

// 当前题目
const currentQuestion = computed(() => {
    if (incorrectQuestions.value.length > 0 && currentQuestionIndex.value >= 0 && currentQuestionIndex.value < incorrectQuestions.value.length) {
        const questionToDisplay = incorrectQuestions.value[currentQuestionIndex.value];
        console.log('Current question to display:', JSON.parse(JSON.stringify(questionToDisplay))); // Log a deep copy
        return questionToDisplay;
    }
    console.log('Current question to display: null (no incorrect questions or index out of bounds)');
    return null;
});

// 新的答案
const newAnswers = ref([]);
const newCodeAnswers = ref([]);

// 检查是否所有题目都已提交
const allQuestionsSubmitted = computed(() => {
    return questionSubmitted.value.every(submitted => submitted === true);
});

// 获取当前题目的正确答案
const getCurrentQuestionCorrectAnswer = computed(() => {
    if (!currentQuestion.value || !previousSubmission.value.answers) return null;
    
    // 根据当前题目ID查找对应答案
    const questionId = currentQuestion.value.id;
    const answerData = previousSubmission.value.answers.find(a => a.questionId === questionId);
    
    return answerData?.correctAnswer || '未提供答案';
});

// 格式化显示答案（针对选择题）
const formatCorrectAnswer = (answer) => {
    if (!answer) return '未提供答案';
    
    if (exercise.value.type === 'choice') {
        // 如果是数字索引转为字母
        if (typeof answer === 'number') {
            return ['A', 'B', 'C', 'D'][answer];
        }
        // 如果已经是字母直接返回
        return answer;
    }
    // 编程题直接返回代码
    return answer;
};

// 选择答案
const selectAnswer = (optionIndex) => {
    newAnswers.value[currentQuestionIndex.value] = optionIndex;
};

// 上一题
const previousQuestion = () => {
    if (currentQuestionIndex.value > 0) {
        currentQuestionIndex.value--;
    }
};

// 下一题
const nextQuestion = () => {
    if (currentQuestionIndex.value < incorrectQuestions.value.length - 1) {
        // 必须先提交当前题目才能进入下一题
        if (!questionSubmitted.value[currentQuestionIndex.value]) {
            showMessage('请先提交当前题目答案');
            return;
        }
        
        currentQuestionIndex.value++;
    }
};

// 提交当前题目答案
const submitCurrentQuestion = () => {
    // 检查当前题目是否已回答
    if (currentQuestion.value.type === 'choice' && newAnswers.value[currentQuestionIndex.value] === null) {
        showMessage('请先选择答案');
        return;
    }
    
    if (currentQuestion.value.type !== 'choice' && !newCodeAnswers.value[currentQuestionIndex.value]?.trim()) {
        showMessage('请先作答');
        return;
    }
    
    // 标记该题已提交，可查看答案
    questionSubmitted.value[currentQuestionIndex.value] = true;
    
    // 显示提交成功消息
    showMessage('答案已提交，可查看正确答案');
};

// 确认提交
const confirmSubmit = () => {
    // 检查是否所有题目都已提交
    if (!allQuestionsSubmitted.value) {
        showMessage('请完成所有题目');
        return;
    }

    if (confirm('确定要完成练习吗？完成后将返回练习反馈页面。')) {
        // 显示提交成功提示
        showMessage('练习完成');

        // 2秒后跳转回反馈页面
        setTimeout(() => {
            goBackToFeedback();
        }, 1000);
    }
};

// 返回反馈页面
const goBackToFeedback = () => {
    router.back();
};

// 确认退出
const confirmExit = () => {
    if (confirm('确定要退出吗？未保存的进度将会丢失。')) {
        goBackToFeedback();
    }
};

// 计时器相关
const startTime = ref(Date.now());
const elapsedTime = ref(0);
let timerInterval;

// 格式化时间（秒 -> HH:MM:SS）
const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    } else {
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
};

// 更新计时器
const updateTimer = () => {
    elapsedTime.value = Math.floor((Date.now() - startTime.value) / 1000);
};

// 防作弊相关
// 检测页面失焦（切换标签页或窗口）
const handleVisibilityChange = () => {
    if (document.hidden) {
        showMessage('检测到您切换了页面！请不要在考试期间浏览其他网页。');
    }
};

// 检测窗口失焦
const handleWindowBlur = () => {
    showMessage('检测到您切换了窗口！请不要在考试期间使用其他应用。');
};

// 检测复制操作
const detectCopy = (event) => {
    event.preventDefault();
    showMessage('检测到复制操作！请不要在考试期间复制内容。');
};

// 检测粘贴操作
const detectPaste = (event) => {
    event.preventDefault();
    showMessage('检测到粘贴操作！请不要在考试期间粘贴内容。');
};

// 检测剪切操作
const detectCut = (event) => {
    event.preventDefault();
    showMessage('检测到剪切操作！请不要在考试期间剪切内容。');
};


// 组件卸载时
onUnmounted(() => {
    // 清除计时器
    clearInterval(timerInterval);
    // 移除事件监听
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    window.removeEventListener('blur', handleWindowBlur);
    document.removeEventListener('contextmenu', (e) => e.preventDefault());
    document.removeEventListener('copy', detectCopy);
    document.removeEventListener('paste', detectPaste);
    document.removeEventListener('cut', detectCut);
    // 清除重做信息
    courseStore.clearRetryInfo();
});
</script>