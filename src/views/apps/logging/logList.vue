<template>
  <KTToolbar :check-search="true" @handle-search="handleFilter" :disabled="disabled" @on-header-height="onheaderHeight"
    title="log" @handle-delete-selectd="deleteSubscription" v-model:idsDelete="selectedIds"></KTToolbar>

  <div class="app-container container-fluid" :style="{ marginTop: headerHeight + 'px' }">
    <div class="p-5 bg-body rounded-3">
      <!--begin::Card body-->
      <el-table ref="multipleTableRef" :data="list" style="width: 100%;z-index: 1;"
        @selection-change="handleSelectionChange" highlight-current-row :row-key="getRowKey"
        class-name="my-custom-table rounded-top cursor-pointer" table-layout="fixed" @row-click="handleCurrentChange"
        v-loading="loading" element-loading-text="Đang Tải..." element-loading-background="rgb(255 255 255 / 25%)">
        <template #empty>
          <div class="flex items-center justify-center h-100%">
            <el-empty description="Không có dữ liệu nào" />
          </div>
        </template>

        <el-table-column label-class-name=" fs-13px fw-bold" type="selection" :width="35"
                    :reserve-selection="true" />


        <el-table-column width="80" label-class-name="fs-13px fw-bold text-dark" prop="id" label="ID">
          <template #default="scope">
            <span v-if="scope.row.id != ''" class="fs-13px text-gray-700 text-hover-primary">{{ scope.row.id
            }}</span>
            <span v-else class="badge badge-light-danger">--</span>
          </template>
        </el-table-column>

        <el-table-column min-width="300" label-class-name="fs-13px text-dark fw-bold" prop="msg" label="MESSAGE">
          <template #default="scope">
            <span v-if="scope.row.msg != ''" class="fs-13px text-gray-700 text-hover-primary">
              <!-- {{ scope.row.msg }} -->
            {{ truncateText(scope.row.msg, 150) }}
              </span>
            <span v-else class="badge badge-light-danger">--</span>

          </template>
        </el-table-column>

        <el-table-column min-width="300" label-class-name="fs-13px text-dark fw-bold" prop="trace" label="TRACEBACK">
          <template #default="scope">
            <span v-if="scope.row.trace" class="fs-13px text-gray-700 text-hover-primary">
              <!-- {{ scope.row.trace }} -->
            {{ truncateText(scope.row.trace, 150) }}
          </span>
            <span v-else class="badge badge-light-danger">--</span>

          </template>
        </el-table-column>

        <el-table-column min-width="100" label-class-name="fs-13px text-dark fw-bold" prop="create_datetime"
          label="THỜI GIAN">
          <template #default="scope">
            <span v-if="scope.row.create_datetime != ''" class="fs-13px text-gray-700 text-hover-primary">
              <i class="fa-solid fa-calendar-days fs-7"></i>
              {{ scope.row.create_datetime }}</span>
            <span v-else class="badge badge-light-danger">--</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="d-flex justify-content-between align-items-center mx-auto w-100 py-5 bg-body rounded-bottom ">
        <div v-if="totalPage > 0">
          <span class="text-capitalize fs-13px">Tổng Số Log: {{ totalPage }}</span>
        </div>
        <el-pagination background v-model:current-page="currentPage" :hide-on-single-page="true"
          v-model:page-size="itemsPerPage" :total="totalPage" layout="prev, pager, next"
          :disabled="disabled"></el-pagination>
        <div></div>
      </div>
      <!--end::Card body-->
    </div>
  </div>

  <!--end::Card-->

  <!-- modal detail  -->
  <el-dialog v-model="DialogVisibleDetail" title="Chi Tiết Log" width="75%" top="7vh" id="modal-detail"
    :show-close="false">
    <div class="modal-body" style="padding: 0px !important;">
      <!--begin::Card-->
      <div class="card card-flush">
        <!--begin::Card header-->
        <div class="card-body py-0" style="padding-top:0px !important;">
          <!--begin::Section-->
          <h5>Thông Tin Chi Tiết:</h5>
          <div class="py-5">
            <div class="me-5">
              <div>
                <div class="row mb-3">
                  <div class="col-1 text-gray-900 w-150px fs-6 ">Message:</div>
                  <div class="col fs-13px ">
                    <span v-if="typeof detailData.msg === 'string' && detailData.msg != ''">
                      <CodeHighlighter lang="json" :data="detailData.msg" />
                    </span>
                    <span v-else class=" badge badge-light-danger">--</span>
                  </div>
                </div>
                <div class="row  mb-3 ">
                  <div class="col-1 text-gray-900 w-150px fs-6">Traceback:</div>
                  <div class="col fs-13px">
                    <span v-if="typeof detailData.trace === 'string' && detailData.trace != ''">
                      <!-- <pre class="fs-13px" style="white-space: pre-line;">{{ detailData.trace }}</pre> -->
                      <CodeHighlighter lang="json" :data="detailData.trace" />

                    </span>
                    <span v-else class="badge badge-light-danger">--</span>
                  </div>
                </div>
                <div class="row fs-6 mb-3">
                  <div class="col-1 text-gray-900 w-150px">Ngày Tạo:</div>
                  <div class="col">
                    <span v-if="typeof detailData.create_datetime === 'string' && detailData.create_datetime != ''">
                      <i class="fa-solid fa-calendar-days fs-7"></i>
                      {{ detailData.create_datetime }}
                    </span>
                    <span v-else class=" badge badge-light-danger">--</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!--end::Section-->
        </div>
        <!--end::Card body-->
      </div>
      <!--end::Card-->
    </div>

    <template #footer center>
      <div class="text-center">
        <button type="button" class="btn btn-sm btn-light-primary" @click="DialogVisibleDetail = false">
          Đóng
        </button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive, watch, onBeforeUnmount } from "vue";
