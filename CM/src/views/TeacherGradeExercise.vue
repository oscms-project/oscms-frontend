<template>
    <div class="min-h-screen bg-gray-50 p-4">
        <!-- 顶部导航栏 -->
        <div class="flex justify-between items-center mb-6">
            <div class="flex items-center">
                <button class="flex items-center text-gray-700 hover:text-gray-900" @click="goBackToExerciseList">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="mr-2">
                        <path d="m15 18-6-6 6-6"></path>
                    </svg>
                    <span class="text-lg font-medium">返回练习列表</span>
                </button>
            </div>

            <!-- 用户信息 -->
            <div class="relative flex flex-col items-end" @mouseenter="showUserMenu = true"
                @mouseleave="showUserMenu = false">
                <img :src="user.avatar || '/placeholder.svg?height=40&width=40'" alt="用户头像"
                    class="w-10 h-10 rounded-full border-2 border-gray-200" />
                <div class="text-right mt-1">
                    <p class="text-xs text-gray-600">{{ user.username }}</p>
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

        <!-- 统计信息卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div class="bg-white rounded-lg shadow p-4">
                <div class="text-gray-500 text-sm mb-1">总提交人数</div>
                <div class="text-2xl font-bold text-gray-900">{{ submissionStats.total }}</div>
            </div>
            <div class="bg-white rounded-lg shadow p-4">
                <div class="text-gray-500 text-sm mb-1">已批改</div>
                <div class="text-2xl font-bold text-green-600">{{ submissionStats.graded }}</div>
            </div>
            <div class="bg-white rounded-lg shadow p-4">
                <div class="text-gray-500 text-sm mb-1">待批改</div>
                <div class="text-2xl font-bold text-orange-500">{{ submissionStats.pending }}</div>
            </div>
            <div class="bg-white rounded-lg shadow p-4">
                <div class="text-gray-500 text-sm mb-1">平均分</div>
                <div class="text-2xl font-bold text-blue-600">{{ submissionStats.avgScore.toFixed(1) }}</div>
            </div>
        </div>

        <!-- 练习信息 -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <div class="flex justify-between items-center mb-4">
                <h1 class="text-2xl font-bold">{{ exercise.title }}</h1>
                <div class="flex space-x-3">
                    <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                        @click="saveGrades">
                        保存评分
                    </button>
                </div>
            </div>
        </div>

        <!-- 主体内容 -->
        <div class="flex flex-col md:flex-row gap-6">
            <!-- 左侧学生列表 -->
            <div class="w-full md:w-1/3 bg-white rounded-lg shadow-md p-6">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-lg font-bold">学生提交列表</h2>
                    <div class="relative">
                        <input v-model="searchQuery" type="text" placeholder="搜索学生..."
                            class="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="absolute right-2 top-1.5 text-gray-400">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </div>
                </div>

                <div class="flex mb-4 space-x-2">
                    <button class="px-3 py-1 text-sm rounded-md"
                        :class="filter === 'all' ? 'bg-gray-200 text-gray-800' : 'bg-white text-gray-600 hover:bg-gray-100'"
                        @click="filter = 'all'">
                        全部
                    </button>
                </div>

                <div class="overflow-y-auto max-h-[500px] pr-2">
                    <div v-if="filteredSubmissions.length === 0" class="text-center py-8 text-gray-500">
                        没有符合条件的提交
                    </div>

                    <div v-for="submission in filteredSubmissions" :key="submission.id"
                        class="border rounded-lg p-3 mb-3 cursor-pointer transition-all hover:shadow-md" :class="{
                            'border-green-200 bg-green-50': submission.status === 'graded',
                            'border-orange-200 bg-orange-50': submission.status === 'pending',
                            'border-blue-300 shadow-md': selectedSubmission && selectedSubmission.id === submission.id
                        }" @click="selectSubmissionHandler(submission)">
                        <div class="flex justify-between items-center">
                            <div class="flex items-center">
                                <div>
                                    <div class="font-medium">学号：{{ submission.studentId }}</div>
                                    <div class="text-xs text-gray-500">{{ formatDateTime(submission.submittedAt) }}</div>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="font-medium" :class="{
                                    'text-green-600': submission.status === 'graded',
                                    'text-orange-600': submission.status === 'pending'
                                }">
                                    {{ submission.status === 'graded' ? `${submission.manualScore+submission.autoScore || 0}` : '待批改' }}
                                </div>
                                <div class="text-xs text-gray-500">
                                    {{ submission.status === 'graded' ? '已批改' : '未批改' }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 右侧批改区域 -->
            <div class="w-full md:w-2/3 bg-white rounded-lg shadow-md p-6">
                <div v-if="!selectedSubmission" class="flex flex-col items-center justify-center h-full py-12 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"
                        class="mb-4 text-gray-300">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                        <polyline points="14 2 14 8 20 8"></polyline>
                        <line x1="16" y1="13" x2="8" y2="13"></line>
                        <line x1="16" y1="17" x2="8" y2="17"></line>
                        <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    <p class="text-lg">请从左侧选择一个学生提交进行批改</p>
                </div>

                <div v-else>
                    <div class="flex justify-between items-center mb-6">
                        <div>
                            <h2 class="text-xl font-bold">批改作业</h2>
                            <p class="text-gray-500">学号：{{ selectedSubmission.studentId }}</p>
                            <p class="text-gray-500">提交时间：{{ formatDateTime(selectedSubmission.submittedAt) }}</p>
                        </div>
                        <div class="text-right">
                            <div class="text-lg font-bold">
                                总分：{{ (selectedSubmission.manualScore || 0) + (selectedSubmission.autoScore || 0) }}
                            </div>
                            <div class="text-sm text-gray-500">
                                自动评分：{{ selectedSubmission.autoScore || 0 }}
                                <span class="mx-1">|</span>
                                人工评分：{{ selectedSubmission.manualScore || 0 }}
                            </div>
                        </div>
                    </div>

                    <!-- 主观题和编程题批改区域 -->
                    <div v-if="subjectiveQuestions.length > 0" class="space-y-6">
                        <div v-for="(question, index) in subjectiveQuestions" :key="question.id" 
                            class="border rounded-lg p-4">
                            <div class="flex justify-between items-start mb-4">
                                <div>
                                    <h3 class="text-lg font-medium">
                                        第{{ index + 1 }}题 ({{ question.type === 'coding' ? '编程题' : '主观题' }})
                                    </h3>
                                    <p class="text-gray-600 mt-1">{{ question.title }}</p>
                                </div>
                                <div class="flex items-center">
                                    <input type="number" 
                                        v-model.number="selectedSubmission.questionScores[index]"
                                        class="w-16 px-2 py-1 border rounded-md text-center"
                                        :max="question.score"
                                        min="0"
                                    /> 
                                    <span class="ml-2">/ {{ question.score }}分</span>
                                </div>
                            </div>

                            <!-- 学生答案 -->
                            <div class="mb-4">
                                <h4 class="text-sm font-medium text-gray-700 mb-2">学生答案：</h4>
                                <div class="bg-gray-50 rounded-lg p-3 font-mono text-sm">
                                    {{ selectedSubmission.answers[index]?.response || '未作答' }}
                                </div>
                            </div>

                            <!-- 参考答案 -->
                            <div class="mb-4">
                                <h4 class="text-sm font-medium text-gray-700 mb-2">参考答案：</h4>
                                <div class="bg-gray-50 rounded-lg p-3 font-mono text-sm">
                                    {{ question.correctAnswer }}
                                </div>
                            </div>

                            <!-- 评语 -->
                            <div>
                                <h4 class="text-sm font-medium text-gray-700 mb-2">评语：</h4>
                                <textarea
                                    v-model="selectedSubmission.feedback[index]"
                                    rows="3"
                                    class="w-full px-3 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="请输入评语..."
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    <div v-else class="text-center py-8 text-gray-500">
                        该作业没有需要手动批改的题目
                    </div>

                    <!-- 总体评语和操作按钮 -->
                    <div class="mt-6 border-t pt-6">
                        <h4 class="text-lg font-medium mb-3">总体评语</h4>
                        <textarea
                            v-model="selectedSubmission.overallFeedback"
                            rows="4"
                            class="w-full px-3 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="请输入总体评语..."
                        ></textarea>

                        <div class="flex justify-end mt-4 space-x-3">
                            <button class="px-4 py-2 border rounded-lg hover:bg-gray-50"
                                @click="closeGrading">
                                取消
                            </button>
                            <button class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                @click="saveCurrentGrade">
                                提交批改
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 反馈报告模态框 -->
        <div v-if="showFeedbackReport"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-xl font-bold">练习反馈报告</h2>
                        <button class="text-gray-400 hover:text-gray-600 focus:outline-none"
                            @click="showFeedbackReport = false">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    <div class="mb-6">
                        <h3 class="text-lg font-bold mb-2">{{ exercise.title }}</h3>
                        <div class="text-sm text-gray-500 mb-4">
                            <span>总分: {{ exercise.totalPoints }} 分</span>
                            <span class="mx-2">|</span>
                            <span>{{ exercise.type === 'choice' ? '选择题' : exercise.type === 'programming' ? '编程题' : exercise.type === 'short_answer' ? '简答题' :
                                '混合题型' }}</span>
                            <span class="mx-2">|</span>
                            <span>提交人数: {{ submissions.length }}</span>
                        </div>
                    </div>

                    <!-- 成绩分布 -->
                    <div class="mb-6">
                        <h3 class="text-md font-bold mb-3">成绩分布</h3>
                        <div class="h-8 bg-gray-200 rounded-full overflow-hidden">
                            <div class="flex h-full">
                                <div class="bg-red-500 h-full"
                                    :style="`width: ${feedbackReport.scoreDistribution.fail}%`"></div>
                                <div class="bg-yellow-500 h-full"
                                    :style="`width: ${feedbackReport.scoreDistribution.pass}%`"></div>
                                <div class="bg-blue-500 h-full"
                                    :style="`width: ${feedbackReport.scoreDistribution.good}%`"></div>
                                <div class="bg-green-500 h-full"
                                    :style="`width: ${feedbackReport.scoreDistribution.excellent}%`"></div>
                            </div>
                        </div>
                        <div class="flex justify-between text-xs text-gray-600 mt-1">
                            <div>0</div>
                            <div>{{ exercise.totalPoints * 0.6 }}</div>
                            <div>{{ exercise.totalPoints * 0.75 }}</div>
                            <div>{{ exercise.totalPoints * 0.9 }}</div>
                            <div>{{ exercise.totalPoints }}</div>
                        </div>
                        <div class="flex justify-between mt-2">
                            <div class="flex items-center">
                                <div class="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                                <span class="text-sm">不及格 ({{ feedbackReport.scoreDistribution.fail }}%)</span>
                            </div>
                            <div class="flex items-center">
                                <div class="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
                                <span class="text-sm">及格 ({{ feedbackReport.scoreDistribution.pass }}%)</span>
                            </div>
                            <div class="flex items-center">
                                <div class="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                                <span class="text-sm">良好 ({{ feedbackReport.scoreDistribution.good }}%)</span>
                            </div>
                            <div class="flex items-center">
                                <div class="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                                <span class="text-sm">优秀 ({{ feedbackReport.scoreDistribution.excellent }}%)</span>
                            </div>
                        </div>
                    </div>

                    <!-- 题目分析 -->
                    <div class="mb-6">
                        <h3 class="text-md font-bold mb-3">题目分析</h3>
                        <div class="overflow-x-auto">
                            <table class="min-w-full border-collapse">
                                <thead>
                                    <tr class="bg-gray-100">
                                        <th class="border px-4 py-2 text-left">题号</th>
                                        <th class="border px-4 py-2 text-left">题型</th>
                                        <th class="border px-4 py-2 text-left">满分</th>
                                        <th class="border px-4 py-2 text-left">平均得分</th>
                                        <th class="border px-4 py-2 text-left">正确率</th>
                                        <th class="border px-4 py-2 text-left">难度系数</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(question, index) in feedbackReport.questionAnalysis" :key="index"
                                        class="hover:bg-gray-50">
                                        <td class="border px-4 py-2">{{ index + 1 }}</td>
                                        <td class="border px-4 py-2">{{ question.type === 'choice' ? '选择题' : question.type === 'programming' ? '编程题' : question.type === 'short_answer' ? '简答题' : '其他' }}
                                        </td>
                                        <td class="border px-4 py-2">{{ question.points }}</td>
                                        <td class="border px-4 py-2">{{ question.avgScore.toFixed(1) }}</td>
                                        <td class="border px-4 py-2">{{ (question.correctRate * 100).toFixed(1) }}%</td>
                                        <td class="border px-4 py-2">
                                            <div class="flex items-center">
                                                <div class="w-24 bg-gray-200 rounded-full h-2.5 mr-2">
                                                    <div class="h-2.5 rounded-full"
                                                        :style="`width: ${question.difficulty * 100}%`" :class="{
                                                            'bg-green-500': question.difficulty < 0.3,
                                                            'bg-blue-500': question.difficulty >= 0.3 && question.difficulty < 0.6,
                                                            'bg-yellow-500': question.difficulty >= 0.6 && question.difficulty < 0.8,
                                                            'bg-red-500': question.difficulty >= 0.8
                                                        }"></div>
                                                </div>
                                                <span class="text-xs">{{
                                                    question.difficulty < 0.3 ? '简单' : question.difficulty < 0.6 ? '中等'
                                                        : question.difficulty < 0.8 ? '较难' : '困难' }}</span>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <!-- 常见错误 -->
                    <div class="mb-6">
                        <h3 class="text-md font-bold mb-3">常见错误分析</h3>
                        <div class="space-y-4">
                            <div v-for="(error, index) in feedbackReport.commonErrors" :key="index"
                                class="border rounded-lg p-4">
                                <div class="font-medium mb-2">题目 {{ error.questionIndex + 1 }}: {{
                                    exercise.questions[error.questionIndex].text }}</div>
                                <div class="text-sm text-gray-600 mb-2">{{ error.description }}</div>
                                <div class="text-sm bg-red-50 border border-red-200 rounded-lg p-3">
                                    <div class="font-medium text-red-800 mb-1">常见错误:</div>
                                    <div>{{ error.errorDetail }}</div>
                                </div>
                                <div class="text-sm bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
                                    <div class="font-medium text-green-800 mb-1">改进建议:</div>
                                    <div>{{ error.suggestion }}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="flex justify-end mt-6">
                        <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                            @click="exportFeedbackReport">
                            导出报告
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getAssignmentSubmissions, getSubmissionDetail, gradeSubmission, getAssignmentQuestions } from '@/api/assignment';
import { useCourseStore } from '@/stores/course';
import { useUserStore } from '@/stores/user';
import axios from 'axios';

