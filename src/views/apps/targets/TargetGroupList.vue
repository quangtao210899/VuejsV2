<template>
  <div ref="refGetTheHeight">
    <KTToolbar :addNew="urlAddNew" :check-search="true" @handle-search="handleFilter" v-model:idsDelete="selectedIds"
      @handle-delete-selectd="deleteSubscription" :disabled="disabled"></KTToolbar>
  </div>
  <!--begin::Card-->
  <el-scrollbar :height="heightTable">
    <div class="app-container container-fluid pt-10 mt-10 ">
      <div class="p-5 bg-body rounded-3">
        <!--begin::Card body-->
        <el-table ref="multipleTableRef" :data="list" style="width: 100%"
          class-name="my-custom-table rounded-top cursor-pointer" table-layout="fixed" v-loading="loading"
          @selection-change="handleSelectionChange" :row-key="getRowKey"
          @row-click= "handleCurrentChange" :default-sort="{ prop: 'id', order: 'descending' }"
          @sort-change="handleSortChange">
          <template #empty>
            <div class="flex items-center justify-center h-100%">
              <el-empty description="Không có dữ liệu nào"/>
            </div>
          </template>

          <el-table-column label-class-name=" fs-13px fw-bold " type="selection" width="35" :reserve-selection="true" />

          <el-table-column width="60" label-class-name="fs-13px fw-bold text-dark" prop="id" label="ID">
            <template #default="scope">
              <span v-if="scope.row.id != ''" class="fs-13px text-gray-700 text-hover-primary">{{ scope.row.id
              }}</span>
              <span v-else class="badge badge-light-danger">--</span>
            </template>
          </el-table-column>

          <el-table-column label-class-name="fs-13px fw-bold text-dark" min-width="135" prop="title" label="NHÓM MỤC TIÊU">
            <template #default="scope">
              <span v-if="scope.row.title != ''" class="fs-13px text-gray-700 text-hover-primary">{{
                scope.row.title }}</span>
              <span v-else class="badge badge-light-danger">--</span>
            </template>
          </el-table-column>
          <el-table-column min-width="150" label-class-name="fs-13px fw-bold text-dark" prop="target_count" label="MỤC TIÊU">
            <template #default="scope">
              <span class="fs-13px text-gray-700 text-hover-primary">{{ scope.row.target_count ?? 0}}</span>
            </template>
          </el-table-column>

          <el-table-column min-width="150" label-class-name="fs-13px text-dark fw-bold" prop="flaw_count" label="LỖ HỔNG">
            <template #default="scope">
              <span class="fs-13px text-gray-700 text-hover-primary">{{ scope.row.flaw_count ?? 0}}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="140" label-class-name="fs-13px text-dark fw-bold" prop="service_count"
            label="DỊCH VỤ">
            <template #default="scope">
              <span class="fs-13px text-gray-700 text-hover-primary">{{scope.row.service_count ?? 0}}</span>
            </template>
          </el-table-column>
          <el-table-column width="150" label-class-name="text-dark fw-bold fs-13px " label="HÀNH ĐỘNG" align="center">
            <template #default="scope">
              <el-tooltip class="box-item" effect="dark" hide-after="0" content="Chỉnh Sửa" placement="top">
                <router-link :to="`/target-group-form/${scope.row.id}`" v-on:click.stop
                  class="btn btn-icon btn-bg-light btn-active-color-warning btn-sm me-1 my-1">
                  <KTIcon icon-name="pencil" icon-class="fs-3" />
                </router-link>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <div class="d-flex justify-content-between align-items-center mx-auto w-100 py-5 bg-white rounded-bottom ">
          <div>
            <span class="text-capitalize fs-13px">Tổng Số Nhóm Mục Tiêu: {{ totalPage }}</span>
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
    <div class="modal fade" tabindex="-1" ref="ModalDetail" aria-hidden="true" id="kt_modal_detail">
      <!--begin::Modal dialog-->
      <div class="modal-dialog modal-dialog-centered mw-650px">
        <!--begin::Modal content-->
        <div class="modal-content">
          <!--begin::Form-->
          <div class="modal-body">
            <!--begin::Card-->
            <div class="card card-flush">
              <!--begin::Card header-->
              <div class="card-header">
                <!--begin::Card title-->
                <div class="card-title">
                  <h1 class="fw-bold">{{ detailData.title }}</h1>
                </div>
              </div>
              <!--end::Card header-->

              <!--begin::Card body-->
              <div class="card-body py-0">
                <!--begin::Section-->
                <div>
                  <!--begin::Title-->
                  <h5>Thông Tin Chi Tiết:</h5>
                  <!--end::Title-->
                  <!--begin::Details-->
                  <div class="d-flex flex-wrap">
                    <!--begin::Row-->
                    <div class="flex-equal me-5">
                      <!--begin::Details-->
                      <table class="table fs-6 fw-semobold gs-0 gy-2 gx-2 m-0">
                        <!--begin::Row-->
                        <tr>
                          <td>Số Mục Tiêu:</td>
                          <td>{{ detailData.target_count ? detailData.target_count: 0 }} </td>
                        </tr>
                        <!--end::Row-->

                        <!--begin::Row-->
                        <tr>
                          <td>Số Lỗ Hổng:</td>
                          <td>{{ detailData.flaw_count ?? 0 }}</td>
                        </tr>
                        <!--end::Row-->
                        <!--begin::Row-->
                        <tr>
                          <td>Số Dịch Vụ:</td>
                          <td>{{ detailData.service_count ?? 0 }}</td>
                        </tr>
                        <!--end::Row-->
                        <!--begin::Row-->
                        <tr>
                          <td>Ngày Tạo:</td>
                          <td>{{ detailData.created_at }}</td>
                        </tr>
                        <!--end::Row-->
                        <!--begin::Row-->
                        <tr>
                          <td>Ngày Cập Nhật Cuối:</td>
                          <td>{{ detailData.modified_at }}</td>
                        </tr>
                        <!--end::Row-->
                      </table>
                      <!--end::Details-->
                      <!--begin::Label-->
                      <label for="description" class="fs-6 fw-semobold mb-2">Mô Tả:</label>
                      <!--end::Label-->
                      <!--begin::Input-->
                      <el-input v-model="detailData.description" disabled :rows="5" type="textarea" :placeholder="(detailData.description) ? '' : 'Chưa có mô tả'" />
                      <!--end::Input-->
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
          <div class="modal-footer" style="border-top: 0px; justify-content: center;">
              <button type="button" class="btn btn-sm btn-light-primary" data-bs-dismiss="modal">
                  Đóng
              </button>
          </div>
        </div>
        <!--end::Modal content-->
      </div>
      <!--end::Modal dialog-->
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive, watch, onUnmounted } from "vue";
import ApiService from "@/core/services/ApiService";
import KTToolbar from "@/views/apps/targets/reconWidgets/KTToolbar2.vue";

