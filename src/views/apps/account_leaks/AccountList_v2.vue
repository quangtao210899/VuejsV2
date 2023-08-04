<template>
    <KTToolbar :addNew="urlAddNew" :modal-import="modalImport" :check-search="true" @handle-search="handleFilter" v-model:idsDelete="selectedIds"
    @handle-delete-selectd="deleteSubscription" :disabled="disabled" @on-header-height="onheaderHeight"></KTToolbar>
    <!--begin::Card-->
    <importAccountLeak ref="importComponentRef" 
        @notify="(info: string, noti_type: string, more_detail: string, hideImportModal) => notification(info, noti_type, more_detail, hideImportModal)" 
        @resetData="() => getData()"
        @confirm="(info: string, noti_type: string) => comfirmDownload(info, noti_type)"
    />
    <div class="app-container container-fluid" :style="{marginTop: headerHeight + 'px'}"> 
        <div class="p-5 bg-body rounded-3">
            <!--begin::Card body-->
            <el-table ref="multipleTableRef" :data="list" style="width: 100%;z-index: 1;"
                class-name="rounded-top cursor-pointer" table-layout="fixed"
                v-loading="loading" @selection-change="handleSelectionChange" highlight-current-row :row-key="getRowKey"
                @row-click="handleCurrentChange" :default-sort="{ prop: 'id', order: 'descending' }"
                @sort-change="handleSortChange">
                <template #empty>
                    <div class="flex items-center justify-center h-100%">
                        <el-empty description="Không có dữ liệu nào"/>
                    </div>
                </template>

                <el-table-column label-class-name=" fs-13px fw-bold " type="selection" width="35"
                    :reserve-selection="true" />

                <el-table-column width="60" label-class-name="fs-13px fw-bold text-dark" prop="id" label="ID" >
                    <template #default="scope">
                        <span v-if="scope.row.id" class="fs-13px text-gray-700 text-hover-primary">{{ scope.row.id }}</span>
                        <span v-else class="badge badge-light-danger">--</span>
                    </template>
                </el-table-column>

                <el-table-column label-class-name="fs-13px fw-bold text-dark" min-width="120" prop="username" label="USERNAME">
                    <template #default="scope">
                        <span v-if="scope.row.username != null" class="fs-13px text-gray-700 text-hover-primary">{{
                            scope.row.username }}</span>
                        <span v-else class="badge badge-light-danger">--</span>
                    </template>
                </el-table-column>
                <el-table-column min-width="150" label-class-name="fs-13px fw-bold text-dark"  prop="email" label="EMAIL">
                    <template #default="scope">
                        <span v-if="scope.row.email != ''" class="fs-13px text-gray-700 text-hover-primary">
                            {{ scope.row.email }}
                        </span>
                        <span v-else class="badge badge-light-danger">--</span>
                    </template>
                </el-table-column>
                <el-table-column min-width="150" label-class-name="fs-13px text-dark fw-bold" prop="password_hash" label="PASSWORD HASH">
                    <template #default="scope">
                        <span v-if="scope.row.password_hash != null" class="fs-13px text-gray-700 text-hover-primary">
                            {{ truncateText(scope.row.password_hash ?? "", 25) }}
                        </span>
                        <span v-else class="badge badge-light-danger">--</span>
                    </template>
                </el-table-column>
                <el-table-column min-width="140" label-class-name="fs-13px text-dark fw-bold" prop="password_crack" label="PASSWORD CRACK">
                    <template #default="scope">
                        <span v-if="scope.row.password_crack" class="fs-13px text-gray-700 text-hover-primary">{{ truncateText(scope.row.password_crack ?? '', 50) }}</span>
                        <span v-else class="badge badge-light-danger">--</span>
                    </template>
                </el-table-column>
                <el-table-column min-width="140" label-class-name="fs-13px text-dark fw-bold" prop="source_data" label="NGUỒN DỮ LIỆU">
                    <template #default="scope">
                        <span v-if="scope.row.source_data" class="fs-13px text-gray-700 text-hover-primary">{{ truncateText(scope.row.source_data ?? '', 50) }}</span>
                        <span v-else class="badge badge-light-danger">--</span>
                    </template>
                </el-table-column>
                <el-table-column min-width="140" label-class-name="fs-13px text-dark fw-bold" prop="country" label="QUỐC GIA">
                    <template #default="scope">
                        <span v-if="scope.row.country" class="fs-13px text-gray-700 text-hover-primary">{{ truncateText(scope.row.country ?? '', 50) }}</span>
                        <span v-else class="badge badge-light-danger">--</span>
                    </template>
                </el-table-column>
                <el-table-column width="150" label-class-name="text-dark fw-bold fs-13px " label="HÀNH ĐỘNG" align="center">
                    <template #default="scope">
                        <el-tooltip class="box-item" effect="dark" :hide-after="0" content="Chỉnh Sửa" placement="top">
                            <router-link :to="`/account-leaks-form/${scope.row.id}`" v-on:click.stop
                                class="btn btn-icon btn-bg-light btn-active-color-warning btn-sm me-1 my-1">
                                <KTIcon icon-name="pencil" icon-class="fs-3" />
                            </router-link>
                        </el-tooltip>
                    </template>
                </el-table-column> 
            </el-table>
            <div class="d-flex justify-content-between align-items-center mx-auto w-100 py-5 bg-white rounded-bottom ">
                <div v-if="totalPage > 0" >
                    <span class="text-capitalize fs-13px">Tổng Số CVE: {{ totalPage }}</span>
                </div>
                <el-pagination background v-model:current-page="currentPage" :hide-on-single-page="true"
                    v-model:page-size="itemsPerPage" :total="totalPage"
                    layout="prev, pager, next" :disabled="disabled" ></el-pagination>
                    <div></div>
            </div>
        </div>
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
import importAccountLeak from "@/views/apps/account_leaks/components/importButton.vue";
type ImportAccountLeakType = typeof importAccountLeak;
import { useRouter } from 'vue-router';

