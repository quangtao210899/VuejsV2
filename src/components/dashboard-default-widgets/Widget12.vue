<template>
  <div class="card card-flush" :class="className">
    <!--begin::Header-->
    <div class="card-header pt-7">
      <!--begin::Title-->
      <h3 class="card-title align-items-start flex-column">
        <span class="card-label fw-bold text-gray-800">Latest Vulnerabilities</span>

        <span class="text-gray-400 mt-1 fw-semibold fs-6">Top 10 lỗ hổng bảo mật mới nhất</span>
      </h3>
      <!--end::Title-->

      <!--begin::Toolbar-->
      <div class="card-toolbar">
        <a href="#" class="btn btn-sm btn-light">View all</a> 
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
              <th class="p-0 pb-3 min-w-100px text-start"></th>
              <th class="p-0 pb-3 min-w-175px text-end pe-12"></th>
              <th class="p-0 pb-3 min-w-150px text-end"></th>
            </tr>
          </thead>
          <!--end::Table head-->

          <!--begin::Table body-->
          <tbody>
            <template v-for="(row, i) in latestVulnerabilitiesData" :key="i">
              <tr>
                <td>
                  <div class="d-flex align-items-center">
                    <div class="symbol symbol-45px me-5">
                      <span :class="`bg-light-${checkSeverity(row.severity).color}`" class="symbol-label">
                        <KTIcon icon-name="technology" :icon-class="`text-${checkSeverity(row.severity).color} fs-2x`" />
                      </span>
                    </div>

                    <div class="d-flex justify-content-start flex-column">
                      <span class="fw-bold mb-1 fs-6" :class="`text-${checkSeverity(row.severity).color}`">{{ row.vt_name
                      }}</span>
                      <span class="text-gray-400 fw-semibold d-block fs-7">{{
                        row.severity
                      }}</span>
                    </div>
                  </div>
                </td>

                <td class="text-end pe-12">
                  <span class="badge py-3 px-4 fs-7 badge-light-info">{{ row.schema }}</span>
                </td>

                <td class="text-end pe-0">
                  <div class="d-flex flex-stack">
                    <!--begin::Section-->
                    <a :href="`${row.target__domain}`" class="text-primary fw-semibold fs-6 me-2">{{
                      row.target__domain
                    }}</a>
                    <!--end::Section-->
                    <!--begin::Action-->
                    <button type="button"
                      class="btn btn-icon btn-sm h-auto btn-color-gray-400 btn-active-color-primary justify-content-end">
                      <KTIcon icon-name="exit-right-corner" icon-class="fs-2" />
                    </button>
                    <!--end::Action-->
                  </div>
                  <!--end::Item-->
                </td>

                <td class="text-end pe-0">
                  <span class="text-gray-600 fs-6">{{ formatDate(row.last_seen) }}</span>
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
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import viLocale from './vi.js';

dayjs.extend(relativeTime);
dayjs.locale(viLocale);
interface ElementType {
  id: number;
  schema: string;
  last_seen: string;
  target__domain: string;
  vt_name: string;
  severity: string;
  created_at: string;
  nmap_scan_id: string;
  nuclei_scan_id: string;
  port_scan: object;
}
export default defineComponent({
  name: "default-dashboard-widget-10",
  components: {},
  props: {
    className: { type: String, required: false },
    latestVulnerabilitiesData: { type: Array as () => Array<ElementType>, required: true },
  },
  setup() {
    const formatDate = (date: string) => {
      if (date == "false" || date == null || date == "") {
        return '--:--';
      }
      return dayjs(date).fromNow()
    };
    const checkSeverity = (severity: string) => {
      if (severity == 'Info') {
        return { id: 0, title: 'Info', color: 'success' };
      } else if (severity == 'Low') {
        return { id: 1, title: 'Low', color: 'primary' };
      } else if (severity == 'Medium') {
        return { id: 2, title: 'Medium', color: 'warning' };
      } else if (severity == 'High') {
        return { id: 3, title: 'High', color: 'danger' };
      }
      return { id: 5, title: 'Unknown', color: 'dark' }
    }
    return {
      formatDate,
      checkSeverity,
    };
  },
});
</script>