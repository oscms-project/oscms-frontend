<!-- ExerciseList.vue -->
<template>
    <div class="min-h-screen bg-gray-50 p-4">
        <!-- 顶部导航栏 -->
        <div class="flex justify-between items-center mb-6">
            <div class="flex items-center">
                <button class="flex items-center text-gray-700 hover:text-gray-900" @click="goBack">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="mr-2">
                        <path d="m15 18-6-6 6-6"></path>
                    </svg>
                    <span class="text-lg font-medium">{{ course.name }}</span>
                </button>
            </div>
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

        <!-- 练习列表 -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 class="text-2xl font-bold mb-6">练习列表</h1>

            <div v-if="loading" class="flex justify-center py-8">
                <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
            </div>

            <div v-else-if="error" class="text-center py-8 text-red-500">
                {{ error }}
            </div>

            <div v-else class="space-y-4">
                <div v-for="exercise in exercises" :key="exercise.id"
                    class="border rounded-lg p-4 transition-all hover:shadow-md cursor-pointer" :class="{
                        'border-gray-200 bg-gray-50': getExerciseStatus(exercise) === 'expired',
                        'border-green-200 bg-green-50': getExerciseStatus(exercise) === 'in-progress',
                        'border-yellow-200 bg-yellow-50': getExerciseStatus(exercise) === 'upcoming'
                    }" @click="enterExercise(exercise)">
                    <div class="flex justify-between items-center">
                        <div>
                            <h3 class="font-medium" :class="{
                                'text-gray-500': getExerciseStatus(exercise) === 'expired',
                                'text-green-700': getExerciseStatus(exercise) === 'in-progress',
                                'text-yellow-700': getExerciseStatus(exercise) === 'upcoming'
                            }">{{ exercise.title }}</h3>
                            <p class="text-sm mt-1" :class="{
                                'text-gray-400': getExerciseStatus(exercise) === 'expired',
                                'text-green-600': getExerciseStatus(exercise) === 'in-progress',
                                'text-yellow-600': getExerciseStatus(exercise) === 'upcoming'
                            }">
                                {{ exercise.type === 'choice' ? '选择题' : '编程题' }} · 总分: {{ exercise.totalPoints }}
                            </p>
                        </div>
                        <div class="flex items-center">
                            <span class="text-sm mr-3" :class="{
                                'text-gray-400': getExerciseStatus(exercise) === 'expired',
                                'text-green-600': getExerciseStatus(exercise) === 'in-progress',
                                'text-yellow-600': getExerciseStatus(exercise) === 'upcoming'
                            }">
                                {{ getStatusText(getExerciseStatus(exercise)) }}
                            </span>
                            <div class="w-3 h-3 rounded-full" :class="{
                                'bg-gray-400': getExerciseStatus(exercise) === 'expired',
                                'bg-green-500': getExerciseStatus(exercise) === 'in-progress',
                                'bg-yellow-500': getExerciseStatus(exercise) === 'upcoming'
                            }"></div>
                        </div>
                    </div>

                    <!-- 时间信息 -->
                    <div class="mt-2 flex justify-between text-sm">
                        <div :class="{
                            'text-gray-400': getExerciseStatus(exercise) === 'expired',
                            'text-green-600': getExerciseStatus(exercise) === 'in-progress',
                            'text-yellow-600': getExerciseStatus(exercise) === 'upcoming'
                        }">
                            <!-- 未开始的练习只显示开始时间 -->
                            <span v-if="getExerciseStatus(exercise) === 'upcoming'">
                                开始时间: {{ formatDateTime(exercise.openTime) }}
                            </span>

                            <!-- 进行中和已截止的练习显示开始和结束时间 -->
                            <span v-else>
                                开始: {{ formatDateTime(exercise.openTime) }} |
                                结束: {{ formatDateTime(getEndTime(exercise)) }}
                            </span>
                        </div>
                        <span :class="{
                            'text-gray-400': getExerciseStatus(exercise) === 'expired',
                            'text-green-600': getExerciseStatus(exercise) === 'in-progress',
                            'text-yellow-600': getExerciseStatus(exercise) === 'upcoming'
                        }">
                            {{ exercise.allowResubmit ? '允许重新提交' : '不允许重新提交' }}
                        </span>
                    </div>

                    <!-- 提交状态 -->
                    <div v-if="exercise.submission" class="mt-2 pt-2 border-t border-dashed">
                        <div class="flex justify-end">
                            <span class="text-sm font-medium" :class="{
                                'text-gray-500': getExerciseStatus(exercise) === 'expired',
                                'text-green-600': exercise.submission.score !== null,
                                'text-yellow-600': exercise.submission.score === null
                            }">
                                {{ exercise.submission.score !== null ? `得分:
                                ${exercise.submission.score}/${exercise.totalPoints}` : '待批改' }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="exercises.length === 0 && !loading && !error" class="text-center py-8 text-gray-500">
                暂无练习
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

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

// 课程信息 - 使用模拟数据进行预览
const course = ref({
    id: 'course-123',
    name: '数据结构与算法',
    code: 'CS101'
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

// 练习列表数据 - 使用模拟数据进行预览
const exercises = ref([
    {
        id: 'ex-001',
        title: '数组与链表基础',
        type: 'choice',
        totalPoints: 100,
        openTime: new Date(new Date().getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5天前
        allowResubmit: true,
        submission: {
            submittedAt: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3天前
            score: 85
        }
    },
    {
        id: 'ex-002',
        title: '栈与队列实现',
        type: 'programming',
        totalPoints: 100,
        openTime: new Date().toISOString(), // 现在
        allowResubmit: true,
        submission: {
            submittedAt: new Date().toISOString(),
            score: null // 待批改
        }
    },
    {
        id: 'ex-003',
        title: '树与图结构',
        type: 'choice',
        totalPoints: 100,
        openTime: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5天后
        allowResubmit: false
    },
    {
        id: 'ex-004',
        title: '排序算法实现',
        type: 'programming',
        totalPoints: 150,
        openTime: new Date(new Date().getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15天前
        allowResubmit: false,
        submission: {
            submittedAt: new Date(new Date().getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10天前
            score: 120
        }
    }
]);

const loading = ref(false);
const error = ref(null);

// 格式化日期时间
const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return '';
    const date = new Date(dateTimeStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

// 获取练习结束时间
const getEndTime = (exercise) => {
    const openTime = new Date(exercise.openTime);
    const endTime = new Date(openTime);
    endTime.setDate(endTime.getDate() + 7); // 假设练习有效期为7天
    return endTime.toISOString();
};

// 获取练习状态
const getExerciseStatus = (exercise) => {
    const now = new Date();
    const openTime = new Date(exercise.openTime);

    // 假设练习有效期为7天
    const endTime = new Date(openTime);
    endTime.setDate(endTime.getDate() + 7);

    if (now < openTime) {
        return 'upcoming'; // 未开始
    } else if (now > endTime) {
        return 'expired'; // 已截止
    } else {
        return 'in-progress'; // 进行中
    }
};

// 获取状态文本
const getStatusText = (status) => {
    switch (status) {
        case 'expired':
            return '已截止';
        case 'in-progress':
            return '进行中';
        case 'upcoming':
            return '未开始';
        default:
            return '';
    }
};

// 返回上一页
const goBack = () => {
    // 预览模式下不执行实际操作
    console.log('返回上一页');
};

// 进入练习
const enterExercise = (exercise) => {
    // 预览模式下不执行实际操作
    const status = getExerciseStatus(exercise);

    if (status === 'upcoming') {
        showMessage('别着急，老师还没开放');
        return;
    }

    if (status === 'expired' && !exercise.allowResubmit && exercise.submission) {
        showMessage('很遗憾，练习已截止');
        return;
    }

    router.push({ name: 'ExercisePage', params: { id: exercise.id } });
};

// 预览模式下不需要实际获取数据
onMounted(() => {
    console.log('组件已挂载');
});
</script>