<template>
    <KTToolbar :addNew="urlAddNew" @handle-search="handleFilter" v-model:idsDelete="selectedIds" @handle-delete-selectd="deleteSubscription" :disabled="disabled"></KTToolbar>
    <!--begin::Card-->
    <div class="app-container container-fluid">
        <div class="card h-100 d-block">
            <!--end::Card header-->
            <div class="card-header flex-wrap border-0 pt-3 pb-0 px-5">
                <div class="card-title">
                    <h3 class="card-label">
                        Quản lý mục tiêu
                        <span class="d-block text-muted pt-2 fs-7">Danh sách các mục tiêu target</span>
                    </h3>
                </div>
            </div>

            <!--begin::Card body-->
            <div class="h-100 w-100 p-0 m-0 px-5">
                <el-table ref="multipleTableRef" :data="list" style="width: 100%" class-name="my-custom-table rounded-top"
                    :height="heightTable" table-layout="fixed" v-loading="loading" @selection-change="handleSelectionChange"
                    highlight-current-row :row-key="getRowKey" @current-change="handleCurrentChange" 
                    :default-sort="{ prop: 'id', order: 'descending' }" @sort-change="handleSortChange">
                    <template #empty>
                        <div class="flex items-center justify-center h-100%">
                            <el-empty />
                        </div>
                    </template>

                    <el-table-column label-class-name=" fs-7 fw-bold" type="selection" width="35"
                        :reserve-selection="true" />

                    <el-table-column min-width="40" sortable label-class-name=" fs-7 fw-bold" prop="id" label="ID">
                        <template #default="scope">
                            <span v-if="scope.row.id != ''" class="text-gray-600 text-hover-primary">{{ scope.row.id }}</span>
                            <span v-else class="badge badge-light-danger">--</span>
                        </template>
                    </el-table-column>

                    <el-table-column label-class-name=" fs-7 fw-bold" prop="name" label="TÊN MỤC TIÊU">
                        <template #default="scope">
                            <span v-if="scope.row.name != ''" class="text-dark text-hover-primary">{{ scope.row.name}}</span>
                            <span v-else class="badge badge-light-danger">--</span>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="100" label-class-name=" fs-7 fw-bold" prop="ip" label="IP">
                        <template #default="scope">
                            <span v-if="scope.row.ip != ''" class="text-gray-600 text-hover-primary">{{ scope.row.ip }}</span>
                            <span v-else class="badge badge-light-danger">--</span>
                        </template>
                    </el-table-column>

                    <el-table-column min-width="90" label-class-name=" fs-7 fw-bold" prop="domain" label="DOMAIN">
                        <template #default="scope">
                            <span v-if="scope.row.domain != ''" class="text-gray-600 text-hover-primary ">{{ scope.row.domain }}</span>
                            <span v-else class="badge badge-light-danger">--</span>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="90" label-class-name=" fs-7 fw-bold" prop="group"
                        label="NHÓM MỤC TIÊU">
                        <template #default="scope">
                            <span v-if="scope.row.title != ''" class="text-gray-600 text-hover-primary">{{ scope.row.group.title }}</span>
                            <span v-else class="badge badge-light-danger">--</span>
                        </template>
                    </el-table-column>
                    <el-table-column min-width="60" label-class-name=" fs-7 fw-bold" label="HÀNH ĐỘNG">
                        <template #default="scope">
                            <el-tooltip class="box-item" effect="dark" hide-after="0" content="Chỉnh sửa" placement="top">
                                <router-link :to="`/target-detail/${scope.row.id}`"
                                    class="btn btn-icon btn-bg-light btn-active-color-warning btn-sm me-1 my-1">
                                    <KTIcon icon-name="pencil" icon-class="fs-3" />
                                </router-link>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="d-flex justify-content-center mx-auto w-100 py-5 bg-white rounded-bottom ">
                    <el-pagination v-if="list.length > 0" background v-model:current-page="currentPage" v-model:page-size="itemsPerPage"
                        :total="totalPage"
                        :layout="(checkPaginationTable) ? 'prev, pager, next' : 'total, sizes, prev, pager, next, jumper'"
                        :pager-count="(checkPaginationTable) ? 5 : 6" :disabled="disabled"
                        :page-sizes="(checkPaginationTable) ? [] : [10, 20, 30, 40, 50]"></el-pagination>
                </div>
            </div>
            <!--end::Card body-->
        </div>
    </div>

    <!--end::Card-->
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive, watch, onUnmounted } from "vue";
import ApiService from "@/core/services/ApiService";
import KTToolbar from "@/views/apps/targets/reconWidgets/KTToolbar2.vue";

