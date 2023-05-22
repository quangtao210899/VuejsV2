<template>
  <div class="card card-flush" :class="className">
    <!--begin::Header-->
    <div class="card-header pt-7">
      <!--begin::Title-->
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label fw-bold text-gray-800">Latest Vulnerabilities</span>

        <span class="text-gray-400 mt-1 fw-semibold fs-6"
          >Top 10 lỗ hổng bảo mật mới nhất</span
        >
      </h3>
      <!--end::Title-->

      <!--begin::Toolbar-->
      <div class="card-toolbar">
        <a href="#" class="btn btn-sm btn-light">History</a>
      </div>
      <!--end::Toolbar-->
    </div>
    <!--end::Header-->

    <!--begin::Body-->
    <div class="card-body pt-6">
      <!--begin::Table container-->
      <div class="table-responsive">
        <!--begin::Table-->
        <table class="table table-row-dashed align-middle gs-0 gy-3 my-0">
          <!--begin::Table head-->
          <thead>
            <tr class="fs-7 fw-bold text-gray-400 border-bottom-0">
              <th class="p-0 pb-3 min-w-175px text-start"></th>
              <th class="p-0 pb-3 min-w-100px text-end"></th>
              <th class="p-0 pb-3 min-w-175px text-end pe-12"></th>
              <th class="p-0 pb-3 w-50px text-end"></th>
            </tr>
          </thead>
          <!--end::Table head-->

          <!--begin::Table body-->
          <tbody>
            <template v-for="(row, i) in latestVulnerabilitiesData" :key="i">
              <tr>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="symbol symbol-50px me-3">
                      <KTIcon icon-name="technology" icon-class="fs-2" />
                    </div>

                    <div class="d-flex justify-content-start flex-column">
                      <span
                        class="text-gray-800 fw-bold text-hover-primary mb-1 fs-6"
                        >{{ row.vt_name }}</span
                      >
                      <span class="text-gray-400 fw-semibold d-block fs-7">{{
                        row.severity
                      }}</span>
                    </div>
                  </div>
                </td>

                <td class="text-end pe-12">
                  <span
                    class="badge py-3 px-4 fs-7 badge-light-primary">{{ row.schema }}</span>
                </td>

                <td class="text-end pe-0">
                  <span class="text-gray-600 fw-bold fs-6"
                    >{{ row.target__domain }}</span
                  >
                </td>

                <td class="text-end pe-0">
                  <span class="text-gray-600 fw-bold fs-6"
                    >{{ row.last_seen }}</span
                  >
                </td>

              </tr>
            </template>
          </tbody>
          <!--end::Table body-->
        </table>
      </div>
      <!--end::Table-->
    </div>
    <!--end: Card Body-->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "default-dashboard-widget-10",
  components: {},
  props: {
    className: { type: String, required: false },
    latestVulnerabilitiesData: { type: Array, required: true },
  },
  setup() {
    return {
    };
  },
});
</script>
