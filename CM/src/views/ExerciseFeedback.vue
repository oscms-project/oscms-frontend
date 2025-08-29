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
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div class="text-sm text-green-600 mb-1">总分</div>
                    <div class="flex items-end">
                        <span class="text-3xl font-bold text-green-700">{{ submission?.totalScore || 0 }}</span>
                        <span class="text-xl text-green-600 ml-1">/ {{ exercise?.totalPoints || 0 }}</span>
                    </div>
                </div>

                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div class="text-sm text-blue-600 mb-1">正确率</div>
                    <div class="flex items-end">
                        <span class="text-3xl font-bold text-blue-700">{{ correctPercentage }}%</span>
                        <span class="text-sm text-blue-600 ml-2 mb-1">{{ correctCount }} / {{ exercise?.questions?.length || 0
                            }} 题</span>
                    </div>
                </div>

                <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div class="text-sm text-purple-600 mb-1">提交时间</div>
                    <div class="text-xl font-bold text-purple-700">{{ formatDateTime(submission?.submittedAt) }}</div>
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
                        全部 ({{ exercise?.questions?.length || 0 }})
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
                </div>
            </div>

            <!-- 题目列表 -->
            <div v-for="(question, qIndex) in filteredQuestions" :key="qIndex" class="mb-8 border rounded-lg p-4"
                :class="{
                    'border-green-200 bg-green-50': question.correct,
                    'border-red-200 bg-red-50': !question.correct
                }">
                <div class="flex justify-between items-start mb-2">
                    <div class="flex items-start">
                        <span class="font-medium mr-2">{{ qIndex + 1 }}.</span>
                        <div>
                            <div class="font-medium">{{ question.title }}</div>
                            <div class="text-sm text-gray-500 mt-1">{{ question.score }} 分</div>
                        </div>
                    </div>
                    <div class="flex items-center">
            <!-- 收藏按钮 -->
            <button 
                class="flex items-center px-3 py-1 rounded-lg text-sm mr-3"
                :class="isBookmarked(question.id) ? 'bg-yellow-500 text-white' : 'bg-blue-500 text-white'"
                @click="handleFavorite(question)"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="mr-1" :class="{'fill-current': isBookmarked(question.id)}">
                    <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
                {{ isBookmarked(question.id) ? '已收藏' : '收藏' }}
            </button>
                    <div class="text-sm" :class="question.correct ? 'text-green-600' : 'text-red-600'">
                        得分：{{ question.score }} 分
                    </div>
                </div>
            </div>

            <!-- 选择题 -->
            <div v-if="question.type === 'choice'" class="ml-6 mt-4">
                <div v-for="(choice, cIndex) in question.choices" :key="cIndex"
                    class="flex items-center p-3 rounded-lg mb-2"
                    :class="{
                        'bg-green-100 border border-green-300': choice === question.correctAnswer,
                        'bg-red-100 border border-red-300': choice === question.studentAnswer && choice !== question.correctAnswer,
                        'bg-gray-50 border border-gray-200': choice !== question.studentAnswer && choice !== question.correctAnswer
                    }">
                        <div class="w-6 h-6 rounded-full flex items-center justify-center border mr-2"
                            :class="{
                                'bg-green-500 border-green-500 text-white': choice === question.correctAnswer,
                                'bg-red-500 border-red-500 text-white': choice === question.studentAnswer && choice !== question.correctAnswer,
                                'border-gray-300': choice !== question.studentAnswer && choice !== question.correctAnswer
                            }">
                            {{ String.fromCharCode(65 + cIndex) }}
                        </div>
                        <div>{{ choice }}</div>
                    </div>
                </div>

                <!-- 简答题 -->
                <div v-if="question.type === 'short_answer'" class="ml-6 mt-4">
                    <div class="mb-4">
                        <div class="text-sm font-medium text-gray-700 mb-2">你的答案:</div>
                        <div class="p-4 bg-gray-50 border rounded-lg">{{ question.studentAnswer || '未作答' }}</div>
                    </div>
                    <div class="mb-4">
                        <div class="text-sm font-medium text-gray-700 mb-2">参考答案:</div>
                        <div class="p-4 bg-gray-50 border rounded-lg">{{ question.correctAnswer }}</div>
                    </div>
                </div>

                <!-- 解析 -->
                <div class="mt-4 ml-6 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div class="text-sm font-medium text-gray-700 mb-1">解析:</div>
                    <div class="text-sm text-gray-600">{{ question.explanation }}</div>
                    <div v-if="question.feedback" class="mt-2 text-sm text-gray-600">
                        <div class="font-medium mb-1">教师反馈:</div>
                        {{ question.feedback }}
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
import { getSubmissionDetail, getAssignmentQuestions } from '@/api/assignment';
import { useCourseStore } from '@/stores/course';
import { useUserStore } from '@/stores/user';
import { addFavoriteExercise } from '@/api/user';

