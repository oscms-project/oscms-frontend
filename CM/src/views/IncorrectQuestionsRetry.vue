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

            <!-- 用户信息 -->
            <div class="relative flex flex-col items-end" @mouseenter="showUserMenu = true"
                @mouseleave="showUserMenu = false">
                <img :src="user.avatar || '/placeholder.svg?height=40&width=40'" alt="用户头像"
                    class="w-10 h-10 rounded-full border-2 border-gray-200" />
                <div class="text-right mt-1">
                    <p class="text-sm font-medium">{{ user.name }}</p>
                    <p class="text-xs text-gray-600">{{ user.username }}</p>
                    <p class="text-xs text-gray-600">{{ user.college }}</p>
                </div>
                <div v-if="showUserMenu"
                    class="absolute right-0 top-10 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                    <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">个人资料</a>
                    <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">设置</a>
                    <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">退出登录</a>
                </div>
            </div>
        </div>

        <!-- 中央提示框 -->
        <div v-if="showAlert" class="fixed inset-0 flex items-center justify-center z-50">
            <div class="bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg">
                {{ alertMessage }}
            </div>
        </div>

        <!-- 错题重做标题 -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <div class="flex justify-between items-center">
                <div>
                    <h1 class="text-2xl font-bold">{{ exercise.title }} - 错题重做</h1>
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
            <div v-if="exercise.type === 'choice'">
                <!-- 选择题 -->
                <div class="mb-6">
                    <div class="flex items-start">
                        <span class="font-medium mr-2">{{ currentQuestionIndex + 1 }}.</span>
                        <div>
                            <div class="font-medium">{{ currentQuestion.text }}</div>
                            <div class="text-sm text-gray-500 mt-1">{{ currentQuestion.points }} 分</div>
                        </div>
                    </div>

                    <div class="ml-6 space-y-2 mt-4">
                        <div v-for="(option, oIndex) in currentQuestion.options" :key="oIndex"
                            class="flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-50"
                            :class="{ 'bg-green-50 border border-green-200': newAnswers[currentQuestionIndex] === oIndex }"
                            @click="selectAnswer(oIndex)">
                            <div class="w-6 h-6 rounded-full flex items-center justify-center border mr-2"
                                :class="{ 'bg-green-500 border-green-500 text-white': newAnswers[currentQuestionIndex] === oIndex, 'border-gray-300': newAnswers[currentQuestionIndex] !== oIndex }">
                                {{ ['A', 'B', 'C', 'D'][oIndex] }}
                            </div>
                            <div>{{ option }}</div>
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
                            <div class="font-medium">{{ currentQuestion.text }}</div>
                            <div class="text-sm text-gray-500 mt-1">{{ currentQuestion.points }} 分</div>
                        </div>
                    </div>

                    <div class="ml-6 mt-4">
                        <div class="mb-2 text-sm text-gray-600">{{ currentQuestion.description }}</div>

                        <!-- 代码编辑器 -->
                        <div class="border rounded-lg overflow-hidden">
                            <div class="bg-gray-100 px-4 py-2 border-b flex justify-between items-center">
                                <span>{{ currentQuestion.language }}</span>
                                <div class="text-sm text-gray-500">请在此编写代码</div>
                            </div>
                            <textarea v-model="newCodeAnswers[currentQuestionIndex]"
                                class="w-full p-4 font-mono text-sm h-64 focus:outline-none" placeholder="在此编写代码..."
                                @copy="detectCopy" @paste="detectPaste" @cut="detectCut"></textarea>
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

            <!-- 导航按钮 -->
            <div class="flex justify-between mt-6">
                <button class="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-6 rounded-lg"
                    :disabled="currentQuestionIndex === 0"
                    :class="{ 'opacity-50 cursor-not-allowed': currentQuestionIndex === 0 }" @click="previousQuestion">
                    上一题
                </button>

                <button v-if="currentQuestionIndex < incorrectQuestions.length - 1"
                    class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-lg"
                    @click="nextQuestion">
                    下一题
                </button>

                <button v-else class="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-lg"
                    @click="confirmSubmit">
                    提交答案
                </button>
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
import { useRouter } from 'vue-router'
const router = useRouter()
// 用户信息 - 使用模拟数据进行预览
const user = ref({
    id: '12345',
    username: 'student001',
    name: '张三',
    role: 'student',
    email: 'student001@example.com',
    college: '计算机科学与技术学院',
    avatar: '/placeholder.svg?height=40&width=40'
});

