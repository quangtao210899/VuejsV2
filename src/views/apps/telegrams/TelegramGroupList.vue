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
        <div v-if="selectedIds.length === 0" class="d-flex justify-content-end " data-kt-subscription-table-toolbar="base">
          <!--begin::Export-->
          <!-- <button type="button" class="btn btn-light-primary me-3" data-bs-toggle="modal"
            data-bs-target="#kt_subscriptions_export_modal">
            <KTIcon icon-name="exit-up" icon-class="fs-2" />
            Export
          </button> -->
          <!--end::Export-->
          <!-- <div class="position-absolute end-0" style="top: -60px;">  -->
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

          <Fillter @filterData="handleFilter"></Fillter>
          <!--begin::Add subscription-->
          <!--end::Add subscription-->
          <button type="button" class="btn btn-sm fw-bold btn-primary me-2" data-bs-toggle="modal"
            data-bs-target="#kt_modal_new_target_group"  @click.passive="handleClick({},'setting')">
            <KTIcon icon-name="setting-2" icon-class="fs-2" />
            Cấu hình
          </button>

          <button type="button" class="btn btn-sm btn-outline btn-outline-dashed btn-outline-primary btn-active-light-primary me-2" data-bs-toggle="modal"
            data-bs-target="#kt_modal_new_target_group"  @click.passive="handleClick({},'sync')">
            <KTIcon icon-name="arrows-circle" icon-class="fs-2" />
            Đồng bộ All
          </button>

          <button type="button" class="btn btn-sm fw-bold btn-primary" data-bs-toggle="modal"
            data-bs-target="#kt_modal_new_telegram_group"  @click.passive="handleClick({},'add')">
            <KTIcon icon-name="plus" icon-class="fs-2" />
            Thêm
          </button>

        </div>
        <!--end::Toolbar-->

        <!--begin::Group actions-->
        <div v-else class="d-flex justify-content-end align-items-center">
          <div class="fw-bold me-5">
            <span class="me-2">{{ selectedIds.length }}</span>Selected
          </div>
          <button type="button"  data-bs-target="#kt_modal_delete" data-bs-toggle="modal" class="btn btn-danger  btn-sm">
            <KTIcon icon-name="detele" icon-class="bi bi-trash" :style="{fontSize: '16px' }" />
            Delete Selected
          </button>
          <!-- <button type="button" class="btn btn-light-danger ms-2">
            Hủy
          </button> -->
        </div>
        <!--end::Group actions-->
      </div>
      <!--end::Card toolbar-->
    </div>
    <!--end::Card header-->

    <div class="hand-height-2 shadow-hvover">
      <!--begin::Card body-->
      <div class="card-body pt-0 overflow-scroll h-100 ">
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
            <KTIcon :icon-name="(customer.status == 0) ? 'toggle-on-circle' : 'toggle-off-circle'" :icon-class="(customer.status == 0) ? 'fs-2hx text-success' :'fs-2hx text-danger'"/>
          </template>
          <template v-slot:actions="{ row: customer }">
          <button type="button" class="btn btn-icon btn-bg-light btn-active-color-success btn-sm me-1" data-bs-toggle="modal"
            data-bs-target="#kt_modal_new_target_group"  @click="handleClick(customer, 'edit')">
            <KTIcon icon-name="arrows-circle" icon-class="fs-3" />
          </button>
          <button type="button" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1" data-bs-toggle="modal"
            data-bs-target="#kt_modal_new_target_group"  @click="handleClick(customer, 'view')">
            <KTIcon icon-name="eye" icon-class="fs-3" />
          </button>
          <button type="button" class="btn btn-icon btn-bg-light btn-active-color-warning btn-sm me-1" data-bs-toggle="modal"
            data-bs-target="#kt_modal_new_target_group"  @click="handleClick(customer, 'edit')">
            <KTIcon icon-name="pencil" icon-class="fs-3" />
          </button>
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
                    checked
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
                      Allow Notifications by Phone or Email
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

  <!-- modal delete  -->
  <div class="modal fade" tabindex="-1" id="kt_modal_delete"    
    ref="ModalDelete" aria-hidden="true">
    <!--begin::Modal dialog-->
    <div class="modal-dialog modal-dialog-centered">
      <!--begin::Modal content-->
      <div class="modal-content">

        <div class="modal-header">
          <h5 class="modal-title">Xác nhận xóa recon</h5>

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
          <p>Bạn có chắc chắn muốn xóa <span v-if="selectedIds.length > 0" class="fw-bold">{{ selectedIds.length }} </span> bản ghi này không?.</p>
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
                  <div class="d-flex align-items-center">
                    <!--begin::Symbol-->
                    <div class="symbol symbol-50px me-5">
                      <span class="symbol-label bg-light-success">
                        <KTIcon icon-name="user" icon-class="text-success fs-2x"/>
                      </span>
                    </div>
                    <!--end::Symbol-->
                    <!--begin::Text-->
                    <div class="d-flex flex-column">
                      <span class="text-dark text-hover-primary fs-4 fw-bold">{{detailData.username ?? '--' }}</span>
                      <span class="text-muted fw-semobold">{{ detailData.phone ?? '--' }}</span>
                    </div>
                    <!--end::Text-->
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
                        <tr>
                          <td class="text-gray-400 w-80px d-inline-block">Tên nhóm:</td>
                          <td class="text-gray-800 text-dark fs-5 fw-bold">{{ detailData.group_name ?? '--' }}</td>
                        </tr>
                        <!--end::Row-->

                        <!--begin::Row-->
                        <tr>
                          <td class="text-gray-400 w-80px d-inline-block">Nội dung:</td>
                          <td class="text-gray-800 " >{{ detailData.text ?? '--' }}</td>
                        </tr>
                        <!--end::Row-->

                        <!--begin::Row-->
                          <tr>
                          <td class="text-gray-400 w-80px d-inline-block">Thời gian:</td>
                          <td class="text-gray-800">{{ formatDate(detailData.date) }}</td>
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
import { defineComponent, ref, onMounted, reactive } from "vue";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import ApiService from "@/core/services/ApiService";

