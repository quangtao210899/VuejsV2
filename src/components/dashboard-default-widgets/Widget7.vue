<template>
  <!--begin::Tables widget 16-->
  <div class="card card-flush" :class="className">
    <!--begin::Header-->
    <div class="card-header pt-5">
      <!--begin::Title-->
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label fw-bold text-gray-800">Vulmerabilities by serverity</span>

        <span class="text-gray-400 mt-1 fw-semibold fs-6">Thống kê dựa trên kết quả Vuilnreability scan</span>
      </h3>
      <!--end::Title-->

      <!--begin::Toolbar-->
      <div class="card-toolbar">
        <!--begin::Menu-->
        <button class="btn btn-icon btn-color-gray-400 btn-active-color-primary justify-content-end"
          data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end" data-kt-menu-overflow="true">
          <KTIcon icon-name="dots-square" icon-class="fs-1 text-gray-300 me-n1" />
        </button>
        <!--end::Menu-->
      </div>
      <!--end::Toolbar-->
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
    },
    dataLabels: {
      enabled: true,
    },
    colors: props.vulnerableColor,
    labels: props.vulnerableLabels,
    tooltip: {
      style: {
        fontSize: "12px",
      },
      y: {
        formatter: function (val) {
          return   "Tổng có: " + val;
        },
      },
    },
  };
};
</script>

