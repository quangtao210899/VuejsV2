<template>
  <div class="card card-flush" :class="className">
    <!--begin::Header-->
    <div class="card-header pt-7">
      <!--begin::Title-->
      <h3 class="card-title align-items-start flex-column">
        <el-tooltip class="box-item" effect="dark" hide-after="0" content="Top 10 lỗ hổng bảo mật mới nhất" placement="top">
          <span class="fw-bold mb-2 text-dark">Lỗ Hổng Bảo Mật Mới Nhất</span>
        </el-tooltip>
      </h3>
      <!--end::Title-->

      <!--begin::Toolbar-->
      <div class="card-toolbar">
        <router-link class="btn btn-sm btn-light-primary" style="font-size: 13px;" to="/scans" active-class="active">Xem Thêm</router-link>
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
                    <div class="symbol symbol-35px me-5">
                      <span :class="`bg-light-${checkSeverity(row.severity).color}`" class="symbol-label">
                        <!-- <KTIcon icon-name="technology" :icon-class="`text-${checkSeverity(row.severity).color} fs-2x`" /> -->
                        <i class="fa-solid fa-bug fa-shake fs-5" :class="`text-${checkSeverity(row.severity).color}`"></i>
                      </span>
                    </div>

                    <div class="d-flex justify-content-start flex-column">
                      <span class="fw-bold mb-1" :class="`text-${checkSeverity(row.severity).color}`">{{ row.vt_name
                      }}</span>
                      <span class="fw-semibold d-block fs-7" :class="`text-${checkSeverity(row.severity).color}`">
                        <span class="bullet bullet-vertical me-2"
                          :class="`bg-${checkSeverity(row.severity).color}`"></span>
                        {{ row.severity }}
                      </span>
                    </div>
                  </div>
                </td>

                <td class="text-end pe-12">
                  <span class="badge badge-light-primary py-2 px-4" style="font-size: 13px;"
                    >
                    <KTIcon
                      class="me-1 text-primary"
                      icon-name="lock" />
                    {{ checkDomain(row.schema ?? (row.nmap_scan_id ? row.port_scan["service"] :
                      row.port_scan["type"])).title }}
                  </span>
                </td>

                <td class="text-end pe-0">
                  <span href="#" class="fw-bold text-hover-primary mb-1">{{ row.target__domain
                  }}</span>
                </td>

                <td class="text-end pe-0">
                  <span class="text-gray-500 w-bold d-flex justify-content-end align-items-center">
                    <KTIcon class="me-1" icon-name="calendar" icon-class="fs-4" />
                    {{ formatDate(row.last_seen) }}
                  </span>
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

    const checkDomain = (severity: string) => {
      if (severity == 'http') {
        return { id: 0, title: severity, color: 'info' };
      } else if (severity == 'ssh') {
        return { id: 1, title: severity, color: 'success' };
      } else if (severity == 'https') {
        return { id: 2, title: severity, color: 'warning' };
      }
      return { id: 5, title: severity, color: 'dark' }
    }
    return {
      formatDate,
      checkSeverity,
      checkDomain,
    };
  },
});
</script>