// 用户菜单显示状态
const showUserMenu = ref(false);

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

// 练习数据 - 使用模拟数据进行预览
const exercise = ref({
    id: 'ex-001',
    title: '数组与链表基础',
    type: 'choice',
    totalPoints: 100,
    questions: [
        {
            id: 'q1',
            text: '以下哪种数据结构支持常数时间的随机访问？',
            options: ['数组', '链表', '栈', '队列'],
            correctAnswer: 0,
            points: 25,
            explanation: '数组支持常数时间O(1)的随机访问，因为可以通过索引直接计算内存地址。链表需要从头遍历，栈和队列只能按特定顺序访问元素。'
        },
        {
            id: 'q2',
            text: '链表的主要优点是什么？',
            options: ['快速的随机访问', '内存分配的灵活性', '缓存友好性', '节省内存空间'],
            correctAnswer: 1,
            points: 25,
            explanation: '链表的主要优点是内存分配的灵活性，它可以动态地分配内存，不需要连续的内存空间。这使得插入和删除操作更加高效。'
        },
        {
            id: 'q3',
            text: '在最坏情况下，在数组中查找元素的时间复杂度是多少？',
            options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
            correctAnswer: 2,
            points: 25,
            explanation: '在未排序的数组中查找元素，最坏情况下需要遍历整个数组，时间复杂度为O(n)。如果数组已排序，可以使用二分查找，时间复杂度为O(log n)。'
        },
        {
            id: 'q4',
            text: '以下哪种操作在链表中比在数组中更高效？',
            options: ['随机访问元素', '在开头插入元素', '在末尾插入元素', '按索引查找元素'],
            correctAnswer: 1,
            points: 25,
            explanation: '在链表开头插入元素的时间复杂度是O(1)，而在数组开头插入元素需要将所有元素向后移动，时间复杂度为O(n)。'
        }
    ]
});

// 如果是编程题，则使用这个模拟数据
if (window.location.search.includes('type=programming')) {
    exercise.value = {
        id: 'ex-002',
        title: '栈与队列实现',
        type: 'programming',
        totalPoints: 100,
        questions: [
            {
                id: 'q1',
                text: '实现一个栈（Stack）数据结构',
                description: '请实现一个栈数据结构，包含push、pop、peek和isEmpty方法。',
                language: 'JavaScript',
                points: 50,
                testResults: [
                    {
                        name: '基本操作测试',
                        input: 'push(1), push(2), peek()',
                        expectedOutput: '2',
                        actualOutput: '2',
                        passed: true
                    },
                    {
                        name: 'pop操作测试',
                        input: 'push(1), push(2), pop(), pop()',
                        expectedOutput: '1',
                        actualOutput: '1',
                        passed: true
                    },
                    {
                        name: '空栈测试',
                        input: 'isEmpty()',
                        expectedOutput: 'true',
                        actualOutput: 'true',
                        passed: true
                    }
                ]
            },
            {
                id: 'q2',
                text: '实现一个队列（Queue）数据结构',
                description: '请实现一个队列数据结构，包含enqueue、dequeue、peek和isEmpty方法。',
                language: 'JavaScript',
                points: 50,
                testResults: [
                    {
                        name: '基本操作测试',
                        input: 'enqueue(1), enqueue(2), peek()',
                        expectedOutput: '1',
                        actualOutput: '1',
                        passed: true
                    },
                    {
                        name: 'dequeue操作测试',
                        input: 'enqueue(1), enqueue(2), dequeue()',
                        expectedOutput: '1',
                        actualOutput: '1',
                        passed: true
                    },
                    {
                        name: '空队列测试',
                        input: 'isEmpty()',
                        expectedOutput: 'true',
                        actualOutput: 'false',
                        passed: false
                    }
                ]
            }
        ]
    };
}

