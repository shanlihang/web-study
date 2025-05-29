<template>
  <view class="index">
    <nut-navbar title="智能鱼缸系统"></nut-navbar>
    <StatusCard :status="data.status" @reconnect="reconnect" />
    <LiveTime />
  </view>
</template>

<script setup>
import { reactive, ref } from "vue";
import StatusCard from "../../components/StatusCard";
import LiveTime from "../../components/LiveTime";

const data = reactive({
  status: "error",
});

const reconnect = () => {
  data.status = "reconnecting";
  setTimeout(() => {
    data.status = "success";
  }, 2000);
};
</script>

<style scoped></style>
