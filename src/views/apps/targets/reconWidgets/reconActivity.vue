<template>
  <!--begin::Mixed Widget 4-->
  <div class="card overflow-auto h-650px text-dark px-3">
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
            <span class="bullet bullet-vertical  me-3 h-10px w-20px"
              :class="(process[0] == 100 ? 'bg-success' : 'bg-primary')"></span> <strong class="me-1">{{
                activity.total_finish }} </strong> Hoàn Thành
          </li>
          <li class="d-flex align-items-center py-2 text-dark">
            <span class="bullet bullet-vertical me-3 h-10px w-20px"></span><strong class="me-1">{{ activity.total_not_done
            }} </strong> Chưa Chạy
          </li>
        </div>
      </div>

      <div class="pt-5">
        <p class="text-center fs-13px pb-5">
          <span class="badge badge-light-danger fs-8">Notes:</span>&nbsp;
          Tiến Trình Recon
        </p>
        <el-timeline class="ps-0">
          <el-timeline-item v-for="(activity, index) in activitieLine" :key="index" :icon="activity.icon"
            :type="(activity.color == 'muted') ? 'info' : activity.color" :color="activity.color" :size="activity.size"
            :hollow="true" :timestamp="activity.time">
            <span v-if="activity.name == 'Hoàn Thành'" class="text-dark fs-13px">{{ activity.name}}</span>
            <span v-else class="text-dark fs-13px cursor-pointer text-hover-primary" @click="changeEverActivity(activity)">
              {{ activity.name}}
            </span>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
    <!--end::Body-->
  </div>



  <el-dialog v-model="confirmVisibleActivity" :title="`Thông Tin ${detailActivity.name}`" width="600" id="modal-detail"
    :align-center="true" :append-to-body="true" :show-close="false">
    <div class="card-body py-0" style="padding-top:0px !important;">
      <!--begin::Section-->
      <div>

        <!--begin::Details-->
        <div>
          <!--begin::Row-->
          <div class="me-5">
            <!--begin::Details-->
            <div>
              <div class="row fs-13px mb-3">
                <div class="col-3 text-gray-900">Tên Recon:</div>
                <div class="col-9 text-gray-900">
                  <span v-if="detailActivity.name != ''">{{ detailActivity.name }}</span>
                  <span v-else class="badge badge-light-danger">{{ '--' }}</span>
                </div>
              </div>
              <div class="row fs-13px mb-3">
                <div class="col-3 text-gray-900">Lệnh Chạy:</div>
                <div class="col-9 text-gray-900">
                  <CodeHighlighter lang="json" :data="detailActivity.commandShell"></CodeHighlighter>
                </div>
              </div>
              <div class="row fs-13px mb-3">
                <div class="col-3 text-gray-900">Trạng Thái:</div>
                <div class="col-9 text-gray-900">
                  <span :class="`badge badge-light-${getStatus(detailActivity.status).color} px-4 py-3 badge`">{{ getStatus(detailActivity.status).title }}</span>
                </div>
              </div>
              <div class="row fs-13px">
                <div class="col-3 text-gray-900">Thời Gian Chạy:</div>
                <div class="col-9 text-gray-900">
                  <span v-if="detailActivity.time != '' && detailActivity.time ">{{ detailActivity.time }}</span>
                  <span v-else class="badge badge-light-danger">{{ '--' }}</span>
                </div>
              </div>
            </div>
            <!--end::Details-->
          </div>
          <!--end::Row-->

        </div>
        <!--end::Row-->
      </div>
      <!--end::Section-->
    </div>
    <template #footer center>
      <span class="d-flex justify-content-center">
        <el-button class="border-0" plain type="info" @click="confirmVisibleActivity = false">Hủy bỏ</el-button>
      </span>
    </template>
  </el-dialog>
  <!--end::Mixed Widget 4-->
</template>
  
<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { computed, defineComponent, onBeforeMount, ref, watch, reactive } from "vue";
import Dropdown1 from "@/components/dropdown/Dropdown1.vue";
import { getCSSVariableValue } from "@/assets/ts/_utils";
import type VueApexCharts from "vue3-apexcharts";
import type { ApexOptions } from "apexcharts";
import { useThemeStore } from "@/stores/theme";
import CodeHighlighter from "@/components/highlighters/CodeHighlighter.vue";

export default defineComponent({
  name: "widget-1",
  components: {
    Dropdown1,
    CodeHighlighter,
  },
  props: {
    chartColor: String,
    chartHeight: String,
    btnColor: String,
    activitieLine: Object,
    process: { type: Array, required: true, default: [0] },
    activity: { type: Object as () => Record<string, any>, required: true },
    confirmVisibleActivity: { type: Boolean, required: true, default: false },
  },
  setup(props) {
    // console.log(props)
    const chartRef = ref<typeof VueApexCharts | null>(null);
    let chart: ApexOptions = {};
    const store = useThemeStore();
    const confirmVisibleActivity = ref<boolean>(props.confirmVisibleActivity)
    const detailActivity = reactive({
      color: '',
      commandShell: '',
      name: '',
      status: 0,
      time: ''
    })

    const themeMode = computed(() => {
      return store.mode;
    });

    onBeforeMount(() => {
      Object.assign(chart, chartOptions(props.chartColor, props.chartHeight));
    });

    const changeEverActivity = (data: any) => {
      confirmVisibleActivity.value = true
      detailActivity.name = data.name
      detailActivity.commandShell = (data.commandShell && data.commandShell != '') ? data.commandShell : 'Chưa có lệnh nào được chạy'
      detailActivity.color = data.color
      detailActivity.status = data.status
      detailActivity.time = data.time
    }

    const refreshChart = () => {
      if (!chartRef.value) {
        return;
      }

      Object.assign(chart, chartOptions(props.chartColor, props.chartHeight));

      chartRef.value.refresh();
    };

    const getStatus = (status: number | string) => {
      if (status == 1) {
        return { title: 'Chưa thực hiện', color: 'dark' };
      } else if (status == 2) {
        return { title: 'Đang thực hiện', color: 'primary' };
      } else if (status == 3) {
        return { title: 'Đã thực hiện', color: 'success' };
      } else if (status == 4) {
        return { title: 'Lỗi', color: 'danger' };
      }
      return {title: 'Tạm dừng', color: 'warning' };
    };

    // watch(props, () => {
    //   refreshChart();
    // });

    watch(themeMode, () => {
      refreshChart();
    });

    return {
      chart,
      chartRef,
      getAssetPath,
      confirmVisibleActivity,
      changeEverActivity,
      detailActivity,
      getStatus,
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
span.el-dialog__title {
  color: #181C32 !important;
  font-size: 23px;
  font-weight: 600;
  line-height: 27px;
}

#modal-detail .el-dialog__body {
  padding-top: 10px;
}

.el-timeline-item__wrapper {
  display: flex;
  align-content: center;
  flex-direction: row;
  justify-content: space-between;
}

.el-timeline-item__content {
  margin-right: 10px;
}

.el-timeline-item__timestamp {
  /* color: var(--el-text-color-secondary); */
  color: #A1A5B7;
  line-height: 1;
  font-size: var(--el-font-size-small);
}

/* .el-table .cell {
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
    word-break: break-all;
    line-height: 23px;
    color: #A1A5B7;
    padding: 0 12px;
} */
</style>
  