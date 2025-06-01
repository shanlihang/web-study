<template>
  <view class="container">
    <view>实时监控</view>
    <image src="../../assets/fish.gif" mode="widthFix" class="gif-image" />

    <nut-grid :column-num="3" reverse>
      <nut-grid-item :border="false" text="水温(°C)">
        <TrendArrow :number="Number(Temperature)" status="high" />
      </nut-grid-item>
      <nut-grid-item :border="false" text="水质(ppm)">
        <TrendArrow :number="Number(TDS)" status="low" />
      </nut-grid-item>
      <nut-grid-item :border="false" text="光照(Lux)">
        <TrendArrow :number="Number(LightIntensity)" status="low" />
      </nut-grid-item>
    </nut-grid>
  </view>
</template>

<script setup lang="ts">
import TrendArrow from "../TrendArrow/index.vue";
interface Props {
  TDS: string,
  Temperature: string,
  LightIntensity: string,
}
const props = withDefaults(defineProps<Props>(), {
  TDS: '0',
  Temperature: '0',
  LightIntensity: '0',
});
console.log(111,props);

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