// validate
import { vue3Debounce } from 'vue-debounce';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ElTable, ElTableColumn } from 'element-plus';

export default defineComponent({
    name: "kt-target-list",

    components: {
        ElTable,
        ElTableColumn,
        KTToolbar,
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
        const search_group = ref<string>('');
        const orderingID = ref<string>('id');
        const detailData = reactive({
            id: '',
            name: '',
            ip: '',
            domain: '',
            group_id: '',
            group_title: '',
            modified_at: '',
            created_at: '',
        });
        const loading = ref<boolean>(false)

        const getData = async () => {
            loading.value = true;
            // setTimeout(() => loading.value = false, 500)
            return ApiService.get(`targets?search_target=${query.value}&search_target_group=${search_group.value}&page=${currentPage.value}&page_size=${itemsPerPage.value}&ordering=${orderingID.value}`)
                .then(({ data }) => {
                    list.value = data.results
                    totalPage.value = data.count
                    // console.log(data.results)
                })
                .catch(({ response }) => {
                    notification(response.data.detail, 'error', 'Có lỗi xảy ra')
                })
                .finally(() => {
                    loading.value = false
                })
        }

        const getDataGroup = async () => {
            loading.value = true;
            return ApiService.get(`targetgroup/list/`)
                .then(({ data }) => {
                    data_group.value = data
                })
                .catch(({ response }) => {
                    notification(response.data.detail, 'error', 'Có lỗi xảy ra')
                })
                .finally(() => {
                    loading.value = false
                });
        }

        const selectedIds = ref<Array<number>>([]);
        const disabled = ref<boolean>(false);
        const deleteSubscription = (ids: Array<number>) => {
            if (ids) {
                disabled.value = true
                setTimeout(() => {
                    disabled.value = false
                }, 1000);
                return ApiService.delete(`targets/multi-delete?id=${ids}`)
                    .then(({ data }) => {
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
                confirmButtonText: "Đồng ý!",
                heightAuto: false,
                customClass: {
                    confirmButton: "btn btn-primary",
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
        const DialogVisibleDetail = ref<boolean>(false)
        const handleCurrentChange = (val: any, index) => {
            // console.log(val)
            // if (val) {
            //     DialogVisibleDetail.value = true
            //     detailData.id = val.id
            //     detailData.username = val.username
            //     detailData.date = val.date
            //     detailData.text = val.text
            //     detailData.phone = val.phone
            //     detailData.group_name = val.group_name
            // }
            return
        }

        // table
        const handleSelectionChange = (val: any) => {
            if (val) {
                selectedIds.value = val.map((item: { id: number }) => item.id);
            }else{
                selectedIds.value = [];
            }
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
                heightTable.value = window.innerHeight - 290;
                checkPaginationTable.value = false
            } else if (windowWidth >= 1200) {
                heightTable.value = window.innerHeight - 290;
                checkPaginationTable.value = false
            } else if (windowWidth >= 992) {
                heightTable.value = window.innerHeight - 290;
                checkPaginationTable.value = false
            } else if (windowWidth >= 768) {
                heightTable.value = window.innerHeight - 265;
                checkPaginationTable.value = false
            } else if (windowWidth >= 576) {
                heightTable.value = window.innerHeight - 265;
                checkPaginationTable.value = true
            } else {
                // Kích thước cửa sổ nhỏ hơn 576px, đặt giá trị mặc định
                heightTable.value = window.innerHeight - 265;
                checkPaginationTable.value = true
            }
        };
        // thêm mới
        const urlAddNew = ref('urlAddNew')

        const handleSortChange = (column: any) => {
            orderingID.value = (column.order == 'ascending' && column.prop == 'id') ? '-id' : 'id'
            getData()
        }

        onMounted(() => {
            getData();
            getDataGroup();
            handleResize();
            window.addEventListener('resize', handleResize);
        });

        onUnmounted(() => {
            window.removeEventListener('resize', handleResize);
        });

        return {
            getData,
            getDataGroup,
            list,
            selectedIds,

            // validate
            data_group,
            detailData,

            // page 
            itemsPerPage,
            totalPage,
            currentPage,

            // search query 
            query,
            search_group,
            handleFilter,

            // edit 
            loading,
            disabled,

            //
            handleResize,
            checkPaginationTable,
            heightTable,
            handleSelectionChange,
            getRowKey,
            handleCurrentChange,
            multipleTableRef,
            urlAddNew,
            handleSortChange,
            deleteSubscription,
        };
    },
});
</script>
<style >
.my-custom-table td.el-table__cell {
    border-bottom-style: dashed !important;
}</style>