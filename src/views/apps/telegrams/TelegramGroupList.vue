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

          <button type="button" class="btn btn-sm fw-bold btn-primary" data-bs-toggle="modal"
            data-bs-target="#kt_modal_new_target_group"  @click.passive="handleClick({},'add')">
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
        <KTDatatable @on-items-select="onItemSelect" :data="list" :header="headerConfig" :loading="loading"
          :checkbox-enabled="true" :itemsPerPage="itemsPerPage" :total="totalPage" :currentPage="currentPage" 
          @page-change="handlePage"  @on-items-per-page-change="handlePerPage" @customRow="customRowTable">
          <template v-slot:id="{ row: customer }">{{ customer.id ?? '--' }}</template>
          <template v-slot:name="{ row: customer }">
            <span class="text-dark text-hover-primary fw-bold">{{customer.name ?? '--' }}</span>
          </template>
          <template v-slot:date_update="{ row: customer }">{{ formatDate(customer.date_update) }}</template>
          <template v-slot:total_message="{ row: customer }">
            <div class="badge badge-light">{{ customer.total_message ?? 0 }}</div>
          </template>
          <template v-slot:type="{ row: customer }">{{ (customer.type == 1 ? 'DB Leak' : 'Hacker News') ?? '--' }}</template>
          <template v-slot:status="{ row: customer }">{{ customer.status ?? '--' }}</template>
          <template v-slot:actions="{ row: customer }">
          <button type="button" class="btn btn-icon btn-bg-light btn-active-color-warning btn-sm me-1" data-bs-toggle="modal"
            data-bs-target="#kt_modal_new_target_group"  @click="handleClick(customer, 'edit')">
            <KTIcon icon-name="pencil" icon-class="fs-3" />
          </button>
          <button type="button" class="btn btn-icon btn-bg-light btn-active-color-warning btn-sm me-1" data-bs-toggle="modal"
            data-bs-target="#kt_modal_new_target_group"  @click="handleClick(customer, 'edit')">
            <KTIcon icon-name="pencil" icon-class="fs-3" />
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
import Fillter from "@/views/apps/telegrams/filters.vue";
import CodeHighlighter from "@/components/highlighters/CodeHighlighter.vue";
import {Modal} from "bootstrap";

interface APIData {
  title: string;
  description: string;
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
    const group_type = ref<String | null>('');
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
      },
      {
        columnName: "Group",
        columnLabel: "name",
        columnWidth: 200,
      },
      {
        columnName: "Thời gian đồng bộ",
        columnLabel: "date_update",
      },
      {
        columnName: "Tổng",
        columnLabel: "total_message",
      },
      {
        columnName: "Kiểu",
        columnLabel: "type",
        columnWidth: 100,
      },
      {
        columnName: "Trạng thái",
        columnLabel: "status",
      },
      {
        columnName: "Actions",
        columnLabel: "actions",
        columnWidth: 180,
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
      return ApiService.get(`/telegram/group/index?page=${currentPage.value}&page_size=${itemsPerPage.value}&group_type=${group_type.value}&search=${query.value}`)
        .then(({ data }) => {
          list.value = data.results
          totalPage.value = data.count
        })
        .catch(({ response }) => {
          notification(response.data.detail, 'error', 'Có lỗi xảy ra')
        });
    }

    const selectedIds = ref<Array<number>>([]);
    const deleteFewSubscriptions = () => {
      deleteSubscription(selectedIds.value);
    };

    const ModalDelete = ref<null | HTMLElement>(null);
    const deleteSubscription = (ids: Array<number>) => {
      if(ids){
        return ApiService.delete(`telegram/message/multi-delete?id=${ids}`)
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
        // hideModal( ModalConfirm.value);
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
        group_type.value = data.type;
        currentPage.value = 1;
        getData();
      }else{
        notification('Có lỗi với filter', 'error', 'Có lỗi xảy ra')
      }

    };

    // add - edit 
    const typeModal = ref<String>('');
    const errors = reactive({title: ''});
    const nameType = ref<string>('');
      const apiData = ref<APIData>({
      title: '',
      description: '',
    });
    const id = ref<number>(0);
    const discardButtonRef = ref<HTMLElement | null>(null);
    const handleClick = (data: object | any, type: String) => {
      typeModal.value = type
      errors.title = ''
      if(Object.keys(data).length != 0 && type === 'edit'){
        nameType.value = "Sửa nhóm mục tiêu"
        apiData.value.title = data.title;
        apiData.value.description = data.description;
        id.value = data.id;
      }else{
        nameType.value = "Thêm Mới nhóm mục tiêu"
        if (discardButtonRef.value !== null) {
          discardButtonRef.value.click();
        }
        // resetData();
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

      // crud
      ModalDelete,
      handleClick,

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