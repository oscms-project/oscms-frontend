<template>
  <div class="practice-report-container">
    <div class="report-header">
      <h1 class="report-title">练习报告</h1>
      <button 
          class="export-btn" 
          @click="exportToPdf" 
          :disabled="loading || reportList.length === 0"
        >
          <i class="icon">📄</i> 导出PDF
      </button>
    </div>
    
    <div v-if="loading" class="loading-indicator">
      <div class="spinner"></div>
      <p>正在加载报告数据...</p>
    </div>
    
    <div v-else-if="error" class="error-message">
      <i class="icon">⚠️</i> {{ error }}
    </div>
    
    <div v-else-if="reportList.length === 0" class="no-data">
      <i class="icon">📊</i> 暂无练习记录
    </div>
    
    <div v-else class="report-content">
      <table class="practice-report-table">
        <thead>
          <tr>
            <th width="50%">练习名称</th>
            <th width="25%">成绩</th>
            <th width="25%">班级排名</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in reportList" :key="item.assignmentId">
            <td class="exercise-title">{{ item.title }}</td>
            <td>
              <div :class="getScoreClass(item.score)">
                {{ item.score !== null ? item.score : '未提交' }}
              </div>
            </td>
            <td>
              <div :class="getRankClass(item.rank)">
                {{ item.rank !== null ? `第${item.rank}名` : '-' }}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { useCourseStore } from '@/stores/course';
import { getClassAssignments } from '@/api/class';
import { getAssignmentSubmissions } from '@/api/exercise'; // 你提供的接口
import { getStudentClassInCourse } from '@/api/class';  
import html2pdf from 'html2pdf.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const userStore = useUserStore();
const courseStore = useCourseStore();

const classId = ref(''); // 由课程详情页传递或store获取
const reportList = ref([]);
const loading = ref(true);
const error = ref('');

const fetchClassId = async () => {
  try {
    console.log("查询学生班级，学生ID:", userStore.userId, "课程ID:", courseStore.currentCourseId);
    const classRes = await getStudentClassInCourse(userStore.userId, courseStore.currentCourseId);
    
    if (classRes.data && classRes.data.data && classRes.data.data.id) {
      classId.value = classRes.data.data.id;
      console.log("获取到班级ID:", classId.value);
      return true;
    }
    error.value = "未找到您在此课程中的班级信息";
    return false;
  } catch (e) {
    console.error('获取班级信息失败:', e);
    error.value = "无法获取班级信息";
    return false;
  }
};

// 获取练习报告数据
const fetchExerciseReport = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    // 先获取班级ID
    const hasClassId = await fetchClassId();
    if (!hasClassId) {
      loading.value = false;
      return;
    }

    // 获取班级下所有练习
    const assignmentsRes = await getClassAssignments(classId.value);
    const assignments = assignmentsRes.data?.data || [];

    // 清空当前列表
    reportList.value = [];

    // 遍历每个练习，获取提交记录
    for (const assignment of assignments) {
      try {
        const submissionsRes = await getAssignmentSubmissions(classId.value, assignment.id);
        const submissions = submissionsRes.data?.data || [];

        // 找到当前学生的提交
        const mySubmission = submissions.find(sub => sub.studentId === userStore.userId);

        // 计算成绩排名
        const scores = submissions
          .filter(sub => typeof sub.totalScore === 'number')
          .map(sub => sub.totalScore)
          .sort((a, b) => b - a); // 降序

        let rank = null;
        if (mySubmission && typeof mySubmission.totalScore === 'number') {
          rank = scores.indexOf(mySubmission.totalScore) + 1;
        }

        reportList.value.push({
          assignmentId: assignment.id,
          title: assignment.title,
          score: mySubmission ? mySubmission.totalScore : null,
          rank: rank
        });
      } catch (err) {
        console.error(`获取练习${assignment.id}的提交记录失败:`, err);
      }
    }
  } catch (e) {
    console.error('获取练习报告失败:', e);
    error.value = "获取练习报告失败";
  } finally {
    loading.value = false;
  }
};


const exportToPdf = async () => {
  // 获取要转换的DOM元素
  const element = document.querySelector('.practice-report-container');
  
  // 隐藏导出按钮避免它出现在PDF中
  const exportBtn = element.querySelector('.export-btn');
  const exportBtnDisplay = exportBtn ? exportBtn.style.display : '';
  
  try {
    // 隐藏按钮
    if (exportBtn) exportBtn.style.display = 'none';
    
    // 设置生成PDF的日期时间
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    // 转换HTML为Canvas
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: true,
      letterRendering: true,
      allowTaint: true
    });
    
    // Canvas转为图片
    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    
    // 计算PDF尺寸（A4）
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
    const imgX = (pdfWidth - imgWidth * ratio) / 2;
    let imgY = 20; // 顶部留出20mm空间
    
    // 添加页眉
    pdf.setFontSize(20);
    pdf.setTextColor(44, 62, 80);
    pdf.text('练习报告', pdfWidth/2, 10, {align: 'center'});
    
    // 添加图像
    pdf.addImage(
      imgData, 'JPEG', 
      imgX, imgY, 
      imgWidth * ratio, imgHeight * ratio
    );
    
    // 保存PDF
    pdf.save(`练习报告_${dateStr}.pdf`);
    
  } catch (error) {
    console.error('PDF导出失败:', error);
    alert('PDF导出失败，请查看控制台了解详情。');
  } finally {
    // 无论成功还是失败，都确保恢复按钮显示
    if (exportBtn) {
      // 明确设置为 'block' 或使用保存的值
      exportBtn.style.display = exportBtnDisplay || 'inline-flex';
    }
  }
};
// 页面加载时获取数据
onMounted(() => {
  fetchExerciseReport();
});

