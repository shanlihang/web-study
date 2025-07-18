<template>
  <view class="index">
    <nut-navbar title="智能鱼缸系统"></nut-navbar>
    <StatusCard :status="data.status" @reconnect="reconnect" />
    <LiveTime
      :control="data.control"
      :data="data"
      :rangeList="rangeList"
      @heatUp="(type) => heatUp(type)"
    />
    <ControlPanel
      :TDS="data.TDS"
      :Temperature="data.Temperature"
      :LightSwitch="data.LightSwitch"
      :Pump="data.Pump"
      :HeatSwitch="data.HeatSwitch"
      :rangeList="rangeList"
      @changeRange="(newList) => changeRange(newList)"
      @heatUp="(type) => heatUp(type)"
      @autoChange="
        (val) => {
          data.control = val;
        }
      "
    />
  </view>
  <nut-toast
    :msg="state.msg"
    v-model:visible="state.show"
    :type="state.type"
    @closed="onClosed"
    :cover="state.cover"
  />
</template>

<script setup>
import { reactive, ref, onMounted, toRaw, onUnmounted } from "vue";
import axios from "axios";
import StatusCard from "../../components/StatusCard";
import LiveTime from "../../components/LiveTime";
import ControlPanel from "../../components/ControlPanel";

// 配置信息
const CONFIG = {
  PRODUCT_ID: "qYOC7EbJ92", // 产品ID
  DEVICE_NAME: "fish_tack_device", // 设备名称
  API_KEY:
    "version=2018-10-31&res=products%2FqYOC7EbJ92%2Fdevices%2Ffish_tack_device&et=1906444415&method=md5&sign=8kgq6l3ur4dgWOyBue8%2B1w%3D%3D",
};
const state = reactive({
  msg: "toast",
  type: "text",
  show: false,
  cover: false,
  title: "",
  bottom: "",
  center: true,
});
const data = reactive({
  status: 0, // 0: 离线, 1: 在线 2:未激活
  TDS: "0", // 水质
  Temperature: "0", // 水温
  Light: "0", // 光照
  LightSwitch: false, // 光照开关
  Pump: false, // 水泵开关
  HeatSwitch: false, // 加热开关
  control: 0,
});

const rangeList = reactive({
  temperatureRange: {
    min: 0,
    max: 30,
  },
  tdsRange: {
    min: 100,
    max: 500,
  },
  lightRange: {
    min: 3000,
    max: 5000,
  },
});
// 获取设备在线状态
const getDeviceStatus = async () => {
  try {
    const response = await axios({
      method: "GET",
      url: " https://iot-api.heclouds.com/device/detail",
      params: {
        product_id: CONFIG.PRODUCT_ID,
        device_name: CONFIG.DEVICE_NAME,
      },
      headers: {
        Authorization: CONFIG.API_KEY,
      },
    });
    if (response.data.code === 0) {
      data.status = response.data.data.status;
    } else {
      throw new Error(response.data.msg || "获取设备状态失败");
    }
  } catch (error) {
    console.error("获取设备状态失败:", error);
    data.status = 0;
  }
};
// 查询设备属性
const queryDeviceProperty = async () => {
  try {
    const response = await axios({
      method: "GET",
      url: `https://iot-api.heclouds.com/thingmodel/query-device-property`,
      params: {
        product_id: CONFIG.PRODUCT_ID,
        device_name: CONFIG.DEVICE_NAME,
      },
      headers: {
        Authorization: CONFIG.API_KEY,
      },
    });
    if (response.data.code === 0) {
      data.TDS =
        response.data.data.find((item) => item.identifier === "TDS")?.value ||
        "0";
      data.Temperature =
        response.data.data.find((item) => item.identifier === "Temperature")
          ?.value || "0";
      data.Light =
        response.data.data.find((item) => item.identifier === "Light")?.value ||
        "0";
      data.LightSwitch =
        response.data.data.find((item) => item.identifier === "LightSwitch")
          ?.value == "true";
      data.Pump =
        response.data.data.find((item) => item.identifier === "Pump")?.value ==
        "true";
      data.HeatSwitch =
        response.data.data.find((item) => item.identifier === "HeatSwitch")
          ?.value == "true";
    } else {
      throw new Error(response.data.msg || "查询设备属性失败");
    }
  } catch (error) {
    console.error("查询设备属性失败:", error);
  }
};
const reconnect = () => {
  data.status = 1;
  queryDeviceProperty(); // 重连时查询设备属性
};
const heatUp = (type) => {
  state.show = true;
  state.msg = "加载中...";
  state.type = "loading";
  state.cover = true;
  axios({
    method: "POST",
    url: `https://iot-api.heclouds.com/thingmodel/set-device-property`,
    data: {
      product_id: CONFIG.PRODUCT_ID,
      device_name: CONFIG.DEVICE_NAME,
      params: type,
    },

    headers: {
      authorization: CONFIG.API_KEY,
    },
  })
    .then((response) => {
      state.show = false;
      if (response.data.code === 0) {
        console.log("加热命令发送成功");
      } else {
        console.error("加热命令发送失败:", response.data.msg);
      }
    })
    .catch((error) => {
      state.show = false;
      console.error("加热命令发送异常:", error);
    });
  // 这里可以添加实际的加热逻辑
};

const changeRange = (newList) => {
  Object.keys(rangeList).forEach((key) => {
    rangeList[key].min = newList[key].min;
    rangeList[key].max = newList[key].max;
  });
};
// 设置轮询间隔（毫秒）
const POLL_INTERVAL = 3000;

// 开始轮询
const startPolling = () => {
  setInterval(() => {
    getDeviceStatus();
    queryDeviceProperty();
  }, POLL_INTERVAL);
};

// 清理定时器
onUnmounted(() => {
  clearInterval(startPolling);
});
// 组件挂载时查询设备属性
onMounted(() => {
  getDeviceStatus();
  queryDeviceProperty();
  startPolling();
});
</script>

<style scoped></style>
