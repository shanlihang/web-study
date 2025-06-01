<template>
  <view class="index">
    <nut-navbar title="智能鱼缸系统"></nut-navbar>
    <StatusCard :status="data.status" @reconnect="reconnect" />
    <LiveTime :TDS="data.TDS" :Temperature="data.Temperature" :LightIntensity="data.LightIntensity" />
    <ControlPanel :TDS="data.TDS" :Temperature="data.Temperature" :LightIntensity="data.LightIntensity" @heatUp="(type) => heatUp(type)" />
  </view>
</template>

<script setup>
import { reactive, ref, onMounted, toRaw,onUnmounted } from "vue";
import axios from 'axios';
import StatusCard from "../../components/StatusCard";
import LiveTime from "../../components/LiveTime";
import ControlPanel from "../../components/ControlPanel";

// 配置信息
const CONFIG = {
  // PRODUCT_ID: '1joLrOD4Kp', // 替换为你的产品ID
  // DEVICE_NAME: 'yugang', // 替换为你的设备名称
  // API_KEY: 'version=2018-10-31&res=products%2F1joLrOD4Kp%2Fdevices%2Fyugang&et=2051233871&method=md5&sign=Kc0xe94JSo%2FtymVhnfF5FQ%3D%3D'
  PRODUCT_ID: 'qYOC7EbJ92', // 产品ID
  DEVICE_NAME: 'fish_tack_device', // 设备名称
  // API_KEY: 'version=2018-10-31&res=products%2F1joLrOD4Kp%2Fdevices%2Fyugang&et=2051233871&method=md5&sign=Kc0xe94JSo%2FtymVhnfF5FQ%3D%3D'
  API_KEY: 'version=2018-10-31&res=products%2FqYOC7EbJ92%2Fdevices%2Ffish_tack_device&et=1906444415&method=md5&sign=8kgq6l3ur4dgWOyBue8%2B1w%3D%3D'

};

const data = reactive({
  status: 0, // 0: 离线, 1: 在线 2:未激活
  TDS: '0', // 水质
  Temperature: '0', // 水温
  LightIntensity: '0', // 光照强度
});
// 获取设备在线状态
const getDeviceStatus = async () => {
 
  try {
    const response = await axios({
      method: 'GET',
      url:' https://iot-api.heclouds.com/device/detail',
      params: {
        product_id: CONFIG.PRODUCT_ID,
        device_name: CONFIG.DEVICE_NAME
      },
      headers: {
        'Authorization': CONFIG.API_KEY
      }
    });
    if (response.data.code === 0) {
      data.status = response.data.data.status;

    } else {
      throw new Error(response.data.msg || '获取设备状态失败');
    }
  } catch (error) {
    console.error('获取设备状态失败:', error);
    data.status = 0;
  }
};

// 查询设备属性
const queryDeviceProperty = async () => {
  try {
    const response = await axios({
      method: 'GET',
      url: `https://iot-api.heclouds.com/thingmodel/query-device-property`,
      params: {
        product_id: CONFIG.PRODUCT_ID,
        device_name: CONFIG.DEVICE_NAME
      },
      headers: {
        'Authorization': CONFIG.API_KEY
      }
    });
    if (response.data.code === 0) {
      data.TDS = response.data.data.find(item => item.identifier === 'TDS')?.value || '0';
      data.Temperature = response.data.data.find(item => item.identifier === 'Temperature')?.value || '0';
      data.LightIntensity = response.data.data.find(item => item.identifier === 'LightIntensity')?.value || '0';
    } else {
      throw new Error(response.data.msg || '查询设备属性失败');
    }
  } catch (error) {
    console.error('查询设备属性失败:', error);
  }
};
const reconnect = () => {
  data.status = 1;
  queryDeviceProperty(); // 重连时查询设备属性
};
const heatUp = (type) => {
  // 处理加热逻辑
  console.log(`加热类型: ${type}`);
  axios({
    method: 'POST',
    url: `https://iot-api.heclouds.com/thingmodel/set-device-property`,
    data:{
      product_id: CONFIG.PRODUCT_ID,
      device_name: CONFIG.DEVICE_NAME,
      params: {
        LightSwitch: true
      }
    },
    
    headers: {
      'authorization': CONFIG.API_KEY
    }
  }).then(response => {
    if (response.data.code === 0) {
      console.log('加热命令发送成功');
    } else {
      console.error('加热命令发送失败:', response.data.msg);
    }
  }).catch(error => {
    console.error('加热命令发送异常:', error);
  });
  // 这里可以添加实际的加热逻辑
};
// 设置轮询间隔（毫秒）
const POLL_INTERVAL = 15000;

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
