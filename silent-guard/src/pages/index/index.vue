<template>
  <div class="container">
    <nut-toast
      msg="阈值更新成功"
      v-model:visible="visible"
      type="text"
      cover="false"
    />
    <div class="header">
      <span class="title">智能环境监测</span>
    </div>
    <div class="sensor-grid">
      <!-- 温度传感器 -->
      <div
        class="sensor-card"
        :class="{ warning: isOutOfRange('temperature') }"
      >
        <div class="sensor-name">
          <span>温度</span>
        </div>
        <div class="sensor-value">
          {{ data.temperature }}<span class="unit">°C</span>
          <span v-if="isOutOfRange('temperature')" class="warning-pulse"
            >⚠️</span
          >
        </div>
      </div>

      <!-- 湿度传感器 -->
      <div class="sensor-card" :class="{ warning: isOutOfRange('humidity') }">
        <div class="sensor-name">
          <span>湿度</span>
        </div>
        <div class="sensor-value">
          {{ data.humidity }}<span class="unit">%RH</span>
          <span v-if="isOutOfRange('humidity')" class="warning-pulse">⚠️</span>
        </div>
      </div>

      <!-- 一氧化碳传感器 -->
      <div class="sensor-card" :class="{ warning: isOutOfRange('co') }">
        <div class="sensor-name">
          <span>一氧化碳</span>
        </div>
        <div class="sensor-value">
          {{ data.co }}<span class="unit">ppm</span>
          <span v-if="isOutOfRange('co')" class="warning-pulse">⚠️</span>
        </div>
      </div>

      <!-- 二氧化碳传感器 -->
      <div class="sensor-card" :class="{ warning: isOutOfRange('co2') }">
        <div class="sensor-name">
          <span>二氧化碳</span>
        </div>
        <div class="sensor-value">
          {{ data.co2 }}<span class="unit">ppm</span>
          <span v-if="isOutOfRange('co2')" class="warning-pulse">⚠️</span>
        </div>
      </div>
    </div>
    <div class="status-card">
      <span class="status-name">WiFi连接</span>
      <span
        :class="['status-value', data.status === 1 ? 'active' : 'inactive']"
      >
        {{ data.status === 1 ? "已连接" : "未连接" }}
      </span>
    </div>
    <div class="status-card">
      <span class="status-name">雷达感应</span>
      <span :class="['status-value', havePeople ? 'active' : 'inactive']">
        {{ havePeople ? "检测到人员" : "无人活动" }}
      </span>
    </div>
    <div class="tab-header">
      <div
        :class="['tab-button', activeTab === 'control' ? 'active' : '']"
        @click="activeTab = 'control'"
      >
        功能控制
      </div>
      <div
        :class="['tab-button', activeTab === 'threshold' ? 'active' : '']"
        @click="activeTab = 'threshold'"
      >
        阈值设置
      </div>
    </div>
    <div class="tab-content">
      <div v-if="activeTab === 'threshold'" class="form-section">
        <div v-for="(item, key) in thresholds" :key="key" class="form-group">
          <label>{{ keyLabels[key] }}</label>
          <div class="inputs">
            <input
              type="number"
              v-model.number="thresholdDraft[key].min"
              placeholder="最小值"
            />
            <span>~</span>
            <input
              type="number"
              v-model.number="thresholdDraft[key].max"
              placeholder="最大值"
            />
          </div>
        </div>
        <button class="okBtn" @click="changeRange">确定</button>
      </div>
      <div v-else class="control-section">
        <div class="control-card">
          <p class="control-title">一键报警</p>
          <button
            class="alarm-button"
            :class="{ active: alarmActive }"
            @click="handleAlarm"
          >
            {{ alarmActive ? "已报警" : "启动报警" }}
          </button>
        </div>
        <div class="status-card">
          <span>当前状态：</span>
          <span :class="alarmActive ? 'active' : 'inactive'">
            {{ alarmActive ? "告警中" : "正常" }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, reactive, toRaw } from "vue";
import axios from "axios";

// 配置信息
const CONFIG = {
  PRODUCT_ID: "4u2d7xdNrE", // 产品ID
  DEVICE_NAME: "environment_monitor_device", // 设备名称
  API_KEY:
    "version=2018-10-31&res=products%2F4u2d7xdNrE%2Fdevices%2Fenvironment_monitor_device&et=1906444415&method=md5&sign=hfmzwARWIBViMTB9wBAsvQ%3D%3D",
};

const intervalId = ref(null);
const timeRange = ref(5000);

const visible = ref(false);

const activeTab = ref("control");
const alarmActive = ref(false);

const thresholds = reactive({
  temperature: { min: 26, max: 32 },
  humidity: { min: 30, max: 60 },
  co: { min: 0, max: 3 },
  co2: { min: 400, max: 800 },
});

const thresholdDraft = reactive(JSON.parse(JSON.stringify(toRaw(thresholds))));

const isOutOfRange = (key) => {
  const val = Number(data[key]);
  const { min, max } = thresholds[key];
  return val < min || val > max;
};

const keyLabels = {
  temperature: "温度 (°C)",
  humidity: "湿度 (%RH)",
  co: "一氧化碳 (ppm)",
  co2: "二氧化碳 (ppm)",
};

const handleAlarm = () => {
  if (!alarmActive.value) {
    alarmActive.value = true;
    setTimeout(() => {
      alarmActive.value = false;
    }, 3000);
  }
};