const router = useRouter();
const route = useRoute();
const courseStore = useCourseStore();
const userStore = useUserStore();

const loading = ref(false);

// 用户信息
const user = ref({
    id: userStore.userId,
    username: userStore.username,
    role: userStore.role,
    avatar: userStore.avatar || '/placeholder.svg?height=40&width=40'
});

const showUserMenu = ref(false);
const showAlert = ref(false);
const alertMessage = ref('');
const showMessage = (message) => {
    alertMessage.value = message;
    showAlert.value = true;
    setTimeout(() => { showAlert.value = false; }, 2000);
};

// 练习数据
const exercise = computed(() => ({
    id: courseStore.currentAssignmentId,
    title: courseStore.currentAssignmentTitle,
    type: courseStore.currentAssignmentType,
    totalPoints: courseStore.currentAssignmentTotalPoints,
    openTime: courseStore.currentAssignmentOpenTime,
    closeTime: courseStore.currentAssignmentCloseTime,
    questions: courseStore.currentAssignmentQuestions || []
}));

// 提交统计
const submissionStats = reactive({
    total: 0,
    graded: 0,
    pending: 0,
    avgScore: 0
});

// 学生提交列表
const submissions = ref([]);
const selectedSubmission = ref(null);
const searchQuery = ref('');
const filter = ref('all');

