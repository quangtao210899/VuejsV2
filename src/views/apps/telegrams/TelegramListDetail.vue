<template>
  <div ref="refGetTheHeight">
    <KTToolbar :addNew="urlAddNew" :check-search="true" @handle-search="handleFilter" v-model:idsDelete="selectedIds"
      @handle-delete-selectd="deleteSubscription" :disabled="disabled" @on-header-height="onheaderHeight"
      :selected-name="selectedName" title="Tin Nhắn"></KTToolbar>
  </div>
  <!--begin::Card-->
  <el-scrollbar :height="heightTable">
    <div class="app-container container-fluid" :style="{ marginTop: headerHeight + 'px' }">
      <div class="p-5 bg-body rounded-3">
        <!--begin::Card body-->
        <el-table ref="multipleTableRef" :data="list" style="width: 100%;z-index: 1;"
          class-name="my-custom-table cursor-pointer" table-layout="fixed" v-loading="loading"
          element-loading-text="Đang Tải..." element-loading-background="rgb(255 255 255 / 25%)"
          @selection-change="handleSelectionChange" :row-key="getRowKey" @row-click="handleCurrentChange"
          :default-sort="{ prop: 'id', order: 'descending' }" @sort-change="handleSortChange">
          <template #empty>
            <div class="flex items-center justify-center h-100%">
              <el-empty description="Không có dữ liệu nào" />
            </div>
          </template>

          <el-table-column label-class-name=" fs-13px fw-bold " type="selection" width="35" :reserve-selection="true" />

          <el-table-column width="80" label-class-name="fs-13px fw-bold text-dark" prop="id" label="ID">
            <template #default="scope">
              <span v-if="scope.row.id != ''" class="fs-13px text-gray-700 text-hover-primary">{{ scope.row.id
              }}</span>
              <span v-else class="badge badge-light-danger">--</span>
            </template>
          </el-table-column>

          <el-table-column label-class-name="fs-13px fw-bold text-dark" min-width="100" prop="group_name"
            label="TÊN NHÓM">
            <template #default="scope">
              <span v-if="scope.row.group_name != ''" class="fs-13px text-gray-700 text-hover-primary">{{
                scope.row.group_name }}</span>
              <span v-else class="badge badge-light-danger">--</span>
            </template>
          </el-table-column>
          <el-table-column min-width="120" label-class-name="fs-13px fw-bold text-dark" prop="target_count" label="TÊN">
            <template #default="scope">
              <div class="d-flex align-items-center">
                <!--begin::Symbol-->
                <div class="symbol symbol-45px me-5">
                  <span class="symbol-label">
                    <KTIcon icon-name="user" icon-class="text-success fs-2x" />
                  </span>
                </div>
                <!--end::Symbol-->
                <!--begin::Text-->
                <div class="d-flex flex-column" v-if="!scope.row.phone && scope.row.username == ' '">
                  <span class="badge badge-light-danger">--</span>
                </div>
                <div class="d-flex flex-column" v-else>
                  <div class="mx-0 my-0">
                    <span class="fs-13px text-gray-700" v-if="scope.row.username != ' '">{{ scope.row.username }}</span>
                    <span class="badge badge-light-danger" v-else>--</span>
                  </div>
                  <div class="mx-0 my-0">
                    <span class="fs-13px text-gray-700" v-if="scope.row.phone">{{ scope.row.phone }}</span>
                    <span class="badge badge-light-danger" v-else>--</span>
                  </div>
                </div>
                <!--end::Text-->
              </div>
            </template>
          </el-table-column>

          <el-table-column min-width="300" label-class-name="fs-13px text-dark fw-bold" prop="text" label="NỘI DUNG">
            <template #default="scope">
              <span class="fs-13px text-gray-700 text-hover-primary">{{ truncateText(scope.row.text, 200) }}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="100" label-class-name="fs-13px text-dark fw-bold" prop="date" label="THỜI GIAN">
            <template #default="scope">
              <span v-if="scope.row.date != ''" class="fs-13px text-gray-700 text-hover-primary">
                <i class="fa-solid fa-calendar-days fs-7"></i>
                {{ scope.row.date }}</span>
              <span v-else class="badge badge-light-danger">--</span>
            </template>
          </el-table-column>
        </el-table>
        <div class="d-flex justify-content-between align-items-center mx-auto w-100 py-5 bg-body rounded-bottom ">
          <div v-if="totalPage > 0">
            <span class="text-capitalize fs-13px">Tổng Số Tin Nhắn: {{ totalPage }}</span>
          </div>
          <el-pagination background v-model:current-page="currentPage" :hide-on-single-page="true"
            v-model:page-size="itemsPerPage" :total="totalPage" layout="prev, pager, next"
            :disabled="disabled"></el-pagination>
          <div></div>
        </div>
        <!--end::Card body-->
      </div>
    </div>
  </el-scrollbar>

  <!--end::Card-->

  <!-- modal detail  -->
  <el-dialog v-model="DialogVisibleDetail" title="Chi Tiết Tin Nhắn" width="650" align-center id="modal-detail"
    :show-close="false">
    <div class="modal-body" style="padding: 0px !important;">
      <div class="card-body mb-5">
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
            <div class="d-flex flex-column" v-if="!detailData.phone && detailData.username == ' '">
              <span class="badge badge-light-danger">--</span>
            </div>
            <div class="d-flex flex-column" v-else>
              <div class="mx-0 my-0">
                <span class="fs-13px text-gray-700" v-if="detailData.username != ' '">{{ detailData.username }}</span>
                <span class="badge badge-light-danger" v-else>--</span>
              </div>
              <div class="mx-0 my-0">
                <span class="fs-13px text-gray-700" v-if="detailData.phone">{{ detailData.phone }}</span>
                <span class="badge badge-light-danger" v-else>--</span>
              </div>
            </div>
          </div>
        </div>
        <!--begin::Card toolbar-->

        <!--end::Card toolbar-->
      </div>
      <!--end::Card header-->

      <!--begin::Card body-->
      <div class="card-body py-0" style="padding-top:0px !important;">
        <!--begin::Section-->
        <div>
          <!--begin::Title-->
          <h5>Thông Tin Chi Tiết:</h5>
          <!--end::Title-->

          <!--begin::Details-->
          <div>
            <!--begin::Row-->
            <div class="me-5">
              <!--begin::Details-->
              <div>
                <div class="row fs-6 mb-3">
                  <div class="col-3 text-gray-900">Tên Nhóm:</div>
                  <div class="col-9 text-gray-900"><span>{{ detailData.group_name ?? '--' }}</span>
                  </div>
                </div>
                <div class="row fs-6 mb-3">
                  <div class="col-3 text-gray-900">Nội Dung:</div>
                  <div class="col-9 text-gray-900"><span>{{ detailData.text ?? '--' }}</span></div>
                </div>
                <div class="row fs-6">
                  <div class="col-3 text-gray-900">Thời Gian:</div>
                  <div class="col-9 text-gray-900"><span>{{ detailData.date }}</span></div>
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
    </div>

    <template #footer center>
      <div class="dialog-footer">
        <button type="button" class="btn btn-sm btn-light-primary" @click="DialogVisibleDetail = false">
          Đóng
        </button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive, watch, onUnmounted } from "vue";
