<template>
  <!--begin::List Widget 5-->
  <div class="card card-flush" :class="className">
    <!--begin::Header-->
    <div class="card-header align-items-center border-0 mt-4">
      <h3 class="card-title align-items-start flex-column">
        <span class="fw-bold mb-2 text-dark">Most Vulnerable</span>
        <span class="text-muted fw-semobold fs-7">Thống kê lỗ hổng bảo mật theo mục tiêu</span>
      </h3>

      <div class="card-toolbar">

      </div>
    </div>
    <!--end::Header-->

    <!--begin::Body-->
    <!--begin::Body-->
    <div class="card-body py-3">
      <!--begin::Table container-->
      <div class="table-responsive ">
        <!--begin::Table-->
        <table class="table align-middle gs-0 gy-5">
          <!--begin::Table head-->
          <thead>
            <tr>
              <th class="p-0"></th>
              <th class="p-0"></th>
              <th class="p-0 "></th>
              <th class="p-0"></th>
            </tr>
          </thead>
          <!--end::Table head-->

          <!--begin::Table body-->
          <tbody>
            <template v-for="(item, index) in dataMostVulnerable" :key="index">
              <tr>
                <td class="text-start align-top">
                  <span class="fw-bold text-gray-800 fs-6">
                    {{ 1+ index }}
                  </span>
                </td>
                <td class="text-start align-top">
                  <span class="text-muted fw-semobold ">
                    {{ item.name }}
                  </span>
                </td>
                <td class="text-end align-top">
                  <span class="badge badge-danger fw-semobold me-1 mb-1" :style="{backgroundColor: '#28a745'}">info: {{ item.info }}</span>
                  <span class="badge badge-danger fw-semobold me-1 mb-1" :style="{backgroundColor: '#23b7e5'}">low: {{ item.low }}</span>
                  <span class="badge badge-danger fw-semobold me-1 mb-1" :style="{backgroundColor: '#fcba32'}">medium: {{ item.medium }}</span>
                  <span class="badge badge-danger fw-semobold me-1 mb-1" :style="{backgroundColor: '#e11f26'}">high: {{ item.high }}</span>
                </td>

                <td class="text-end align-top">
                  <span class="badge badge-light-info">Tổng: {{ item.total }}</span>
                </td>
              </tr>
            </template>
          </tbody>
          <!--end::Table body-->
        </table>
        <!--end::Table-->
      </div>
      <!--end::Table container-->
    </div>
    <!--end::Body-->
    <!--end: Card Body-->
  </div>
  <!--end: List Widget 5-->
</template>

<script lang="ts">
import { defineComponent } from "vue";

interface ElementType {
  medium: number;
  info: number;
  high: number;
  low: number;
  total: number;
  name: string;
}

export default defineComponent({
  name: "kt-widget-9",
  props: {
    className: { type: String, required: false },
    dataMostVulnerable: { type: Array as () => Array<ElementType>, required: true },
  },
  components: {},
  setup() {
    // const checkType = (type : number) => {
    //   if(type){
    //     if (type = )
    //   }
    // }
    return {
    };
  },
});
</script>
