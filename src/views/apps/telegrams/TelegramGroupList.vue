<template>
  <!--begin::Card-->
  <div class="card h-100 d-block">
    <!--begin::Card header-->
    <div class="card-header border-0 pt-6 position-absolute end-0 pe-1 " style="top: -80px;">
      <!--begin::Card title-->
      <!-- <h3 class="card-title align-items-start flex-column">
        <span class="card-label fw-bold fs-3 mb-1">Danh sách quản lý lỗ hổng</span>

        <span class="text-muted fw-semobold fs-7">Tổng có {{ totalPage }} lỗ hổng</span>
      </h3> -->
      <!--begin::Card title-->

      <!--begin::Card toolbar-->
      <div class="card-toolbar">
        <!--begin::Toolbar-->
        <div v-show="selectedIds.length === 0">
          <div  class="d-flex justify-content-end " data-kt-subscription-table-toolbar="base">
            <!--begin::Export-->
            <!-- <button type="button" class="btn btn-light-primary me-3" data-bs-toggle="modal"
              data-bs-target="#kt_subscriptions_export_modal">
              <KTIcon icon-name="exit-up" icon-class="fs-2" />
              Export
            </button> -->
            <!--end::Export-->
            <!-- <div class="position-absolute end-0" style="top: -60px;">  -->
            <el-tooltip class="box-item" effect="dark" hide-after="0" content="Tìm kiếm" placement="top">
              <button
                type="button"
                class="btn btn-sm fw-bold bg-body btn-color-gray-700 btn-active-color-primary me-2"
                data-kt-menu-trigger="click"
                data-kt-menu-placement="bottom-end"
                data-kt-menu-flip="top-end"
              >
                <KTIcon icon-name="filter" icon-class="fs-2" />
                Filter
              </button>
              <!-- </div> -->
            </el-tooltip>
            <Fillter @filterData="handleFilter"></Fillter>
            <!--begin::Add subscription-->
            <!--end::Add subscription-->
            <el-tooltip class="box-item" effect="dark" hide-after="0" content="Cấu hình thời gian lấy tin nhắn" placement="top">
              <button type="button" class="btn btn-sm fw-bold btn-info me-2" @click.passive="handleSubmitSetting">
                <KTIcon icon-name="setting-2" icon-class="fs-2" />
                Cấu hình
              </button>
            </el-tooltip>
            <el-tooltip class="box-item" effect="dark" hide-after="0" content="Đồng bộ toàn bộ tin nhắn" placement="top"> 
              <button type="button"  class="btn btn-sm fw-bold btn-success me-2" @click.passive="handleSyncAll">
                <KTIcon icon-name="arrows-circle" icon-class="fs-2" />
                Đồng bộ All
              </button>
            </el-tooltip>

            <!-- <button type="button" class="btn btn-sm btn-outline btn-outline-dashed btn-outline-success btn-active-light-success me-2"
            data-bs-toggle="modal" data-bs-target="#kt_modal_sync_telegram">
              <KTIcon icon-name="arrows-circle" icon-class="fs-2" />
              Đồng bộ All
            </button> -->
            <el-tooltip class="box-item" effect="dark" hide-after="0" content="Thêm mới" placement="top"> 
              <button type="button" class="btn btn-sm fw-bold btn-primary" data-bs-toggle="modal"
                data-bs-target="#kt_modal_new_telegram_group"  @click.passive="handleClick({},'add')">
                <KTIcon icon-name="plus-circle" icon-class="fs-2" />
                Thêm
              </button>
            </el-tooltip>

          </div>
        <!--end::Toolbar-->
        </div>

        <!--begin::Group actions-->
        <div v-show="selectedIds.length !== 0">
          <div class="d-flex justify-content-end align-items-center">
            <div class="fw-bold me-5">
              <span class="me-2">{{ selectedIds.length }}</span>Selected
            </div>
            <el-tooltip class="box-item" effect="dark" hide-after="0" content="Xóa" placement="top">
              <button type="button"  data-bs-target="#kt_modal_delete" data-bs-toggle="modal" class="btn btn-danger  btn-sm">
                <KTIcon icon-name="detele" icon-class="bi bi-trash" :style="{fontSize: '16px' }" />
                Delete Selected
              </button>
            </el-tooltip>
            <!-- <button type="button" class="btn btn-light-danger ms-2">
              Hủy
            </button> -->
          </div>
        </div>
        <!--end::Group actions-->
      </div>
      <!--end::Card toolbar-->
    </div>
    <!--end::Card header-->

    <div class="hand-height-2 shadow-hvover"> 
      <!--begin::Card body-->
      <div class="card-body overflow-y-auto overflow-x-hidden h-100 p-0 m-0 ">
        <KTDatatable @on-sort="sort" @on-items-select="onItemSelect" :data="list" :header="headerConfig" :loading="loading"
          :checkbox-enabled="true" :itemsPerPage="itemsPerPage" :total="totalPage" :currentPage="currentPage" 
          @page-change="handlePage"  @on-items-per-page-change="handlePerPage" @customRow="customRowTable">
          <template v-slot:id="{ row: customer }">{{ customer.id ?? '--' }}</template>
          <template v-slot:name="{ row: customer }">
            <span class="text-dark text-hover-primary ">{{customer.name ?? '--' }}</span>
          </template>
          <template v-slot:date_update="{ row: customer }">{{ formatDate(customer.date_update) }}</template>
          <template v-slot:total_message="{ row: customer }">
            <div class="badge badge-light">{{ customer.total_message ?? 0 }}</div>
          </template>
          <template v-slot:type="{ row: customer }">{{ (customer.type == 1 ? 'DB Leak' : 'Hacker News') ?? '--' }}</template>
          <template v-slot:status="{ row: customer }">
            <KTIcon v-on:click.stop @click.passive="updateStatus(customer)" :icon-name="(customer.status == 0) ? 'toggle-on-circle' : 'toggle-off-circle'" :icon-class="(customer.status == 0) ? 'fs-3x text-success' :'fs-3x text-danger'"/>
          </template>
          <template v-slot:actions="{ row: customer }">
          <el-tooltip class="box-item" effect="dark" hide-after="0" content="Đồng bộ" placement="top">
            <button type="button" class="btn btn-icon btn-bg-light btn-active-color-success btn-sm me-1" :disabled="disabledButton" ref="submitButtonRef" @click.passive="handleSyncItem(customer)">
              <KTIcon icon-name="arrows-circle" icon-class="fs-3" />
            </button>
          </el-tooltip>
          <el-tooltip class="box-item" effect="dark" hide-after="0" content="Chi tiết tin nhắn" placement="top">  
            <button type="button" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1" @click.passive="handleClick(customer, 'detail')" >
              <KTIcon icon-name="eye" icon-class="fs-3" />
            </button>
          </el-tooltip>
          <el-tooltip class="box-item" effect="dark" hide-after="0" content="Chỉnh sửa" placement="top">
            <button type="button" class="btn btn-icon btn-bg-light btn-active-color-warning btn-sm me-1" data-bs-toggle="modal"
              data-bs-target="#kt_modal_new_telegram_group"  @click.passive="handleClick(customer, 'edit')">
              <KTIcon icon-name="pencil" icon-class="fs-3" />
            </button>
          </el-tooltip>
        </template>        
      </KTDatatable>
      </div>
      <!--end::Card body-->
    </div>

  </div>
  <!--end::Card-->

    <!-- modal  -->
    <div class="modal fade" tabindex="-1" id="kt_modal_new_telegram_group"    
    ref="newTargetTelegramModalRef" aria-hidden="true">
    <!--begin::Modal dialog-->
    <div class="modal-dialog modal-dialog-centered mw-650px">
      <!--begin::Modal content-->
      <div class="modal-content">
        <!--begin::Modal header-->
        <div class="modal-header" id="kt_modal_new_telegram_group_header">
          <!--begin::Modal title-->
          <h2>{{ nameType }}</h2>
          <!--end::Modal title-->

          <!--begin::Close-->
          <div
            class="btn btn-sm btn-icon btn-active-color-primary"
            data-bs-dismiss="modal"
          >
            <KTIcon icon-name="cross" icon-class="fs-1" />
          </div>
          <!--end::Close-->
        </div>
        <!--end::Modal header-->

        <!--begin::Form-->
        <VForm
          id="kt_modal_new_telegram_group_form"
          class="form"
          @submit="submit"
          :validation-schema="validationSchema"
        >
          <!--begin::Modal body-->
          <div class="modal-body py-10 px-lg-17">
            <!--begin::Scroll-->
            <div
              class="scroll-y me-n7 pe-7"
              id="kt_modal_new_telegram_group_scroll"
              data-kt-scroll="true"
              data-kt-scroll-activate="{default: false, lg: true}"
              data-kt-scroll-max-height="auto"
              data-kt-scroll-dependencies="#kt_modal_new_telegram_group_header"
              data-kt-scroll-wrappers="#kt_modal_new_telegram_group_scroll"
              data-kt-scroll-offset="300px"
            >
              <!--begin::Input group-->
              <div class="mb-5 fv-row">
                <!--begin::Label-->
                <label class="d-flex align-items-center fs-6 fw-semobold mb-2">
                <span class="required">Tên nhóm Telegram</span>
                <i
                  class="fas fa-exclamation-circle ms-2 fs-7"
                  data-bs-toggle="tooltip"
                  title="Bắt buộc phải nhập"
                ></i>
              </label>
                <!--end::Label-->
                <!--begin::Input-->
                <Field
                  type="text" 
                  class="form-control form-control-solid"
                  placeholder="Nhập nhóm mục tiêu"
                  name="name"
                  v-model="apiData.name"
                />
                <div class="fv-plugins-message-container">
                  <div class="fv-help-block">
                    <ErrorMessage name="name" />
                    <span class="" v-if="errors.name">{{ errors.name[0] }}</span>
                  </div>
                </div>
                <!--end::Input-->
              </div>
              <!--end::Input group-->

               <!--begin::Input group-->
              <div class="d-flex flex-stack mb-8">
                <!--begin::Label-->
                <div class="me-5">
                  <label class="fs-6 fw-semobold"
                    >Trạng thái</label
                  >

                  <div class="fs-7 fw-semobold text-gray-400">
                    Bật trạng thái để có thể đồng bộ hóa Telegram
                  </div>
                </div>
                <!--end::Label-->

                <!--begin::Switch-->
                <label
                  class="form-check form-switch form-check-custom form-check-solid"
                >
                
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :checked="apiData.status"
                    v-model="apiData.status"
                  />
                  <span class="form-check-label fw-semobold text-gray-400">
                    Allowed
                  </span>
                </label>
                <!--end::Switch-->
              </div>
              <!--end::Input group-->
              <!--begin::Input group-->
              <div class="mb-15 fv-row">
                <!--begin::Wrapper-->
                <div class="d-flex flex-stack">
                  <!--begin::Label-->
                  <div class="fw-semobold me-5">
                    <label class="fs-6">Kiểu nhóm</label>

                    <div class="fs-7 text-gray-400">
                      Chọn kiểu cho nhóm Telegram
                    </div>
                  </div>
                  <!--end::Label-->

                  <!--begin::radio-->
                  <div class="d-flex align-items-center">
                    <!--begin::radio-->
                    <label
                      class="form-check form-check-custom form-check-solid me-10"
                    >
                      <input
                        class="form-check-input h-20px w-20px"
                        type="radio"
                        name="type"
                        value="1"
                        v-model="apiData.type"
                        checked
                      />

                      <span class="form-check-label fw-semobold"> DB Leak </span>
                    </label>
                    <!--end::radio-->

                    <!--begin::radio-->
                    <label class="form-check form-check-custom form-check-solid">
                      <input
                        v-model="apiData.type"
                        class="form-check-input h-20px w-20px"
                        type="radio"
                        name="type"
                        value="2"
                      />

                      <span class="form-check-label fw-semobold"> Hacker News </span>
                    </label>
                    <!--end::radio-->
                  </div>
                  <!--end::radio-->
                </div>
                <!--end::Wrapper-->
              </div>
              <!--end::Input group-->
            </div>
            <!--end::Scroll-->
          </div>
          <!--end::Modal body-->

          <!--begin::Modal footer-->
          <div class="modal-footer flex-center">
            <!--begin::Button-->
            <button
              ref="discardButtonRef"
              type="reset"
              id="kt_modal_new_telegram_cancel"
              class="btn btn-sm  btn-light me-3"
            >
              Discard
            </button>
            <!--end::Button-->

            <!--begin::Button-->
            <button
              ref="submitButtonRef"
              type="submit"
              id="kt_modal_new_target_group_submit"
              class="btn btn-sm  btn-primary"
            >
              <span class="indicator-label"> Submit </span>
              <span class="indicator-progress">
                Please wait...
                <span
                  class="spinner-border spinner-border-sm align-middle ms-2"
                ></span>
              </span>
            </button>
            <!--end::Button-->
          </div>
          <!--end::Modal footer-->
        </VForm>
        <!--end::Form-->
      </div>
      <!--end::Modal content-->
    </div>
    <!--end::Modal dialog-->
  </div>

    <!-- modal seting  -->
  <div class="modal fade" tabindex="-1" id="kt_modal_new_setting"    
  ref="newTSetingModalRef" aria-hidden="true">
  <!--begin::Modal dialog-->
  <div class="modal-dialog modal-dialog-centered mw-500px">
  <!--begin::Modal content-->
  <div class="modal-content">
    <!--begin::Modal header-->
    <div class="modal-header" >
      <!--begin::Modal title-->
      <h2>Lập lịch lấy thông tin</h2>
      <!--end::Modal title-->

      <!--begin::Close-->
      <div
        class="btn btn-sm btn-icon btn-active-color-primary"
        data-bs-dismiss="modal"
      >
        <KTIcon icon-name="cross" icon-class="fs-1" />
      </div>
      <!--end::Close-->
    </div>
    <!--end::Modal header-->

    <!--begin::Form-->
    <VForm
      id="kt_modal_new_setting_form"
      class="form"
      @submit="updateSchedule"
    >
      <!--begin::Modal body-->
      <div class="modal-body py-10 px-lg-17">
        <!--begin::Scroll-->
        <div
          class="me-n7 pe-7"
          data-kt-scroll-activate="{default: false, lg: true}"
          data-kt-scroll-max-height="auto"
        >
        <!--begin::Input group-->
        <div class="row g-9 mb-3">
          <label class="required fs-6 fw-semobold">Lần chạy kế tiếp</label>
          <!--begin::Col-->
          <div class="col-md-6 fv-row mt-2">

            <el-form-item prop="next_run">
                <el-date-picker
                  v-model="setingData.next_run"
                  disabled
                  type="date"
                  placeholder="Select a date"
                  :teleported="false"
                  popper-class="override-styles"
                  name="next_run"
                />
              </el-form-item>
          </div>
          <!--end::Col-->

          <!--begin::Col-->
          <div class="col-md-6 fv-row mt-2">
            <!--begin::Input-->
            <div class="position-relative align-items-center">
              <!--begin::Datepicker-->
              <el-form-item prop="time_next_run">
                <el-time-picker
                  v-model="setingData.time_next_run"
                  type="time"
                  placeholder="Select a date"
                  :teleported="false"
                  popper-class="override-styles"
                  name="time_next_run"
                />
              </el-form-item>
              <!--end::Datepicker-->
            </div>
            <!--end::Input-->
          </div>
          <!--end::Col-->
        </div>
        <!--end::Input group-->
          <!--begin::Input group-->
        <div class="d-flex flex-column fv-row">
          <!--begin::Label-->
          <label class="d-flex align-items-center fs-6 fw-semobold mb-2">
            <span class="required">Thời gian giữa các lần chạy (giờ)</span>
            <i
              class="fas fa-exclamation-circle ms-2 fs-7"
              data-bs-toggle="tooltip"
              title="Specify a target name for future usage and reference"
            ></i>
          </label>
          <!--end::Label-->
          <el-input-number v-model="setingData.hour" :min="1" :max="24" />
        </div>
        <!--end::Input group-->
        </div>
        <!--end::Scroll-->
      </div>
      <!--end::Modal body-->

      <!--begin::Modal footer-->
      <div class="modal-footer flex-center">
        <!--begin::Button-->
        <button
          ref="submitButtonRef"
          type="submit"
          id="kt_modal_new_target_group_submit"
          class="btn btn-sm  btn-primary"
            :disabled="disabledButton"
        >
          <span class="indicator-label"> Submit </span>
          <span class="indicator-progress">
            Please wait...
            <span
              class="spinner-border spinner-border-sm align-middle ms-2"
            ></span>
          </span>
        </button>
        <!--end::Button-->
      </div>
      <!--end::Modal footer-->
    </VForm>
    <!--end::Form-->
  </div>
  <!--end::Modal content-->
  </div>
  <!--end::Modal dialog-->
  </div>

  <!-- modal delete  -->
  <div class="modal fade" tabindex="-1" id="kt_modal_delete"    
  ref="ModalDelete" aria-hidden="true">
  <!--begin::Modal dialog-->
  <div class="modal-dialog modal-dialog-centered">
  <!--begin::Modal content-->
  <div class="modal-content">

    <div class="modal-header">
      <h5 class="modal-title">Xác nhận xóa nhóm</h5>

      <!--begin::Close-->
      <div
        class="btn btn-icon btn-sm btn-active-light-primary ms-2"
        data-bs-dismiss="modal"
        aria-label="Close"
      >
        <span class="svg-icon svg-icon-2x"></span>
      </div>
      <!--end::Close-->
    </div>
    <!--begin::Form-->
    <div class="modal-body">
      <p>Bạn có chắc chắn muốn xóa <span class="fw-bold">{{ selectedIds.length }} </span> bản ghi này không?.</p>
    </div>
    <!--end::Form-->
    <div class="modal-footer">
      <button
        type="button"
        class="btn btn-light"
        data-bs-dismiss="modal"
      >
        Hủy bỏ
      </button>
      <button type="button" class="btn btn-primary" @click.passive="deleteFewSubscriptions()">
        Đồng ý
      </button>
    </div>
  </div>
  <!--end::Modal content-->
  </div>
  <!--end::Modal dialog-->
  </div>

  <!-- modal detail  -->
  <div class="modal fade" tabindex="-1" 
    ref="ModalDetail" aria-hidden="true" id="kt_modal_detail">
    <!--begin::Modal dialog-->
    <div class="modal-dialog modal-dialog-centered">
      <!--begin::Modal content-->
      <div class="modal-content">
        <!--begin::Form-->
        <div class="modal-body">
          <!--begin::Card-->
          <div class="card card-flush pt-3 mb-5 mb-xl-10">
              <!--begin::Card header-->
              <div class="card-header mb-5">
                <!--begin::Card title-->
                <div class="card-title">
                  <div class="card-title">
                    <h1 class="fw-bold">{{ detailData.name }}</h1>
                  </div>
                </div>
                <!--begin::Card toolbar-->

                <!--end::Card toolbar-->
              </div>
              <!--end::Card header-->

              <!--begin::Card body-->
              <div class="card-body py-0">
                <!--begin::Section-->
                <div class="mb-10">
                  <!--begin::Title-->
                  <h6>Thông tin chi tiết:</h6>
                  <!--end::Title-->

                  <!--begin::Details-->
                  <div class="d-flex flex-wrap py-5">
                    <!--begin::Row-->
                    <div class="me-5">
                      <!--begin::Details-->
                      <table class="table fs-6 fw-semobold gs-0 gy-2 gx-2 m-0">

                        <!--begin::Row-->
                        <tr class="d-flex align-items-center">
                          <td class="text-gray-400 w-200px d-inline-block">Trạng thái:</td>
                          <td class="text-gray-800 text-dark fs-5 fw-bold">
                           <div class="d-flex align-items-center p-0 m-0">
                            <KTIcon :icon-name="(detailData.status == '0') ? 'toggle-on-circle' : 'toggle-off-circle'" :icon-class="(detailData.status == '0') ? 'fs-2hx text-success' :'fs-2hx text-danger'"/>
                            <span class="ms-2">{{ (detailData.status == '0') ? ' Hoạt động' : ' Không hoạt động' }}</span>
                           </div>
                          </td>
                        </tr>
                        <!--end::Row-->

                        <!--begin::Row-->
                        <tr class="d-flex align-items-center">
                          <td class="text-gray-400 w-200px d-inline-block">kiểu:</td>
                          <td class="text-gray-800 " >{{ (detailData.type  == '1' ? 'DB Leak' : 'Hacker News') }}</td>
                        </tr>
                        <!--end::Row-->

                        <!--begin::Row-->
                        <tr class="d-flex align-items-center">
                          <td class="text-gray-400 w-200px d-inline-block">Thời gian thêm mới:</td>
                          <td class="text-gray-800">{{ formatDate(detailData.created_at) }}</td>
                        </tr>
                        <!--end::Row-->
                        
                        <!--begin::Row-->
                        <tr class="d-flex align-items-center">
                          <td class="text-gray-400 w-200px d-inline-block">Thời gian cập nhật cuối:</td>
                          <td class="text-gray-800">{{ formatDate(detailData.date_update) }}</td>
                        </tr>
                        <!--end::Row-->

                      </table>
                      <!--end::Details-->
                    </div>
                    <!--end::Row-->

                  </div>
                  <!--end::Row-->
                </div>
                <!--end::Section-->
              </div>
              <!--end::Card body-->
            </div>
            <!--end::Card-->
        </div>
        <!--end::Form-->
        <div class="modal-footer">
          <button type="button" class="btn btn-sm  btn-primary" data-bs-dismiss="modal">
            Quay lại
          </button>
        </div>
      </div>
      <!--end::Modal content-->
    </div>
    <!--end::Modal dialog-->
  </div>
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref, onMounted, reactive, watch , shallowRef} from "vue";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import ApiService from "@/core/services/ApiService";

