<template>
  <!--begin::Tables widget 16-->
  <div class="card card-flush" :class="className">
    <!--begin::Header-->
    <div class="card-header pt-5">
      <!--begin::Title-->
      <h3 class="card-title align-items-start flex-column">
        <el-tooltip class="box-item" effect="dark" hide-after="0" content="Top 10 nhóm mục tiêu có số lượng mục tiêu lớn nhất" placement="top">
          <span class="card-label fw-bold">Nhóm mục tiêu</span>
        </el-tooltip>
      </h3>
      <!--end::Title-->

    </div>
    <!--end::Header-->

    <!--begin::Body-->
    <div class="card-body">
      <!--begin::Chart-->
      <apexchart ref="chartRef" type="donut" :options="chart" :series="targetGroupData" :height="height"></apexchart>
      <!--end::Chart-->
    </div>
    <!--end::Body-->
  </div>
  <!--end::Tables widget 16-->
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, ref, watch } from "vue";
import { useThemeStore } from "@/stores/theme";
import type { ApexOptions } from "apexcharts";
import type VueApexCharts from "vue3-apexcharts";

export default defineComponent({
  name: "chart-pie",
  props: {
    widgetClasses: String,
    className: { type: String, required: false },
    targetGroupColor: { type: Array, required: false },
    targetGroupData: { type: Array, required: true },
    targetGroupLabels: { type: Array, required: true },
    height: { type: Number, required: true },
  },
  components: {},
  setup(props) {
    const chartRef = ref<typeof VueApexCharts | null>(null);
    let chart: ApexOptions = {};
    const store = useThemeStore();

    const themeMode = computed(() => {
      return store.mode;
    });

    onBeforeMount(() => {
      Object.assign(chart, chartOptions(props));
      // console.log(chart)
    });

    const refreshChart = () => {
      if (!chartRef.value) {
        return;
      }

      Object.assign(chart, chartOptions(props));

      chartRef.value.refresh();
    };

    watch(themeMode, () => {
      refreshChart();
    });

    return {
      chart,
      chartRef,
    };
  },
});

const chartOptions = (props: any): ApexOptions => {
  return {
    chart: {
      fontFamily: "inherit",
      type: "donut",
      height: props.height,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {

    },
    dataLabels: {
      enabled: true,
    },
    // fill: {
    //   type: 'gradient',
    // },
    legend: {
      show: true,
      fontSize: '13px',
      fontWeight: 400,
      labels: {
          colors: '#181c32',
          useSeriesColors: false
      },
      markers: {
          width: 20,
          height: 10,
          radius: 1,
      },
      itemMargin: {
          horizontal: 5,
          vertical: 5
      },
    },
    colors: props.targetGroupColor,
    labels: props.targetGroupLabels,
    tooltip: {
      style: {
        fontSize: "13px",
      },
      y: {
        formatter: function (val) {
          return "Tổng có: " + val;
        },
      },
    },
    responsive: [{
      options: {
        chart: {
          width: 300
        },
        legend: {
          position: 'top'
        }
      }
    }],
    stroke: {
      show: false,
      width: 6,
    },
    
  };
};
</script>

