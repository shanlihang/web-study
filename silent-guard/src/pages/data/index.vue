<template>
  <div class="container">
    <nut-toast
      msg="AI分析中"
      v-model:visible="visible"
      type="loading"
      :duration="0"
    />
    <div class="header">
      <span class="left-btn" @click="backHome">返回</span>
      <span class="title">历史统计</span>
    </div>
    <Segmented
      v-model="selectedOption"
      :options="options"
      :block="true"
      @change="handleChange"
    />
    <LineChart class="chart" :data="dataSource" :chartName="chartName" />
    <nut-button class="btn" type="info" size="large" @click="handleClickBtn"
      >AI分析</nut-button
    >
    <nut-popup
      v-model:visible="show"
      position="bottom"
      closeable
      round
      :style="{ height: '50%' }"
      style="background-color: #010101"
    >
      <Segmented
        v-model="selectedAiOption"
        :options="aiOptions"
        :block="true"
        @change="changeAiOption"
      />
      <div v-if="selectedAiOption === 'result'" v-html="result?.content"></div>
      <div
        v-else-if="selectedAiOption === 'progress'"
        v-html="result?.reasoning_content"
      ></div>
      <div v-else>网络异常，请稍后重试</div>
    </nut-popup>
  </div>
</template>

<script setup lang="ts">
import Taro, { getCurrentInstance } from "@tarojs/taro";
import Segmented from "../../components/Segmented/index.vue";
import { ref, onMounted } from "vue";
import axios from "axios";
import dayjs from "dayjs";
import LineChart from "../../components/Charts/index.vue";

// 设备配置接口
interface DeviceConfig {
  device_name: string;
  key: string;
  product_id: string;
}

const result = ref();

// 默认设备配置
const defaultConfig: DeviceConfig = {
  device_name: "",
  key: "",
  product_id: "",
};
const options = [
  { value: "Temp", label: "温度" },
  { value: "Hum", label: "湿度" },
  { value: "Gas", label: "空气质量" },
  { value: "CO", label: "一氧化碳" },
];

const aiOptions = [
  { value: "result", label: "分析结果" },
  { value: "progress", label: "分析过程" },
];

const chartName = ref("烟雾浓度变化图");
const visible = ref(false);
const show = ref(false);
// 设备配置
const deviceConfig = ref<DeviceConfig>(defaultConfig);
const backHome = () => {
  Taro.navigateBack({
    delta: 1, // 返回几层
  });
};

const dataSource = ref();

// 默认选中的值，将从 URL 参数获取
const selectedOption = ref("Temp");
const selectedAiOption = ref("result");

// 存储路由参数
const routeParams = ref<Record<string, string | undefined>>({});

// 在组件挂载时获取 URL 参数
onMounted(() => {
  const instance = getCurrentInstance();
  const router = instance?.router;

  if (router?.params) {
    // 保存所有路由参数
    routeParams.value = router.params;
    console.log("路由参数：", routeParams.value);

    // 更新设备配置
    if (
      router.params.device_name &&
      router.params.key &&
      router.params.product_id
    ) {
      deviceConfig.value = {
        device_name: router.params.device_name as string,
        key: router.params.key as string,
        product_id: router.params.product_id as string,
      };
    }

    // 如果有 type 参数，更新选中的选项
    if (router.params.type) {
      selectedOption.value = router.params.type as string;
      // 立即获取对应类型的数据
      getDeviceHistory(router.params.type as string);
    }
  }
});

const handleChange = (value: string | number) => {
  if (value == "Gas") {
    chartName.value = "烟雾浓度变化图";
  } else if (value == "Hum") {
    chartName.value = "湿度变化图";
  } else if (value == "Temp") {
    chartName.value = "温度变化图";
  } else if (value == "CO") {
    chartName.value = "一氧化碳变化图";
  }
  // 当选项改变时，更新查询参数
  getDeviceHistory(value as string);
};

const changeAiOption = (value: string) => {
  console.log("选中的值：", value);
};

const getDeviceHistory = async (identifier: string = selectedOption.value) => {
  try {
    const response = await axios({
      method: "GET",
      url: `https://iot-api.heclouds.com/thingmodel/query-device-property-history`,
      params: {
        identifier,
        product_id: deviceConfig.value.product_id,
        device_name: deviceConfig.value.device_name,
        start_time: dayjs().subtract(6, "day").valueOf(),
        end_time: dayjs().valueOf(),
        limit: 100,
      },
      headers: {
        Authorization: decodeURIComponent(deviceConfig.value.key),
      },
    });
    if (response.data.code === 0) {
      dataSource.value = response.data.data?.list;
      // 处理历史数据
    } else {
      throw new Error(response.data.msg || "获取设备历史数据失败");
    }
  } catch (error) {
    console.error("获取设备历史数据失败:", error);
  }
};

const handleClickBtn = async () => {
  visible.value = true;
  try {
    const response = await axios({
      method: "POST",
      url: `http://localhost:3000/ai`,
      data: {
        type: options.find((opt) => opt.value == selectedOption.value)?.label,
        value: dataSource.value,
      },
    });
    visible.value = false;
    show.value = true;
    if (response.data.code === 200) {
      result.value = response.data?.data;
    }
  } catch (error) {
    console.error("获取设备历史数据失败:", error);
  }
};
</script>

<style scoped>
.container {
  padding: 24px;
  overflow: hidden;
  min-height: 100vh;
  background: linear-gradient(160deg, #0a0e17 0%, #1a2130 100%);
  font-family: "Roboto", "PingFang SC", sans-serif;
  color: #e0e0e0;
  font-size: 16px;
}

.header {
  text-align: center;
  position: relative;
}

.header .title {
  font-size: 32px;
  font-weight: 600;
  color: #fff;
  letter-spacing: 1.5px;
  text-shadow: 0 0 10px rgba(64, 158, 255, 0.5);
  position: relative;
  display: inline-block;
}

.header .left-btn {
  position: absolute;
  left: 0;
  font-size: 24px;
  color: #fff;
}

.header .title::after {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #3a7bd5 0%, #00d2ff 100%);
  border-radius: 3px;
}
.chart {
  margin-top: 20px;
}

.btn {
  margin-top: 40px;
}
</style>
