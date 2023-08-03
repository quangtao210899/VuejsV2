<template>
    <div class="app-container container-fluid p-5 mt-10">
    <div class="card h-100 d-block">
        <div class="card-header border-0 pt-10 pt-sm-10 pt-lg-6 position-absolute end-0 pe-1  " style="top: -70px;">
            <div class="card-toolbar">
                <div v-show="selectedIds.length === 0">
                    <div class="d-flex justify-content-end" data-kt-subscription-table-toolbar="base">
                        <el-tooltip class="box-item" effect="dark" :hide-after="0" content="Tìm kiếm" placement="top">
                            <button type="button"
                                class="btn btn-sm fw-bold bg-body btn-color-gray-700 btn-active-color-primary me-2"
                                data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end"
                                data-kt-menu-flip="top-end">
                                <KTIcon icon-name="filter" icon-class="fs-2" />
                                Filter
                            </button>
                        </el-tooltip>
                        <Fillter @filterData="handleFilter" :data-group="data_group"></Fillter>

                        <el-tooltip class="box-item" effect="dark" :hide-after="0" content="Danh sách mục tiêu"
                            placement="top">
                            <router-link :to="`/cve/${getIdFromUrl()}/scan/detail`">
                                <button type="button" class="btn btn-sm fw-bold btn-success me-2">
                                    <KTIcon icon-name="document" icon-class="fs-2" />
                                    Danh sách mục tiêu
                                </button>
                            </router-link>
                        </el-tooltip>

                        <el-popconfirm width="300" confirm-button-text="Đồng ý" cancel-button-text="Không"
                            icon-color="#626AEF" title="Bạn có chắc muốn scan CVE không?" @confirm="submit">
                            <template #reference>
                                <span>
                                    <el-tooltip class="box-item" effect="dark" :hide-after="0" content="Thêm mới"
                                        placement="top">
                                        <button type="button" class="btn btn-sm fw-bold btn-primary" :disabled="disabled">
                                            <KTIcon icon-name="plus" icon-class="fs-2" />
                                            Quét
                                        </button>
                                    </el-tooltip>
                                </span>
                            </template>
                        </el-popconfirm>
                    </div>
                </div>
                <div v-show="selectedIds.length !== 0">
                    <div class="d-flex justify-content-end align-items-center">
                        <div class="fw-bold me-5">
                            <span class="me-2">{{ selectedIds.length }}</span>Selected
                        </div>
                        <el-tooltip class="box-item" effect="dark" :hide-after="0" content="Xóa" placement="top">
                            <button type="button" @click="deleteSelectd()" class="btn btn-danger btn-sm "
                                :disabled="disabled">
                                Xóa mục đã chọn
                            </button>
                        </el-tooltip>
                    </div>
                </div>
            </div>
        </div>

        <div class="card-body pt-0  overflow-y-auto overflow-x-auto h-100 p-0 m-0 ">
            <KTDatatable @on-sort="sort" @on-items-select="onItemSelect" :data="list" :header="headerConfig"
                :loading="loading" :checkbox-enabled="true" :itemsPerPage="itemsPerPage" :total="totalPage"
                :currentPage="currentPage" @page-change="handlePage" @on-items-per-page-change="handlePerPage"
                @customRow="customRowTable">
                <template v-slot:id="{ row: customer }">{{ customer.id }}</template>
                <template v-slot:username="{ row: customer }">{{ customer.username }}</template>
                <template v-slot:status_name="{ row: customer }"><span
                        :class="`badge badge-${getStatus(customer.status).color}`">{{ customer.status_name ?? '--'
                        }}</span></template>
                <template v-slot:created_at="{ row: customer }">
                    {{ customer.created_at ? customer.created_at : '--:--' }}
                </template>
                <template v-slot:modified_at="{ row: customer }">
                    {{ (customer.status == '2' || customer.status == '1') ? "--:--" : customer.modified_at }}
                </template>
                <template v-slot:progress="{ row: customer }">
                    <div class="w-150px m-0 p-0">
                        <el-progress :percentage="customer.progress ?? 0" :stroke-width="8"
                            :status="(customer.status == '2') ? '' : getStatusProgress(customer.status).color"
                            :striped-flow="(customer.status == '2') ? true : false" striped :duration="5" />
                    </div>
                </template>
                <template v-slot:actions="{ row: customer }">
                    <el-tooltip class="box-item" effect="dark" :hide-after="0" content="Chi tiết" placement="top">
                        <router-link :to="`/cve/${getIdFromUrl()}/scan-detail/${customer.id}`"
                            class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1">
                            <KTIcon icon-name="eye" icon-class="fs-3" />
                        </router-link>
                    </el-tooltip>
                </template>
            </KTDatatable>
        </div>
    </div>
