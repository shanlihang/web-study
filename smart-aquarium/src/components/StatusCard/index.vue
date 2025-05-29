<template>
  <view class="status" :class="statusClass">
    <view class="status-text"
      ><IconFont
        :name="status === 'reconnecting' ? 'loading' : 'link'"
        color="#fff"
        class="icon"
      ></IconFont>
      {{
        status === "success"
          ? "设备已连接"
          : status === "error"
          ? "设备连接失败，请重试"
          : "设备重连中..."
      }}</view
    >
    <nut-button
      v-if="status === 'error'"
      plain
      type="primary"
      size="mini"
      @click="emit('reconnect')"
      >重连</nut-button
    >
  </view>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { IconFont } from "@nutui/icons-vue-taro";

interface Props {
  status: "success" | "error" | "reconnecting";
  onReconnect?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  status: "success",
});

const emit = defineEmits(["reconnect"]);

// 计算样式类名
const statusClass = computed(() => {
  return {
    "status-success": props.status === "success",
    "status-error": props.status === "error",
    "status-reconnecting": props.status === "reconnecting",
  };
});
</script>
<style scoped>
.status {
  box-sizing: border-box;
  width: 90%;
  height: 80px;
  padding: 0 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 24px auto;
  color: #fff;
  border-radius: 12rpx;
  font-size: 28rpx;
}
.status-text {
  display: flex;
  align-items: center;
}
.status-success {
  background-color: #2ecc71;
}

.status-error {
  background-color: #e74c3c;
}

.status-reconnecting {
  background-color: #f39c12;
}
.icon {
  margin-right: 10px;
}
</style>
