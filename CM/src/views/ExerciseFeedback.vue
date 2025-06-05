<template>
    <div class="min-h-screen bg-gray-50 p-4">
        <!-- 顶部导航栏 -->
        <div class="flex justify-between items-center mb-6">
            <div class="flex items-center">
                <button class="flex items-center text-gray-700 hover:text-gray-900" @click="goBackToList">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="mr-2">
                        <path d="m15 18-6-6 6-6"></path>
                    </svg>
                    <span class="text-lg font-medium">返回练习列表</span>
                </button>
            </div>

            <!-- 用户信息 -->
            <div class="relative flex flex-col items-end">
                <img :src="user.avatar || '/placeholder.svg?height=40&width=40'" alt="用户头像"
                    class="w-10 h-10 rounded-full border-2 border-gray-200" />
                <div class="text-right mt-1">
                    <p class="text-sm font-medium">{{ user.name }}</p>
                    <p class="text-xs text-gray-600">{{ user.username }}</p>
                    <p class="text-xs text-gray-600">{{ user.college }}</p>
                </div>
            </div>
        </div>

        <!-- 中央提示框 -->
        <div v-if="showAlert" class="fixed inset-0 flex items-center justify-center z-50">
            <div class="bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg">
                {{ alertMessage }}
            </div>
        </div>

        <!-- 成绩概览 -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <div class="flex justify-between items-center mb-4">
                <h1 class="text-2xl font-bold">{{ exercise.title }} - 练习反馈</h1>
                <div class="flex items-center">
                    <span class="text-sm text-gray-500 mr-2">完成时间: {{ formatDateTime(submission.submittedAt) }}</span>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div class="text-sm text-green-600 mb-1">总分</div>
                    <div class="flex items-end">
                        <span class="text-3xl font-bold text-green-700">{{ submission.score }}</span>
                        <span class="text-xl text-green-600 ml-1">/ {{ exercise.totalPoints }}</span>
                    </div>
                </div>

                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div class="text-sm text-blue-600 mb-1">正确率</div>
                    <div class="flex items-end">
                        <span class="text-3xl font-bold text-blue-700">{{ correctPercentage }}%</span>
                        <span class="text-sm text-blue-600 ml-2 mb-1">{{ correctCount }} / {{ exercise.questions.length
                            }} 题</span>
                    </div>
                </div>

                <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div class="text-sm text-purple-600 mb-1">用时</div>
                    <div class="text-3xl font-bold text-purple-700">{{ formatDuration(submission.duration) }}</div>
                </div>
            </div>

            <!-- 错题重做按钮 -->
            <div v-if="incorrectQuestions.length > 0" class="flex justify-end mb-2">
                <button class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm flex items-center"
                    @click="retryIncorrectQuestions">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="mr-1">
                        <path d="M21 2v6h-6"></path>
                        <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                        <path d="M3 22v-6h6"></path>
                        <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
                    </svg>
                    错题重做 ({{ incorrectQuestions.length }}题)
                </button>
            </div>
        </div>

        <!-- 题目解析 -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-bold">答案解析</h2>
                <div class="flex space-x-2">
                    <button class="px-3 py-1 rounded-lg text-sm"
                        :class="{ 'bg-gray-200 text-gray-800': filter === 'all', 'text-gray-500 hover:bg-gray-100': filter !== 'all' }"
                        @click="filter = 'all'">
                        全部 ({{ exercise.questions.length }})
                    </button>
                    <button class="px-3 py-1 rounded-lg text-sm"
                        :class="{ 'bg-green-200 text-green-800': filter === 'correct', 'text-gray-500 hover:bg-gray-100': filter !== 'correct' }"
                        @click="filter = 'correct'">
                        正确 ({{ correctCount }})
                    </button>
                    <button class="px-3 py-1 rounded-lg text-sm"
                        :class="{ 'bg-red-200 text-red-800': filter === 'incorrect', 'text-gray-500 hover:bg-gray-100': filter !== 'incorrect' }"
                        @click="filter = 'incorrect'">
                        错误 ({{ incorrectCount }})
                    </button>
                    <button class="px-3 py-1 rounded-lg text-sm"
                        :class="{ 'bg-yellow-200 text-yellow-800': filter === 'bookmarked', 'text-gray-500 hover:bg-gray-100': filter !== 'bookmarked' }"
                        @click="filter = 'bookmarked'">
                        收藏 ({{ bookmarkedCount }})
                    </button>
                </div>
            </div>

            <!-- 选择题解析 -->
            <div v-if="exercise.type === 'choice'">
                <div v-for="(question, qIndex) in filteredQuestions" :key="qIndex" class="mb-8 border rounded-lg p-4"
                    :class="{
                        'border-green-200 bg-green-50': isCorrect(qIndex),
                        'border-red-200 bg-red-50': !isCorrect(qIndex)
                    }">
                    <div class="flex justify-between items-start mb-2">
                        <div class="flex items-start">
                            <span class="font-medium mr-2">{{ qIndex + 1 }}.</span>
                            <div>
                                <div class="font-medium">{{ question.text }}</div>
                                <div class="text-sm text-gray-500 mt-1">{{ question.points }} 分</div>
                            </div>
                        </div>
                        <div class="flex items-center">
                            <button class="text-gray-400 hover:text-yellow-500 focus:outline-none"
                                :class="{ 'text-yellow-500': isBookmarked(qIndex) }" @click="toggleBookmark(qIndex)">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                    fill="isBookmarked(qIndex) ? 'currentColor' : 'none'" stroke="currentColor"
                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div class="ml-6 space-y-2 mt-4">
                        <div v-for="(option, oIndex) in question.options" :key="oIndex"
                            class="flex items-center p-3 rounded-lg" :class="{
                                'bg-green-100 border border-green-300': question.correctAnswer === oIndex,
                                'bg-red-100 border border-red-300': submission.answers[qIndex] === oIndex && question.correctAnswer !== oIndex,
                                'bg-gray-50 border border-gray-200': submission.answers[qIndex] !== oIndex && question.correctAnswer !== oIndex
                            }">
                            <div class="w-6 h-6 rounded-full flex items-center justify-center border mr-2" :class="{
                                'bg-green-500 border-green-500 text-white': question.correctAnswer === oIndex,
                                'bg-red-500 border-red-500 text-white': submission.answers[qIndex] === oIndex && question.correctAnswer !== oIndex,
                                'border-gray-300': submission.answers[qIndex] !== oIndex && question.correctAnswer !== oIndex
                            }">
                                {{ ['A', 'B', 'C', 'D'][oIndex] }}
                            </div>
                            <div>{{ option }}</div>
                        </div>
                    </div>

                    <!-- 解析 -->
                    <div class="mt-4 ml-6 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <div class="text-sm font-medium text-gray-700 mb-1">解析:</div>
                        <div class="text-sm text-gray-600">{{ question.explanation }}</div>
                    </div>
                </div>
            </div>

            <!-- 编程题解析 -->
            <div v-if="exercise.type === 'programming'">
                <div v-for="(question, qIndex) in filteredQuestions" :key="qIndex" class="mb-8 border rounded-lg p-4"
                    :class="{
                        'border-green-200 bg-green-50': isCorrect(qIndex),
                        'border-red-200 bg-red-50': !isCorrect(qIndex)
                    }">
                    <div class="flex justify-between items-start mb-2">
                        <div class="flex items-start">
                            <span class="font-medium mr-2">{{ qIndex + 1 }}.</span>
                            <div>
                                <div class="font-medium">{{ question.text }}</div>
                                <div class="text-sm text-gray-500 mt-1">{{ question.points }} 分</div>
                            </div>
                        </div>
                        <div class="flex items-center">
                            <button class="text-gray-400 hover:text-yellow-500 focus:outline-none"
                                :class="{ 'text-yellow-500': isBookmarked(qIndex) }" @click="toggleBookmark(qIndex)">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                    fill="isBookmarked(qIndex) ? 'currentColor' : 'none'" stroke="currentColor"
                                    stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div class="ml-6 mt-4">
                        <div class="mb-2 text-sm text-gray-600">{{ question.description }}</div>

                        <!-- 学生代码 -->
                        <div class="mb-4">
                            <div class="text-sm font-medium text-gray-700 mb-1">你的代码:</div>
                            <div class="border rounded-lg overflow-hidden">
                                <div class="bg-gray-100 px-4 py-2 border-b flex justify-between items-center">
                                    <span>{{ question.language }}</span>
                                    <div class="text-sm" :class="isCorrect(qIndex) ? 'text-green-600' : 'text-red-600'">
                                        {{ isCorrect(qIndex) ? '通过测试' : '未通过测试' }}
                                    </div>
                                </div>
                                <pre
                                    class="p-4 font-mono text-sm overflow-x-auto bg-gray-50">{{ submission.codeAnswers[qIndex] }}</pre>
                            </div>
                        </div>

                        <!-- 参考答案 -->
                        <div class="mb-4">
                            <div class="text-sm font-medium text-gray-700 mb-1">参考答案:</div>
                            <div class="border rounded-lg overflow-hidden">
                                <div class="bg-gray-100 px-4 py-2 border-b">
                                    <span>{{ question.language }}</span>
                                </div>
                                <pre
                                    class="p-4 font-mono text-sm overflow-x-auto bg-gray-50">{{ question.sampleAnswer }}</pre>
                            </div>
                        </div>
                    </div>

                    <!-- 解析 -->
                    <div class="mt-4 ml-6 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        <div class="text-sm font-medium text-gray-700 mb-1">解析:</div>
                        <div class="text-sm text-gray-600">{{ question.explanation }}</div>
                    </div>

                    <!-- 测试结果 -->
                    <div v-if="question.testResults" class="mt-4 ml-6">
                        <div class="text-sm font-medium text-gray-700 mb-1">测试结果:</div>
                        <div class="border rounded-lg overflow-hidden">
                            <div v-for="(test, tIndex) in question.testResults" :key="tIndex"
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
                                    <div><span class="font-medium">实际输出:</span> {{ test.actualOutput }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="filteredQuestions.length === 0" class="text-center py-8 text-gray-500">
                没有符合条件的题目
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getSubmissionDetail } from '@/api/assignment';