const route = useRoute();
const router = useRouter();
const courseStore = useCourseStore();
const userStore = useUserStore();

// 检查用户是否已登录
if (!userStore.token) {
    router.push({ name: 'Login' });
}

const submissionId = courseStore.currentSubmissionId;
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

// 在组件方法中使用
const favoriteQuestion = async (questionId) => {
  try {
    const studentId = userStore.userId; // 从用户store获取当前登录的学生ID
    await addFavoriteExercise(questionId, studentId);

    // 收藏成功处理
    showAlert.value = true;
    alertMessage.value = "题目已成功收藏";
    setTimeout(() => { showAlert.value = false; }, 2000);
    
  } catch (error) {
    console.error('收藏题目失败:', error);
    showAlert.value = true;
    alertMessage.value = error.message || "收藏失败，请稍后再试";
    setTimeout(() => { showAlert.value = false; }, 2000);
  }
};

const exercise = computed( () => submission.value?.assignment || { questions: [] });
onMounted(async () => {
    try {
        const submissionId = courseStore.currentSubmissionId;
        console.log('当前提交ID:', submissionId);
        
        if (!submissionId) {
            throw new Error('提交ID不存在');
        }

        loading.value = true;
        const assignmentId = courseStore.currentExerciseId;
        console.log('当前练习ID:', assignmentId);
        
        if (!assignmentId) {
            throw new Error('练习ID不存在');
        }

        const [questions, detail] = await Promise.all([
            getAssignmentQuestions(assignmentId),
            getSubmissionDetail(submissionId)
        ]);

        console.log('获取到的提交详情:', detail);
        console.log('获取到的题目:', questions);
        
        // 设置提交信息
        submission.value = {
            ...detail,
            assignment: {
                id: assignmentId,
                questions: questions.map((q, index) => ({
                    ...q,
                    id: q.id || `q-${index}`, // 确保每个题目有id
                    studentAnswer: detail.answers[index]?.response || '',
                    score: detail.answers[index]?.score || 0,
                    correct: detail.answers[index]?.correct || false,
                    feedback: detail.answers[index]?.feedback || ''
                })),
                title: '在线练习',
                totalPoints: questions?.reduce((total, q) => total + (q.score || 0), 0) || 0
            }
        };

        console.log('处理后的数据:', submission.value);

        // 可选：填充 user 信息
        if (userStore.userId) {
            user.value = {
                id: userStore.userId,
                username: userStore.username,
                name: userStore.name,
                role: userStore.role,
                email: userStore.email,
                college: userStore.college,
                avatar: userStore.avatar
            };
        }
    } catch (e) {
        console.error('加载失败:', e);
        showMessage(e.message || '加载失败');
        router.push({ name: 'StudentCourses' });
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
    return exercise.value.questions.filter((q, idx) => !submission.value.answers[idx]?.correct);
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


const isBookmarked = (questionId) => {
  return bookmarkedQuestions.value.includes(questionId);
};

const handleFavorite = async (question) => {
  try {
    if (!question.id) {
      showMessage("题目ID不存在");
      return;
    }
    
    const isAlreadyBookmarked = isBookmarked(question.id);
    
    if (isAlreadyBookmarked) {
      // 如果已收藏，显示提示信息
      showMessage("该题目已收藏");
      return;
    }
    
    // 调用收藏API
    await favoriteQuestion(question.id);
    
    // 更新本地收藏状态
    if (!bookmarkedQuestions.value.includes(question.id)) {
      bookmarkedQuestions.value.push(question.id);
    }
    
  } catch (error) {
    console.error('收藏题目失败:', error);
    showMessage(error.message || "收藏失败，请稍后再试");
  }
};
const retryIncorrectQuestions = () => {
    if (!exercise.value?.id) {
        showMessage('练习信息不完整');
        return;
    }
    showMessage('开始错题重做');
    courseStore.setRetryInfo(exercise.value.id, submissionId);
    router.push({ name: 'IncorrectQuestionsRetry' });
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
    router.push({ name: 'StudentCourses' });
};

const startExercise = (practice) => {
    courseStore.setCurrentExerciseId(practice.id);
    router.push('/exercise/:id');
};
</script>