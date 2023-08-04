<template>
    <KTToolbar :addTragetList="`/cve/${getIdFromUrl()}/scan/detail`" :check-scan="true" @handle-security-scan="handleSecurityScan"
        :check-search="true" @handle-search="handleFilter" v-model:idsDelete="selectedIds"
        @handle-delete-selectd="deleteSubscription" :disabled="disabled" @on-header-height="onheaderHeight"></KTToolbar>
    <div class="app-container container-fluid" :style="{ marginTop: headerHeight + 'px' }">
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

                <el-table-column :width="55" label-class-name=" text-dark fs-13px fw-bold " prop="id" label="ID">
                    <template #default="scope">
                        <span v-if="scope.row.id != ''" class="fs-13px text-gray-700 text-hover-primary">
                            {{ scope.row.id}}
                        </span>
                        <span v-else class="badge badge-light-danger">--</span>
                    </template>
                </el-table-column>

                <el-table-column label-class-name=" text-dark fs-13px fw-bold" :min-width="150" prop="username"
                    label="NGƯỜI SCAN">
                    <template #default="scope">
                        <span v-if="scope.row.username != ''" class="fs-13px text-gray-700 text-hover-primary">
                            {{scope.row.username }}
                        </span>
                        <span v-else class="badge badge-light-danger">--</span>
                    </template>
                </el-table-column>

                <el-table-column :min-width="170" label-class-name=" text-dark fs-13px fw-bold" prop="created_at"
                    label="THỜI GIAN BẮT ĐẦU">
                    <template #default="scope">
                        <span v-if="scope.row.created_at != ''" class="fs-13px text-gray-700 text-hover-primary">
                            <i class="fa-solid fa-calendar-days fs-7"></i>
                            {{ scope.row.created_at }}</span>
                        <span v-else class="badge badge-light-danger">--</span>
                    </template>
                </el-table-column>
                <el-table-column :min-width="170" label-class-name=" text-dark fs-13px fw-bold" prop="modified_at"
                    label="THỜI GIAN BẮT ĐẦU">
                    <template #default="scope">
                        <span v-if="scope.row.modified_at != '' && (scope.row.stauts != '1' || scope.row.status != '2')"
                            class="fs-13px text-gray-700 text-hover-primary">
                            <i class="fa-solid fa-calendar-days fs-7"></i>
                            {{ scope.row.modified_at }}</span>
                        <span v-else class="badge badge-light-danger">--</span>
                    </template>
                </el-table-column>
                <el-table-column :min-width="130" label-class-name=" text-dark fs-13px fw-bold" prop="status"
                    label="TRẠNG THÁI">
                    <template #default="scope">
                        <span v-if="scope.row.status_name != ''" class="badge fs-13px"
                            :class="`px-4 py-3 badge-light-${getStatus(scope.row.status).color}`">
                            {{ scope.row.status_name }}
                        </span>
                        <span v-else class="badge badge-light-danger">--</span>
                    </template>
                </el-table-column>
                <!-- <el-table-column :width="120" label-class-name=" text-dark fw-bold fs-13px" label="HÀNH ĐỘNG" align="center">
                    <template #default="scope">
                        <el-tooltip class="box-item" effect="dark" ::hide-after="0" content="Chi tiết" placement="top">
                            <router-link :to="`/cve/${getIdFromUrl()}/scan-detail/${scope.row.id}`"
                                class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1 my-1">
                                <KTIcon icon-name="eye" icon-class="fs-3" />
                            </router-link>
                        </el-tooltip>
                    </template>
                </el-table-column> -->
            </el-table>
            <div class="d-flex justify-content-between align-items-center mx-auto w-100 py-5 bg-white rounded-bottom ">
                <div v-if="totalPage > 0">
                    <span class="text-capitalize fs-13px">Tổng Số Lần Scan: {{ totalPage }}</span>
                </div>
                <el-pagination background v-model:current-page="currentPage" :hide-on-single-page="true"
                    v-model:page-size="itemsPerPage" :total="totalPage" layout="prev, pager, next"
                    :disabled="disabled"></el-pagination>
                <div></div>
            </div>
        </div>
    </div>
    <!-- modal detail  -->
    <!-- <el-dialog v-model="DialogVisibleDetail" title="Chi tiết scan" width="700" id="modal-detail" align-center
        modal-class="" :show-close="false">
        <div class="modal-body p-0">
            <div class="">
                <div class="card card-flush">
                    <div class="card-header">
                        <div class="card-title">
                            <h1 class="fw-bold"><span class="text-gray-400">Người recon:</span> <span
                                    class="text-gray-800">{{ detailData.username }}</span></h1>
                        </div>
                    </div>
                    <div class="card-body py-0">
                        <div class="fs-13px">
                            <h5 class="fw-normal fs-13px">Thông tin chi tiết</h5>
                            <div class="d-flex flex-wrap py-5">
                                <div class="flex-equal me-5">
                                    <div class="table row fs-6 fw-semobold gs-0 gy-2 gx-2 m-0">
                                        <div class=" col-4 mb-4 text-center">
                                            <div class="w-100">
                                                <el-progress type="dashboard" striped-flow striped :stroke-width="8"
                                                    :percentage="+detailData.progress"
                                                    :status="(detailData.status == '2') ? '' : getStatusProgress(detailData.status).color">
                                                    <template #default="{ percentage }">
                                                        <span class="d-block fs-2">{{ percentage ?? 0 }}%</span><br>
                                                        <span class="d-block fs-6">Progressing</span>
                                                    </template>
                                                </el-progress>
                                            </div>
                                            <span class="fd-inline-block text-center fs-13px w-100">
                                                <span class="badge badge-light-primary fs-13px">Note : </span>
                                                Tiến trình CVE
                                            </span>
                                        </div>
                                        <div class="col-8">
                                            <div class="row  ">
                                                <div class="text-gray-400 fs-13px col-5">Trạng thái:</div>
                                                <div class="text-gray-800 fs-13px col-7">
                                                    <span v-if="detailData.statusName != ''" class="badge fs-13px"
                                                        :class="`px-4 py-3 badge-light-${getStatus(detailData.status).color}`">
                                                        {{ detailData.statusName }}
                                                    </span>
                                                    <span v-else class="badge badge-light-danger">--</span>
                                                    
                                                </div>
                                            </div>
                                            <div class="row ">
                                                <div class="text-gray-400 fs-13px col-5">Thời gian bắt đầu:</div>
                                                <div class="text-gray-800 fs-13px col-7">{{ detailData.created_at }}</div>
                                            </div>
                                            <div class="row">
                                                <div class="text-gray-400 fs-13px col-5">Thời gian kết thúc:</div>
                                                <div class="text-gray-800 fs-13px col-7">{{ (detailData.status == '2' ||
                                                    detailData.status == '1') ? "--:--" : detailData.modified_at }}
                                                </div>
                                            </div>
                                            <div class="row" v-if="detailData.description">
                                                <div class="text-gray-400 fs-13px col-5">Mô tả lỗi:</div>
                                                <div class="col-7 text-danger">
                                                    <span v-for="text in detailData.description.split('\n')"
                                                        class="p-0 fs-13px">
                                                        {{ text }}
                                                        <br />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
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
    </el-dialog> -->
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive, onBeforeUnmount, watch } from "vue";
import ApiService from "@/core/services/ApiService";
import KTToolbar from "@/views/apps/targets/reconWidgets/KTToolbar2.vue";
import { ElTable, ElTableColumn, ElPagination } from 'element-plus';
import { useRouter, useRoute } from 'vue-router';
import { vue3Debounce } from 'vue-debounce';
import Swal from "sweetalert2/dist/sweetalert2.js";

