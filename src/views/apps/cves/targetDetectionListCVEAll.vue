<template>
    <KTToolbar :check-search="true" @handle-search="handleFilter" v-model:idsDelete="selectedIds" :check-export-file="true"
        @handle-export-file="onExportFile" @handle-delete-selectd="deleteSubscription" :disabled="disabled"
        @on-header-height="onheaderHeight" :selected-name="selectedName" title="Kết Quả" :cve-code="cve_code"></KTToolbar>
    <div class="app-container container-fluid " :style="{ marginTop: headerHeight + 'px' }">
        <div class="p-5 bg-body rounded-3">
            <el-table ref="multipleTableRef" :data="list" style="width: 100%;z-index: 1;"
                class-name="rounded-top cursor-pointer" table-layout="fixed" v-loading="loading" element-loading-text="Đang Tải..." element-loading-background="rgb(255 255 255 / 25%)"
                @selection-change="handleSelectionChange" highlight-current-row :row-key="getRowKey"
                @row-click="customRowTable">
                <template #empty>
                    <div class="flex items-center justify-center h-100%">
                        <el-empty description="Không có dữ liệu nào" />
                    </div>
                </template>

                <el-table-column label-class-name=" fs-13px fw-bold" type="selection" :width="35"
                    :reserve-selection="true" />

                <el-table-column :width="70" label-class-name=" text-dark fs-13px fw-bold " prop="id" label="ID">
                    <template #default="scope">
                        <span v-if="scope.row.index != ''" class="fs-13px text-gray-700 text-hover-primary">
                            {{ scope.row.index }}
                        </span>
                        <span v-else class="badge badge-light-danger">--</span>
                    </template>
                </el-table-column>

                <el-table-column label-class-name=" text-dark fs-13px fw-bold" :min-width="100" prop="ip" label="IP">
                    <template #default="scope">
                        <span v-if="scope.row.ip != ''" class="fs-13px text-gray-700 text-hover-primary">
                            {{ scope.row.ip }}
                        </span>
                        <span v-else class="badge badge-light-danger">--</span>
                    </template>
                </el-table-column>

                <el-table-column :min-width="70" label-class-name=" text-dark fs-13px fw-bold" prop="port" label="PORT">
                    <template #default="scope">
                        <span v-if="scope.row.port != ''" class="fs-13px text-gray-700 text-hover-primary">
                            {{ scope.row.port }}</span>
                        <span v-else class="badge badge-light-danger">--</span>
                    </template>
                </el-table-column>
                <el-table-column :min-width="150" label-class-name=" text-dark fs-13px fw-bold" prop="hostnames"
                    label="HOST NAMES">
                    <template #default="scope">
                        <template v-if="scope.row.hostnames != ''">
                            <span v-for="(value, index) in scope.row.hostnames" :key="index"
                                class="fs-7 px-4 py-3 badge badge-light-primary text-start my-1 me-2"
                                style="white-space: pre-line;">
                                {{ value }}
                            </span>
                        </template>
                        <template v-else>
                            <span class="badge badge-light-danger">--</span>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column :min-width="100" label-class-name=" text-dark fs-13px fw-bold" prop="country"
                    label="QUỐC GIA">
                    <template #default="scope">
                        <span v-if="scope.row.country != ''" class="fs-13px text-gray-700 text-hover-primary">
                            <i class="fa-solid fa-globe"></i>
                            {{ scope.row.country }}</span>
                        <span v-else class="badge badge-light-danger">--</span>
                    </template>
                </el-table-column>
                <el-table-column :min-width="170" label-class-name=" text-dark fs-13px fw-bold" prop="org" label="TỔ CHỨC">
                    <template #default="scope">
                        <span v-if="scope.row.org != ''" class="fs-13px text-gray-700 text-hover-primary">
                            {{ scope.row.org }}</span>
                        <span v-else class="badge badge-light-danger">--</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="d-flex justify-content-between align-items-center mx-auto w-100 py-5 bg-body rounded-bottom ">
                <div v-if="totalPage > 0">
                    <span class="text-capitalize fs-13px">Tổng Số Kết Quả: {{ totalPage }}</span>
                </div>
                <el-pagination background v-model:current-page="currentPage" :hide-on-single-page="true"
                    v-model:page-size="itemsPerPage" :total="totalPage" layout="prev, pager, next"
                    :disabled="disabled"></el-pagination>
                <div></div>
            </div>
        </div>
    </div>


    <!-- modal detail  -->
    <el-dialog v-model="DialogVisibleDetail" :title="detailData.ip" width="650" id="modal-detail" align-center
        modal-class="" :show-close="false">
        <div class="modal-body p-0">
            <div class="card card-flush">
                <div class="card-body py-0">
                    <div class="mb-10 fs-13px">
                        <h5>Thông Tin Chi Tiết:</h5>

                            <!--begin::Row-->
                            <div class="me-5">
                                <!--begin::Details-->
                                <div>
                                    <div class="row fs-6 mb-3 fs-13px">
                                        <div class="col-3 text-gray-900 text-capitalize">Port:</div>
                                        <div class="col-9 text-gray-900">
                                            <span v-if="detailData.port != ''"
                                                class="fs-13px text-gray-700 text-hover-primary">
                                                {{ detailData.port }}</span>
                                            <span v-else class="badge badge-light-danger">--</span>
                                        </div>
                                    </div>
                                    <div class="row fs-6 mb-3 fs-13px">
                                        <div class="col-3 text-gray-900 text-capitalize">Hostnames:</div>
                                        <div class="col-9 text-gray-900">
                                            <template v-if="detailData.hostnames.length != 0">
                                                <span v-for="(value, index) in detailData.hostnames" :key="index"
                                                    class="px-4 py-3 badge badge-light-primary my-1 me-2">
                                                    {{ value }}
                                                </span>
                                            </template>
                                            <template v-else>
                                                <span class="badge badge-light-danger">--</span>
                                            </template>
                                        </div>
                                    </div>
                                    <div class="row fs-6 mb-3 fs-13px">
                                        <div class="col-3 text-gray-900 text-capitalize">Quốc gia:</div>
                                        <div class="col-9 text-gray-900">
                                            <span v-if="detailData.country != ''"
                                                class="fs-13px text-gray-700 text-hover-primary">
                                                {{ detailData.country }}</span>
                                            <span v-else class="badge badge-light-danger">--</span>
                                        </div>
                                    </div>
                                    <div class="row fs-6 mb-3 fs-13px">
                                        <div class="col-3 text-gray-900 text-capitalize">Tổ chức:</div>
                                        <div class="col-9 text-gray-900">
                                            <span v-if="detailData.org != ''"
                                                class="fs-13px text-gray-700 text-hover-primary">
                                                {{ detailData.org }}</span>
                                            <span v-else class="badge badge-light-danger">--</span>
                                        </div>
                                    </div>
                                </div>
                                <!--end::Details-->
                            </div>
                            <!--end::Row-->
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-center">
                <button type="button" class="btn btn-sm btn-light-primary fs-13px" @click="DialogVisibleDetail = false">
                    Đóng
                </button>
            </div>
        </div>
    </el-dialog>
    
    <el-dialog v-model="fileDownVisible" width="auto" id="modal-detail" modal-class="my-message-delete" :align-center="true"
     center :append-to-body="true" :show-close="false">
        <div class="text-center fs-13px">
            <span>Bạn có muốn <strong>xuất kết quả </strong> scan này không?</span> 
        </div>
        <template #footer center>
        <span class="d-flex justify-content-center">
            <el-button class="border-0" plain type="primary" :disabled="disabled" @click="downloadAcunetix()" :loading=disabled>
            Đồng ý
            </el-button>
            <el-button class="border-0" plain type="info"  @click="fileDownVisible = false">Hủy bỏ</el-button>
        </span>
        </template>
    </el-dialog>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, reactive, onBeforeUnmount, watch } from "vue";
