<template>
  <div class="resource-uploader">
    <el-upload
      class="upload-area"
      action="/api/upload"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :before-upload="beforeUpload"
      :on-success="handleSuccess"
      multiple
    >
      <el-button type="primary">点击上传</el-button>
      <template #tip>
        <div class="el-upload__tip">支持任意类型文件，单个文件不超过100MB</div>
      </template>
    </el-upload>

    <el-dialog v-model="permissionDialogVisible" title="设置资源权限" width="500px">
      <div class="permission-settings">
        <el-form :model="permissionForm" label-width="100px">
          <el-form-item label="可见范围">
            <el-radio-group v-model="permissionForm.visibility">
              <el-radio label="all">所有人可见</el-radio>
              <el-radio label="specific">特定班级可见</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="选择班级" v-if="permissionForm.visibility === 'specific'">
            <el-select
              v-model="permissionForm.selectedClasses"
              multiple
              placeholder="请选择班级"
              style="width: 100%"
            >
              <el-option
                v-for="item in classList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>

          <el-form-item label="时间限制">
            <el-switch v-model="permissionForm.hasTimeLimit" />
          </el-form-item>

          <el-form-item label="可见时间" v-if="permissionForm.hasTimeLimit">
            <el-date-picker
              v-model="permissionForm.timeRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 100%"
            />
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="permissionDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="savePermissions">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ResourceUploader',
  data() {
    return {
      permissionDialogVisible: false,
      currentFile: null,
      permissionForm: {
        visibility: 'all',
        selectedClasses: [],
        hasTimeLimit: false,
        timeRange: []
      },
      classList: [
        { id: 1, name: '2023级计算机科学1班' },
        { id: 2, name: '2023级计算机科学2班' },
        { id: 3, name: '2023级软件工程1班' },
        { id: 4, name: '2023级软件工程2班' }
      ]
    }
  },
  methods: {
    beforeUpload(file) {
      this.currentFile = file
      this.permissionDialogVisible = true
      return false // 阻止自动上传
    },
    handlePreview(file) {
      // 处理文件预览
      console.log('preview', file)
    },
    handleRemove(file) {
      // 处理文件移除
      console.log('remove', file)
    },
    handleSuccess(response, file) {
      // 处理上传成功
      console.log('success', response, file)
    },
    savePermissions() {
      // 创建FormData对象
      const formData = new FormData()
      formData.append('file', this.currentFile)
      formData.append('permissions', JSON.stringify({
        visibility: this.permissionForm.visibility,
        selectedClasses: this.permissionForm.selectedClasses,
        hasTimeLimit: this.permissionForm.hasTimeLimit,
        timeRange: this.permissionForm.timeRange
      }))

      // 发送上传请求
      // 这里需要根据实际API进行调整
      fetch('/api/upload-with-permissions', {
        method: 'POST',
        body: formData
      })
        .then(response => response.json())
        .then(() => {
          this.$message.success('上传成功')
          this.permissionDialogVisible = false
        })
        .catch(() => {
          this.$message.error('上传失败')
        })
    }
  }
}
</script>

<style scoped>
.resource-uploader {
  padding: 20px;
}

.upload-area {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  padding: 20px;
  text-align: center;
}

.permission-settings {
  padding: 20px;
}

.dialog-footer {
  padding: 20px 0;
  text-align: right;
}
</style>
