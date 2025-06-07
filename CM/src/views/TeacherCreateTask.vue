<template>
    <div class="min-h-screen bg-gray-50 p-4">
        <!-- 顶部导航栏 -->
        <div class="flex justify-between items-center mb-6">
            <div class="flex items-center">
                <button class="flex items-center text-gray-700 hover:text-gray-900" @click="goBackToCourseManagement">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="mr-2">
                        <path d="m15 18-6-6 6-6"></path>
                    </svg>
                    <span class="text-lg font-medium">返回任务管理</span>
                </button>
            </div>


        </div>

        <!-- 班级筛选 -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 class="text-xl font-bold mb-4">班级筛选</h2>
            <select v-model="task.classId" class="form-select mt-1 block w-full">
                <option v-for="classItem in classes" :key="classItem.id" :value="classItem.id">
                    {{ classItem.name }}
                </option>
            </select>
        </div>

        <!-- 中央提示框 -->
        <div v-if="showAlert" class="fixed inset-0 flex items-center justify-center z-50">
            <div class="bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg">
                {{ alertMessage }}
            </div>
        </div>

        <!-- 页面标题 -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <div class="flex justify-between items-center">
                <h1 class="text-2xl font-bold">新建学习任务</h1>
                <div class="flex space-x-3">
                    <button class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm"
                        @click="saveAsDraft">
                        保存草稿
                    </button>
                    <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
                        @click="previewTask">
                        预览
                    </button>
                    <button class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
                        @click="publishTask">
                        发布
                    </button>
                </div>
            </div>
        </div>

        <!-- 任务基本信息 -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 class="text-xl font-bold mb-4">基本信息</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">任务标题</label>
                    <input v-model="task.title" type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="请输入任务标题" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">任务类型</label>
                    <select v-model="task.type"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="choice">选择题</option>
                        <option value="programming">编程题</option>
                        <option value="mixed">混合题型</option>
                    </select>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">总分值</label>
                    <input v-model.number="task.totalPoints" type="number"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="请输入总分值" min="0" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">开始时间</label>
                    <input v-model="task.openTime" type="datetime-local"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">截止时间</label>
                    <input v-model="task.closeTime" type="datetime-local"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">时间限制（分钟）</label>
                    <input v-model.number="task.timeLimit" type="number"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="不填则无限制" min="0" />
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">允许重新提交</label>
                    <div class="flex items-center mt-2">
                        <label class="inline-flex items-center mr-4">
                            <input type="radio" v-model="task.allowResubmit" :value="true"
                                class="form-radio h-4 w-4 text-blue-600">
                            <span class="ml-2 text-gray-700">是</span>
                        </label>
                        <label class="inline-flex items-center">
                            <input type="radio" v-model="task.allowResubmit" :value="false"
                                class="form-radio h-4 w-4 text-blue-600">
                            <span class="ml-2 text-gray-700">否</span>
                        </label>
                    </div>
                </div>
            </div>

            <div class="mt-4">
                <label class="block text-sm font-medium text-gray-700 mb-1">任务说明</label>
                <textarea v-model="task.description"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                    placeholder="请输入任务说明"></textarea>
            </div>
        </div>

        <!-- 题目列表 -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <div class="flex justify-between items-center mb-4">
                <h2 class="text-xl font-bold">题目列表</h2>
                <div class="flex space-x-2">
                    <button
                        class="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-lg text-sm flex items-center"
                        @click="openQuestionBank">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="mr-1">
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                        </svg>
                        从题库导入
                    </button>
                    <button class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm flex items-center"
                        @click="openAddChoiceModal">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="mr-1">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        添加选择题
                    </button>
                    <button class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg text-sm flex items-center"
                        @click="openAddShortAnswerModal">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="mr-1">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        添加简答题
                    </button>
                    <button class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm flex items-center"
                        @click="openAddCodingModal">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="mr-1">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        添加编程题
                    </button>
                </div>
            </div>

            <div v-if="task.questions.length === 0"
                class="text-center py-8 text-gray-500 border border-dashed border-gray-300 rounded-lg">
                请添加题目或从题库导入
            </div>

            <div v-else class="space-y-6">
                <!-- 选择题 -->
                <div v-for="(question, qIndex) in task.questions" :key="qIndex" class="border rounded-lg p-4" :class="{
                    'border-blue-200 bg-blue-50': question.type === 'choice',
                    'border-green-200 bg-green-50': question.type === 'programming'
                }">
                    <div class="flex justify-between items-start mb-4">
                        <div class="flex items-start">
                            <span class="font-medium mr-2">{{ qIndex + 1 }}.</span>
                            <div class="w-full">
                                <div class="flex items-center">
                                    <span class="px-2 py-0.5 text-xs rounded-full mr-2" :class="{
                                        'bg-blue-200 text-blue-800': question.type === 'choice',
                                        'bg-green-200 text-green-800': question.type === 'programming'
                                    }">
                                        {{ question.type === 'choice' ? '选择题' : '编程题' }}
                                    </span>
                                    <input v-if="!question.bankId" v-model="question.text" type="text"
                                        class="flex-grow px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="请输入题目" />
                                    <span v-else class="flex-grow px-2 py-1 text-gray-700">{{ question.text }}</span>
                                </div>
                                <div class="flex items-center mt-2">
                                    <label class="text-sm text-gray-600 mr-2">分值:</label>
                                    <input v-if="!question.bankId" v-model.number="question.points" type="number"
                                        class="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        min="0" />
                                    <span v-else class="px-2 py-1 text-gray-700">{{ question.points === undefined || question.points === null ? '未设' : question.points + '分' }}</span>
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center">
                            <button class="text-gray-400 hover:text-red-500 focus:outline-none"
                                @click="removeQuestion(qIndex)">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path
                                        d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2">
                                    </path>
                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <!-- 选择题选项 -->
                    <div v-if="question.type === 'choice'" class="ml-6 space-y-2 mt-4">
                        <!-- Editable options for manually added questions -->
                        <template v-if="!question.bankId">
                            <div v-for="(option, oIndex) in question.options" :key="oIndex" class="flex items-center">
                                <div class="w-6 h-6 rounded-full flex items-center justify-center border mr-2 cursor-pointer"
                                    :class="{ 'bg-green-500 border-green-500 text-white': question.correctAnswer === oIndex, 'border-gray-300 hover:bg-gray-100': question.correctAnswer !== oIndex }"
                                    @click="setCorrectAnswer(question, oIndex)">
                                    {{ ['A', 'B', 'C', 'D'][oIndex] }}
                                </div>
                                <input v-model="question.options[oIndex]" type="text"
                                    class="flex-grow px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    :placeholder="`选项 ${['A', 'B', 'C', 'D'][oIndex]}`" />
                                <button class="ml-2 text-gray-400 hover:text-red-500 focus:outline-none"
                                    @click="removeOption(question, oIndex)" :disabled="question.options.length <= 2"
                                    :class="{ 'opacity-50 cursor-not-allowed': question.options.length <= 2 }">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
                                </button>
                                <!-- Removed setCorrectAnswer button from here as click on A/B/C/D does it -->
                            </div>
                            <div v-if="question.options.length < 4" class="flex justify-center">
                                <button class="text-blue-500 hover:text-blue-700 text-sm flex items-center"
                                    @click="addOption(question)">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                                    添加选项
                                </button>
                            </div>
                        </template>
                        <!-- Read-only options for questions from bank -->
                        <template v-else>
                            <div v-for="(option, oIndex) in question.options" :key="option.id" class="flex items-center py-1">
                                <div class="w-6 h-6 rounded-full flex items-center justify-center border mr-2"
                                    :class="{ 'bg-green-500 border-green-500 text-white': question.answer === option.id, 'border-gray-300': question.answer !== option.id }">
                                    {{ ['A', 'B', 'C', 'D'][oIndex] }}
                                </div>
                                <span class="text-gray-700">{{ option.text }}</span>
                            </div>
                        </template>
                    </div>

                    <!-- 编程题详情 -->
                    <div v-if="question.type === 'programming'" class="ml-6 mt-4">
                        <div class="mb-3">
                            <label class="block text-sm font-medium text-gray-700 mb-1">题目描述</label>
                            <textarea v-if="!question.bankId" v-model="question.description"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                                placeholder="请输入题目描述"></textarea>
                            <div v-else class="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md h-24 overflow-y-auto whitespace-pre-wrap">{{ question.description || '无描述' }}</div>
                        </div>

                        <div class="mb-3">
                            <label class="block text-sm font-medium text-gray-700 mb-1">编程语言</label>
                            <select v-if="!question.bankId" v-model="question.language"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="JavaScript">JavaScript</option>
                                <option value="Python">Python</option>
                                <option value="Java">Java</option>
                                <option value="C++">C++</option>
                                <option value="C">C</option>
                            </select>
                            <span v-else class="px-1 py-1 text-gray-700">{{ question.language || '未指定' }}</span>
                        </div>

                        <div class="mb-3">
                            <label class="block text-sm font-medium text-gray-700 mb-1">参考答案</label>
                            <textarea v-if="!question.bankId" v-model="question.sampleAnswer"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 font-mono text-sm"
                                placeholder="请输入参考答案代码"></textarea>
                            <pre v-else class="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md h-32 overflow-y-auto font-mono text-sm"><code class="language-plaintext">{{ question.sampleAnswer || '无参考答案' }}</code></pre>
                        </div>

                        <!-- 测试用例 -->
                        <div class="mb-3">
                            <div class="flex justify-between items-center mb-1">
                                <label class="block text-sm font-medium text-gray-700">测试用例</label>
                                <button v-if="!question.bankId" class="text-blue-500 hover:text-blue-700 text-sm flex items-center"
                                    @click="addTestCase(question)">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" class="mr-1">
                                        <line x1="12" y1="5" x2="12" y2="19"></line>
                                        <line x1="5" y1="12" x2="19" y2="12"></line>
                                    </svg>
                                    添加测试用例
                                </button>
                            </div>

                            <div v-if="!question.testCases || question.testCases.length === 0"
                                class="text-center py-4 text-gray-500 border border-dashed border-gray-300 rounded-lg text-sm">
                                请添加测试用例
                            </div>

                            <div v-else class="space-y-3">
                                <div v-for="(test, tIndex) in question.testCases" :key="tIndex"
                                    class="border border-gray-200 rounded-lg p-3">
                                    <div class="flex justify-between items-start mb-2">
                                        <label class="text-sm font-medium text-gray-700">测试用例 {{ tIndex + 1 }}</label>
                                        <button v-if="!question.bankId" class="text-gray-400 hover:text-red-500 focus:outline-none"
                                            @click="removeTestCase(question, tIndex)">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                                stroke-linecap="round" stroke-linejoin="round">
                                                <circle cx="12" cy="12" r="10"></circle>
                                                <line x1="15" y1="9" x2="9" y2="15"></line>
                                                <line x1="9" y1="9" x2="15" y2="15"></line>
                                            </svg>
                                        </button>
                                    </div>

                                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div>
                                            <label class="block text-xs font-medium text-gray-600 mb-1">测试名称</label>
                                            <input v-if="!question.bankId" type="text" v-model="test.name"
                                                class="w-full px-2 py-1 border border-gray-300 rounded-md text-sm focus:ring-1 focus:ring-blue-400"
                                                placeholder="例如：基本情况">
                                            <div v-else class="w-full px-2 py-1 border border-gray-200 bg-gray-100 rounded-md text-sm min-h-[30px]">{{ test.name || 'N/A' }}</div>
                                        </div>
                                        <div>
                                            <label class="block text-xs font-medium text-gray-600 mb-1">输入</label>
                                            <textarea v-if="!question.bankId" v-model="test.input"
                                                class="w-full px-2 py-1 border border-gray-300 rounded-md text-sm h-16 focus:ring-1 focus:ring-blue-400"
                                                placeholder="输入参数，每行一个"></textarea>
                                            <pre v-else class="w-full px-2 py-1 border border-gray-200 bg-gray-100 rounded-md text-sm h-16 overflow-y-auto whitespace-pre-wrap">{{ test.input || 'N/A' }}</pre>
                                        </div>
                                        <div>
                                            <label class="block text-xs font-medium text-gray-600 mb-1">预期输出</label>
                                            <textarea v-if="!question.bankId" v-model="test.expectedOutput"
                                                class="w-full px-2 py-1 border border-gray-300 rounded-md text-sm h-16 focus:ring-1 focus:ring-blue-400"
                                                placeholder="预期输出结果"></textarea>
                                            <pre v-else class="w-full px-2 py-1 border border-gray-200 bg-gray-100 rounded-md text-sm h-16 overflow-y-auto whitespace-pre-wrap">{{ test.expectedOutput || 'N/A' }}</pre>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 解析 -->
                        <div class="ml-6 mt-4">
                            <label class="block text-sm font-medium text-gray-700 mb-1">题目解析</label>
                            <textarea v-if="!question.bankId" v-model="question.explanation"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                                placeholder="请输入题目解析，学生提交后可查看"></textarea>
                            <div v-else class="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md h-24 overflow-y-auto whitespace-pre-wrap">{{ question.explanation || '无解析' }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 底部按钮 -->
        <div class="flex justify-end space-x-3 mb-6">
            <button class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                @click="goBackToCourseManagement">
                取消
            </button>
            <button class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg" @click="saveAsDraft">
                保存草稿
            </button>
            <button class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg" @click="publishTask">
                发布
            </button>
        </div>

        <!-- 预览模态框 -->
        <div v-if="showPreview" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-xl font-bold">预览学习任务</h2>
                        <button class="text-gray-400 hover:text-gray-600 focus:outline-none"
                            @click="showPreview = false">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    <div class="mb-6">
                        <h3 class="text-lg font-bold mb-2">{{ task.title || '未命名任务' }}</h3>
                        <div class="text-sm text-gray-500 mb-2">
                            <span>总分: {{ task.totalPoints || 0 }} 分</span>
                            <span class="mx-2">|</span>
                            <span>{{ task.type === 'choice' ? '选择题' : task.type === 'programming' ? '编程题' : '混合题型'
                                }}</span>
                            <span class="mx-2">|</span>
                            <span>{{ task.timeLimit ? `时间限制: ${task.timeLimit} 分钟` : '无时间限制' }}</span>
                        </div>
                        <div class="text-sm text-gray-500">
                            <span>开始时间: {{ formatDateTime(task.openTime) }}</span>
                            <span class="mx-2">|</span>
                            <span>截止时间: {{ formatDateTime(task.closeTime) }}</span>
                            <span class="mx-2">|</span>
                            <span>{{ task.allowResubmit ? '允许重新提交' : '不允许重新提交' }}</span>
                        </div>
                        <div class="mt-3 p-3 bg-gray-50 rounded-lg text-sm">
                            {{ task.description || '无任务说明' }}
                        </div>
                    </div>

                    <div class="space-y-6">
                        <div v-for="(question, qIndex) in task.questions" :key="qIndex" class="border rounded-lg p-4">
                            <div class="flex items-start mb-4">
                                <span class="font-medium mr-2">{{ qIndex + 1 }}.</span>
                                <div>
                                    <div class="font-medium">{{ question.text || '未命名题目' }}</div>
                                    <div class="text-sm text-gray-500 mt-1">{{ question.points || 0 }} 分</div>
                                </div>
                            </div>

                            <!-- 选择题选项 -->
                            <div v-if="question.type === 'choice'" class="ml-6 space-y-2 mt-4">
                                <div v-for="(option, oIndex) in question.options" :key="oIndex"
                                    class="flex items-center p-3 rounded-lg border border-gray-200">
                                    <div
                                        class="w-6 h-6 rounded-full flex items-center justify-center border mr-2 border-gray-300">
                                        {{ ['A', 'B', 'C', 'D'][oIndex] }}
                                    </div>
                                    <div>{{ option || `选项 ${['A', 'B', 'C', 'D'][oIndex]}` }}</div>
                                </div>
                            </div>

                            <!-- 编程题详情 -->
                            <div v-if="question.type === 'programming'" class="ml-6 mt-4">
                                <div class="mb-4 text-sm text-gray-600">{{ question.description || '无题目描述' }}</div>

                                <!-- 代码编辑器 -->
                                <div class="border rounded-lg overflow-hidden">
                                    <div class="bg-gray-100 px-4 py-2 border-b flex justify-between items-center">
                                        <span>{{ question.language || 'JavaScript' }}</span>
                                        <div class="text-sm text-gray-500">请在此编写代码</div>
                                    </div>
                                    <div class="p-4 font-mono text-sm bg-gray-50 h-32">
                                        // 学生将在此编写代码
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="mt-6 flex justify-end">
                        <button class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                            @click="showPreview = false">
                            关闭预览
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Add Choice Question Modal -->
        <el-dialog
          v-model="showAddChoiceModal"
          title="添加选择题"
          width="60%"
          :before-close="() => showAddChoiceModal = false"
          destroy-on-close
          center
          append-to-body
          class="add-choice-question-dialog"
        >
          <el-form :model="newChoiceData" label-width="100px" ref="addChoiceFormRef" style="padding: 0 20px;">
            <el-form-item label="题目描述" prop="title" :rules="[{ required: true, message: '请输入题目描述', trigger: 'blur' }]">
              <el-input v-model="newChoiceData.title" type="textarea" :rows="3" placeholder="请输入题目描述"></el-input>
            </el-form-item>

            <el-form-item label="选项设置">
              <div v-for="(choice, index) in newChoiceData.choices" :key="index" class="choice-item" style="display: flex; align-items: center; margin-bottom: 15px;">
                <el-form-item
                    :label="'选项 ' + (index + 1)"
                    :prop="'choices.' + index"
                    :rules="[{ required: true, message: '选项内容不能为空', trigger: 'blur' }]"
                    label-width="70px"
                    class="choice-input-item"
                    style="flex-grow: 1; margin-bottom: 0; margin-right: 8px;"
                >
                    <el-input v-model="newChoiceData.choices[index]" :placeholder="'请输入选项 ' + (index + 1) + ' 内容'"></el-input>
                </el-form-item>
                <el-button @click.prevent="removeChoiceInput(index)" type="danger" plain :icon="Delete" :disabled="newChoiceData.choices.length <= 2" circle />
              </div>
              <el-button @click="addChoiceInput" type="primary" plain :icon="Plus" :disabled="newChoiceData.choices.length >= 10">
                 添加选项
              </el-button>
              <span v-if="newChoiceData.choices.length >= 10" class="text-xs text-gray-500 ml-2">最多添加10个选项</span>
            </el-form-item>

            <el-form-item label="正确答案" prop="correctAnswerText" :rules="[{ required: true, message: '请选择正确答案', trigger: 'change' }]">
                <el-select v-model="newChoiceData.correctAnswerText" placeholder="请选择正确答案" style="width: 100%;">
                    <el-option
                        v-for="(choiceText, index) in newChoiceData.choices.filter(c => c.trim() !== '')"
                        :key="index"
                        :label="'选项 ' + (newChoiceData.choices.indexOf(choiceText) + 1) + ': ' + choiceText"
                        :value="choiceText"
                    ></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="分值" prop="score" :rules="[{ required: true, message: '请输入分值', trigger: 'blur' }, { type: 'number', min: 0, message: '分值必须为不小于0的数字', trigger: 'blur' }]">
              <el-input-number v-model="newChoiceData.score" :min="0" :step="1" placeholder="请输入分值"></el-input-number>
            </el-form-item>
          </el-form>

          <template #footer>
            <span class="dialog-footer">
              <el-button @click="showAddChoiceModal = false">取消</el-button>
              <el-button type="primary" @click="handleAddChoiceQuestion" :loading="isSubmittingChoiceQuestion">
                {{ isSubmittingChoiceQuestion ? '提交中...' : '确认添加' }}
              </el-button>
            </span>
          </template>
        </el-dialog>
        <!-- End of Add Choice Question Modal -->

        <!-- Add Short Answer Question Modal -->
        <el-dialog
          v-model="showAddShortAnswerModal"
          title="添加简答题"
          width="50%"
          :before-close="() => showAddShortAnswerModal = false"
          destroy-on-close
          center
          append-to-body
          class="add-short-answer-question-dialog"
        >
          <el-form :model="newShortAnswerData" label-width="100px" ref="addShortAnswerFormRef" style="padding: 0 20px;">
            <el-form-item label="题目描述" prop="title" :rules="[{ required: true, message: '请输入题目描述', trigger: 'blur' }]">
              <el-input v-model="newShortAnswerData.title" type="textarea" :rows="3" placeholder="请输入题目描述"></el-input>
            </el-form-item>
            <el-form-item label="分值" prop="score" :rules="[{ required: true, message: '请输入分值', trigger: 'blur' }, { type: 'number', min: 0, message: '分值必须为不小于0的数字', trigger: 'blur' }]">
              <el-input-number v-model="newShortAnswerData.score" :min="0" :step="1" placeholder="请输入分值"></el-input-number>
            </el-form-item>
            <el-form-item label="正确答案" prop="correctAnswer">
                <el-input v-model="newShortAnswerData.correctAnswer" type="textarea" :rows="3" placeholder="请输入正确答案"></el-input>
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="showAddShortAnswerModal = false">取消</el-button>
              <el-button type="primary" @click="handleAddShortAnswerQuestion" :loading="isSubmittingShortAnswer">
                {{ isSubmittingShortAnswer ? '提交中...' : '确认添加' }}
              </el-button>
            </span>
          </template>
        </el-dialog>
        <!-- End of Add Short Answer Question Modal -->

        <!-- Add Coding Question Modal -->
        <el-dialog
          v-model="showAddCodingModal"
          title="添加编程题"
          width="50%"
          :before-close="() => showAddCodingModal = false"
          destroy-on-close
          center
          append-to-body
          class="add-coding-question-dialog"
        >
          <el-form :model="newCodingData" label-width="100px" ref="addCodingFormRef" style="padding: 0 20px;">
            <el-form-item label="题目描述" prop="title" :rules="[{ required: true, message: '请输入题目描述', trigger: 'blur' }]">
              <el-input v-model="newCodingData.title" type="textarea" :rows="3" placeholder="请输入题目描述"></el-input>
            </el-form-item>
            <el-form-item label="分值" prop="score" :rules="[{ required: true, message: '请输入分值', trigger: 'blur' }, { type: 'number', min: 0, message: '分值必须为不小于0的数字', trigger: 'blur' }]">
              <el-input-number v-model="newCodingData.score" :min="0" :step="1" placeholder="请输入分值"></el-input-number>
            </el-form-item>
            <el-form-item label="正确答案" prop="correctAnswer">
                <el-input v-model="newCodingData.correctAnswer" type="textarea" :rows="3" placeholder="请输入参考答案或解题代码"></el-input>
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="showAddCodingModal = false">取消</el-button>
              <el-button type="primary" @click="handleAddCodingQuestion" :loading="isSubmittingCoding">
                {{ isSubmittingCoding ? '提交中...' : '确认添加' }}
              </el-button>
            </span>
          </template>
        </el-dialog>
        <!-- End of Add Coding Question Modal -->

        <!-- 题库模态框 -->
        <div v-if="showQuestionBank" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                <div class="p-6 border-b">
                    <div class="flex justify-between items-center">
                        <h2 class="text-xl font-bold">题库</h2>
                        <button class="text-gray-400 hover:text-gray-600 focus:outline-none"
                            @click="showQuestionBank = false">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="p-6 border-b">
                    <div class="flex flex-wrap gap-4">
                        <div class="w-full md:w-64">
                            <label class="block text-sm font-medium text-gray-700 mb-1">题目类型</label>
                            <select v-model="questionBankFilter.type"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">全部类型</option>
                                <option value="choice">选择题</option>
                                <option value="programming">编程题</option>
                            </select>
                        </div>

                        <div class="w-full md:w-64">
                            <label class="block text-sm font-medium text-gray-700 mb-1">难度</label>
                            <select v-model="questionBankFilter.difficulty"
                                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="">全部难度</option>
                                <option value="easy">简单</option>
                                <option value="medium">中等</option>
                                <option value="hard">困难</option>
                            </select>
                        </div>

                        <div class="w-full md:flex-1">
                            <label class="block text-sm font-medium text-gray-700 mb-1">关键词搜索</label>
                            <div class="relative">
                                <input v-model="questionBankFilter.keyword" type="text"
                                    class="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="搜索题目..." />
                                <div class="absolute left-3 top-2.5 text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round">
                                        <circle cx="11" cy="11" r="8"></circle>
                                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="flex-1 overflow-y-auto p-6">
                    <div v-if="loadingQuestionBank" class="flex justify-center py-8">
                        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900"></div>
                    </div>

                    <div v-else-if="filteredQuestionBank.length === 0" class="text-center py-8 text-gray-500">
                        没有找到符合条件的题目
                    </div>

                    <div v-else class="space-y-4">
                        <div v-for="(question, index) in filteredQuestionBank" :key="index"
                            class="border rounded-lg p-4 hover:bg-gray-50" :class="{
                                'border-blue-200': question.type === 'choice',
                                'border-green-200': question.type === 'programming',
                                'bg-blue-50': selectedQuestions.includes(question.id) && question.type === 'choice',
                                'bg-green-50': selectedQuestions.includes(question.id) && question.type === 'programming'
                            }">
                            <div class="flex justify-between items-start">
                                <div class="flex items-start flex-1">
                                    <div class="flex items-center h-5 mt-0.5">
                                        <input type="checkbox" :id="'question-' + question.id"
                                            :checked="selectedQuestions.includes(question.id)"
                                            @change="toggleQuestionSelection(question.id)"
                                            class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                                    </div>
                                    <div class="ml-3 flex-1">
                                        <label :for="'question-' + question.id"
                                            class="font-medium text-gray-700 cursor-pointer hover:text-blue-600"
                                            @click.stop="previewBankQuestion(question)">
                                            {{ question.title || '无标题' }} <!-- 使用 question.title 显示标题 -->
                                        </label>
                                        <div class="flex items-center mt-1 text-xs">
                                            <span class="px-1.5 py-0.5 rounded-full mr-2" :class="{
                                                'bg-blue-100 text-blue-700': question.type === 'choice',
                                                'bg-green-100 text-green-700': question.type === 'programming',
                                                'bg-yellow-100 text-yellow-700': question.type === 'short_answer',
                                                'bg-gray-100 text-gray-700': !['choice', 'programming', 'short_answer'].includes(question.type)
                                            }">
                                                {{ question.type === 'choice' ? '选择' : (question.type === 'programming' ? '编程' : (question.type === 'short_answer' ? '简答' : (question.type || '未知'))) }}
                                            </span>
                                            <span class="px-1.5 py-0.5 rounded-full mr-2" :class="{
                                                'bg-green-100 text-green-700': question.difficulty === 'easy',
                                                'bg-yellow-100 text-yellow-700': question.difficulty === 'medium',
                                                'bg-red-100 text-red-700': question.difficulty === 'hard',
                                                'bg-gray-100 text-gray-700': !question.difficulty
                                            }">
                                                {{
                                                    question.difficulty === 'easy' ? '简单' :
                                                    question.difficulty === 'medium' ? '中等' :
                                                    question.difficulty === 'hard' ? '困难' : '未设'
                                                }}
                                            </span>
                                            <span class="px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-700">
                                                分值: {{ typeof question.score === 'number' ? question.score : '未设' }} <!-- 使用 question.score 显示分值 -->
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <button class="text-blue-500 hover:text-blue-700 text-sm ml-2"
                                    @click="previewBankQuestion(question)">
                                    预览
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="p-6 border-t bg-gray-50">
                    <div class="flex justify-between items-center">
                        <div class="text-sm text-gray-600">
                            已选择 {{ selectedQuestions.length }} 道题目
                        </div>
                        <div class="flex space-x-3">
                            <button class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                                @click="showQuestionBank = false">
                                取消
                            </button>
                            <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                                @click="importSelectedQuestions" :disabled="selectedQuestions.length === 0"
                                :class="{ 'opacity-50 cursor-not-allowed': selectedQuestions.length === 0 }">
                                导入所选题目
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- 题库题目预览模态框 -->
        <div v-if="showQuestionPreview"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-xl font-bold">题目预览</h2>
                        <button class="text-gray-400 hover:text-gray-600 focus:outline-none"
                            @click="showQuestionPreview = false">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    <div v-if="previewQuestion">
                        <div class="flex items-center mb-4">
                            <span class="px-2 py-0.5 text-xs rounded-full mr-2" :class="{
                                'bg-blue-200 text-blue-800': previewQuestion.type === 'choice',
                                'bg-green-200 text-green-800': previewQuestion.type === 'programming'
                            }">
                                {{ previewQuestion.type === 'choice' ? '选择题' : '编程题' }}
                            </span>
                            <span class="px-2 py-0.5 text-xs rounded-full mr-2" :class="{
                                'bg-green-200 text-green-800': previewQuestion.difficulty === 'easy',
                                'bg-yellow-200 text-yellow-800': previewQuestion.difficulty === 'medium',
                                'bg-red-200 text-red-800': previewQuestion.difficulty === 'hard'
                            }">
                                {{
                                    previewQuestion.difficulty === 'easy' ? '简单' :
                                        previewQuestion.difficulty === 'medium' ? '中等' : '困难'
                                }}
                            </span>
                            <span class="text-sm text-gray-500">{{ previewQuestion.points }} 分</span>
                        </div>

                        <div class="font-medium mb-4">{{ previewQuestion.text }}</div>

                        <!-- 选择题选项 -->
                        <div v-if="previewQuestion.type === 'choice'" class="space-y-2 mb-6">
                            <div v-for="(option, oIndex) in previewQuestion.options" :key="oIndex"
                                class="flex items-center p-3 rounded-lg"
                                :class="{ 'bg-green-50 border border-green-200': previewQuestion.correctAnswer === oIndex, 'border border-gray-200': previewQuestion.correctAnswer !== oIndex }">
                                <div class="w-6 h-6 rounded-full flex items-center justify-center border mr-2"
                                    :class="{ 'bg-green-500 border-green-500 text-white': previewQuestion.correctAnswer === oIndex, 'border-gray-300': previewQuestion.correctAnswer !== oIndex }">
                                    {{ ['A', 'B', 'C', 'D'][oIndex] }}
                                </div>
                                <div>{{ option }}</div>
                            </div>
                        </div>

                        <!-- 编程题详情 -->
                        <div v-if="previewQuestion.type === 'programming'" class="mb-6">
                            <div class="mb-4 text-sm text-gray-600">{{ previewQuestion.description }}</div>

                            <!-- 代码示例 -->
                            <div class="border rounded-lg overflow-hidden mb-4">
                                <div class="bg-gray-100 px-4 py-2 border-b">
                                    <span>{{ previewQuestion.language }}</span>
                                </div>
                                <pre
                                    class="p-4 font-mono text-sm overflow-x-auto bg-gray-50">{{ previewQuestion.sampleAnswer }}</pre>
                            </div>

                            <!-- 测试用例 -->
                            <div v-if="previewQuestion.testCases && previewQuestion.testCases.length > 0">
                                <div class="text-sm font-medium text-gray-700 mb-2">测试用例:</div>
                                <div class="space-y-2">
                                    <div v-for="(test, tIndex) in previewQuestion.testCases" :key="tIndex"
                                        class="border border-gray-200 rounded-lg p-3 text-sm">
                                        <div class="font-medium mb-1">{{ test.name }}</div>
                                        <div><span class="text-gray-600">输入:</span> {{ test.input }}</div>
                                        <div><span class="text-gray-600">期望输出:</span> {{ test.expectedOutput }}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- 解析 -->
                        <div class="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                            <div class="text-sm font-medium text-gray-700 mb-1">解析:</div>
                            <div class="text-sm text-gray-600">{{ previewQuestion.explanation }}</div>
                        </div>
                    </div>

                    <div class="mt-6 flex justify-end space-x-3">
                        <button class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"
                            @click="showQuestionPreview = false">
                            关闭
                        </button>
                        <button v-if="previewQuestion && !selectedQuestions.includes(previewQuestion.id)"
                            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                            @click="addToSelected(previewQuestion.id)">
                            添加到所选
                        </button>
                        <button v-else-if="previewQuestion"
                            class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                            @click="removeFromSelected(previewQuestion.id)">
                            从所选中移除
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
import { useCourseStore } from '@/stores/course';
import { createAssignment, getQuestionBank } from '@/api/assignment';
import { getCourseClasses } from '@/api/course';
import { createQuestionInBank } from '@/api/assignment';
// 只声明一次
const router = useRouter(); // 确保 router 实例已创建
const courseStore = useCourseStore();
const classes = ref([]);
const selectedClass = ref(null);