import ApiService from "@/core/services/ApiService";
import KTToolbar from "@/views/apps/targets/reconWidgets/KTToolbar2.vue";
import { useRoute } from 'vue-router';
// validate
import { vue3Debounce } from 'vue-debounce';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ElTable, ElTableColumn, ElPagination } from 'element-plus';
export default defineComponent({
  name: "kt-target-list",

  components: {
    ElTable,
    ElTableColumn,
    KTToolbar,
    ElPagination,
  },
  directives: {
    debounce: vue3Debounce({ lock: true })
  },
  setup() {
    const route = useRoute();
    const ID = route.params.id ?? '';
    const list = ref<object | any>([])
    const data_group = ref<object | any>([])
    const totalPage = ref<number>(0);
    const currentPage = ref<number>(1);
    const itemsPerPage = ref<number>(20);
    const query = ref<string>('');
    const orderingID = ref<string>('-id');
    const loading = ref<boolean>(false)
    const DialogVisibleDetail = ref<boolean>(false)
    const detailData = reactive({
      username: ' ',
      phone: '',
      group_name: '',
      text: '',
      date: '',
    });
    const getData = async () => {
      loading.value = true;
      return ApiService.get(`telegram/index?group=${ID}&search=${query.value}&page=${currentPage.value}&page_size=${itemsPerPage.value}&ordering=${orderingID.value}`)
        .then(({ data }) => {
          list.value = data.results
          totalPage.value = data.count
        })
        .catch(({ response }) => {
          notification(response.data.detail, 'error', 'Có lỗi xảy ra')
        })
        .finally(() => {
          loading.value = false
        })
    }


    const selectedIds = ref<Array<number>>([]);
    const disabled = ref<boolean>(false);
    const deleteSubscription = (ids: Array<number>) => {
      if (ids) {
        disabled.value = true
        setTimeout(() => {
          disabled.value = false
        }, 1000);
        return ApiService.delete(`telegram/message/multi-delete?id=${ids}`)
          .then(({ data }) => {
            getData()
            notification(data.detail, 'success', 'Xóa thành công')
            currentPage.value = 1;
            selectedIds.value = [];
            multipleTableRef.value!.clearSelection()
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
      });
    }

    const handleFilter = (data: any) => {
      query.value = data;
      currentPage.value = 1;
      getData();
    };

    // xóa 
    const multipleTableRef = ref<InstanceType<typeof ElTable>>()

    // handleCurrentChange
    const handleCurrentChange = (data: any) => {
      DialogVisibleDetail.value = true
      detailData.username = data.username
      detailData.phone = data.phone
      detailData.group_name = data.group_name
      detailData.text = data.text
      detailData.date = data.date
    }



    // table
    const selectedName = ref<Array<any>>([]);
    const handleSelectionChange = (val: any) => {
      if (val) {
        selectedName.value = val.map((item: any) => item.name || item.title || item.group_name);
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
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      if (windowWidth >= 1400) {
        heightTable.value = window.innerHeight - 80;
      } else if (windowWidth >= 1200) {
        heightTable.value = window.innerHeight - 80;
      } else if (windowWidth >= 992) {
        heightTable.value = window.innerHeight - 80;
      } else if (windowWidth >= 768) {
        heightTable.value = window.innerHeight - 75;
      } else if (windowWidth >= 576) {
        heightTable.value = window.innerHeight - 75;
      } else {
        // Kích thước cửa sổ nhỏ hơn 576px, đặt giá trị mặc định
        heightTable.value = window.innerHeight - 70;
      }
    };
    // thêm mới
    const urlAddNew = ref('')
    const truncateText = (text: string, maxLength: number) => {
      if (text && text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
      }
      return text;
    };

    const handleSortChange = (column: any) => {
      orderingID.value = (column.order == 'ascending' && column.prop == 'id') ? '-id' : 'id'
      getData()
    }
    // thay đổi kích thước header
    const headerHeight = ref<number>(0);
    const onheaderHeight = (height: number) => {
      headerHeight.value = height

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
      headerHeight,
      onheaderHeight,
      getData,
      list,
      selectedIds,

      // validate
      data_group,

      // page 
      itemsPerPage,
      totalPage,
      currentPage,

      // search query 
      query,
      handleFilter,

      // edit 
      loading,
      disabled,

      //
      handleResize,
      truncateText,
      heightTable,
      handleSelectionChange,
      selectedName,
      getRowKey,
      handleCurrentChange,
      multipleTableRef,
      urlAddNew,
      handleSortChange,
      deleteSubscription,
      detailData,
      DialogVisibleDetail,
    };
  },
});
</script>


<style >
#modal-detail .el-dialog__body {
  padding-top: 10px;
}

.dialog-footer {
  display: flex;
  justify-content: center;
  /* Căn giữa theo chiều dọc và ngang */
}
</style>