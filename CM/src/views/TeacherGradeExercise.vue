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

        <!-- 练习信息 -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <div class="flex justify-between items-center mb-4">
                <h1 class="text-2xl font-bold">{{ exercise.title }}</h1>
                <div class="flex space-x-3">
                    <button class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
                        @click="generateFeedbackReport">
                        生成反馈报告
                    </button>
                    <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                        @click="saveGrades">
                        保存评分
                    </button>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div class="bg-gray-50 rounded-lg p-4">
                    <div class="text-sm text-gray-500 mb-1">练习类型</div>
                    <div class="font-medium">{{ exercise.type === 'choice' ? '选择题' : exercise.type === 'programming' ?
                        '编程题' : '混合题型' }}</div>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                    <div class="text-sm text-gray-500 mb-1">总分值</div>
                    <div class="font-medium">{{ exercise.totalPoints }} 分</div>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                    <div class="text-sm text-gray-500 mb-1">截止时间</div>
                    <div class="font-medium">{{ formatDateTime(exercise.closeTime) }}</div>
                </div>
            </div>

            <!-- 提交统计 -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div class="text-blue-500 text-lg font-bold mb-1">{{ submissionStats.total }}</div>
                    <div class="text-sm text-gray-600">总提交人数</div>
                </div>
                <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div class="text-green-500 text-lg font-bold mb-1">{{ submissionStats.graded }}</div>
                    <div class="text-sm text-gray-600">已批改</div>
                </div>
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div class="text-yellow-500 text-lg font-bold mb-1">{{ submissionStats.pending }}</div>
                    <div class="text-sm text-gray-600">待批改</div>
                </div>
                <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div class="text-purple-500 text-lg font-bold mb-1">{{ submissionStats.avgScore.toFixed(1) }}</div>
                    <div class="text-sm text-gray-600">平均分</div>
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
                    <button class="px-3 py-1 text-sm rounded-md"
                        :class="filter === 'graded' ? 'bg-green-100 text-green-800' : 'bg-white text-gray-600 hover:bg-gray-100'"
                        @click="filter = 'graded'">
                        已批改
                    </button>
                    <button class="px-3 py-1 text-sm rounded-md"
                        :class="filter === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-white text-gray-600 hover:bg-gray-100'"
                        @click="filter = 'pending'">
                        待批改
                    </button>
                </div>

                <div class="overflow-y-auto max-h-[500px] pr-2">
                    <div v-if="filteredSubmissions.length === 0" class="text-center py-8 text-gray-500">
                        没有符合条件的提交
                    </div>

                    <div v-for="submission in filteredSubmissions" :key="submission.id"
                        class="border rounded-lg p-3 mb-3 cursor-pointer transition-all hover:shadow-md" :class="{
                            'border-green-200 bg-green-50': submission.status === 'graded',
                            'border-yellow-200 bg-yellow-50': submission.status === 'pending',
                            'border-blue-300 shadow-md': selectedSubmission && selectedSubmission.id === submission.id
                        }" @click="selectSubmission(submission)">
                        <div class="flex justify-between items-center">
                            <div class="flex items-center">
                                <img :src="submission.student.avatar || '/placeholder.svg?height=32&width=32'"
                                    alt="学生头像" class="w-8 h-8 rounded-full mr-2" />
                                <div>
                                    <div class="font-medium">{{ submission.student.name }}</div>
                                    <div class="text-xs text-gray-500">{{ submission.student.id }}</div>
                                </div>
                            </div>
                            <div class="text-right">
                                <div class="font-medium" :class="{
                                    'text-green-600': submission.status === 'graded',
                                    'text-yellow-600': submission.status === 'pending'
                                }">
                                    {{ submission.status === 'graded' ? `${submission.score}/${exercise.totalPoints}` :
                                    '待批改' }}
                                </div>
                                <div class="text-xs text-gray-500">{{ formatDateTime(submission.submittedAt) }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 右侧批改区域 -->
            <div class="w-full md:w-2/3 bg-white rounded-lg shadow-md p-6">
                <div v-if="!selectedSubmission"
                    class="flex flex-col items-center justify-center h-full py-12 text-gray-500">
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
                        <div class="flex items-center">
                            <img :src="selectedSubmission.student.avatar || '/placeholder.svg?height=40&width=40'"
                                alt="学生头像" class="w-10 h-10 rounded-full mr-3" />
                            <div>
                                <div class="text-lg font-bold">{{ selectedSubmission.student.name }}</div>
                                <div class="text-sm text-gray-500">
                                    {{ selectedSubmission.student.id }} | {{ selectedSubmission.student.college }}
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center">
                            <div class="mr-4">
                                <div class="text-sm text-gray-500">提交时间</div>
                                <div>{{ formatDateTime(selectedSubmission.submittedAt) }}</div>
                            </div>
                            <div>
                                <div class="text-sm text-gray-500">总分</div>
                                <input v-model.number="selectedSubmission.score" type="number"
                                    class="w-16 px-2 py-1 border border-gray-300 rounded-md text-center font-bold"
                                    :max="exercise.totalPoints" :min="0" /> / {{ exercise.totalPoints }}
                            </div>
                        </div>
                    </div>

                    <!-- 选择题部分 -->
                    <div v-if="exercise.type === 'choice' || exercise.type === 'mixed'" class="mb-6">
                        <h3 class="text-lg font-bold mb-4">选择题（系统自动批改）</h3>

                        <div v-for="(question, qIndex) in exercise.questions.filter(q => q.type === 'choice')"
                            :key="`choice-${qIndex}`" class="border rounded-lg p-4 mb-4">
                            <div class="flex justify-between items-start mb-3">
                                <div class="flex items-start">
                                    <span class="font-medium mr-2">{{ qIndex + 1 }}.</span>
                                    <div>
                                        <div class="font-medium">{{ question.text }}</div>
                                        <div class="text-sm text-gray-500 mt-1">{{ question.points }} 分</div>
                                    </div>
                                </div>
                                <div class="flex items-center">
                                    <div class="px-2 py-1 rounded-md text-sm font-medium" :class="{
                                        'bg-green-100 text-green-800': selectedSubmission.answers[qIndex] === question.correctAnswer,
                                        'bg-red-100 text-red-800': selectedSubmission.answers[qIndex] !== question.correctAnswer
                                    }">
                                        {{ selectedSubmission.answers[qIndex] === question.correctAnswer ? '正确' : '错误'
                                        }}
                                    </div>
                                    <div class="ml-2">
                                        <input v-model.number="selectedSubmission.questionScores[qIndex]" type="number"
                                            class="w-12 px-2 py-1 border border-gray-300 rounded-md text-center"
                                            :max="question.points" :min="0" /> / {{ question.points }}
                                    </div>
                                </div>
                            </div>

                            <div class="ml-6 space-y-2">
                                <div v-for="(option, oIndex) in question.options" :key="oIndex"
                                    class="flex items-center p-3 rounded-lg" :class="{
                                        'bg-green-50 border border-green-200': question.correctAnswer === oIndex,
                                        'bg-red-50 border border-red-200': selectedSubmission.answers[qIndex] === oIndex && selectedSubmission.answers[qIndex] !== question.correctAnswer,
                                        'border border-gray-200': selectedSubmission.answers[qIndex] !== oIndex && question.correctAnswer !== oIndex
                                    }">
                                    <div class="w-6 h-6 rounded-full flex items-center justify-center border mr-2"
                                        :class="{
                                            'bg-green-500 border-green-500 text-white': question.correctAnswer === oIndex,
                                            'bg-red-500 border-red-500 text-white': selectedSubmission.answers[qIndex] === oIndex && selectedSubmission.answers[qIndex] !== question.correctAnswer,
                                            'border-gray-300': selectedSubmission.answers[qIndex] !== oIndex && question.correctAnswer !== oIndex
                                        }">
                                        {{ ['A', 'B', 'C', 'D'][oIndex] }}
                                    </div>
                                    <div>{{ option }}</div>
                                </div>
                            </div>

                            <div class="mt-3 ml-6">
                                <div class="text-sm font-medium text-gray-700">解析:</div>
                                <div class="text-sm text-gray-600 mt-1">{{ question.explanation }}</div>
                            </div>
                        </div>
                    </div>

                    <!-- 编程题部分 -->
                    <div v-if="exercise.type === 'programming' || exercise.type === 'mixed'" class="mb-6">
                        <h3 class="text-lg font-bold mb-4">编程题（手动批改）</h3>

                        <div v-for="(question, qIndex) in exercise.questions.filter(q => q.type === 'programming')"
                            :key="`programming-${qIndex}`" class="border rounded-lg p-4 mb-4">
                            <div class="flex justify-between items-start mb-3">
                                <div class="flex items-start">
                                    <span class="font-medium mr-2">{{ getQuestionNumber(question) }}.</span>
                                    <div>
                                        <div class="font-medium">{{ question.text }}</div>
                                        <div class="text-sm text-gray-500 mt-1">{{ question.points }} 分</div>
                                    </div>
                                </div>
                                <div>
                                    <input
                                        v-model.number="selectedSubmission.questionScores[getQuestionIndex(question)]"
                                        type="number"
                                        class="w-16 px-2 py-1 border border-gray-300 rounded-md text-center"
                                        :max="question.points" :min="0" /> / {{ question.points }}
                                </div>
                            </div>

                            <div class="ml-6 mb-4">
                                <div class="text-sm text-gray-700 mb-2">题目描述:</div>
                                <div class="text-sm bg-gray-50 p-3 rounded-lg">{{ question.description }}</div>
                            </div>

                            <div class="ml-6 mb-4">
                                <div class="text-sm text-gray-700 mb-2">学生提交的代码:</div>
                                <div class="border rounded-lg overflow-hidden">
                                    <div class="bg-gray-100 px-4 py-2 border-b flex justify-between items-center">
                                        <span>{{ question.language }}</span>
                                    </div>
                                    <pre
                                        class="p-4 font-mono text-sm overflow-x-auto bg-gray-50 max-h-64">{{selectedSubmission.codeAnswers[getQuestionIndex(question) - exercise.questions.filter(q => q.type === 'choice').length]}}</pre>
                                </div>
                            </div>

                            <div class="ml-6 mb-4">
                                <div class="text-sm text-gray-700 mb-2">参考答案:</div>
                                <div class="border rounded-lg overflow-hidden">
                                    <div class="bg-gray-100 px-4 py-2 border-b flex justify-between items-center">
                                        <span>{{ question.language }}</span>
                                    </div>
                                    <pre
                                        class="p-4 font-mono text-sm overflow-x-auto bg-gray-50 max-h-64">{{ question.sampleAnswer }}</pre>
                                </div>
                            </div>

                            <!-- 测试用例结果 -->
                            <div class="ml-6 mb-4">
                                <div class="text-sm text-gray-700 mb-2">测试用例结果:</div>
                                <div class="space-y-2">
                                    <div v-for="(test, tIndex) in question.testCases" :key="tIndex"
                                        class="border rounded-lg p-3" :class="{
                                            'border-green-200 bg-green-50': selectedSubmission.testResults[getQuestionIndex(question)][tIndex].passed,
                                            'border-red-200 bg-red-50': !selectedSubmission.testResults[getQuestionIndex(question)][tIndex].passed
                                        }">
                                        <div class="flex justify-between items-center mb-1">
                                            <div class="font-medium text-sm">{{ test.name }}</div>
                                            <div class="px-2 py-0.5 rounded-full text-xs font-medium" :class="{
                                                'bg-green-200 text-green-800': selectedSubmission.testResults[getQuestionIndex(question)][tIndex].passed,
                                                'bg-red-200 text-red-800': !selectedSubmission.testResults[getQuestionIndex(question)][tIndex].passed
                                            }">
                                                {{
                                                    selectedSubmission.testResults[getQuestionIndex(question)][tIndex].passed
                                                ? '通过' : '失败' }}
                                            </div>
                                        </div>
                                        <div class="text-sm"><span class="text-gray-600">输入:</span> {{ test.input }}
                                        </div>
                                        <div class="text-sm"><span class="text-gray-600">期望输出:</span> {{
                                            test.expectedOutput }}</div>
                                        <div class="text-sm"><span class="text-gray-600">实际输出:</span> {{
                                            selectedSubmission.testResults[getQuestionIndex(question)][tIndex].actualOutput
                                            }}</div>
                                    </div>
                                </div>
                            </div>

                            <div class="ml-6">
                                <div class="text-sm font-medium text-gray-700 mb-2">教师评语:</div>
                                <textarea v-model="selectedSubmission.feedback[getQuestionIndex(question)]"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 text-sm"
                                    placeholder="请输入对该题的评语..."></textarea>
                            </div>
                        </div>
                    </div>

                    <!-- 总体评语 -->
                    <div class="border-t pt-4">
                        <div class="text-lg font-bold mb-3">总体评语</div>
                        <textarea v-model="selectedSubmission.overallFeedback"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                            placeholder="请输入对该学生提交的总体评语..."></textarea>

                        <div class="flex justify-end mt-4 space-x-3">
                            <button class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                                @click="selectedSubmission = null">
                                返回列表
                            </button>
                            <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                                @click="saveCurrentGrade">
                                保存评分
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
                            <span>{{ exercise.type === 'choice' ? '选择题' : exercise.type === 'programming' ? '编程题' :
                                '混合题型' }}</span>
                            <span class="mx-2">|</span>
                            <span>提交人数: {{ submissionStats.total }}</span>
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
                                        <td class="border px-4 py-2">{{ question.type === 'choice' ? '选择题' : '编程题' }}
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
import { ref, reactive, computed, onMounted } from 'vue';

