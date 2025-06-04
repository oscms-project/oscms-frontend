<template>
  <div class="course-management">
    <!-- Header section with course name and stats -->
    <header class="header">
      <div class="header-content container">
        <div class="course-info">
          <button class="btn-back" @click="goBack" title="返回课程详情">
            <ArrowLeftIcon class="icon" />
          </button>
          <h1 class="course-title">{{ courseName }} <span class="icon"><i class="i-lucide-external-link"></i></span></h1>
          <p class="course-meta">{{ courseStudents }}人 | {{ courseDuration }}</p>
        </div>
        <div class="course-stats">
          <div class="stat-item">
            <div class="stat-value">{{ stats.assignments }}</div>
            <div class="stat-label">作业数量</div>
          </div>
          <div class="stat-item highlight">
            <div class="stat-value">{{ stats.submissions }}</div>
            <div class="stat-label">提交数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ stats.pending }}</div>
            <div class="stat-label">待批改</div>
          </div>
        </div>
      </div>
    </header>

    <!-- Action buttons -->
    <div class="action-bar container">
      <div class="action-buttons">
        <button class="btn btn-default" @click="showClassSelector = true">
          <i class="i-lucide-users mr-1"></i>
          班级：{{ selectedClass ? selectedClass.name : '全部' }}
          <i class="i-lucide-chevron-down ml-1"></i>
        </button>
        <button class="btn btn-primary">
          <i class="i-lucide-file-plus mr-1"></i>
          发布作业
        </button>
        <button class="btn btn-default">
          <i class="i-lucide-upload mr-1"></i>
          导入学生
        </button>
        <button class="btn btn-default">
          <i class="i-lucide-download mr-1"></i>
          导出成绩
        </button>
        <button class="btn btn-success">
          <i class="i-lucide-bar-chart-2 mr-1"></i>
          统计
        </button>
      </div>
    </div>

    <!-- Navigation tabs -->
    <div class="nav-tabs container">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        :class="['tab-item', { active: activeTab === tab.id }]"
        @click="activeTab = tab.id"
      >
        <i :class="tab.icon"></i>
        {{ tab.name }}
      </div>
    </div>

    <!-- Main content area -->
    <div class="content-area container">
      <!-- Class members view -->
      <div v-if="activeTab === 'members'" class="members-view">
        <div class="panel-header">
          <h2 class="panel-title">班级成员管理</h2>
          <div class="panel-actions">
            <button class="btn btn-sm btn-outline">
              <i class="i-lucide-upload mr-1"></i>
              导入学生信息
            </button>
            <button class="btn btn-sm btn-outline">
              <i class="i-lucide-user-plus mr-1"></i>
              批量添加学生
            </button>
            <div class="search-box">
              <i class="i-lucide-search search-icon"></i>
              <input type="text" placeholder="搜索学生" v-model="searchQuery">
            </div>
          </div>
        </div>

        <div class="data-table">
          <table>
            <thead>
              <tr>
                <th>学号</th>
                <th>姓名</th>
                <th>班级</th>
                <th>提交数</th>
                <th>未提交数</th>
                <th>正确率</th>
                <th>学习进度</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="student in paginatedStudents" :key="student.id">
                <td>{{ student.studentId }}</td>
                <td>{{ student.name }}</td>
                <td>
                  <span class="badge">{{ student.className }}</span>
                </td>
                <td>{{ student.submissions }}</td>
                <td>
                  <span class="unsubmitted-count" :class="getUnsubmittedClass(student.unsubmitted)">
                    {{ student.unsubmitted }}
                  </span>
                </td>
                <td>
                  <div class="progress-wrapper">
                    <div class="progress-bar" :style="{ width: student.accuracy + '%' }"></div>
                    <span>{{ student.accuracy }}%</span>
                  </div>
                </td>
                <td>
                  <div class="progress-container">
                    <div class="progress-info">
                      <span>{{ calculateProgress(student) }}%</span>
                      <span class="progress-label">完成率</span>
                    </div>
                    <div class="progress-circle-container">
                      <svg class="progress-circle" width="40" height="40" viewBox="0 0 40 40">
                        <circle class="progress-circle-bg" cx="20" cy="20" r="16" />
                        <circle
                          class="progress-circle-fill"
                          cx="20"
                          cy="20"
                          r="16"
                          :style="{
                            strokeDasharray: `${calculateProgressCircumference(student)} ${2 * Math.PI * 16}`
                          }"
                        />
                      </svg>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="action-buttons">
                    <button class="btn-icon" title="查看详情">
                      <i class="i-lucide-eye"></i>
                    </button>
                    <button class="btn-icon" title="编辑信息">
                      <i class="i-lucide-edit"></i>
                    </button>
                    <button class="btn-icon danger" title="删除">
                      <i class="i-lucide-trash-2"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="pagination">
          <button class="btn-page btn-nav" @click="prevPage" :disabled="currentPage === 1" title="上一页">
            <span class="nav-arrow">←</span>
          </button>
          <button
            v-for="page in totalPages"
            :key="page"
            class="btn-page"
            :class="{ active: currentPage === page }"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
          <button class="btn-page btn-nav" @click="nextPage" :disabled="currentPage === totalPages" title="下一页">
            <span class="nav-arrow">→</span>
          </button>
          <div class="pagination-info">
            显示 {{ paginationInfo.start }}-{{ paginationInfo.end }} 条，共 {{ filteredStudents.length }} 条
          </div>
        </div>
      </div>

      <!-- Exercises view -->
      <div v-if="activeTab === 'exercises'" class="exercises-view">
        <div class="panel-header">
          <h2 class="panel-title">练习查看及批改</h2>
          <div class="panel-actions">
            <div class="filter-dropdown" ref="chapterFilterDropdown">
              <button class="btn btn-sm btn-outline" @click="toggleChapterFilter">
                <i class="i-lucide-book mr-1"></i>
                章节：{{ chapterFilterLabel }}
                <i class="i-lucide-chevron-down ml-1"></i>
              </button>
              <div class="dropdown-menu" v-if="showChapterFilter">
                <div
                  class="dropdown-item"
                  :class="{ active: chapterFilter === null }"
                  @click="setChapterFilter(null)"
                >
                  全部章节
                </div>
                <div
                  v-for="chapter in uniqueChapters"
                  :key="chapter"
                  class="dropdown-item"
                  :class="{ active: chapterFilter === chapter }"
                  @click="setChapterFilter(chapter)"
                >
                  {{ chapter }}
                </div>
              </div>
            </div>
            <div class="filter-dropdown" ref="statusFilterDropdown">
              <button class="btn btn-sm btn-outline" @click="toggleStatusFilter">
                <i class="i-lucide-filter mr-1"></i>
                状态：{{ statusFilterLabel }}
                <i class="i-lucide-chevron-down ml-1"></i>
              </button>
              <div class="dropdown-menu" v-if="showStatusFilter">
                <div
                  class="dropdown-item"
                  :class="{ active: statusFilter === null }"
                  @click="setStatusFilter(null)"
                >
                  全部
                </div>
                <div
                  class="dropdown-item"
                  :class="{ active: statusFilter === '进行中' }"
                  @click="setStatusFilter('进行中')"
                >
                  <span class="status-dot in-progress"></span>
                  进行中
                </div>
                <div
                  class="dropdown-item"
                  :class="{ active: statusFilter === '已结束' }"
                  @click="setStatusFilter('已结束')"
                >
                  <span class="status-dot completed"></span>
                  已结束
                </div>
              </div>
            </div>
            <div class="search-box">
              <i class="i-lucide-search search-icon"></i>
              <input type="text" placeholder="搜索练习" v-model="exerciseSearchQuery">
            </div>
          </div>
        </div>

        <div v-if="filteredExercises.length === 0" class="empty-state">
          <div class="empty-icon">
            <i class="i-lucide-file-question"></i>
          </div>
          <h3>没有找到符合条件的练习</h3>
          <p>请尝试调整筛选条件或搜索关键词</p>
          <button class="btn btn-primary" @click="resetFilters">
            <i class="i-lucide-refresh-cw mr-1"></i>
            重置筛选
          </button>
        </div>

        <div v-else class="exercise-list">
          <div v-for="exercise in filteredExercises" :key="exercise.id" class="exercise-card">
            <div class="chapter-badge">
              <i class="i-lucide-book mr-1"></i>
              {{ exercise.chapter }}
            </div>
            <div class="exercise-header">
              <div class="exercise-title-area">
                <h3>{{ exercise.title }}</h3>
                <span class="badge status-badge" :class="{ 'status-completed': exercise.status === '已结束' }">
                  {{ exercise.status }}
                </span>
              </div>
              <span class="exercise-date">
                <i class="i-lucide-calendar mr-1"></i>
                {{ exercise.date }}
              </span>
            </div>
            <div class="exercise-description">{{ exercise.description }}</div>
            <div class="exercise-stats">
              <div class="stat">
                <div class="stat-value">{{ exercise.submissions }}</div>
                <div class="stat-label">提交</div>
              </div>
              <div class="stat">
                <div class="stat-value">
                  <div class="accuracy-indicator" :class="getAccuracyClass(exercise.accuracy)">
                    {{ exercise.accuracy }}%
                  </div>
                </div>
                <div class="stat-label">正确率</div>
              </div>
              <div class="stat">
                <div class="stat-value">{{ exercise.pending }}</div>
                <div class="stat-label">待批改</div>
              </div>
            </div>
            <div class="exercise-actions">
              <button class="btn btn-sm btn-primary">
                <i class="i-lucide-check-square mr-1"></i>
                批改
              </button>
              <button class="btn btn-sm btn-default" @click="openExerciseStats(exercise)">
                <i class="i-lucide-bar-chart mr-1"></i>
                统计
              </button>
              <button class="btn btn-sm btn-outline">
                <i class="i-lucide-edit mr-1"></i>
                编辑
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Class selector modal -->
    <div v-if="showClassSelector" class="modal-overlay" @click="showClassSelector = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>选择班级</h3>
          <button class="btn-close" @click="showClassSelector = false">
            <i class="i-lucide-x"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="search-box mb-3">
            <i class="i-lucide-search search-icon"></i>
            <input type="text" placeholder="搜索班级" v-model="classSearchQuery">
          </div>
          <ul class="class-list">
            <li
              v-for="classItem in filteredClasses"
              :key="classItem.id"
              @click="selectClass(classItem)"
              :class="{ active: selectedClass && selectedClass.id === classItem.id }"
            >
              <i class="i-lucide-users-2 mr-2"></i>
              {{ classItem.name }}
              <span class="student-count">{{ classItem.studentCount }}人</span>
            </li>
            <li @click="selectClass(null)" :class="{ active: !selectedClass }">
              <i class="i-lucide-layers mr-2"></i>
              全部班级
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Exercise Statistics Modal -->
    <div v-if="showExerciseStats" class="modal-overlay" @click="showExerciseStats = false">
      <div class="modal-content stats-modal" @click.stop>
        <div class="modal-header">
          <h3>
            <span class="chapter-label">{{ currentExercise ? currentExercise.chapter : '' }}</span>
            {{ currentExercise ? currentExercise.title : '' }} - 统计信息
          </h3>
          <button class="btn-close" @click="showExerciseStats = false">
            <i class="i-lucide-x"></i>
          </button>
        </div>
        <div class="modal-body">
          <!-- Summary Stats -->
          <div class="stats-summary">
            <div class="summary-card">
              <div class="summary-icon">
                <i class="i-lucide-users"></i>
              </div>
              <div class="summary-data">
                <div class="summary-value">{{ submissionStats.totalStudents }}</div>
                <div class="summary-label">总学生数</div>
              </div>
            </div>
            <div class="summary-card">
              <div class="summary-icon submitted">
                <i class="i-lucide-check-circle"></i>
              </div>
              <div class="summary-data">
                <div class="summary-value">{{ submissionStats.submitted }}</div>
                <div class="summary-label">已提交</div>
              </div>
            </div>
            <div class="summary-card">
              <div class="summary-icon unsubmitted">
                <i class="i-lucide-alert-circle"></i>
              </div>
              <div class="summary-data">
                <div class="summary-value">{{ submissionStats.unsubmitted }}</div>
                <div class="summary-label">未提交</div>
              </div>
            </div>
            <div class="summary-card">
              <div class="summary-icon">
                <i class="i-lucide-percent"></i>
              </div>
              <div class="summary-data">
                <div class="summary-value">{{ submissionStats.submissionRate }}%</div>
                <div class="summary-label">提交率</div>
              </div>
            </div>
          </div>

          <!-- Submission Chart -->
          <div class="stats-chart">
            <div class="chart-container">
              <div class="chart-bar submitted" :style="{ width: submissionStats.submissionRate + '%' }">
                {{ submissionStats.submissionRate }}%
              </div>
              <div class="chart-bar unsubmitted" :style="{ width: (100 - submissionStats.submissionRate) + '%' }">
                {{ 100 - submissionStats.submissionRate }}%
              </div>
            </div>
            <div class="chart-legend">
              <div class="legend-item">
                <span class="legend-color submitted"></span>
                <span>已提交</span>
              </div>
              <div class="legend-item">
                <span class="legend-color unsubmitted"></span>
                <span>未提交</span>
              </div>
            </div>
          </div>

          <!-- Tabs for submitted and unsubmitted students -->
          <div class="stats-tabs">
            <div
              class="stats-tab"
              :class="{ active: activeStatsTab === 'submitted' }"
              @click="activeStatsTab = 'submitted'"
            >
              已提交名单 ({{ submissionStats.submitted }})
            </div>
            <div
              class="stats-tab"
              :class="{ active: activeStatsTab === 'unsubmitted' }"
              @click="activeStatsTab = 'unsubmitted'"
            >
              未提交名单 ({{ submissionStats.unsubmitted }})
            </div>
          </div>

          <!-- Student Lists -->
          <div class="stats-content">
            <!-- Submitted Students -->
            <div v-if="activeStatsTab === 'submitted'" class="student-list">
              <div class="list-header">
                <div class="search-box">
                  <i class="i-lucide-search search-icon"></i>
                  <input type="text" placeholder="搜索学生" v-model="statsSearchQuery">
                </div>
                <button class="btn btn-sm btn-outline">
                  <i class="i-lucide-download mr-1"></i>
                  导出名单
                </button>
              </div>

              <div class="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>学号</th>
                      <th>姓名</th>
                      <th>班级</th>
                      <th>提交时间</th>
                      <th>得分</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="student in filteredSubmittedStudents" :key="student.id">
                      <td>{{ student.studentId }}</td>
                      <td>{{ student.name }}</td>
                      <td>
                        <span class="badge">{{ student.className }}</span>
                      </td>
                      <td>{{ student.submissionTime || '-' }}</td>
                      <td>
                        <span class="score" :class="getScoreClass(student.score)">
                          {{ student.score || '-' }}
                        </span>
                      </td>
                      <td>
                        <div class="action-buttons">
                          <button class="btn-icon" title="查看提交">
                            <i class="i-lucide-eye"></i>
                          </button>
                          <button class="btn-icon" title="批改">
                            <i class="i-lucide-check-square"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Unsubmitted Students -->
            <div v-if="activeStatsTab === 'unsubmitted'" class="student-list">
              <div class="list-header">
                <div class="search-box">
                  <i class="i-lucide-search search-icon"></i>
                  <input type="text" placeholder="搜索学生" v-model="statsSearchQuery">
                </div>
                <div class="action-buttons">
                  <button class="btn btn-sm btn-primary">
                    <i class="i-lucide-mail mr-1"></i>
                    发送提醒
                  </button>
                  <button class="btn btn-sm btn-outline">
                    <i class="i-lucide-download mr-1"></i>
                    导出名单
                  </button>
                </div>
              </div>

              <div class="data-table">
                <table>
                  <thead>
                    <tr>
                      <th>
                        <input type="checkbox" v-model="selectAllUnsubmitted" @change="toggleSelectAll">
                      </th>
                      <th>学号</th>
                      <th>姓名</th>
                      <th>班级</th>
                      <th>联系方式</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="student in filteredUnsubmittedStudents" :key="student.id">
                      <td>
                        <input type="checkbox" v-model="student.selected">
                      </td>
                      <td>{{ student.studentId }}</td>
                      <td>{{ student.name }}</td>
                      <td>
                        <span class="badge">{{ student.className }}</span>
                      </td>
                      <td>{{ student.contact || '-' }}</td>
                      <td>
                        <div class="action-buttons">
                          <button class="btn-icon" title="发送提醒">
                            <i class="i-lucide-mail"></i>
                          </button>
                          <button class="btn-icon" title="查看学生信息">
                            <i class="i-lucide-user"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeftIcon } from 'lucide-vue-next'