// 添加作业题目相关状态
const questions = ref([]);
const loadingQuestions = ref(false);

// 加载作业题目
const loadQuestions = async () => {
    if (!assignmentId.value) return;
    
    loadingQuestions.value = true;
    try {
        const response = await getAssignmentQuestions(assignmentId.value);
        questions.value = response;
        console.log('Loaded questions:', questions.value);
    } catch (error) {
        console.error('Failed to load questions:', error);
        showMessage('加载题目失败');
    } finally {
        loadingQuestions.value = false;
    }
};

// 计算属性：过滤主观题和编程题
const subjectiveQuestions = computed(() => {
    return questions.value.filter(q => q.type === 'short_answer' || q.type === 'coding');
});

// 过滤后的提交列表
const filteredSubmissions = computed(() => {
    return submissions.value.filter(submission => {
        if (filter.value === 'graded' && submission.status !== 'graded') return false;
        if (filter.value === 'pending' && submission.status !== 'pending') return false;
        if (searchQuery.value) {
            const query = searchQuery.value.toLowerCase();
            return (submission.studentId?.toLowerCase().includes(query));
        }
        return true;
    });
});

// 获取题目编号
const getQuestionNumber = (question) => {
    return exercise.value.questions.findIndex(q => q.id === question.id) + 1;
};

