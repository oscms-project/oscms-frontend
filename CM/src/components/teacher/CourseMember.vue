<template>
  <div>
    <div class="header">
      <div class="header-left">
        <span class="header-icon" @click="jumpToHomework"><i class="iconfont iconfanhui"
                                                             style="font-size:38px;color:#5F6368;"></i></span>
        <span class="courseName" @click="jumpToHomework">{{ course.courseName }}</span>
      </div>
      <div class="header-center">
        <span>成员</span>
        <span>学生分组</span>
        <span @click="jumpToGrade">成绩</span>
      </div>
      <div class="header-right">
        <span><i class="iconfont iconxiaoxi1" style="font-size: 32px;color: #5F6368;"></i></span>
        <span><img src="../../assets/picture/33 (1).png" style="width:30px;height:30px"></span>
      </div>
    </div>

    <div class="member-title">
      <div class="title-left">
        <span class="import">导入成员</span>
        <span class="titleW">
          <span><i class="iconfont iconxiazaibaobiao"></i></span>
          <span>下载成员信息</span>
        </span>
        <span class="titleW">
          <span><i class="iconfont iconchengyuantuikexinxi1"></i></span>
          <span>成员退课记录</span>
        </span>
      </div>
      <div class="title-right">
        <el-input
            class="el-input"
            placeholder="姓名、学号"
            suffix-icon="el-icon-search"
            v-model="input2">
        </el-input>
      </div>
    </div>

    <div class="member-cont">
      <div class="box-l">
        <div class="box-group" @click="displayTeam">教学团队(1)</div>
        <div class="box-group" @click="displayStudent">全部学生(学生{{ course.courseNum - 1 }})</div>
      </div>
      <!--全部学生-->
      <div class="box-r" v-if="this.role==='student'">
        <div class="r-name">
          <div><p style="margin-left:20px;color: rgba(59,61,69,1);">全部学生(学生{{ course.courseNum - 1 }})</p></div>
          <div style="padding-right:30px;padding-top: 15px;">
            <span style="padding-right:20px"><el-checkbox v-model="limit">人数限制</el-checkbox></span>
            <span>
              <el-switch
                  v-model="retire"
                  active-text="不允许退课">
              </el-switch>
            </span>
          </div>
        </div>

        <!--查询表单-->
        <el-form :inline="true" class="demo-form-inline">
          <el-form-item style="width:16%;padding-right: 25px">
            <el-input v-model="usernameSearch" placeholder="学生姓名"/>
          </el-form-item>
          <el-form-item style="width:16%;padding-right: 25px">
            <el-input v-model="accountSearch" placeholder="学号"/>
          </el-form-item>


          <el-button type="primary" icon="el-icon-search" @click="getStudents">查询</el-button>
          <el-button type="warning" @click="resetData()">清空</el-button>
          <el-button type="danger" @click="handleDeleteBatch" icon="el-icon-delete">删除选中</el-button>
        </el-form>


        <el-table :data="studentList" style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection"></el-table-column>

          <el-table-column label="序号" align="center">
            <template #default="scope">
               <span>{{ scope.$index + 1 }}</span>
            </template>
          </el-table-column>

          <el-table-column
              prop="logo"
              header-align="center"
              align="center"
              label="头像">
            <template #default="scope">
              <img :src="scope.row.avatar" alt="" style="width: 100px; height: 80px">
            </template>
          </el-table-column>

          <el-table-column label="名字" align="center">
            <template #default="scope">
              <span>{{ scope.row.username }}</span>
            </template>
          </el-table-column>

          <el-table-column label="学号" align="center">
            <template #default="scope">
              <span>{{ scope.row.account }}</span>
            </template>
          </el-table-column>


          <el-table-column label="邮箱" align="center">
            <template #default="scope">
              <span>{{ scope.row.email }}</span>
            </template>
          </el-table-column>

          <el-table-column label="加入时间" align="center">
            <template #default="scope">
              <span>{{ scope.row.createTime }}</span>
            </template>
          </el-table-column>


          <el-table-column label="操作" fixed="right">
            <template #default="scope">
              <el-button @click="handleDelete(scope.row)" type="danger" size="small">删除</el-button>
            </template>
          </el-table-column>
        </el-table>


      </div>


      <!--教师团队-->
      <div class="box-r teacherTeam" v-if="this.role ==='team'">
        <div class="r-name">
          <div><p style="margin-left:20px;color: rgba(59,61,69,1);">教学团队(老师1)</p></div>
          <div>
            <el-button type="primary" icon="el-icon-user-solid" class="addTeacher">添加助教/老师</el-button>
          </div>
        </div>
        <div class="data">
          <span><img :src=teacher.avatar class="avator" style="margin-left:40px"></span>
          <span class="name">{{ teacher.username }}</span>
          <span class="mail" style="margin-left:280px">{{ teacher.email }}</span>
          <span class="identity">(管理员)</span>
          <span class="opt1">
              <span style="cursor:pointer"><img src="../../assets/picture/sixin.png"></span>
              <span style="margin-left: 15px;cursor:pointer"><i class="el-icon-more"></i></span>
            </span>
        </div>
      </div>


    </div>
    <div style="height:150px">
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import course from "@/api/course"
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()

