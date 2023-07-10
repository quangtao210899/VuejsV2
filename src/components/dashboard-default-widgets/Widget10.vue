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

            <div class="border border-gray-300 border-dashed rounded p-3 cursor-pointer text-hover-primary" @click="visibleDrawer(item)">
              <span v-if="item.username != '' || item.username != null" class="fw-bold text-gray-800 fs-6 text-hover-primary">{{
                item.username }}</span>
                <br v-if="item.username != '' || item.username != null">
              {{ truncateText(item.text, 80) }}
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
              <router-link :to="'/telegram-list/2'" active-class="active"><a-typography-link underline>View
                  all</a-typography-link></router-link>
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

  <el-drawer v-model="visibleDBLeakData" :show-close="false" size="350">
    <template #header="{ close, titleId, titleClass }">
      <h4 class="fs-4" :id="titleId" :class="titleClass">Chi tiết DB Leak</h4>
      <el-button type="danger" @click="close">
        <el-icon class="el-icon--left">
          <CircleCloseFilled />
        </el-icon>
        Đóng
      </el-button>
    </template>
    <div class="row mb-5">
      <div class="col-3"><span class="fw-bold text-gray-800 fs-7">Tên:</span></div>
      <div class="col-9"><span class="text-break">{{ detailedDBLeakData.username ?? '--' }}</span></div>
    </div>
    <div class="row mb-5">
      <div class="col-3"><span class="fw-bold text-gray-800 fs-7">ID Người dùng:</span></div>
      <div class="col-9"><span class="text-break">{{ detailedDBLeakData.message_id ?? '--' }}</span></div>
    </div>
    <div class="row mb-5">
      <div class="col-3"><span class="fw-bold text-gray-800 fs-7">Số Điện Thoại:</span></div>
      <div class="col-9"><span class="text-break">{{ detailedDBLeakData.phone ?? '--' }}</span></div>
    </div>
    <div class="row mb-5">
      <div class="col-3"><span class="fw-bold text-gray-800 fs-7">Nội Dung:</span></div>
      <div class="col-9"><span class="text-break">{{ detailedDBLeakData.text ?? '--' }}</span></div>
    </div>
    <div class="row mb-5">
      <div class="col-3"><span class="fw-bold text-gray-800 fs-7">Thời gian:</span></div>
      <div class="col-9"><span class="text-break">{{ formatDate(detailedDBLeakData.date) }}</span></div>
    </div>

  </el-drawer>
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent } from "vue";
import Dropdown1 from "@/components/dropdown/Dropdown1.vue";
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import viLocale from './vi.js';
import { ref, reactive } from 'vue'
import { CircleCloseFilled } from '@element-plus/icons-vue'

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
    CircleCloseFilled,
  },
  setup() {
    const formatDate = (date: string) => {
      if (date == "false" || date == null || date == "") {
        return '--:--';
      }
      return dayjs(date).fromNow()
    };
    const visibleDBLeakData = ref(false)
    const detailedDBLeakData = reactive({
      id: '',
      message_id: '',
      phone: '',
      text: '',
      date: '',
      username: ''
    })
    const visibleDrawer = (data: any) => {
      visibleDBLeakData.value = true
      detailedDBLeakData.username = data.username;
      detailedDBLeakData.text = data.text;
      detailedDBLeakData.phone = data.phone;
      detailedDBLeakData.date = data.date;
      detailedDBLeakData.message_id = data.message_id;
      detailedDBLeakData.id = data.id;
    }

    // upadte status 
    const truncateText = (text: string, maxLength: number) => {
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
      }
      return text;
    };


    return {
      getAssetPath,
      formatDate,
      visibleDrawer,
      visibleDBLeakData,
      detailedDBLeakData,
      truncateText,
    };
  },
});
</script>
