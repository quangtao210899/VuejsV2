<template>
  <!--begin::List Widget 5-->
  <div class="card card-flush" :class="className">
    <!--begin::Header-->
    <div class="card-header align-items-center border-0 mt-4">
      <h3 class="card-title align-items-start flex-column">
        <el-tooltip class="box-item" effect="dark" hide-after="0" content="Thông tin CVE, các kĩ thuật tấn công mới" placement="top">
          <span class="fw-bold mb-2 text-dark">Hacker News</span>
        </el-tooltip>
      </h3>
    </div>
    <!--end::Header-->

    <!--begin::Body-->
    <div class="card-body pt-5">
      <!--begin::Timeline-->
      <div class="timeline-label">
        <!--begin::Item-->
        <div v-for="item in HackerNews" :key="item.id" class="timeline-item">
          <div class="timeline-label fw-bold text-gray-800 fs-7">{{ formatDate(item.date) }}</div>

          <div class="timeline-badge">
            <KTIcon icon-name="time" icon-class="fs-1 text-primary" />
          </div>
          <div class="col-8 timeline-content fw-semobold text-gray-800 ps-3 cursor-pointer text-break text-hover-primary" @click="visibleDrawer(item)">
            {{ truncateText(item.text, 80) }}
          </div>
        </div>

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
              <router-link :to="'/telegram-list/2'" active-class="active"><a-typography-link underline>Xem thêm</a-typography-link></router-link>
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

  <!-- <el-drawer v-model="visibleDBLeakData" :show-close="false" size="350">
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

  </el-drawer> -->

  <div class="modal fade" tabindex="-1" ref="ModalDetail" aria-hidden="true" id="kt_modal_detail">
        <div class="modal-dialog modal-dialog-centered mw-650px">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="card card-flush pt-3 mb-5 mb-xl-10">
                        <div class="card-header">
                            <div class="card-title">
                                <h1 class="fw-bold">Nội dung</h1>
                            </div>
                        </div>
                        <div class="card-body py-0">
                            <div class="mb-10">
                                <h5>{{ detailedDBLeakData.text ?? '--' }}</h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-sm  btn-primary me-9" data-bs-dismiss="modal">
                        Quay lại
                    </button>
                </div>
            </div>
        </div>
  </div>

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
import { Modal } from "bootstrap";

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
      detailedDBLeakData.text = data.text;
      const modal = new Modal(
          document.getElementById("kt_modal_detail") as Element
      );
      modal.show();
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