// 添加这些方法来获取基于分数和排名的样式类
const getScoreClass = (score) => {
  if (score === null) return 'score-box score-none';
  if (score >= 90) return 'score-box score-excellent';
  if (score >= 75) return 'score-box score-good';
  if (score >= 60) return 'score-box score-pass';
  return 'score-box score-fail';
};

const getRankClass = (rank) => {
  if (rank === null) return 'rank-box rank-none';
  if (rank === 1) return 'rank-box rank-first';
  if (rank === 2) return 'rank-box rank-second';
  if (rank === 3) return 'rank-box rank-third';
  if (rank <= 10) return 'rank-box rank-top';
  return 'rank-box rank-normal';
};
</script>

<style scoped>
.practice-report-container {
  max-width: 900px;
  margin: 40px auto;
  background: #ffffff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 8px 30px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
}

/* 标题区域 */
.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 20px;
}

.report-title {
  font-size: 32px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
  position: relative;
}

.report-title:after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 0;
  width: 60px;
  height: 4px;
  background: #3498db;
  border-radius: 2px;
}

/* 导出按钮样式 */
.export-btn {
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 6px rgba(52, 152, 219, 0.2);
}

.export-btn .icon {
  margin-right: 8px;
}

.export-btn:hover {
  background-color: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(52, 152, 219, 0.3);
}

.export-btn:disabled {
  background-color: #bdc3c7;
  transform: none;
  box-shadow: none;
  cursor: not-allowed;
}

/* 表格样式 */
.report-content {
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
}

.practice-report-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
}

.practice-report-table th {
  background: #3498db;
  color: white;
  padding: 16px 12px;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.practice-report-table td {
  padding: 16px 12px;
  text-align: center;
  border-bottom: 1px solid #e2e8f0;
}

.practice-report-table tr:last-child td {
  border-bottom: none;
}

.practice-report-table tr:nth-child(even) {
  background-color: rgba(240, 240, 240, 0.3);
}

.practice-report-table tr:hover {
  background-color: rgba(52, 152, 219, 0.05);
}

/* 练习名称样式 */
.exercise-title {
  text-align: left;
  font-weight: 600;
  color: #34495e;
  padding-left: 15px;
}

/* 分数样式盒子 */
.score-box {
  padding: 8px 12px;
  border-radius: 8px;
  font-weight: bold;
  display: inline-block;
  min-width: 80px;
  text-align: center;
}

.score-excellent {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.score-good {
  background-color: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
}

.score-pass {
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeeba;
}

.score-fail {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.score-none {
  background-color: #e2e3e5;
  color: #383d41;
  border: 1px solid #d6d8db;
}

/* 排名样式盒子 */
.rank-box {
  padding: 8px 12px;
  border-radius: 8px;
  font-weight: bold;
  display: inline-block;
  min-width: 80px;
}

.rank-first {
  background-color: #fef2d0;
  color: #8a5d00;
  border: 1px solid #fde8b3;
}

.rank-second {
  background-color: #e8e8e8;
  color: #5a5a5a;
  border: 1px solid #d1d1d1;
}

.rank-third {
  background-color: #f5e1d0;
  color: #8a4800;
  border: 1px solid #f1d0b8;
}

.rank-top {
  background-color: #d8f3e3;
  color: #0f6848;
  border: 1px solid #c3e9d5;
}

.rank-normal {
  background-color: #e6eaf2;
  color: #3a4a6d;
  border: 1px solid #d6dce8;
}

.rank-none {
  background-color: #e2e3e5;
  color: #383d41;
  border: 1px solid #d6d8db;
}

/* 加载、错误和空状态 */
.loading-indicator, .error-message, .no-data {
  padding: 40px;
  text-align: center;
  border-radius: 8px;
  margin-top: 20px;
}

.loading-indicator {
  background-color: #f8fafc;
}

.spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 16px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  background-color: #fff5f5;
  color: #e53e3e;
}

.no-data {
  background-color: #f8fafc;
  color: #718096;
}

.icon {
  font-size: 24px;
  margin-bottom: 12px;
  display: block;
}

/* PDF导出专用样式 */
.pdf-header {
  text-align: center;
  margin-bottom: 30px;
}

.pdf-header h1 {
  font-size: 28px;
  margin-bottom: 20px;
  color: #2c3e50;
}

.student-info {
  display: flex;
  justify-content: space-around;
  margin: 20px 0;
  background: #f8fafc;
  padding: 15px;
  border-radius: 8px;
}

.student-info p {
  margin: 5px 0;
  font-size: 15px;
}

/* 打印样式 */
@media print {
  .practice-report-table {
    page-break-inside: avoid;
  }
  
  .report-title:after {
    display: none;
  }
}
</style>