const route = useRoute();
const router = useRouter();

const submissionId = route.params.id;
const submission = ref(null);
const loading = ref(true);
const showAlert = ref(false);
const alertMessage = ref('');
const bookmarkedQuestions = ref([]);
const filter = ref('all');

const showMessage = (message) => {
    alertMessage.value = message;
    showAlert.value = true;
    setTimeout(() => {
        showAlert.value = false;
    }, 2000);
};

// 用户信息（可根据实际项目从 userStore 获取，这里保留原有结构）
const user = ref({
    id: '',
    username: '',
    name: '',
    role: '',
    email: '',
    college: '',
    avatar: ''
});

const exercise = computed(() => submission.value?.assignment || { questions: [] });

onMounted(async () => {
    try {
        loading.value = true;
        const detail = await getSubmissionDetail(submissionId);
        submission.value = detail;
        // 可选：填充 user 信息
        if (detail.student) {
            user.value = {
                id: detail.student.id,
                username: detail.student.username,
                name: detail.student.name,
                role: detail.student.role,
                email: detail.student.email,
                college: detail.student.college,
                avatar: detail.student.avatar
            };
        }
    } catch (e) {
        showMessage(e.message || '加载失败');
    } finally {
        loading.value = false;
    }
});

const correctCount = computed(() => {
    if (!submission.value || !submission.value.answers) return 0;
    return submission.value.answers.filter(ans => ans.correct === true).length;
});
const incorrectCount = computed(() => {
    if (!submission.value || !submission.value.answers) return 0;
    return submission.value.answers.filter(ans => ans.correct === false).length;
});
const correctPercentage = computed(() => {
    if (!submission.value || !submission.value.answers) return 0;
    return Math.round((correctCount.value / submission.value.answers.length) * 100);
});
const bookmarkedCount = computed(() => bookmarkedQuestions.value.length);
const incorrectQuestions = computed(() => {
    if (!submission.value || !submission.value.answers) return [];
    return exercise.value.questions.filter((q, idx) => submission.value.answers[idx]?.correct === false);
});
const filteredQuestions = computed(() => {
    if (!submission.value || !submission.value.answers) return [];
    if (filter.value === 'all') {
        return exercise.value.questions;
    } else if (filter.value === 'correct') {
        return exercise.value.questions.filter((q, idx) => submission.value.answers[idx]?.correct === true);
    } else if (filter.value === 'incorrect') {
        return exercise.value.questions.filter((q, idx) => submission.value.answers[idx]?.correct === false);
    } else if (filter.value === 'bookmarked') {
        return exercise.value.questions.filter((q, idx) => bookmarkedQuestions.value.includes(idx));
    }
    return [];
});
const isCorrect = (questionIndex) => {
    if (!submission.value || !submission.value.answers) return false;
    return submission.value.answers[questionIndex]?.correct === true;
};
const isBookmarked = (questionIndex) => bookmarkedQuestions.value.includes(questionIndex);
const toggleBookmark = (questionIndex) => {
    const index = bookmarkedQuestions.value.indexOf(questionIndex);
    if (index === -1) {
        bookmarkedQuestions.value.push(questionIndex);
        showMessage('已收藏题目');
    } else {
        bookmarkedQuestions.value.splice(index, 1);
        showMessage('已取消收藏');
    }
};
const retryIncorrectQuestions = () => {
    showMessage('开始错题重做');
    router.push({ name: 'IncorrectQuestionsRetry', params: { id: exercise.value.id } });
};
const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return '';
    const date = new Date(dateTimeStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};
const formatDuration = (seconds) => {
    if (!seconds) return '0秒';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
        return `${hours}小时 ${minutes}分钟`;
    } else if (minutes > 0) {
        return `${minutes}分钟 ${secs}秒`;
    } else {
        return `${secs}秒`;
    }
};
const goBackToList = () => {
    router.push({ name: 'ExerciseList' });
};
</script>