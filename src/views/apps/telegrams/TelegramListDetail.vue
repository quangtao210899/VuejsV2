<template>
  <!--begin::Card-->
  <div class="card h-100 d-block">
    <!--begin::Card header-->
    <div class="card-header border-0 pt-10 pt-sm-10 pt-lg-6 position-absolute end-0 pe-1  " style="top: -80px;">
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
          <div class="d-flex justify-content-end " data-kt-subscription-table-toolbar="base">
            <!--begin::Export-->
            <!-- <button type="button" class="btn btn-light-primary me-3" data-bs-toggle="modal"
              data-bs-target="#kt_subscriptions_export_modal">
              <KTIcon icon-name="exit-up" icon-class="fs-2" />
              Export
            </button> -->
            <!--end::Export-->
            <!-- <div class="position-absolute end-0" style="top: -60px;">  -->
            <el-tooltip class="box-item" effect="dark" hide-after="0" content="Tìm kiếm" placement="top">
              <button type="button" class="btn btn-sm fw-bold bg-body btn-color-gray-700 btn-active-color-primary me-2"
                data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end" data-kt-menu-flip="top-end">
                <KTIcon icon-name="filter" icon-class="fs-2" />
                Filter
              </button>

            </el-tooltip>
            <Fillter @filterData="handleFilter"></Fillter>
            <!--begin::Add subscription-->
            <!--end::Add subscription-->
            <!-- 
            <button type="button" class="btn btn-sm fw-bold btn-primary" data-bs-toggle="modal"
              data-bs-target="#kt_modal_new_target_group" >
              Nhóm Telegram
            </button> -->

          </div>
        </div>
        <!--end::Toolbar-->

        <!--begin::Group actions-->
        <div v-show="selectedIds.length !== 0">
          <div class="d-flex justify-content-end align-items-center">
            <div class="fw-bold me-5">
              <span class="me-2">{{ selectedIds.length }}</span>Selected
            </div>
            <el-tooltip class="box-item" effect="dark" hide-after="0" content="Xóa" placement="top">
              <button type="button" @click="deleteSelectd()"
                class="btn btn-danger  btn-sm" :disabled="disabled">
                <KTIcon icon-name="detele" icon-class="bi bi-trash" :style="{ fontSize: '16px' }" />
                Xóa mục đã chọn
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
      <div class="card-body overflow-y-auto overflow-x-auto h-100 p-0 m-0">
        <KTDatatable @on-items-select="onItemSelect" :data="list" :header="headerConfig" :loading="loading"
          :checkbox-enabled="true" :itemsPerPage="itemsPerPage" :total="totalPage" :currentPage="currentPage"
          @page-change="handlePage" @on-items-per-page-change="handlePerPage" @customRow="customRowTable">
          <template v-slot:id="{ row: customer }">{{ customer.id ?? '--' }}</template>
          <template v-slot:group_name="{ row: customer }">
            <span class="text-dark text-hover-primary fs-6 fw-bold">{{ customer.group_name ?? '--' }}</span>
          </template>

          <template v-slot:username="{ row: customer }">
            <div class="d-flex align-items-center">
              <!--begin::Symbol-->
              <div class="symbol symbol-45px me-5">
                <span class="symbol-label">
                  <KTIcon icon-name="user" icon-class="text-success  fs-2x" />
                </span>
              </div>
              <!--end::Symbol-->
              <!--begin::Text-->
              <div class="d-flex flex-column">
                <span class="text-dark text-hover-primary fs-6 fw-bold">{{ customer.username ?? '--' }}</span>
                <span class="text-muted fw-semobold">{{ customer.phone ?? '--' }}</span>
              </div>
              <!--end::Text-->
            </div>
          </template>
          <template v-slot:text="{ row: customer }">
            <div><span>{{ truncateText(customer.text, 25) }}</span></div>
          </template>
          <template v-slot:date="{ row: customer }">            
            <span class="text-gray-600 w-bold d-flex justify-content-start align-items-center fs-7">
              <KTIcon class="me-1" icon-name="calendar" icon-class="fs-3" />
              {{ customer.date }}
            </span>
          </template>
        </KTDatatable>
      </div>
      <!--end::Card body-->
    </div>

  </div>
  <!--end::Card-->

  <!-- modal detail  -->
  <div class="modal fade" tabindex="-1" ref="ModalDetail" aria-hidden="true" id="kt_modal_detail">
    <!--begin::Modal dialog-->
    <div class="modal-dialog modal-dialog-centered mw-600px">
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
                      <KTIcon icon-name="user" icon-class="text-success fs-2x" />
                    </span>
                  </div>
                  <!--end::Symbol-->
                  <!--begin::Text-->
                  <div class="d-flex flex-column">
                    <span class="text-dark text-hover-primary fs-4 fw-bold">{{ detailData.username ?? '--' }}</span>
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
                    <div>
                      <div class="row fs-6 mb-3">
                        <div class="col-3 text-gray-400">Tên nhóm:</div>
                        <div class="col-9 text-gray-800 fs-5 fw-bold"><span>{{ detailData.group_name ?? '--' }}</span>
                        </div>
                      </div>
                      <div class="row fs-6 mb-3">
                        <div class="col-3 text-gray-400">Nội dung:</div>
                        <div class="col-9 text-gray-800"><span>{{ detailData.text ?? '--' }}</span></div>
                      </div>
                      <div class="row fs-6">
                        <div class="col-3 text-gray-400">Thời gian:</div>
                        <div class="col-9 text-gray-800"><span>{{ detailData.date }}</span></div>
                      </div>
                    </div>
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
import { defineComponent, ref, onMounted, reactive, onBeforeUnmount } from "vue";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import ApiService from "@/core/services/ApiService";

