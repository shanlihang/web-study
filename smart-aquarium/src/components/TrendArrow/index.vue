<template>
  <view class="trend">
    {{ props.number }}
    <IconFont
      v-if="props.status === 'high'"
      name="triangle-up"
      color="#fa2c19"
    />
    <IconFont
      v-if="props.status === 'low'"
      name="triangle-down"
      color="#fa2c19"
    />
  </view>
</template>

<script setup>
import { IconFont } from "@nutui/icons-vue-taro";
const props = defineProps({
  number: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    default: "normal",
  },
});
</script>

<style scoped>
.trend {
  display: flex;
  align-items: end;
  justify-content: center;
  gap: 12px;
}
</style>