// 获取当前课程的班级列表
const fetchClasses = async () => {
    const courseId = courseStore.currentCourseId;
    if (courseId) {
        try {
            const response = await getCourseClasses(courseId);
            // 正常处理 resolved promise
            if (response && response.data && Array.isArray(response.data.data)) {
                classes.value = response.data.data.map(cls => ({
                    id: cls.id, 
                    name: cls.name 
                }));
                if (classes.value.length === 0) {
                    console.warn(`课程 ${courseId} 下没有班级。`);
                } else {
                    // 默认选中第一个班级 (如果存在)
                    task.classId = classes.value[0].id;
                }
            } else {
                // 如果 promise resolve 了，但响应结构不符合预期
                const errorMsg = '获取班级失败：响应数据格式不正确';
                console.error(errorMsg, response);
                showMessage(errorMsg);
                classes.value = [];
            }
        } catch (e) {
            // 处理 rejected promise
            console.warn('Entering catch block for getCourseClasses in fetchClasses. Error object:', e);
            // 尝试更鲁棒地判断是否为“成功响应被当作错误拒绝”
            if (e && e.status === 200 && e.data && e.data.code === 200) {
                // 强烈怀疑这是“成功响应被当作错误拒绝”的情况
                // 从“错误”对象中提取数据，确保 classes.value 是数组
                const rawClasses = (e.data.data && Array.isArray(e.data.data)) ? e.data.data : [];
                classes.value = rawClasses.map(cls => ({
                    id: cls.id,
                    name: cls.name
                }));
                
                console.warn(`已从被拒绝的Promise中提取班级列表 (可能为空)。Course ID: ${courseId}, Raw e.data.data:`, e.data.data);
                if (classes.value.length === 0) {
                    console.warn(`课程 ${courseId} 下没有班级 (通过被拒绝的promise捕获)。`);
                } else if (!task.classId && classes.value.length > 0) {
                    // 如果之前没有选中班级，且现在有了班级列表，则默认选中第一个
                    task.classId = classes.value[0].id;
                }
                // 在这种特定情况下，不应显示错误消息给用户
            } else {
                // 这看起来是真正的API错误或未预期的拒绝结构
                const errorMsg = 'Failed to fetch classes or data format is incorrect';
                console.error(errorMsg, e); 
                showMessage(errorMsg); 
                classes.value = []; 
            }
        }
    } else {
        const errorMsg = '无法加载班级：课程ID无效';
        console.error(errorMsg);
        showMessage(errorMsg);
        classes.value = [];
    }
};

