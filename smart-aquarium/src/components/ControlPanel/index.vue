<template>
  <view class="control">
    <view class="title">
      <view>控制面板</view>
      <nut-button plain type="info" size="mini" @click="show = true">阈值设置</nut-button>
    </view>
    <nut-cell-group>
      <nut-cell title="升温">
        <template #link>
          <nut-switch v-model="props.HeatSwitch" @change="(value) => change({ HeatSwitch: value })" />
        </template>
      </nut-cell>
      <nut-cell title="光照">
        <template #link>
          <nut-switch v-model="props.LightSwitch" @change="(value) => change({ LightSwitch: value })" />
        </template>
      </nut-cell>
      <nut-cell title="喂食">
        <template #link>
          <nut-button plain type="primary" @click="() => change({
            Motor: true
          })" size="mini">喂食</nut-button>
        </template>
      </nut-cell>
      <nut-cell title="水循环">
        <template #link>
          <nut-switch v-model="props.Pump" @change="(value) => change({ Pump: value })" />
        </template>
      </nut-cell>
    </nut-cell-group>

    <nut-popup v-model:visible="show" position="bottom" closeable round :style="{ height: '350px' }">
      <view class="drawer-title">阈值设置</view>
      <view class="cell">
        <view class="label">水温</view>
        <nut-range v-model="data.temperatureRange" :max="100" :min="0" range @change="change"></nut-range>
      </view>
      <view class="cell">
        <view class="label">水质</view>
        <nut-range v-model="data.tdsRange" range :max="800" :min="0" @change="change"></nut-range>
      </view>
      <view class="cell">
        <view class="label">光照</view>
        <nut-range v-model="data.lightRange" range :max="1000" :min="0" @change="change"></nut-range>
      </view>

      <view class="btn"><nut-button plain type="primary" @click="show = false">取消</nut-button>
        <nut-button plain type="info" @click="show = false">确定</nut-button>
      </view>
    </nut-popup>
  </view>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
interface Props {
  TDS: string,
  Temperature: string,
  LightSwitch: boolean,
  Pump: boolean,
  HeatSwitch?: boolean, // 可选属性
  Motor?: boolean, // 可选属性
}
const props = withDefaults(defineProps<Props>(), {
  TDS: '0',
  Temperature: '0',
  LightSwitch: false,
  Pump: false,
  HeatSwitch: false,
  Motor: false,
});
console.log(222, props);

const show = ref(false);

const data = reactive({
  water: false,
  led: false,
  feed: false,
  temperatureRange: [20, 40],
  tdsRange: [100, 400],
  lightRange: [100, 300],
});
const emit = defineEmits(["heatUp"]);
const change = (params) => {
  emit('heatUp', params)
};
</script>

<style scoped>
.control {
  width: 90%;
  margin: 24px auto 0;
  height: 100px;
}

.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.drawer-title {
  height: 100px;
  line-height: 100px;
  padding-left: 36px;
}

.cell {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  padding: 0 24px;
  height: 100px;
  gap: 24px;
}

.label {
  width: 100px;
  text-align: center;
  font-size: 28px;
}

.btn {
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: end;
  gap: 36px;
}
</style>