import { getCourseDetail, getCourseClasses } from '@/api/course'
import {
  getCourseStats,
  getClassStudents,
  importStudents,
  getClassAssignments,
  exportCourseGrades,
  sendAssignmentReminder,
  getStudentsProgress,
  getAssignmentChapters,
  getBatchAssignmentStats,
  getStudentDetails
} from '@/api/courseManagement'

const router = useRouter()
const route = useRoute()

// 课程信息 - 动态数据
const courseName = ref('')
const courseStudents = ref('')
const courseDuration = ref('')
const stats = ref({
  assignments: 0,
  submissions: 0,
  pending: 0
})

// 加载课程信息
const loadCourseInfo = async () => {
  try {
    const courseId = route.params.id
    const courseDetail = await getCourseDetail(courseId)
    courseName.value = courseDetail.data.name
  } catch (error) {
    console.error('Failed to load course info:', error)
  }
}

// 加载课程统计信息
const loadCourseStats = async () => {
  try {
    const courseId = route.params.id
    const classId = selectedClass.value?.id
    const courseStats = await getCourseStats(courseId, classId)
    
    stats.value = {
      assignments: courseStats.data.assignmentCount,
      submissions: courseStats.data.submissionCount,
      pending: courseStats.data.pendingCount
    }
    courseStudents.value = courseStats.data.studentCount
  } catch (error) {
    console.error('Failed to load course stats:', error)
  }
}

