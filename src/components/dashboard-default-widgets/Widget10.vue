<template>
  <!--begin::List Widget 5-->
  <div class="card card-flush" :class="className">
    <!--begin::Header-->
    <div class="card-header align-items-center border-0 mt-4">
      <h3 class="card-title align-items-start flex-column">
        <span class="fw-bold mb-2 text-dark">Hacker News</span>
        <span class="text-muted fw-semobold fs-7">Thông tin CVE, các kĩ thuật tấn công mới</span>
      </h3>


    </div>
    <!--end::Header-->

    <!--begin::Body-->
    <div class="card-body pt-5">
      <!--begin::Timeline-->
      <div class="timeline-label">
        <!--begin::Item-->
        <div v-for="item in HackerNews" :key="item.id" class="timeline-item">
          <!--begin::Label-->
          <div class="timeline-label fw-bold text-gray-800 fs-7">{{ formatDate(item.date) }}</div>
          <!--end::Label-->

          <!--begin::Badge-->
          <div class="timeline-badge">
            <i class="fa fa-genderless text-primary fs-1"></i>
          </div>
          <!--end::Badge-->

          <!--begin::Text-->
          <div class="col-8 timeline-content fw-semobold text-gray-800 ps-3">
            
            <div class="border border-gray-300 border-dashed rounded p-3">
              <span v-if="item.username != '' || item.username != null" class="fw-bold text-gray-800 fs-6">{{ item.username }}</span><br>
              {{ item.text }}
            </div>
          </div>
          <!--end::Text-->
        </div>
        <!--end::Item-->

        <!--begin::Item-->
        <div class="timeline-item">
          <!--begin::Label-->
          <div class="timeline-label fw-bold text-gray-800 fs-6"></div>
          <!--end::Label-->

          <!--begin::Badge-->
          <div class="timeline-badge">
            <i class="fa fa-genderless text-success fs-1"></i>
          </div>
          <!--end::Badge-->

          <!--begin::Content-->
          <div class="timeline-content d-flex">
            <span class="fw-bold text-gray-800 ps-3">
              <router-link :to="'/telegram-group/2'" active-class="active"><a-typography-link underline>View all</a-typography-link></router-link>
            </span>
          </div>
          <!--end::Content-->
        </div>
        <!--end::Item-->
      </div>
      <!--end::Timeline-->
    </div>
    <!--end: Card Body-->
  </div>
  <!--end: List Widget 5-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent } from "vue";
import Dropdown1 from "@/components/dropdown/Dropdown1.vue";
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import viLocale from './vi.js';

dayjs.extend(relativeTime);
dayjs.locale(viLocale);

interface ElementType {
  id: number;
  date: string;
  text: string;
  message_id: string;
  username: string;
  phone: string;
}
export default defineComponent({
  name: "kt-widget-8",
  props: {
    widgetClasses: String,
    className: { type: String, required: false },
    HackerNews: { type: Array as () => Array<ElementType>, required: true },
  },
  components: {
    Dropdown1,
  },
  setup() {
    const formatDate = (date : string) => {
      if (date == "false" || date == null || date == "") {
        return '--:--';
      }
      return dayjs(date).fromNow()
    };

    return {
      getAssetPath,
      formatDate,
    };
  },
});
</script>
