<template>
  <!--begin::Card-->
  <div class="app-container container-fluid p-5 mt-10">
  <div class="card h-100 d-block">
    <!--begin::Card header-->
    <div class="card-header border-0 pt-10 pt-sm-10 pt-lg-6 position-absolute end-0 pe-1  " style="top: -70px;">
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
            <el-tooltip class="box-item" effect="dark" hide-after="0" content="Tìm kiếm" placement="top">
              <button type="button" class="btn btn-sm fw-bold bg-body btn-color-gray-700 btn-active-color-primary me-2"
                data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end" data-kt-menu-flip="top-end">
                <KTIcon icon-name="filter" icon-class="fs-2" />
                Filter
              </button>
            </el-tooltip>
            <Fillter @filterData="handleFilter" :type="group_type"></Fillter>
          </div>
        </div>

        <!--begin::Group actions-->
        <div v-show="selectedIds.length !== 0">
          <div class="d-flex justify-content-end align-items-center">
            <div class="fw-bold me-5">
              <span class="me-2">{{ selectedIds.length }}</span>Selected
            </div>
            <el-tooltip class="box-item" effect="dark" hide-after="0" content="Xóa" placement="top">
              <button type="button" @click="deleteSelectd()" :disabled="disabled" class="btn btn-danger  btn-sm">
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

    <!--begin::Card body-->
    <div class="h-100 w-100 p-0 m-0">
      <el-table ref="multipleTableRef" :data="list" style="width: 100%" class-name="my-custom-table rounded-top"
        :height="heightTable" table-layout="fixed" v-loading="loading" @selection-change="handleSelectionChange"
        highlight-current-row :row-key="getRowKey" @current-change="handleCurrentChange">
        <template #empty>
          <div class="flex items-center justify-center h-100%">
            <el-empty description="Không có dữ liệu nào"/>
          </div>
        </template>
        <el-table-column label-class-name="border border-0 fs-7" type="selection" width="35" :reserve-selection="true" />

        <el-table-column min-width="35" label-class-name="border border-0" prop="id" label="ID">
          <template #default="scope">
            <span class="fs-6 text-gray-600 fw-bold">{{ scope.row.id ?? '--' }}</span>
          </template>
        </el-table-column>

        <el-table-column label-class-name="border border-0 fs-7" prop="group_name" label="GROUP">
          <template #default="scope">
            <span class="text-dark text-hover-primary fs-6 fw-bold">{{ scope.row.group_name ?? '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column min-width="100" label-class-name="border border-0 fs-7" prop="username" label="TÊN">
          <template #default="scope">
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
                <span class="text-dark text-hover-primary fs-6 fw-bold">{{ scope.row.username ?? '--' }}</span>
                <span class="text-muted fw-semobold">{{ scope.row.phone ?? '--' }}</span>
              </div>
              <!--end::Text-->
            </div>
          </template>
        </el-table-column>

        <el-table-column min-width="150" label-class-name="border border-0" prop="text" label="NỘI DUNG">
          <template #default="scope">
            <span class="fs-6 text-gray-600 fw-bold">{{ truncateText(scope.row.text, 25) ?? '--'
            }}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="90" label-class-name="border border-0 fs-7" prop="date" label="THỜI GIAN">
          <template #default="scope">
            <span class="text-gray-600 d-flex justify-content-start align-items-center fs-7 fw-bold">
              <KTIcon class="me-1" icon-name="calendar" icon-class="fs-3" />
              {{ scope.row.date }}
            </span>
          </template>
        </el-table-column>
      </el-table>
      <div class="d-flex justify-content-center mx-auto w-100 py-5 bg-white rounded-bottom ">
        <el-pagination background v-model:current-page="currentPage" v-model:page-size="itemsPerPage" :total="totalPage"
          :layout="(checkPaginationTable) ? 'prev, pager, next' : 'total, sizes, prev, pager, next, jumper'"
          :pager-count="(checkPaginationTable) ? 5 : 6" :disabled="disabled"
          :page-sizes="(checkPaginationTable) ? [] : [10, 20, 30, 40, 50]"></el-pagination>
      </div>
    </div>
    <!--end::Card body-->
  </div></div>
  <!--end::Card-->

  <el-dialog v-model="DialogVisibleDetail" title="Chi tiết tin nhắn" width="600" align-center modal-class="12345">
    <div class="modal-body">
      <!--begin::Card-->
      <div class="card card-flush">
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
            <div class="py-5">
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
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive, onUnmounted, watch } from "vue";
import ApiService from "@/core/services/ApiService";

// validate
import { vue3Debounce } from 'vue-debounce';
import Swal from "sweetalert2/dist/sweetalert2.js";
import Fillter from "@/views/apps/telegrams/filters.vue";
import { Modal } from "bootstrap";
import { useRoute } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import { markRaw } from 'vue'
import { ElTable, ElTableColumn } from 'element-plus';

export default defineComponent({
  name: "kt-scans-list",

  components: {
    Fillter,
    ElTable,
    ElTableColumn
  },
  directives: {
    debounce: vue3Debounce({ lock: true })
  },
  setup() {
    const route = useRoute();
    const list = ref<any>([])
    const loading = ref<boolean>(false)
    const totalPage = ref<number>(0);
    const currentPage = ref<number>(1);
    const itemsPerPage = ref<number>(20);
    const query = ref<String>('');
    const group_type = ref<null | string | any>(route.params.id ?? '');
    const detailData = reactive({
      id: '',
      group_name: '',
      username: '',
      phone: '',
      text: '',
      date: '',
    });
    const multipleTableRef = ref<InstanceType<typeof ElTable>>()

    const getData = async () => {
      loading.value = true;
      await ApiService.get(`/telegram/index?page=${currentPage.value}&page_size=${itemsPerPage.value}&group_type=${group_type.value}&search=${query.value}`)
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
    // const eventTime = ref<number | any>('30000');
    // let intervalId: any;
    // const startTimer = () => {
    //   intervalId = setInterval(() => {
    //     getData();
    //   }, eventTime.value);
    // };

    // const stopTimer = () => {
    //   clearInterval(intervalId);
    // };

    // onMounted(() => {
    //   startTimer();
    // });

    // onBeforeUnmount(() => {
    //   stopTimer();
    // });

    const selectedIds = ref<any>([]);
    const deleteSelectd = () => {
      ElMessageBox.confirm(
        'Tập tin sẽ được xóa vĩnh viễn. Tiếp tục?',
        'Xác Nhận Xóa',
        {
          confirmButtonText: 'Đồng Ý',
          cancelButtonText: 'Hủy Bỏ',
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
        console.log(ids)
        disabled.value = true
        setTimeout(() => {
          disabled.value = false
        }, 1000);
        return ApiService.delete(`telegram/message/multi-delete?id=${ids}`)
          .then(({ data }) => {
            notification(data.detail, 'success', 'Xóa thành công')
            selectedIds.value = [];
            multipleTableRef.value!.clearSelection()
            getData();
          })
          .catch(({ response }) => {
            notification(response.data.detail, 'error', 'Có lỗi xảy ra')
          });
      }
    };

    const notification = (values: string, icon: string, more: string) => {
      Swal.fire({
        text: values ?? more,
        icon: icon,
        buttonsStyling: false,
        confirmButtonText: (icon == 'error') ? "Thử Lại" : "Đồng Ý",
        heightAuto: false,
        customClass: {
          confirmButton: (icon == 'error') ? "btn btn-light-danger" : "btn btn-light-primary",
        },
      }).then(() => {

        // hideModal( ModalConfirm.value);
      });
    };

    const handleFilter = (data: any) => {
      if (data) {
        query.value = data.query;
        group_type.value = data.type;
        currentPage.value = 1;
        getData();
      } else {
        notification('Có lỗi với filter', 'error', 'Có lỗi xảy ra')
      }

    };

    // truncateText
    const truncateText = (text: string, maxLength: number) => {
      if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
      }
      return text;
    };

    // table
    const handleSelectionChange = (val: any) => {
      if (val) {
        selectedIds.value = val.map((item: { id: number }) => item.id);
      }
      return;
    }

    const getRowKey = (row: any) => {
      return row.id
    }

    // Lắng nghe sự thay đổi của currentPage và pageSize
    watch(currentPage, (newCurrentPage) => {
      currentPage.value = newCurrentPage ?? 1;
      getData();
    });

    watch(itemsPerPage, (newPageSize) => {
      itemsPerPage.value = newPageSize ?? 20;
      getData();
    });

    // tính toán chiều cao table
    const heightTable = ref(0)
    const checkPaginationTable = ref(false)
    const handleResize = () => {
      const windowWidth = window.innerWidth;

      if (windowWidth >= 1400) {
        heightTable.value = window.innerHeight - 220;
        checkPaginationTable.value = false
      } else if (windowWidth >= 1200) {
        heightTable.value = window.innerHeight - 220;
        checkPaginationTable.value = false
      } else if (windowWidth >= 992) {
        heightTable.value = window.innerHeight - 220;
        checkPaginationTable.value = false
      } else if (windowWidth >= 768) {
        heightTable.value = window.innerHeight - 200;
        checkPaginationTable.value = false
      } else if (windowWidth >= 576) {
        heightTable.value = window.innerHeight - 200;
        checkPaginationTable.value = true
      } else {
        // Kích thước cửa sổ nhỏ hơn 576px, đặt giá trị mặc định
        heightTable.value = window.innerHeight - 200;
        checkPaginationTable.value = true
      }
    };

    // handleCurrentChange
    const DialogVisibleDetail = ref<boolean>(false)
    const handleCurrentChange = (val: any, index) => {
      console.log(val)
      if (val) {
        DialogVisibleDetail.value = true
        detailData.id = val.id
        detailData.username = val.username
        detailData.date = val.date
        detailData.text = val.text
        detailData.phone = val.phone
        detailData.group_name = val.group_name
      }
      return
    }

    onMounted(() => {
      getData();
      handleResize();
      window.addEventListener('resize', handleResize);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
    });

    return {
      getData,
      list,
      selectedIds,
      deleteSelectd,

      // page 
      itemsPerPage,
      totalPage,
      currentPage,

      // search query 
      query,

      // filter
      handleFilter,
      loading,
      group_type,

      // detail
      detailData,
      truncateText,
      disabled,


      // table
      handleSelectionChange,
      checkPaginationTable,
      multipleTableRef,
      getRowKey,
      heightTable,
      handleCurrentChange,
      DialogVisibleDetail,

    };
  },
});
</script>

<style >
.my-custom-table td.el-table__cell {
  border-bottom-style: dashed !important;
}
</style>