// 响应式数据
const input2 = ref('')
const usernameSearch = ref('')
const accountSearch = ref('')
const limit = ref(false)
const retire = ref(false)
const role = ref('team')
const courseData = reactive({
  course: {},
  teacher: {},
  classmateCount: '',
  studentList: [],
  teacherList: [],
  multipleSelection: []
})

// 方法定义
const jumpToGrade = () => {
  router.push({ name: 'grade' })
}

const handleSelectionChange = (val) => {
  courseData.multipleSelection = val
}

const getTeacherList = async (courseId) => {
  try {
    const res = await course.getAllTeacher(courseId)
    courseData.teacher = res.data.teacherList[0]
  } catch (error) {
    console.error('获取教师列表失败:', error)
  }
}

const getStudents = async () => {
  try {
    const res = await course.findStudent(
      usernameSearch.value,
      accountSearch.value,
      sessionStorage.getItem("courseId")
    )
    courseData.studentList = res.data.studentList
  } catch (error) {
    console.error('查询学生失败:', error)
  }
}

const getStudentList = async (courseId) => {
  try {
    const res = await course.getAllStudent(courseId)
    courseData.studentList = res.data.studentList
  } catch (error) {
    console.error('获取学生列表失败:', error)
  }
}

const getCourse = async () => {
  const courseId = sessionStorage.getItem("courseId")
  try {
    const res = await course.getCourseById(courseId)
    courseData.course = res.data.course
  } catch (error) {
    console.error('获取课程信息失败:', error)
  }
}

const displayTeam = () => {
  role.value = 'team'
}

const resetData = () => {
  usernameSearch.value = ""
  accountSearch.value = ""
  getStudentList(sessionStorage.getItem("courseId"))
}