const getQuestionIndex = (question) => {
    return exercise.value.questions.findIndex(q => q.id === question.id);
};

// 从store中获取批改相关信息
const assignmentId = computed(() => courseStore.currentAssignmentId || route.params.id);
const classId = computed(() => courseStore.currentClassId);

// 生命周期钩子
onMounted(async () => {
    console.log('组件挂载，当前参数:', {
        assignmentId: assignmentId.value,
        classId: classId.value,
        isGradingMode: courseStore.isGradingMode
    });

    try {
        await Promise.all([
            loadSubmissions(),
            loadQuestions()
        ]);
    } catch (error) {
        console.error('初始化失败:', error);
        showMessage('加载数据失败，请重试');
    }
});

// 检查必要参数是否存在
const checkRequiredParams = () => {
    if (!assignmentId.value) {
        throw new Error('作业ID不能为空');
    }
    if (!classId.value) {
        throw new Error('班级ID不能为空');
    }
};

// 定义提交记录的类型接口
const submissionState = reactive({
    list: [],
    loading: false,
    error: null,
    stats: {
        total: 0,
        submitted: 0,
        graded: 0,
        avgScore: 0
    }
});

// 格式化日期
const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// 加载提交列表
const loadSubmissions = async () => {
    submissionState.loading = true;
    submissionState.error = null;
    
    try {
        // 检查必要参数
        if (!classId.value) {
            throw new Error('班级ID不能为空');
        }
        if (!assignmentId.value) {
            throw new Error('作业ID不能为空');
        }

        console.log('开始获取提交列表，参数:', {
            classId: classId.value,
            assignmentId: assignmentId.value
        });
        
        const response = await axios.get(`/classes/${classId.value}/assignments/${assignmentId.value}/submissions`);
        console.log('获取到提交列表响应:', response.data);
        
        // 检查response是否是数组
        if (Array.isArray(response.data.data)) {
            // 处理每个提交记录
            submissionState.list = response.data.data.map(submission => {
                console.log('处理提交记录:', submission);
                return {
                    ...submission,
                    // 格式化日期
                    submittedAt: formatDateTime(submission.submittedAt),
                    // 添加UI状态
                    isExpanded: false,
                    isGrading: false,
                    // 确保answers数组存在
                    answers: submission.answers || [],
                    // 确保分数为数字
                    autoScore: Number(submission.autoScore) || 0,
                    manualScore: Number(submission.manualScore) || 0,
                    totalScore: Number(submission.totalScore) || 0
                };
            });

            // 更新统计信息
            updateSubmissionStats();
            
            // 更新submissions引用（用于UI显示）
            submissions.value = submissionState.list;
        } else {
            console.error('获取提交列表失败：响应不是数组', response.data);
            throw new Error('获取提交列表失败：响应格式错误');
        }
    } catch (err) {
        console.error('加载提交列表失败:', err);
        submissionState.error = err.message || '加载提交列表失败，请重试';
        // 如果是参数错误，返回到课程管理页面
        if (err.message.includes('ID不能为空')) {
            alert(err.message);
            router.push('/course-management');
        }
    } finally {
        submissionState.loading = false;
        console.log('提交列表加载完成，当前状态:', {
            loading: submissionState.loading,
            error: submissionState.error,
            listLength: submissionState.list.length,
            stats: submissionStats
        });
    }
};

