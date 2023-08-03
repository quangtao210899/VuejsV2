<template>
    <KTToolbar :check-search="true" @handle-search="handleFilter" v-model:idsDelete="selectedIds" :check-export-file="true"
        @handle-export-file="onExportFile" @handle-delete-selectd="deleteSubscription" :disabled="disabled"
        @on-header-height="onheaderHeight"></KTToolbar>
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

                <el-table-column :width="55" label-class-name=" text-dark fs-13px fw-bold " prop="id" label="ID">
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
                            <div class="d-flex flex-column">
                                <li v-for="(value, index) in scope.row.hostnames" :key="index"
                                    class="d-flex align-items-center py-2">
                                    <span class="bullet bullet-dot me-5 bg-success h-5px w-5px"></span> {{ value }}
                                </li>
                            </div>
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
    <el-dialog v-model="DialogVisibleDetail" title="Chi tiết Scan" width="700" id="modal-detail" align-center modal-class=""
        :show-close="false">
        <div class="modal-body p-0">
            <div class="card card-flush">
                <!--begin::Card header-->
                <div class="card-header">
                    <!--begin::Card title-->
                    <div class="card-title">
                        <h1 class="fw-bold"><span class="text-gray-400">IP:</span> {{ detailData.ip }}</h1>
                    </div>
                </div>
                <div class="card-body py-0">
                    <div class="mb-10 fs-13px">
                        <h6 >Thông tin chi tiết:</h6>
                        <div class="py-5">
                            <!--begin::Row-->
                            <div class="me-5">
                                <!--begin::Details-->
                                <div>
                                    <div class="row fs-6 mb-3 fs-13px">
                                        <div class="col-3 text-gray-400">Port:</div>
                                        <div class="col-9 text-gray-800 fs-5 fw-bold">
                                            <span v-if="detailData.port != ''"
                                                class="fs-13px text-gray-700 text-hover-primary">
                                                {{ detailData.port }}</span>
                                            <span v-else class="badge badge-light-danger">--</span>
                                        </div>
                                    </div>
                                    <div class="row fs-6 mb-3 fs-13px">
                                        <div class="col-3 text-gray-400">Hostnames:</div>
                                        <div class="col-9 text-gray-800">
                                            <template v-if="detailData.hostnames.length != 0">
                                                <div class="d-flex flex-column">
                                                    <li v-for="(value, index) in detailData.hostnames" :key="index"
                                                        class="d-flex align-items-center py-2">
                                                        <span class="bullet bullet-dot me-5 bg-success h-5px w-5px"></span>
                                                        {{ value }}
                                                    </li>
                                                </div>
                                            </template>
                                            <template v-else>
                                                <span class="badge badge-light-danger">--</span>
                                            </template>
                                        </div>
                                    </div>
                                    <div class="row fs-6 mb-3 fs-13px">
                                        <div class="col-3 text-gray-400 fs-13px">Quốc gia:</div>
                                        <div class="col-9 text-gray-800">
                                            <span v-if="detailData.country != ''"
                                                class="fs-13px text-gray-700 text-hover-primary">
                                                {{ detailData.country }}</span>
                                            <span v-else class="badge badge-light-danger">--</span>
                                        </div>
                                    </div>
                                    <div class="row fs-6 mb-3 fs-13px">
                                        <div class="col-3 text-gray-400">Tổ chức:</div>
                                        <div class="col-9 text-gray-800">
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
            </div>
            <div class="d-flex justify-content-center">
                <button type="button" class="btn btn-sm btn-light-primary fs-13px" @click="DialogVisibleDetail = false">
                    Đóng
                </button>
            </div>
        </div>
    </el-dialog>

    <el-dialog v-model="fileDownVisible" :show-close="false" align-center id="modal-detail" title="Xác Nhận Xuất File" width="700">
        <div class="h-100 border-primary border-dashed rounded-2 border border-2 bg-light my-hover-export-file">
            <!--begin::Card body-->
            <div class="card-body d-flex justify-content-center text-center flex-column p-8">
                <!--begin::Name-->
                <div class="symbol symbol-60px mb-5">
                    <i class="fa-solid fa-file-excel fs-4x text-primary"></i>
                </div>
                <!--end::Image-->

                <!--begin::Title-->
                <div class="fs-13px fw-bold mb-2 text-primary"> {{ `Scan_${getIdFromUrl()}_report.xlsx` }} </div>
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
            DialogVisibleDetail,
            onExportFile,
            multipleTableRef,
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
    font-size: 23px;
    font-weight: 600;
    line-height: 27px;
}
.my-hover-export-file:hover{
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    }
</style>