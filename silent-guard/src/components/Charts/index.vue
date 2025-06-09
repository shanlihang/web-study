<template>
  <div ref="chartRef" class="chart" />
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from "vue";
import * as echarts from "echarts";
import dayjs from "dayjs";

const chartRef = ref(null);
let chartInstance = null;

const props = defineProps({
  data: {
    type: Array,
    required: true, // [{ time: '时间', value: 数值 }]
  },
  chartName: {
    type: String,
    required: true,
  },
});

const initChart = () => {
  if (!chartRef.value) return;
  chartInstance = echarts.init(chartRef.value);

  const option = {
    backgroundColor: "#1f1f1f",
    title: {
      text: props.chartName,
      left: "center",
      top: 10,
      textStyle: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold",
      },
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "#333",
      borderColor: "#555",
      textStyle: {
        color: "#fff",
      },
    },
    grid: {
      left: "10%",
      right: "10%",
      bottom: "15%",
      top: "20%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: (props.data || []).map((item) =>
        dayjs(item.time).format("YYYY-MM-DD HH:mm")
      ),
      axisLine: {
        lineStyle: {
          color: "#888",
        },
      },
      axisLabel: {
        color: "#ccc",
        rotate: 45,
      },
    },
    yAxis: {
      type: "value",
      name: "",
      nameTextStyle: {
        color: "#ccc",
      },
      axisLine: {
        lineStyle: {
          color: "#888",
        },
      },
      axisLabel: {
        color: "#ccc",
      },
      splitLine: {
        lineStyle: {
          color: "#444",
          type: "dashed",
        },
      },
    },
    series: [
      {
        data: (props.data || []).map((item) => item.value),
        type: "line",
        smooth: true,
        symbol: "circle",
        symbolSize: 6,
        lineStyle: {
          color: "#4dabf7",
          width: 3,
        },
        itemStyle: {
          color: "#4dabf7",
          borderColor: "#fff",
          borderWidth: 1,
        },
        areaStyle: {
          color: "rgba(77, 171, 247, 0.15)",
        },
      },
    ],
  };

  chartInstance.setOption(option);
};

onMounted(() => {
  console.log(props);

  initChart();
});

onBeforeUnmount(() => {
  chartInstance?.dispose();
});

// 如果 props.data 是异步加载的
watch(
  () => props.data,
  () => {
    initChart();
  }
);
</script>

<style scoped>
.chart {
  width: 100%;
  height: 600px;
}
</style>