// validate
import { hideModal } from "@/core/helpers/dom";
import { ErrorMessage, Field, Form as VForm } from "vee-validate";
import { vue3Debounce } from 'vue-debounce';

import Swal from "sweetalert2/dist/sweetalert2.js";
import Fillter from "@/views/apps/telegrams/filterDetail.vue";
import CodeHighlighter from "@/components/highlighters/CodeHighlighter.vue";
import { Modal } from "bootstrap";
import { useRoute } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import { markRaw } from 'vue'
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
    const route = useRoute();
    const ID = route.params.id ?? '';
    const list = ref<object | any>([])
    const loading = ref<boolean>(false)
    const totalPage = ref<number>(0);
    const currentPage = ref<number>(1);
    const itemsPerPage = ref<number>(20);
    const query = ref<String>('');
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
        columnLabel: "group_name",
        columnWidth: 150,
      },
      {
        columnName: "Tên",
        columnLabel: "username",
        columnWidth: 200,
      },
      {
        columnName: "Nội dung",
        columnLabel: "text",
        columnWidth: 200,
      },
      {
        columnName: "Thời gian",
        columnLabel: "date",
      }
    ]);


    const handlePage = (page: number) => {
      currentPage.value = page ?? 1;
      getData();
    };

    const handlePerPage = (itemsPage: number) => {
      itemsPerPage.value = itemsPage ?? 20;
      getData();
    };

    const getData = async () => {
      loading.value = true;
      return ApiService.get(`/telegram/index?group=${ID}&page=${currentPage.value}&page_size=${itemsPerPage.value}&search=${query.value}`)
        .then(({ data }) => {
          list.value = data.results
          totalPage.value = data.count
        })
        .catch(({ response }) => {
          notification(response.data.detail, 'error', 'Có lỗi xảy ra')
        })
        .finally(() => {
          loading.value = false
      });
    }

            // tính thời gian
            const eventTime = ref<number | any>('30000');
        let intervalId : any;
        const startTimer = () => {
            intervalId = setInterval(() => {
                getData();
            }, eventTime.value);
        };

        const stopTimer = () => {
            clearInterval(intervalId);
        };

        onMounted(() => {
            startTimer();
        });

        onBeforeUnmount(() => {
            stopTimer();
        });

    const selectedIds = ref<Array<number>>([]);
      const deleteSelectd = () => {
      ElMessageBox.confirm(
        'Tập tin sẽ được xóa vĩnh viễn. Tiếp tục?',
        'Xác nhận xóa',
        {
          confirmButtonText: 'Đồng ý',
          cancelButtonText: 'Hủy bỏ',
          type: 'warning',
          icon: markRaw(Delete)
        }
      )
        .then(() => {
          deleteSubscription(selectedIds.value);
        })
        .catch(() => {

        })
    };
    const disabled = ref<boolean>(false);

    
    const deleteSubscription = (ids: Array<number>) => {
      if (ids) {
        disabled.value = true
        setTimeout(() => {
          disabled.value = false
        }, 1000);
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
      if (detail) {
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
      } else {
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
        confirmButtonText: "Đồng ý!",
        heightAuto: false,
        customClass: {
          confirmButton: "btn btn-primary",
        },
      }).then(() => {
        
        // hideModal( ModalConfirm.value);
      });
    };


    const handleFilter = (data: any) => {
      if (data) {
        query.value = data.query;
        currentPage.value = 1;
        getData();
      } else {
        notification('Có lỗi với filter', 'error', 'Có lỗi xảy ra')
      }

    };

    // upadte status 
    const truncateText = (text: string, maxLength: number) => {
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
      }
      return text;
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
      deleteSelectd,
      
      getAssetPath,
      truncateText,

      // crud
      

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

      // filter
      handleFilter,
      loading,

      // detail
      detailData,
      disabled,
    };
  },
});
</script>