onMounted(() => {
    fetchClasses();
    // 如果需要，在这里加载草稿或执行其他初始化操作
    // 例如：loadDraftIfAny(); 
});




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

// 任务数据
const task = reactive({
    title: '',
    type: 'choice',
    totalPoints: 100,
    openTime: '',
    closeTime: '',
    timeLimit: null,
    allowResubmit: true,
    description: '',
    status: 'draft', // draft, published
    questions: [],
    classId: null,
    courseId: courseStore.currentCourseId
});

// 预览模态框状态
const showPreview = ref(false);

// 题库模态框状态
const showQuestionBank = ref(false);
const loadingQuestionBank = ref(false);
const questionBankFilter = reactive({
    type: '',
    difficulty: '',
    keyword: ''
});
const selectedQuestions = ref([]);

// 题库题目预览模态框状态
const showQuestionPreview = ref(false);
const previewQuestion = ref(null);

// 添加选择题弹窗相关数据和状态
const newChoiceData = reactive({
  title: '',
  choices: ['', ''], 
  correctAnswerText: '',
  score: 0, 
});
const showAddChoiceModal = ref(false); // 控制添加选择题弹窗的显示
const isSubmittingChoiceQuestion = ref(false); // 控制添加选择题时的提交状态，例如按钮loading
const addChoiceFormRef = ref(null);

