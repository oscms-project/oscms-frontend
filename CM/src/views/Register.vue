<template>
  <div class="login-container">
    <div class="left-section"></div>
    <div class="login-form">
        <div class="logo-wrapper">
      <img src="@/assets/logo.png" alt="logo" class="login-logo" />
    </div>
      <div class="login-header">
        
        <h1>账号注册</h1>
      </div>
      <div class="login-body">
        <div class="form-group">
          <input
            type="text"
            v-model="studentId"
            placeholder="请输入学工号"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <input
            type="text"
            v-model="username"
            placeholder="请输入用户名"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <input
            type="email"
            v-model="email"
            placeholder="请输入邮箱"
            class="form-input"
          />
        </div>
        <div class="form-group">       
          <select v-model="role" class="form-input">
            <option disabled value="">请选择身份</option>
            <option value="student">student</option>
            <option value="ta">ta</option>
            <option value="teacher">teacher</option>
          </select>
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
          <input
            type="password"
            v-model="confirmPassword"
            placeholder="确认密码"
            class="form-input"
          />
        </div>
        <button @click="handleRegister" class="login-button">注册</button>
        <div class="register-link">
          <span>已有账号？</span>
          <a href="#" @click.prevent="goToLogin">立即登录</a>
        </div>
      </div>
      <div class="login-footer"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { register } from '@/api/auth';

const studentId = ref('');
const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const role = ref('');
const router = useRouter();

const handleRegister = async() => {
  if (!studentId.value || !username.value || !email.value || !password.value||!role.value) {
    alert('请填写完整信息');
    return;
  }
  if (password.value !== confirmPassword.value) {
    alert('两次输入的密码不一致');
    return;
  }
  try {
    // 构造请求体，字段名需与 RegisterRequest schema 一致
    const payload = {
      userId: studentId.value,
      username: username.value,
      email: email.value,
      password: password.value,
      role: role.value
    };
   const res = await register(payload);
    if (res.status === 201) {
      alert('注册成功！');
      router.push('/');
    } else {
      alert('注册失败，请检查信息');
    }
  } catch (err) {
    alert('注册失败，请检查信息');
  }
};

const goToLogin = () => {
  router.push('/');
  alert('跳转到登录页面');
};
</script>

<style scoped>
.main-title {
  font-size: 32px;
  font-weight: bold;
  color: #1263b4;
  text-align: center;
  margin-bottom: 20px;
  letter-spacing: 2px;
}
.login-container {
  display: flex;
  min-height: 100vh;
  background: url('@/assets/login.png') no-repeat center center;
  background-size: cover;
  font-family: 'PingFang SC', 'Microsoft YaHei', sans-serif;
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
.left-section {
  flex: 3;
}
.login-form {
  flex: 1;
  background-color: rgba(255,255,255,0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: -8px 0 24px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}
.login-header {
  padding: 20px 20px 0;
  margin-top: 60px;
  margin-bottom: 20px;
color: #0d4e8f;
}
.login-header h2 {
  margin: 0 0 15px;
  font-size: 18px;
  font-weight: 500;
  color: #333;
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
.login-button {
    margin-bottom: 20px;
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
  margin-top: auto;
}
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