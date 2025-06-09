<template>
  <view class="login-container">
    <nut-toast
      msg="人脸识别通过，即将跳转"
      v-model:visible="visible"
      type="text"
    />
    <view class="login-header">
      <text class="title">Silent Guard</text>
      <text class="subtitle">独居老人环境安全监测系统</text>
    </view>

    <view class="login-face">
      <view class="face-id-container">
        <view
          class="face-outline"
          :class="{ scanning: isScanning, success: faceDetected }"
        >
          <view class="face-circle">
            <view class="scan-line"></view>
            <view class="dot-container">
              <view
                v-for="i in 12"
                :key="i"
                class="dot"
                :style="{ transform: `rotate(${i * 30}deg)` }"
              ></view>
            </view>
            <view class="face-features">
              <view class="eyes"></view>
              <view class="nose"></view>
              <view class="mouth"></view>
            </view>
          </view>
        </view>
        <view class="scan-result" v-if="faceDetected">识别成功</view>
      </view>
      <button class="face-btn" @tap="handleFaceLogin" :disabled="isScanning">
        {{ isScanning ? "识别中..." : "开始识别" }}
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import Taro from "@tarojs/taro";
import { ref } from "vue";

const faceDetected = ref(false);
const isScanning = ref(false);
const visible = ref(false);

// 人脸识别登录
const handleFaceLogin = async () => {
  try {
    isScanning.value = true;
    faceDetected.value = false;

    // 模拟人脸检测过程
    await new Promise((resolve) => setTimeout(resolve, 2000));
    faceDetected.value = true;

    // 等待动画完成
    await new Promise((resolve) => setTimeout(resolve, 1000));
    visible.value = true;

    // 延迟跳转
    setTimeout(() => {
      Taro.navigateTo({ url: "/pages/index/index" });
    }, 1000);
  } catch (error) {
    isScanning.value = false;
    faceDetected.value = false;
  }
};
</script>