// 更新提交统计信息
const updateSubmissionStats = () => {
    const submissions = submissionState.list;
    submissionStats.total = submissions.length;
    submissionStats.graded = submissions.filter(s => s.status === 'graded').length;
    submissionStats.pending = submissions.filter(s => s.status === 'graded_auto').length;
    // 计算平均分
    const gradedSubmissions = submissions.filter(s => s.totalScore != null);
    submissionStats.avgScore = gradedSubmissions.length
        ? gradedSubmissions.reduce((sum, s) => sum + s.totalScore, 0) / gradedSubmissions.length
        : 0;

    console.log('更新后的统计信息:', submissionStats);
};

// 获取提交状态的显示文本和样式
const getSubmissionStatus = (status) => {
    const statusMap = {
        submitted: {
            text: '待批改',
            class: 'status-pending'
        },
        graded: {
            text: '已批改',
            class: 'status-graded'
        }
    };
    return statusMap[status] || { text: status, class: '' };
};

// 导出更多的变量和方法供模板使用
defineExpose({
    submissionState,
    getSubmissionStatus,
    loadSubmissions,
    formatDate
});

// 选中提交，拉取详情
const selectSubmissionHandler = async (submission) => {
    try {
        const detailResponse = await axios.get(`/submissions/${submission.submissionId || submission.id}`);
        const detailData = detailResponse.data.data; // API返回的原始提交详情
        console.log('获取到提交详情:', detailData);
        const numSubjectiveQuestions = subjectiveQuestions.value.length;
        const newQuestionScores = new Array(numSubjectiveQuestions).fill(0);
        const newFeedback = new Array(numSubjectiveQuestions).fill('');
        const studentAnswersForDisplay = new Array(numSubjectiveQuestions);

        subjectiveQuestions.value.forEach((sq, index) => {
            const studentAnswer = (detailData.answers || []).find(ans => ans.questionId === sq.id);

            if (studentAnswer && (studentAnswer.questionType === 'short_answer' || studentAnswer.questionType === 'coding')) {
                newQuestionScores[index] = studentAnswer.score || 0;
                newFeedback[index] = studentAnswer.feedback || '';
                studentAnswersForDisplay[index] = {
                    questionId: studentAnswer.questionId,
                    response: studentAnswer.response || '',
                    questionType: studentAnswer.questionType,
                    score: studentAnswer.score || 0,
                    correct: studentAnswer.correct || false
                };
            } else {
                // 如果没有找到对应的主观题答案，或者类型不匹配（理论上subjectiveQuestions已筛选，但作为保险）
                newQuestionScores[index] = 0;
                newFeedback[index] = '';
                studentAnswersForDisplay[index] = {
                    questionId: sq.id,
                    response: '', // 或 '未作答'
                    questionType: sq.type, // 使用主观题本身的类型
                    score: 0,
                    correct: false
                };
            }
        });

        selectedSubmission.value = {
            submissionId: detailData.id,
            assignmentId: detailData.assignmentId,
            studentId: detailData.studentId,
            autoScore: detailData.autoScore || 0,
            manualScore: detailData.manualScore || 0, // 将在保存评分时更新
            totalScore: detailData.totalScore || 0,   // 将在保存评分时更新
            status: detailData.status,
            submittedAt: detailData.submittedAt,
            overallFeedback: detailData.overallFeedback || '',
            
            answers: studentAnswersForDisplay, // 用于模板显示的、与主观题对齐的答案列表
            questionScores: newQuestionScores,   // 用于v-model的、与主观题对齐的分数列表
            feedback: newFeedback,               // 用于v-model的、与主观题对齐的评语列表
            // 如果需要，可以保留从API获取的原始完整答案列表，例如：
            // originalRawAnswers: detailData.answers || [] 
        };
        
    } catch (error) {
        console.error('获取提交详情失败:', error);
        showMessage('获取提交详情失败');
    }
};