// 加载班级列表
const loadClasses = async () => {
  try {
    const courseId = route.params.id
    const response = await getCourseClasses(courseId)
    classes.value = response.data
  } catch (error) {
    console.error('Failed to load classes:', error)
    // 加载失败时使用静态数据
    /* 
    classes.value = [
      { id: 1, name: '2021级软件工程1班', studentCount: 45 },
      { id: 2, name: '2021级软件工程2班', studentCount: 42 },
      { id: 3, name: '2021级计算机科学1班', studentCount: 48 },
      { id: 4, name: '2021级计算机科学2班', studentCount: 46 },
    ]
    */
  }
}

// 基础数据定义
const classes = ref([])
const selectedClass = ref(null)
const showClassSelector = ref(false)
const classSearchQuery = ref('')
const students = ref([])
const exercises = ref([])

// 加载学生列表
const loadStudents = async () => {
  try {
    if (!selectedClass.value) return
    const response = await getClassStudents(selectedClass.value.id)
    const students = response.data

    // 获取每个学生的详细信息
    const studentsWithDetails = await Promise.all(
      students.map(async student => {
        try {
          const details = await getStudentDetails(student.studentId)
          return {
            ...student,
            contact: details.data.contact
          }
        } catch (error) {
          console.error(`Failed to load details for student ${student.studentId}:`, error)
          return student
        }
      })
    )

    students.value = studentsWithDetails
    
    // 加载学生进度信息
    await loadStudentsProgress()
  } catch (error) {
    console.error('Failed to load students:', error)
    // 加载失败时使用静态数据
    students.value = [
      {
        id: 1,
        studentId: '2021001',
        name: '张三',
        className: '软件工程1班',
        submissions: 3,
        unsubmitted: 0,
        accuracy: 80,
        totalExercises: 3,
        contact: '13800138001',
        submissionTime: '2023-10-05 14:30:22',
        score: 92
      },
      // ... 其他静态数据 ...
    ]
  }
}