<style lang="scss">
.login-container {
  min-height: 100vh;
  padding: 20px 30px;
  background: linear-gradient(160deg, #0a0e17 0%, #1a2130 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  //   justify-content: center;
}

.login-header {
  margin-top: 4.5rem;
  text-align: center;
  margin-bottom: 60px;

  .title {
    font-size: 48px;
    font-weight: bold;
    color: #fff;
    text-shadow: 0 0 30px rgba(0, 102, 255, 0.6);
    display: block;
    margin-bottom: 15px;
    letter-spacing: 2px;
  }

  .subtitle {
    font-size: 24px;
    color: rgba(255, 255, 255, 0.8);
    letter-spacing: 4px;
  }
}

.login-form {
  width: 100%;
  margin-top: 20px;
}

.form-item {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  margin-bottom: 20px;
  backdrop-filter: blur(10px);

  .input {
    height: 60px;
    padding: 0 30px;
    color: #fff;
    font-size: 28px;
    letter-spacing: 1px;
    line-height: 60px;
  }
}

.placeholder {
  color: rgba(255, 255, 255, 0.4);
  font-size: 28px;
}

.login-btn {
  width: 100%;
  height: 60px;
  line-height: 60px;
  text-align: center;
  background: linear-gradient(135deg, #0066ff 0%, #0044ff 100%);
  color: #fff;
  border-radius: 16px;
  font-size: 28px;
  letter-spacing: 4px;
  margin-top: 40px;
  transition: all 0.3s;
  border: none;

  &:active {
    transform: scale(0.98);
    background: #0052cc;
  }
}

.login-face {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.face-id-container {
  width: 300px;
  height: 300px;
  position: relative;
  margin: 30px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.face-outline {
  width: 200px;
  height: 200px;
  position: relative;

  .face-circle {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 3px solid #0066ff;
    position: relative;
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 0 20px rgba(0, 102, 255, 0.2);
    overflow: hidden;

    &::before,
    &::after {
      content: "";
      position: absolute;
      top: -3px;
      left: -3px;
      right: -3px;
      bottom: -3px;
      border-radius: 50%;
      opacity: 0;
      transition: opacity 0.3s;
    }

    &::before {
      background: conic-gradient(
        from 0deg,
        transparent,
        rgba(0, 102, 255, 0.4) 20deg,
        rgba(0, 102, 255, 0.8) 45deg,
        rgba(0, 102, 255, 0.4) 70deg,
        transparent 90deg
      );
      filter: blur(15px);
    }

    &::after {
      background: radial-gradient(
        circle at center,
        rgba(0, 102, 255, 0.2) 0%,
        rgba(0, 102, 255, 0.15) 45%,
        transparent 70%
      );
    }
  }

  .scan-line {
    height: 4px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(0, 102, 255, 0.4) 20%,
      rgba(0, 102, 255, 0.8) 50%,
      rgba(0, 102, 255, 0.4) 80%,
      transparent 100%
    );
    filter: blur(2px);
    box-shadow: 0 0 15px rgba(0, 102, 255, 0.6), 0 0 30px rgba(0, 102, 255, 0.3);
  }

  &.scanning {
    .face-circle::before {
      opacity: 1;
      animation: rotate 2s linear infinite;
    }
    .face-circle::after {
      opacity: 1;
      animation: pulse 2s ease-in-out infinite;
    }
    .scan-line {
      opacity: 1;
      animation: scanDown 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }
  }

  &.success {
    .face-circle {
      border-color: #00ff00;
      transform: scale(1.08);
      box-shadow: 0 0 30px rgba(0, 255, 0, 0.3), 0 0 60px rgba(0, 255, 0, 0.1);
    }

    .scan-line {
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(0, 255, 0, 0.4) 20%,
        rgba(0, 255, 0, 0.8) 50%,
        rgba(0, 255, 0, 0.4) 80%,
        transparent 100%
      );
      box-shadow: 0 0 15px rgba(0, 255, 0, 0.6), 0 0 30px rgba(0, 255, 0, 0.3);
    }
  }
}

.dot-container {
  position: absolute;
  width: 100%;
  height: 100%;
}

.dot {
  position: absolute;
  width: 8px;
  height: 8px;
  margin-left: -4px;
  background: rgba(0, 102, 255, 0.8);
  border-radius: 50%;
  left: 50%;
  margin-left: -3px;
  transform-origin: center 100px;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 15px rgba(0, 102, 255, 0.6), 0 0 30px rgba(0, 102, 255, 0.3);

  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    width: 250%;
    height: 250%;
    transform: translate(-50%, -50%);
    background: radial-gradient(
      circle at center,
      rgba(0, 102, 255, 0.4) 0%,
      rgba(0, 102, 255, 0.2) 40%,
      transparent 70%
    );
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.3s;
  }
}

.face-features {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform: scale(0.9);

  .eyes {
    position: absolute;
    top: 35%;
    width: 100%;
    height: 2px;
    background: currentColor;
    filter: drop-shadow(0 0 3px rgba(0, 255, 0, 0.5));

    &::before,
    &::after {
      content: "";
      position: absolute;
      width: 40px;
      height: 3px;
      border-radius: 2px;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    &::before {
      left: 22%;
      transform: rotate(-18deg) translateY(2px);
    }

    &::after {
      right: 22%;
      transform: rotate(18deg) translateY(2px);
    }
  }

  .nose {
    position: absolute;
    top: 45%;
    left: 50%;
    width: 3px;
    height: 18px;
    border-radius: 1px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    background: currentColor;
    transform: translateX(-50%);
    filter: drop-shadow(0 0 3px rgba(0, 255, 0, 0.5));
    transition: height 0.3s;
  }

  .mouth {
    position: absolute;
    bottom: 35%;
    left: 50%;
    width: 45px;
    height: 3px;
    border-radius: 1px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    background: currentColor;
    transform: translateX(-50%);
    filter: drop-shadow(0 0 3px rgba(0, 255, 0, 0.5));
    transition: width 0.3s;
  }
}

.scan-result {
  margin-top: 20px;
  color: #00ff00;
  font-size: 24px;
  opacity: 0;
  transform: translateY(20px);
  animation: fadeInUp 0.5s forwards;
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
  letter-spacing: 4px;
  font-weight: 500;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0% {
    opacity: 0.4;
    transform: scale(0.95);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.15);
  }
  100% {
    opacity: 0.4;
    transform: scale(0.95);
  }
}

@keyframes glow {
  from {
    filter: drop-shadow(0 0 3px rgba(0, 255, 0, 0.5));
    opacity: 0.7;
  }
  to {
    filter: drop-shadow(0 0 12px rgba(0, 255, 0, 0.9));
    opacity: 1;
  }
}

@keyframes scanDown {
  0% {
    opacity: 0;
    transform: translateY(-100%) scaleY(0.8);
  }
  15% {
    opacity: 1;
    transform: translateY(-50%) scaleY(1.2);
  }
  85% {
    opacity: 1;
    transform: translateY(50%) scaleY(1.2);
  }
  100% {
    opacity: 0;
    transform: translateY(100%) scaleY(0.8);
  }
}

@keyframes breathe {
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.02);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
}

.face-btn {
  width: 240px;
  height: 60px;
  line-height: 60px;
  text-align: center;
  background: linear-gradient(
    135deg,
    rgba(0, 102, 255, 0.8) 0%,
    rgba(0, 68, 255, 0.8) 100%
  );
  color: #fff;
  border-radius: 30px;
  font-size: 28px;
  margin-top: 40px;
  border: none;
  letter-spacing: 2px;
  box-shadow: 0 4px 15px rgba(0, 102, 255, 0.3);

  &:active {
    transform: translateY(2px);
    box-shadow: 0 2px 8px rgba(0, 102, 255, 0.3);
  }
}

.login-switch {
  margin-top: 50px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 24px;

  text {
    padding: 10px;

    &:active {
      opacity: 0.8;
    }
  }
}
</style>
