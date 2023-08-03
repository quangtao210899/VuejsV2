<template>
  <!--begin::Tables widget 16-->
  <div class="card card-flush" :class="className">
    <!--begin::Header-->
    <div class="card-header pt-5">
      <!--begin::Title-->
      <h3 class="card-title align-items-start flex-column">
        <el-tooltip class="box-item" effect="dark" :hide-after="0" content="Top 10 cổng dịch vụ phổ biến nhất" placement="top">
          <span class="fw-bold mb-2 text-dark">Cổng Dịch Vụ Phổ Biến</span>
        </el-tooltip>
      </h3>
      <!--end::Title-->

      <!--begin::Toolbar-->
      <div class="card-toolbar">
        <!--begin::Menu-->
        <!-- <button class="btn btn-icon btn-color-gray-400 btn-active-color-primary justify-content-end"
          data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end" data-kt-menu-overflow="true">
          <KTIcon icon-name="dots-square" icon-class="fs-1 text-gray-300 me-n1" />
        </button> -->
        <!--end::Menu-->
      </div>
      <!--end::Toolbar-->
    </div>
    <!--end::Header-->

    <!--begin::Body-->
    <div class="card-body pt-0">
      <!--begin::Chart-->
      <apexchart ref="chartRef" style="min-height: 700px;height: 100%;" height="100%" type="bar" :options="chart" :series="MostcommonPortData">
      </apexchart>
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
import { getCSSVariableValue } from "@/assets/ts/_utils";

export default defineComponent({
  name: "kt-widget-11",
  props: {
    widgetClasses: String,
    className: { type: String, required: false },
    MostcommonPortColor: { type: Array, required: true },
    MostcommonPortData: { type: Array, required: true },
    MostcommonPortLabels: { type: Array, required: true },
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
  const labelColor = getCSSVariableValue("--bs-gray-500");
  const borderColor = getCSSVariableValue("--bs-gray-200");

  return {
    chart: {
      fontFamily: "inherit",
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        barHeight: '65%',
        distributed: true,
        horizontal: true,
        borderRadius: 6,
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: props.MostcommonPortLabels,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: '#181c32',
          fontSize: "13px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#181c32',
          fontSize: "13px",
        },
      },
    },
    fill: {
      opacity: 1,
    },
    states: {
      normal: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      hover: {
        filter: {
          type: "none",
          value: 0,
        },
      },
      active: {
        allowMultipleDataPointsSelection: false,
        filter: {
          type: "none",
          value: 0,
        },
      },
    },

    colors: props.MostcommonPortColor,
    grid: {
      borderColor: borderColor,
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    responsive: [
      {
        breakpoint: 0,
        options: {
          chart: {
            width: '100%',
            height: '100%',
          },
        },
      },
    ],
  };
};
</script>

