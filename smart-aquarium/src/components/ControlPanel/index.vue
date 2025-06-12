<template>
  <view class="control">
    <nut-toast msg="阈值更新成功" v-model:visible="visible" type="text" />
    <view class="title">
      <view>控制面板</view>
      <view>
        <nut-radio-group
          v-model="control"
          direction="horizontal"
          @change="onChange"
        >
          <nut-radio :label="0">手动</nut-radio>
          <nut-radio :label="1">自动</nut-radio>
        </nut-radio-group>
        <nut-button
          class="right-button"
          plain
          type="info"
          size="mini"
          @click="show = true"
          >阈值设置</nut-button
        >
      </view>
    </view>
    <nut-cell-group>
      <nut-cell title="升温">
        <template #link>
          <nut-switch
            :disabled="props.control"
            v-model="props.HeatSwitch"
            @change="(value) => change({ HeatSwitch: value })"
          />
        </template>
      </nut-cell>
      <nut-cell title="光照">
        <template #link>
          <nut-switch
            :disabled="props.control"
            v-model="props.LightSwitch"
            @change="(value) => change({ LightSwitch: value })"
          />
        </template>
      </nut-cell>
      <nut-cell title="水循环">
        <template #link>
          <nut-switch
            :disabled="props.control"
            v-model="props.Pump"
            @change="(value) => change({ Pump: value })"
          />
        </template>
      </nut-cell>
      <nut-cell title="喂食">
        <template #link>
          <nut-button
            plain
            type="primary"
            @click="
              () =>
                change({
                  Motor: true,
                })
            "
            size="mini"
            >喂食</nut-button
          >
        </template>
      </nut-cell>
    </nut-cell-group>

    <nut-popup
      v-model:visible="show"
      position="bottom"
      closeable
      round
      :style="{ height: '350px' }"
    >
      <view class="drawer-title">阈值设置</view>
      <view class="cell">
        <view class="label">水温</view>
        <nut-range
          v-model="data.temperatureRange"
          :max="100"
          :min="0"
          range
        ></nut-range>
      </view>
      <view class="cell">
        <view class="label">水质</view>
        <nut-range
          v-model="data.tdsRange"
          range
          :max="800"
          :min="0"
        ></nut-range>
      </view>
      <view class="cell">
        <view class="label">光照</view>
        <nut-range
          v-model="data.lightRange"
          range
          :max="5000"
          :min="0"
        ></nut-range>
      </view>

      <view class="btn"
        ><nut-button plain type="primary" @click="show = false"
          >取消</nut-button
        >
        <nut-button plain type="info" @click="updateRangeList">确定</nut-button>
      </view>
    </nut-popup>
  </view>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
interface Props {
  TDS: string;
  Temperature: string;
  LightSwitch: boolean;
  Pump: boolean;
  HeatSwitch?: boolean; // 可选属性
  Motor?: boolean; // 可选属性
  rangeList?: any; // 可选属性
  autoChange?: (val: any) => void; // 可选属性
}
const props = withDefaults(defineProps<Props>(), {
  TDS: "0",
  Temperature: "0",
  LightSwitch: false,
  Pump: false,
  HeatSwitch: false,
  Motor: false,
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
const control = ref(0);
const emit = defineEmits(["changeRange", "heatUp", "autoChange"]);

const show = ref(false);
const visible = ref(false);

const data = reactive({
  water: false,
  led: false,
  feed: false,
  temperatureRange: [0, 0],
  tdsRange: [0, 0],
  lightRange: [0, 0],
});
const onChange = (v: string) => {
  emit("autoChange", v);
};
const updateRangeList = () => {
  emit("changeRange", {
    temperatureRange: {
      min: data.temperatureRange[0],
      max: data.temperatureRange[1],
    },
    tdsRange: {
      min: data.tdsRange[0],
      max: data.tdsRange[1],
    },
    lightRange: {
      min: data.lightRange[0],
      max: data.lightRange[1],
    },
  });
  show.value = false;
  visible.value = true;
};

const change = (params) => {
  emit("heatUp", params);
};

onMounted(() => {
  data.temperatureRange = [
    props.rangeList.temperatureRange.min,
    props.rangeList.temperatureRange.max,
  ];
  data.tdsRange = [props.rangeList.tdsRange.min, props.rangeList.tdsRange.max];
  data.lightRange = [
    props.rangeList.lightRange.min,
    props.rangeList.lightRange.max,
  ];
});
</script>

<style scoped>
.control {
  width: 90%;
  margin: 24px auto 0;
  height: 100px;
}

.left-button {
  /* display: flex;
  align-items: center;
  height: 50px;
  line-height: 50px; */
}

.right-button {
  margin-bottom: 15px;
  margin-left: 15px;
}

.title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
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
