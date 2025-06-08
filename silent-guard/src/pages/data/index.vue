<template>
  <div class="container">
    <div class="header">
      <span class="left-btn" @click="backHome">返回</span>
      <span class="title">历史统计</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import Taro from "@tarojs/taro";

const backHome = () => {
  Taro.navigateBack({
    delta: 1, // 返回几层
  });
};
</script>

<style scoped>
.container {
  padding: 24px;
  overflow: hidden;
  min-height: 100vh;
  background: linear-gradient(160deg, #0a0e17 0%, #1a2130 100%);
  font-family: "Roboto", "PingFang SC", sans-serif;
  color: #e0e0e0;
  font-size: 16px;
}

.header {
  text-align: center;
  position: relative;
}

.header .title {
  font-size: 32px;
  font-weight: 600;
  color: #fff;
  letter-spacing: 1.5px;
  text-shadow: 0 0 10px rgba(64, 158, 255, 0.5);
  position: relative;
  display: inline-block;
}

.header .left-btn {
  position: absolute;
  left: 0;
  font-size: 24px;
  color: #fff;
}

.header .title::after {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #3a7bd5 0%, #00d2ff 100%);
  border-radius: 3px;
}
</style>
