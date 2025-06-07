<template>
  <view class="container">
    <view>实时监控</view>
    <image src="../../assets/fish.gif" mode="widthFix" class="gif-image" />
    <nut-grid :column-num="3" reverse>
      <nut-grid-item :border="false" text="水温(°C)">
        <TrendArrow
          :number="Number(Temperature)"
          :status="isOutOfRange('Temperature')"
        />
      </nut-grid-item>
      <nut-grid-item :border="false" text="水质(ppm)">
        <TrendArrow :number="Number(TDS)" :status="isOutOfRange('TDS')" />
      </nut-grid-item>
      <nut-grid-item :border="false" text="光照(Lux)">
        <TrendArrow
          :number="Number(LightIntensity)"
          :status="isOutOfRange('LightIntensity')"
        />
      </nut-grid-item>
    </nut-grid>
  </view>
</template>

<script setup lang="ts">
import { watch } from "vue";
import TrendArrow from "../TrendArrow/index.vue";
interface Props {
  TDS: string;
  Temperature: string;
  LightIntensity: string;
  rangeList: any;
}
const props = withDefaults(defineProps<Props>(), {
  TDS: "0",
  Temperature: "0",
  LightIntensity: "0",
  rangeList: {
    temperatureRange: {
      min: 20,
      max: 40,
    },
    tdsRange: {
      min: 100,
      max: 400,
    },
    lightRange: {
      min: 100,
      max: 300,
    },
  },
});

const emit = defineEmits(["heatUp"]);
const isOutOfRange = (key) => {
  const val = Number(props[key]);
  if (key === "Temperature") {
    const { min, max } = props.rangeList.temperatureRange;
    if (val < min) return "low";
    else if (val > max) return "high";
    else return "normal";
  }
  if (key === "TDS") {
    const { min, max } = props.rangeList.tdsRange;
    if (val < min) return "low";
    else if (val > max) return "high";
    else return "normal";
  }
  if (key === "LightIntensity") {
    const { min, max } = props.rangeList.lightRange;
    if (val < min) return "low";
    else if (val > max) return "high";
    else return "normal";
  }
};

const change = (params) => {
  emit("heatUp", params);
};

watch(
  () => [props.TDS, props.Temperature, props.LightIntensity],
  ([newTDS, newTemp]) => {
    const { temperatureRange, tdsRange, lightRange } = props.rangeList;

    if (parseFloat(newTemp) < temperatureRange.min) {
      change({ HeatSwitch: true }); // 例如启动加热
    }

    if (parseFloat(newTDS) < tdsRange.min) {
      change({ Pump: true }); // 例如启动循环泵
    }

    if (parseFloat(newTemp) < temperatureRange.max) {
      change({ LightSwitch: true }); // 例如启动照明
    }
  },
  { immediate: true }
);
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