// For Add Short Answer Question Modal
const showAddShortAnswerModal = ref(false);
const addShortAnswerFormRef = ref(null);
const isSubmittingShortAnswer = ref(false);
const newShortAnswerData = reactive({
  title: '',
  score: 0,
  correctAnswer: '',
});

// For Add Coding Question Modal
const showAddCodingModal = ref(false);
const addCodingFormRef = ref(null);
const isSubmittingCoding = ref(false);
const newCodingData = reactive({
  title: '',
  score: 0,
  correctAnswer: '',
}); // 控制添加选择题时的提交状态，例如按钮loading

// 题库数据
const questionBank = ref([]);
const bankError = ref(null); // For storing errors when fetching from question bank




// 过滤后的题库
const filteredQuestionBank = computed(() => {
    const bank = questionBank.value;
    if (!Array.isArray(bank)) {
        return []; // Ensure we always return an array
    }
    try {
        return bank.filter(q => {
            if (!q || typeof q !== 'object') { // Ensure q is a non-null object
                console.warn('[TeacherCreateTask] filteredQuestionBank: Filtering out invalid item from questionBank:', q);
                return false;
            }
        // 类型过滤
        if (questionBankFilter.type && q.type !== questionBankFilter.type) {
            return false;
        }

        // 难度过滤
        if (questionBankFilter.difficulty && q.difficulty !== questionBankFilter.difficulty) {
            return false;
        }

        // 关键词搜索
        if (questionBankFilter.keyword) {
            const keyword = questionBankFilter.keyword.toLowerCase();
            const titleMatch = q.title && typeof q.title === 'string' && q.title.toLowerCase().includes(keyword);
            const descriptionMatch = q.description && typeof q.description === 'string' && q.description.toLowerCase().includes(keyword);
            // Assuming bank questions might not have 'explanation', or it might not always be a string
            // const explanationMatch = q.explanation && typeof q.explanation === 'string' && q.explanation.toLowerCase().includes(keyword);
            return titleMatch || descriptionMatch; // Adjust if explanation is also a primary search target
        }

        return true;
        });
    } catch (error) {
        console.error('[TeacherCreateTask] Error during filteredQuestionBank computation:', error);
        return []; // Fallback to empty array on any internal error
    }
});

