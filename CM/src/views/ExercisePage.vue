<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <!-- 顶部导航栏 -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center">
        <button class="flex items-center text-gray-700 hover:text-gray-900" @click="goBackToCourseManagement">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
            <path d="m15 18-6-6 6-6"></path>
          </svg>
          <span class="text-lg font-medium">返回任务管理</span>
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
        <div v-if="showUserMenu" class="absolute right-0 top-10 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
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

    <!-- 页面标题 -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">新建学习任务</h1>
        <div class="flex space-x-3">
          <button class="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm" @click="saveAsDraft">
            保存草稿
          </button>
          <button class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm" @click="previewTask">
            预览
          </button>
          <button class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm" @click="publishTask">
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
              <input type="radio" v-model="task.allowResubmit" :value="true" class="form-radio h-4 w-4 text-blue-600">
              <span class="ml-2 text-gray-700">是</span>
            </label>
            <label class="inline-flex items-center">
              <input type="radio" v-model="task.allowResubmit" :value="false" class="form-radio h-4 w-4 text-blue-600">
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
          <button class="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-lg text-sm flex items-center"
            @click="openQuestionBank">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            从题库导入
          </button>
          <button v-if="task.type === 'choice' || task.type === 'mixed'"
            class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-lg text-sm flex items-center"
            @click="addQuestion('choice')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            添加选择题
          </button>
          <button v-if="task.type === 'programming' || task.type === 'mixed'"
            class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm flex items-center"
            @click="addQuestion('programming')">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
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
                  <input v-model="question.text" type="text"
                    class="flex-grow px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="请输入题目" />
                </div>
                <div class="flex items-center mt-2">
                  <label class="text-sm text-gray-600 mr-2">分值:</label>
                  <input v-model.number="question.points" type="number"
                    class="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0" />
                </div>
              </div>
            </div>
            <div class="flex items-center">
              <button class="text-gray-400 hover:text-red-500 focus:outline-none" @click="removeQuestion(qIndex)">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </div>
          </div>

          <!-- 选择题选项 -->
          <div v-if="question.type === 'choice'" class="ml-6 space-y-2 mt-4">
            <div v-for="(option, oIndex) in question.options" :key="oIndex" class="flex items-center">
              <div class="w-6 h-6 rounded-full flex items-center justify-center border mr-2"
                :class="{ 'bg-green-500 border-green-500 text-white': question.correctAnswer === oIndex, 'border-gray-300': question.correctAnswer !== oIndex }">
                {{ ['A', 'B', 'C', 'D'][oIndex] }}
              </div>
              <input v-model="question.options[oIndex]" type="text"
                class="flex-grow px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :placeholder="`选项 ${['A', 'B', 'C', 'D'][oIndex]}`" />
              <button class="ml-2 text-gray-400 hover:text-red-500 focus:outline-none"
                @click="removeOption(question, oIndex)" :disabled="question.options.length <= 2"
                :class="{ 'opacity-50 cursor-not-allowed': question.options.length <= 2 }">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              </button>
              <button class="ml-1 text-gray-400 hover:text-green-500 focus:outline-none"
                @click="setCorrectAnswer(question, oIndex)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </button>
            </div>

            <div v-if="question.options.length < 4" class="flex justify-center">
              <button class="text-blue-500 hover:text-blue-700 text-sm flex items-center" @click="addOption(question)">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
                添加选项
              </button>
            </div>
          </div>

          <!-- 编程题详情 -->
          <div v-if="question.type === 'programming'" class="ml-6 mt-4">
            <div class="mb-3">
              <label class="block text-sm font-medium text-gray-700 mb-1">题目描述</label>
              <textarea v-model="question.description"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                placeholder="请输入题目描述"></textarea>
            </div>

            <div class="mb-3">
              <label class="block text-sm font-medium text-gray-700 mb-1">编程语言</label>
              <select v-model="question.language"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="JavaScript">JavaScript</option>
                <option value="Python">Python</option>
                <option value="Java">Java</option>
                <option value="C++">C++</option>
                <option value="C">C</option>
              </select>
            </div>

            <div class="mb-3">
              <label class="block text-sm font-medium text-gray-700 mb-1">参考答案</label>
              <textarea v-model="question.sampleAnswer"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 font-mono text-sm"
                placeholder="请输入参考答案代码"></textarea>
            </div>

            <!-- 测试用例 -->
            <div class="mb-3">
              <div class="flex justify-between items-center mb-1">
                <label class="block text-sm font-medium text-gray-700">测试用例</label>
                <button class="text-blue-500 hover:text-blue-700 text-sm flex items-center"
                  @click="addTestCase(question)">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1">
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
                    <button class="text-gray-400 hover:text-red-500 focus:outline-none"
                      @click="removeTestCase(question, tIndex)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="15" y1="9" x2="9" y2="15"></line>
                        <line x1="9" y1="9" x2="15" y2="15"></line>
                      </svg>
                    </button>
                  </div>

                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label class="block text-xs text-gray-600 mb-1">测试名称</label>
                      <input v-model="test.name" type="text"
                        class="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="例如：基本功能测试" />
                    </div>
                    <div>
                      <label class="block text-xs text-gray-600 mb-1">输入</label>
                      <input v-model="test.input" type="text"
                        class="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="例如：push(1), push(2)" />
                    </div>
                    <div>
                      <label class="block text-xs text-gray-600 mb-1">期望输出</label>
                      <input v-model="test.expectedOutput" type="text"
                        class="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        placeholder="例如：2" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 解析 -->
          <div class="ml-6 mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">题目解析</label>
            <textarea v-model="question.explanation"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
              placeholder="请输入题目解析，学生提交后可查看"></textarea>
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
            <button class="text-gray-400 hover:text-gray-600 focus:outline-none" @click="showPreview = false">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
              <span>{{ task.type === 'choice' ? '选择题' : task.type === 'programming' ? '编程题' : '混合题型' }}</span>
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
                  <div class="w-6 h-6 rounded-full flex items-center justify-center border mr-2 border-gray-300">
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

    <!-- 题库模态框 -->
    <div v-if="showQuestionBank" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div class="p-6 border-b">
          <div class="flex justify-between items-center">
            <h2 class="text-xl font-bold">题库</h2>
            <button class="text-gray-400 hover:text-gray-600 focus:outline-none" @click="showQuestionBank = false">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
                    <input type="checkbox" :id="`question-${question.id}`"
                      :checked="selectedQuestions.includes(question.id)" @change="toggleQuestionSelection(question.id)"
                      class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                  </div>
                  <div class="ml-3 flex-1">
                    <label :for="`question-${question.id}`" class="font-medium text-gray-700 cursor-pointer">
                      {{ question.text }}
                    </label>
                    <div class="flex items-center mt-1">
                      <span class="px-2 py-0.5 text-xs rounded-full mr-2" :class="{
                        'bg-blue-200 text-blue-800': question.type === 'choice',
                        'bg-green-200 text-green-800': question.type === 'programming'
                      }">
                        {{ question.type === 'choice' ? '选择题' : '编程题' }}
                      </span>
                      <span class="px-2 py-0.5 text-xs rounded-full mr-2" :class="{
                        'bg-green-200 text-green-800': question.difficulty === 'easy',
                        'bg-yellow-200 text-yellow-800': question.difficulty === 'medium',
                        'bg-red-200 text-red-800': question.difficulty === 'hard'
                      }">
                        {{
                          question.difficulty === 'easy' ? '简单' :
                            question.difficulty === 'medium' ? '中等' : '困难'
                        }}
                      </span>
                      <span class="text-sm text-gray-500">{{ question.points }} 分</span>
                    </div>
                  </div>
                </div>
                <button class="text-blue-500 hover:text-blue-700 text-sm" @click="previewBankQuestion(question)">
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
    <div v-if="showQuestionPreview" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-xl font-bold">题目预览</h2>
            <button class="text-gray-400 hover:text-gray-600 focus:outline-none" @click="showQuestionPreview = false">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
                <pre class="p-4 font-mono text-sm overflow-x-auto bg-gray-50">{{ previewQuestion.sampleAnswer }}</pre>
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
            <button v-else-if="previewQuestion" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
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
  questions: []
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