export default defineComponent({
    name: "kt-target-list",

    components: {
        ElTable,
        ElTableColumn,
        KTToolbar,
        ElPagination,
        importAccountLeak,
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
        const search_group = ref<string>('');
        const orderingID = ref<string>('-id');
        const loading = ref<boolean>(false)
        const importComponentRef = ref<null | ImportAccountLeakType>(null);

        const getData = async () => {
            loading.value = true;
            // return ApiService.get(`account-leak/index?search=${query.value}&country_id=${search_country.value}&page=${currentPage.value}&page_size=${itemsPerPage.value}&ordering=${orderingID.value}`)
            return ApiService.get(`account-leak/index?search=${query.value}&page=${currentPage.value}&page_size=${itemsPerPage.value}&ordering=${orderingID.value}`)
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
            let formData = {
                'id': ids
            }
            if (ids) {
                disabled.value = true
                setTimeout(() => {
                    disabled.value = false
                }, 1000);
                return ApiService.post(`account-leak/delete`, formData)
                    .then(({ data }) => {
                        getData()
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

        const notification = (values: string, icon: string, more: string = '', hideImportModal: boolean = true) => {
            Swal.fire({
                text: values ?? more,
                icon: icon,
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: (icon == 'error') ? "Thử Lại" : "Đồng Ý",
                heightAuto: false,
                customClass: {
                    confirmButton: (icon == 'error') ? "btn btn-light-danger" : "btn btn-light-primary",
                },
            }).then(() => {
                if (importComponentRef.value && hideImportModal) {
                    importComponentRef.value.closeModal()
                }
            });
        }

        const downloadFile = async () => {
            try {
                const response = await ApiService.query(`account-leak/import`, {
                    responseType: 'blob'
                })

                const fileData = response.data;
                const fileBlob = new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

                const fileUrl = URL.createObjectURL(fileBlob);

                const link = document.createElement('a');
                link.href = fileUrl;
                const now = new Date();
                const hours = now.getHours();
                const minutes = now.getMinutes();
                const day = now.getDate();
                const month = now.getMonth() + 1; // Tháng bắt đầu từ 0, nên cần +1
                const year = now.getFullYear();
                link.download = `chi_tiết_lỗi_${hours}h${minutes}p_${day}-${month}-${year}.xlsx`;
                link.click();

                // Giải phóng đường dẫn URL sau khi hoàn thành
                URL.revokeObjectURL(fileUrl);
            } catch (error: any) {
                notification(error.detail ?? 'Lỗi khi tải file', 'error')
                console.error('Lỗi khi tải file:', error);
            }
        }

        const comfirmDownload = (values: string, icon: string) => {
            Swal.fire({
                text: values,
                icon: icon,
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: 'Tải File Lỗi',
                cancelButtonText: 'Hủy Bỏ',
                heightAuto: false,
                customClass: {
                    confirmButton: "btn btn-light-primary",
                    cancelButton: "btn btn-light-danger"
                },
            }).then(() => {
                downloadFile()
                if (importComponentRef.value) {
                    importComponentRef.value.closeModal()
                }
            });
        };

        const handleFilter = (data: any) => {
            query.value = data;
            currentPage.value = 1;
            getData();
        };

        // xóa 
        const multipleTableRef = ref<InstanceType<typeof ElTable>>()
        const router = useRouter();

        const handleCurrentChange = (data: any) => {
            if (data) {
                return router.push({ name: 'scanCVEList', params: { id: data.id } });
            }

            return;
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

        // thay đổi kích thước header
        const headerHeight = ref<number>(0);
        const onheaderHeight = (height: number) => {
            headerHeight.value = height
            
        }
        const truncateText = (text: string, maxLength: number) => {
            if (text.length > maxLength) {
                return text.substring(0, maxLength) + '...';
            }
            return text;
        };
        // thêm mới
        const urlAddNew = ref('account-leaks-form/add')
        const modalImport = '#kt_modal_1'

        const handleSortChange = (column: any) => {
            orderingID.value = (column.order == 'ascending' && column.prop == 'id') ? '-id' : 'id'
            getData()
        }

        onMounted(() => {
            getData();
        });

        return {
            getData,
            list,
            selectedIds,

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

            // đo chiều cao header
            onheaderHeight,
            headerHeight,

            //
            handleSelectionChange,
            getRowKey,
            handleCurrentChange,
            multipleTableRef,
            urlAddNew,
            modalImport,
            handleSortChange,
            deleteSubscription,
            truncateText,
            notification,
            comfirmDownload,
        };
    },
});
</script>