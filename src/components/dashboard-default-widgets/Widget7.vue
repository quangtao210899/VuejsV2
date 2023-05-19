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
      <apexchart ref="chartRef" type="pie" :options="chart" :series="series"></apexchart>
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
import { getCSSVariableValue } from "@/assets/ts/_utils";
import type VueApexCharts from "vue3-apexcharts";

export default defineComponent({
  name: "chart-pie",
  props: {
    widgetClasses: String,
    className: { type: String, required: false },
    vulnerableColor: { type: Object, required: false },
    vulnerableData: { type: Object, required: false },
    vulnerableLabels: { type: Object, required: false },
  },
  components: {},
  setup(props) {
    const chartRef = ref<typeof VueApexCharts | null>(null);
    let chart: ApexOptions = {};
    const store = useThemeStore();

    const series = props.vulnerableData;

    const themeMode = computed(() => {
      return store.mode;
    });

    onBeforeMount(() => {
      Object.assign(chart, chartOptions(props));
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
      series,
      chartRef,
    };
  },
});

const chartOptions = (props: any): ApexOptions => {
  return {
    chart: {
      fontFamily: "inherit",
      type: "pie",
      height: 350,
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
    labels: props.vulnerableLabels,
    tooltip: {
      style: {
        fontSize: "12px",
      },
      y: {
        formatter: function (val) {
          return + val + " thousands";
        },
      },
    },
  };
};
</script>

<style>
.apexcharts-pie-series path {
  stroke-width: 2px;
  stroke-linejoin: round;
  transition: all 0.3s ease;
}

.apexcharts-pie-series path:hover {
  stroke-width: 4px;
}

.apexcharts-pie-series .apexcharts-pie-slice {
  transition: all 0.3s ease;
}

.apexcharts-pie-series .apexcharts-pie-slice:hover {
  transform: scale(1.1);
  filter: brightness(85%);
}
</style>
