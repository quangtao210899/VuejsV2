<template>
  <KTToolbar addNew="/telegram-group-form/add" :check-setting="true" @handle-setting="handleSetting"
    :check-sync-all="true" @handle-sync-all="handleSyncAll" :check-search="true" @handle-search="handleFilter"
    v-model:idsDelete="selectedIds" @handle-delete-selectd="deleteSubscription" :disabled="disabled"
    @on-header-height="onheaderHeight"></KTToolbar>
  <!--begin::Card-->
  <div class="app-container container-fluid" :style="{ marginTop: headerHeight + 'px' }">
    <div class="p-5 bg-body rounded-3">
      <el-table ref="multipleTableRef" :data="list" style="width: 100%;z-index: 1;"
        class-name="my-custom-table rounded-top cursor-pointer" table-layout="fixed" v-loading="loading"
        @selection-change="handleSelectionChange" :row-key="getRowKey" @row-click="customRowTable">
        <template #empty>
          <div class="flex items-center justify-center h-100%">
            <el-empty description="Không có dữ liệu nào" />
          </div>
        </template>

        <el-table-column label-class-name=" fs-13px fw-bold " type="selection" width="35" :reserve-selection="true" />

        <el-table-column width="50" label-class-name="fs-13px fw-bold text-dark" prop="id" label="ID">
          <template #default="scope">
            <span v-if="scope.row.id != ''" class="fs-13px text-gray-700 text-hover-primary">{{ scope.row.id
            }}</span>
            <span v-else class="badge badge-light-danger">--</span>
          </template>
        </el-table-column>

        <el-table-column label-class-name="fs-13px fw-bold text-dark" min-width="150" prop="name" label="GROUP">
          <template #default="scope">
            <span v-if="scope.row.name != ''" class="fs-13px text-gray-700 text-hover-primary">{{
              scope.row.name }}</span>
            <span v-else class="badge badge-light-danger">--</span>
          </template>
        </el-table-column>
        <el-table-column min-width="50" label-class-name="fs-13px fw-bold text-dark" prop="total_message" label="TỔNG">
          <template #default="scope">
            <span class="fs-13px text-gray-700 text-hover-primary">{{ scope.row.total_message
            }}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="110" label-class-name="fs-13px text-dark fw-bold" prop="type" label="KIỂU">
          <template #default="scope">
            <span v-if="scope.row.type != ''" class="fs-13px text-gray-700 text-hover-primary">
              {{ (scope.row.type == 1 ? 'DB Leak' : 'Hacker News') }}
            </span>
            <span v-else class="badge badge-light-danger">--</span>
          </template>
        </el-table-column>

        <el-table-column min-width="130" label-class-name="fs-13px text-dark fw-bold" prop="date_update"
          label="THỜI GIAN">
          <template #default="scope">
            <span v-if="scope.row.date_update != '' && scope.row.date_update != null"
              class="fs-13px text-gray-700 text-hover-primary">
              <i class="fa-solid fa-calendar-days fs-7"></i>
              {{ scope.row.date_update }}</span>
            <span v-else class="badge badge-light-danger">--</span>
          </template>
        </el-table-column>

        <el-table-column min-width="100" label-class-name="fs-13px text-dark fw-bold" prop="status" label="TRẠNG THÁI"
          align="center">
          <template #default="scope">
            <el-switch v-on:click.stop @click="updateStatus(scope.row)" v-model="scope.row.status"
              style="--el-switch-on-color: #50cd89; --el-switch-off-color: #f1416c" :active-value="0"
              :inactive-value="1" />
          </template>
        </el-table-column>

        <el-table-column width="150" label-class-name="text-dark fw-bold fs-13px " label="HÀNH ĐỘNG" align="center">
          <template #default="scope">

            <el-tooltip class="box-item" effect="dark" hide-after="0" content="Đồng Bộ" placement="top">
              <el-button class="me-1 btn-sm btn btn-icon btn-bg-light btn-active-color-success" type="primary"
                :icon="RefreshIcon" @click="getSyncItem(scope.row.id)" v-on:click.stop
                :disabled="(disabled || loadingSync) ? true : false"
                :loading="(idSync == scope.row.id) ? loadingSync : loadingSync" :loading-icon="RefreshIcon"></el-button>
            </el-tooltip>

            <el-tooltip class="box-item" effect="dark" hide-after="0" content="Chi Tiết Tin Nhắn" placement="top">
              <router-link :to="`/telegram-detail/${scope.row.id}`" v-on:click.stop
                class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1 my-1">
                <KTIcon icon-name="search-list" icon-class="fs-3" />
              </router-link>
            </el-tooltip>

            <el-tooltip class="box-item" effect="dark" hide-after="0" content="Chỉnh Sửa" placement="top">
              <router-link :to="`/telegram-group-form/${scope.row.id}`" v-on:click.stop
                class="btn btn-icon btn-bg-light btn-active-color-warning btn-sm me-1 my-1">
                <KTIcon icon-name="pencil" icon-class="fs-3" />
              </router-link>
            </el-tooltip>

          </template>
        </el-table-column>
      </el-table>
      <div class="d-flex justify-content-between align-items-center mx-auto w-100 py-5 bg-white rounded-bottom ">
        <div v-if="totalPage > 0">
          <span class="text-capitalize fs-13px">Tổng Số Mục Tiêu: {{ totalPage }}</span>
        </div>
        <el-pagination background v-model:current-page="currentPage" :hide-on-single-page="true"
          v-model:page-size="itemsPerPage" :total="totalPage" layout="prev, pager, next"
          :disabled="disabled"></el-pagination>
        <div></div>
      </div>

    </div>

  </div>
  <!--end::Card-->

  <!-- modal seting  -->
  <el-dialog v-model="visibleSetting" title="Lập Lịch Lấy Thông Tin" width="500" align-center>
    <div>
      <!--begin::Input group-->
      <div class="row g-9 mb-3">
        <label class="required fs-13px fw-semobold" for="next_run">Lần chạy kế tiếp</label>
        <!--begin::Col-->
        <div class="col-md-6 fv-row mt-2">
          <el-form-item prop="next_run">
            <el-date-picker v-model="setingData.next_run" disabled type="date" placeholder="Select a date"
              :teleported="false" popper-class="override-styles" id="next_run" name="next_run" />
          </el-form-item>
        </div>
        <!--end::Col-->

        <!--begin::Col-->
        <div class="col-md-6 fv-row mt-2">
          <!--begin::Input-->
          <div class="position-relative align-items-center">
            <!--begin::Datepicker-->
            <el-form-item prop="time_next_run">
              <el-time-picker v-model="setingData.time_next_run" type="time" placeholder="Select a date"
                :teleported="false" popper-class="override-styles" name="time_next_run" />
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
        <label for="timehour" class="d-flex align-items-center fs-13px fw-semobold mb-2">
          <span class="required fs-13px">Thời gian giữa các lần chạy (giờ)</span>
          <i class="fas fa-exclamation-circle ms-2 fs-7" data-bs-toggle="tooltip"
            title="Specify a target name for future usage and reference"></i>
        </label>
        <!--end::Label-->
        <el-input-number id="timehour" name="timehour" v-model="setingData.hour" :min="1" :max="24" />
      </div>
      <!--end::Input group-->
    </div>
    <template #footer center>
      <span class="d-flex justify-content-center">
        <button type="button" class="btn btn-sm btn-light-primary" @click="updateSchedule">
         Đông Ý
        </button>
      </span>
    </template>
  </el-dialog>


  <!-- modal detail  -->
  <el-dialog v-model="visibleDetail" :title="detailData.name" width="650" align-center :show-close="false" id="modal-detail"> 
    <div class="modal-body" style="padding: 0px !important;">
      <!--begin::Card-->
      <div class="card card-flush">
        <!--begin::Card header-->

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
                    <div class="col-5 text-gray-900 text-capitalize">Trạng Thái:</div>
                    <div class="col-7 text-gray-900">
                      <div class="d-flex align-items-center p-0 m-0">
                        <el-switch v-model="detailData.status" disabled
                          style="--el-switch-on-color: #50cd89; --el-switch-off-color: #f1416c" :active-value="0"
                          :inactive-value="1" />
                        <span class="ms-3 text-capitalize text-gray-800 fs-13px">
                          {{ (detailData.status == '0') ? ' Đang Hoạt động' : ' Không hoạt động' }}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div class="row fs-6 mb-3">
                    <div class="col-5 text-gray-900 text-capitalize">kiểu:</div>
                    <div class="col-7 text-gray-900"><span>{{ (detailData.type == '1' ? 'DB Leak' : 'Hacker News') }}</span></div>
                  </div>
                  <div class="row fs-6 mb-3">
                    <div class="col-5 text-gray-900 text-capitalize">Tổng số lượng tin nhắn:</div>
                    <div class="col-7 text-gray-900"><span>{{ detailData.total_message }}</span></div>
                  </div>
                  <div class="row fs-6 mb-3">
                    <div class="col-5 text-gray-900 text-capitalize">Thời gian thêm mới:</div>
                    <div class="col-7 text-gray-900"><span>{{ detailData.created_at }}</span></div>
                  </div>
                  <div class="row fs-6">
                    <div class="col-5 text-gray-900 text-capitalize">Thời gian cập nhật cuối:</div>
                    <div class="col-7 text-gray-900"><span>{{ detailData.date_update }}</span></div>
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
    <template #footer center>
      <span class="d-flex justify-content-center">
        <button type="button" class="btn btn-sm btn-light-primary" @click="visibleDetail = false">
          Đóng
        </button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive, onBeforeUnmount, shallowRef, watch } from "vue";