import ApiService from "@/core/services/ApiService";
import { ElTable, ElTableColumn, ElPagination } from 'element-plus';
import { vue3Debounce } from 'vue-debounce';
import KTToolbar from "@/views/apps/targets/reconWidgets/KTToolbar2.vue";
import axios from 'axios'
import Swal from "sweetalert2/dist/sweetalert2.js";
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
dayjs.locale('vi');

export default defineComponent({
    name: "kt-target-list",

    components: {
        KTToolbar,
        ElTable,
        ElPagination,
        ElTableColumn,
    },
    directives: {
        debounce: vue3Debounce({ lock: true })
    },
    setup() {
        const list = ref<object | any>([])
        const totalPage = ref<number>(0);
        const filterStatus = ref<String | null>('');
        // const testPage = ref<number>(0);
        const currentPage = ref<number>(1);
        const itemsPerPage = ref<number>(20);
        const query = ref<String>('');
        const orderingID = ref<String>('');
        const cve_code = ref('')
        const detailData = reactive({
            id: '',
            cve_id: "",
            cve_scan_id: "",
            hostnames: [],
            ip: '',
            org: '',
            port: '',
            country: ''
        });
        const getIdFromUrl = () => {
            const url = window.location.href;
            const idMatch = url.match(/\/(\d+)\//);
            if (idMatch) {
                return parseInt(idMatch[1]);
            }
        };
        const CVEScanId = getIdFromUrl();
        const loading = ref<boolean>(false)
        // tải về files
        const fileDownVisible = ref(false)
        const downloadAcunetix = async () => {
            axios({
                url: `/cve/${getIdFromUrl()}/scan/export-data`, //your url
                method: 'GET',
                responseType: 'blob', // important
            }).then((response) => {
                // const href = URL.createObjectURL(response.data);
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `Scan_${getIdFromUrl()}_report.xlsx`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                fileDownVisible.value = false;
            }).catch(async error => {
                // xử lý hiển thị lỗi 
                const reponse_message = JSON.parse(await error.response.data.text()).detail ?? "Có lỗi xảy ra"
                notification(reponse_message, 'error', 'Có lỗi xảy ra')
            })
        }; 
        const getData = async () => {
            loading.value = true;
            return ApiService.get(`/cve/${getIdFromUrl()}/scan/detail?search=${query.value}&status=${filterStatus.value}&page=${currentPage.value}&page_size=${itemsPerPage.value}&ordering=${orderingID.value}`)
                .then(({ data }) => {
                    list.value = data.results
                    totalPage.value = data.count
                    cve_code.value = data.cve_code
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
                return ApiService.post(`/cve/${getIdFromUrl()}/scan/delete`, formData)
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

        const DialogVisibleDetail = ref<boolean>(false)
        const customRowTable = (detail: any) => {
            if (detail) {
                DialogVisibleDetail.value = true
                detailData.country = detail.country
                detailData.cve_id = detail.cve_id
                detailData.cve_scan_id = detail.cve_scan_id
                detailData.id = detail.id
                detailData.ip = detail.ip
                detailData.org = detail.org
                detailData.port = detail.port
                detailData.hostnames = detail.hostnames
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
                confirmButtonText: (icon == 'error') ? "Thử Lại" : "Đồng Ý",
                heightAuto: false,
                customClass: {
                    confirmButton: (icon == 'error') ? "btn btn-light-danger" : "btn btn-light-primary",
                },
            });
        }
        const onExportFile = async () => {
            fileDownVisible.value = true;
        };

        const handleFilter = (data: any) => {
            query.value = data;
            currentPage.value = 1;
            getData();
        };

        // xóa 
        const multipleTableRef = ref<InstanceType<typeof ElTable>>()
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

        // thay đổi kích thước header
        const headerHeight = ref<number>(0);
        const onheaderHeight = (height: number) => {
            headerHeight.value = height
        }

        onMounted(() => {
            getData();
        });

        return {
            getData,
            list,
            onItemSelect,
            selectedIds,
            getIdFromUrl,
            customRowTable,
            detailData,
            // page 
            itemsPerPage,
            totalPage,
            currentPage,
            query,
            handleFilter,
            loading,
            //SCAN
            CVEScanId,
            disabled,
            // tải về
            fileDownVisible,
            downloadAcunetix,
            //
            onheaderHeight,
            headerHeight,
            deleteSubscription,
            getRowKey,
            handleSelectionChange,
            selectedName,
            DialogVisibleDetail,
            onExportFile,
            multipleTableRef, 
            cve_code,
        };
    },
});
</script>
<style lang="scss">
#modal-detail .el-dialog__body {
    padding-top: 10px;
}

.my-hover-export-file:hover {
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
}
</style>