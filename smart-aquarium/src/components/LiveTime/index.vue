<template>
  <view class="container">
    <view>实时监控</view>
    <image src="../../assets/fish.gif" mode="widthFix" class="gif-image" />
    <nut-grid :column-num="3" reverse>
      <nut-grid-item :border="false" text="水温(°C)">
        <TrendArrow :number="Number(props.data.Temperature)" :status="isOutOfRange('Temperature')" />
      </nut-grid-item>
      <nut-grid-item :border="false" text="水质(ppm)">
        <TrendArrow :number="Number(props.data.TDS)" :status="isOutOfRange('TDS')" />
      </nut-grid-item>
      <nut-grid-item :border="false" text="光照(Lux)">
        <TrendArrow :number="Number(props.data.Light)" :status="isOutOfRange('Light')" />
      </nut-grid-item>
    </nut-grid>
  </view>
</template>

<script setup lang="ts">
import { watch } from "vue";
import TrendArrow from "../TrendArrow/index.vue";
interface Props {
  control: number;
  data: {
    TDS: string;
    Temperature: string, // 水温
    Light: string, // 光照
    LightSwitch: boolean, // 光照开关
    Pump: boolean, // 水泵开关
    HeatSwitch: boolean, // 加热
  };
  rangeList: {
    temperatureRange: {
      min: number;
      max: number;
    };
    tdsRange: {
      min: number;
      max: number;
    };
    lightRange: {
      min: number;
      max: number;
    };
  };
}
const props = withDefaults(defineProps<Props>(), {
  control: 0,
  data: {
    TDS: "0",
    Temperature: "0",
    Light: "0",
    LightSwitch: false,
    Pump: false,
    HeatSwitch: false,
  },
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
      min: 3000,
      max: 5000,
    },
  },
});

const emit = defineEmits(["heatUp"]);
const isOutOfRange = (key) => {
  const val = Number(props.data[key]);

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
  if (key === "Light") {
    const { min, max } = props.rangeList.lightRange;
    if (val >= min && val <= max) return "high";
    else return "normal";
  }
};

const change = (params) => {
  emit("heatUp", params);
};
// 暂存待更改的控制命令
let pendingChange = {};
let throttleTimer = null;

// 封装节流 change 调用
function scheduleChange(newChange) {
  pendingChange = { ...pendingChange, ...newChange };

  if (!throttleTimer) {
    throttleTimer = setTimeout(() => {
      if (Object.keys(pendingChange).length > 0) {
        change(pendingChange);
        pendingChange = {};
      }
      throttleTimer = null;
    }, 1000); // 1 秒节流
  }
}

watch(
  () => [props.data.TDS, props.data.Temperature, props.data.Light, props.data.LightSwitch, props.data.HeatSwitch, props.data.Pump, props.control],
  ([newTDS, newTemp, newLight, newLightSwitch, newHeatSwitch, newPump, newControl]) => {

    const { temperatureRange, tdsRange, lightRange } = props.rangeList;
    if (newControl === 0) {
      return; // 如果控制模式为手动，则不进行自动调整
    }
    if (!newLightSwitch && parseFloat(newTemp) < temperatureRange.min) {
      scheduleChange({ HeatSwitch: true });// 启动加热
    }
    if (newLightSwitch && parseFloat(newTemp) > temperatureRange.max) {
      scheduleChange({ HeatSwitch: false }); // 关闭加热
    }
    if (!newPump && parseFloat(newTDS) < tdsRange.min) {
      scheduleChange({ Pump: true }); // 启动循环泵
    }
    if (newPump && parseFloat(newTDS) > tdsRange.max) {
      scheduleChange({ Pump: false }); // 启动循环泵
    }
    if (!newLightSwitch && parseFloat(newLight) > lightRange.min) {
      scheduleChange({ LightSwitch: true }); // 灯光是关闭状态并且大于min时启动光照
    }
    if (newLightSwitch && parseFloat(newLight) < lightRange.min) {
      scheduleChange({ LightSwitch: false }); // 灯光是开启状态并且小于min时关闭光照
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