// validate
import { hideModal } from "@/core/helpers/dom";
import { ErrorMessage, Field, Form  as VForm } from "vee-validate";
import { vue3Debounce } from 'vue-debounce';

import Swal from "sweetalert2/dist/sweetalert2.js";
import dayjs from 'dayjs';
import Fillter from "@/views/apps/telegrams/filterGroup.vue";
import CodeHighlighter from "@/components/highlighters/CodeHighlighter.vue";
import {Modal} from "bootstrap";
import type { Sort } from "@/components/kt-datatable/table-partials/models";
import * as Yup from "yup";

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
    const filterType = ref<String | null>('');
    const filterStatus = ref<String | null>('');
    const detailData = reactive({
      id: '',
      group_name: '',
      username: '',
      phone: '',
      text: '',
      date: '',
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


    const handlePage = (page: number) => {
      currentPage.value = page ?? 1;
      getData();
    };

    const handlePerPage = (itemsPage: number) => {
      itemsPerPage.value = itemsPage ?? 20;
      getData();
    };

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

    const sortId = ref<string>('');
    const sortDate = ref<string>('');
    const sortTotal = ref<string>('');
    const sort = (sort: Sort) => {
      console.log(sort)
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

    const ModalDelete = ref<null | HTMLElement>(null);
    const deleteSubscription = (ids: Array<number>) => {
      console.log(ids)
      if(ids){
        return ApiService.delete(`telegram/group/${ids}/delete`)
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
      console.log(detail)
      if(detail){
        detailData.id = detail.id
        detailData.username = detail.username
        detailData.date = detail.date
        detailData.text = detail.text
        detailData.phone = detail.phone
        detailData.group_name = detail.group_name
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
      });
    };

    const formatDate = (date: string) => {
      if (date === "false" || date === "null") {
          return '--:--';
      }
      const dateFormat = 'DD/MM/YYYY HH:mm:ss';
      return dayjs(date).format(dateFormat)
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
      .required('Vui lòng nhập tên')
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

    const handleClick = (data: object | any, type: String) => {
      typeModal.value = type
      errors.name = ''
      if(Object.keys(data).length != 0 && type === 'edit'){
        nameType.value = "Sửa nhóm nhóm Telegram"
        apiData.value.name = data.name;
        apiData.value.type = data.type;
        apiData.value.status = data.status;
        id.value = data.id;
      }else{
        nameType.value = "Thêm Mới nhóm Telegram"
        if (discardButtonRef.value !== null) {
          discardButtonRef.value.click();
        }
        // resetData();
      }
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
      console.log(formData)

      if(typeModal.value == 'add'){
        console.log(formData)

        return ApiService.post("/telegram/group/create", formData)
          .then(({ data }) => {
            if(submitButtonRef.value){
            //Disable button
            submitButtonRef.value.disabled = true;
            // Activate indicator
            submitButtonRef.value.setAttribute("data-kt-indicator", "on");
            setTimeout(() => {
              if (submitButtonRef.value) {
                submitButtonRef.value.disabled = false;
                submitButtonRef.value?.removeAttribute("data-kt-indicator");
                notification(data.detail,'success','Thêm mới thành công')
                getData();
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
            setTimeout(() => {
              if (submitButtonRef.value) {
                submitButtonRef.value.disabled = false;
                submitButtonRef.value?.removeAttribute("data-kt-indicator");
                notification(data.detail, 'success', 'Sửa mới thành công')
                getData();
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

    onMounted(() => {
      getData();
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
    };
  },
});
</script>