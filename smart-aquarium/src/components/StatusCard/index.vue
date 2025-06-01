<template>
  <view class="status" :class="statusClass">
    <view class="status-text"
      >
      <IconFont
        v-if="status === 1"
        name="success"
        color="#fff"
        class="icon"
      ></IconFont>
      <IconFont
        v-if="status === 0"
        name="tips"
        color="#fff"
        class="icon"
      ></IconFont>
      {{
        status === 1
          ? "在线"
          : status === 0
          ? "离线"
          : "设备重连中..."
      }}</view
    >
    <!-- <nut-button
      v-if="status === 0"
      plain
      type="primary"
      size="mini"
      @click="emit('reconnect')"
      >重连</nut-button
    > -->
  </view>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { IconFont } from "@nutui/icons-vue-taro";

interface Props {
  status: 0 | 1 | 2 ;
  onReconnect?: () => void;
}

const props = withDefaults(defineProps<Props>(), {
  status: 0,
});

const emit = defineEmits(["reconnect"]);

// 计算样式类名
const statusClass = computed(() => {
  return {
    "status-success": props.status === 1,
    "status-error": props.status === 0,
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
