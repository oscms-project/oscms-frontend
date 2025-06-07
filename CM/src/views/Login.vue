<template>
<div class="login-container">
  <!-- 左侧空白区域，占据2/3宽度 -->
  <div class="left-section"></div>
  
  <!-- 右侧登录表单，占据1/3宽度 -->
  <div class="login-form">
    <div class="logo-wrapper">
      <img src="@/assets/logo.png" alt="logo" class="login-logo" />
    </div>
    <div class="login-header">
   
      <h1>账号登录</h1>
      <div class="login-tabs">
        <!-- <span class="tab active">学工号登录</span>
        <span class="tab">邮箱登录</span> -->
      </div>
    </div>
    
    <div class="login-body">
      <div class="form-group">
        <input 
          type="text" 
          v-model="id" 
          placeholder="请输入学工号" 
          class="form-input"
        />
      </div>
      
      <div class="form-group">
        <input 
          type="password" 
          v-model="password" 
          placeholder="请输入密码" 
          class="form-input"
        />
      </div>
      <div class="form-group">
  <div class="role-tip" style="margin-bottom: 6px; color: #666; font-size: 14px;">
    请选择对应的身份
  </div>
  <select v-model="role" class="form-input">
    <option value="student">student</option>
    <option value="ta">ta</option>
    <option value="teacher">teacher</option>
  </select>
</div>
      <div class="form-options">
        
        <span class="remember-me">
          <input type="checkbox" id="remember" v-model="rememberMe" />
          <label for="remember">记住密码</label>
        </span>
      </div>
      
      <button @click="handleLogin" class="login-button">登录</button>
      
      <div class="register-link">
        <span>还没有账号？</span>
        <a href="#" @click.prevent="goToRegister">立即注册</a>
      </div>
    </div>
    
    <div class="login-footer">
      
     
    </div>
  </div>
</div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/api/auth';
import { useUserStore } from '@/stores/user'; // 导入用户状态管理
// 响应式状态
const id = ref('');
const password = ref('');
const rememberMe = ref(false);
const router = useRouter();
const role = ref(''); 
const userStore = useUserStore(); // 使用用户状态存储


// 处理登录
const handleLogin = async() => {
  if (!id.value || !password.value || !role.value) {
    alert('请输入学工号、密码和选择身份');
    return;
  }

  try {
    // 构造请求体
    const payload = {
      userId: id.value,
      password: password.value,
      role: role.value
    };
    
    // 调用登录接口
    const res = await login(payload);
    
    // 根据返回的code判断是否登录成功
    if (res.data.code === 200) {
      // 登录成功
      userStore.login({
        token: res.data.data.token,
        userId: res.data.data.user?.id || id.value
      });
      
      // 可以使用后端返回的消息或自定义消息
      alert(res.data.message || '登录成功！');
      
      // 根据角色跳转到不同页面
      if (role.value === 'student') {
        router.push('/student-home');
      } else if (role.value === 'teacher') {
        router.push('/teacherhome');
      } else if (role.value === 'ta') {
        router.push('/ta-home');
      }
    } else {
      // 登录失败，显示后端返回的错误信息
      alert(res.data.message || '登录失败');
    }
  } catch (err) {
    // 处理网络错误或其他异常
    console.error('登录异常:', err);
    
    // 如果错误对象包含响应数据，尝试提取后端错误信息
    if (err.response && err.response.data) {
      alert(err.response.data.message || '登录失败');
    } else {
      alert('网络错误，请稍后重试');
    }
  }
};

// 跳转到注册页面
const goToRegister = () => {
  router.push('/register');
//   alert('跳转到注册页面');
};
</script>

<style scoped>
.main-title {
  font-size: 32px;
  font-weight: bold;
  color: #003366; /* 深蓝色 */
  text-align: center;
  margin-bottom: 0px;
  letter-spacing: 2px;
}
/* .login-container {
  display: flex;
  min-height: 100vh; */
  /* 浅蓝色渐变背景 */
  /* background: linear-gradient(135deg, #e6f7ff 0%, #bae7ff 50%, #91d5ff 100%);
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
} */
.login-container {
  display: flex;
  min-height: 100vh;
  /* 使用图片作为背景 */
 background: url('@/assets/login.jpg') no-repeat center center;
  background-size: cover;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

/* 左侧区域，占据2/3宽度 */
.left-section {
  flex: 3;
}

/* 右侧登录表单，占据1/3宽度 */
.login-form {
  flex: 1;
  background-color: rgba(255,255,255,0.8); /* 半透明白色背景 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: -8px 0 24px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.login-header {
  padding: 20px 20px 0;
  margin-top: 30px; /* 增加顶部间距，使表单在垂直方向上更居中 */
  color:#0d4e8f;
}

.login-header h2 {
  margin: 0 0 15px;
  font-size: 18px;
  font-weight: 500;
  color: #333;
}
.logo-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 0px;
  margin-bottom: 0px;
}

.login-logo {
  width: 100%;           /* 宽度为表单的80%，可根据需要调整为100% */
  max-width: 240px;     /* 最大宽度限制，防止过大 */
  height: auto;
  display: block;
  object-fit: contain;
}

.login-tabs {
  display: flex;
  border-bottom: 1px solid #eee;
  margin-bottom: 20px;
}

.tab {
  padding: 40px 0;
  margin-right: 20px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  position: relative;
}

.tab.active {
  color: #1890ff;
}

.tab.active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #1890ff;
}

.login-body {
  padding: 0 20px 20px;
  flex-grow: 1;
}

.form-group {
  margin-bottom: 15px;
}

.form-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  font-size: 14px;
  transition: all 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.form-options {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 12px;
  color: #666;
}

.forgot-password {
  cursor: pointer;
}

.forgot-password:hover {
  color: #1890ff;
}

.remember-me {
  display: flex;
  align-items: center;
}

.remember-me input {
  margin-right: 5px;
}

.login-button {
  width: 100%;
  padding: 10px 0;
  background-color: #1890ff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #40a9ff;
}

.register-link {
  margin-top: 15px;
  text-align: center;
  font-size: 14px;
  color: #666;
}

.register-link a {
  color: #1890ff;
  text-decoration: none;
  margin-left: 5px;
}

.register-link a:hover {
  text-decoration: underline;
}

.login-footer {
  display: flex;
  justify-content: space-between;
  padding: 15px 20px;
  border-top: 1px solid #eee;
  font-size: 12px;
  color: #999;
  margin-top: auto; /* 将footer推到底部 */
}

.qr-code img {
  width: 20px;
  height: 20px;
  opacity: 0.6;
}

.other-login {
  cursor: pointer;
}

.other-login:hover {
  color: #1890ff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
  }
  
  .left-section {
    display: none;
  }
  
  .login-form {
    width: 100%;
    height: 100vh;
  }
}
</style>