import ApiService from "@/core/services/ApiService";
import KTToolbar from "@/views/apps/targets/reconWidgets/KTToolbar2.vue";
import CodeHighlighter from "@/components/highlighters/CodeHighlighter.vue";

// validate
import { vue3Debounce } from 'vue-debounce';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ElTable, ElTableColumn, ElPagination } from 'element-plus';

export default defineComponent({
  name: "kt-log-list",

  components: {
    ElTable,
    ElTableColumn,
    KTToolbar,
    ElPagination,
    CodeHighlighter,
  },
  directives: {
    debounce: vue3Debounce({ lock: true })
  },
  setup() {
    const list = ref<object | any>([])
    const totalPage = ref<number>(0);
    const currentPage = ref<number>(1);
    const itemsPerPage = ref<number>(20);
    const query = ref<string>('');
    const trace = ref<string>('');
    const loading = ref<boolean>(false)
    const DialogVisibleDetail = ref<boolean>(false)
    const detailData = reactive({
      id: ' ',
      level: '',
      logger_name: '',
      msg: '',
      trace: '',
      create_datetime: '',
    });
    const getData = async () => {
      loading.value = true;
      return ApiService.get(`other/logs?search=${query.value}&page=${currentPage.value}&page_size=${itemsPerPage.value}`)
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

    const disabled = ref<boolean>(false);

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

    // xóa 
    const selectedIds = ref<Array<number>>([]);
    const selectedName = ref<Array<any>>([]);
    const handleSelectionChange = (val: any) => {
      if (val) {
        selectedName.value = val.map((item: any) => item.name || item.title);
        selectedIds.value = val.map((item: { id: number }) => item.id);
      }
      return;
    }

    const getRowKey = (row: any) => {
      return row.id
    }

    const deleteSubscription = (ids: Array<number>) => {
            let formData = {
                'id': ids
            }
            if (ids) {
                disabled.value = true
                setTimeout(() => {
                    disabled.value = false
                }, 1000);
                return ApiService.post(`/other/logs/multi-delete`, formData)
                    .then(({ data }) => {
                        notification(data.detail, 'success', 'Xóa thành công')
                        currentPage.value = 1;
                        selectedIds.value = [];
                        multipleTableRef.value!.clearSelection()
                        getData();
                    })
                    .catch(({ response }) => {
                        notification(response.data.detail, 'error', 'Có lỗi xảy ra')
                    });
            }
        };

    const handleFilter = (data: any) => {
      query.value = data;
      currentPage.value = 1;
      getData();
    };

    // xóa 
    const multipleTableRef = ref<InstanceType<typeof ElTable>>()

    const handleCurrentChange = (data: any) => {
      DialogVisibleDetail.value = true
      detailData.create_datetime = data.create_datetime
      detailData.trace = data.trace
      trace.value = data.trace
      detailData.msg = data.msg
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

    // thêm mới
    const truncateText = (text: string, maxLength: number) => {
      if (text && text.length > maxLength ) {
        return text.substring(0, maxLength) + '...';
      }
      return text;
    };

    // thay đổi kích thước header
    const headerHeight = ref<number>(0);
    const onheaderHeight = (height: number) => {
      headerHeight.value = height
    }

    onMounted(() => {
      getData();
    });
    // tính thời gian
    const eventTime = ref<number | any>('30000');
    let intervalId: any;
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

    return {
      headerHeight,
      onheaderHeight,
      getData,
      list,
      itemsPerPage,
      totalPage,
      currentPage,
      query,
      handleFilter,
      loading,
      disabled,
      truncateText,
      multipleTableRef,
      detailData,
      DialogVisibleDetail,
      handleCurrentChange,
      trace,
      getRowKey,
      handleSelectionChange,
      selectedIds,
      deleteSubscription,
    };
  },
});
</script>
<style >

#modal-detail .el-dialog__body {
  padding-top: 10px;
}
</style>