</div>
    <!-- modal detail  -->
    <div class="modal fade" tabindex="-1" ref="ModalDetail" aria-hidden="true" id="kt_modal_detail">
        <div class="modal-dialog modal-dialog-centered mw-700px">
            <div class="modal-content">
                <div class="">
                    <div class="card card-flush pt-3 mb-5 mb-xl-10">
                        <div class="card-header">
                            <div class="card-title">
                                <h1 class="fw-bold"><span class="text-gray-400">Người recon:</span> <span
                                        class="text-gray-800">{{ detailData.username }}</span></h1>
                            </div>
                        </div>
                        <div class="card-body py-0">
                            <div class="mb-10">
                                <h5 class="fw-normal">Thông tin chi tiết</h5>
                                <div class="d-flex flex-wrap py-5">
                                    <div class="flex-equal me-5">
                                        <div class="table row fs-6 fw-semobold gs-0 gy-2 gx-2 m-0">
                                            <div class=" col-4 mb-4 text-center">
                                                <div class="w-100">
                                                    <el-progress type="dashboard" striped-flow striped :stroke-width="8"
                                                        :percentage="detailData.progress"
                                                        :status="(detailData.status == '2') ? '' : getStatusProgress(detailData.status).color">
                                                        <template #default="{ percentage }">
                                                            <span class="d-block fs-2">{{ percentage ?? 0 }}%</span><br>
                                                            <span class="d-block fs-6">Progressing</span>
                                                        </template>
                                                    </el-progress>
                                                </div>
                                                <span class="fd-inline-block text-center fs-7 w-100">
                                                    <span class="badge badge-light-primary">Note : </span>
                                                    Tiến trình CVE
                                                </span>
                                            </div>
                                            <div class="col-8">
                                                <div class="row  ">
                                                    <div class="text-gray-400 col-5">Trạng thái:</div>
                                                    <div class="text-gray-800 col-7">
                                                        <span
                                                            :class="`badge badge-${getStatus(detailData.status).color} bg-${getStatus(detailData.status).color} d-flex justify-content-center text-center py-2 w-100px`">
                                                            {{ detailData.statusName }}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div class="row ">
                                                    <div class="text-gray-400 col-5">Thời gian bắt đầu:</div>
                                                    <div class="text-gray-800 col-7">{{ detailData.created_at }}</div>
                                                </div>
                                                <div class="row">
                                                    <div class="text-gray-400 col-5">Thời gian kết thúc:</div>
                                                    <div class="text-gray-800 col-7">{{ (detailData.status == '2' ||
                                                        detailData.status == '1') ? "--:--" : detailData.modified_at }}
                                                    </div>
                                                </div>
                                                <div class="row" v-if="detailData.description">
                                                    <div class="text-gray-400 col-5">Mô tả lỗi:</div>
                                                    <div class="col-7 text-danger">
                                                        <span v-for="text in detailData.description.split('\n')"
                                                            class="p-0">
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
                <div class="modal-footer">
                    <button type="button" class="btn btn-sm  btn-primary me-9" data-bs-dismiss="modal">
                        Quay lại
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" tabindex="-1" id="kt_modal_new_target_group" ref="newTargetGroupModalRef" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered mw-650px">
            <div class="modal-content">
                <div class="modal-header" id="kt_modal_new_target_group_header">
                    <h2>{{ nameType }}</h2>

                    <div class="btn btn-sm btn-icon btn-active-color-primary" data-bs-dismiss="modal">
                        <KTIcon icon-name="cross" icon-class="fs-1" />
                    </div>
                </div>

                <VForm id="kt_modal_new_target_group_form" class="form" @submit="submit">
                    <button ref="submitButtonRef" type="submit" id="kt_modal_new_target_group_submit"
                        class="btn btn-sm  btn-primary">
                        <span class="indicator-label"> Gửi </span>
                        <span class="indicator-progress">
                            Đang gửi...
                            <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                        </span>
                    </button>
                </VForm>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref, onMounted, reactive, onBeforeUnmount } from "vue";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import type { Sort } from "@/components/kt-datatable/table-partials/models";
