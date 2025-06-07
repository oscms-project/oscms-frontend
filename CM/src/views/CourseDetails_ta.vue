<template>
    <div class="course-details">
      <!-- Header section with course name and actions -->
      <header class="header">
        <div class="container header-content">
          <div class="course-info">
            <h1 class="course-title">{{ courseName }}</h1>
            <p class="course-meta">{{ courseStudents }}{{ courseDuration }}</p>
          </div>
          <div class="action-buttons">
            <button class="btn btn-light-blue" @click="goToTeacherCreateTask">
              <i class="i-lucide-file-plus mr-1"></i>
              发布练习
            </button>
            <button class="btn btn-light-blue" @click="openCreateClassModal">
              <i class="i-lucide-plus-circle mr-1"></i>
              创建班级
            </button>
            <button class="btn btn-default" @click="navigateToClassManagement">
              <i class="i-lucide-users mr-1"></i>
              班级和练习管理
            </button>
            <div class="user-avatar" @click="navigateToProfile">
              <img :src="userInfo.avatar" alt="用户头像" />
            </div>
          </div>
        </div>
      </header>
    
      <!-- Navigation tabs -->
      <div class="nav-tabs-container">
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
      </div>
    
      <!-- Main content area -->
      <div class="content-area container">
        <!-- Course Outline Tab -->
        <div v-if="activeTab === 'outline'" class="outline-view">
          <div class="panel-header">
            <h2 class="panel-title">课程大纲</h2>
            <div class="panel-actions">
              <button class="btn btn-sm btn-primary" @click="openOutlineEditor">
                <i class="i-lucide-edit mr-1"></i>
                编辑大纲
              </button>
            </div>
          </div>
          <div class="outline-content">
            <div class="outline-section" v-for="(section, index) in courseOutline" :key="index">
              <h3 class="section-title">{{ section.title }}</h3>
              <p class="section-description">{{ section.description }}</p>
              <ul class="section-points">
                <li v-for="(point, pointIndex) in section.points" :key="pointIndex">
                  <i class="i-lucide-check-circle mr-2 text-success"></i>
                  {{ point }}
                </li>
              </ul>
            </div>
          </div>
        </div>
    
        <!-- Course Resources Tab -->
        <div v-if="activeTab === 'resources'" class="resources-view">
          <div class="panel-header">
            <h2 class="panel-title">课程资源</h2>
            <div class="panel-actions">
              <div class="filter-dropdown" ref="resourceTypeDropdown">
                <button class="btn btn-sm btn-outline" @click="showResourceFilterMenu = !showResourceFilterMenu">
                  <i class="i-lucide-filter mr-1"></i>
                  {{ resourceTypeFilter ? getResourceTypeName(resourceTypeFilter) : '全部类型' }}
                  <i class="i-lucide-chevron-down ml-1"></i>
                </button>
                <div class="dropdown-menu" v-if="showResourceFilterMenu">
                  <div
                    class="dropdown-item"
                    :class="{ active: resourceTypeFilter === null }"
                    @click="setResourceTypeFilter(null)"
                  >
                    全部类型
                  </div>
                  <div
                    v-for="type in resourceTypes"
                    :key="type.value"
                    class="dropdown-item"
                    :class="{ active: resourceTypeFilter === type.value }"
                    @click="setResourceTypeFilter(type.value)"
                  >
                    <i :class="getResourceIcon(type.value)" class="mr-1"></i>
                    {{ type.label }}
                  </div>
                </div>
              </div>
              <div class="search-box">
                <i class="i-lucide-search search-icon"></i>
                <input type="text" placeholder="搜索资源" v-model="resourceSearchQuery">
              </div>
              <button class="btn btn-sm btn-primary" @click="showUploadResourceModal = true">
                <i class="i-lucide-upload mr-1"></i>
                上传资源
              </button>
            </div>
          </div>
    
          <div v-if="filteredResources.length === 0" class="empty-state">
            <div class="empty-icon">
              <i class="i-lucide-file-question"></i>
            </div>
            <h3>没有找到符合条件的资源</h3>
            <p>请尝试调整筛选条件或搜索关键词，或上传新的资源</p>
            <button class="btn btn-primary" @click="showUploadResourceModal = true">
              <i class="i-lucide-upload mr-1"></i>
              上传资源
            </button>
          </div>
    
          <div v-else class="resources-grid">
            <div class="resource-card" v-for="resource in filteredResources" :key="resource.id">
              <div class="resource-card-header">
                <div class="resource-type-indicator">
                  <i :class="getResourceIcon(resource.type)"></i>
                  <span>{{ getResourceTypeName(resource.type) }}</span>
                </div>
                <div class="resource-actions">
                  <button class="btn-icon" title="预览" v-if="canPreview(resource.type)" @click="previewResource(resource)">
                    <i class="i-lucide-eye"></i>
                  </button>
                  <button class="btn-icon" title="下载" @click="downloadResource(resource)">
                    <i class="i-lucide-download"></i>
                  </button>
                  <button class="btn-icon" title="编辑" @click="editResource(resource)">
                    <i class="i-lucide-edit"></i>
                  </button>
                  <button class="btn-icon danger" title="删除" @click="confirmDeleteResource(resource)">
                    <i class="i-lucide-trash-2"></i>
                  </button>
                </div>
              </div>
              <div class="resource-info">
                <h3 class="resource-title">{{ resource.filename }}</h3>
                <p class="resource-meta">
                  <span class="resource-size">{{ formatFileSize(resource.size) }}</span>
                </p>
                <p class="resource-date">
                  <i class="i-lucide-calendar mr-1"></i>
                  {{ resource.updatedAt}}
                </p>
                <p class="resource-description" v-if="resource.description">{{ resource.description }}</p>
                <p class="resource-visibility" v-if="resource.hasOwnProperty('visibleForClasses')">
                  <i class="i-lucide-users mr-1"></i>
                  可见范围: {{ getVisibleClassNames(resource) }}
                </p>
              </div>
            </div>
          </div>
        </div>
    
        <!-- Course Chapters Tab -->
        <div v-if="activeTab === 'chapters'" class="chapters-view">
          <div class="panel-header">
            <h2 class="panel-title">课程章节</h2>
            <div class="panel-actions">
              <button class="btn btn-sm btn-primary" @click="showAddChapterModal = true">
                <i class="i-lucide-plus mr-1"></i>
                添加章节
              </button>
            </div>
          </div>
          <div class="chapters-list">
            <div class="chapter-item" v-for="chapter in courseChapters" :key="chapter.id">
              <div class="chapter-header" @click="toggleChapter(chapter.id)">
                <div class="chapter-title-container">
                  <div class="chapter-number-badge">
                    {{ (chapter && typeof chapter.number === 'string') ? chapter.number.replace('第', '').replace('章', '') : '' }}
                  </div>
                  <h3 class="chapter-title">{{ chapter.title }}</h3>
                </div>
                <div class="chapter-meta">
                  <span class="chapter-date">
                    <i class="i-lucide-calendar mr-1"></i>
                    {{ chapter.date }}
                  </span>
                  <i :class="['chapter-toggle', chapter.expanded ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down']"></i>
                </div>
              </div>
              <div class="chapter-content" v-if="chapter.expanded">
                <div class="chapter-sections">
                  <div class="section-item" v-for="section in chapter.sections" :key="section.id">
                    <div class="section-header">
                      <div class="section-title-container">
                        <span class="section-number">
                          {{ (chapter && typeof chapter.number === 'string') ? chapter.number.replace('第', '').replace('章', '') : '' }}.{{ section.number }}
                        </span>
                        <h4 class="section-title">{{ section.title }}</h4>
                      </div>
                      <span class="section-duration">
                        <i class="i-lucide-clock mr-1"></i>
                        {{ section.duration }}
                      </span>
                    </div>
                    <p class="section-description">{{ section.description }}</p>
                  </div>
    
                </div>
                <div class="chapter-actions">
    
                  <button class="btn btn-sm btn-outline danger" @click="confirmDeleteChapter(chapter.id)">
                    <i class="i-lucide-trash-2 mr-1"></i>
                    删除章节
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
    
        <!-- Course Exercises Tab -->
        <div v-if="activeTab === 'exercises'" class="exercises-view">
          <div class="panel-header">
            <h2 class="panel-title">课程练习</h2>
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
              <button class="btn btn-sm btn-primary" @click="goToTeacherCreateTask">
                <i class="i-lucide-file-plus mr-1"></i>
                发布练习
              </button>
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
              <div class="exercise-card-header">
                <div class="chapter-badge">
                  <i class="i-lucide-book mr-1"></i>
                  {{ exercise.chapter }}
                </div>
                <span class="badge status-badge" :class="{ 'status-completed': exercise.status === '已结束' }">
                  {{ exercise.status }}
                </span>
              </div>
              <div class="exercise-content">
                <div class="exercise-header">
                  <div class="exercise-title-area">
                    <h3>{{ exercise.title }}</h3>
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
                  <button class="btn btn-sm btn-default">
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
      </div>
    
      <!-- Add/Edit Chapter Modal -->
      <div v-if="showAddChapterModal" class="modal-overlay" @click="closeAddChapterModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>{{ editingChapter ? '编辑章节' : '添加新章节' }}</h3>
            <button class="btn-close" @click="closeAddChapterModal">
              <i class="i-lucide-x"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="chapterNumber">章节序号</label>
              <input type="number" id="chapterNumber" v-model.number="newChapter.order" placeholder="例如：1 (纯数字)">
            </div>
            <div class="form-group">
              <label for="chapterTitle">章节标题</label>
              <input type="text" id="chapterTitle" v-model="newChapter.title" placeholder="输入章节标题">
            </div>
            <div class="form-actions">
              <button class="btn btn-default" @click="closeAddChapterModal">取消</button>
              <button class="btn btn-primary" @click="saveChapter">{{ editingChapter ? '更新章节' : '添加章节' }}</button>
            </div>
          </div>
        </div>
      </div>
    
      <!-- Add Section Modal -->
      <div v-if="showAddSectionModalRef" class="modal-overlay" @click="closeAddSectionModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>{{ editingSection ? '编辑小节' : '添加新小节' }}</h3>
            <button class="btn-close" @click="closeAddSectionModal">
              <i class="i-lucide-x"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="sectionNumber">小节编号</label>
              <input type="text" id="sectionNumber" v-model="newSection.number" placeholder="例如：1">
            </div>
            <div class="form-group">
              <label for="sectionTitle">小节标题</label>
              <input type="text" id="sectionTitle" v-model="newSection.title" placeholder="输入小节标题">
            </div>
            <div class="form-group">
              <label for="sectionDescription">小节描述</label>
              <textarea id="sectionDescription" v-model="newSection.description" placeholder="输入小节描述" rows="3"></textarea>
            </div>
            <div class="form-group">
              <label for="sectionDuration">小节时长</label>
              <input type="text" id="sectionDuration" v-model="newSection.duration" placeholder="例如：45分钟">
            </div>
            <div class="form-actions">
              <button class="btn btn-default" @click="closeAddSectionModal">取消</button>
              <button class="btn btn-primary" @click="saveSection">{{ editingSection ? '保存' : '添加' }}</button>
            </div>
          </div>
        </div>
      </div>
    
      <!-- Upload Resource Modal -->
      <div v-if="showUploadResourceModal" class="modal-overlay" @click="closeUploadResourceModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>{{ editingResource ? '编辑资源' : '上传课程资源' }}</h3>
            <button class="btn-close" @click="closeUploadResourceModal">
              <i class="i-lucide-x"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="resourceChapterOrder">资源所属章节号</label>
              <input type="number" id="resourceChapterOrder" v-model.number="newResource.chapterOrder" placeholder="输入章节序号 (例如: 1, 2, ...)">
            </div>
            <div class="form-group">
              <label for="resourceType">资源类型</label>
              <select id="resourceType" v-model="newResource.type">
                <option value="pdf">PDF文档</option>
                <option value="ppt">演示文稿</option>
                <option value="video">视频</option>
                <option value="code">编程示例</option>
                <option value="zip">压缩文件</option>
                <option value="image">图片</option>
                <option value="other">其他</option>
              </select>
            </div>
            <div class="form-group" v-if="!editingResource">
              <label for="resourceFile">选择文件</label>
              <div class="file-upload-container">
                <input type="file" id="resourceFile" @change="handleFileChange" class="file-input">
                <div class="file-upload-box" @click="triggerFileInput" @dragover.prevent @drop.prevent="handleFileDrop">
                  <i class="i-lucide-upload-cloud upload-icon"></i>
                  <p class="upload-text">点击或拖拽文件到此处上传</p>
                  <p class="upload-hint">支持 PDF, PPT, Word, 视频, 压缩包等格式</p>
                </div>
                <div v-if="selectedFile" class="selected-file">
                  <i :class="getResourceIcon(getFileType(selectedFile.name))"></i>
                  <span>{{ selectedFile.name }}</span>
                  <span class="file-size">({{ formatFileSize(selectedFile.size) }})</span>
                  <button class="btn-icon" @click.stop="removeSelectedFile">
                    <i class="i-lucide-x"></i>
                  </button>
                </div>
              </div>
            </div>
            <div v-if="editingResource" class="form-group version-group">
              <div class="version-header">
                <label for="versionDescription">版本更新说明</label>
                <span class="version-badge">当前版本：v{{ editingResource.currentVersion }}</span>
              </div>
              <textarea
                id="versionDescription"
                v-model="newResource.versionDescription"
                placeholder="请描述本次更新的主要内容"
                rows="2"
              ></textarea>
            </div>
    
            <div v-if="editingResource && editingResource.versions?.length > 0" class="form-group version-history">
              <div class="version-header">
                <label class="version-label">历史版本</label>
                <span class="version-count">共 {{ editingResource.versions.length }} 个版本</span>
              </div>
              <div class="version-list">
                <div v-for="version in editingResource.versions" :key="version.version" class="version-item">
                  <div class="version-item-header">
                    <div class="version-info">
                      <span class="version-number">v{{ version.version }}</span>
                      <span class="version-date">{{ version.uploadDate }}</span>
                      <span class="version-size">{{ formatFileSize(version.size) }}</span>
                    </div>
                    <div class="version-actions">
                      <button class="btn-icon" title="下载此版本" @click="downloadVersion(editingResource.id, version)">
                        <i class="i-lucide-download"></i>
                      </button>
                      <button
                        v-if="canPreview(editingResource.type)"
                        class="btn-icon"
                        title="预览此版本"
                        @click="previewVersion(editingResource.id, version)"
                      >
                        <i class="i-lucide-eye"></i>
                      </button>
                    </div>
                  </div>
                  <p class="version-desc">{{ version.description }}</p>
                  <div class="version-meta">
                    <span class="version-author">
                      <i class="i-lucide-user mr-1"></i>
                      {{ version.uploadedBy }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
    
            <div class="form-group permission-group">
              <label class="permission-label">查看权限设置</label>
              <div class="permission-settings">
                <div class="visibility-toggle">
                  <button
                    class="visibility-btn"
                    :class="{ active: resourcePermissions.visibility === 'all' }"
                    @click="resourcePermissions.visibility = 'all'"
                  >
                    <i class="i-lucide-users"></i>
                    <span>所有人可见</span>
                  </button>
                  <button
                    class="visibility-btn"
                    :class="{ active: resourcePermissions.visibility === 'specific' }"
                    @click="resourcePermissions.visibility = 'specific'"
                  >
                    <i class="i-lucide-user-check"></i>
                    <span>特定班级可见</span>
                  </button>
                </div>
    
                <transition name="fade">
                  <div v-if="resourcePermissions.visibility === 'specific'" class="class-select">
                    <div class="class-list">
                      <label
                        v-for="cls in availableClassesForPermissions"
                        :key="cls.id"
                        class="class-option"
                        :class="{ selected: resourcePermissions.selectedClasses.includes(cls.id) }"
                      >
                        <input
                          type="checkbox"
                          :value="cls.id"
                          v-model="resourcePermissions.selectedClasses"
                        >
                        {{ cls.name }}
                      </label>
                    </div>
                  </div>
                </transition>
              </div>
            </div>
    
            <div class="form-actions">
              <button class="btn btn-default" @click="closeUploadResourceModal">取消</button>
              <button class="btn btn-primary" @click="uploadResource">
                {{ editingResource ? '保存' : '上传' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    
      <!-- Publish Exercise Modal -->
      <div v-if="showPublishExerciseModal" class="modal-overlay" @click="closePublishExerciseModal">
        <div class="modal-content exercise-modal" @click.stop>
          <div class="modal-header">
            <h3>发布新练习</h3>
            <button class="btn-close" @click="closePublishExerciseModal">
              <i class="i-lucide-x"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="exerciseTitle">练习标题</label>
              <input type="text" id="exerciseTitle" v-model="newExercise.title" placeholder="输入练习标题">
            </div>
    
            <div class="form-group">
              <label for="exerciseChapter">所属章节</label>
              <select id="exerciseChapter" v-model="newExercise.chapter">
                <option v-for="chapter in uniqueChapters" :key="chapter" :value="chapter">
                  {{ chapter }}
                </option>
              </select>
            </div>
    
            <div class="form-group">
              <label for="exerciseDescription">练习描述</label>
              <textarea id="exerciseDescription" v-model="newExercise.description" placeholder="输入练习描述" rows="3"></textarea>
            </div>
    
            <div class="form-row">
              <div class="form-group flex-1">
                <label for="startTime">开始时间</label>
                <input type="datetime-local" id="startTime" v-model="newExercise.startTime">
              </div>
              <div class="form-group flex-1">
                <label for="endTime">截止时间</label>
                <input type="datetime-local" id="endTime" v-model="newExercise.endTime">
              </div>
            </div>
    
            <div class="form-group">
              <label>提交设置</label>
              <div
                class="submission-settings"
                :class="{ active: newExercise.allowMultipleSubmissions }"
                @click="newExercise.allowMultipleSubmissions = !newExercise.allowMultipleSubmissions"
              >
                <div class="checkbox-label">
                  <input
                    type="checkbox"
                    v-model="newExercise.allowMultipleSubmissions"
                    @click.stop
                  >
                  <i :class="newExercise.allowMultipleSubmissions ? 'i-lucide-check-circle' : 'i-lucide-circle'"></i>
                  <span>允许多次提交</span>
                </div>
                <div class="setting-hint">
                  {{ newExercise.allowMultipleSubmissions ? '学生可以多次提交，系统将记录最高分' : '学生仅能提交一次答案' }}
                </div>
              </div>
            </div>
    
            <div class="questions-section">
              <div class="section-header">
                <h4>题目列表</h4>
                <div class="total-score" v-if="newExercise.questions.length > 0">
                  总分：{{ newExercise.totalScore }} 分
                </div>
              </div>
    
              <div class="questions-list">
                <div v-if="newExercise.questions.length === 0" class="empty-questions">
                  <i class="i-lucide-file-question"></i>
                  <p>还没有添加题目</p>
                </div>
                <div v-else class="question-items">
                  <div v-for="(question, index) in newExercise.questions" :key="index" class="question-item">
                    <div class="question-header">
                      <div class="question-type-badge" :class="question.type">
                        <i :class="getQuestionTypeIcon(question.type)"></i>
                        {{ getQuestionTypeLabel(question.type) }}
                      </div>
                      <div class="question-score">{{ question.score }}分</div>
                    </div>
                    <div class="question-title">{{ question.title }}</div>
                    <div class="question-actions">
                      <button class="btn-icon" @click="editQuestion(index)" title="编辑">
                        <i class="i-lucide-edit"></i>
                      </button>
                      <button class="btn-icon danger" @click="removeQuestion(index)" title="删除">
                        <i class="i-lucide-trash-2"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
    
              <div class="questions-actions">
                <button class="btn btn-outline" @click="showQuestionBank = true">
                  <i class="i-lucide-database mr-1"></i>
                  从题库导入
                </button>
                <button class="btn btn-outline" @click="openAddQuestion">
                  <i class="i-lucide-plus mr-1"></i>
                  手动添加
                </button>
              </div>
            </div>
    
            <div class="form-actions">
              <button class="btn btn-default" @click="closePublishExerciseModal">取消</button>
              <button class="btn btn-primary" @click="publishExercise" :disabled="!canPublish">
                发布练习
              </button>
            </div>
          </div>
        </div>
      </div>
    
      <!-- 题库选择弹窗 -->
      <div v-if="showQuestionBank" class="modal-overlay" @click="showQuestionBank = false">
        <div class="modal-content question-bank-modal" @click.stop>
          <div class="modal-header">
            <h3>从题库选择</h3>
            <button class="btn-close" @click="showQuestionBank = false">
              <i class="i-lucide-x"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="question-filters">
              <div class="search-box">
                <i class="i-lucide-search search-icon"></i>
                <input type="text" placeholder="搜索题目" v-model="questionSearchQuery">
              </div>
              <div class="type-filters">
                <button
                  v-for="type in questionTypes"
                  :key="type.value"
                  class="type-filter-btn"
                  :class="{ active: selectedQuestionType === type.value }"
                  @click="selectedQuestionType = type.value"
                >
                  <i :class="type.icon"></i>
                  {{ type.label }}
                </button>
              </div>
            </div>
    
            <div class="question-bank-list">
              <div v-for="question in filteredQuestions" :key="question.id" class="bank-question-item">
                <label class="question-checkbox">
                  <input
                    type="checkbox"
                    :value="question.id"
                    v-model="selectedQuestions"
                  >
                  <span class="checkmark"></span>
                </label>
                <div class="question-content">
                  <div class="question-header">
                    <div class="question-type-badge" :class="question.type">
                      <i :class="getQuestionTypeIcon(question.type)"></i>
                      {{ getQuestionTypeLabel(question.type) }}
                    </div>
                    <div class="question-score">{{ question.score }}分</div>
                  </div>
                  <div class="question-title">{{ question.title }}</div>
                </div>
              </div>
            </div>
    
            <div class="modal-footer">
              <span class="selection-count" v-if="selectedQuestions.length > 0">
                已选择 {{ selectedQuestions.length }} 题
              </span>
              <div class="form-actions">
                <button class="btn btn-default" @click="showQuestionBank = false">取消</button>
                <button class="btn btn-primary" @click="importQuestions">
                  导入所选题目
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    
      <!-- 添加/编辑题目弹窗 -->
      <div v-if="showAddQuestionModal" class="modal-overlay" @click="closeAddQuestionModal">
        <div class="modal-content question-modal" @click.stop>
          <div class="modal-header">
            <h3>{{ currentQuestion ? '编辑题目' : '添加题目' }}</h3>
            <button class="btn-close" @click="closeAddQuestionModal">
              <i class="i-lucide-x"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label>题目类型</label>
              <div class="question-type-selector">
                <button
                  v-for="type in questionTypes"
                  :key="type.value"
                  class="type-select-btn"
                  :class="{ active: currentQuestion?.type === type.value }"
                  @click="currentQuestion.type = type.value"
                >
                  <i :class="type.icon"></i>
                  <span>{{ type.label }}</span>
                </button>
              </div>
            </div>
    
            <div class="form-group">
              <label for="questionTitle">题目标题</label>
              <input type="text" id="questionTitle" v-model="currentQuestion.title" placeholder="输入题目标题">
            </div>
    
            <div class="form-group">
              <label for="questionScore">分值</label>
              <input type="number" id="questionScore" v-model="currentQuestion.score" min="1" step="1">
            </div>
    
            <template v-if="currentQuestion?.type === 'choice'">
              <div class="form-group">
                <label>选项</label>
                <div class="options-list">
                  <div v-for="(option, index) in currentQuestion.options" :key="index" class="option-item">
                    <input type="radio" :name="'answer'" :value="index" v-model="currentQuestion.answer">
                    <input type="text" v-model="currentQuestion.options[index]" :placeholder="'选项 ' + (index + 1)">
                    <button class="btn-icon small" @click="removeOption(index)" v-if="currentQuestion.options.length > 2">
                      <i class="i-lucide-x"></i>
                    </button>
                  </div>
                </div>
                <button class="btn btn-sm btn-outline" @click="addOption">
                  <i class="i-lucide-plus mr-1"></i>
                  添加选项
                </button>
              </div>
            </template>
    
            <template v-else-if="currentQuestion?.type === 'programming'">
              <div class="form-group">
                <label for="questionDescription">题目描述</label>
                <textarea id="questionDescription" v-model="currentQuestion.description" rows="4" placeholder="输入题目描述"></textarea>
              </div>
              <div class="form-group">
                <label>测试用例</label>
                <div class="test-cases">
                  <div v-for="(testCase, index) in currentQuestion.testCases" :key="index" class="test-case">
                    <div class="test-case-inputs">
                      <input type="text" v-model="testCase.input" placeholder="输入">
                      <input type="text" v-model="testCase.output" placeholder="期望输出">
                    </div>
                    <button class="btn-icon small" @click="removeTestCase(index)">
                      <i class="i-lucide-x"></i>
                    </button>
                  </div>
                </div>
                <button class="btn btn-sm btn-outline" @click="addTestCase">
                  <i class="i-lucide-plus mr-1"></i>
                  添加测试用例
                </button>
              </div>
            </template>
    
            <div class="form-actions">
              <button class="btn btn-default" @click="closeAddQuestionModal">取消</button>
              <button class="btn btn-primary" @click="saveQuestion">
                {{ currentQuestion ? '保存' : '添加' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    
      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteConfirmation" class="modal-overlay" @click="closeDeleteConfirmation">
        <div class="modal-content confirmation-modal" @click.stop>
          <div class="modal-header">
            <h3>确认删除</h3>
            <button class="btn-close" @click="closeDeleteConfirmation">
              <i class="i-lucide-x"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="confirmation-icon">
              <i class="i-lucide-alert-triangle"></i>
            </div>
            <p class="confirmation-message">{{ deleteConfirmationMessage }}</p>
            <div class="form-actions">
              <button class="btn btn-default" @click="closeDeleteConfirmation">取消</button>
              <button class="btn btn-danger" @click="confirmDelete">删除</button>
            </div>
          </div>
        </div>
      </div>
    
      <!-- Resource Preview Modal -->
      <div v-if="showResourcePreview" class="modal-overlay" @click="closeResourcePreview">
        <div class="modal-content preview-modal" @click.stop>
          <div class="modal-header">
            <h3>{{ previewingResource?.title }}</h3>
            <button class="btn-close" @click="closeResourcePreview">
              <i class="i-lucide-x"></i>
            </button>
          </div>
          <div class="modal-body preview-content">
            <div v-if="previewingResource?.type === 'pdf'" class="pdf-preview">
              <div class="pdf-placeholder">
                <i class="i-lucide-file-text"></i>
                <p>PDF预览</p>
                <p class="preview-note">在实际应用中，这里会嵌入PDF预览器</p>
              </div>
            </div>
            <div v-else-if="previewingResource?.type === 'video'" class="video-preview">
              <video controls class="video-player">
                <source :src="previewingResource.url || '/placeholder.mp4'" type="video/mp4">
                您的浏览器不支持视频播放
              </video>
            </div>
            <div v-else-if="previewingResource?.type === 'ppt'" class="ppt-preview">
              <div class="ppt-placeholder">
                <i class="i-lucide-presentation"></i>
                <p>PPT预览</p>
                <p class="preview-note">在实际应用中，这里会嵌入PPT预览器</p>
              </div>
            </div>
            <div v-else-if="previewingResource?.type === 'code'" class="code-preview">
              <div class="code-header">
                <span class="code-language">{{ getLanguageName(previewingResource?.language) }}</span>
                <button class="btn-icon" title="复制代码" @click="copyCode">
                  <i class="i-lucide-copy"></i>
                </button>
              </div>
              <pre class="code-block"><code>{{ previewingResource?.code || '// 这里是示例代码\npublic class HelloWorld {\n  public static void main(String[] args) {\n      System.out.println("Hello, World!");\n  }\n}' }}</code></pre>
            </div>
            <div v-else-if="previewingResource?.type === 'image'" class="image-preview">
              <img :src="previewingResource.url || '/placeholder.svg?height=300&width=400'" alt="图片预览" class="preview-image">
            </div>
          </div>
        </div>
      </div>
    
      <!-- Edit Chapter Modal -->
      <div v-if="showEditChapterModal" class="modal-overlay" @click="closeEditChapterModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>编辑章节</h3>
            <button class="btn-close" @click="closeEditChapterModal">
              <i class="i-lucide-x"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="editChapterNumber">章节编号</label>
              <input type="text" id="editChapterNumber" v-model="editingChapter.number" placeholder="例如：第1章">
            </div>
            <div class="form-group">
              <label for="editChapterTitle">章节标题</label>
              <input type="text" id="editChapterTitle" v-model="editingChapter.title" placeholder="输入章节标题">
            </div>
            <div class="form-actions">
              <button class="btn btn-default" @click="closeEditChapterModal">取消</button>
              <button class="btn btn-primary" @click="updateChapter">保存</button>
            </div>
          </div>
        </div>
      </div>
    
      <!-- Outline Edit Modal -->
      <div v-if="showOutlineEditModal" class="modal-overlay" @click="closeOutlineEditModal">
        <div class="modal-content outline-edit-modal" @click.stop>
          <div class="modal-header">
            <h3>编辑课程大纲</h3>
            <button class="btn-close" @click="closeOutlineEditModal">
              <i class="i-lucide-x"></i>
            </button>
          </div>
          <div class="modal-body">
                <div class="form-group">
              <label for="outlineContent">课程大纲内容</label>
              <textarea
                id="outlineContent"
                v-model="editingOutline"
                class="form-control"
                rows="15"
                placeholder="请输入课程大纲内容"
              ></textarea>
                </div>
            <div class="form-actions">
              <button class="btn btn-default" @click="closeOutlineEditModal">取消</button>
              <button class="btn btn-primary" @click="saveOutlineChanges">保存更改</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
      <!-- Create Class Modal -->
      <div v-if="showCreateClassModal" class="modal-overlay" @click="closeCreateClassModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>创建新班级</h3>
            <button class="btn-close" @click="closeCreateClassModal">
              <i class="i-lucide-x"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group">
              <label for="newClassName">班级名称</label>
              <input type="text" id="newClassName" v-model="newClassName" placeholder="请输入班级名称">
            </div>
            <div class="form-group">
              <label for="newClassCode">班级邀请码</label>
              <input type="text" id="newClassCode" v-model="newClassCode" placeholder="请输入班级邀请码">
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-default" @click="closeCreateClassModal">取消</button>
            <button class="btn btn-primary" @click="handleCreateClass">创建</button>
          </div>
        </div>
      </div>
    </template>
    
    <script setup>
    import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
    import { createClass } from '@/api/courseManagement.js'; // 确保路径正确
    import { useUserStore } from '@/stores/user';
    import { useCourseStore } from '@/stores/course';
    import { useRouter, useRoute } from 'vue-router';
    import { getCourseDetail } from '@/api/course';
    import { getMaterials, getCourseMaterials, uploadCourseMaterialFile } from '@/api/materials';
    import { getClassAssignments } from '@/api/class';
    import { getCourseClasses } from '@/api/course';
    import { updateCourseOutline, updateCourseChapters } from '@/api/courseDetails'; // Added updateCourseChapters
    import headImage from '@/assets/head.jpg';
    const userStore = useUserStore();
    const courseStore = useCourseStore();
    const router = useRouter();
    const route = useRoute();
    
    // Loading and error states
    const loading = ref(false);
    const error = ref('');
    const availableClassesForPermissions = ref([]); // New ref for dynamic class list
    const rawOutlineFromApi = ref(''); // Stores the raw outline string from API
    const currentFullCourseData = ref(null); // Stores the full course object from API load
    
    // 从 store 获取课程ID
    const courseId = computed(() => courseStore.currentCourseId);
    
    // 用户信息
    const userInfo = ref({
      id: 1,
      name: '张教授',
      avatar: headImage,
      role: '教师',
      isOnline: true
    });
    
    // 跳转到新建练习页面
    const goToTeacherCreateTask = () => {
      // 跳转前确保设置好当前课程ID和名称
      //courseStore.setCurrentCourse(courseId.value, courseName.value);
      router.push({ name: 'TeacherCreateTask' });
    };
    
    // 导航到个人中心页面
    const navigateToProfile = () => {
      router.push('/teacher/profile')
    };
    
    // 导航到班级管理页面
    const navigateToClassManagement = () => {
      router.push(`/course/:id/management`);
    };
    
    // Course information
    /*
    const courseName = ref('JavaSE');
    const courseStudents = ref('1968');
    const courseDuration = ref('2班');
    */
    const courseName = ref('');
    const courseStudents = ref('');
    const courseDuration = ref('');
    // Tabs
    const tabs = [
      { id: 'outline', name: '课程大纲', icon: 'i-lucide-file-text' },
      { id: 'resources', name: '课程资源', icon: 'i-lucide-folder' },
      { id: 'chapters', name: '课程章节', icon: 'i-lucide-book' },
    ];
    const activeTab = ref('resources');  // 默认显示课程资源页面
    
    // 课程大纲数据
    /*
    const courseOutline = ref([
      {
        title: '课程介绍',
        description: '本课程将介绍Java SE的基础知识，包括语法、面向对象编程、集合框架等内容。',
        points: [
          '了解Java的历史和发展',
          '掌握Java的基本语法和数据类型',
          '理解面向对象编程的核心概念'
        ]
      },
      {
        title: '学习目标',
        description: '通过本课程的学习，学生将能够：',
        points: [
          '熟练掌握Java语言的基本语法和特性',
          '能够使用Java进行面向对象程序设计',
          '掌握Java集合框架的使用方法',
          '了解Java异常处理机制',
          '能够使用Java进行文件操作和IO流处理'
        ]
      },
      {
        title: '考核方式',
        description: '本课程的考核方式包括：',
        points: [
          '平时作业：30%',
          '课堂表现：10%',
          '期中考试：20%',
          '期末考试：40%'
        ]
      }
    ]);
    */
    const courseOutline = ref([]);
    
    // 课程资源数据
    /*
    const courseResources = ref([
      {
        id: 1,
        title: 'Java编程思想（第4版）',
        type: 'pdf',
        size: 15728640, // 15MB
        uploadDate: '2023-09-01 10:30:45',
        description: '经典的Java编程书籍，涵盖了Java语言的方方面面。',
        url: null,
        currentVersion: '1.2',
        versions: [
          {
            version: '1.2',
            uploadDate: '2023-09-15 14:30:00',
            size: 15728640,
            description: '更新了第3章的部分内容，修正了一些错误',
            url: null,
            uploadedBy: '张教授'
          },
          {
            version: '1.1',
            uploadDate: '2023-09-08 11:20:00',
            size: 15728000,
            description: '修正了格式问题',
            url: null,
            uploadedBy: '张教授'
          },
          {
            version: '1.0',
            uploadDate: '2023-09-01 10:30:45',
            size: 15727000,
            description: '初始版本',
            url: null,
            uploadedBy: '张教授'
          }
        ]
      },
      {
        id: 2,
        title: 'Java核心技术卷I（原书第11版）',
        type: 'pdf',
        size: 20971520, // 20MB
        uploadDate: '2023-09-01 10:35:22',
        description: '全面介绍Java SE的各项特性，包括语言基础、对象、接口、Lambda表达式等。',
        url: null
      },
      {
        id: 3,
        title: 'Java基础语法讲解',
        type: 'ppt',
        size: 5242880, // 5MB
        uploadDate: '2023-09-05 14:20:10',
        description: '第一章课程PPT，详细讲解Java基础语法。',
        url: null
      },
      {
        id: 4,
        title: '面向对象编程示例代码',
        type: 'code',
        size: 3145728, // 3MB
        uploadDate: '2023-09-10 16:45:30',
        description: '面向对象编程的示例代码，包含类、继承、多态等概念的实现。',
        language: 'java',
        code: 'public class Person {\n  private String name;\n  private int age;\n\n  public Person(String name, int age) {\n    this.name = name;\n    this.age = age;\n  }\n\n  public void sayHello() {\n    System.out.println("Hello, my name is " + name);\n  }\n}'
      },
      {
        id: 5,
        title: 'Java集合框架详解视频',
        type: 'video',
        size: 104857600, // 100MB
        uploadDate: '2023-09-15 09:15:40',
        description: '详细讲解Java集合框架的视频教程，包括List、Set、Map等集合类的使用方法。',
        url: '/videos/java-collections.mp4'
      },
      {
        id: 6,
        title: 'Java多线程编程实例',
        type: 'code',
        size: 2097152, // 2MB
        uploadDate: '2023-09-20 11:30:25',
        description: '多线程编程的示例代码，包含线程创建、同步、通信等内容。',
        language: 'java',
        code: 'public class ThreadExample {\n  public static void main(String[] args) {\n    Thread thread = new Thread(() -> {\n      System.out.println("Thread is running");\n    });\n    thread.start();\n  }\n}'
      },
      {
        id: 7,
        title: 'Java异常处理机制',
        type: 'ppt',
        size: 4194304, // 4MB
        uploadDate: '2023-09-25 15:10:18',
        description: '第三章课程PPT，详细讲解Java异常处理机制。',
        url: null
      }
    ]);
    */
    const courseResources = ref([]);
    
    // 课程章节数据
    /*
    const courseChapters = ref([
      {
        id: 1,
        number: '第1章',
        title: 'Java基础',
        description: '本章介绍Java的基本语法、数据类型、运算符和控制流程。',
        date: '2023-09-14 09:00:15',
        expanded: true,
        sections: [
          {
            id: 1,
            number: 1,
            title: 'Java简介',
            description: '介绍Java的历史、特点和应用领域。',
            duration: '45分钟'
          },
          {
            id: 2,
            number: 2,
            title: '开发环境搭建',
            description: '安装JDK和配置开发环境。',
            duration: '60分钟'
          },
          {
            id: 3,
            number: 3,
            title: '基本语法',
            description: '学习Java的基本语法规则、标识符和关键字。',
            duration: '90分钟'
          }
        ]
      },
      {
        id: 2,
        number: '第2章',
        title: '面向对象编程基础',
        description: '本章介绍面向对象编程的基本概念和Java中的实现方式。',
        date: '2023-09-17 09:00:23',
        expanded: false,
        sections: [
          {
            id: 4,
            number: 1,
            title: '类与对象',
            description: '理解类和对象的概念，学习如何定义类和创建对象。',
            duration: '90分钟'
          },
          {
            id: 5,
            number: 2,
            title: '继承与多态',
            description: '学习Java中的继承机制和多态性。',
            duration: '120分钟'
          }
        ]
      }
    ]);
    */
    const courseChapters = ref([]);
    
    // Exercises data with chapter information
    /*
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
        title: 'Java异常处理',
        date: '2023-10-05 14:15:30',
        description: '理解Java异常处理机制，学习如何使用try-catch-finally语句块处理异常，以及如何自定义异常类。',
        submissions: 5,
        accuracy: 92,
        pending: 2,
        status: '进行中',
        chapter: '第3章：异常处理'
      }
    ]);
    */
    const exercises = ref([]);
    
    // 模态框状态
    const showAddChapterModal = ref(false);
    const showAddSectionModalRef = ref(false);
    const showPublishExerciseModal = ref(false);
    const showDeleteConfirmation = ref(false);
    const showUploadResourceModal = ref(false);
    const showResourcePreview = ref(false);
    const showResourceFilterMenu = ref(false);
    const showEditChapterModal = ref(false);
    const showOutlineEditModal = ref(false);
    
    // 编辑状态
    const editingChapter = ref(null);
    const editingSection = ref(false);
    const editingResource = ref(false);
    // const chapterToDelete = ref(null); // Replaced by chapterIdMarkedForDelete and chapterOrderToFilterBy
    const chapterIdMarkedForDelete = ref(null);
    const chapterOrderToFilterBy = ref(null);
    const sectionToDelete = ref(null);
    const resourceToDelete = ref(null);
    const currentChapterId = ref(null);
    const currentSectionId = ref(null);
    const deleteType = ref(''); // 'chapter', 'section', 'resource'
    const previewingResource = ref(null);
    const editingOutline = ref(null);
    
    // 新章节、小节和资源数据
    const newChapter = ref({
      // id: null, // ID will be assigned by backend or implicitly by array index if not sent
      order: null, // Chapter order/number
      title: ''
      // sections: [] // Sections are not managed when adding a new chapter title/order initially
    });
    
    const newSection = ref({
      id: null,
      number: '',
      title: '',
      description: '',
      duration: ''
    });
    
    const newResource = ref({
      id: null,
      title: '',
      type: 'pdf',
      chapterOrder: 1,
      description: '',
      size: 0,
      language: 'java',
      code: '',
      url: null,
      currentVersion: '1.0',
      versionDescription: '',
      versions: []
    });
    
    const newExercise = ref({
      title: '',
      chapter: '',
      description: '',
      startTime: '',
      endTime: '',
      allowMultipleSubmissions: false,
      questions: [],
      totalScore: 0
    });
    
    // 文件上传相关
    const fileInput = ref(null);
    const thumbnailInput = ref(null);
    const selectedFile = ref(null);
    const selectedThumbnail = ref(null);
    
    // 练习筛选相关
    const exerciseSearchQuery = ref('');
    const statusFilter = ref(null);
    const showStatusFilter = ref(false);
    const statusFilterDropdown = ref(null);
    const chapterFilter = ref(null);
    const showChapterFilter = ref(false);
    const chapterFilterDropdown = ref(null);
    
    // 资源筛选相关
    const resourceSearchQuery = ref('');
    const resourceTypeFilter = ref(null);
    
    // 资源类型定义
    const resourceTypes = [
      { value: 'pdf', label: 'PDF文档' },
      { value: 'ppt', label: '演示文稿' },
      { value: 'video', label: '视频' },
      { value: 'code', label: '编程示例' },
      { value: 'zip', label: '压缩文件' },
      { value: 'image', label: '图片' },
      { value: 'other', label: '其他' }
    ];
    
    // 获取所有唯一的章节
    const uniqueChapters = computed(() => {
      const chapters = new Set();
      exercises.value.forEach(exercise => {
        chapters.add(exercise.chapter);
      });
      return Array.from(chapters);
    });
    
    // Computed property for status filter label
    const statusFilterLabel = computed(() => {
      return statusFilter.value || '全部';
    });
    
    // Computed property for chapter filter label
    const chapterFilterLabel = computed(() => {
      return chapterFilter.value ? chapterFilter.value.replace(/第\d+章：/, '') : '全部章节';
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
    
    // 过滤后的资源列表
    const filteredResources = computed(() => {
      let result = courseResources.value;
    
      // 应用类型筛选
      if (resourceTypeFilter.value) {
        result = result.filter(resource => resource.type === resourceTypeFilter.value);
      }
    
      // 应用搜索筛选
      if (resourceSearchQuery.value) {
        const query = resourceSearchQuery.value.toLowerCase();
        result = result.filter(resource =>
          resource.filename.toLowerCase().includes(query) ||
          (resource.description && resource.description.toLowerCase().includes(query))
        );
      }
    
      return result;
    });
    
    // Computed property for upload button state
    const canUpload = computed(() => {
      return editingResource.value || (newResource.value.title && selectedFile.value);
    });
    
    // 删除确认信息
    const deleteConfirmationMessage = computed(() => {
      if (deleteType.value === 'chapter') {
        return '您确定要删除这个章节吗？此操作将同时删除章节下的所有小节，且无法撤销。';
      } else if (deleteType.value === 'section') {
        return '您确定要删除这个小节吗？此操作无法撤销。';
      } else if (deleteType.value === 'resource') {
        return '您确定要删除这个资源吗？此操作无法撤销。';
      }
      return '您确定要删除吗？此操作无法撤销。';
    });
    
    // 切换章节展开/折叠状态
    const toggleChapter = (chapterId) => {
      const chapter = courseChapters.value.find(ch => ch.id === chapterId);
      if (chapter) {
        chapter.expanded = !chapter.expanded;
      }
    };
    
    // 添加/编辑章节
    const saveChapter = async () => {
      // Validate input for adding a new chapter
      if (!editingChapter.value) { // This block is for ADDING a new chapter
        if (!newChapter.value.title || newChapter.value.title.trim() === '') {
          alert('章节标题不能为空。');
          return;
        }
        if (newChapter.value.order === null || newChapter.value.order === undefined || newChapter.value.order <= 0) {
          alert('章节序号必须是一个正数。');
          return;
        }
        if (!currentFullCourseData.value) {
          alert('课程基础数据未加载，无法添加章节。');
          console.error("Error in saveChapter (add mode): currentFullCourseData.value is null or undefined.");
          return;
        }
    
        try {
          loading.value = true;
          error.value = '';
    
          const existingChapters = Array.isArray(currentFullCourseData.value.chapters) ? [...currentFullCourseData.value.chapters] : [];
          
          const newChapterToAdd = {
            // id: null, // Backend should generate ID for new chapter
            title: newChapter.value.title.trim(),
            order: newChapter.value.order,
            // Add any other default fields for a new chapter if necessary, e.g., description, sections, expanded
            description: '', 
            sections: [],
            expanded: true 
          };
          
          const updatedChaptersArray = [...existingChapters, newChapterToAdd];
          // Optional: Sort chapters by order again if necessary, though adding to end and relying on backend sort might be fine.
          // updatedChaptersArray.sort((a, b) => a.order - b.order);
    
          const courseObjectToSend = { ...currentFullCourseData.value }; // Create a copy of the full course data
          courseObjectToSend.chapters = updatedChaptersArray; // Set the updated chapters array
          
          // If the backend still expects chapters as a JSON string in the outline field of the FULL object:
          // courseObjectToSend.outline = JSON.stringify(updatedChaptersArray);
          // And potentially delete courseObjectToSend.chapters if the backend gets confused by having both.
          // For now, assuming backend handles 'chapters' array in the full course object directly.
    
          const response = await updateCourseChapters(courseId.value, courseObjectToSend);
    
          if (response && response.data && response.data.data) {
            const updatedCourseFromResponse = response.data.data;
            currentFullCourseData.value = updatedCourseFromResponse; // Update the stored full course data
    
            // Re-populate local display refs from the new full course data
            courseName.value = currentFullCourseData.value.name || '';
            courseStudents.value = currentFullCourseData.value.studentCount?.toString() || '0';
            courseDuration.value = currentFullCourseData.value.duration || '';
            rawOutlineFromApi.value = currentFullCourseData.value.outline || '';
    
            // Parse outline for courseOutline.value
            const outlineStringToParse = rawOutlineFromApi.value;
            if (typeof outlineStringToParse === 'string' && outlineStringToParse.trim().startsWith('[')) {
              try {
                const parsed = JSON.parse(outlineStringToParse);
                courseOutline.value = Array.isArray(parsed) ? parsed : [{ title: "课程大纲", description: outlineStringToParse, points: [] }];
              } catch (e) {
                courseOutline.value = [{ title: "课程大纲 (解析失败)", description: outlineStringToParse, points: [] }];
              }
            } else if (typeof outlineStringToParse === 'string') {
              courseOutline.value = [{ title: "课程大纲", description: outlineStringToParse, points: [] }];
        } else {
              courseOutline.value = [];
            }
    
            // Update courseChapters.value from the definitive chapters field in the response
            if (currentFullCourseData.value.chapters && Array.isArray(currentFullCourseData.value.chapters)) {
                courseChapters.value = currentFullCourseData.value.chapters.map((chapter, index) => ({
                    id: chapter.id || 'ch-' + index + '-' + Date.now(), // Ensure IDs if backend doesn't return them for new chapters
                    title: chapter.title || '章节 ' + (index + 1),
                    order: chapter.order || index + 1,
                    description: chapter.description || '',
                    sections: chapter.sections || [],
                    expanded: chapter.expanded === undefined ? true : chapter.expanded,
                }));
            } else {
                // Fallback if chapters are not directly in the response, try parsing from outline (less likely now)
                console.warn("No direct 'chapters' array in response, attempting to parse from outline as fallback.");
                if (typeof outlineStringToParse === 'string' && outlineStringToParse.trim().startsWith('[')) {
                     try {
                        const parsedChapters = JSON.parse(outlineStringToParse);
                        if(Array.isArray(parsedChapters)) {
                             courseChapters.value = parsedChapters.map((chapter, index) => ({
                                id: chapter.id || 'ch-' + index + '-' + Date.now(),
                                title: chapter.title || '章节 ' + (index + 1),
                                order: chapter.order || index + 1,
                                description: chapter.description || '',
                                sections: chapter.sections || [],
                                expanded: chapter.expanded === undefined ? true : chapter.expanded,
                            }));
                        } else { courseChapters.value = []; }
                     } catch (e) { courseChapters.value = []; }
                } else { courseChapters.value = []; }
        }
    
        closeAddChapterModal();
          } else {
            console.error("添加章节后API未返回有效数据或数据格式不正确", response);
            error.value = "添加成功，但未能正确刷新数据显示。请检查API响应。";
            alert(error.value);
          }
        } catch (err) {
          console.error('添加章节失败:', err);
          error.value = err.response?.data?.message || err.message || '添加章节失败，请重试';
          alert(`添加章节失败: ${error.value}`);
        } finally {
          loading.value = false;
        }
    
      } else { // Logic for EDITING an existing chapter
        // This part calls updateChapter, which likely needs similar changes if it also needs to send the full course object.
        // For now, focusing on ADDING a chapter.
        console.log("Editing existing chapter - calling updateChapter(). Review updateChapter() logic if necessary.");
        updateChapter(); 
      }
    };
    
    // 编辑章节
    const editChapter = (chapterId) => {
      const chapter = courseChapters.value.find(ch => ch.id === chapterId);
      if (chapter) {
        editingChapter.value = { ...chapter };
        showEditChapterModal.value = true;
      }
    };
    
    // 更新章节
    const updateChapter = () => {
      if (editingChapter.value && editingChapter.value.id && editingChapter.value.number && editingChapter.value.title) {
        const index = courseChapters.value.findIndex(ch => ch.id === editingChapter.value.id);
        if (index !== -1) {
          // 保留原有的expanded状态和sections
          const expanded = courseChapters.value[index].expanded;
          const sections = courseChapters.value[index].sections;
    
          courseChapters.value[index] = {
            ...editingChapter.value,
            expanded,
            sections
          };
    
          closeEditChapterModal();
        }
      }
    };
    
    // 确认删除章节
    const confirmDeleteChapter = (idOfChapterToMark) => {
      const chapterObj = courseChapters.value.find(ch => String(ch.id) === String(idOfChapterToMark));
      
      if (!chapterObj || typeof chapterObj.order !== 'number') {
        console.error('Chapter not found in courseChapters or has invalid order for deletion:', idOfChapterToMark, chapterObj);
        alert('无法准备删除章节：未在当前章节列表中找到该章节，或章节信息不完整。');
        return;
      }
      
      chapterIdMarkedForDelete.value = idOfChapterToMark;
      chapterOrderToFilterBy.value = chapterObj.order;
      deleteType.value = 'chapter';
      showDeleteConfirmation.value = true;
    };
    
    // 确认删除小节
    const confirmDeleteSection = (chapterId, sectionId) => {
      currentChapterId.value = chapterId;
      sectionToDelete.value = sectionId;
      deleteType.value = 'section';
      showDeleteConfirmation.value = true;
    };
    
    // 确认删除资源
    const confirmDeleteResource = (resource) => {
      resourceToDelete.value = resource.id;
      deleteType.value = 'resource';
      showDeleteConfirmation.value = true;
    };
    
    // 执行删除操作
    const confirmDelete = async () => {
      if (deleteType.value === 'chapter' && chapterOrderToFilterBy.value !== null && chapterOrderToFilterBy.value !== undefined) {
        if (!currentFullCourseData.value) {
          alert("课程基础数据未加载，无法删除章节。");
          console.error("Error in confirmDelete (chapter): currentFullCourseData.value is null or undefined.");
          chapterIdMarkedForDelete.value = null; // Reset specific refs for chapter deletion
          chapterOrderToFilterBy.value = null;
          closeDeleteConfirmation();
          return;
        }
    
        try {
          loading.value = true;
          error.value = '';
    
          const courseObjectCopy = JSON.parse(JSON.stringify(currentFullCourseData.value));
          const orderToDelete = chapterOrderToFilterBy.value;
          
          const initialChapterCount = courseObjectCopy.chapters ? courseObjectCopy.chapters.length : 0;
          
          // Filter courseObjectCopy.chapters by order. API chapters should have 'order'.
          courseObjectCopy.chapters = courseObjectCopy.chapters
            ? courseObjectCopy.chapters.filter(apiChapter => {
                // Ensure apiChapter.order exists and is a number before comparing
                return typeof apiChapter.order === 'number' && apiChapter.order !== orderToDelete;
              })
            : [];
          
          if (courseObjectCopy.chapters.length === initialChapterCount && initialChapterCount > 0) {
              console.warn("Chapter with ORDER:", orderToDelete, "not found for deletion in API data copy or list was already filtered. Current API chapters:", courseObjectCopy.chapters);
              // This might happen if the chapter was already deleted by another means or if order matching failed.
              // For safety, you might want to alert the user or re-fetch data if this state is unexpected.
          } else if (initialChapterCount === 0 && courseObjectCopy.chapters.length === 0) {
              console.log("Attempted to delete from an already empty chapter list.");
          }
    
          const response = await updateCourseChapters(courseId.value, courseObjectCopy);
    
          if (response && response.data && response.data.data) {
            const updatedCourseFromResponse = response.data.data;
            currentFullCourseData.value = updatedCourseFromResponse; // Update the stored full course data
    
            // Re-populate local display refs from the new full course data
            courseName.value = currentFullCourseData.value.name || '';
            courseStudents.value = currentFullCourseData.value.studentCount?.toString() || '0'; 
            courseDuration.value = currentFullCourseData.value.duration || '';
            rawOutlineFromApi.value = currentFullCourseData.value.outline || '';
    
            // Re-parse outline for courseOutline.value
            const outlineStringToParse = rawOutlineFromApi.value;
            if (typeof outlineStringToParse === 'string' && outlineStringToParse.trim().startsWith('[')) {
              try {
                const parsed = JSON.parse(outlineStringToParse);
                courseOutline.value = Array.isArray(parsed) ? parsed : [{ title: "课程大纲", description: outlineStringToParse, points: [] }];
              } catch (e) {
                console.warn("Failed to parse updated outline as JSON array for 'courseOutline' tab after chapter delete, treating as plain description:", e);
                courseOutline.value = [{ title: "课程大纲 (解析失败)", description: outlineStringToParse, points: [] }];
              }
            } else if (typeof outlineStringToParse === 'string') {
              courseOutline.value = [{ title: "课程大纲", description: outlineStringToParse, points: [] }];
            } else {
              courseOutline.value = [];
            }
    
            // Re-populate courseChapters.value from the definitive chapters field in the response
            if (currentFullCourseData.value.chapters && Array.isArray(currentFullCourseData.value.chapters)) {
                courseChapters.value = currentFullCourseData.value.chapters.map((chapter, index) => ({
                    id: chapter.id || 'ch-' + index + '-' + Date.now(),
                    title: chapter.title || '章节 ' + (index + 1),
                    order: chapter.order || index + 1,
                    description: chapter.description || '',
                    sections: chapter.sections || [],
                    expanded: chapter.expanded === undefined ? true : chapter.expanded,
                }));
            } else {
                console.warn("No direct 'chapters' array in response after chapter delete, attempting to parse from outline as fallback.");
                 if (typeof outlineStringToParse === 'string' && outlineStringToParse.trim().startsWith('[')) {
                     try {
                        const parsedChapters = JSON.parse(outlineStringToParse);
                        if(Array.isArray(parsedChapters)) {
                             courseChapters.value = parsedChapters.map((chapter, index) => ({
                                id: chapter.id || 'ch-' + index + '-' + Date.now(),
                                title: chapter.title || '章节 ' + (index + 1),
                                order: chapter.order || index + 1,
                                description: chapter.description || '',
                                sections: chapter.sections || [],
                                expanded: chapter.expanded === undefined ? true : chapter.expanded,
                            }));
                        } else { courseChapters.value = []; }
                     } catch (e) { courseChapters.value = []; }
                } else { courseChapters.value = []; }
            }
            
            console.log('章节删除成功，数据已刷新。');
          } else {
            console.error("删除章节后API未返回有效数据或数据格式不正确", response);
            error.value = "删除成功，但未能正确刷新数据显示。请检查API响应。";
            alert(error.value);
            // Optionally, could attempt to re-fetch all course info as a fallback
            // await fetchAllCourseInfo(); 
          }
        } catch (err) {
          console.error('删除章节失败:', err);
          const apiErrorMessage = err.response?.data?.message || err.message || '未知错误';
          error.value = '删除章节失败: ' + apiErrorMessage;
          alert(error.value);
        } finally {
          loading.value = false;
          chapterIdMarkedForDelete.value = null; 
          chapterOrderToFilterBy.value = null;
          closeDeleteConfirmation();
        }
    
      } else if (deleteType.value === 'chapter' && (chapterOrderToFilterBy.value === null || chapterOrderToFilterBy.value === undefined)) {
        console.error("Attempted to delete chapter, but chapter order for filtering was not properly set.");
        alert("删除操作失败：未能准备好要删除的章节信息，请重试。");
        chapterIdMarkedForDelete.value = null; // Reset related refs
        chapterOrderToFilterBy.value = null;
        closeDeleteConfirmation(); 
      } else if (deleteType.value === 'section' && sectionToDelete.value && currentChapterId.value) {
        const chapterIndex = courseChapters.value.findIndex(ch => ch.id === currentChapterId.value);
        if (chapterIndex !== -1) {
          courseChapters.value[chapterIndex].sections = courseChapters.value[chapterIndex].sections.filter(
            section => section.id !== sectionToDelete.value
          );
        }
        sectionToDelete.value = null;
        currentChapterId.value = null;
        closeDeleteConfirmation(); // Ensure modal closes for section deletion too
      } else if (deleteType.value === 'resource' && resourceToDelete.value) {
        courseResources.value = courseResources.value.filter(resource => resource.id !== resourceToDelete.value);
        resourceToDelete.value = null;
        closeDeleteConfirmation(); // Ensure modal closes for resource deletion too
      } else {
        // If deleteType is not recognized or target is null, just close.
        closeDeleteConfirmation();
      }
    };
    
    // 显示添加小节模态框
    const showAddSectionModal = (chapterId) => {
      currentChapterId.value = chapterId;
      editingSection.value = false;
      newSection.value = {
        id: null,
        number: '',
        title: '',
        description: '',
        duration: ''
      };
      showAddSectionModalRef.value = true;
    };
    
    // 编辑小节
    const editSection = (chapterId, section) => {
      currentChapterId.value = chapterId;
      editingSection.value = true;
      newSection.value = { ...section };
      showAddSectionModalRef.value = true;
    };
    
    // 保存小节
    const saveSection = () => {
      if (newSection.value.number && newSection.value.title && currentChapterId.value) {
        const chapterIndex = courseChapters.value.findIndex(ch => ch.id === currentChapterId.value);
    
        if (chapterIndex !== -1) {
          if (editingSection.value) {
            // 更新现有小节
            const sectionIndex = courseChapters.value[chapterIndex].sections.findIndex(
              section => section.id === newSection.value.id
            );
    
            if (sectionIndex !== -1) {
              courseChapters.value[chapterIndex].sections[sectionIndex] = { ...newSection.value };
            }
          } else {
            // 添加新小节
            const newId = courseChapters.value[chapterIndex].sections.length > 0
              ? Math.max(...courseChapters.value[chapterIndex].sections.map(s => s.id)) + 1
              : 1;
    
            courseChapters.value[chapterIndex].sections.push({
              id: newId,
              number: newSection.value.number,
              title: newSection.value.title,
              description: newSection.value.description,
              duration: newSection.value.duration
            });
          }
        }
    
        closeAddSectionModal();
      }
    };
    
    // 处理文件选择
    const handleFileChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        selectedFile.value = file;
        // 如果用户没有输入标题，使用文件名作为默认标题
        if (!newResource.value.title) {
          newResource.value.title = file.name.split('.')[0];
        }
        // 根据文件类型自动设置资源类型
        newResource.value.type = getFileType(file.name);
      }
    };
    
    // 处理文件拖放
    const handleFileDrop = (event) => {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      if (file) {
        selectedFile.value = file;
        // 如果用户没有输入标题，使用文件名作为默认标题
        if (!newResource.value.title) {
          newResource.value.title = file.name.split('.')[0];
        }
        // 根据文件类型自动设置资源类型
        newResource.value.type = getFileType(file.name);
      }
    };
    
    // 移除已选择的文件
    const removeSelectedFile = () => {
      selectedFile.value = null;
      document.getElementById('resourceFile').value = '';
    };
    
    // 获取文件类型
    const getFileType = (filename) => {
      const extension = filename.split('.').pop().toLowerCase();
      if (['pdf'].includes(extension)) return 'pdf';
      if (['ppt', 'pptx'].includes(extension)) return 'ppt';
      if (['doc', 'docx'].includes(extension)) return 'doc';
      if (['mp4', 'avi', 'mov', 'wmv'].includes(extension)) return 'video';
      if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) return 'zip';
      if (['jpg', 'jpeg', 'png', 'gif', 'svg'].includes(extension)) return 'image';
      if (['java', 'js', 'py', 'c', 'cpp', 'cs', 'html', 'css'].includes(extension)) return 'code';
      return 'other';
    };
    
    // 上传资源
    const uploadResource = async () => {
      if (!selectedFile.value && !editingResource.value) {
        console.error('错误：在尝试上传或更新资源时未选择任何文件。');
        alert('请先选择要上传的文件。');
        return;
      }
    
      const formData = new FormData();
    
      // 1. Add the file (required by OpenAPI if it's a new upload)
      if (selectedFile.value) {
        formData.append('file', selectedFile.value);
      }
    
      // 2. Add chapterOrder (REQUIRED by OpenAPI's MaterialUpload schema)
      // Ensure newResource.value.chapterOrder is populated from your UI (e.g., modal input).
      const chapterOrder = newResource.value.chapterOrder || 1; // Placeholder/default if not set
      formData.append('chapterOrder', chapterOrder.toString());
    
      // 3. Add description (optional)
      if (newResource.value.description) {
        formData.append('description', newResource.value.description);
      }
    
      // 4. Add visibleForClasses (optional)
      if (resourcePermissions.value.visibility === 'specific' && resourcePermissions.value.selectedClasses.length > 0) {
        resourcePermissions.value.selectedClasses.forEach(classId => {
          formData.append('visibleForClasses', classId.toString());
        });
      } else if (resourcePermissions.value.visibility === 'all') {
        // If visibility is 'all', OpenAPI suggests not sending 'visibleForClasses' implies all classes.
        } else {
        // If 'specific' but no classes selected, OpenAPI says "若为空列表则均不可见".
        // How to send an "empty list" for a multi-value field in FormData can be backend-specific.
        // Often, not sending the field or sending a specific marker is how this is handled.
        // Consult backend if an explicit empty list needs to be signaled differently.
      }
    
      // Handle title and type: These are not in OpenAPI MaterialUpload schema for multipart.
      // If your backend expects them in the form data, confirm field names.
      // Using 'custom_' prefix as a suggestion if they are non-standard fields.
    
      if (newResource.value.type) {
        // Type is often inferred by backend from file extension/MIME type.
        formData.append('type', newResource.value.type);
      }
      
      // Include materialId if editing an existing resource and backend supports it via this POST endpoint
      if (editingResource.value && newResource.value.id) {
        // The OpenAPI states POST /courses/{courseId}/resources is for "创建新资源或更新已有资源新版本".
        // If your backend uses a field like 'materialId' in the form data to identify an update, add it here.
        // formData.append('materialId', newResource.value.id);
        console.log('准备更新资源 ID:', newResource.value.id);
      }
    
      try {
        loading.value = true;
        error.value = '';
        
        console.log('上传资源 FormData 内容:', Object.fromEntries(formData.entries()));
    
        const currentCourseId = courseId.value;
        if (!currentCourseId) {
          error.value = '课程ID无效，无法上传资源。';
          alert(error.value);
          loading.value = false;
          return;
        }
        
        // Call the correctly imported API function
        const response = await uploadCourseMaterialFile(currentCourseId, formData);
    
        console.log('上传/更新资源成功:', response);
        await fetchAllCourseInfo(); // Refresh the list of resources
        closeUploadResourceModal(); // Close the modal
    
      } catch (err) {
        console.error('上传资源操作失败:', err);
        error.value = err.response?.data?.message || err.message || '上传资源失败，请稍后重试';
        // alert(error.value); // Consider a more user-friendly notification system
      } finally {
        loading.value = false;
      }
    };
    
    // 根据文件扩展名获取编程语言
    const getLanguageFromExtension = (extension) => {
      const languageMap = {
        'java': 'java',
        'js': 'javascript',
        'py': 'python',
        'c': 'c',
        'cpp': 'cpp',
        'cs': 'csharp',
        'html': 'html',
        'css': 'css'
      };
    
      return languageMap[extension] || 'other';
    };
    
    // 复制代码
    const copyCode = () => {
      if (previewingResource.value && previewingResource.value.code) {
        navigator.clipboard.writeText(previewingResource.value.code)
          .then(() => {
            alert('代码已复制到剪贴板');
          })
          .catch(err => {
            console.error('复制失败:', err);
          });
      }
    };
    
    // 保存资源
    const saveResource = () => {
      if (editingResource.value) {
        // 更新现有资源
        const index = courseResources.value.findIndex(resource => resource.id === newResource.value.id);
        if (index !== -1) {
          const currentResource = courseResources.value[index];
          const newVersion = {
            version: (parseFloat(currentResource.currentVersion) + 0.1).toFixed(1),
            uploadDate: new Date().toLocaleString(),
            size: selectedFile.value ? selectedFile.value.size : currentResource.versions[0].size,
            description: newResource.value.versionDescription || '更新了资源',
            url: selectedFile.value ? URL.createObjectURL(selectedFile.value) : currentResource.versions[0].url,
            uploadedBy: userInfo.value.name
          };
    
          courseResources.value[index] = {
            ...newResource.value,
            currentVersion: newVersion.version,
            versions: [newVersion, ...currentResource.versions],
            permissions: resourcePermissions.value
          };
        }
      } else {
        // 添加新资源
        if (newResource.value.title && selectedFile.value) {
          const newId = courseResources.value.length > 0
            ? Math.max(...courseResources.value.map(r => r.id)) + 1
            : 1;
    
          const initialVersion = {
            version: '1.0',
            uploadDate: new Date().toLocaleString(),
            size: selectedFile.value.size,
            description: '初始版本',
            url: URL.createObjectURL(selectedFile.value),
            uploadedBy: userInfo.value.name
          };
    
          courseResources.value.push({
            ...newResource.value,
            id: newId,
            currentVersion: '1.0',
            versions: [initialVersion],
            permissions: resourcePermissions.value
          });
        }
      }
    
      closeUploadResourceModal();
    };
    
    // 编辑资源
    const editResource = (resource) => {
      editingResource.value = true;
      newResource.value = { ...resource };
      showUploadResourceModal.value = true;
    };
    
    // 预览资源
    const previewResource = (resource) => {
      previewingResource.value = resource;
      showResourcePreview.value = true;
    };
    
    // 下载资源
    const downloadResource = (resource) => {
      // 在实际应用中，这里应该触发文件下载
      console.log(resource.filename);
      if (resource.url) {
        const a = document.createElement('a');
        a.href = resource.url;
        a.download = resource.filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        alert(`下载资源：${resource.filename}`);
      }
    };
    
    // 判断资源是否可以预览
    const canPreview = (type) => {
      return ['pdf', 'video', 'ppt', 'code', 'image'].includes(type);
    };
    
    // 设置资源类型筛选
    const setResourceTypeFilter = (type) => {
      resourceTypeFilter.value = type;
      showResourceFilterMenu.value = false;
    };
    
    // 发布新练习
    const publishExercise = () => {
      if (canPublish.value) {
        exercises.value.push({
          id: exercises.value.length + 1,
          ...newExercise.value,
          date: new Date().toLocaleString(),
          submissions: 0,
          accuracy: 0,
          pending: 0,
          status: '进行中'
        });
        closePublishExerciseModal();
      }
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
    
    // 获取资源图标
    const getResourceIcon = (type) => {
      switch (type) {
        case 'pdf':
          return 'i-lucide-file-text';
        case 'ppt':
          return 'i-lucide-presentation';
        case 'zip':
          return 'i-lucide-archive';
        case 'video':
          return 'i-lucide-video';
        case 'code':
          return 'i-lucide-code';
        case 'image':
          return 'i-lucide-image';
        default:
          return 'i-lucide-file';
      }
    };
    
    // 获取资源类型名称
    const getResourceTypeName = (type) => {
      switch (type) {
        case 'pdf':
          return 'PDF文档';
        case 'ppt':
          return '演示文稿';
        case 'zip':
          return '压缩文件';
        case 'video':
          return '视频';
        case 'code':
          return '编程示例';
        case 'image':
          return '图片';
        default:
          return '文件';
      }
    };
    
    // 获取编程语言名称
    const getLanguageName = (language) => {
      switch (language) {
        case 'java':
          return 'Java';
        case 'python':
          return 'Python';
        case 'javascript':
          return 'JavaScript';
        case 'c':
          return 'C';
        case 'cpp':
          return 'C++';
        case 'csharp':
          return 'C#';
        default:
          return '其他';
      }
    };
    
    // 格式化文件大小
    const formatFileSize = (bytes) => {
      if (bytes < 1024) {
        return bytes + ' B';
      } else if (bytes < 1024 * 1024) {
        return (bytes / 1024).toFixed(2) + ' KB';
      } else if (bytes < 1024 * 1024 * 1024) {
        return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
      } else {
        return (bytes / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
      }
    };
    
    // 获取正确率样式类
    const getAccuracyClass = (accuracy) => {
      if (accuracy >= 90) return 'excellent';
      if (accuracy >= 75) return 'good';
      if (accuracy >= 60) return 'average';
      return 'poor';
    };
    
    // 关闭模态框
    const closeAddChapterModal = () => {
      showAddChapterModal.value = false;
      editingChapter.value = null; // Clear editing state
      newChapter.value = {
        order: null, // Reset for next add
        title: ''
      };
    };
    
    const closeAddSectionModal = () => {
      showAddSectionModalRef.value = false;
      editingSection.value = false;
      currentChapterId.value = null;
      newSection.value = {
        id: null,
        number: '',
        title: '',
        description: '',
        duration: ''
      };
    };
    
    const closeUploadResourceModal = () => {
      showUploadResourceModal.value = false;
      editingResource.value = false;
      selectedFile.value = null;
      selectedThumbnail.value = null;
      newResource.value = {
        id: null,
        title: '',
        type: 'pdf',
        chapterOrder: 1,
        description: '',
        size: 0,
        language: 'java',
        code: '',
        url: null
      };
    };
    
    const closePublishExerciseModal = () => {
      showPublishExerciseModal.value = false;
      newExercise.value = {
        title: '',
        chapter: '',
        description: '',
        startTime: '',
        endTime: '',
        allowMultipleSubmissions: false,
        questions: [],
        totalScore: 0
      };
    };
    
    const closeDeleteConfirmation = () => {
      showDeleteConfirmation.value = false;
      chapterIdMarkedForDelete.value = null;
      chapterOrderToFilterBy.value = null;
      sectionToDelete.value = null;
      resourceToDelete.value = null;
      currentChapterId.value = null;
      deleteType.value = '';
    };
    
    const closeResourcePreview = () => {
      showResourcePreview.value = false;
      previewingResource.value = null;
    };
    
    const closeEditChapterModal = () => {
      showEditChapterModal.value = false;
      editingChapter.value = null;
    };
    
    const closeOutlineEditModal = () => {
      showOutlineEditModal.value = false;
      editingOutline.value = null;
    };
    
    // 触发文件选择
    const triggerFileInput = () => {
      document.getElementById('resourceFile').click();
    };
    
    // 点击外部关闭下拉菜单
    const handleClickOutside = (event) => {
      if (statusFilterDropdown.value && !statusFilterDropdown.value.contains(event.target)) {
        showStatusFilter.value = false;
      }
      if (chapterFilterDropdown.value && !chapterFilterDropdown.value.contains(event.target)) {
        showChapterFilter.value = false;
      }
    
      // 关闭资源类型筛选菜单
      const resourceFilterElement = event.target.closest('.filter-dropdown');
      if (!resourceFilterElement && showResourceFilterMenu.value) {
        showResourceFilterMenu.value = false;
      }
    };
    
    // 生命周期钩子
    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
      fetchAllCourseInfo(); // 加载 API 数据
    });
    
    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside);
    });
    // 在 script setup 部分添加以下方法
    const openOutlineEditor = () => {
      editingOutline.value = rawOutlineFromApi.value; // Display raw outline string in textarea
      showOutlineEditModal.value = true;
    };
    
    const saveOutlineChanges = async () => {
      if (!editingOutline.value && editingOutline.value !== '') { // Allow empty string
        alert("大纲内容不能为空。");
        return;
      }
      if (!currentFullCourseData.value) {
        alert("课程基础数据未加载，无法保存大纲。");
        console.error("Error in saveOutlineChanges: currentFullCourseData.value is null or undefined.");
        return;
      }
    
      try {
        loading.value = true;
        error.value = '';
    
        const courseObjectToSend = { ...currentFullCourseData.value };
        courseObjectToSend.outline = editingOutline.value;
    
        const response = await updateCourseOutline(courseId.value, courseObjectToSend);
    
        if (response && response.data && response.data.data) {
          const updatedCourseFromResponse = response.data.data;
          currentFullCourseData.value = updatedCourseFromResponse; // Update the stored full course data
    
          // Re-populate local display refs from the new full course data
          courseName.value = currentFullCourseData.value.name || '';
          // Ensure studentCount and duration are handled correctly (e.g., string or number as needed by UI)
          courseStudents.value = currentFullCourseData.value.studentCount?.toString() || '0'; 
          courseDuration.value = currentFullCourseData.value.duration || '';
          rawOutlineFromApi.value = currentFullCourseData.value.outline || '';
    
          // Re-parse for courseOutline.value (intended for "课程大纲" tab)
          const newOutlineStringForOutlineTab = rawOutlineFromApi.value;
          if (typeof newOutlineStringForOutlineTab === 'string' && newOutlineStringForOutlineTab.trim().startsWith('[')) {
            try {
              const parsedForOutlineTab = JSON.parse(newOutlineStringForOutlineTab);
              courseOutline.value = Array.isArray(parsedForOutlineTab) ? parsedForOutlineTab : [{ title: "课程大纲", description: newOutlineStringForOutlineTab, points: [] }];
            } catch (e) {
              console.warn("Failed to parse updated outline as JSON array for 'courseOutline' tab, treating as plain description:", e);
              courseOutline.value = [{ title: "课程大纲 (解析失败)", description: newOutlineStringForOutlineTab, points: [] }];
            }
          } else if (typeof newOutlineStringForOutlineTab === 'string') {
            courseOutline.value = [{ title: "课程大纲", description: newOutlineStringForOutlineTab, points: [] }];
          } else {
            console.warn("Updated outline is not a string, cannot populate 'courseOutline' tab.", newOutlineStringForOutlineTab);
            courseOutline.value = [];
          }
    
          // Re-parse for courseChapters.value (intended for "课程章节" tab)
          // This logic might need to be more sophisticated if outline and chapters are distinct fields in currentFullCourseData.value
          // For now, assuming the outline field from backend might contain chapter JSON string as per previous logic.
          const outlineForChaptersParse = currentFullCourseData.value.outline; 
          if (typeof outlineForChaptersParse === 'string' && outlineForChaptersParse.trim().startsWith('[')) {
              try {
                  const parsedChapters = JSON.parse(outlineForChaptersParse);
                  if (Array.isArray(parsedChapters)) {
                      courseChapters.value = parsedChapters.map((chapter, index) => ({
                          id: chapter.id || 'ch-' + index + '-' + Date.now(),
                          title: chapter.title || '章节 ' + (index + 1),
                          order: chapter.order || index + 1,
                          description: chapter.description || '',
                          sections: chapter.sections || [],
                          expanded: chapter.expanded === undefined ? true : chapter.expanded,
                      }));
                  } else {
                       console.warn("Parsed outline for 'courseChapters' tab is JSON but not an array.");
                       courseChapters.value = currentFullCourseData.value.chapters || []; // Fallback to a dedicated chapters field if available
                  }
              } catch (e) {
                  console.error('Failed to parse updated outline as JSON for courseChapters:', e);
                  courseChapters.value = currentFullCourseData.value.chapters || []; // Fallback to a dedicated chapters field
              }
          } else if (currentFullCourseData.value.chapters && Array.isArray(currentFullCourseData.value.chapters)) {
              // If outline is not chapter JSON, but there's a direct chapters array, use that.
              courseChapters.value = currentFullCourseData.value.chapters;
          } else {
              console.warn("Cannot derive chapters: outline is not a JSON array string, and no direct chapters field found.");
              courseChapters.value = [];
          }
    
      showOutlineEditModal.value = false;
        } else {
          console.error("保存大纲后API未返回有效数据或数据格式不正确", response);
          error.value = "保存成功，但未能正确刷新数据显示。请检查API响应。";
          alert(error.value);
        }
    
      } catch (err) {
        console.error('保存大纲失败:', err);
        const apiErrorMessage = err.response?.data?.message || err.message || '未知错误';
        error.value = '保存大纲失败: ' + apiErrorMessage;
        alert(error.value);
      } finally {
        loading.value = false;
      }
    };
    
    const addOutlinePoint = (sectionIndex) => {
      editingOutline.value[sectionIndex].points.push('新知识点');
    };
    
    const removeOutlinePoint = (sectionIndex, pointIndex) => {
      editingOutline.value[sectionIndex].points.splice(pointIndex, 1);
    };
    
    const addOutlineSection = () => {
      editingOutline.value.push({
        title: '新章节',
        description: '请输入章节描述',
        points: ['新知识点']
      });
    };
    
    const removeOutlineSection = (sectionIndex) => {
      editingOutline.value.splice(sectionIndex, 1);
    };
    
    // 在 data 部分添加权限相关的状态
    const resourcePermissions = ref({
      visibility: 'all', // 'all' 或 'specific'
      selectedClasses: []
    });
    
    // 添加班级列表数据
    const classList = ref([
      { id: 1, name: '2023级计算机科学1班' },
      { id: 2, name: '2023级计算机科学2班' },
      { id: 3, name: '2023级软件工程1班' },
      { id: 4, name: '2023级软件工程2班' }
    ]);
    
    const downloadVersion = (resourceId, version) => {
      const resource = courseResources.value.find(r => r.id === resourceId);
      if (resource && version.url) {
        const a = document.createElement('a');
        a.href = version.url;
        a.download = `${resource.filename}_v${version.version}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      } else {
        alert(`下载版本：${version.version}`);
      }
    };
    
    const previewVersion = (resourceId, version) => {
      const resource = courseResources.value.find(r => r.id === resourceId);
      if (resource) {
        previewingResource.value = {
          ...resource,
          url: version.url,
          title: `${resource.filename} (v${version.version})`
        };
        showResourcePreview.value = true;
      }
    };
    
    // 在 data 部分添加新的响应式数据
    const questionTypes = [
      { value: 'choice', label: '选择题', icon: 'i-lucide-list' },
      { value: 'programming', label: '编程题', icon: 'i-lucide-code' },
      { value: 'completion', label: '填空题', icon: 'i-lucide-pen-line' },
      { value: 'essay', label: '问答题', icon: 'i-lucide-file-text' }
    ];
    
    const showQuestionBank = ref(false);
    const selectedQuestions = ref([]);
    const currentQuestion = ref(null);
    const showAddQuestionModal = ref(false);
    
    // 题库数据示例
    const questionBank = ref([
      {
        id: 1,
        type: 'choice',
        title: '以下哪个不是Java的基本数据类型？',
        score: 5,
        options: ['int', 'boolean', 'String', 'double'],
        answer: 2,
        explanation: 'String是引用类型，不是基本数据类型'
      },
      {
        id: 2,
        type: 'programming',
        title: '实现一个冒泡排序算法',
        score: 10,
        description: '请编写一个方法，使用冒泡排序算法对整数数组进行排序。',
        testCases: [
          { input: '[5,2,8,1,9]', output: '[1,2,5,8,9]' }
        ]
      }
    ]);
    
    const getQuestionTypeIcon = (type) => {
      const typeConfig = questionTypes.find(t => t.value === type);
      return typeConfig ? typeConfig.icon : 'i-lucide-help-circle';
    };
    
    const getQuestionTypeLabel = (type) => {
      const typeConfig = questionTypes.find(t => t.value === type);
      return typeConfig ? typeConfig.label : '未知类型';
    };
    
    const filteredQuestions = computed(() => {
      let result = questionBank.value;
    
      if (selectedQuestionType.value) {
        result = result.filter(q => q.type === selectedQuestionType.value);
      }
    
      if (questionSearchQuery.value) {
        const query = questionSearchQuery.value.toLowerCase();
        result = result.filter(q =>
          q.title.toLowerCase().includes(query) ||
          (q.description && q.description.toLowerCase().includes(query))
        );
      }
    
      return result;
    });
    
    const canPublish = computed(() => {
      return newExercise.value.title &&
        newExercise.value.chapter &&
        newExercise.value.startTime &&
        newExercise.value.endTime &&
        newExercise.value.questions.length > 0;
    });
    
    const openAddQuestion = () => {
      currentQuestion.value = {
        type: 'choice',
        title: '',
        score: 5,
        options: ['', ''],
        answer: 0
      };
      showAddQuestionModal.value = true;
    };
    
    const editQuestion = (index) => {
      currentQuestion.value = { ...newExercise.value.questions[index] };
      showAddQuestionModal.value = true;
    };
    
    const removeQuestion = (index) => {
      newExercise.value.questions.splice(index, 1);
      updateTotalScore();
    };
    
    const closeAddQuestionModal = () => {
      showAddQuestionModal.value = false;
      currentQuestion.value = null;
    };
    
    const addOption = () => {
      if (currentQuestion.value.options.length < 6) {
        currentQuestion.value.options.push('');
      }
    };
    
    const removeOption = (index) => {
      currentQuestion.value.options.splice(index, 1);
      if (currentQuestion.value.answer >= currentQuestion.value.options.length) {
        currentQuestion.value.answer = 0;
      }
    };
    
    const addTestCase = () => {
      if (!currentQuestion.value.testCases) {
        currentQuestion.value.testCases = [];
      }
      currentQuestion.value.testCases.push({ input: '', output: '' });
    };
    
    const removeTestCase = (index) => {
      currentQuestion.value.testCases.splice(index, 1);
    };
    
    const saveQuestion = () => {
      if (currentQuestion.value.title && currentQuestion.value.score > 0) {
        if (!newExercise.value.questions) {
          newExercise.value.questions = [];
        }
        const index = newExercise.value.questions.findIndex(q => q === currentQuestion.value);
        if (index === -1) {
          newExercise.value.questions.push({ ...currentQuestion.value });
        } else {
          newExercise.value.questions[index] = { ...currentQuestion.value };
        }
        updateTotalScore();
        closeAddQuestionModal();
      }
    };
    
    const importQuestions = () => {
      const selectedBankQuestions = questionBank.value.filter(q => selectedQuestions.value.includes(q.id));
      newExercise.value.questions.push(...selectedBankQuestions);
      updateTotalScore();
      selectedQuestions.value = [];
      showQuestionBank.value = false;
    };
    
    const updateTotalScore = () => {
      newExercise.value.totalScore = newExercise.value.questions.reduce((sum, q) => sum + q.score, 0);
    };
    
    const selectedQuestionType = ref(null);
    const questionSearchQuery = ref('');
    
    // Create Class Modal State
    const showCreateClassModal = ref(false);
    const newClassName = ref('');
    const newClassCode = ref('');
    
    // 添加 API 数据加载函数
    /*
    const loadApiData = async () => {
      try {
        // 获取课程基本信息
        const courseResponse = await getCourseDetail(route.params.id);
        if (courseResponse.data) {
          courseName.value = courseResponse.data.name;
          courseStudents.value = courseResponse.data.studentCount;
          courseDuration.value = courseResponse.data.duration;
        }
        
        // 获取课程大纲
        const outlineResponse = await getCourseOutline(route.params.id);
        if (outlineResponse.data.outline) {
          courseOutline.value = outlineResponse.data.outline;
        }
        
        // 获取课程资源
        const resourcesResponse = await getCourseResources(route.params.id);
        if (resourcesResponse.data) {
          courseResources.value = resourcesResponse.data;
        }
        
        // 获取班级信息和作业
        const classesResponse = await getCourseClasses(route.params.id);
        if (classesResponse.data) {
          const classes = classesResponse.data;
          for (const classItem of classes) {
            const assignmentsResponse = await getClassAssignments(classItem.id);
            if (assignmentsResponse.data) {
              exercises.value.push(...assignmentsResponse.data);
            }
          }
        }
      } catch (error) {
        console.error('加载数据失败:', error);
      }
    };
    */
    
    // 获取课程所有信息
    const fetchAllCourseInfo = async () => {
      if (!courseId.value) {
        console.error('No course ID provided');
        error.value = '未找到课程信息';
        return;
      }
    
      try {
        loading.value = true;
        error.value = '';
        
        const courseRes = await getCourseDetail(courseId.value);
        
        if (courseRes.data && courseRes.data.data) {
          currentFullCourseData.value = courseRes.data.data; // Store the full course object
    
          // Populate other refs from currentFullCourseData.value
          courseName.value = currentFullCourseData.value.name || '';
          // Ensure studentCount and duration are handled correctly (e.g., string or number as needed by UI)
          courseStudents.value = currentFullCourseData.value.studentCount?.toString() || '0';
          courseDuration.value = currentFullCourseData.value.duration || '';
          rawOutlineFromApi.value = currentFullCourseData.value.outline || '';
          
          // 处理大纲数据 for structured display (courseOutline.value)
          const outlineDataToParse = rawOutlineFromApi.value;
          if (typeof outlineDataToParse === 'string' && outlineDataToParse.trim().startsWith('[')) {
            try {
              const parsed = JSON.parse(outlineDataToParse);
              if (Array.isArray(parsed)) {
                courseOutline.value = parsed;
              } else {
                console.warn("Parsed outline data is not an array. Wrapping as description.");
                courseOutline.value = [{ title: "课程大纲", description: outlineDataToParse, points: [] }];
              }
            } catch (e) {
              console.warn("Failed to parse course outline JSON string, treating as plain description:", e);
              courseOutline.value = [{ title: "课程大纲", description: outlineDataToParse, points: [] }];
            }
          } else if (Array.isArray(outlineDataToParse)) { // Should not happen if API sends string per OpenAPI
            courseOutline.value = outlineDataToParse;
          } else if (typeof outlineDataToParse === 'string') { // Plain string, not JSON array
             console.warn("Course outline is a plain string. Wrapping as description.");
             courseOutline.value = [{ title: "课程大纲", description: outlineDataToParse, points: [] }];
          } else {
            courseOutline.value = [];
          }
          
          // 处理章节数据 (courseChapters.value)
          // This logic should correctly interpret chapters, whether they are in a dedicated field or from the outline string.
          if (currentFullCourseData.value.chapters && Array.isArray(currentFullCourseData.value.chapters)) {
            courseChapters.value = currentFullCourseData.value.chapters.map((chapter, index) => ({
                id: chapter.id || 'ch-' + index + '-' + Date.now(),
                title: chapter.title || '章节 ' + (index + 1),
                order: chapter.order || index + 1,
                description: chapter.description || '',
                sections: chapter.sections || [],
                expanded: chapter.expanded === undefined ? true : chapter.expanded,
            }));
          } else if (typeof outlineDataToParse === 'string' && outlineDataToParse.trim().startsWith('[')) {
            // If no direct chapters field, try parsing outline as chapters (fallback as per previous logic)
            try {
              const parsedChapters = JSON.parse(outlineDataToParse);
              if (Array.isArray(parsedChapters)) {
                courseChapters.value = parsedChapters.map((chapter, index) => ({
                    id: chapter.id || 'ch-' + index + '-' + Date.now(),
                    title: chapter.title || '章节 ' + (index + 1),
                    order: chapter.order || index + 1,
                    description: chapter.description || '',
                    sections: chapter.sections || [],
                    expanded: chapter.expanded === undefined ? true : chapter.expanded,
                }));
              } else { // Outline is JSON array but not structured as chapters expected by this mapping
                courseChapters.value = [];
              }
            } catch (e) { // Outline is not a valid JSON for chapters
              courseChapters.value = [];
            }
          } else {
            courseChapters.value = []; // No chapter data found
          }
    
          console.log("课程基本信息处理完成");
          console.log("大纲数据:", courseOutline.value);
          console.log("章节数据:", courseChapters.value);
        } else {
          console.error("课程详情API返回数据格式异常");
          error.value = "无法获取课程详情";
        }
    
        // 获取课程资源
        try {
          const materialsRes = await getCourseMaterials(courseId.value);
          console.log("课程资料API返回:", materialsRes);
          if (materialsRes.data && materialsRes.data.data) {
            courseResources.value = materialsRes.data.data;
            console.log("课程资料获取成功:", courseResources.value);
          } else {
            console.warn("课程资料为空或格式异常");
            courseResources.value = [];
          }
        } catch (err) {
          console.error("获取课程资料失败:", err);
          courseResources.value = []; // Set default on error
        }
    
        // 获取课程练习 - 新逻辑
        exercises.value = []; // Reset exercises before fetching
        try {
          console.log("准备获取课程班级列表以加载练习, courseId:", courseId.value);
          const classesRes = await getCourseClasses(courseId.value); // This is already called above for permissions, reuse or ensure it populates a usable list.
          
          let allClassesForAssignments = [];
          if (classesRes.data && classesRes.data.data) {
            allClassesForAssignments = classesRes.data.data; // Assuming this is an array of class objects with an 'id' property
            console.log("获取到班级列表 for assignments:", allClassesForAssignments);
          } else {
            console.warn("课程下没有班级或班级列表获取失败，无法加载练习。");
          }
    
          if (allClassesForAssignments.length > 0) {
            const assignmentPromises = allClassesForAssignments.map(classItem =>
              getClassAssignments(classItem.id)
                .then(res => {
                  if (res.data && res.data.data) {
                    return res.data.data; // Expecting an array of assignments
                  }
                  console.warn(`班级 ${classItem.id} 的练习数据为空或格式异常`);
                  return []; // Return empty array for this class on error/no data
                })
                .catch(err => {
                  console.error(`获取班级 ${classItem.id} 的练习失败:`, err);
                  return []; // Return empty array for this class on error
                })
            );
    
            const results = await Promise.all(assignmentPromises);
            exercises.value = results.flat(); // Flatten the array of arrays
            console.log("所有班级练习汇总成功:", exercises.value);
          } else {
            console.log("课程没有班级，练习列表为空。");
            exercises.value = [];
          }
        } catch (err) {
          console.error("获取课程练习的整体流程失败 (获取班级或练习时出错):", err);
          exercises.value = []; // Set default on error
        }
    
        // 获取课程下的班级列表 for permissions (This part was already there, ensure it runs correctly)
        // It seems redundant if classesRes above is already fetching the same data.
        // We can potentially consolidate this.
        // For now, let it run as is, but consider refactoring if it's a duplicate call.
        try {
          console.log("正在获取课程班级列表 for permissions, ID:", courseId.value); // This log was already present
          const classesPermissionRes = await getCourseClasses(courseId.value); // Potentially redundant call
          console.log("课程班级列表API返回 for permissions:", classesPermissionRes);
          if (classesPermissionRes.data && classesPermissionRes.data.data) {
            availableClassesForPermissions.value = classesPermissionRes.data.data.map(cls => ({ id: cls.id, name: cls.name }));
            console.log("课程班级列表获取成功 for permissions:", availableClassesForPermissions.value);
          } else {
            console.warn("课程班级列表为空或格式异常 for permissions");
            availableClassesForPermissions.value = [];
          }
        } catch (err) {
          console.error("获取课程班级列表失败 for permissions:", err);
          availableClassesForPermissions.value = []; 
        }
    
      } catch (err) {
        // This top-level catch handles errors from getCourseDetail or if any specific error wasn't caught below
        console.error('获取课程信息失败 (整体):', err);
        error.value = err.response?.data?.message || err.message || "获取课程信息失败，请重试";
      } finally {
        loading.value = false;
      }
    };
    
    // Watch for courseId changes
    // Create Class Modal Functions
    const openCreateClassModal = () => {
      newClassName.value = '';
      newClassCode.value = '';
      showCreateClassModal.value = true;
    };
    
    const closeCreateClassModal = () => {
      showCreateClassModal.value = false;
    };
    
    const handleCreateClass = async () => {
      if (!newClassName.value.trim()) {
        alert('请输入班级名称');
        return;
      }
      if (!newClassCode.value.trim()) {
        alert('请输入班级邀请码');
        return;
      }
      if (!courseId.value) {
        alert('获取课程ID失败，无法创建班级');
        console.error('Course ID is not available.');
        return;
      }
    
      try {
        const classData = {
          name: newClassName.value.trim(),
          code: newClassCode.value.trim(),
          courseId: courseId.value
        };
        const response = await createClass(classData);
        // 假设API成功响应时，直接返回创建的班级对象或成功状态
        // 根据实际API响应结构调整下面的判断逻辑
        if (response && (response.status === 201 || response.status === 200 || response.data)) { // 假设201是创建成功, 或者检查response.data
          alert(`班级 "${classData.name}" 创建成功！`);
          closeCreateClassModal();
          // 可以在这里添加刷新班级列表等后续操作
        } else {
          // 处理API返回的特定错误信息
          const errorMessage = response && response.data && response.data.message ? response.data.message : '创建班级失败，请稍后再试。';
          alert(errorMessage);
          console.error('Failed to create class:', response);
        }
      } catch (error) {
        console.error('Error creating class:', error);
        let errorMessage = '创建班级过程中发生错误。';
        if (error.response && error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        }
        alert(errorMessage);
      }
    };
    
    // Watch for courseId changes
    watch(courseId, (newId) => {
      if (newId) {
        fetchAllCourseInfo();
      }
    });
    
    // 在组件挂载时获取数据
    onMounted(() => {
      fetchAllCourseInfo();
    });
    
    // Helper function to get displayable class names for resource visibility
    const getVisibleClassNames = (resource) => {
      if (!resource.visibleForClasses || resource.visibleForClasses === null) {
        return '所有人可见';
      }
      if (resource.visibleForClasses.length === 0) {
        return '仅创建者可见'; // Corresponds to "若为空列表则均不可见"
      }
      if (availableClassesForPermissions.value && availableClassesForPermissions.value.length > 0) {
        const classNames = resource.visibleForClasses
          .map(id => {
            const foundClass = availableClassesForPermissions.value.find(cls => String(cls.id) === String(id)); // Ensure type a.g.nostic comparison for IDs
            return foundClass ? foundClass.name : `班级ID:${id}`;
          })
          .filter(name => name);
        return classNames.length > 0 ? classNames.join(', ') : '未指定班级或班级信息加载失败';
      }
      // Fallback if class list isn't ready but resource has specific classes
      return resource.visibleForClasses.map(id => `班级ID:${id}`).join(', ') || '信息加载中...';
    };
    </script>
    
    <style scoped>
    .course-details {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #333;
      background-color: #f8f9fa;
      min-height: 100vh;
      overflow-y: auto;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
    
    /* Header styles */
    .header {
      background: linear-gradient(135deg, #4a6cf7 0%, #2651e9 100%);
      color: white;
      padding: 30px 0;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      position: relative;
    }
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .course-title {
      font-size: 32px;
      margin: 0 0 8px 0;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    
    .course-meta {
      margin: 0;
      font-size: 16px;
      opacity: 0.9;
    }
    
    .action-buttons {
      display: flex;
      gap: 15px;
      align-items: center;
    }
    
    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
      cursor: pointer;
      border: 2px solid rgba(255, 255, 255, 0.8);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      transition: all 0.3s ease;
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
    
    .user-status {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: #e74c3c;
      border: 2px solid white;
    }
    
    .user-status.online {
      background-color: #2ecc71;
    }
    
    /* Navigation tabs styles */
    .nav-tabs-container {
      background-color: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    
    .nav-tabs {
      display: flex;
      justify-content: center;
      padding: 0;
    }
    
    .tab-item {
      padding: 16px 32px;
      border-bottom: 3px solid transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
      transition: all 0.2s ease;
      color: #666;
    }
    
    .tab-item:hover {
      color: #4a6cf7;
      background-color: rgba(74, 108, 247, 0.05);
    }
    
    .tab-item.active {
      border-bottom-color: #4a6cf7;
      color: #4a6cf7;
      font-weight: 600;
    }
    
    /* Main content area styles */
    .content-area {
      padding: 40px 0;
    }
    
    .outline-view, .resources-view, .chapters-view, .exercises-view {
      margin-bottom: 40px;
      background-color: white;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
      padding: 24px;
    }
    
    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid #eee;
    }
    
    .panel-title {
      font-size: 24px;
      margin: 0;
      font-weight: 700;
      color: #333;
    }
    
    .panel-actions {
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
    }
    
    .btn {
      padding: 10px 20px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
      transition: all 0.2s ease;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, #4a6cf7 0%, #2651e9 100%);
      color: white;
    }
    
    .btn-primary:hover {
      background: linear-gradient(135deg, #3a5ce6 0%, #1540d8 100%);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(74, 108, 247, 0.2);
    }
    
    .btn-default {
      background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
      color: #333;
    }
    
    .btn-default:hover {
      background: linear-gradient(135deg, #e0e0e0 0%, #d0d0d0 100%);
      transform: translateY(-2px);
    }
    
    .btn-outline {
      background-color: transparent;
      color: #4a6cf7;
      border: 1px solid #4a6cf7;
    }
    
    .btn-outline:hover {
      background-color: rgba(74, 108, 247, 0.05);
      transform: translateY(-2px);
    }
    
    .btn-sm {
      padding: 8px 16px;
      font-size: 14px;
      border-radius: 6px;
    }
    
    .btn-icon {
      padding: 8px;
      border: none;
      background-color: transparent;
      cursor: pointer;
      border-radius: 50%;
      transition: all 0.2s ease;
      color: #666;
    }
    
    .btn-icon:hover {
      background-color: #f5f5f5;
      color: #4a6cf7;
    }
    
    .btn-icon.danger {
      color: #e74c3c;
    }
    
    .btn-icon.danger:hover {
      background-color: #fde3e3;
    }
    
    /* Course Outline Tab styles */
    .outline-content {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    
    .outline-section {
      padding: 20px;
      border: 1px solid #eee;
      border-radius: 10px;
      background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
      transition: all 0.2s ease;
    }
    
    .outline-section:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      transform: translateY(-2px);
    }
    
    .section-title {
      font-size: 20px;
      margin: 0 0 12px 0;
      color: #333;
      font-weight: 600;
    }
    
    .section-description {
      margin: 0 0 16px 0;
      font-size: 16px;
      color: #666;
      line-height: 1.6;
    }
    
    .section-points {
      list-style-type: none;
      padding: 0;
      margin: 0;
    }
    
    .section-points li {
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      color: #555;
      line-height: 1.5;
    }
    
    .text-success {
      color: #2ecc71;
    }
    
    /* Course Resources Tab styles */
    .resources-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }
    
    .resource-card {
      border-radius: 10px;
      overflow: hidden;
      background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    
    .resource-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    }
    
    .resource-card-header {
      padding: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #f0f0f0;
    }
    
    .resource-type-indicator {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #666;
      padding: 6px 12px;
      border-radius: 20px;
      background: linear-gradient(135deg, #f5f7ff 0%, #e8eeff 100%);
    }
    
    .resource-type-indicator i {
      font-size: 16px;
      color: #4a6cf7;
    }
    
    .resource-actions {
      display: flex;
      gap: 8px;
    }
    
    .resource-info {
      padding: 16px;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }
    
    .resource-title {
      font-size: 18px;
      margin: 0 0 12px 0;
      font-weight: 600;
      color: #333;
      line-height: 1.4;
    }
    
    .resource-meta {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
      flex-wrap: wrap;
    }
    
    .resource-size {
      font-size: 14px;
      color: #666;
    }
    
    .resource-date {
      font-size: 14px;
      color: #666;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    .resource-description {
      margin-top: auto;
      font-size: 14px;
      color: #666;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .resource-visibility {
      font-size: 13px;
      color: #555; /* Slightly darker for better readability */
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid #f0f0f0; /* Separator line */
      display: flex;
      align-items: center;
    }
    
    .resource-visibility i {
      color: #666; /* Icon color */
      margin-right: 6px; /* Spacing after icon */
    }
    
    /* Course Chapters Tab styles */
    .chapters-list {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }
    
    .chapter-item {
      border-radius: 10px;
      overflow: hidden;
      background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      transition: all 0.2s ease;
    }
    
    .chapter-item:hover {
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }
    
    .chapter-header {
      padding: 16px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      background: linear-gradient(135deg, #f9f9f9 0%, #f0f0f0 100%);
      transition: background-color 0.2s ease;
    }
    
    .chapter-header:hover {
      background: linear-gradient(135deg, #f0f0f0 0%, #e8e8e8 100%);
    }
    
    .chapter-title-container {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .chapter-number-badge {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #4a6cf7 0%, #2651e9 100%);
      color: white;
      border-radius: 50%;
      font-weight: 600;
      font-size: 16px;
    }
    
    .chapter-title {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }
    
    .chapter-meta {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    
    .chapter-date {
      font-size: 14px;
      color: #666;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    .chapter-toggle {
      width: 24px;
      height: 24px;
      cursor: pointer;
      color: #666;
      transition: transform 0.2s ease;
    }
    
    .chapter-content {
      padding: 20px;
      border-top: 1px solid #eee;
    }
    
    .chapter-description {
      margin-bottom: 20px;
      font-size: 16px;
      color: #666;
      line-height: 1.6;
    }
    
    .chapter-sections {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .section-item {
      padding: 16px;
      border: 1px solid #eee;
      border-radius: 8px;
      background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
      transition: all 0.2s ease;
    }
    
    .section-item:hover {
      background: linear-gradient(135deg, #f5f5f5 0%, #f0f0f0 100%);
      transform: translateX(5px);
    }
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    
    .section-title-container {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .section-number {
      font-weight: 600;
      color: #4a6cf7;
      font-size: 14px;
    }
    
    .section-title {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: #333;
    }
    
    .section-duration {
      font-size: 14px;
      color: #666;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    .section-description {
      margin: 0;
      font-size: 14px;
      color: #666;
      line-height: 1.5;
    }
    
    .add-section-btn {
      margin-top: 20px;
      align-self: flex-start;
    }
    
    .chapter-actions {
      display: flex;
      gap: 12px;
      margin-top: 20px;
      justify-content: flex-end;
    }
    
    /* Course Exercises Tab styles */
    .exercise-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
    }
    
    .exercise-card {
      border-radius: 10px;
      overflow: hidden;
      background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    
    .exercise-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    }
    
    .exercise-card-header {
      padding: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: linear-gradient(135deg, #f9f9f9 0%, #f0f0f0 100%);
    }
    
    .exercise-content {
      padding: 16px;
      flex-grow: 1;
      display: flex;
      flex-direction: column;
    }
    
    .chapter-badge {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 14px;
      color: #666;
      background-color: #f0f0f0;
      padding: 4px 10px;
      border-radius: 4px;
    }
    
    .exercise-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }
    
    .exercise-title-area {
      flex-grow: 1;
    }
    
    .exercise-title-area h3 {
      margin: 0 0 8px 0;
      font-size: 18px;
      font-weight: 600;
      color: #333;
      line-height: 1.4;
    }
    
    .badge {
      padding: 5px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }
    
    .status-badge {
      background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%);
      color: white;
    }
    
    .status-completed {
      background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
    }
    
    .exercise-date {
      font-size: 14px;
      color: #666;
      display: flex;
      align-items: center;
      gap: 4px;
    }
    
    .exercise-description {
      margin-bottom: 16px;
      font-size: 14px;
      color: #666;
      line-height: 1.5;
      flex-grow: 1;
    }
    
    .exercise-stats {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
      padding: 12px;
      background: linear-gradient(135deg, #f9f9f9 0%, #f0f0f0 100%);
      border-radius: 8px;
    }
    
    .stat {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    
    .stat-value {
      font-size: 20px;
      font-weight: 700;
      margin-bottom: 4px;
    }
    
    .stat-label {
      font-size: 12px;
      color: #666;
    }
    
    .accuracy-indicator {
      display: flex;
      align-items: center;
      gap: 5px;
      font-weight: 700;
    }
    
    .excellent {
      color: #4caf50;
    }
    
    .good {
      color: #2196f3;
    }
    
    .average {
      color: #ff9800;
    }
    
    .poor {
      color: #e74c3c;
    }
    
    .exercise-actions {
      display: flex;
      gap: 10px;
      margin-top: auto;
    }
    
    /* Empty state styles */
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 300px;
      border: 2px dashed #ddd;
      border-radius: 10px;
      padding: 20px;
      text-align: center;
      background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
    }
    
    .empty-icon {
      font-size: 64px;
      color: #ccc;
      margin-bottom: 20px;
    }
    
    .empty-state h3 {
      margin: 0 0 10px 0;
      font-size: 20px;
      color: #666;
    }
    
    .empty-state p {
      margin: 0 0 20px 0;
      font-size: 16px;
      color: #888;
      max-width: 400px;
    }
    
    /* Modal styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      backdrop-filter: blur(3px);
    }
    
    .modal-content {
      background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
      border-radius: 12px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      width: 90%;
      max-width: 600px;
      max-height: 90vh;
      overflow-y: auto;
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* Internet Explorer 10+ */
    }
    
    .modal-content::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera */
    }
    
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border-bottom: 1px solid #eee;
      position: sticky;
      top: 0;
      background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
      z-index: 1;
    }
    
    .modal-header h3 {
      margin: 0;
      font-size: 20px;
      font-weight: 600;
    }
    
    .btn-close {
      width: 36px;
      height: 36px;
      border: none;
      background-color: #f0f0f0;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    
    .btn-close:hover {
      background-color: #e0e0e0;
    }
    
    .btn-close i {
      font-size: 20px;
    }
    
    .modal-body {
      padding: 20px;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #333;
    }
    
    .form-group input, .form-group textarea, .form-group select {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 16px;
      transition: all 0.2s ease;
    }
    
    .form-group input:focus, .form-group textarea:focus, .form-group select:focus {
      border-color: #4a6cf7;
      outline: none;
      box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
    }
    
    .form-actions {
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
    
    .confirmation-modal {
      width: 450px;
    }
    
    .confirmation-icon {
      font-size: 64px;
      color: #ff9800;
      margin-bottom: 20px;
      text-align: center;
    }
    
    .confirmation-message {
      text-align: center;
      margin-bottom: 24px;
      font-size: 16px;
      line-height: 1.6;
      color: #666;
    }
    
    .btn-danger {
      background: linear-gradient(135deg, #e74c3c 0%, #c0392b 100%);
      color: white;
    }
    
    .btn-danger:hover {
      background: linear-gradient(135deg, #c0392b 0%, #a33025 100%);
    }
    
    /* Resource Preview Modal styles */
    .preview-modal {
      width: 90%;
      max-width: 900px;
    }
    
    .preview-content {
      padding: 20px;
    }
    
    .pdf-preview, .video-preview, .ppt-preview, .code-preview, .image-preview {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 500px;
      border: 1px solid #eee;
      border-radius: 8px;
      overflow: hidden;
      background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
    }
    
    .pdf-placeholder, .video-placeholder, .ppt-placeholder, .code-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      color: #666;
    }
    
    .pdf-placeholder i, .video-placeholder i, .ppt-placeholder i {
      font-size: 64px;
      color: #999;
    }
    
    .preview-note {
      font-size: 14px;
      color: #999;
    }
    
    .video-player {
      width: 100%;
      height: 100%;
      background-color: black;
    }
    
    .preview-image {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
    }
    
    .code-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: linear-gradient(135deg, #f0f0f0 0%, #e8e8e8 100%);
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }
    
    .code-language {
      font-weight: 600;
      color: #333;
    }
    
    .code-block {
      background-color: #282c34;
      color: #abb2bf;
      border-radius: 0 0 8px 8px;
      padding: 16px;
      overflow-x: auto;
      height: 450px;
      width: 100%;
      font-family: 'Fira Code', 'Courier New', Courier, monospace;
    }
    
    .code-block code {
      white-space: pre;
      font-size: 14px;
      line-height: 1.6;
    }
    
    /* File upload styles */
    .file-upload-container {
      position: relative;
      margin-top: 8px;
    }
    
    .file-input {
      position: absolute;
      width: 0.1px;
      height: 0.1px;
      opacity: 0;
      overflow: hidden;
      z-index: -1;
    }
    
    .file-upload-box {
      border: 2px dashed #4a6cf7;
      border-radius: 10px;
      padding: 40px 20px;
      text-align: center;
      cursor: pointer;
      transition: all 0.3s ease;
      background: linear-gradient(135deg, rgba(74, 108, 247, 0.05) 0%, rgba(74, 108, 247, 0.1) 100%);
    }
    
    .file-upload-box:hover {
      background: linear-gradient(135deg, rgba(74, 108, 247, 0.1) 0%, rgba(74, 108, 247, 0.15) 100%);
    }
    
    .upload-icon {
      font-size: 48px;
      color: #4a6cf7;
      margin-bottom: 16px;
    }
    
    .upload-text {
      margin: 0 0 8px 0;
      font-weight: 500;
      color: #333;
      font-size: 16px;
    }
    
    .upload-hint {
      margin: 0;
      font-size: 14px;
      color: #666;
    }
    
    .selected-file {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 16px;
      padding: 12px 16px;
      background: linear-gradient(135deg, #f5f5f5 0%, #f0f0f0 100%);
      border-radius: 8px;
      border-left: 4px solid #4a6cf7;
    }
    
    .file-size {
      color: #666;
      font-size: 14px;
      margin-left: 4px;
    }
    
    /* Dropdown menu styles */
    .filter-dropdown {
      position: relative;
    }
    
    .dropdown-menu {
      position: absolute;
      top: 100%;
      left: 0;
      z-index: 10;
      min-width: 200px;
      padding: 8px 0;
      margin-top: 8px;
      background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
      border: 1px solid #eee;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    
    .dropdown-item {
      padding: 10px 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;
    }
    
    .dropdown-item:hover {
      background: linear-gradient(135deg, #f5f5f5 0%, #f0f0f0 100%);
    }
    
    .dropdown-item.active {
      background: linear-gradient(135deg, rgba(74, 108, 247, 0.1) 0%, rgba(74, 108, 247, 0.15) 100%);
      color: #4a6cf7;
      font-weight: 500;
    }
    
    .search-box {
      position: relative;
    }
    
    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #666;
    }
    
    .search-box input {
      padding: 10px 12px 10px 40px;
      width: 240px;
      height: 40px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 14px;
      transition: all 0.2s ease;
    }
    
    .search-box input:focus {
      border-color: #4a6cf7;
      outline: none;
      box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
    }
    
    /* Status dots */
    .status-dot {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      margin-right: 6px;
    }
    
    .status-dot.in-progress {
      background-color: #ff9800;
    }
    
    .status-dot.completed {
      background-color: #4caf50;
    }
    
    /* Responsive styles */
    .btn-light-blue {
      background-color: #A0D2DB; /* Light Blue */
      border-color: #A0D2DB;
      color: #FFFFFF; /* White text */
    }
    
    .btn-light-blue:hover {
      background-color: #8FBEC5; /* Darker Light Blue */
      border-color: #8FBEC5;
      color: #FFFFFF;
    }
    
    .btn-light-blue:active,
    .btn-light-blue:focus {
      background-color: #7DAEB5; /* Even Darker Light Blue */
      border-color: #7DAEB5;
      color: #FFFFFF;
      box-shadow: 0 0 0 0.2rem rgba(160, 210, 219, 0.5); /* Optional: focus ring */
    }
    
    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        gap: 20px;
        text-align: center;
      }
    
      .action-buttons {
        width: 100%;
        justify-content: center;
      }
    
      .nav-tabs {
        flex-wrap: wrap;
      }
    
      .tab-item {
        padding: 12px 16px;
        font-size: 14px;
      }
    
      .panel-header {
        flex-direction: column;
        gap: 16px;
        align-items: flex-start;
      }
    
      .panel-actions {
        width: 100%;
        flex-wrap: wrap;
      }
    
      .resources-grid {
        grid-template-columns: 1fr;
      }
    
      .exercise-list {
        grid-template-columns: 1fr;
      }
    
      .resource-card {
        flex-direction: column;
      }
    
      .resource-actions {
        margin-top: 12px;
      }
    
      .exercise-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }
    
      .exercise-stats {
        justify-content: space-around;
      }
    
      .modal-content {
        width: 95%;
      }
    
      .search-box input {
        width: 100%;
      }
    }
    
    .outline-edit-modal {
      max-width: 800px;
    }
    
    .outline-sections {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 20px;
    }
    
    .outline-edit-section {
      border: 1px solid #eee;
      border-radius: 8px;
      padding: 16px;
      background: #f8f9fa;
    }
    
    .section-edit-header {
      display: flex;
      gap: 12px;
      align-items: center;
      margin-bottom: 12px;
    }
    
    .section-title-input {
      font-size: 18px;
      font-weight: 600;
    }
    
    .points-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 12px;
    }
    
    .point-item {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    
    .point-item input {
      flex-grow: 1;
    }
    
    .btn-icon.small {
      padding: 4px;
      font-size: 14px;
    }
    
    .add-section-btn {
      width: 100%;
      margin-bottom: 20px;
    }
    
    .flex-grow {
      flex-grow: 1;
    }
    
    .mb-0 {
      margin-bottom: 0;
    }
    
    .permission-settings {
      background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
      border-radius: 12px;
      padding: 20px;
      border: 1px solid rgba(74, 108, 247, 0.1);
      box-shadow: 0 4px 20px rgba(74, 108, 247, 0.05);
    }
    
    .visibility-toggle {
      display: flex;
      gap: 12px;
      margin-bottom: 20px;
    }
    
    .visibility-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px;
      border: 2px solid transparent;
      border-radius: 8px;
      background: linear-gradient(145deg, #f8f9fa 0%, #f2f4f6 100%);
      color: #666;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    
    .visibility-btn:hover {
      background: linear-gradient(145deg, #f0f7ff 0%, #e6f0ff 100%);
      color: #4a6cf7;
      transform: translateY(-1px);
    }
    
    .visibility-btn.active {
      background: linear-gradient(145deg, #4a6cf7 0%, #2651e9 100%);
      color: white;
      box-shadow: 0 4px 15px rgba(74, 108, 247, 0.3);
    }
    
    .visibility-btn.active:hover {
      background: linear-gradient(145deg, #5a78f8 0%, #3661fa 100%);
      transform: translateY(-1px);
    }
    
    .class-select {
      margin-top: 16px;
    }
    
    .time-limit {
      margin-top: 16px;
    }
    
    .time-range {
      margin-top: 12px;
    }
    
    .time-range input {
      width: 100%;
      margin-top: 8px;
    }
    
    .permission-group {
      margin-top: 24px;
    }
    
    .permission-label {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin-bottom: 12px;
      display: block;
      background: linear-gradient(to right, #333 30%, #666);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .class-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px;
    }
    
    .class-option {
      position: relative;
      display: flex;
      align-items: center;
      padding: 14px 20px;
      background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
      border: 2px solid transparent;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }
    
    .class-option:hover {
      background: linear-gradient(145deg, #f0f7ff 0%, #e6f0ff 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(74, 108, 247, 0.1);
    }
    
    .class-option.selected {
      background: linear-gradient(145deg, #4a6cf7 0%, #2651e9 100%);
      box-shadow: 0 4px 15px rgba(74, 108, 247, 0.15);
    }
    
    .class-option.selected:hover {
      background: linear-gradient(145deg, #5a78f8 0%, #3661fa 100%);
      transform: translateY(-1px);
      box-shadow: 0 6px 18px rgba(74, 108, 247, 0.2);
    }
    
    .class-checkbox {
      display: none;
    }
    
    .class-name {
      flex: 1;
      font-size: 15px;
      font-weight: 500;
      color: #333;
      transition: all 0.3s ease;
    }
    
    .class-option.selected .class-name {
      color: white;
    }
    
    /* 移除 checkmark 相关样式 */
    .checkmark {
      display: none;
    }
    
    .class-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 12px;
      padding: 4px;
    }
    
    .version-history {
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }
    
    .version-label {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin-bottom: 16px;
      display: block;
      background: linear-gradient(to right, #333 30%, #666);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .version-list {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    
    .version-item {
      padding: 16px;
      border-radius: 8px;
      background: linear-gradient(145deg, #f8f9fa 0%, #f2f4f6 100%);
      border: 1px solid #eee;
      transition: all 0.2s ease;
    }
    
    .version-item:hover {
      background: linear-gradient(145deg, #f5f7ff 0%, #e8eeff 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(74, 108, 247, 0.1);
    }
    
    .version-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    
    .version-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .version-number {
      font-weight: 600;
      color: #4a6cf7;
      background: linear-gradient(145deg, #f0f7ff 0%, #e6f0ff 100%);
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 14px;
    }
    
    .version-date, .version-size {
      color: #666;
      font-size: 14px;
    }
    
    .version-actions {
      display: flex;
      gap: 8px;
    }
    
    .version-desc {
      margin: 8px 0;
      color: #444;
      font-size: 14px;
      line-height: 1.5;
    }
    
    .version-meta {
      margin-top: 8px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .version-author {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #666;
      font-size: 13px;
    }
    
    .version-group {
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid #eee;
    }
    
    .version-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    
    .version-badge {
      padding: 4px 12px;
      background: linear-gradient(135deg, #4a6cf7 0%, #2651e9 100%);
      color: white;
      border-radius: 20px;
      font-size: 14px;
      font-weight: 500;
    }
    
    .version-count {
      font-size: 14px;
      color: #666;
    }
    
    .version-item {
      padding: 16px;
      border-radius: 12px;
      background: linear-gradient(145deg, #f8f9fa 0%, #f2f4f6 100%);
      border: 1px solid #eee;
      transition: all 0.2s ease;
      margin-bottom: 12px;
    }
    
    .version-item:hover {
      background: linear-gradient(145deg, #f5f7ff 0%, #e8eeff 100%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(74, 108, 247, 0.1);
    }
    
    .version-item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    
    .version-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .version-number {
      font-weight: 600;
      color: #4a6cf7;
      background: linear-gradient(145deg, #f0f7ff 0%, #e6f0ff 100%);
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 14px;
    }
    
    .version-date, .version-size {
      color: #666;
      font-size: 14px;
    }
    
    .version-desc {
      margin: 8px 0;
      color: #444;
      font-size: 14px;
      line-height: 1.5;
    }
    
    .version-meta {
      margin-top: 8px;
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .version-author {
      display: flex;
      align-items: center;
      gap: 4px;
      color: #666;
      font-size: 13px;
    }
    
    .version-actions {
      display: flex;
      gap: 8px;
    }
    
    .fade-enter-active, .fade-leave-active {
      transition: opacity 0.3s ease;
    }
    
    .fade-enter-from, .fade-leave-to {
      opacity: 0;
    }
    
    .exercise-modal {
      max-width: 900px;
      background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
      border-radius: 16px;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
      overflow: hidden;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
    }
    
    .exercise-modal .modal-body {
      padding: 32px;
      overflow-y: auto;
      scrollbar-width: none; /* Firefox */
      -ms-overflow-style: none; /* IE and Edge */
    }
    
    .exercise-modal .modal-body::-webkit-scrollbar {
      display: none; /* Chrome, Safari and Opera */
    }
    
    .exercise-modal .modal-header {
      background: linear-gradient(135deg, #4a6cf7 0%, #2651e9 100%);
      padding: 24px;
      border-bottom: none;
    }
    
    .exercise-modal .modal-header h3 {
      color: white;
      font-size: 24px;
      font-weight: 600;
    }
    
    .exercise-modal .modal-body {
      padding: 32px;
    }
    
    .exercise-modal .form-group {
      margin-bottom: 24px;
    }
    
    .exercise-modal .form-group label {
      font-size: 15px;
      font-weight: 600;
      color: #333;
      margin-bottom: 10px;
      display: block;
    }
    
    .exercise-modal input[type="text"],
    .exercise-modal input[type="datetime-local"],
    .exercise-modal input[type="number"],
    .exercise-modal textarea,
    .exercise-modal select {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e0e6ed;
      border-radius: 10px;
      font-size: 15px;
      transition: all 0.3s ease;
      background: white;
    }
    
    .exercise-modal input:focus,
    .exercise-modal textarea:focus,
    .exercise-modal select:focus {
      border-color: #4a6cf7;
      box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
      outline: none;
    }
    
    .submission-settings {
      background: linear-gradient(145deg, #f0f7ff 0%, #e6f0ff 100%);
      border-radius: 12px;
      padding: 20px;
      border: 2px solid rgba(74, 108, 247, 0.1);
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .submission-settings:hover {
      background: linear-gradient(145deg, #e6f0ff 0%, #dce6ff 100%);
    }
    
    .submission-settings.active {
      background: linear-gradient(145deg, #4a6cf7 0%, #2651e9 100%);
      border-color: transparent;
    }
    
    .submission-settings.active .checkbox-label,
    .submission-settings.active .setting-hint {
      color: white;
    }
    
    .submission-settings.active .setting-hint {
      background: rgba(255, 255, 255, 0.2);
    }
    
    .checkbox-label {
      font-size: 15px;
      color: #333;
      display: flex;
      align-items: center;
      gap: 8px;
      user-select: none;
    }
    
    .checkbox-label input[type="checkbox"] {
      display: none;
    }
    
    .setting-hint {
      margin-top: 12px;
      padding: 8px 12px;
      background: rgba(74, 108, 247, 0.1);
      border-radius: 6px;
      font-size: 14px;
      color: #4a6cf7;
    }
    
    .questions-section {
      margin-top: 32px;
      padding-top: 32px;
      border-top: 2px solid #e0e6ed;
    }
    
    .section-header {
      margin-bottom: 24px;
    }
    
    .section-header h4 {
      font-size: 20px;
      background: linear-gradient(135deg, #333 0%, #666 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    
    .total-score {
      padding: 6px 16px;
      background: linear-gradient(135deg, #4a6cf7 0%, #2651e9 100%);
      color: white;
      border-radius: 20px;
      font-size: 15px;
      font-weight: 500;
      box-shadow: 0 4px 12px rgba(74, 108, 247, 0.2);
    }
    
    .empty-questions {
      padding: 48px;
      background: linear-gradient(145deg, #f0f7ff 0%, #e6f0ff 100%);
      border-radius: 12px;
      text-align: center;
      border: 2px dashed rgba(74, 108, 247, 0.2);
    }
    
    .empty-questions i {
      font-size: 64px;
      color: #4a6cf7;
      margin-bottom: 20px;
      opacity: 0.5;
    }
    
    .empty-questions p {
      font-size: 16px;
      color: #666;
      margin: 0;
    }
    
    .question-item {
      padding: 20px;
      background: white;
      border-radius: 12px;
      border: 2px solid #e0e6ed;
      transition: all 0.3s ease;
      margin-bottom: 16px;
    }
    
    .question-item:hover {
      transform: translateY(-2px);
      border-color: #4a6cf7;
      box-shadow: 0 8px 24px rgba(74, 108, 247, 0.1);
    }
    
    .question-type-badge {
      padding: 6px 12px;
      border-radius: 6px;
      font-weight: 500;
    }
    
    .question-type-badge i {
      font-size: 16px;
    }
    
    .question-score {
      padding: 4px 12px;
      background: linear-gradient(145deg, #f0f7ff 0%, #e6f0ff 100%);
      border-radius: 20px;
      color: #4a6cf7;
      font-weight: 600;
    }
    
    .questions-actions {
      margin-top: 24px;
      display: flex;
      gap: 16px;
    }
    
    .questions-actions .btn {
      flex: 1;
      padding: 12px 24px;
      font-size: 15px;
      font-weight: 500;
      border-radius: 10px;
      transition: all 0.3s ease;
    }
    
    .questions-actions .btn-outline {
      border: 2px solid #4a6cf7;
    }
    
    .questions-actions .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(74, 108, 247, 0.15);
    }
    
    /* 题库选择弹窗样式 */
    .question-bank-modal {
      max-width: 1000px;
      background: linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%);
      border-radius: 16px;
    }
    
    .question-filters {
      margin-bottom: 24px;
    }
    
    .type-filters {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 16px;
    }
    
    .type-filter-btn {
      padding: 10px 20px;
      border-radius: 25px;
      font-weight: 500;
      transition: all 0.3s ease;
      background: linear-gradient(145deg, #f0f7ff 0%, #e6f0ff 100%);
      border: none;
      color: #4a6cf7;
    }
    
    .type-filter-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(74, 108, 247, 0.1);
    }
    
    .type-filter-btn.active {
      background: linear-gradient(135deg, #4a6cf7 0%, #2651e9 100%);
      color: white;
      box-shadow: 0 4px 12px rgba(74, 108, 247, 0.2);
    }
    
    .bank-question-item {
      padding: 16px;
      background: white;
      border-radius: 12px;
      border: 2px solid #e0e6ed;
      transition: all 0.3s ease;
      margin-bottom: 12px;
    }
    
    .bank-question-item:hover {
      border-color: #4a6cf7;
      transform: translateX(5px);
      box-shadow: 0 4px 12px rgba(74, 108, 247, 0.1);
    }
    
    /* 添加/编辑题目弹窗样式 */
    .question-modal {
      max-width: 800px;
    }
    
    .question-type-selector {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 16px;
      margin-top: 12px;
    }
    
    .type-select-btn {
      padding: 20px;
      border-radius: 12px;
      background: linear-gradient(145deg, #f0f7ff 0%, #e6f0ff 100%);
      border: 2px solid transparent;
      transition: all 0.3s ease;
    }
    
    .type-select-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(74, 108, 247, 0.1);
    }
    
    .type-select-btn.active {
      background: linear-gradient(135deg, #4a6cf7 0%, #2651e9 100%);
      color: white;
      box-shadow: 0 8px 24px rgba(74, 108, 247, 0.2);
    }
    
    .type-select-btn i {
      font-size: 32px;
      margin-bottom: 12px;
    }
    
    .options-list {
      background: white;
      border-radius: 12px;
      padding: 16px;
      border: 2px solid #e0e6ed;
    }
    
    .option-item {
      padding: 12px;
      background: #f8f9fa;
      border-radius: 8px;
      margin-bottom: 8px;
    }
    
    .test-cases {
      background: white;
      border-radius: 12px;
      padding: 16px;
      border: 2px solid #e0e6ed;
    }
    
    .test-case {
      padding: 12px;
      background: #f8f9fa;
      border-radius: 8px;
      margin-bottom: 8px;
    }
    
    .modal-footer {
      padding: 24px;
      background: #f8f9fa;
      border-top: 2px solid #e0e6ed;
    }
    
    .selection-count {
      padding: 6px 16px;
      background: linear-gradient(145deg, #f0f7ff 0%, #e6f0ff 100%);
      border-radius: 20px;
      color: #4a6cf7;
      font-weight: 500;
    }
    
    /* 动画效果 */
    .question-item,
    .bank-question-item,
    .type-filter-btn,
    .type-select-btn,
    .questions-actions .btn {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    /* 滚动条美化 */
    .question-bank-list::-webkit-scrollbar {
      width: 8px;
    }
    
    .question-bank-list::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }
    
    .question-bank-list::-webkit-scrollbar-thumb {
      background: #c1c1c1;
      border-radius: 4px;
    }
    
    .question-bank-list::-webkit-scrollbar-thumb:hover {
      background: #a8a8a8;
    }
    
    /* Add loading and error styles */
    .loading-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.9);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    
    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #f3f3f3;
      border-top: 3px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 10px;
    }
    
    .error-message {
      background-color: #fee2e2;
      border: 1px solid #ef4444;
      color: #dc2626;
      padding: 16px;
      margin: 16px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .retry-button {
      background-color: #dc2626;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .retry-button:hover {
      background-color: #b91c1c;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    </style>
    