// 用户信息 - 使用模拟数据进行预览
const user = ref({
    id: 'teacher123',
    username: 'teacher001',
    name: '李教授',
    role: 'teacher',
    email: 'teacher001@example.com',
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
    title: '数据结构基础练习',
    type: 'mixed',
    totalPoints: 100,
    openTime: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    closeTime: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    questions: [
        {
            id: 'q1',
            type: 'choice',
            text: '以下哪种数据结构支持常数时间的随机访问？',
            options: ['数组', '链表', '栈', '队列'],
            correctAnswer: 0,
            points: 10,
            explanation: '数组支持常数时间O(1)的随机访问，因为可以通过索引直接计算内存地址。链表需要从头遍历，栈和队列只能按特定顺序访问元素。'
        },
        {
            id: 'q2',
            type: 'choice',
            text: '链表的主要优点是什么？',
            options: ['快速的随机访问', '内存分配的灵活性', '缓存友好性', '节省内存空间'],
            correctAnswer: 1,
            points: 10,
            explanation: '链表的主要优点是内存分配的灵活性，它可以动态地分配内存，不需要连续的内存空间。这使得插入和删除操作更加高效。'
        },
        {
            id: 'q3',
            type: 'choice',
            text: '在最坏情况下，在数组中查找元素的时间复杂度是多少？',
            options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
            correctAnswer: 2,
            points: 10,
            explanation: '在未排序的数组中查找元素，最坏情况下需要遍历整个数组，时间复杂度为O(n)。如果数组已排序，可以使用二分查找，时间复杂度为O(log n)。'
        },
        {
            id: 'q4',
            type: 'programming',
            text: '实现一个栈（Stack）数据结构',
            description: '请实现一个栈数据结构，包含push、pop、peek和isEmpty方法。',
            language: 'JavaScript',
            points: 35,
            sampleAnswer: `class Stack {
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
            testCases: [
                {
                    name: '基本操作测试',
                    input: 'push(1), push(2), peek()',
                    expectedOutput: '2'
                },
                {
                    name: 'pop操作测试',
                    input: 'push(1), push(2), pop(), pop()',
                    expectedOutput: '1'
                },
                {
                    name: '空栈测试',
                    input: 'isEmpty()',
                    expectedOutput: 'true'
                }
            ]
        },
        {
            id: 'q5',
            type: 'programming',
            text: '实现一个队列（Queue）数据结构',
            description: '请实现一个队列数据结构，包含enqueue、dequeue、peek和isEmpty方法。',
            language: 'JavaScript',
            points: 35,
            sampleAnswer: `class Queue {
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
  
    isEmpty() {
      return this.items.length === 0;
    }
  }`,
            testCases: [
                {
                    name: '基本操作测试',
                    input: 'enqueue(1), enqueue(2), peek()',
                    expectedOutput: '1'
                },
                {
                    name: 'dequeue操作测试',
                    input: 'enqueue(1), enqueue(2), dequeue()',
                    expectedOutput: '1'
                },
                {
                    name: '空队列测试',
                    input: 'isEmpty()',
                    expectedOutput: 'true'
                }
            ]
        }
    ]
});

// 提交统计
const submissionStats = reactive({
    total: 30,
    graded: 22,
    pending: 8,
    avgScore: 78.5
});

// 学生提交列表 - 使用模拟数据进行预览
const submissions = ref([
    {
        id: 'sub-001',
        student: {
            id: '2023001',
            name: '张三',
            college: '计算机科学与技术学院',
            avatar: '/placeholder.svg?height=40&width=40'
        },
        submittedAt: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'graded',
        score: 85,
        answers: [0, 1, 2], // 选择题答案
        questionScores: [10, 10, 10, 25, 30], // 每道题的得分
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
  
    isEmpty() {
      return this.items.length === 0;
    }
  }`
        ],
        testResults: [
            [], [], [], // 选择题没有测试结果
            [
                { passed: true, actualOutput: '2' },
                { passed: true, actualOutput: '1' },
                { passed: true, actualOutput: 'true' }
            ],
            [
                { passed: true, actualOutput: '1' },
                { passed: true, actualOutput: '1' },
                { passed: true, actualOutput: 'true' }
            ]
        ],
        feedback: ['', '', '', '实现正确，代码结构清晰。', '实现正确，但可以优化空间复杂度。'],
        overallFeedback: '整体表现良好，对数据结构的基本概念理解清晰。栈和队列的实现都符合要求，但队列的实现可以考虑使用更高效的方法来优化dequeue操作的时间复杂度。'
    },
    {
        id: 'sub-002',
        student: {
            id: '2023002',
            name: '李四',
            college: '计算机科学与技术学院',
            avatar: '/placeholder.svg?height=40&width=40'
        },
        submittedAt: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'graded',
        score: 65,
        answers: [0, 3, 2], // 选择题答案，第二题错误
        questionScores: [10, 0, 10, 20, 25], // 每道题的得分
        codeAnswers: [
            `class Stack {
    constructor() {
      this.items = [];
    }
  
    push(element) {
      this.items.push(element);
    }
  
    pop() {
      return this.items.pop(); // 没有检查空栈情况
    }
  
    peek() {
      return this.items[this.items.length - 1]; // 没有检查空栈情况
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
      return this.items.shift(); // 没有检查空队列情况
    }
  
    peek() {
      return this.items[0]; // 没有检查空队列情况
    }
  
    isEmpty() {
      return this.items.length === 0;
    }
  }`
        ],
        testResults: [
            [], [], [], // 选择题没有测试结果
            [
                { passed: true, actualOutput: '2' },
                { passed: true, actualOutput: '1' },
                { passed: false, actualOutput: 'undefined' } // 空栈测试失败
            ],
            [
                { passed: true, actualOutput: '1' },
                { passed: true, actualOutput: '1' },
                { passed: false, actualOutput: 'undefined' } // 空队列测试失败
            ]
        ],
        feedback: ['', '', '', '基本实现正确，但没有处理边界情况（空栈）。', '基本实现正确，但没有处理边界情况（空队列）。'],
        overallFeedback: '对基本概念有一定理解，但在编程实现中缺乏对边界情况的考虑。建议加强对异常情况的处理，提高代码的健壮性。'
    },
    {
        id: 'sub-003',
        student: {
            id: '2023003',
            name: '王五',
            college: '计算机科学与技术学院',
            avatar: '/placeholder.svg?height=40&width=40'
        },
        submittedAt: new Date(new Date().getTime() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        score: null,
        answers: [0, 1, 1], // 选择题答案，第三题错误
        questionScores: [10, 10, 0, null, null], // 选择题自动评分，编程题待评分
        codeAnswers: [
            `class Stack {
    constructor() {
      this.stack = [];
    }
  
    push(element) {
      this.stack.push(element);
    }
  
    pop() {
      if (this.isEmpty()) {
        return "Stack is empty";
      }
      return this.stack.pop();
    }
  
    peek() {
      if (this.isEmpty()) {
        return "Stack is empty";
      }
      return this.stack[this.stack.length - 1];
    }
  
    isEmpty() {
      return this.stack.length === 0;
    }
  }`,
            `class Queue {
    constructor() {
      this.queue = [];
    }
  
    enqueue(element) {
      this.queue.push(element);
    }
  
    dequeue() {
      if (this.isEmpty()) {
        return "Queue is empty";
      }
      return this.queue.shift();
    }
  
    peek() {
      if (this.isEmpty()) {
        return "Queue is empty";
      }
      return this.queue[0];
    }
  
    isEmpty() {
      return this.queue.length === 0;
    }
  }`
        ],
        testResults: [
            [], [], [], // 选择题没有测试结果
            [
                { passed: true, actualOutput: '2' },
                { passed: true, actualOutput: '1' },
                { passed: true, actualOutput: 'true' }
            ],
            [
                { passed: true, actualOutput: '1' },
                { passed: true, actualOutput: '1' },
                { passed: true, actualOutput: 'true' }
            ]
        ],
        feedback: ['', '', '', '', ''],
        overallFeedback: ''
    }
]);

// 搜索和筛选
const searchQuery = ref('');
const filter = ref('all');

// 过滤后的提交列表
const filteredSubmissions = computed(() => {
    return submissions.value.filter(submission => {
        // 状态筛选
        if (filter.value === 'graded' && submission.status !== 'graded') {
            return false;
        }
        if (filter.value === 'pending' && submission.status !== 'pending') {
            return false;
        }

        // 搜索筛选
        if (searchQuery.value) {
            const query = searchQuery.value.toLowerCase();
            return submission.student.name.toLowerCase().includes(query) ||
                submission.student.id.toLowerCase().includes(query);
        }

        return true;
    });
});

// 选中的提交
const selectedSubmission = ref(null);

// 选择提交
const selectSubmission = (submission) => {
    selectedSubmission.value = JSON.parse(JSON.stringify(submission)); // 深拷贝，避免直接修改原数据
};

// 获取题目编号
const getQuestionNumber = (question) => {
    return exercise.value.questions.findIndex(q => q.id === question.id) + 1;
};

// 获取题目索引
const getQuestionIndex = (question) => {
    return exercise.value.questions.findIndex(q => q.id === question.id);
};

// 保存当前评分
const saveCurrentGrade = () => {
    if (!selectedSubmission.value) return;

    // 计算总分
    let totalScore = 0;
    selectedSubmission.value.questionScores.forEach(score => {
        if (score !== null) {
            totalScore += score;
        }
    });

    selectedSubmission.value.score = totalScore;
    selectedSubmission.value.status = 'graded';

    // 更新原始数据
    const index = submissions.value.findIndex(s => s.id === selectedSubmission.value.id);
    if (index !== -1) {
        submissions.value[index] = JSON.parse(JSON.stringify(selectedSubmission.value));
    }

    // 更新统计数据
    updateSubmissionStats();

    showMessage('评分已保存');
};

// 保存所有评分
const saveGrades = () => {
    // 在实际应用中，这里应该调用API保存所有评分
    showMessage('所有评分已保存');
};

// 更新提交统计
const updateSubmissionStats = () => {
    submissionStats.graded = submissions.value.filter(s => s.status === 'graded').length;
    submissionStats.pending = submissions.value.filter(s => s.status === 'pending').length;

    // 计算平均分
    let totalScore = 0;
    let gradedCount = 0;

    submissions.value.forEach(submission => {
        if (submission.status === 'graded' && submission.score !== null) {
            totalScore += submission.score;
            gradedCount++;
        }
    });

    submissionStats.avgScore = gradedCount > 0 ? totalScore / gradedCount : 0;
};

// 格式化日期时间
const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return '';
    const date = new Date(dateTimeStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

// 返回练习列表
const goBackToExerciseList = () => {
    // 在实际应用中，这里应该跳转回练习列表页面
    console.log('返回练习列表');
};

// 反馈报告
const showFeedbackReport = ref(false);
const feedbackReport = reactive({
    scoreDistribution: {
        fail: 15, // 不及格比例
        pass: 25, // 及格比例
        good: 40, // 良好比例
        excellent: 20 // 优秀比例
    },
    questionAnalysis: [
        {
            type: 'choice',
            points: 10,
            avgScore: 9.2,
            correctRate: 0.92,
            difficulty: 0.08 // 0-1，越高越难
        },
        {
            type: 'choice',
            points: 10,
            avgScore: 6.5,
            correctRate: 0.65,
            difficulty: 0.35
        },
        {
            type: 'choice',
            points: 10,
            avgScore: 7.8,
            correctRate: 0.78,
            difficulty: 0.22
        },
        {
            type: 'programming',
            points: 35,
            avgScore: 28.5,
            correctRate: 0.81,
            difficulty: 0.19
        },
        {
            type: 'programming',
            points: 35,
            avgScore: 26.2,
            correctRate: 0.75,
            difficulty: 0.25
        }
    ],
    commonErrors: [
        {
            questionIndex: 1,
            description: '多数学生对链表的优点理解不清晰',
            errorDetail: '约35%的学生选择了"快速的随机访问"或"缓存友好性"，这表明他们对链表的特性存在误解。',
            suggestion: '建议加强对链表特性的讲解，特别是与数组的对比，明确链表在内存分配上的灵活性优势。'
        },
        {
            questionIndex: 3,
            description: '栈的实现中常见边界情况处理不当',
            errorDetail: '约20%的学生在实现栈时没有正确处理空栈情况，导致在pop()和peek()方法中可能出现错误。',
            suggestion: '强调数据结构实现中边界情况的重要性，建议提供更多关于异常处理的练习。'
        }
    ]
});

// 生成反馈报告
const generateFeedbackReport = () => {
    // 在实际应用中，这里应该根据所有提交数据生成报告
    showFeedbackReport.value = true;
};

// 导出反馈报告
const exportFeedbackReport = () => {
    // 在实际应用中，这里应该导出报告为PDF或Excel
    showMessage('反馈报告已导出');
};

// 组件挂载时
onMounted(() => {
    // 更新统计数据
    updateSubmissionStats();
});
</script>