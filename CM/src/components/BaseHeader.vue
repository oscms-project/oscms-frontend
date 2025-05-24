<!--  页眉区域  -->
<template>
  <header class="header">
    <div class="logo-container">
      <div class="divider"></div>
      <span class="platform-name">智慧教育</span>
    </div>
    <div class="user-info">
      <span class="user-name">{{ user.name }}</span>
      <span class="user-id">{{ user.id }}</span>
      <div class="avatar">
        <img src="@/assets/head.png" alt="用户头像" />
      </div>
    </div>
  </header>
</template>

<script setup>
const props = defineProps({
  user: Object
});
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.logo-container {
  display: flex;
  align-items: center;
}

.buaa-logo {
  height: 40px;
  margin-right: 10px;
}

.divider {
  width: 1px;
  height: 24px;
  background-color: #ddd;
  margin: 0 15px;
}

.platform-name {
  font-size: 18px;
  font-weight: bold;
  color: #0056b3;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-name {
  margin-right: 10px;
  font-weight: 500;
}

.user-id {
  color: #666;
  margin-right: 15px;
}

.avatar img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}
</style>