const handleDeleteBatch = async () => {
  try {
    await ElMessageBox.confirm('此操作将永久删除学生, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const ids = courseData.multipleSelection.map(item => item.id)
    const courseId = sessionStorage.getItem('courseId')
    await course.removeStudents(courseId, ids)

    ElMessage.success('删除成功!')
    await getStudentList(courseId)
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm('此操作将永久删除该学生, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })

    const courseId = sessionStorage.getItem('courseId')
    await course.removeStudents(courseId, [row.id])

    ElMessage.success('删除成功!')
    await getStudentList(courseId)
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const displayStudent = () => {
  role.value = 'student'
}

const jumpToHomework = () => {
  router.push({ name: 'THomework' })
}

// 生命周期钩子
onMounted(() => {
  getCourse()
  getStudentList(sessionStorage.getItem("courseId"))
  getTeacherList(sessionStorage.getItem("courseId"))
})
</script>

<style scoped>
@import url('../../assets/file/iconfont.css');

.header {
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.04);
  background: none repeat scroll 0% 0% #fff;
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  height: 45px;
}

.header-icon {
  cursor: pointer;
}

.courseName {
  cursor: pointer;
  background: #2c58ab;
  color: white;
  padding: 6px 20px;
  border-radius: 16px;
  font-size: 14px;
  font-family: PingFangSC-Medium;
  font-weight: 500;
  position: relative;
  bottom: 16px;
  right: 45px;
}

.header-left {
  position: relative;
  left: 50px;
}

.header-right {
  position: relative;
  right: 100px;

}

.header-center span {
  height: 74px;
  padding-left: 50px;
  padding-right: 50px;
  font-size: 16px;
  font-weight: 500;
  color: rgba(59, 61, 69, 1);
  padding-bottom: 20px;
  cursor: pointer;

}

.header-center span:hover {
  border-bottom: 4px solid #2C58AB;
}

.member-title {
  width: 1224px;
  margin: 25px auto;
  padding: 15px 0;
  display: flex;
  justify-content: space-between;
  box-shadow: 0 1px 0 0 rgba(226, 230, 237, 1);
}

.import {
  padding: 6px 23px;
  height: 32px;
  text-align: center;
  border-radius: 4px;
  background: #32BAF0;
  color: #FFF;
  font-size: 14px;
  cursor: pointer;
}

.titleW {
  color: #5F6368;
  margin-left: 20px;
  cursor: pointer;
}

.el-input /deep/ .el-input__inner {
  height: 30px;
  width: 176px;
}

.member-cont {
  width: 1232px;
  height: 600px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
}

.box-l {
  width: 286px;
  height: 600px;
  border: 1px solid rgba(226, 230, 237, 1);
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  position: relative;
  left: 5px;
}

.box-r {
  width: 937px;
  height: 600px;
  border: 1px solid rgba(226, 230, 237, 1);
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
}

.box-group {
  height: 55px;
  line-height: 55px;
  padding: 0 24px;
  cursor: pointer;
  font-weight: 500;
  color: rgba(59, 61, 69, 1);
}

.box-group:hover {
  background: #B0C4DE;
}

.box-group:active {
  background: #32BAF0 !important;
}

.r-name {
  display: flex;
  justify-content: space-between;
  height: 55px;
  background: rgba(241, 243, 244, 1);
  border-radius: 0 8px 0 0;
}

.batchdelete {
  height: 55px;
  border-bottom: 1px solid rgba(226, 230, 237, 1);
}

.btn_cbatch {
  margin-left: 30px;
  margin-top: 20px;
}

.checkAll {
  font-size: 14px;
  color: #2d2d2d;
  margin-left: 16px;
}

.btn_delete_checked {
  margin-left: 10px;
  width: 100px;
  height: 30px;
  padding-top: 8px;
  background: #ddd;
  opacity: 1;
  border: none;
  color: #fff;
}

.btn_message_checked {
  margin-left: 10px;
  width: 100px;
  height: 30px;
  padding-top: 8px;
  background: #ddd;
  opacity: 1;
  border: none;
  color: #fff;
}

.data {
  height: 60px;
}

.data:hover {
  background: rgba(241, 243, 244, 1);
}

.avator {
  width: 40px;
  height: 40px;
  margin-left: 20px;
  position: relative;
  top: 10px;

}

.stuno {
  margin-left: 32px;
  font-size: 14px;
  position: relative;
  bottom: 3px;
}

.name {
  font-size: 14px;
  margin-left: 26px;
  position: relative;
}

.mail {
  font-size: 14px;
  margin-left: 55px;
  position: relative;
}

.natureclass {
  font-size: 14px;
  margin-left: 25px;
  position: relative;
}

.createtime {
  font-size: 14px;
  margin-left: 25px;
  position: relative;
}

.opt {
  margin-left: 90px;
  position: relative;
  top: 2px;
}

.addTeacher {
  padding-top: 0px;
  margin-right: 15px;
  width: 172px;
  height: 32px;
  background: rgba(50, 186, 240, 1);
  border-radius: 4px;
  color: #fff;
  line-height: 32px;
  margin-top: 12px;
}

.identify {
  font-size: 14px;
  margin-left: 25px;
  position: relative;
  bottom: 3px;
}

.opt1 {
  float: right;
  margin-top: 20px;
  margin-right: 25px;
}
</style>


