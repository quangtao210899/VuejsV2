<template>
  <!--begin::Tables widget 16-->
  <div class="card card-flush" :class="className">
    <!--begin::Header-->
    <div class="card-header pt-5">
      <!--begin::Title-->
      <h3 class="card-title align-items-start flex-column">
        <el-tooltip class="box-item" effect="dark" :hide-after="0" content="Thống kê dựa trên kết quả Vulnerability Scan" placement="top">
          <span class="card-label fw-bold">Thống Kê Theo Mức Độ Nghiêm Trọng</span>
        </el-tooltip>
      </h3>
      <!--end::Title-->

    </div>
    <!--end::Header-->

    <!--begin::Body-->
    <div class="card-body">
      <!--begin::Chart-->
      <apexchart ref="chartRef" type="pie" :options="chart" :series="vulnerableData" :height="height"></apexchart>
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
    vulnerableColor: { type: Array, required: false },
    vulnerableData: { type: Array, required: true },
    vulnerableLabels: { type: Array, required: true },
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
      // // console.log(chart)
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
      type: "pie",
      height: props.height,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
    },
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
    dataLabels: {
      enabled: true,
    },
    colors: props.vulnerableColor,
    labels: props.vulnerableLabels,
    tooltip: {
      style: {
        fontSize: "13px",
      },
      y: {
        formatter: function (val) {
          return "" + val;
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
  };
};
</script>

