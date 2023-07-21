<template>
  <!--begin::Mixed Widget 4-->
  <div class="card overflow-auto h-650px text-dark">
    <!--begin::Beader-->
    <span class="card-label fw-bold fs-3 mb-3 text-dark" style="margin-left: 3px;">Activity</span>
    <!--end::Header-->

    <!--begin::Body-->
    <div class="card-body d-flex flex-column p-2">
      <div class="flex-grow-1">
        <!--begin::Chart-->
        <apexchart v-if="process && chart" ref="chartRef" class="mixed-widget-4-chart" :options="chart" :series="process"
          :height="chartHeight" type="radialBar"></apexchart>
        <!--end::Chart-->
        <div class="d-flex justify-content-evenly flex-wrap">
          <li class="d-flex align-items-center py-2 text-dark">
            <span class="bullet bullet-vertical  me-3 h-10px w-20px" :class="(process[0] == 100 ? 'bg-success' : 'bg-primary' )"></span> <strong class="me-1">{{activity.total_finish}} </strong> Hoàn Thành
          </li>
          <li class="d-flex align-items-center py-2 text-dark">
            <span class="bullet bullet-vertical me-3 h-10px w-20px"></span><strong class="me-1">{{activity.total_not_done}} </strong> Chưa Chạy
          </li>
        </div>
      </div>

      <div class="pt-5">
        <p class="text-center fs-6 pb-5">
          <span class="badge badge-light-danger fs-8">Notes:</span>&nbsp;
          Tiến Trình Recon
        </p>
        <el-timeline class="ps-0">
          <el-timeline-item v-for="(activity, index) in activitieLine" :key="index" :icon="activity.icon"
          :type="activity.color" :color="activity.color" :size="activity.size" :hollow="true"
            :timestamp="activity.time">
            <span class="text-dark">{{ activity.name }}</span>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
    <!--end::Body-->
  </div>
  <!--end::Mixed Widget 4-->
</template>
  
<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { computed, defineComponent, onBeforeMount, ref, watch } from "vue";
import Dropdown1 from "@/components/dropdown/Dropdown1.vue";
import { getCSSVariableValue } from "@/assets/ts/_utils";
import type VueApexCharts from "vue3-apexcharts";
import type { ApexOptions } from "apexcharts";
import { useThemeStore } from "@/stores/theme";


export default defineComponent({
  name: "widget-1",
  components: {
    Dropdown1,
  },
  props: {
    chartColor: String,
    chartHeight: String,
    btnColor: String,
    activitieLine: Object,
    process: { type: Array, required: true, default: [0] },
    activity: { type: Object as () => Record<string, any>, required: true },
  },
  setup(props) {
    // console.log(props)
    const chartRef = ref<typeof VueApexCharts | null>(null);
    let chart: ApexOptions = {};
    const store = useThemeStore();

    const series = ref([23]);

    const themeMode = computed(() => {
      return store.mode;
    });

    onBeforeMount(() => {
      Object.assign(chart, chartOptions(props.chartColor, props.chartHeight));
    });

    const refreshChart = () => {
      if (!chartRef.value) {
        return;
      }

      Object.assign(chart, chartOptions( props.chartColor, props.chartHeight));

      chartRef.value.refresh();
    };

    // watch(props, () => {
    //   refreshChart();
    // });

    watch(themeMode, () => {
      refreshChart();
    });

    return {
      chart,
      series,
      chartRef,
      getAssetPath,
    };
  },
});

const chartOptions = (
  color: string = "primary",
  height: string = "auto"
): ApexOptions => {
  const baseColor = getCSSVariableValue(`--bs-primary`);
  const lightColor = getCSSVariableValue(`--bs-${color}-light`);

  return {
    chart: {
      fontFamily: "inherit",
      height: height,
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 0,
          size: "65%",
        },
        dataLabels: {
          show: true,
          name: {
            show: false,
            fontWeight: "700",
          },
          value: {
            fontSize: "30px",
            fontWeight: "700",
            offsetY: 12,
            show: true,
            formatter: function (val) {
              return val + "%";
            },
          },
        },
        track: {
          background: lightColor,
          strokeWidth: "100%",
        },
      },
    },
    colors: [baseColor],
    stroke: {
      lineCap: "round",
    },
    labels: ["Progress"],
  };
};
</script>

<style>
.el-timeline-item__wrapper {
  display: flex;
  align-content: center;
  flex-direction: row;
  justify-content: space-between;
}
.el-timeline-item__content{
  margin-right: 10px;
}
</style>
  