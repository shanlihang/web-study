<template>
  <div class="container">
    <div class="tab-header">
      <div
        :class="['tab-button', activeTab === 'threshold' ? 'active' : '']"
        @click="activeTab = 'threshold'"
      >
        阈值设置
      </div>
      <div
        :class="['tab-button', activeTab === 'control' ? 'active' : '']"
        @click="activeTab = 'control'"
      >
        功能控制
      </div>
    </div>

    <div class="tab-content">
      <div v-if="activeTab === 'threshold'" class="form-section">
        <div
          v-for="(item, key) in thresholds"
          :key="key"
          :class="['form-group', isOutOfRange(key) ? 'warning' : '']"
        >
          <label>{{ keyLabels[key] }}</label>
          <div class="inputs">
            <input
              type="number"
              v-model.number="thresholds[key].min"
              placeholder="最小值"
            />
            <span>~</span>
            <input
              type="number"
              v-model.number="thresholds[key].max"
              placeholder="最大值"
            />
          </div>
        </div>
        <button class="okBtn">确定</button>
      </div>

      <div v-else class="control-section">
        <div class="control-card">
          <p class="control-title">一键报警</p>
          <button
            class="alarm-button"
            :class="{ active: alarmActive }"
            @click="alarmActive = !alarmActive"
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
import { reactive, ref } from "vue";

const activeTab = ref("threshold");
const alarmActive = ref(false);

const thresholds = reactive({
  temperature: { min: 22, max: 26 },
  humidity: { min: 40, max: 70 },
  co: { min: 0, max: 3 },
  co2: { min: 400, max: 1000 },
});

const currentValues = reactive({
  temperature: 25,
  humidity: 55,
  co: 2.5,
  co2: 800,
});

const isOutOfRange = (key) => {
  const val = currentValues[key];
  const { min, max } = thresholds[key];
  return val < min || val > max;
};

const keyLabels = {
  temperature: "温度 (°C)",
  humidity: "湿度 (%)",
  co: "一氧化碳 (ppm)",
  co2: "二氧化碳 (ppm)",
};
</script>

<style scoped>
.container {
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
  color: #e0e0e0;
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
