<template>
    <div ref="refGetTheHeight">
        <KTToolbar :addNew="urlAddNew" :check-search="true" @handle-search="handleFilter" v-model:idsDelete="selectedIds"
        @handle-delete-selectd="deleteSubscription" :disabled="disabled" @on-header-height="onheaderHeight" :selected-name="selectedName" title="lần Recon"></KTToolbar>
    </div>
    <!--begin::Card-->
    <div class="app-container container-fluid" :style="{marginTop: headerHeight + 'px'}">
        <div class="p-5 bg-body rounded-3">
            <!--begin::Card body-->
            <el-table ref="multipleTableRef" :data="list" style="width: 100%;z-index: 1;"
                    class-name="my-custom-table cursor-pointer" table-layout="fixed"
                    v-loading="loading" element-loading-text="Đang Tải..." element-loading-background="rgb(255 255 255 / 25%)" @selection-change="handleSelectionChange" highlight-current-row :row-key="getRowKey"
                    @current-change="handleCurrentChange" :default-sort="{ prop: 'id', order: 'descending' }"
                    @sort-change="handleSortChange">
                    <template #empty>
                        <div class="flex items-center justify-center h-100%">
                            <el-empty description="Không có dữ liệu nào" />
                        </div>
                    </template>

                    <el-table-column label-class-name=" fs-13px fw-bold " type="selection" width="35"
                        :reserve-selection="true" />

                    <el-table-column min-width="35px" width="150" label-class-name="fs-13px fw-bold text-dark" prop="id" label="ID" >
                        <template #default="scope">
                            <span v-if="scope.row.id != ''" class="fs-13px text-gray-700 text-hover-primary">{{ scope.row.id
                            }}</span>
                            <span v-else class="badge badge-light-danger">--</span>
                        </template>
                    </el-table-column>

                    <el-table-column label-class-name="fs-13px fw-bold text-dark" prop="usernamename" label="TÊN ĐĂNG NHẬP" min-width="140px" >
                        <template #default="scope">
                            <span v-if="scope.row.user != ''" class="fs-13px text-gray-700 text-hover-primary">{{
                                scope.row.user.username }}</span>
                            <span v-else class="badge badge-light-danger">--</span>
                        </template>
                    </el-table-column>
                    <el-table-column label-class-name="fs-13px fw-bold text-dark"  prop="created_at" label="THỜI GIAN BẮT ĐẦU" min-width="170px">
                        <template #default="scope">
                            <span v-if="scope.row.created_at != ''" class="fs-13px text-gray-700 text-hover-primary">
                                <i class="fa-solid fa-calendar-days fs-7"></i>
                                {{ scope.row.created_at}}</span>
                            <span v-else class="badge badge-light-danger">--</span>
                        </template>
                    </el-table-column>

                    <el-table-column label-class-name="fs-13px text-dark fw-bold" prop="modified_at" label="THỜI GIAN KẾT THÚC" min-width="170px">
                        <template #default="scope">
                            <span v-if="scope.row.modified_at != '' && [3,4,5,6].includes(scope.row.status)" class="fs-13px text-gray-700 text-hover-primary">
                                <i class="fa-solid fa-calendar-days fs-7"></i>
                                {{ scope.row.modified_at }}</span>
                            <span v-else class="badge badge-light-danger">--</span>
                        </template>
                    </el-table-column>
                    <el-table-column label-class-name="fs-13px text-dark fw-bold" prop="status" label="TRẠNG THÁI"  min-width="150px">
                        <template #default="scope">
                            <span v-if="scope.row.status != ''" :class="`fs-12px py-3 px-4 badge badge-light-${getStatus(scope.row.status).color}`">{{
                                scope.row.status_name }}</span>
                            <span v-else class="badge badge-light-danger">--</span>
                            
                        </template>
                    </el-table-column>
                </el-table>
                <div class="d-flex justify-content-between align-items-center mx-auto w-100 py-5 bg-body rounded-bottom ">
                    <div v-if="totalPage > 0" >
                        <span class="text-capitalize fs-13px">Tổng Số Lần Recon: {{ totalPage }}</span>
                    </div>
                    <el-pagination background v-model:current-page="currentPage" :hide-on-single-page="true"
                        v-model:page-size="itemsPerPage" :total="totalPage"
                        layout="prev, pager, next" :disabled="disabled" ></el-pagination>
                        <div></div>
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
import { useRoute } from 'vue-router';

// validate
import { vue3Debounce } from 'vue-debounce';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ElTable, ElTableColumn, ElPagination } from 'element-plus';
import { useRouter } from 'vue-router';

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
        const filterStatus = ref<String | null>('');
        const query = ref<string>('');
        const search_group = ref<string>('');
        const orderingID = ref<string>('-id');
        const loading = ref<boolean>(false)

        const route = useRoute();
        const reconID = ref<null | number | any>(route.params.id ?? '');

        const getData = async () => {
            loading.value = true;
            return ApiService.get(`/recon/${reconID.value}/target?search_recon=${query.value}&search_status=${filterStatus.value}&page=${currentPage.value}&page_size=${itemsPerPage.value}&ordering=${orderingID.value}`)
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

        const selectedIds = ref<Array<number>>([]);
        // const deleteSelectd = () => {
        //     ElMessageBox.confirm(
        //         'Tập tin sẽ được xóa vĩnh viễn. Tiếp tục?',
        //         'Xác Nhận Xóa',
        //         {
        //             confirmButtonText: 'Đồng Ý',
        //             cancelButtonText: 'Hủy Bỏ',
        //             type: 'warning',
        //             icon: markRaw(Delete)
        //         }
        //     )
        //         .then(() => {
        //             deleteSubscription(selectedIds.value);
        //         })
        //         .catch(() => {

        //         })
        // };
        const disabled = ref<boolean>(false);
        const deleteSubscription = (ids: Array<number>) => {
            if (ids) {
                disabled.value = true
                setTimeout(() => {
                    disabled.value = false
                }, 1000);
                return ApiService.delete(`recon/multi-delete?id=${ids}`)
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

        const getStatus = (status: number | string) => {
            if (status == 1) {
                return { color: 'default' };
            } else if (status == 2) {
                return { color: 'primary' };
            } else if (status == 3) {
                return { color: 'success' };
            } else if (status == 4) {
                return { color: 'danger' };
            }
            return { color: 'warning' };
        };

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
            if (data) {
                return router.push({ name: 'target-recon-tab', params: { id: data.id, idRecon: reconID.value } });
            }
            return;
        }

        // table
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
        const urlAddNew = ref(reconID.value + '/add')        

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

        // thay đổi kích thước header
        const headerHeight = ref<number>(0);
        const onheaderHeight = (height: number) => {
            headerHeight.value = height
            
        }

        onMounted(() => {
            getData();
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
            search_group,
            handleFilter,

            // edit 
            loading,
            disabled,

            //
            handleSelectionChange,
            selectedName,
            getRowKey,
            handleCurrentChange,
            multipleTableRef,
            urlAddNew,
            handleSortChange,
            deleteSubscription,
            reconID,
            getStatus,
        };
    },
});
</script>