// 批改提交
const gradeSubmissionHandler = async (submissionId, grades) => {
    try {
    
        const response = await gradeSubmission(submissionId, grades);
        console.log('批改提交响应:', response);
        // 更新本地提交列表中的对应提交
        const index = submissionState.list.findIndex(s => s.submissionId === submissionId);
        if (index !== -1) {
            submissionState.list[index] = {
                ...submissionState.list[index],
                ...response,
                status: 'graded'
            };
            // 更新统计信息
            updateSubmissionStats();
        }
        return true;
    } catch (err) {
        console.error('批改提交失败:', err);
        showMessage(err.message || '批改提交失败，请重试');
        return false;
    }
};

// 计算作业总分（包括自动评分题目和人工评分题目）
const assignmentTotalScore = computed(() => {
    // 主观题总分
    const manualTotal = subjectiveQuestions.value.reduce((total, q) => total + q.score, 0);
    // 自动评分题目总分（从第一个提交中获取，因为所有学生的自动评分题目总分是一样的）
    const autoTotal = submissions.value.length > 0 ? (submissions.value[0].autoTotalScore || 0) : 0;
    return manualTotal + autoTotal;
});

// 更新统计信息
const updateStats = () => {
    submissionStats.total = submissions.value.length;
    submissionStats.graded = submissions.value.filter(s => s.status === 'graded').length;
    submissionStats.pending = submissions.value.filter(s => s.status === 'graded_auto').length;
    
    // 计算平均分
    const gradedSubmissions = submissions.value.filter(s => s.totalScore != null);
    submissionStats.avgScore = gradedSubmissions.length
        ? gradedSubmissions.reduce((sum, s) => sum + s.totalScore, 0) / gradedSubmissions.length
        : 0;
};