// UUID generator (simple version for demonstration)
const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// 添加题目
const addQuestion = (type) => {
    if (type === 'choice') {
        task.questions.push({
            type: 'choice',
            text: '',
            points: 10,
            options: ['', ''],
            correctAnswer: 0,
            explanation: ''
        });
    } else if (type === 'programming') {
        task.questions.push({
            type: 'programming',
            text: '',
            points: 20,
            description: '',
            language: 'JavaScript',
            sampleAnswer: '',
            testCases: [],
            explanation: ''
        });
    }
};

// 移除题目
const removeQuestion = (index) => {
    if (confirm('确定要删除这道题目吗？')) {
        task.questions.splice(index, 1);
    }
};

// 添加选项
const addOption = (question) => {
    if (question.options.length < 4) {
        question.options.push('');
    }
};

// 移除选项
const removeOption = (question, index) => {
    if (question.options.length > 2) {
        question.options.splice(index, 1);

        // 如果删除的是正确答案，则重置正确答案
        if (question.correctAnswer === index) {
            question.correctAnswer = 0;
        } else if (question.correctAnswer > index) {
            question.correctAnswer--;
        }
    }
};

// 设置正确答案
const setCorrectAnswer = (question, index) => {
    question.correctAnswer = index;
};

// 添加测试用例
const addTestCase = (question) => {
    if (!question.testCases) {
        question.testCases = [];
    }

    question.testCases.push({
        name: '',
        input: '',
        expectedOutput: ''
    });
};