// 加载学生进度
const loadStudentsProgress = async () => {
  try {
    const courseId = route.params.id
    const response = await getStudentsProgress(courseId)
    // 更新学生进度信息
    students.value = students.value.map(student => {
      const progress = response.data.find(p => p.studentId === student.studentId)
      if (progress) {
        return {
          ...student,
          submissions: progress.submittedCount,
          unsubmitted: progress.unsubmittedCount,
          accuracy: progress.accuracy,
          totalExercises: progress.totalExercises
        }
      }
      return student
    })
  } catch (error) {
    console.error('Failed to load students progress:', error)
  }
}

// 导入学生
const handleImportStudents = async (studentIds) => {
  try {
    if (!selectedClass.value) return
    await importStudents(selectedClass.value.id, studentIds)
    // 重新加载学生列表
    await loadStudents()
  } catch (error) {
    console.error('Failed to import students:', error)
  }
}

// 导出成绩
const handleExportGrades = async () => {
  try {
    const courseId = route.params.id
    const response = await exportCourseGrades(courseId)
    // 处理文件下载
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${courseName.value}-成绩表.xlsx`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Failed to export grades:', error)
  }
}

// 发送提醒
const handleSendReminder = async (assignmentId, studentIds) => {
  try {
    await sendAssignmentReminder(assignmentId, studentIds)
    // 可以添加提示信息
  } catch (error) {
    console.error('Failed to send reminder:', error)
  }
}

// 加载作业列表
const loadAssignments = async () => {
  try {
    if (!selectedClass.value) return
    const courseId = route.params.id
    const [assignments, chapters] = await Promise.all([
      getClassAssignments(selectedClass.value.id),
      getAssignmentChapters(courseId)
    ])

    // 批量获取作业统计信息
    const assignmentIds = assignments.data.map(a => a.id)
    const statsResponse = await getBatchAssignmentStats(assignmentIds)
    const statsMap = new Map(statsResponse.data.map(stat => [stat.assignmentId, stat]))

    exercises.value = assignments.data.map(assignment => {
      const stats = statsMap.get(assignment.id) || { submissionCount: 0, accuracyRate: 0, pendingCount: 0 }
      return {
        id: assignment.id,
        title: assignment.title,
        description: assignment.description,
        date: new Date(assignment.openTime).toLocaleString(),
        submissions: stats.submissionCount,
        accuracy: stats.accuracyRate,
        pending: stats.pendingCount,
        status: new Date(assignment.dueDate) < new Date() ? '已结束' : '进行中',
        chapter: chapters.data.find(c => c.id === assignment.chapterId)?.name || '未分类'
      }
    })
  } catch (error) {
    console.error('Failed to load assignments:', error)
    // 加载失败时使用静态数据
    exercises.value = [
      {
        id: 1,
        title: '面向对象编程基础',
        date: '2023-09-18 09:00:24',
        description: '掌握面向对象的基本概念和Java中的实现方式，包括类、对象、继承、多态等核心概念。',
        submissions: 4,
        accuracy: 85,
        pending: 1,
        status: '进行中',
        chapter: '第1章：Java基础'
      },
      // ... 其他静态数据 ...
    ]
  }
}

// 监听班级选择变化
watch(() => selectedClass.value, async (newClass) => {
  if (newClass) {
    await Promise.all([
      loadStudents(),
      loadAssignments(),
      loadCourseStats()
    ])
    await loadStudentsProgress()
  } else {
    // 当未选择班级时，清空相关数据
    students.value = []
    exercises.value = []
    stats.value = {
      assignments: 0,
      submissions: 0,
      pending: 0
    }
    courseStudents.value = '0'
  }
})

// 页面加载时初始化数据
onMounted(async () => {
  await Promise.all([
    loadCourseInfo(),
    loadClasses()
  ])
})

// 导航到个人中心页面
const navigateToProfile = () => {
  router.push('/teacher/profile')
}

// Tabs
const tabs = [
  { id: 'members', name: '班级成员', icon: 'i-lucide-users' },
  { id: 'exercises', name: '练习查看及批改', icon: 'i-lucide-clipboard-check' },
  { id: 'stats', name: '统计', icon: 'i-lucide-bar-chart-3' },
  { id: 'settings', name: '设置', icon: 'i-lucide-settings' },
  { id: 'more', name: '更多', icon: 'i-lucide-more-horizontal' },
];
const activeTab = ref('exercises');  // 默认显示练习查看页面

// Classes
/* 静态数据
const classes = ref([
  { id: 1, name: '2021级软件工程1班', studentCount: 45 },
  { id: 2, name: '2021级软件工程2班', studentCount: 42 },
  { id: 3, name: '2021级计算机科学1班', studentCount: 48 },
  { id: 4, name: '2021级计算机科学2班', studentCount: 46 },
])
*/

// Students
/* 静态数据
const students = ref([
  {
    id: 1,
    studentId: '2021001',
    name: '张三',
    className: '软件工程1班',
    submissions: 3,
    unsubmitted: 0,
    accuracy: 80,
    totalExercises: 3,
    contact: '13800138001',
    submissionTime: '2023-10-05 14:30:22',
    score: 92
  },
  {
    id: 2,
    studentId: '2021002',
    name: '李四',
    className: '软件工程1班',
    submissions: 2,
    unsubmitted: 1,
    accuracy: 75,
    totalExercises: 3,
    contact: '13800138002',
    submissionTime: '2023-10-05 15:45:10',
    score: 85
  },
  {
    id: 3,
    studentId: '2021003',
    name: '王五',
    className: '软件工程2班',
    submissions: 1,
    unsubmitted: 2,
    accuracy: 90,
    totalExercises: 3,
    contact: '13800138003',
    submissionTime: '2023-10-05 16:20:05',
    score: 78
  },
  {
    id: 4,
    studentId: '2021004',
    name: '赵六',
    className: '软件工程2班',
    submissions: 3,
    unsubmitted: 0,
    accuracy: 85,
    totalExercises: 3,
    contact: '13800138004',
    submissionTime: '2023-10-05 10:15:30',
    score: 95
  },
  {
    id: 5,
    studentId: '2021005',
    name: '陈七',
    className: '计算机科学1班',
    submissions: 2,
    unsubmitted: 1,
    accuracy: 95,
    totalExercises: 3,
    contact: '13800138005'
  },
  {
    id: 6,
    studentId: '2021006',
    name: '刘八',
    className: '计算机科学1班',
    submissions: 0,
    unsubmitted: 3,
    accuracy: 0,
    totalExercises: 3,
    contact: '13800138006'
  },
  {
    id: 7,
    studentId: '2021007',
    name: '钱九',
    className: '软件工程1班',
    submissions: 2,
    unsubmitted: 1,
    accuracy: 88,
    totalExercises: 3,
    contact: '13800138007'
  },
  {
    id: 8,
    studentId: '2021008',
    name: '孙十',
    className: '软件工程1班',
    submissions: 3,
    unsubmitted: 0,
    accuracy: 92,
    totalExercises: 3,
    contact: '13800138008'
  },
  {
    id: 9,
    studentId: '2021009',
    name: '周十一',
    className: '软件工程2班',
    submissions: 1,
    unsubmitted: 2,
    accuracy: 70,
    totalExercises: 3,
    contact: '13800138009'
  },
  {
    id: 10,
    studentId: '2021010',
    name: '吴十二',
    className: '软件工程2班',
    submissions: 2,
    unsubmitted: 1,
    accuracy: 85,
    totalExercises: 3,
    contact: '13800138010'
  },
  {
    id: 11,
    studentId: '2021011',
    name: '郑十三',
    className: '计算机科学1班',
    submissions: 3,
    unsubmitted: 0,
    accuracy: 94,
    totalExercises: 3,
    contact: '13800138011'
  },
  {
    id: 12,
    studentId: '2021012',
    name: '王十四',
    className: '计算机科学1班',
    submissions: 0,
    unsubmitted: 3,
    accuracy: 0,
    totalExercises: 3,
    contact: '13800138012'
  }
])
*/

// Exercises
/* 静态数据
const exercises = ref([
  {
    id: 1,
    title: '面向对象编程基础',
    date: '2023-09-18 09:00:24',
    description: '掌握面向对象的基本概念和Java中的实现方式，包括类、对象、继承、多态等核心概念。',
    submissions: 4,
    accuracy: 85,
    pending: 1,
    status: '进行中',
    chapter: '第1章：Java基础'
  },
  {
    id: 2,
    title: 'Java集合框架',
    date: '2023-09-25 10:30:15',
    description: '学习Java中的List、Set、Map等集合类的使用方法，掌握各种集合的特点和适用场景。',
    submissions: 3,
    accuracy: 70,
    pending: 0,
    status: '已结束',
    chapter: '第2章：集合与数据结构'
  },
  {
    id: 3,
    title: '异常处理机制',
    date: '2023-10-02 14:20:00',
    description: '理解Java异常处理机制，掌握try-catch-finally的使用，学会自定义异常类。',
    submissions: 2,
    accuracy: 92,
    pending: 2,
    status: '进行中',
    chapter: '第3章：异常处理'
  },
  {
    id: 4,
    title: 'IO流操作',
    date: '2023-10-09 16:45:30',
    description: '掌握Java IO流的基本概念，学会使用文件流、缓冲流等进行文件操作。',
    submissions: 1,
    accuracy: 88,
    pending: 3,
    status: '进行中',
    chapter: '第4章：IO编程'
  },
  {
    id: 5,
    title: '多线程编程',
    date: '2023-09-15 11:20:45',
    description: '学习Java多线程的基本概念，掌握线程的创建、同步、通信等操作。',
    submissions: 5,
    accuracy: 78,
    pending: 0,
    status: '已结束',
    chapter: '第5章：并发编程'
  },
  {
    id: 6,
    title: '网络编程基础',
    date: '2023-09-22 15:10:20',
    description: '了解网络编程基础知识，学会使用Socket进行网络通信。',
    submissions: 4,
    accuracy: 82,
    pending: 1,
    status: '已结束',
    chapter: '第6章：网络编程'
  },
  {
    id: 7,
    title: 'Java反射机制',
    date: '2023-09-29 13:40:10',
    description: '理解Java反射机制的原理，学会使用反射API进行类的动态操作。',
    submissions: 3,
    accuracy: 75,
    pending: 2,
    status: '进行中',
    chapter: '第7章：反射与注解'
  },
  {
    id: 8,
    title: 'JDBC数据库操作',
    date: '2023-10-06 10:25:55',
    description: '掌握JDBC的基本用法，学会进行数据库的增删改查操作。',
    submissions: 2,
    accuracy: 90,
    pending: 1,
    status: '进行中',
    chapter: '第8章：数据库编程'
  }
])
*/

// Search functionality
const searchQuery = ref('');
const exerciseSearchQuery = ref('');
const statsSearchQuery = ref('');

// Status filter for exercises
const statusFilter = ref(null);
const showStatusFilter = ref(false);
const statusFilterDropdown = ref(null);

// Chapter filter for exercises
const chapterFilter = ref(null);
const showChapterFilter = ref(false);
const chapterFilterDropdown = ref(null);

// Exercise statistics modal
const showExerciseStats = ref(false);
const currentExercise = ref(null);
const activeStatsTab = ref('submitted');
const selectAllUnsubmitted = ref(false);

// Pagination for students
const currentPage = ref(1);
const itemsPerPage = ref(5);

// Computed property for status filter label
const statusFilterLabel = computed(() => {
  return statusFilter.value || '全部';
});

// Computed property for chapter filter label
const chapterFilterLabel = computed(() => {
  return chapterFilter.value ? chapterFilter.value.replace(/第\d+章：/, '') : '全部章节';
});

// 获取所有唯一的章节
const uniqueChapters = computed(() => {
  const chapters = new Set();
  exercises.value.forEach(exercise => {
    chapters.add(exercise.chapter);
  });
  return Array.from(chapters);
});

// Methods
const selectClass = (classItem) => {
  selectedClass.value = classItem;
  showClassSelector.value = false;
};

const getAccuracyClass = (accuracy) => {
  if (accuracy >= 90) return 'excellent';
  if (accuracy >= 75) return 'good';
  if (accuracy >= 60) return 'average';
  return 'poor';
};

const getScoreClass = (score) => {
  if (!score) return '';
  if (score >= 90) return 'excellent';
  if (score >= 75) return 'good';
  if (score >= 60) return 'average';
  return 'poor';
};

const getUnsubmittedClass = (count) => {
  if (count === 0) return 'none';
  if (count === 1) return 'low';
  if (count === 2) return 'medium';
  return 'high';
};

// 计算学习进度百分比
const calculateProgress = (student) => {
  if (student.totalExercises === 0) return 0;
  return Math.round((student.submissions / student.totalExercises) * 100);
};

// 计算进度圆环的周长
const calculateProgressCircumference = (student) => {
  const progress = calculateProgress(student);
  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  return (progress / 100) * circumference;
};

// 切换状态筛选下拉菜单
const toggleStatusFilter = () => {
  showStatusFilter.value = !showStatusFilter.value;
  if (showStatusFilter.value) {
    showChapterFilter.value = false;
  }
};

// 切换章节筛选下拉菜单
const toggleChapterFilter = () => {
  showChapterFilter.value = !showChapterFilter.value;
  if (showChapterFilter.value) {
    showStatusFilter.value = false;
  }
};

// 设置状态筛选
const setStatusFilter = (status) => {
  statusFilter.value = status;
  showStatusFilter.value = false;
};

// 设置章节筛选
const setChapterFilter = (chapter) => {
  chapterFilter.value = chapter;
  showChapterFilter.value = false;
};

// 重置所有筛选条件
const resetFilters = () => {
  statusFilter.value = null;
  chapterFilter.value = null;
  exerciseSearchQuery.value = '';
};

// 分页相关方法
const goToPage = (page) => {
  currentPage.value = page;
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

// 打开练习统计弹窗
const openExerciseStats = (exercise) => {
  currentExercise.value = exercise;
  showExerciseStats.value = true;
  activeStatsTab.value = 'submitted';
  statsSearchQuery.value = '';

  // 为未提交学生添加selected属性用于批量选择
  unsubmittedStudentsForExercise.value.forEach(student => {
    student.selected = false;
  });

  selectAllUnsubmitted.value = false;
};

// 切换全选/取消全选
const toggleSelectAll = () => {
  unsubmittedStudentsForExercise.value.forEach(student => {
    student.selected = selectAllUnsubmitted.value;
  });
};

// 点击外部关闭下拉菜单
const handleClickOutside = (event) => {
  if (statusFilterDropdown.value && !statusFilterDropdown.value.contains(event.target)) {
    showStatusFilter.value = false;
  }
  if (chapterFilterDropdown.value && !chapterFilterDropdown.value.contains(event.target)) {
    showChapterFilter.value = false;
  }
};

// 生命周期钩子
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

// 模拟当前练习的已提交和未提交学生
const submittedStudentsForExercise = computed(() => {
  if (!currentExercise.value) return [];

  // 这里模拟数据，实际应用中应该根据练习ID和学生提交记录来筛选
  return students.value.filter(student => {
    // 假设学生ID为1-4的已提交当前练习
    return student.id <= 4;
  });
});

const unsubmittedStudentsForExercise = computed(() => {
  if (!currentExercise.value) return [];

  // 这里模拟数据，实际应用中应该根据练习ID和学生提交记录来筛选
  return students.value.filter(student => {
    // 假设学生ID为5-6的未提交当前练习
    return student.id > 4;
  }).map(student => ({
    ...student,
    selected: false // 添加selected属性用于批量选择
  }));
});

// 提交统计数据
const submissionStats = computed(() => {
  const submitted = submittedStudentsForExercise.value.length;
  const unsubmitted = unsubmittedStudentsForExercise.value.length;
  const total = submitted + unsubmitted;
  const rate = total > 0 ? Math.round((submitted / total) * 100) : 0;

  return {
    submitted,
    unsubmitted,
    totalStudents: total,
    submissionRate: rate
  };
});

// 搜索过滤后的已提交学生
const filteredSubmittedStudents = computed(() => {
  if (!statsSearchQuery.value) return submittedStudentsForExercise.value;

  const query = statsSearchQuery.value.toLowerCase();
  return submittedStudentsForExercise.value.filter(student =>
    student.name.toLowerCase().includes(query) ||
    student.studentId.toLowerCase().includes(query) ||
    student.className.toLowerCase().includes(query)
  );
});

// 搜索过滤后的未提交学生
const filteredUnsubmittedStudents = computed(() => {
  if (!statsSearchQuery.value) return unsubmittedStudentsForExercise.value;

  const query = statsSearchQuery.value.toLowerCase();
  return unsubmittedStudentsForExercise.value.filter(student =>
    student.name.toLowerCase().includes(query) ||
    student.studentId.toLowerCase().includes(query) ||
    student.className.toLowerCase().includes(query)
  );
});

// 过滤后的学生列表
const filteredStudents = computed(() => {
  let result = students.value;

  if (selectedClass.value) {
    result = result.filter(student => student.className.includes(selectedClass.value.name.split('级')[1]));
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(student =>
      student.name.toLowerCase().includes(query) ||
      student.studentId.toLowerCase().includes(query)
    );
  }

  return result;
});

// 分页后的学生列表
const paginatedStudents = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredStudents.value.slice(start, end);
});

// 总页数
const totalPages = computed(() => {
  return Math.ceil(filteredStudents.value.length / itemsPerPage.value);
});

// 分页信息
const paginationInfo = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value + 1;
  const end = Math.min(start + itemsPerPage.value - 1, filteredStudents.value.length);
  return {
    start: filteredStudents.value.length > 0 ? start : 0,
    end
  };
});

// 过滤后的练习列表
const filteredExercises = computed(() => {
  let result = exercises.value;

  // 应用章节筛选
  if (chapterFilter.value) {
    result = result.filter(exercise => exercise.chapter === chapterFilter.value);
  }

  // 应用状态筛选
  if (statusFilter.value) {
    result = result.filter(exercise => exercise.status === statusFilter.value);
  }

  // 应用搜索筛选
  if (exerciseSearchQuery.value) {
    const query = exerciseSearchQuery.value.toLowerCase();
    result = result.filter(exercise =>
      exercise.title.toLowerCase().includes(query) ||
      exercise.description.toLowerCase().includes(query) ||
      exercise.chapter.toLowerCase().includes(query)
    );
  }

  return result;
});

const filteredClasses = computed(() => {
  if (!classSearchQuery.value) return classes.value;

  const query = classSearchQuery.value.toLowerCase();
  return classes.value.filter(classItem =>
    classItem.name.toLowerCase().includes(query)
  );
});

const goBack = () => {
  router.push(`/course/${route.params.id}`)
}
</script>

<style scoped>
.course-management {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #333;
  background-color: #f8f9fa;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
}

/* Header styles */
.header {
  background: linear-gradient(120deg, #56CCF2 0%, #3F87E5 100%);
  color: white;
  padding: 25px 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

.header::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 10% 20%, rgba(255, 255, 255, 0.2) 0%, transparent 20%),
              radial-gradient(circle at 80% 60%, rgba(255, 255, 255, 0.2) 0%, transparent 20%);
  pointer-events: none;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.course-title {
  font-size: 28px;
  margin: 0 0 5px 0;
  display: flex;
  align-items: center;
  font-weight: 600;
}

.icon {
  font-size: 16px;
  margin-left: 5px;
  opacity: 0.8;
}

.course-meta {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
}

.course-stats {
  display: flex;
  gap: 30px;
}

.stat-item {
  text-align: center;
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  border-radius: 12px;
  padding: 12px 20px;
  min-width: 80px;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.stat-item:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  background-color: rgba(255, 255, 255, 0.25);
}

.stat-item.highlight {
  background-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-value {
  font-size: 32px;
  font-weight: bold;
}

.stat-label {
  font-size: 12px;
  opacity: 0.9;
  margin-top: 4px;
}

/* 用户头像样式 */
.user-avatar-container {
  position: absolute;
  top: 33px;
  right: 60px;
  display: flex;
  justify-content: flex-end;
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  position: relative;
}

.user-avatar:hover {
  transform: scale(1.05);
  border-color: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Action bar */
.action-bar {
  background-color: white;
  padding: 12px 0;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.action-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  font-weight: 500;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-default {
  background-color: white;
  border-color: #d9d9d9;
  color: #555;
}

.btn-default:hover {
  border-color: #bbb;
  color: #333;
}

.btn-primary {
  background-color: #1976d2;
  color: white;
}

.btn-primary:hover {
  background-color: #1565c0;
}

.btn-success {
  background-color: #4caf50;
  color: white;
}

.btn-success:hover {
  background-color: #43a047;
}

.btn-outline {
  background-color: transparent;
  border-color: #d9d9d9;
  color: #555;
}

.btn-outline:hover {
  border-color: #1976d2;
  color: #1976d2;
}

.btn-text {
  background: none;
  border: none;
  color: #1976d2;
  padding: 0;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 13px;
}

.btn-icon {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 5px;
  border-radius: 4px;
  transition: all 0.2s;
}

.btn-icon:hover {
  background-color: #f0f0f0;
  color: #1976d2;
}

.btn-icon.danger:hover {
  background-color: #ffebee;
  color: #f44336;
}

.mr-1 {
  margin-right: 4px;
}

.mr-2 {
  margin-right: 8px;
}

.ml-1 {
  margin-left: 4px;
}

.mb-3 {
  margin-bottom: 12px;
}

/* Navigation tabs */
.nav-tabs {
  display: flex;
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
  padding: 0 10px;
}

.tab-item {
  padding: 14px 20px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: #666;
}

.tab-item:hover {
  color: #1976d2;
}

.tab-item.active {
  color: #1976d2;
  border-bottom-color: #1976d2;
}

/* Content area */
.content-area {
  padding: 20px 0;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.panel-title {
  font-size: 20px;
  margin: 0;
  color: #333;
  font-weight: 600;
}

.panel-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}

.search-box {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.search-box input {
  padding: 8px 12px 8px 35px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  width: 220px;
  font-size: 14px;
  transition: all 0.2s;
}

.search-box input:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

/* Filter dropdown */
.filter-dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 5px;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  min-width: 150px;
  z-index: 100;
  overflow: hidden;
  animation: fadeIn 0.2s ease-out;
  max-height: 300px;
  overflow-y: auto;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  padding: 10px 15px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.dropdown-item.active {
  background-color: #e3f2fd;
  color: #1976d2;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
}

.status-dot.in-progress {
  background-color: #4caf50;
}

.status-dot.completed {
  background-color: #9e9e9e;
}

/* Data table */
.data-table {
  width: 100%;
  overflow-x: auto;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 14px 15px;
  text-align: left;
  border-bottom: 1px solid #e0e0e0;
}

th {
  background-color: #f5f5f5;
  font-weight: 600;
  color: #555;
}

tr:last-child td {
  border-bottom: none;
}

tr:hover td {
  background-color: #f9f9f9;
}

.badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: #e3f2fd;
  color: #1976d2;
  font-size: 12px;
  font-weight: 500;
}

.status-badge {
  background-color: #e8f5e9;
  color: #43a047;
}

.status-badge.status-completed {
  background-color: #f5f5f5;
  color: #757575;
}

.progress-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.progress-bar {
  height: 6px;
  background-color: #4caf50;
  border-radius: 3px;
}

.action-buttons {
  display: flex;
  gap: 5px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  gap: 5px;
  align-items: center;
}

.btn-page {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #d9d9d9;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-page:hover:not(:disabled) {
  border-color: #1976d2;
  color: #1976d2;
}

.btn-page.active {
  background-color: #1976d2;
  color: white;
  border-color: #1976d2;
}

.pagination-info {
  margin-left: 15px;
  font-size: 14px;
  color: #666;
}

/* Exercises view */
.exercise-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.exercise-card {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  position: relative;
}

.exercise-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.chapter-badge {
  position: absolute;
  top: -10px;
  left: 20px;
  background-color: #1976d2;
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  z-index: 1;
}

.chapter-label {
  display: inline-block;
  background-color: #e3f2fd;
  color: #1976d2;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  margin-right: 10px;
}

.exercise-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.exercise-title-area {
  display: flex;
  align-items: center;
  gap: 10px;
}

.exercise-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.exercise-date {
  color: #757575;
  font-size: 14px;
  display: flex;
  align-items: center;
}

.exercise-description {
  margin-bottom: 15px;
  color: #555;
  font-size: 14px;
  line-height: 1.5;
}

.exercise-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;
}

.stat {
  text-align: center;
}

.accuracy-indicator {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
}

.accuracy-indicator.excellent {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.accuracy-indicator.good {
  background-color: #e3f2fd;
  color: #1565c0;
}

.accuracy-indicator.average {
  background-color: #fff8e1;
  color: #ff8f00;
}

.accuracy-indicator.poor {
  background-color: #ffebee;
  color: #c62828;
}

/* 未提交数量样式 */
.unsubmitted-count {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
}

.unsubmitted-count.none {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.unsubmitted-count.low {
  background-color: #fff8e1;
  color: #ff8f00;
}

.unsubmitted-count.medium {
  background-color: #ffecb3;
  color: #ff6f00;
}

.unsubmitted-count.high {
  background-color: #ffebee;
  color: #c62828;
}

/* 学习进度样式 */
.progress-container {
  display: flex;
  align-items: center;
  gap: 15px;
}

.progress-info {
  display: flex;
  flex-direction: column;
  font-weight: 500;
}

.progress-label {
  font-size: 12px;
  color: #757575;
}

.progress-circle-container {
  position: relative;
}

.progress-circle {
  transform: rotate(-90deg);
}

.progress-circle-bg {
  fill: none;
  stroke: #e0e0e0;
  stroke-width: 3;
}

.progress-circle-fill {
  fill: none;
  stroke: #1976d2;
  stroke-width: 3;
  stroke-linecap: round;
  transition: stroke-dasharray 0.5s ease;
}

.exercise-actions {
  display: flex;
  gap: 10px;
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.empty-icon {
  font-size: 48px;
  color: #bdbdbd;
  margin-bottom: 20px;
}

.empty-state h3 {
  margin: 0 0 10px 0;
  font-size: 18px;
  color: #555;
}

.empty-state p {
  margin: 0 0 20px 0;
  color: #757575;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(3px);
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 450px;
  max-width: 90%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.modal-content.stats-modal {
  width: 800px;
  max-width: 95%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 5px;
}

.btn-close {
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 5px;
  border-radius: 4px;
  transition: all 0.2s;
}

.btn-close:hover {
  background-color: #f0f0f0;
  color: #333;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
}

.stats-modal .modal-body {
  flex: 1;
  overflow-y: auto;
}

.class-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.class-list li {
  padding: 12px 15px;
  cursor: pointer;
  border-radius: 6px;
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  transition: all 0.2s;
}

.class-list li:hover {
  background-color: #f5f5f5;
}

.class-list li.active {
  background-color: #e3f2fd;
  color: #1976d2;
}

.student-count {
  margin-left: auto;
  font-size: 13px;
  color: #757575;
  background-color: #f5f5f5;
  padding: 2px 8px;
  border-radius: 12px;
}

.class-list li.active .student-count {
  background-color: rgba(25, 118, 210, 0.1);
  color: #1976d2;
}

/* Stats Summary */
.stats-summary {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.summary-card {
  flex: 1;
  min-width: 150px;
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 15px;
}

.summary-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background-color: #e3f2fd;
  color: #1976d2;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.summary-icon.submitted {
  background-color: #e8f5e9;
  color: #43a047;
}

.summary-icon.unsubmitted {
  background-color: #ffebee;
  color: #e53935;
}

.summary-data {
  flex: 1;
}

.summary-value {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 2px;
}

.summary-label {
  font-size: 12px;
  color: #757575;
}

/* Stats Chart */
.stats-chart {
  margin-bottom: 20px;
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.chart-container {
  height: 30px;
  display: flex;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 10px;
}

.chart-bar {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 500;
  font-size: 14px;
  transition: width 0.5s ease;
}

.chart-bar.submitted {
  background-color: #4caf50;
}

.chart-bar.unsubmitted {
  background-color: #f44336;
}

.chart-legend {
  display: flex;
  gap: 20px;
}

.legend-item {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  margin-right: 6px;
}

.legend-color.submitted {
  background-color: #4caf50;
}

.legend-color.unsubmitted {
  background-color: #f44336;
}

/* Stats Tabs */
.stats-tabs {
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 20px;
}

.stats-tab {
  padding: 12px 20px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
  font-weight: 500;
}

.stats-tab:hover {
  color: #1976d2;
}

.stats-tab.active {
  color: #1976d2;
  border-bottom-color: #1976d2;
}

/* Student List */
.student-list {
  margin-bottom: 20px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  flex-wrap: wrap;
  gap: 10px;
}

.score {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
}

.score.excellent {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.score.good {
  background-color: #e3f2fd;
  color: #1565c0;
}

.score.average {
  background-color: #fff8e1;
  color: #ff8f00;
}

.score.poor {
  background-color: #ffebee;
  color: #c62828;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 20px;
  }

  .course-stats {
    width: 100%;
    justify-content: space-between;
  }

  .panel-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .exercise-list {
    grid-template-columns: 1fr;
  }

  .nav-tabs {
    overflow-x: auto;
    white-space: nowrap;
    padding-bottom: 5px;
  }

  .tab-item {
    padding: 12px 15px;
  }

  .stats-summary {
    flex-direction: column;
  }

  .summary-card {
    width: 100%;
  }

  .chapter-badge {
    position: relative;
    top: 0;
    left: 0;
    margin-bottom: 10px;
    display: inline-flex;
  }

  .user-avatar-container {
    position: absolute;
    top: 10px;
    right: 10px;
  }
}

/* 新增的样式 */
.btn-page.btn-nav {
  background-color: #f0f7ff;
  border-color: #c2e0ff;
  color: #1976d2;
  font-size: 16px;
}

.btn-page.btn-nav:hover:not(:disabled) {
  background-color: #e3f2fd;
  border-color: #1976d2;
}

.btn-page.btn-nav:disabled {
  background-color: #f5f5f5;
  border-color: #e0e0e0;
  color: #bdbdbd;
}

.nav-arrow {
  font-size: 18px;
  font-weight: bold;
}

.btn-back {
  position: absolute;
  left: -490px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #e5e7eb;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #4b5563;
  padding: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.btn-back:hover {
  background-color: #ffffff;
  color: #1a56db;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transform: translateY(-50%) translateX(-2px);
}

.btn-back:active {
  transform: translateY(-50%) translateX(0);
}

.btn-back .icon {
  width: 28px;
  height: 28px;
  stroke-width: 2.5;
}

.course-info {
  position: relative;
}
</style>