const changeRange = () => {
  Object.keys(thresholds).forEach((key) => {
    thresholds[key].min = thresholdDraft[key].min;
    thresholds[key].max = thresholdDraft[key].max;
  });
  visible.value = true;
  activeTab.value = "control";
};

const data = reactive({
  status: 0,
  temperature: "0",
  humidity: "0",
  co: "0",
  co2: "0",
  people: "false",
});
const havePeople = computed(() => data.people === "true");

// 获取设备在线状态
const getDeviceStatus = async () => {
  try {
    const response = await axios({
      method: "GET",
      url: " https://iot-api.heclouds.com/device/detail",
      params: {
        product_id: CONFIG.PRODUCT_ID,
        device_name: CONFIG.DEVICE_NAME,
      },
      headers: {
        Authorization: CONFIG.API_KEY,
      },
    });
    if (response.data.code === 0) {
      data.status = response.data.data.status;
    } else {
      throw new Error(response.data.msg || "获取设备状态失败");
    }
  } catch (error) {
    console.error("获取设备状态失败:", error);
    data.status = 0;
  }
};

// 查询设备属性
const queryDeviceProperty = async () => {
  try {
    const response = await axios({
      method: "GET",
      url: `https://iot-api.heclouds.com/thingmodel/query-device-property`,
      params: {
        product_id: CONFIG.PRODUCT_ID,
        device_name: CONFIG.DEVICE_NAME,
      },
      headers: {
        Authorization: CONFIG.API_KEY,
      },
    });
    if (response.data.code === 0) {
      data.temperature =
        response.data.data.find((item) => item.identifier === "Temp")?.value ||
        "0";
      data.people =
        response.data.data.find((item) => item.identifier === "People")
          ?.value || false;
      data.humidity =
        response.data.data.find((item) => item.identifier === "Hum")?.value ||
        "0";
      data.co =
        response.data.data.find((item) => item.identifier === "CO")?.value ||
        "0";
      data.co2 =
        response.data.data.find((item) => item.identifier === "Gas")?.value ||
        "0";
    } else {
      throw new Error(response.data.msg || "查询设备属性失败");
    }
  } catch (error) {
    console.error("查询设备属性失败:", error);
  }
};

onMounted(() => {
  getDeviceStatus();
  queryDeviceProperty();
  intervalId.value = setInterval(() => {
    getDeviceStatus();
    queryDeviceProperty();
  }, timeRange.value);
});

onUnmounted(() => {
  // 清理定时器，防止内存泄漏
  clearInterval(intervalId.value);
});
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

.sensor-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin: 24px 0 12px;
}

.sensor-card {
  background: rgba(30, 35, 50, 0.6);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  backdrop-filter: blur(8px);
}

.sensor-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.3);
  border-color: rgba(64, 158, 255, 0.2);
}

.sensor-card .sensor-name {
  font-size: 20px;
  color: #8a8f9d;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
}

.sensor-card .sensor-value {
  font-size: 28px;
  font-weight: 600;
  color: #fff;
}

.sensor-card .sensor-value .unit {
  font-size: 16px;
  color: #8a8f9d;
  margin-left: 4px;
}

.sensor-card.warning {
  border-color: rgba(255, 77, 79, 0.3);
}

.sensor-card.warning .sensor-value {
  color: #ff4d4f;
}

.status-card {
  background: rgba(30, 35, 50, 0.6);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status-card .status-name {
  font-size: 26px;
  color: #8a8f9d;
}

.status-card .status-value {
  font-size: 18px;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 20px;
}

.status-card .status-value.active {
  color: #52c41a;
  background: rgba(82, 196, 26, 0.1);
}

.status-card .status-value.inactive {
  color: #ff4d4f;
  background: rgba(255, 77, 79, 0.1);
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}

.warning-pulse {
  animation: pulse 1.5s infinite;
}

.tab-header {
  width: 100%;
  display: flex;
  height: 70px;
  border-radius: 12px;
  overflow: hidden;
  align-items: center;
  margin-bottom: 24px;
}

.tab-button {
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.08);
  color: #ccc;
  cursor: pointer;
  font-size: 24px;
  font-weight: 500;
  transition: all 0.2s ease;
}

.tab-button.active {
  background: #073ac7;
  color: #fff;
}

.form-section,
.control-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  background: rgba(30, 35, 50, 0.6);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.form-group.warning {
  border-color: #ff4d4f;
  color: #ff4d4f;
}

.form-group label {
  font-size: 14px;
  margin-bottom: 8px;
  display: block;
}

.inputs {
  display: flex;
  gap: 8px;
  align-items: center;
}

.inputs input {
  flex: 1;
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  border-radius: 6px;
  color: #fff;
  font-size: 24px;
  display: flex;
  align-items: center;
}

.inputs input::placeholder {
  color: #aaa;
}

.control-card {
  background: rgba(30, 35, 50, 0.6);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
}

.control-title {
  font-size: 16px;
  margin-bottom: 12px;
}

.alarm-button {
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  transition: all 0.3s ease;
}

.alarm-button.active {
  background: #ff4d4f;
  box-shadow: 0 0 10px rgba(255, 77, 79, 0.6);
}

.status-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(30, 35, 50, 0.6);
  border-radius: 12px;
  padding: 16px;
}

.status-card .active {
  color: #ff4d4f;
}

.status-card .inactive {
  color: #52c41a;
}

.okBtn {
  width: 80%;
  margin-top: 20px;
  background-color: transparent;
  border: 1px solid #073ac7;
  color: #073ac7;
}
</style>
