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
                        }" @click="selectSubmissionHandler(submission)">
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
import { useRouter } from 'vue-router';
import { getAssignmentSubmissions, getSubmissionDetail, gradeSubmission } from '@/api/assignment';
import { useCourseStore } from '@/stores/course';
import { useUserStore } from '@/stores/user';
import headImage from '@/assets/head.jpg';
const router = useRouter();
const userStore = useUserStore();
const courseStore = useCourseStore();

// 用户信息（可保留模拟数据或从store获取）
const user = ref({
    id: userStore.userId || 'teacher123',
    username: userStore.username || 'teacher001',
    name: userStore.name || '李教授',
    role: 'teacher',
    email: userStore.email || 'teacher001@example.com',
    college: userStore.college || '计算机科学与技术学院',
    avatar: headImage || '/placeholder.svg?height=40&width=40'
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
const exercise = ref({
    id: '',
    title: '',
    type: '',
    totalPoints: 0,
    openTime: '',
    closeTime: '',
    questions: []
});

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

const filteredSubmissions = computed(() => {
    return submissions.value.filter(submission => {
        if (filter.value === 'graded' && submission.status !== 'graded') return false;
        if (filter.value === 'pending' && submission.status !== 'pending') return false;
        if (searchQuery.value) {
            const query = searchQuery.value.toLowerCase();
            return (submission.studentName?.toLowerCase().includes(query) || submission.studentId?.toLowerCase().includes(query));
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

// 拉取提交列表和作业详情
async function fetchData() {
    try {
        const classId = courseStore.currentClassId;
        const assignmentId = courseStore.currentAssignmentId;
        // 获取提交列表
        const submissionList = await getAssignmentSubmissions(classId, assignmentId);
        submissions.value = (submissionList || []).map(sub => ({
            ...sub,
            studentName: sub.studentName || sub.student?.name || '',
            studentId: sub.studentId || sub.student?.id || '',
            // 兼容后端字段
        }));
        submissionStats.total = submissions.value.length;
        submissionStats.graded = submissions.value.filter(s => s.status === 'graded').length;
        submissionStats.pending = submissions.value.filter(s => s.status === 'pending').length;
        const graded = submissions.value.filter(s => s.status === 'graded' && s.totalScore != null);
        submissionStats.avgScore = graded.length ? graded.reduce((a, b) => a + (b.totalScore || 0), 0) / graded.length : 0;
        // 获取作业详情（可选：如需显示作业名、题目等）
        if (submissionList.length > 0 && submissionList[0].assignment) {
            const assignment = submissionList[0].assignment;
            exercise.value = {
                id: assignment.id,
                title: assignment.title,
                type: assignment.type,
                totalPoints: assignment.totalPoints,
                openTime: assignment.openTime,
                closeTime: assignment.dueDate,
                questions: assignment.questions || []
            };
        }
    } catch (e) {
        showMessage(e.message || '获取数据失败');
    }
}

// 选中提交，拉取详情
async function selectSubmissionHandler(submission) {
    try {
        const detail = await getSubmissionDetail(submission.submissionId || submission.id);
        selectedSubmission.value = detail;
    } catch (e) {
        showMessage(e.message || '获取提交详情失败');
    }
}

// 保存当前评分（只批改主观题）
async function saveCurrentGrade() {
    if (!selectedSubmission.value) return;
    // 只收集主观题
    const subjectiveQuestions = exercise.value.questions.filter(q => q.type === 'programming' || q.type === 'subjective');
    const grades = subjectiveQuestions.map(q => {
        const idx = getQuestionIndex(q);
        return {
            questionId: q.id,
            score: selectedSubmission.value.answers?.[idx]?.score,
            feedback: selectedSubmission.value.answers?.[idx]?.feedback || ''
        };
    });
    try {
        await gradeSubmission(selectedSubmission.value.submissionId, grades);
        showMessage('评分已保存');
        await fetchData(); // 刷新列表
        selectedSubmission.value = null;
    } catch (e) {
        showMessage(e.message || '保存评分失败');
    }
}

// 保存所有评分（可选：批量调用 gradeSubmission）
async function saveGrades() {
    showMessage('所有评分已保存');
}

const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return '';
    const date = new Date(dateTimeStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};
const goBackToExerciseList = () => { router.back(); };

onMounted(fetchData);
</script>

<style scoped>
/* Add any scoped styles here */
</style>