interface APIData {
    status: string;
    created_at: string;
    modified_at: string;
    user: string;
    description: string;
}

export default defineComponent({
    name: "kt-cve-scan-list",

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
        const route = useRoute();
        const IDScan = ref(route.params.id);
        const list = ref<object | any>([])
        const totalPage = ref<number>(0);
        const filterStatus = ref<String | null>('');
        const currentPage = ref<number>(1);
        const itemsPerPage = ref<number>(20);
        const query = ref<String>('');
        const orderingID = ref<String>('');
        const apiData = ref<APIData>({
            status: '',
            created_at: "",
            modified_at: '',
            user: '',
            description: ""
        });
        const detailData = reactive({
            id: '',
            username: "",
            created_at: "",
            modified_at: '',
            status: '',
            statusName: '',
            description: "",
            progress: "",
        });

        const getIdFromUrl = () => {
            const url = window.location.href;
            const idMatch = url.match(/\/(\d+)\//);
            if (idMatch) {
                return parseInt(idMatch[1]);
            }
        };
        const CVEId = getIdFromUrl();
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

        const loading = ref<boolean>(false)

        const getStatus = (status: number | string) => {
            if (status == 1) {
                return { color: 'dark' };
            } else if (status == 2) {
                return { color: 'primary' };
            } else if (status == 3) {
                return { color: 'success' };
            } else if (status == 4) {
                return { color: 'danger' };
            }
            return { color: 'warning' };
        };

        const getStatusProgress = (status: number | string) => {
            if (status == 1) {
                return { color: 'warning' };
            } else if (status == 2) {
                return { color: 'primary' };
            } else if (status == 3) {
                return { color: 'success' };
            } else if (status == 4) {
                return { color: 'exception' };
            }
            return { color: 'warning' };
        };

        const getData = async () => {
            loading.value = true;
            return ApiService.get(`/cve/${getIdFromUrl()}/scan?search=${query.value}&status=${filterStatus.value}&page=${currentPage.value}&page_size=${itemsPerPage.value}&ordering=${orderingID.value}`)
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
                return ApiService.post(`cve/${getIdFromUrl()}/delete`, formData)
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
        const router = useRouter();

        const customRowTable = (detail: any) => {
            console.log(detail)
            return router.push(`/cve/${IDScan.value}/scan-detail/${detail.id}`);

            // if (detail) {
            //     DialogVisibleDetail.value = true
            //     detailData.username = detail.username
            //     detailData.status = detail.status
            //     detailData.statusName = detail.status_name
            //     detailData.created_at = detail.created_at
            //     detailData.modified_at = detail.modified_at
            //     detailData.description = detail.description
            //     detailData.progress = detail.progress
            // } else {
            //     notification('', 'error', 'Có lỗi xảy ra')
            // }
        };

        const onItemSelect = (selectedItems: Array<number>) => {
            selectedIds.value = selectedItems;
        };

        // validate start
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
        const headerInputValue = ref("")
        const handleSecurityScan = async () => {
            return ApiService.post(`cve/${getIdFromUrl()}/create_scan`, {})
                .then(({ data }) => {
                    getData();
                    notification(data.detail, 'success', 'Cấu hình quét lỗ hổng thành công')
                })
                .catch(({ response }) => {
                    notification(response?.data?.detail, 'error', 'Có lỗi xảy ra')
                });
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
            apiData,
            getIdFromUrl,
            customRowTable,
            detailData,
            itemsPerPage,
            totalPage,
            currentPage,

            // search query 
            query,
            handleFilter,
            loading,
            getStatus,
            getStatusProgress,

            //SCAN
            getScanSpeedName,
            headerInputValue,
            CVEId,
            disabled,

            // đo chiều cao header
            onheaderHeight,
            headerHeight,
            deleteSubscription,
            getRowKey,
            handleSelectionChange,
            DialogVisibleDetail,
            multipleTableRef,
            handleSecurityScan,
        };
    },
});
</script>

<style lang="scss">
.override-styles {
    z-index: 99999 !important;
    pointer-events: initial;
}

.my-custom-table td.el-table__cell {
    border-bottom-style: dashed !important;
}

#modal-detail .el-dialog__body {
    padding-top: 0px;
}

span.el-dialog__title {
    color: #181C32 !important;
    font-size: 23px;
    font-weight: 600;
    line-height: 27px;
}
.el-progress__text{
    font-size: 13px !important;
}
</style>