// 上次提交的答案 - 使用模拟数据进行预览
const previousSubmission = ref({
    answers: [0, 0, 3, 1], // 选择题答案，其中第2题和第3题是错的
    codeAnswers: [
        `class Stack {
    constructor() {
      this.items = [];
    }
    
    push(element) {
      this.items.push(element);
    }
    
    pop() {
      if (this.isEmpty()) {
        return "Underflow";
      }
      return this.items.pop();
    }
    
    peek() {
      if (this.isEmpty()) {
        return "No elements in Stack";
      }
      return this.items[this.items.length - 1];
    }
    
    isEmpty() {
      return this.items.length === 0;
    }
  }`,
        `class Queue {
    constructor() {
      this.items = [];
    }
    
    enqueue(element) {
      this.items.push(element);
    }
    
    dequeue() {
      if (this.isEmpty()) {
        return "Underflow";
      }
      return this.items.shift();
    }
    
    peek() {
      if (this.isEmpty()) {
        return "No elements in Queue";
      }
      return this.items[0];
    }
    
    // 这里忘记实现isEmpty方法
  }`
    ] // 编程题答案，其中第2题是错的
});

// 错误题目索引
const incorrectQuestionIndices = computed(() => {
    if (exercise.value.type === 'choice') {
        return exercise.value.questions
            .map((q, index) => (previousSubmission.value.answers[index] !== q.correctAnswer ? index : -1))
            .filter(index => index !== -1);
    } else {
        return exercise.value.questions
            .map((q, index) => {
                if (!q.testResults) return -1;
                return q.testResults.some(test => !test.passed) ? index : -1;
            })
            .filter(index => index !== -1);
    }
});

// 错误题目
const incorrectQuestions = computed(() => {
    return incorrectQuestionIndices.value.map(index => exercise.value.questions[index]);
});

// 当前题目索引
const currentQuestionIndex = ref(0);

// 当前题目
const currentQuestion = computed(() => {
    if (incorrectQuestions.value.length === 0) return null;
    return incorrectQuestions.value[currentQuestionIndex.value];
});

// 新的答案
const newAnswers = ref([]);
const newCodeAnswers = ref([]);

// 初始化新答案数组
if (exercise.value.type === 'choice') {
    newAnswers.value = new Array(incorrectQuestions.value.length).fill(null);
} else {
    newCodeAnswers.value = incorrectQuestionIndices.value.map(index => previousSubmission.value.codeAnswers[index] || '');
}

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
        // 检查当前题目是否已回答
        if (exercise.value.type === 'choice' && newAnswers.value[currentQuestionIndex.value] === null) {
            showMessage('请先回答当前题目');
            return;
        }

        currentQuestionIndex.value++;
    }
};

// 确认提交
const confirmSubmit = () => {
    // 检查是否所有题目都已回答
    if (exercise.value.type === 'choice') {
        const unansweredIndex = newAnswers.value.findIndex(answer => answer === null);
        if (unansweredIndex !== -1) {
            showMessage(`第 ${unansweredIndex + 1} 题还未回答`);
            currentQuestionIndex.value = unansweredIndex;
            return;
        }
    }

    if (confirm('确定要提交吗？提交后将无法修改答案。')) {
        submitAnswers();
    }
};

// 提交答案
const submitAnswers = () => {
    // 在实际应用中，这里应该调用API提交答案
    console.log('提交错题重做答案', exercise.value.type === 'choice' ? newAnswers.value : newCodeAnswers.value);

    // 显示提交成功提示
    showMessage('答案已提交');

    // 2秒后跳转回反馈页面
    setTimeout(() => {
        goBackToFeedback();
    }, 1000);
};

// 返回反馈页面
const goBackToFeedback = () => {
    // 在实际应用中，这里应该跳转回练习反馈页面
    router.push({ name: 'ExerciseFeedback', params: { id: exercise.id } })
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
let timerInterval;
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

// 组件挂载时
onMounted(() => {
    // 启动计时器
    timerInterval = setInterval(updateTimer, 1000);

    // 添加页面可见性变化事件监听
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // 添加窗口失焦事件监听
    window.addEventListener('blur', handleWindowBlur);

    // 禁用右键菜单
    document.addEventListener('contextmenu', (e) => e.preventDefault());

    // 禁用全局复制粘贴
    document.addEventListener('copy', detectCopy);
    document.addEventListener('paste', detectPaste);
    document.addEventListener('cut', detectCut);
});

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
});
</script>