// 题库数据 - 使用模拟数据进行预览
const questionBank = ref([
  {
    id: 'qb-001',
    text: '以下哪种数据结构支持常数时间的随机访问？',
    type: 'choice',
    difficulty: 'easy',
    points: 10,
    options: ['数组', '链表', '栈', '队列'],
    correctAnswer: 0,
    explanation: '数组支持常数时间O(1)的随机访问，因为可以通过索引直接计算内存地址。链表需要从头遍历，栈和队列只能按特定顺序访问元素。'
  },
  {
    id: 'qb-002',
    text: '链表的主要优点是什么？',
    type: 'choice',
    difficulty: 'easy',
    points: 10,
    options: ['快速的随机访问', '内存分配的灵活性', '缓存友好性', '节省内存空间'],
    correctAnswer: 1,
    explanation: '链表的主要优点是内存分配的灵活性，它可以动态地分配内存，不需要连续的内存空间。这使得插入和删除操作更加高效。'
  },
  {
    id: 'qb-003',
    text: '在最坏情况下，在数组中查找元素的时间复杂度是多少？',
    type: 'choice',
    difficulty: 'medium',
    points: 15,
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
    correctAnswer: 2,
    explanation: '在未排序的数组中查找元素，最坏情况下需要遍历整个数组，时间复杂度为O(n)。如果数组已排序，可以使用二分查找，时间复杂度为O(log n)。'
  },
  {
    id: 'qb-004',
    text: '以下哪种操作在链表中比在数组中更高效？',
    type: 'choice',
    difficulty: 'medium',
    points: 15,
    options: ['随机访问元素', '在开头插入元素', '在末尾插入元素', '按索引查找元素'],
    correctAnswer: 1,
    explanation: '在链表开头插入元素的时间复杂度是O(1)，而在数组开头插入元素需要将所有元素向后移动，时间复杂度为O(n)。'
  },
  {
    id: 'qb-005',
    text: '实现一个栈（Stack）数据结构',
    type: 'programming',
    difficulty: 'medium',
    points: 20,
    language: 'JavaScript',
    description: '请实现一个栈数据结构，包含push、pop、peek和isEmpty方法。',
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
    ],
    explanation: '栈是一种遵循后进先出(LIFO)原则的数据结构。上面的实现使用数组作为底层存储，提供了栈的基本操作：push(添加元素)、pop(移除顶部元素)、peek(查看顶部元素)和isEmpty(检查栈是否为空)。'
  },
  {
    id: 'qb-006',
    text: '实现一个队列（Queue）数据结构',
    type: 'programming',
    difficulty: 'medium',
    points: 20,
    language: 'JavaScript',
    description: '请实现一个队列数据结构，包含enqueue、dequeue、peek和isEmpty方法。',
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
    ],
    explanation: '队列是一种遵循先进先出(FIFO)原则的数据结构。上面的实现使用数组作为底层存储，提供了队列的基本操作：enqueue(添加元素)、dequeue(移除队首元素)、peek(查看队首元素)和isEmpty(检查队列是否为空)。'
  },
  {
    id: 'qb-007',
    text: '实现快速排序算法',
    type: 'programming',
    difficulty: 'hard',
    points: 30,
    language: 'JavaScript',
    description: '请实现快速排序算法，对给定的数组进行排序。',
    sampleAnswer: `function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }
  
  const pivot = arr[Math.floor(arr.length / 2)];
  const left = [];
  const right = [];
  const equal = [];
  
  for (let val of arr) {
    if (val < pivot) {
      left.push(val);
    } else if (val > pivot) {
      right.push(val);
    } else {
      equal.push(val);
    }
  }
  
  return [...quickSort(left), ...equal, ...quickSort(right)];
}`,
    testCases: [
      {
        name: '基本排序测试',
        input: '[3, 1, 4, 1, 5, 9, 2, 6, 5]',
        expectedOutput: '[1, 1, 2, 3, 4, 5, 5, 6, 9]'
      },
      {
        name: '已排序数组测试',
        input: '[1, 2, 3, 4, 5]',
        expectedOutput: '[1, 2, 3, 4, 5]'
      },
      {
        name: '逆序数组测试',
        input: '[5, 4, 3, 2, 1]',
        expectedOutput: '[1, 2, 3, 4, 5]'
      }
    ],
    explanation: '快速排序是一种高效的排序算法，平均时间复杂度为O(n log n)。它的基本思想是选择一个"基准"元素，然后将数组分为两部分：小于基准的元素和大于基准的元素，然后递归地对这两部分进行排序。'
  },
  {
    id: 'qb-008',
    text: '二叉树的遍历方式有哪些？',
    type: 'choice',
    difficulty: 'medium',
    points: 15,
    options: ['前序、中序、后序', '前序、中序、后序、层序', '深度优先、广度优先', '先序、次序、末序'],
    correctAnswer: 1,
    explanation: '二叉树的遍历方式包括前序遍历（根-左-右）、中序遍历（左-根-右）、后序遍历（左-右-根）和层序遍历（逐层从左到右）。'
  },
  {
    id: 'qb-009',
    text: '哈希表的平均查找时间复杂度是多少？',
    type: 'choice',
    difficulty: 'medium',
    points: 15,
    options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
    correctAnswer: 0,
    explanation: '哈希表的平均查找时间复杂度是O(1)，这是因为哈希函数可以直接计算出元素的存储位置。但在最坏情况下（所有元素都发生哈希冲突），时间复杂度可能退化为O(n)。'
  },
  {
    id: 'qb-010',
    text: '实现二分查找算法',
    type: 'programming',
    difficulty: 'medium',
    points: 20,
    language: 'JavaScript',
    description: '请实现二分查找算法，在有序数组中查找目标值的索引，如果不存在则返回-1。',
    sampleAnswer: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;
  
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  
  return -1;
}`,
    testCases: [
      {
        name: '基本查找测试',
        input: 'arr = [1, 2, 3, 4, 5], target = 3',
        expectedOutput: '2'
      },
      {
        name: '目标不存在测试',
        input: 'arr = [1, 2, 3, 4, 5], target = 6',
        expectedOutput: '-1'
      },
      {
        name: '边界值测试',
        input: 'arr = [1, 2, 3, 4, 5], target = 1',
        expectedOutput: '0'
      }
    ],
    explanation: '二分查找是一种在有序数组中查找特定元素的高效算法，时间复杂度为O(log n)。它通过不断将搜索范围缩小一半来快速定位目标元素。'
  }
]);

// 过滤后的题库
const filteredQuestionBank = computed(() => {
  return questionBank.value.filter(q => {
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
      return q.text.toLowerCase().includes(keyword) ||
        (q.description && q.description.toLowerCase().includes(keyword)) ||
        (q.explanation && q.explanation.toLowerCase().includes(keyword));
    }

    return true;
  });
});

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

// 格式化日期时间
const formatDateTime = (dateTimeStr) => {
  if (!dateTimeStr) return '未设置';
  const date = new Date(dateTimeStr);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
};

// 打开题库
const openQuestionBank = () => {
  showQuestionBank.value = true;
  loadingQuestionBank.value = true;

  // 模拟加载数据
  setTimeout(() => {
    loadingQuestionBank.value = false;
  }, 500);
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

// 导入所选题目
const importSelectedQuestions = () => {
  if (selectedQuestions.value.length === 0) {
    return;
  }

  // 获取所选题目
  const questionsToImport = questionBank.value.filter(q => selectedQuestions.value.includes(q.id));

  // 添加到任务
  questionsToImport.forEach(q => {
    // 深拷贝题目，避免引用问题
    const questionCopy = JSON.parse(JSON.stringify(q));

    // 移除题库特有的字段
    delete questionCopy.id;
    delete questionCopy.difficulty;

    // 添加到任务
    task.questions.push(questionCopy);
  });

  // 关闭题库模态框
  showQuestionBank.value = false;

  // 清空选择
  selectedQuestions.value = [];

  // 显示提示
  showMessage(`已导入 ${questionsToImport.length} 道题目`);
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
const publishTask = () => {
  // 验证必填字段
  if (!task.title) {
    showMessage('请输入任务标题');
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
      // 验证选择题
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j]) {
          showMessage(`第 ${i + 1} 题的选项 ${['A', 'B', 'C', 'D'][j]} 为空`);
          return;
        }
      }
    } else if (q.type === 'programming') {
      // 验证编程题
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

  // 在实际应用中，这里应该调用API发布任务
  task.status = 'published';
  console.log('发布任务', task);

  showMessage('任务已发布');

  // 发布成功后跳转回课程管理页面
  setTimeout(() => {
    goBackToCourseManagement();
  }, 2000);
};

// 返回课程管理
const goBackToCourseManagement = () => {
  if (task.title || task.description || task.questions.length > 0) {
    if (!confirm('确定要离开吗？未保存的内容将会丢失。')) {
      return;
    }
  }

  // 在实际应用中，这里应该跳转回课程管理页面
  console.log('返回课程管理页面');
};

// 组件挂载时
onMounted(() => {
  // 设置默认开始时间为当前时间
  const now = new Date();
  task.openTime = new Date(now.getTime()).toISOString().slice(0, 16);

  // 设置默认截止时间为一周后
  const oneWeekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  task.closeTime = oneWeekLater.toISOString().slice(0, 16);
});
</script>