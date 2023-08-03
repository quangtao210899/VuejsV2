<template>
  <!--begin::List Widget 5-->
  <div class="card card-flush" :class="className">
    <!--begin::Header-->
    <div class="card-header align-items-center border-0 mt-4">
      <h3 class="card-title align-items-start flex-column">
        <el-tooltip class="box-item" effect="dark" :hide-after="0" content="Thông tin mua bán dữ liệu đươc thu thập" placement="top">
          <span class="fw-bold mb-2">Dữ Liệu Dò Rỉ</span>
        </el-tooltip>
      </h3>

      <div class="card-toolbar">
        <!--begin::Menu-->
        <!-- <button
          type="button"
          class="btn btn-sm btn-icon btn-color-primary btn-active-light-primary"
          data-kt-menu-trigger="click"
          data-kt-menu-placement="bottom-end"
          data-kt-menu-flip="top-end"
        >
          <KTIcon icon-name="category" icon-class="fs-2" />
        </button> -->
        <!--end::Menu-->
      </div>
    </div>
    <!--end::Header-->

    <!--begin::Body-->
    <div class="card-body pt-5">
      <!--begin::Timeline-->
      <div class="timeline-label">
        <!--begin::Item-->
        <div v-for="item in DBLeakData" :key="item.id" class="timeline-item">
          <!--begin::Label-->
          <div class="timeline-label fw-bold text-dark">{{ formatDate(item.date) }}</div>
          <!--end::Label-->

          <!--begin::Badge-->
          <div class="timeline-badge">
            <!-- <i class="fa fa-genderless text-primary fs-1"></i> -->
            <KTIcon icon-name="time" icon-class="fs-1 text-primary" />

          </div>
          <!--end::Badge-->

          <!--begin::Text-->
          <div class="col-8 timeline-content fw-semobold ps-3 cursor-pointer text-break text-hover-primary" @click="visibleDrawer(item)">
            {{ truncateText(item.text, 80) }}
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
            <span class="fw-bold text-gray-800 ps-3 d-flex justify-content-end align-items-center text-hover-primary">
              <router-link class="me-3" :to="'/telegram-list/1'" active-class="active">Xem Thêm</router-link>
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

  <div class="modal fade" tabindex="-1" ref="ModalDetail" aria-hidden="true" id="kt_db_leak_detail">
        <div class="modal-dialog modal-dialog-centered mw-550px">
            <div class="modal-content">
                <div class="modal-body" style="padding: 26px 0px 0px 0px;">
                    <div class="card card-flush">
                        <div class="card-body py-0">
                              <span>{{ detailedDBLeakData.text ?? '--' }}</span>
                        </div>
                    </div>
                </div>
                <div class="modal-footer" style="border-top: 0px; justify-content: center;">
                    <button type="button" class="btn btn-sm btn-light-primary" data-bs-dismiss="modal">
                        Đóng
                    </button>
                </div>
            </div>
        </div>
  </div>

</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent } from "vue";
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import viLocale from './vi.js';
import { ref, reactive } from 'vue'
import { CircleCloseFilled } from '@element-plus/icons-vue'
import { Modal } from "bootstrap";

dayjs.extend(relativeTime);
dayjs.locale(viLocale);
interface ElementType {
  date: string;
  text: string;
  username: string;
  phone: number;
  message_id: number;
  id: number;
}
export default defineComponent({
  name: "kt-widget-8",
  props: {
    widgetClasses: String,
    className: { type: String, required: false },
    DBLeakData: { type: Array as () => Array<ElementType>, required: true },
  },
  components: {
    CircleCloseFilled,
  },
  setup() {
    const formatDate = (date : string) => {
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
    const visibleDrawer = (data : any) => {
      visibleDBLeakData.value = true
      detailedDBLeakData.text = data.text;
      const modal = new Modal(
          document.getElementById("kt_db_leak_detail") as Element
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