import ApiService from "@/core/services/ApiService";

// validate
import { hideModal } from "@/core/helpers/dom";
import { ErrorMessage, Field, Form as VForm } from "vee-validate";
import { vue3Debounce } from 'vue-debounce';
import Fillter from "@/views/apps/targets/filterTargetScan.vue";
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import { markRaw } from 'vue'
import Swal from "sweetalert2/dist/sweetalert2.js";

import { Modal } from "bootstrap";

interface APIData {
    status: string;
    created_at: string;
    modified_at: string;
    user: string;
    description: string;
}

export default defineComponent({
    name: "kt-target-list",

    components: {
        KTDatatable,
        ErrorMessage,
        Field,
        VForm,
        Fillter,
    },
    directives: {
        debounce: vue3Debounce({ lock: true })
    },
    setup() {
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
        const id = ref<number>(0);
        const nameType = ref<string>('');
        const apiData = ref<APIData>({
            status: '',
            created_at: "",
            modified_at: '',
            user: '',
            description: ""
        });
        const errors = reactive({
            status: "",
            created_at: "",
            modified_at: '',
            user: '',
            detail: '',
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

        const discardButtonRef = ref<HTMLElement | null>(null);
        const ModalDetail = ref<null | HTMLElement>(null);
        const loading = ref<boolean>(false)

        const headerConfig = ref([
            {
                columnName: "ID",
                columnLabel: "id",
                sortEnabled: true,
            },
            {
                columnName: "Người scan",
                columnLabel: "username",
            },
            {
                columnName: "Thời gian bắt đầu",
                columnLabel: "created_at",
            },
            {
                columnName: "Thời gian kết thúc",
                columnLabel: "modified_at",
            },
            {
                columnName: "Tiến trình",
                columnLabel: "progress",
            },
            {
                columnName: "Trạng thái",
                columnLabel: "status_name",
            },
            {
                columnName: "Actions",
                columnLabel: "actions",
                columnWidth: 50,
            },
        ]);

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

        const handleClick = (data: object | any, type: String) => {
            typeModal.value = type
            // errors.name = ''
            // errors.domain = ''
            // errors.ip = ''
            // errors.group = ''
            // errors.detail = ''

            nameType.value = "Quét CVE"
            if (discardButtonRef.value !== null) {
                discardButtonRef.value.click();
            }
            // resetData();
        };

        // const resetData = () => {
        //   apiData.value.title = '';
        //   apiData.value.description = '';
        //   id.value = 0;
        // }

        const handlePage = (page: number) => {
            currentPage.value = page ?? 1;
            getData();
        };

        const handlePerPage = (itemsPage: number) => {
            currentPage.value = 1
            itemsPerPage.value = itemsPage ?? 20;
            getData();
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
        const deleteSelectd = () => {
            ElMessageBox.confirm(
                'Tập tin sẽ được xóa vĩnh viễn. Tiếp tục?',
                'Xác Nhận Xóa',
                {
                    confirmButtonText: 'Đồng Ý',
                    cancelButtonText: 'Hủy Bỏ',
                    type: 'warning',
                    icon: markRaw(Delete)
                }
            )
                .then(() => {
                    deleteSubscription(selectedIds.value);
                })
                .catch(() => {

                })
        };
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
                        selectedIds.value.length = 0;
                    })
                    .catch(({ response }) => {
                        notification(response.data.detail, 'error', 'Có lỗi xảy ra')
                    });
            }
        };

        const sort = (sort: Sort) => {
            if (sort.label) {
                orderingID.value = (sort.order === "asc") ? `${sort.label}` : `-${sort.label}`;
            }
            getData();
        };
        const customRowTable = (detail: any) => {
            if (detail) {
                detailData.username = detail.username
                detailData.modified_at = detail.finishedAt
                detailData.status = detail.status
                detailData.statusName = detail.status_name
                detailData.created_at = detail.created_at
                detailData.modified_at = detail.modified_at
                detailData.description = detail.description
                detailData.progress = detail.progress
                // console.log(detailData)
                const modal = new Modal(
                    document.getElementById("kt_modal_detail") as Element
                );
                modal.show();
            } else {
                notification('', 'error', 'Có lỗi xảy ra')
            }
        };

        const onItemSelect = (selectedItems: Array<number>) => {
            selectedIds.value = selectedItems;

        };

        // validate start
        const submitButtonRef = ref<null | HTMLButtonElement>(null);
        const modalRef = ref<null | HTMLElement>(null);
        const newTargetGroupModalRef = ref<null | HTMLElement>(null);

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
            }).then(() => {
                hideModal(newTargetGroupModalRef.value);

                hideModal(ModalDetail.value);
            });
        }
        const headerInputValue = ref("")
        const submit = async () => {
            if (!submitButtonRef.value) {
                return;
            }

            return ApiService.post(`cve/${getIdFromUrl()}/create_scan`, {})
                .then(({ data }) => {
                    getData();
                    notification(data.detail, 'success', 'Cấu hình quét lỗ hổng thành công')
                    if (submitButtonRef.value) {
                        //Disable button
                        submitButtonRef.value.disabled = true;
                        // Activate indicator
                        submitButtonRef.value.setAttribute("data-kt-indicator", "on");
                        setTimeout(() => {
                            if (submitButtonRef.value) {
                                submitButtonRef.value.disabled = false;
                                submitButtonRef.value?.removeAttribute("data-kt-indicator");
                            }


                        }, 1000);
                    }
                })
                .catch(({ response }) => {
                    if (response?.data) {
                        errors.detail = response.data.detail;
                        notification(response?.data?.detail, 'error', 'Có lỗi xảy ra')
                    } else {
                        notification(response?.data?.detail, 'error', 'Có lỗi xảy ra')
                    }
                });
        };


        // end validate

        const handleFilter = (data: any) => {
            if (data) {
                query.value = data.query;
                filterStatus.value = data.status;
                currentPage.value = 1;
                getData();
            } else {
                notification('Có lỗi với filter', 'error', 'Có lỗi xảy ra')
            }

        };

        onMounted(() => {
            getData();
        });

        return {
            getData,
            list,
            headerConfig,
            sort,
            onItemSelect,
            selectedIds,
            deleteSelectd,
            
            getAssetPath,

            // validate
            // crud
            apiData,
            data_group,
            submit,
            submitButtonRef,
            modalRef,
            // target_id,
            getIdFromUrl,
            newTargetGroupModalRef,
            handleClick,
            errors,

            discardButtonRef,
            // detials
            ModalDetail,
            customRowTable,
            detailData,

            // page 
            itemsPerPage,
            totalPage,
            currentPage,
            handlePage,
            handlePerPage,

            // search query 
            query,
            handleFilter,

            // edit 
            nameType,
            loading,

            getStatus,
            getStatusProgress,

            //SCAN
            getScanSpeedName,
            headerInputValue,
            CVEId,
            disabled,
        };
    },
});
</script>

<style lang="scss">
.override-styles {
    z-index: 99999 !important;
    pointer-events: initial;
}
</style>