import ApiService from "@/core/services/ApiService";

// validate
import { vue3Debounce } from 'vue-debounce';
import Swal from "sweetalert2/dist/sweetalert2.js";
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
dayjs.locale('vi');
import { Refresh } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import KTToolbar from "@/views/apps/targets/reconWidgets/KTToolbar2.vue";
import { ElTable, ElTableColumn, ElPagination } from 'element-plus';

// import useCurrencyInput from "vue-currency-input";

interface APIData {
  name: string;
  type: string;
  status: boolean;
}

export default defineComponent({
  name: "kt-scans-list",

  components: {
    KTToolbar,
    ElTable,
    ElTableColumn,
    ElPagination,
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
    const RefreshIcon = ref(Refresh)
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
    const apiData = ref<APIData>({
      name: '',
      type: '1',
      status: true,
    });

    // Lắng nghe sự thay đổi của currentPage và pageSize
    watch(currentPage, (newCurrentPage) => {
      currentPage.value = newCurrentPage ?? 1;
      getData();
    });

    // getdata
    const getData = async () => {
      loading.value = true;

      return ApiService.get(`/telegram/group/index?page=${currentPage.value}&page_size=${itemsPerPage.value}&search=${query.value}`)
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

    const disabled = ref<boolean>(false);
    const selectedIds = ref<Array<number>>([]);
    // xóa
    const multipleTableRef = ref<InstanceType<typeof ElTable>>()
    const deleteSubscription = (ids: Array<number>) => {
      if (ids) {
        disabled.value = true
        setTimeout(() => {
          disabled.value = false
        }, 1000);
        return ApiService.delete(`telegram/group/multi-delete?id=${ids.join()}`)
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

    const visibleDetail = ref<boolean>(false)
    const customRowTable = (detail: any) => {
      if (detail) {
        visibleDetail.value = true
        detailData.id = detail.id
        detailData.modified_at = detail.modified_at
        detailData.created_at = detail.created_at
        detailData.total_message = detail.total_message
        detailData.date_update = detail.date_update
        detailData.type = detail.type
        detailData.name = detail.name
        detailData.status = detail.status
      }
      return;
    };

    const notification = (values: string, icon: string, more: string) => {
      visibleSetting.value = false;
      Swal.fire({
        text: values ?? more,
        icon: icon,
        buttonsStyling: false,
        confirmButtonText: (icon == 'error') ? "Thử Lại" : "Đồng Ý",
        heightAuto: false,
        customClass: {
          confirmButton: (icon == 'error') ? "btn btn-light-danger" : "btn btn-light-primary",
        },
      })
    };

    const formatDate = (date: string) => {
      return date ? date : "--:--"
    };

    const handleFilter = (data: any) => {
      query.value = data;
      currentPage.value = 1;
      getData();
    };

    // sync
    const idSync = ref<number>(0);
    const loadingSync = ref<boolean>(false);
    const handleSyncAll = () => {
      ElMessageBox.confirm(
        'Bạn có chắc muốn đồng bộ hóa tất cả nhóm Telegram không?',
        'Đồng Bộ Toàn Bộ Tin Nhắn',
        {
          confirmButtonText: 'Xác Nhận',
          cancelButtonText: 'Hủy Bỏ',
          type: 'warning',
          customClass: 'custom-Message-box-class-text-primary fs-13px',
          draggable: true,
        }
      )
        .then(() => {
          getSyncAll();
        })
        .catch(() => {
        })
    };

    // thểm loading
    const getSyncItem = async (id: any) => {
      loadingSync.value = true
      idSync.value = id
      return ApiService.post(`telegram/sync-data/${idSync.value}/group`, 0)
        .then(({ data }) => {
          notification(data.detail, 'success', 'Đang đồng bộ hóa tin nhắn')
          getData();
        })
        .catch(({ response }) => {
          notification(response.data?.detail, 'error', 'Đồng bộ hóa tin nhắn thất bại!')
        })
        .finally(() => {
          loadingSync.value = false
        })
    };

    const getSyncAll = async () => {
      loadingSync.value = true
      return ApiService.post('telegram/sync-data', '')
        .then(({ data }) => {
          notification(data.detail, 'success', 'Bắt đầu cập nhật dữ liệu!')
          getData();
        })
        .catch(({ response }) => {
          notification(response.data?.detail, 'error', 'Đồng bộ hóa tất cả tin nhắn thất bại!')
        })
        .finally(() => {
          loadingSync.value = false
        })
    };

    // setting
    const initialData = {
      next_run: '',
      time_next_run: '',
      hour: '',
    };
    const setingData = ref<object | string | any>({ ...initialData });
    const prevData = shallowRef<object | string | any>({ ...initialData });
    const visibleSetting = ref<boolean>(false);

    const handleSetting = () => {
      visibleSetting.value = true;
      if (setingData.next_run !== prevData.value.next_run || setingData.time_next_run !== prevData.value.time_next_run || setingData.hour !== prevData.value.hour) {
        setingData.value = { ...prevData.value }
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
      return ApiService.post(`/telegram/schedule`, formData)
        .then(({ data }) => {
          // Cập nhật prevData với giá trị mới của setingData
          prevData.value = { ...setingData.value };
          notification(data, 'success', 'Đang đồng bộ hóa tin nhắn')
          getData();
        })
        .catch(({ response }) => {
          notification(response.data?.detail, 'error', 'Đang đồng bộ hóa tin nhắn')
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
            next_run: data.next_run,
            time_next_run: data.next_run,
            hour: data.hour
          };
        })
        .catch(({ response }) => {
          notification(response.data.detail, 'error', 'Có lỗi xảy ra')
        });
    };

    // upadte status 
    const updateStatus = async (data: any) => {
      let formData = {
        name: data.name,
        type: data.type,
        status: data.status,
      }
      disabled.value = true
      setTimeout(() => {
        disabled.value = false
      }, 1000);
      return ApiService.put(`/telegram/group/${data.id}/update`, formData)
        .then(({ data }) => {
          notification(data?.detail, 'success', 'Thay đổi trạng thái thành công!')
          getData();
        })
        .catch(({ response }) => {
          notification(response.data?.detail, 'error', 'Thay đổi trạng thái thất bại!')
        });
    };

    onMounted(() => {
      getData();
      getSetting();
    });

    // thay đổi kích thước header
    const headerHeight = ref<number>(0);
    const onheaderHeight = (height: number) => {
      headerHeight.value = height

    }

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

    return {
      multipleTableRef,
      apiData,
      deleteSubscription,
      onheaderHeight,
      headerHeight,
      getData,
      list,
      selectedIds,

      // table 
      getRowKey,
      handleSelectionChange,
      customRowTable,
      itemsPerPage,
      totalPage,
      currentPage,
      query,

      // sử lý dữ liệu
      formatDate,
      handleFilter,
      loading,

      // detail
      detailData,
      visibleDetail,

      // sync
      handleSyncAll,
      getSyncAll,
      getSyncItem,
      visibleSetting,

      // setting
      handleSetting,
      setingData,
      prevData,
      updateSchedule,

      // update stataus
      updateStatus,
      disabled,
      RefreshIcon,
      idSync,
      loadingSync,
    };
  },
});
</script>
<style >
span.el-dialog__title {
  color: #181C32 !important;
  font-size: 23px;
  font-weight: 600;
  line-height: 27px;
}

#modal-detail .el-dialog__body {
  padding-top: 10px;
}
</style>