// validate
import { hideModal } from "@/core/helpers/dom";
import { ErrorMessage, Field, Form  as VForm } from "vee-validate";
import { vue3Debounce } from 'vue-debounce';

import Swal from "sweetalert2/dist/sweetalert2.js";
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
dayjs.locale('vi');
import Fillter from "@/views/apps/telegrams/filterGroup.vue";
import CodeHighlighter from "@/components/highlighters/CodeHighlighter.vue";
import {Modal} from "bootstrap";
import type { Sort } from "@/components/kt-datatable/table-partials/models";
import * as Yup from "yup";
import {useToast} from 'vue-toast-notification';
import { useRouter, useRoute } from 'vue-router';

// import useCurrencyInput from "vue-currency-input";

interface APIData {
  name: string;
  type: string;
  status: boolean;
}

export default defineComponent({
  name: "kt-scans-list",

  components: {
    KTDatatable,
    ErrorMessage,
    Field,
    VForm,
    Fillter,
    CodeHighlighter,
  },
  directives: {
      debounce: vue3Debounce({ lock: true })
  },
  setup() {
    const list = ref<object | any>([])
    const loading = ref<boolean>(false)
    const totalPage = ref<number>(0);
    const currentPage = ref<number>(1);
    const itemsPerPage = ref<number>(20);
    const query = ref<String>('');
    const route = useRoute();
    const filterType = ref<null | string | any>('');
    const filterStatus = ref<String | null>(''); 
    const detailData = reactive({
      id: '',
      status: '',
      name: '',
      type: '',
      date_update: '',
      total_message: '',
      created_at: '',
      modified_at: '',
    });
    const headerConfig = ref([
      {
        columnName: "ID",
        columnLabel: "id",
        sortEnabled: true,
      },
      {
        columnName: "Group",
        columnLabel: "name",
        columnWidth: 200,
      },
      {
        columnName: "Thời gian",
        columnLabel: "date_update",
        sortEnabled: true,
      },
      {
        columnName: "Tổng",
        columnLabel: "total_message",
        sortEnabled: true,
      },
      {
        columnName: "Kiểu",
        columnLabel: "type",
        columnWidth: 100,
      },
      {
        columnName: "Trạng thái",
        columnLabel: "status",
        columnWidth: 90,
      },
      {
        columnName: "Hành động",
        columnLabel: "actions",
        columnWidth: 150,
      },
    ]);

    // config input
    // const options = reactive({
    //   currency: 'nu',
    //   valueRange: {
    //     min: 1,
    //     max: 24,
    //   },
    //   hideCurrencySymbolOnFocus: true,
    //   hideGroupingSeparatorOnFocus: true,
    //   hideNegligibleDecimalDigitsOnFocus: true,
    //   autoDecimalDigits: false,
    //   useGrouping: false,
    //   accountingSign: false
    // })

    // const { inputRef, formattedValue } = useCurrencyInput(
    //   options
    // );


    // page
    const handlePage = (page: number) => {
      currentPage.value = page ?? 1;
      getData();
    };

    const handlePerPage = (itemsPage: number) => {
      itemsPerPage.value = itemsPage ?? 20;
      getData();
    };

    // getdata
    const getData = () => {
      loading.value = true;
      setTimeout(() => loading.value = false ,500)
      return ApiService.get(`/telegram/group/index?page=${currentPage.value}&page_size=${itemsPerPage.value}&status=${filterStatus.value}&type=${filterType.value}&search=${query.value}&orderingID=${sortId.value}&orderingDate=${sortDate.value}&orderingTotal=${sortTotal.value}`)
        .then(({ data }) => {
          list.value = data.results
          totalPage.value = data.count
        })
        .catch(({ response }) => {
          notification(response.data.detail, 'error', 'Có lỗi xảy ra')
        });
    }

    // sắp sếp
    const sortId = ref<string>('');
    const sortDate = ref<string>('');
    const sortTotal = ref<string>('');
    const sort = (sort: Sort) => {
      if(sort.label == 'id'){
        sortId.value = (sort.order === "asc") ? `${sort.label}` : `-${sort.label}` ;
        sortTotal.value = '';
        sortDate.value = '';
      }else if(sort.label == 'date_update'){
        sortDate.value = (sort.order === "asc") ? `${sort.label}` : `-${sort.label}` ;
        sortId.value = '';
        sortTotal.value = '';
      }else if(sort.label == 'total_message'){
        sortTotal.value = (sort.order === "asc") ? `${sort.label}` : `-${sort.label}` ;
        sortId.value = '';
        sortDate.value = '';
      }else{
        notification('Có lỗi xayt ra với sắp sếp', 'error', 'Có lỗi xảy ra')
      }
      getData();
    };

    const selectedIds = ref<Array<number>>([]);
    const deleteFewSubscriptions = () => {
      deleteSubscription(selectedIds.value);
    };

    // xóa
    const ModalDelete = ref<null | HTMLElement>(null);
    const deleteSubscription = (ids: Array<number>) => {
      if(ids){
        return ApiService.delete(`telegram/group/multi-delete?id=${ids.join()}`)
          .then(({ data }) => {
            notification(data.detail, 'success', 'Xóa thành công')
            selectedIds.value.length = 0;
            getData();
          })
          .catch(({ response }) => {
            notification(response.data.detail, 'error', 'Có lỗi xảy ra')
          });
      }
    };

    const customRowTable = (detail: any) => {
      if(detail){
        detailData.id = detail.id
        detailData.modified_at = detail.modified_at
        detailData.created_at = detail.created_at
        detailData.total_message = detail.total_message
        detailData.date_update = detail.date_update
        detailData.type = detail.type
        detailData.name = detail.name
        detailData.status = detail.status
        const modal = new Modal(
          document.getElementById("kt_modal_detail") as Element
        );
        modal.show();
      }else{
        notification('', 'error', 'Có lỗi xảy ra')
      }
    };
    
    const onItemSelect = (selectedItems: Array<number>) => {
      selectedIds.value = selectedItems;

    };

    const notification = (values: string, icon: string, more: string) => {
      Swal.fire({
        text: values ?? more,
        icon: icon,
        buttonsStyling: false,
        confirmButtonText: "Ok, got it!",
        heightAuto: false,
        customClass: {
          confirmButton: "btn btn-primary",
        },
      }).then(() => {
        hideModal( ModalDelete.value);
        hideModal( newTargetTelegramModalRef.value);
        hideModal( newTSetingModalRef.value);
      });
    };

    const formatDate = (date: string) => {
      return date?date:"--:--"
    };

    const handleFilter = (data: any) => {
      if(data){
        query.value = data.query;
        filterType.value = data.type;
        filterStatus.value = data.status;
        currentPage.value = 1;
        getData();
      }else{
        notification('Có lỗi với filter', 'error', 'Có lỗi xảy ra')
      }

    };

    // validation
    const submitButtonRef = ref<null | HTMLButtonElement>(null);
    const modalRef = ref<null | HTMLElement>(null);
    const newTargetTelegramModalRef = ref<null | HTMLElement>(null);

    const validationSchema = Yup.object().shape({
      name: Yup.string()
      .min(3, 'Tối thiểu 3 kí tự')
      .required('Vui lòng nhập tên nhóm')
    });

    // add - edit 
    const typeModal = ref<String>('');
    const errors = reactive({name: ''});
    const nameType = ref<string>('');
    const apiData = ref<APIData>({
      name: '',
      type: '1',
      status: true,
    });
    const id = ref<number>(0);
    const discardButtonRef = ref<HTMLElement | null>(null);
    const router = useRouter();

    const handleClick = (data: object | any, type: String) => {
      typeModal.value = type
      errors.name = ''
      if(Object.keys(data).length != 0 && type === 'edit'){
        nameType.value = "Sửa nhóm nhóm Telegram"
        apiData.value.name = data.name;
        apiData.value.type = data.type;
        apiData.value.status = (data.status == 0) ? true : false;
        id.value = data.id;
      }else if(data.id && type === 'detail'){
        router.push({ name: 'telegram-detail', params: { id: data.id } });
      }else{
        nameType.value = "Thêm Mới nhóm Telegram"
        if (discardButtonRef.value !== null) {
          discardButtonRef.value.click();
        }
        // resetData();
      }
    };

    // sync
    const idSync = ref<number>(0);
    const disabledButton = ref<boolean>(false);
    const toastr = useToast();

    const handleSyncItem = (data: object | any) => {
      if(data){
        idSync.value = data.id
        getSyncItem();
        if(submitButtonRef.value){
          disabledButton.value = true
          submitButtonRef.value.disabled = true;
          submitButtonRef.value.setAttribute("data-kt-indicator", "on");
          setTimeout(() => {
            if(submitButtonRef.value){
              disabledButton.value = false
              submitButtonRef.value.disabled = false;
              submitButtonRef.value?.removeAttribute("data-kt-indicator");
            }
          }, 1000)
        }
      }
    };

    const handleSyncAll = () => {
      Swal.fire({
        text: 'Bạn có chắc muốn đồng bộ hóa tất cả nhóm Telegram không?',
        icon: 'info',
        buttonsStyling: false,
        confirmButtonText: "Xác nhận",
        cancelButtonText: "Hủy bỏ",
        showCancelButton: true,
        customClass: {
          confirmButton: "btn btn-sm btn-primary",
          cancelButton: "btn btn-sm btn-danger ",
        },
      }).then((result: any) => {
        if (result.isConfirmed) {
          getSyncAll();
        }
      });
    };

    const getSyncItem = async () => {
      return ApiService.post(`telegram/sync-data/${idSync.value}/group`,0)
        .then(({ data }) => {
          toastr.success(data.detail ?? 'Đang đồng bộ hóa tin nhắn' , {position: 'top'});
          getData();
        })
        .catch(({ response }) => {
          toastr.error(response.data.detail ?? 'Có lỗi xảy ra' , {position: 'top'});
        });
    };

    const getSyncAll = async () => {
      return ApiService.post('telegram/sync-data', '')
        .then(({ data }) => {
          toastr.success(data.detail ?? 'Đang đồng bộ hóa tin nhắn' , {position: 'top'});
          getData();
        })
        .catch(({ response }) => {
          toastr.error(response.data.detail ?? 'Có lỗi xảy ra' , {position: 'top'});
        });
    };

    // setting
    const newTSetingModalRef = ref<null | HTMLElement>(null);
    const dataModal = ref<any>(null);
    const ModalSetting = ref<string | HTMLElement>('#kt_modal_new_setting');
    const initialData  = {
      next_run: '',
      time_next_run: '',
      hour: '',
    };
    const setingData = ref<object | string | any>({ ...initialData });
    const prevData = shallowRef<object | string | any>({ ...initialData });

    const handleSubmitSetting = () => {
      const modal = new Modal(ModalSetting.value);
      modal.show(); 
      dataModal.value = modal
      if (setingData.next_run !== prevData.value.next_run || setingData.time_next_run !== prevData.value.time_next_run || setingData.hour !== prevData.value.hour) {
        setingData.value = { ...prevData.value}
      }
    };

    const updateSchedule = async () => {
      const next_run = new Date(setingData.value.next_run)
      const time_next_run = new Date(setingData.value.time_next_run)

      const year = next_run.getFullYear(); // Get the year (e.g., 2023)
      const month = next_run.getMonth() + 1; // Get the month (0-11, so we add 1 to get 1-12)
      const day = next_run.getDate(); // Get the day of the month (1-31)
      // Format the values as strings with leading zeros if necessary
      const formattedYear = year.toString().padStart(4, '0');
      const formattedMonth = month.toString().padStart(2, '0');
      const formattedDay = day.toString().padStart(2, '0');

      const hours = time_next_run.getHours(); // Get the hours (0-23)
      const minutes = time_next_run.getMinutes(); // Get the minutes (0-59)
      const seconds = time_next_run.getSeconds(); // Get the seconds (0-59)
      // Format the values as strings with leading zeros if necessary
      const formattedHours = hours.toString().padStart(2, '0');
      const formattedMinutes = minutes.toString().padStart(2, '0');
      const formattedSeconds = seconds.toString().padStart(2, '0');

      let formData = {
        hour: setingData.value.hour,
        next_run: `${formattedDay}-${formattedMonth}-${formattedYear} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`
      }
      return ApiService.post(`/telegram/schedule`,formData)
        .then(({ data }) => {
          hideModal( newTSetingModalRef.value);
          if(disabledButton.value){
            disabledButton.value = true
            setTimeout(() => {
                disabledButton.value = false
              }, 1000)
          }
          // Cập nhật prevData với giá trị mới của setingData
          prevData.value = { ...setingData.value };
          notification(data, 'success', 'Đang đồng bộ hóa tin nhắn')
          getData();
        })
        .catch(({ response }) => {
          toastr.error(response.data.detail ?? 'Có lỗi xảy ra' , {position: 'top-right'});
        });
    };

    const getSetting = async () => {
      return ApiService.get(`/telegram/schedule/show`)
        .then(({ data }) => {
          setingData.value = {
            next_run: data.next_run,
            time_next_run: data.next_run,
            hour: data.hour
          };
          prevData.value = {
            next_run:data.next_run,
            time_next_run: data.next_run,
            hour: data.hour
          };
        })
        .catch(({ response }) => {
          notification(response.data.detail, 'error', 'Có lỗi xảy ra')
        });
    };

    // submit data
    const submit = async () => {
      if (!submitButtonRef.value) {
        return;
      }
      let formData = {
        name: apiData.value.name,
        type: apiData.value.type,
        status: (apiData.value.status ==  true) ? 0 : 1 
      }
      if(typeModal.value == 'add'){

        return ApiService.post("/telegram/group/create", formData)
          .then(({ data }) => {
            if(submitButtonRef.value){
            //Disable button
            submitButtonRef.value.disabled = true;
            // Activate indicator
            submitButtonRef.value.setAttribute("data-kt-indicator", "on");
            notification(data.detail,'success','Thêm mới thành công')
            getData();
            setTimeout(() => {
              if (submitButtonRef.value) {
                submitButtonRef.value.disabled = false;
                submitButtonRef.value?.removeAttribute("data-kt-indicator");
              }
            }, 1000);
            }
          })
          .catch(({ response }) => {
            if(response.data){
              errors.name = response.data.name;
            }else{
              notification(response.data.detail, 'error', 'Có lỗi xảy ra')
            }
          });
      }else{
        return ApiService.put(`/telegram/group/${id.value}/update`, formData)
          .then(({ data }) => {
            if(submitButtonRef.value){
            //Disable button
            submitButtonRef.value.disabled = true;
            // Activate indicator
            submitButtonRef.value.setAttribute("data-kt-indicator", "on");
            notification(data.detail, 'success', 'Sửa mới thành công')
            getData();
            setTimeout(() => {
              if (submitButtonRef.value) {
                submitButtonRef.value.disabled = false;
                submitButtonRef.value?.removeAttribute("data-kt-indicator");
              }
            }, 1000);
            }
          })
          .catch(({ response }) => {
            if(response.data){
              errors.name = response.data.name;
            }else{
              notification(response.data.detail, 'error', 'Có lỗi xảy ra')
            }
          });
      }
    };

    // upadte status 
    const updateStatus = async (data : object | any) => {
      let formData = {
        name: data.name,
        type: data.type,
        status: (data.status ==  1) ? 0 : 1 
      }
      return ApiService.put(`/telegram/group/${data.id}/update`, formData)
        .then(({ data }) => {
          toastr.success(data.detail ?? 'Thay đổi trạng thái thành công' , {position: 'top'});
          getData();
        })
        .catch(({ response }) => {
          toastr.error(response.data.detail ?? 'Có lỗi xảy ra' , {position: 'top'});
        });
    };

    onMounted(() => {
      getData();
      getSetting();
    });

    return {
      getData,
      list,
      headerConfig,
      onItemSelect,
      selectedIds,
      deleteFewSubscriptions,
      deleteSubscription,
      getAssetPath,
      sort,

      // crud
      ModalDelete,
      handleClick,
      nameType,
      apiData,
      submit,
      validationSchema,
      modalRef,
      newTargetTelegramModalRef,
      errors,
      submitButtonRef,
      discardButtonRef,

      // detials
      customRowTable,

      // page 
      itemsPerPage,
      totalPage,
      currentPage,
      handlePage,
      handlePerPage,

      // search query 
      query,

      // sử lý dữ liệu
      formatDate,

      // filter
      handleFilter,
      loading,

      // detail
      detailData,

      // sync
      handleSyncItem,
      handleSyncAll,
      getSyncAll,
      getSyncItem,
      disabledButton,

      // setting
      handleSubmitSetting,
      setingData,
      getSetting,
      prevData,
      newTSetingModalRef,
      ModalSetting,
      updateSchedule,

      // update stataus
      updateStatus,
      // formattedValue,
      // inputRef,
    };
  },
});
</script>