const saveCurrentGrade = async () => {
    if (!selectedSubmission.value) return;
    console.log('选中的提交:', selectedSubmission.value);

    // 构建评分数据
    const grades = subjectiveQuestions.value.map((question, index) => ({
        questionId: String(question.id),
        score: selectedSubmission.value.questionScores[index] || 0,
        feedback: selectedSubmission.value.feedback[index] || ''
    }));

    try {
        loading.value = true;
        const response = await gradeSubmission(selectedSubmission.value.submissionId, grades);
        console.log('批改提交响应:', selectedSubmission.value);
        // 计算人工评分总和
        const manualScore = grades.reduce((sum, grade) => sum + grade.score, 0);
        const autoScore = selectedSubmission.value.autoScore || 0;

        // 更新提交列表中的状态
        const submissionIndex = submissions.value.findIndex(s => s.id === selectedSubmission.value.id);
        if (submissionIndex !== -1) {
            submissions.value[submissionIndex] = {
                ...submissions.value[submissionIndex],
                status: 'graded',
                manualScore: manualScore,
                autoScore: autoScore,
                totalScore: manualScore + autoScore
            };
        }

        // 更新统计信息
        updateStats();

        // 提示成功
        showMessage('批改已提交');
        
        // 清空当前选中的提交
        selectedSubmission.value = null;
    } catch (error) {
        console.log('kadsdsasadsadas:', selectedSubmission.value);
        console.error('保存评分失败:', error);
        showMessage('提交批改失败，请重试');
    } finally {
        loading.value = false;
    }
};

// 批量保存所有评分
const saveGrades = async () => {
    try {
        // 获取所有待批改的提交
        const pendingSubmissions = submissionState.list.filter(s => s.status === 'submitted');
        
        // 获取主观题列表
        const subjectiveQuestions = exercise.value.questions.filter(q => q.type === 'programming' || q.type === 'subjective' || q.type === 'short_answer');
        
        // 批量处理每个提交
        for (const submission of pendingSubmissions) {
            const grades = subjectiveQuestions.map(question => {
                const index = getQuestionIndex(question);
                return {
                    questionId: question.id,
                    score: Number(submission.questionScores[index]) || 0,
                    feedback: submission.feedback[index] || ''
                };
            });

            await gradeSubmissionHandler(submission.submissionId, grades);
        }

        showMessage('所有评分已保存');
        await loadSubmissions(); // 刷新列表
    } catch (err) {
        showMessage(err.message || '批量保存评分失败');
    }
};

const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return '';
    const date = new Date(dateTimeStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

const goBackToExerciseList = () => {
    router.back(); 
};

// 关闭批改对话框
const closeGrading = () => {
  selectedSubmission.value = null;
};

// 计算总分
const totalScore = computed(() => {
    return subjectiveQuestions.value.reduce((total, q) => total + q.score, 0);
});

// 计算平均分
const calculateAverageScore = () => {
    const gradedSubmissions = submissions.value.filter(s => s.status === 'graded');
    if (gradedSubmissions.length === 0) return '-';
    const totalScore = gradedSubmissions.reduce((sum, s) => sum + (s.score || 0), 0);
    return (totalScore / gradedSubmissions.length).toFixed(1);
};

// 在提交列表更新后更新统计
watch(submissions, () => {
    updateStats();
}, { deep: true });
</script>

<style scoped>
/* Add any scoped styles here */
</style>

