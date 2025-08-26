<template>
  <div class="outline-editor">
    <div class="outline-section" v-for="(section, index) in outline" :key="index">
      <div class="section-header">
        <div class="section-title-container">
          <span v-if="!section.editing" @click="startEditing(index)">
            {{ section.title }}
          </span>
          <input
            v-else
            v-model="section.title"
            @blur="finishEditing(index)"
            @keyup.enter="finishEditing(index)"
            ref="titleInput"
            type="text"
          />
        </div>
        <div class="section-actions">
          <el-button type="text" @click="startEditing(index)">
            <i class="el-icon-edit"></i>
          </el-button>
          <el-button type="text" @click="deleteSection(index)">
            <i class="el-icon-delete"></i>
          </el-button>
        </div>
      </div>

      <div class="section-content">
        <div v-if="!section.editing" @click="startEditing(index)">
          {{ section.content }}
        </div>
        <el-input
          v-else
          v-model="section.content"
          type="textarea"
          rows="4"
          @blur="finishEditing(index)"
        />
      </div>
    </div>

    <div class="add-section">
      <el-button type="primary" @click="addSection">添加新章节</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'OutlineEditor',
  data() {
    return {
      outline: []
    }
  },
  methods: {
    addSection() {
      this.outline.push({
        title: '新章节',
        content: '请输入章节内容',
        editing: true
      })
    },
    startEditing(index) {
      this.outline[index].editing = true
      this.$nextTick(() => {
        if (this.$refs.titleInput && this.$refs.titleInput[index]) {
          this.$refs.titleInput[index].focus()
        }
      })
    },
    finishEditing(index) {
      this.outline[index].editing = false
      this.$emit('update:outline', this.outline)
    },
    deleteSection(index) {
      this.$confirm('确定要删除这个章节吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.outline.splice(index, 1)
        this.$emit('update:outline', this.outline)
      }).catch(() => {})
    }
  }
}
</script>

<style scoped>
.outline-editor {
  padding: 20px;
}

.outline-section {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  margin-bottom: 20px;
  padding: 15px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.section-title-container {
  flex: 1;
  margin-right: 20px;
}

.section-title-container input {
  width: 100%;
  padding: 5px;
  border: 1px solid #409eff;
  border-radius: 4px;
}

.section-content {
  margin-top: 10px;
}

.add-section {
  margin-top: 20px;
  text-align: center;
}
</style>