// 移除测试用例
const removeTestCase = (question, index) => {
    question.testCases.splice(index, 1);
};


// --- Add Choice Question Modal Logic ---
const openAddChoiceModal = () => {
    resetNewChoiceData();
    showAddChoiceModal.value = true;
};

const openAddShortAnswerModal = () => {
  resetNewShortAnswerData();
  showAddShortAnswerModal.value = true;
};

const openAddCodingModal = () => {
  resetNewCodingData();
  showAddCodingModal.value = true;
};

const resetNewChoiceData = () => {
    newChoiceData.title = '';
    newChoiceData.choices = ['', '']; // Reset to two empty choices
    newChoiceData.correctAnswerText = '';
    newChoiceData.score = 0;
    if (addChoiceFormRef.value) {
        addChoiceFormRef.value.resetFields();
    }
};

const resetNewShortAnswerData = () => {
  newShortAnswerData.title = '';
  newShortAnswerData.score = 0;
  newShortAnswerData.correctAnswer = '';
  if (addShortAnswerFormRef.value) {
    addShortAnswerFormRef.value.clearValidate();
  }
};

const resetNewCodingData = () => {
  newCodingData.title = '';
  newCodingData.score = 0;
  newCodingData.correctAnswer = '';
  if (addCodingFormRef.value) {
    addCodingFormRef.value.clearValidate();
  }
};

const addChoiceInput = () => {
    if (newChoiceData.choices.length < 10) { // Limit max options, e.g., 10
        newChoiceData.choices.push('');
    } else {
        showMessage('最多添加10个选项。', 'warning');
    }
};

const removeChoiceInput = (index) => {
    if (newChoiceData.choices.length > 2) {
        const removedChoiceText = newChoiceData.choices[index];
        newChoiceData.choices.splice(index, 1);
        // If the removed choice was the selected correct answer, reset correctAnswerText
        if (newChoiceData.correctAnswerText === removedChoiceText) {
            newChoiceData.correctAnswerText = '';
        }
    } else {
        showMessage('至少需要2个选项。', 'warning');
    }
};

const handleAddChoiceQuestion = async () => {
    // Validation (existing logic)
    if (!newChoiceData.title.trim()) {
        showMessage('题目标题不能为空。', 'error');
        return;
    }
    if (newChoiceData.choices.some(c => !c.trim())) {
        showMessage('选项内容不能为空。', 'error');
        return;
    }
    // Ensure at least 2 choices
    if (newChoiceData.choices.filter(c => c.trim()).length < 2) {
        showMessage('至少需要2个有效选项。', 'error');
        return;
    }
    // Check for duplicates only among non-empty trimmed choices
    const trimmedChoices = newChoiceData.choices.map(c => c.trim()).filter(c => c);
    if (new Set(trimmedChoices).size !== trimmedChoices.length) {
        showMessage('有效选项内容不能重复。', 'error');
        return;
    }
    if (!newChoiceData.correctAnswerText) {
        showMessage('请选择一个正确答案。', 'error');
        return;
    }
    const trimmedCorrectAnswerText = newChoiceData.correctAnswerText.trim();
    if (!newChoiceData.choices.map(c => c.trim()).includes(trimmedCorrectAnswerText)) {
        showMessage('选择的正确答案必须是有效选项之一。', 'error');
        newChoiceData.correctAnswerText = ''; 
        return;
    }
    if (newChoiceData.score === null || newChoiceData.score === undefined || newChoiceData.score < 0) {
        showMessage('分值必须大于等于0。', 'error');
        return;
    }

    isSubmittingChoiceQuestion.value = true;
    try {
        const payload = {
            title: newChoiceData.title.trim(),
            type: 'choice',
            choices: newChoiceData.choices.map(c => c.trim()).filter(c => c), // Send only non-empty trimmed choices
            correctAnswer: trimmedCorrectAnswerText,
            score: Number(newChoiceData.score),
            courseId: task.courseId, // Ensure question is associated with the current course in the bank
        };

        const newQuestion = await createQuestionInBank(payload); // API Call

        if (newQuestion && newQuestion.id) {
            ElNotification({
              title: '成功',
              message: '选择题已成功添加到题库！',
              type: 'success',
            });
            showAddChoiceModal.value = false;
            // resetNewChoiceData(); // destroy-on-close in el-dialog should handle this as openAddChoiceModal calls reset
            // Optionally, if you need to refresh a list of questions from bank, do it here.
        } else {
            // This case might not be reached if API throws error for non-success
            showMessage('添加题目失败，未收到有效响应。', 'error');
        }
    } catch (error) {
        console.error('Error adding choice question to bank:', error);
        showMessage(error.message || '添加题目到题库失败，请重试。', 'error');
    } finally {
        isSubmittingChoiceQuestion.value = false;
    }
};

const handleAddShortAnswerQuestion = async () => {
  if (!addShortAnswerFormRef.value) return;
  try {
    await addShortAnswerFormRef.value.validate();
    isSubmittingShortAnswer.value = true;
    const payload = {
      title: newShortAnswerData.title.trim(),
      type: 'short_answer',
      choices: [],
      correctAnswer: newShortAnswerData.correctAnswer.trim(),
      score: Number(newShortAnswerData.score),
      courseId: task.courseId,
    };
    await createQuestionInBank(payload);
    ElNotification({
      title: '成功',
      message: '简答题已成功添加到题库！',
      type: 'success',
    });
    showAddShortAnswerModal.value = false;
  } catch (error) {
    if (error === false) return; // Validation failed
    console.error('Failed to add short answer question to bank:', error);
    ElMessage.error(error.message || '添加到题库失败，请重试。');
  } finally {
    isSubmittingShortAnswer.value = false;
  }
};

