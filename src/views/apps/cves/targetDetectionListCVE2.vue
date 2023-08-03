<template>
    <KTToolbar :check-search="true" @handle-search="handleFilter" v-model:idsDelete="selectedIds" :check-export-file="true"
        @handle-export-file="onExportFile" @handle-delete-selectd="deleteSubscription" :disabled="disabled"
        :data-info-scans="info" :check-control="true" :status-CVE="statusCVE" @handle-pauser="handlePauser"
        @handle-restart="handleRestart" @on-header-height="onheaderHeight"></KTToolbar>
    <div class="app-container container-fluid " :style="{ marginTop: headerHeight + 'px' }">
        <div class="p-5 bg-body rounded-3">
            <el-table ref="multipleTableRef" :data="list" style="width: 100%;z-index: 1;"
                class-name="rounded-top cursor-pointer" table-layout="fixed" v-loading="loading"
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
                        <span v-if="scope.row.id != ''" class="fs-13px text-gray-700 text-hover-primary">
                            {{ scope.row.id }}
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
            <div class="d-flex justify-content-between align-items-center mx-auto w-100 py-5 bg-white rounded-bottom ">
                <div v-if="totalPage > 0">
                    <span class="text-capitalize fs-13px">Tổng Số Scans: {{ totalPage }}</span>
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
                                        <span v-if="detailData.port != ''" class="fs-13px text-gray-700 text-hover-primary">
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
                                        <span v-if="detailData.org != ''" class="fs-13px text-gray-700 text-hover-primary">
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

    <el-dialog v-model="fileDownVisible" :show-close="false" align-center id="modal-detail" title="Xác Nhận Xuất File"
        width="700">
        <div class="h-100 border-primary border-dashed rounded-2 border border-2 bg-light my-hover-export-file">
            <!--begin::Card body-->
            <div class="card-body d-flex justify-content-center text-center flex-column p-8">
                <!--begin::Name-->
                <div class="symbol symbol-60px mb-5">
                    <i class="fa-solid fa-file-excel fs-4x text-primary"></i>
                </div>
                <!--end::Image-->

                <!--begin::Title-->
                <div class="fs-13px fw-bold mb-2 text-primary"> {{ `Scan_${IDScan}_report.xlsx` }} </div>
                <!--end::Name-->
            </div>
            <!--end::Card body-->
        </div>
        <template #footer>
            <span class="d-flex justify-content-center">
                <button type="button" class="btn btn-sm btn-light-primary fs-13px" @click="fileDownVisible = false">
                    Đóng
                </button>
                <button type="button" class="btn btn-sm btn-light-success fs-13px ms-2" @click="downloadAcunetix">
                    Tải về
                </button>
            </span>
        </template>
    </el-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive, onBeforeUnmount, watch } from "vue";
import ApiService from "@/core/services/ApiService";
import { ElTable, ElTableColumn, ElPagination } from 'element-plus';
import { vue3Debounce } from 'vue-debounce';
import KTToolbar from "@/views/apps/targets/reconWidgets/KTToolbar2.vue"; import Swal from "sweetalert2/dist/sweetalert2.js";
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { ElNotification } from 'element-plus'
import axios from 'axios'
import { useRoute } from 'vue-router';

dayjs.locale('vi');

interface APIData {
    status: string;
    created_at: string;
    finished_at: string;
    user: string;
}

