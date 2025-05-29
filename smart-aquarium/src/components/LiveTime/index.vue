<template>
  <view class="container">
    <view>实时监控</view>
    <image src="../../assets/fish.gif" mode="widthFix" class="gif-image" />

    <nut-grid :column-num="2" reverse>
      <nut-grid-item :border="false" text="水温(°C)">
        <TrendArrow :number="10" status="high" />
      </nut-grid-item>
      <nut-grid-item :border="false" text="水质(ppm)">
        <TrendArrow :number="10" status="low" />
      </nut-grid-item>
    </nut-grid>
  </view>
</template>

<script setup>
import TrendArrow from "../TrendArrow";
</script>

<style scoped>
.container {
  width: 90%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}
.gif-image {
  width: 100%;
  height: 350px;
  margin: 12px 0 24px;
  border-radius: 12px;
  overflow: hidden;
}
</style>