const handleAddCodingQuestion = async () => {
  if (!addCodingFormRef.value) return;
  try {
    await addCodingFormRef.value.validate();
    isSubmittingCoding.value = true;
    const payload = {
      title: newCodingData.title.trim(),
      type: 'coding',
      choices: [],
      correctAnswer: newCodingData.correctAnswer.trim(),
      score: Number(newCodingData.score),
      courseId: task.courseId,
    };
    await createQuestionInBank(payload);
    ElNotification({
      title: '成功',
      message: '编程题已成功添加到题库！',
      type: 'success',
    });
    showAddCodingModal.value = false;
  } catch (error) {
    if (error === false) return; // Validation failed
    console.error('Failed to add coding question to bank:', error);
    ElMessage.error(error.message || '添加到题库失败，请重试。');
  } finally {
    isSubmittingCoding.value = false;
  }
};
// --- End Add Choice Question Modal Logic ---

// 格式化日期时间
const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return '未设置';
    const date = new Date(dateTimeStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

// 打开题库，自动加载题库数据
const openQuestionBank = async () => {
    bankError.value = null; // Clear previous errors
    showQuestionBank.value = true;
    loadingQuestionBank.value = true;
    try {
        // 可根据需要传递 courseId 过滤题库
        const data = await getQuestionBank({ courseId: task.courseId });
        if (Array.isArray(data)) {
            questionBank.value = data.filter(item => item != null); // Filter out null or undefined items
        } else {
            questionBank.value = [];
        }
    } catch (e) {
        showMessage(e.message || '获取题库失败');
        questionBank.value = [];
        bankError.value = e.message || '获取题库失败'; // Set error message
    } finally {
        loadingQuestionBank.value = false;
    }
};

// 切换题目选择状态
const toggleQuestionSelection = (questionId) => {
    const index = selectedQuestions.value.indexOf(questionId);
    if (index === -1) {
        selectedQuestions.value.push(questionId);
    } else {
        selectedQuestions.value.splice(index, 1);
    }
};

// 添加到所选
const addToSelected = (questionId) => {
    if (!selectedQuestions.value.includes(questionId)) {
        selectedQuestions.value.push(questionId);
    }
};

// 从所选中移除
const removeFromSelected = (questionId) => {
    const index = selectedQuestions.value.indexOf(questionId);
    if (index !== -1) {
        selectedQuestions.value.splice(index, 1);
    }
};

// 预览题库题目
const previewBankQuestion = (question) => {
    previewQuestion.value = question;
    showQuestionPreview.value = true;
};

// 从题库添加单个题目到当前作业
const addQuestionFromBank = (bankQuestion) => {
    // Basic validation of bankQuestion structure
    if (!bankQuestion || typeof bankQuestion.id === 'undefined' || typeof bankQuestion.title === 'undefined' || typeof bankQuestion.type === 'undefined') {
        console.error('[TeacherCreateTask] addQuestionFromBank: Received invalid or incomplete bankQuestion object:', bankQuestion);
        showMessage('无法添加题目：题目数据不完整。');
        return;
    }
  // Check for duplicates based on bankId
  const isDuplicate = task.questions.some(q => q.bankId === bankQuestion.id);
  if (isDuplicate) {
    showMessage(`题目 "${bankQuestion.title}" 已经添加过了。`);
    return;
  }

    const newQuestion = {
        id: uuidv4(), // Local unique ID
        bankId: bankQuestion.id, // From API: id
        text: bankQuestion.title || '', // From API: title. Ensure it's at least an empty string.
        type: bankQuestion.type,       // From API: type
        points: (Number(bankQuestion.score) || 0), // From API: score, converted to number (0 if NaN/undefined/null)
        options: [], // Will be populated for choice questions
        answer: null, // Initialize answer, will be set based on type
        description: bankQuestion.description || '', // General description, if available
        // Initialize programming specific fields, will be populated if type is PROGRAMMING
        language: undefined,
        initialCode: undefined,
        solution: undefined,
        testCases: undefined,
        sampleAnswer: undefined,
    };

    if (bankQuestion.title === null || typeof bankQuestion.title === 'undefined') {
        console.warn(`[TeacherCreateTask] Bank question (ID: ${bankQuestion.id}) is missing a title. Displayed text will be empty.`);
    }
    if (typeof bankQuestion.score !== 'number') {
        console.warn(`[TeacherCreateTask] Bank question (ID: ${bankQuestion.id}) has a non-numeric or missing score. Defaulting to 0. Score was:`, bankQuestion.score);
    }

    // Map type-specific fields based on the actual API type strings: 'choice', 'short_answer', 'code'
    if (bankQuestion.type === 'choice') {
        newQuestion.answer = ''; // Initialize for single choice text match, will store the local option ID

        if (Array.isArray(bankQuestion.choices) && bankQuestion.choices.length > 0) {
            newQuestion.options = bankQuestion.choices.map((choiceText) => {
                if (typeof choiceText !== 'string') {
                    console.warn(`[TeacherCreateTask] 'choice' question (Bank ID: ${bankQuestion.id}, Title: "${bankQuestion.title}") has a non-string choice. Original choice data:`, choiceText);
                }
                return {
                    id: uuidv4(), // Local unique ID for option
                    text: String(choiceText || ''), // Ensure text is a string
                };
            });

            const correctAnswerFromBank = bankQuestion.correctAnswer;
            if (correctAnswerFromBank !== null && typeof correctAnswerFromBank !== 'undefined') {
                if (typeof correctAnswerFromBank === 'string') {
                    const correctOption = newQuestion.options.find(opt => opt.text === correctAnswerFromBank);
                    if (correctOption) {
                        newQuestion.answer = correctOption.id;
                    } else {
                        console.warn(`[TeacherCreateTask] 'choice' question (Bank ID: ${bankQuestion.id}, Title: "${bankQuestion.title}"): Correct answer text "${correctAnswerFromBank}" from bank does not match any option text. Options: [${newQuestion.options.map(o => `"${o.text}"`).join(', ')}].`);
                        // newQuestion.answer remains as initialized (empty string)
                    }
                } else {
                    console.warn(`[TeacherCreateTask] 'choice' question (Bank ID: ${bankQuestion.id}, Title: "${bankQuestion.title}"): Expected 'correctAnswer' for 'choice' type to be a string, but got ${typeof correctAnswerFromBank}:`, correctAnswerFromBank);
                }
            } else {
                console.warn(`[TeacherCreateTask] 'choice' question (Bank ID: ${bankQuestion.id}, Title: "${bankQuestion.title}") is missing 'correctAnswer' from bank.`);
            }
        } else {
            console.warn(`[TeacherCreateTask] 'choice' question (Bank ID: ${bankQuestion.id}, Title: "${bankQuestion.title}") has missing, empty, or non-array 'choices'. Actual 'choices':`, bankQuestion.choices);
            newQuestion.options = []; // Ensure options are empty if bank data is invalid
        }
    } else if (bankQuestion.type === 'code') {
        newQuestion.language = bankQuestion.language || 'JavaScript';
        newQuestion.initialCode = bankQuestion.initialCode || '';
        newQuestion.solution = bankQuestion.solution || '';
        // For 'code' type, correctAnswer from bank might be a sample textual answer or part of solution description
        newQuestion.sampleAnswer = bankQuestion.sampleAnswer || bankQuestion.correctAnswer || ''; 
        
        if (Array.isArray(bankQuestion.testCases)) {
            try {
                newQuestion.testCases = JSON.parse(JSON.stringify(bankQuestion.testCases));
            } catch (e) {
                console.error(`[TeacherCreateTask] 'code' question (Bank ID: ${bankQuestion.id}, Title: "${bankQuestion.title}"): Failed to parse/stringify testCases. Error:`, e, `Original testCases:`, bankQuestion.testCases);
                newQuestion.testCases = [];
            }
        } else {
            if (bankQuestion.testCases !== null && typeof bankQuestion.testCases !== 'undefined') {
                 console.warn(`[TeacherCreateTask] 'code' question (Bank ID: ${bankQuestion.id}, Title: "${bankQuestion.title}"): 'testCases' from bank is not an array. Actual 'testCases':`, bankQuestion.testCases);
            }
            newQuestion.testCases = []; // Default to empty array if not a valid array
        }
    } else if (bankQuestion.type === 'short_answer') {
        newQuestion.options = []; // No options for short answer
        if (bankQuestion.correctAnswer !== null && typeof bankQuestion.correctAnswer !== 'undefined') {
            if (typeof bankQuestion.correctAnswer === 'string') {
                newQuestion.answer = bankQuestion.correctAnswer; // Store the model answer as a string
            } else {
                console.warn(`[TeacherCreateTask] 'short_answer' question (Bank ID: ${bankQuestion.id}, Title: "${bankQuestion.title}"): Expected 'correctAnswer' to be a string, but got type ${typeof bankQuestion.correctAnswer}. Value:`, bankQuestion.correctAnswer);
                newQuestion.answer = ''; // Default if format is unexpected
            }
        } else {
            newQuestion.answer = ''; // Default if no correctAnswer provided
        }
    } else {
        console.warn(`[TeacherCreateTask] Bank question (ID: ${bankQuestion.id}, Title: "${bankQuestion.title}") has an unsupported or unrecognized type: "${bankQuestion.type}". Basic info mapped; type-specific content might be missing.`);
        // Ensure fields for other types are initialized to prevent errors if UI expects them
        newQuestion.options = [];
        newQuestion.answer = null; // Or appropriate default for generic/unknown questions
    }

  task.questions.push(newQuestion);
  showMessage(`题目 "${newQuestion.text}" 已成功添加。`);
};

// 导入所选题目
const importSelectedQuestions = () => {
    if (selectedQuestions.value.length === 0) {
        return;
    }

    // 获取所选题目
    // Ensure q and q.id exist before trying to include
    const questionsToImport = questionBank.value.filter(q => q && q.id && selectedQuestions.value.includes(q.id));

    let successfullyProcessedCount = 0;
    if (questionsToImport.length > 0) {
        questionsToImport.forEach(bankQuestion => {
            // Call addQuestionFromBank for each. It handles its own messaging for success/failure/duplicate.
            // We assume addQuestionFromBank is robust and handles its logic correctly.
            addQuestionFromBank(bankQuestion);
            // Note: addQuestionFromBank might not add if it's a duplicate. 
            // For a simple count of attempts, we increment here.
            // A more accurate count of *newly added* questions would require addQuestionFromBank to return a status.
            successfullyProcessedCount++; 
        });
    }

    // 后续的关闭弹窗、清空选择和总体提示逻辑会在此替换内容之后
    // The original showMessage for overall import count will be handled by the next part of the replacement
    // For now, this chunk focuses on the loop that processes questions.
    // The original final showMessage might be removed or adapted depending on addQuestionFromBank's verbosity.
    // The key change is using addQuestionFromBank in the loop.
    // The rest of the function (closing modal, clearing selection, final message) should be preserved or adjusted.
    // This replacement specifically targets the question processing loop.
    // The user's snippet ended at '移除题库特有的字段', so we replace that block.
    // The actual file likely has more lines for this old loop and then the modal closing logic.
    // We are replacing the core logic of how questions are processed and added from the selection.
    // The remnant old code that followed this comment (delete questionCopy, etc.) has been removed.

    // 关闭题库模态框
    showQuestionBank.value = false;

    // 清空选择
    selectedQuestions.value = [];

    // 显示提示
    if (successfullyProcessedCount > 0) {
        showMessage(`处理了 ${successfullyProcessedCount} 个题目的导入请求。详情请见各题目的添加状态。`);
    } else if (selectedQuestions.value.length > 0 && questionsToImport.length === 0) {
        showMessage('未能从题库中匹配到所选的题目，或题目已在作业中。');
    } else if (selectedQuestions.value.length === 0 && questionsToImport.length === 0) {
        // This case is already handled by the initial check in the function.
        // showMessage('没有选择题目。'); 
    }
    // Note: selectedQuestions.value is cleared *after* this message block in the original function flow.
};

// 保存为草稿
const saveAsDraft = () => {
    // 验证必填字段
    if (!task.title) {
        showMessage('请输入任务标题');
        return;
    }

    // 在实际应用中，这里应该调用API保存草稿
    task.status = 'draft';
    console.log('保存草稿', task);

    showMessage('草稿已保存');
};

// 预览任务
const previewTask = () => {
    // 验证必填字段
    if (!task.title) {
        showMessage('请输入任务标题');
        return;
    }

    if (task.questions.length === 0) {
        showMessage('请添加至少一道题目');
        return;
    }

    showPreview.value = true;
};

// 发布任务
const publishTask = async () => {
    // 验证必填字段
    if (!task.title) {
        showMessage('请输入任务标题');
        return;
    }
    if (!task.classId) {
        showMessage('请选择班级');
        return;
    }
    if (!task.openTime) {
        showMessage('请设置开始时间');
        return;
    }
    if (!task.closeTime) {
        showMessage('请设置截止时间');
        return;
    }
    if (task.questions.length === 0) {
        showMessage('请添加至少一道题目');
        return;
    }
    // 验证每道题目
    for (let i = 0; i < task.questions.length; i++) {
        const q = task.questions[i];
        if (!q.text) {
            showMessage(`第 ${i + 1} 题缺少题目内容`);
            return;
        }
        if (q.type === 'choice') {
            for (let j = 0; j < q.options.length; j++) {
                if (!q.options[j]) {
                    showMessage(`第 ${i + 1} 题的选项 ${['A', 'B', 'C', 'D'][j]} 为空`);
                    return;
                }
            }
        } else if (q.type === 'programming') {
            if (!q.description) {
                showMessage(`第 ${i + 1} 题缺少题目描述`);
                return;
            }
            if (!q.sampleAnswer) {
                showMessage(`第 ${i + 1} 题缺少参考答案`);
                return;
            }
            if (!q.testCases || q.testCases.length === 0) {
                showMessage(`第 ${i + 1} 题缺少测试用例`);
                return;
            }
        }
    }
    // 合并 assignmentData，严格按接口字段
    const assignmentData = {
        title: task.title,
        description: task.description,
        courseId: task.courseId,
        openTime: new Date(task.openTime).toISOString(),
        dueDate: new Date(task.closeTime).toISOString(),
        allowResubmit: !!task.allowResubmit,
        questionIds: (() => {
            const ids = [];
            for (const question of task.questions) {
                if (question.bankId) {
                    ids.push(question.bankId);
                } else {
                    // Log a warning for manually added questions not having a bankId
                    // These will not be included in the questionIds sent to the backend via this field.
                    // The backend might need a different mechanism if these are to be created/linked.
                    console.warn(`Question with localId "${question.id}" and title "${question.text}" is manually added or does not have a bankId, and will not be included in 'questionIds'.`);
                }
            }
            return ids;
        })()
    };
    try {
        await createAssignment(task.classId, assignmentData);
        showMessage('布置作业成功');
        setTimeout(() => {
            goBackToCourseManagement();
        }, 1500);
    } catch (e) {
        showMessage(e.message || '布置作业失败');
    }
};

// 返回课程管理
const goBackToCourseManagement = () => {
    if (task.title || task.description || task.questions.length > 0) {
        if (!confirm('确定要离开吗？未保存的内容将会丢失。')) {
            return;
        }
    }

    router.back(); // 实现返回上一页功能
};

// 班级筛选相关




// 组件挂载时
onMounted(async () => {
    // 设置默认开始时间为当前时间
    const now = new Date();
    task.openTime = new Date(now.getTime()).toISOString().slice(0, 16);
    // 设置默认截止时间为一周后
    const oneWeekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    task.closeTime = oneWeekLater.toISOString().slice(0, 16);

    // 注意：获取班级信息的逻辑已移至 fetchClasses 函数，并在另一个 onMounted 中调用
});
</script>