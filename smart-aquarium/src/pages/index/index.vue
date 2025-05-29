<template>
  <view class="index">
    <nut-navbar title="智能鱼缸系统"></nut-navbar>
    <nut-button type="primary" @click="onClick">按钮</nut-button>
    <nut-toast v-model:visible="show" msg="你成功了" />
  </view>
</template>

<script setup>
import { ref } from "vue";
const show = ref(false);
const onClick = () => {
  show.value = true;
};
</script>