export default defineComponent({
    name: "kt-target-list",

    components: {
        ElTable,
        ElTableColumn,
        ElPagination,
        KTToolbar,
    },
    directives: {
        debounce: vue3Debounce({ lock: true })
    },
    setup() {
        const route = useRoute();
        const IDScan = ref(route.params.id);
        const IDCVE = ref(route.params.idCVE);
        const list = ref<object | any>([])
        const data_group = ref<object | any>([])
        const totalPage = ref<number>(0);
        const filterStatus = ref<String | null>('');
        // const testPage = ref<number>(0);
        const currentPage = ref<number>(1);
        const itemsPerPage = ref<number>(20);
        const query = ref<String>('');
        const orderingID = ref<String>('');
        const typeModal = ref<String>('');
        const nameType = ref<string>('');
        const apiData = ref<APIData>({
            status: '',
            created_at: "",
            finished_at: '',
            user: '',
        });

        const info = reactive({
            status: "",
            created_at: "",
            modified_at: '',
            username: '',
            shodan_dock: '',
            description: '',
            cve_code: '',
            progress: '',
            previous: ''
        });

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
            const idMatch = url.match(/\/(\d+)$/);
            if (idMatch) {
                return parseInt(idMatch[1]);
            }
        };
        const CVEScanId = IDScan.value;
        const getScanSpeedName = (speed: number | string) => {
            if (speed == 1) {
                return 'Tuần tự'
            } else if (speed == 2) {
                return 'Chậm'
            } else if (speed == 3) {
                return 'Trung bình'
            }

            return 'Nhanh'
        };

        // tải về files
        const fileDownVisible = ref(false)
        const downloadAcunetix = async () => {
            axios({
                url: `/cve/scan-export/${IDScan.value}`, //your url
                method: 'GET',
                responseType: 'blob', // important
            }).then((response) => {
                // const href = URL.createObjectURL(response.data);
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `Scan_${IDScan.value}_report.xlsx`);
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
        const loading = ref<boolean>(false)
        const statusCVE = ref<number | null>(null);
        const getData = async () => {
            loading.value = true;
            return ApiService.get(`/cve/scan-detail/${IDScan.value}?search=${query.value}&status=${filterStatus.value}&page=${currentPage.value}&page_size=${itemsPerPage.value}&ordering=${orderingID.value}`)
                .then(({ data }) => {
                    list.value = data.results
                    totalPage.value = data.count
                    info.status = data.status
                    info.created_at = data.created_at
                    info.modified_at = data.modified_at
                    info.username = data.username
                    info.shodan_dock = data.shodan_dock
                    info.description = data.description
                    info.cve_code = data.cve_code
                    info.progress = data.progress
                    statusCVE.value = data.status
                    startTimer()
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
            if (statusCVE.value == 2) {
                intervalId = setInterval(() => {
                    getData();
                }, eventTime.value);
            } else {
                clearInterval(intervalId);
            }

        };

        const stopTimer = () => {
            clearInterval(intervalId);
        };

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
                return ApiService.post(`/cve/scan-delete/${IDScan.value}`, formData)
                    .then(({ data }) => {
                        getData();
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

        const onExportFile = async () => {
            fileDownVisible.value = true;
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
        // tạm dùng
        const handlePauser = async () => {
            return ApiService.post(`cve/${IDScan.value}/scan/stop`, {})
                .then(({ data }) => {
                    let detail = (data == 'Dừng CVEScan thành công') ? true : false
                    ElNotification({
                        title: 'Info',
                        message: data.detail ?? 'Dừng CVEScan thành công',
                        type: detail ? 'success' : 'info',
                    })
                    getData();
                })
                .catch((response) => {
                    ElNotification({
                        title: 'Error',
                        message: response?.data?.detail ?? 'Tạm dừng thành công',
                        type: 'error',
                    })
                });
        };

        // tiếp tục
        const handleRestart = async () => {
            return ApiService.post(`cve/${IDScan.value}/scan/restart`, {})
                .then(({ data }) => {
                    let detail = (data == 'Tiếp tục CVEScan thành công') ? true : false
                    ElNotification({
                        title: 'Info',
                        message: data.detail ?? 'Tiếp tục CVEScan thành công',
                        type: detail ? 'success' : 'info',
                    })
                    getData();
                })
                .catch((response) => {
                    ElNotification({
                        title: 'Error',
                        message: response?.data?.detail ?? 'Tạm dừng thành công',
                        type: 'error',
                    })
                });
        };

        // end validate

        const handleFilter = (data: any) => {
            query.value = data;
            currentPage.value = 1;
            getData();
        };

        const getStatusProgress = (status: number | string) => {
            if (status == 1) {
                return { color: 'default' };
            } else if (status == 2) {
                return { color: 'primary' };
            } else if (status == 3) {
                return { color: 'success' };
            } else if (status == 4) {
                return { color: 'exception' };
            }
            return { color: 'warning' };
        };

        // xóa 
        const multipleTableRef = ref<InstanceType<typeof ElTable>>()
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

        // information
        const onControl = (height: number) => {
            headerHeight.value = height
        }

        onMounted(() => {
            getData();
        });

        return {
            getData,
            list,
            handleSelectionChange,
            getRowKey,
            onItemSelect,
            selectedIds,
            handleFilter,
            getStatusProgress,
            info,
            apiData,
            data_group,
            getIdFromUrl,
            customRowTable,
            detailData,
            // page 
            itemsPerPage,
            totalPage,
            currentPage,
            query,
            // edit 
            nameType,
            loading,
            //SCAN
            getScanSpeedName,
            CVEScanId,
            disabled,

            // tải về
            fileDownVisible,
            downloadAcunetix,

            // tạm dung, tiếp tục 
            statusCVE,
            handlePauser,
            handleRestart,
            onExportFile,
            onheaderHeight,
            deleteSubscription,
            headerHeight,
            DialogVisibleDetail,
            onControl,
            IDScan,
        };
    },
});
</script>
<style lang="scss">
#modal-detail .el-dialog__body {
    padding-top: 0px;
}

span.el-dialog__title {
    color: #181C32 !important;
    font-size: 20px;
    font-weight: 600;
    line-height: 27px;
}

.my-hover-export-file:hover {
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
}
</style>
