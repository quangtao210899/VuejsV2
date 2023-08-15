<template>
    <div ref="refGetTheHeight">
        <KTToolbar :addNew="urlAddNew" :check-search="true" @handle-search="handleFilter" v-model:idsDelete="selectedIds"
            @handle-delete-selectd="deleteSubscription" :disabled="disabled" @on-header-height="onheaderHeight" :selected-name="selectedName" title="Người Dùng"></KTToolbar>
    </div>
    <!--begin::Card-->
    <el-scrollbar :height="heightTable">
        <div class="app-container container-fluid" :style="{marginTop: headerHeight + 'px'}">
            <div class="p-5 bg-body rounded-3">
                <!--begin::Card body-->
                <el-table ref="multipleTableRef" :data="list" style="width: 100%;z-index: 1;"
                    class-name="my-custom-table rounded-top cursor-pointer" table-layout="fixed" v-loading="loading" element-loading-text="Đang Tải..." element-loading-background="rgb(255 255 255 / 25%)"
                    @selection-change="handleSelectionChange" :row-key="getRowKey" @row-click="handleCurrentChange"
                    :default-sort="{ prop: 'id', order: 'descending' }" @sort-change="handleSortChange">
                    <template #empty>
                        <div class="flex items-center justify-center h-100%">
                            <el-empty description="Không có dữ liệu nào"/>
                        </div>
                    </template>

                    <el-table-column label-class-name=" fs-13px fw-bold " type="selection" width="35"
                        :reserve-selection="true" />

                    <el-table-column width="80" label-class-name="fs-13px fw-bold text-dark" prop="id" label="ID">
                        <template #default="scope">
                            <span v-if="scope.row.id != ''" class="fs-13px text-gray-700 text-hover-primary">{{ scope.row.id
                            }}</span>
                            <span v-else class="badge badge-light-danger">--</span>
                        </template>
                    </el-table-column>

                    <el-table-column label-class-name="fs-13px fw-bold text-dark" min-width="120" prop="first_name"
                        label="HỌ TÊN">
                        <template #default="scope">
                            <span v-if="scope.row.first_name != ''" class="fs-13px text-gray-700 text-hover-primary">{{
                                scope.row.first_name }}</span>
                            <span v-else class="badge badge-light-danger">--</span>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="150" label-class-name="fs-13px fw-bold text-dark" prop="username"
                        label="TÊN NGƯỜI DÙNG">
                        <template #default="scope">
                            <span v-if="scope.row.username != ''" class="fs-13px text-gray-700 text-hover-primary">{{
                                scope.row.username }}</span>
                            <span v-else class="badge badge-light-danger">--</span>
                        </template>
                    </el-table-column>
                    <el-table-column width="150" label-class-name="text-dark fw-bold fs-13px " label="HÀNH ĐỘNG"
                        align="center">
                        <template #default="scope">
                            <el-tooltip class="box-item" effect="dark" :hide-after="0" content="Chỉnh Sửa" placement="top">
                                <router-link :to="`/user-form/${scope.row.id}`" v-on:click.stop
                                    class="btn btn-icon btn-bg-light btn-active-color-warning btn-sm me-1 my-1">
                                    <KTIcon icon-name="pencil" icon-class="fs-3" />
                                </router-link>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="d-flex justify-content-between align-items-center mx-auto w-100 py-5 bg-white rounded-bottom ">
                    <div>
                        <span v-if="totalPage > 0" class="text-capitalize fs-13px">Tổng Số Người Dùng: {{ totalPage }}</span>
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
        <div class="modal-dialog modal-dialog-centered mw-600px">
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
                                <h1 class="fw-bold">{{ detailData.username }}</h1>
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
                                                <td>Họ Tên:</td>
                                                <td>{{ detailData.first_name }} </td>
                                            </tr>
                                            <!--end::Row-->

                                            <!--begin::Row-->
                                            <tr>
                                                <td>Phân Quyền:</td>
                                                <td>{{ detailData.is_staff ? 'Quản trị viên' : 'Người dùng' }}</td>
                                            </tr>
                                            <!--end::Row-->
                                            <!--begin::Row-->
                                            <tr>
                                                <td>Ngày Tạo:</td>
                                                <td>{{ detailData.date_joined }}</td>
                                            </tr>
                                            <!--end::Row-->
                                            <!--begin::Row-->
                                            <tr>
                                                <td>Lần Đăng Nhập Cuối:</td>
                                                <td v-if="detailData.last_login">{{ detailData.last_login }}</td>
                                                <td v-else><span class="badge badge-light-danger">--</span></td>
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
import { Modal } from "bootstrap";
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
            first_name: '',
            date_joined: '',
            last_login: '',
            is_staff: false,
        });
        const getData = async () => {
            loading.value = true;
            return ApiService.get(`user?query=${query.value}&page=${currentPage.value}&page_size=${itemsPerPage.value}&orderingID=${orderingID.value}`)
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
                return ApiService.delete(`user/multi-delete?id=${ids}`)
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

        // handleCurrentChange
        const handleCurrentChange = (data: any) => {
            DialogVisibleDetail.value = true
            detailData.username = data.username
            detailData.first_name = data.first_name
            detailData.date_joined = data.date_joined
            detailData.last_login = data.last_login
            detailData.is_staff = data.is_staff
            const modal = new Modal(
                document.getElementById("kt_modal_detail") as Element
            );
            modal.show();
        }

        // table
        const selectedName = ref<Array<any>>([]);
        const handleSelectionChange = (val: any) => {
            // console.log(val)
            if (val) {
                selectedName.value = val.map((item: any) => item.name || item.title || item.first_name);
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
        const urlAddNew = ref('user-form/add')
        const truncateText = (text: string, maxLength: number) => {
            if (text.length > maxLength) {
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
            getRowKey,
            handleCurrentChange,
            multipleTableRef,
            urlAddNew,
            handleSortChange,
            deleteSubscription,
            detailData,
            DialogVisibleDetail,
            selectedName
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

.dialog-footer {
    display: flex;
    justify-content: center;
    /* Căn giữa theo chiều dọc và ngang */
}
</style>