// validate
import { vue3Debounce } from 'vue-debounce';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ElTable, ElTableColumn, ElPagination } from 'element-plus';
import { useRouter } from 'vue-router';
import { Modal } from "bootstrap";
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
    const list = ref<object | any>([])
    const data_group = ref<object | any>([])
    const totalPage = ref<number>(0);
    const currentPage = ref<number>(1);
    const itemsPerPage = ref<number>(20);
    const query = ref<string>('');
    const orderingID = ref<string>('-id');
    const loading = ref<boolean>(false)
    const detailData = reactive({
      id: '',
      title: '',
      description: '',
      modified_at: '',
      service_count: '',
      target_count: '',
      created_at: '',
      flaw_count: '',
    });
    const ModalDetail = ref<null | HTMLElement>(null);
    const getData = async () => {
      loading.value = true;
      return ApiService.get(`targetgroup/index?search=${query.value}&page=${currentPage.value}&page_size=${itemsPerPage.value}&ordering=${orderingID.value}`)
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
        return ApiService.delete(`targetgroup/multi-delete?id=${ids}`)
          .then(({ data }) => {
            notification(data.detail, 'success', 'Xóa thành công')
            currentPage.value = 1;
            selectedIds.value = [];
            multipleTableRef.value!.clearSelection()
            getData()
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
    const router = useRouter();

    // handleCurrentChange
    const handleCurrentChange = (data: any) => {
      detailData.id = data.id
      detailData.title = data.title
      detailData.description = data.description
      detailData.modified_at = data.modified_at
      detailData.service_count = data.service_count
      detailData.target_count = data.target_count
      detailData.created_at = data.created_at
      detailData.flaw_count = data.flaw_count
      const modal = new Modal(
        document.getElementById("kt_modal_detail") as Element
      );
      modal.show();
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
    const urlAddNew = ref('target-group-form/add')

    // update the height
    const refGetTheHeight = ref<any>(null); // Ref to hold the div element
    const divHeight = ref(300); // Reactive variable to store the height with an initial value

    // Function to update the height
    function updateDivHeight() {
      if (refGetTheHeight.value) {
        divHeight.value = refGetTheHeight.value.clientHeight;
      }
    }


    const handleSortChange = (column: any) => {
      orderingID.value = (column.order == 'ascending' && column.prop == 'id') ? '-id' : 'id'
      getData()
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
      heightTable,
      handleSelectionChange,
      getRowKey,
      handleCurrentChange,
      multipleTableRef,
      urlAddNew,
      handleSortChange,
      deleteSubscription,
      detailData,
    };
  },
});
</script>