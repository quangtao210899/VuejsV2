<template>
    <div class="card h-100 d-block">
        <div class="card-header border-0 pt-6 position-absolute end-0 pe-1 " style="top: -80px;">
            <div class="card-toolbar">
                <div v-show="selectedIds.length === 0">
                    <div class="d-flex justify-content-end" data-kt-subscription-table-toolbar="base">
                        <el-tooltip class="box-item" effect="dark" hide-after="0" content="Tìm kiếm" placement="top">
                            <button type="button"
                                class="btn btn-sm fw-bold bg-body btn-color-gray-700 btn-active-color-primary me-2"
                                data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end" data-kt-menu-flip="top-end">
                                <KTIcon icon-name="filter" icon-class="fs-2" />
                                Filter
                            </button>
                        </el-tooltip>
                        <Fillter @filterData="handleFilter" :data-group="data_group"></Fillter>

                        <el-tooltip class="box-item" effect="dark" hide-after="0" content="Danh sách mục tiêu" placement="top"> 
                            <router-link :to="`/cve/${getIdFromUrl()}/scan/detail`">
                                <button type="button"  class="btn btn-sm fw-bold btn-success me-2">
                                    <KTIcon icon-name="document" icon-class="fs-2" />
                                    Danh sách mục tiêu
                                </button>
                            </router-link>
                        </el-tooltip>

                        <el-popconfirm
                            width="300"
                            confirm-button-text="Submit"
                            icon-color="#626AEF"
                            title="Bạn có chắc muốn scan CVE không?"
                            @confirm="submit"
                        >
                            <template #reference>
                                <span>
                                    <el-tooltip class="box-item" effect="dark" hide-after="0" content="Thêm mới" placement="top">
                                        <button type="button" class="btn btn-sm fw-bold btn-primary">
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
                        <el-tooltip class="box-item" effect="dark" hide-after="0" content="Xóa" placement="top">
                            <button type="button" data-bs-target="#kt_modal_delete" data-bs-toggle="modal" class="btn btn-danger btn-sm ">
                                Delete Selected
                            </button>
                        </el-tooltip>
                    </div>
                </div>
            </div>
        </div>

        <div class="card-body pt-0  overflow-y-auto overflow-x-hidden h-100 p-0 m-0 ">
            <KTDatatable @on-sort="sort" @on-items-select="onItemSelect" :data="list" :header="headerConfig"
                :loading="loading" :checkbox-enabled="true" :itemsPerPage="itemsPerPage" :total="totalPage"
                :currentPage="currentPage" @page-change="handlePage" @on-items-per-page-change="handlePerPage"
                @customRow="customRowTable">
                <template v-slot:id="{ row: customer }">{{ customer.id }}</template>
                <template v-slot:username="{ row: customer }">{{ customer.username }}</template>
                <template v-slot:status_name="{ row: customer }"><span :class="`badge badge-${getStatus(customer.status).color}`">{{ customer.status_name ?? '--' }}</span></template>
                <template v-slot:created_at="{ row: customer }">
                    {{ customer.created_at ? customer.created_at: '--:--' }}
                </template>
                <template v-slot:modified_at="{ row: customer }">
                    {{ (customer.status=='2' || customer.status== '1' ) ? "--:--" : customer.modified_at }}
                </template>
                <template v-slot:actions="{ row: customer }">
                    <el-tooltip class="box-item" effect="dark" hide-after="0" content="Chi tiết" placement="top">
                        <router-link :to="`/cve/${getIdFromUrl()}/scan-detail/${customer.id}`" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1">
                            <KTIcon icon-name="eye" icon-class="fs-3" />
                        </router-link>
                    </el-tooltip>
                </template>
            </KTDatatable>
        </div>
    </div>

    <!-- modal detail  -->
    <div class="modal fade" tabindex="-1" ref="ModalDetail" aria-hidden="true" id="kt_modal_detail">
        <div class="modal-dialog modal-dialog-centered mw-700px">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="card card-flush pt-3 mb-5 mb-xl-10">
                        <div class="card-header">
                            <div class="card-title">
                                <h1 class="fw-bold"><span class="text-gray-400">Người recon:</span> <span class="text-gray-800">{{ detailData.username }}</span></h1>
                            </div>
                        </div>
                        <div class="card-body py-0">
                            <div class="mb-10">
                                <h5>Thông tin chi tiết:</h5>
                                <div class="d-flex flex-wrap py-5">
                                    <div class="flex-equal me-5">
                                        <div class="table fs-6 fw-semobold gs-0 gy-2 gx-2 m-0">
                                            <div class="row mb-4 ">
                                                <div class="text-gray-400 col-6">Trạng thái:</div>
                                                <span :class="`badge badge-${getStatus(detailData.status).color} col-2`" style="margin-left:10px;">{{ detailData.statusName }}</span>
                                            </div>
                                            <div class="row mb-4">
                                                <div class="text-gray-400 col-6">Thời gian bắt đầu:</div>
                                                <div class="text-gray-800 col-6">{{ detailData.created_at}}</div>
                                            </div>
                                            <div class="row mb-4">
                                                <div class="text-gray-400 col-6">Thời gian kết thúc:</div>
                                                <div class="text-gray-800 col-6">{{ (detailData.status=='2' || detailData.status== '1' ) ? "--:--" : detailData.modified_at }}</div>
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
                        <span class="indicator-label"> Submit </span>
                        <span class="indicator-progress">
                            Please wait...
                            <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                        </span>
                    </button>
                </VForm>
            </div>
        </div>
    </div>

    <div class="modal fade" tabindex="-1" id="kt_modal_delete" ref="ModalDelete" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">

                <div class="modal-header">
                    <h3 class="modal-title">Xác nhận xóa scan</h3>

                    <div class="btn btn-icon btn-sm btn-active-light-primary ms-2" data-bs-dismiss="modal"
                        aria-label="Close">
                        <span class="svg-icon svg-icon-2x"></span>
                    </div>
                </div>
                <div class="modal-body">
                    <p style="font-size: 16px;">Bạn có chắc chắn muốn xóa <span v-if="selectedIds.length > 0"
                            class="fw-bold" style="color:red;">{{ selectedIds.length
                            }}</span> bản ghi này không?
                    </p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-sm  btn-light" data-bs-dismiss="modal">
                        Hủy bỏ
                    </button>
                    <button type="button" class="btn btn-sm  btn-primary" @click.passive="deleteFewSubscriptions()">
                        Đồng ý
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref, onMounted, reactive } from "vue";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import type { Sort } from "@/components/kt-datatable/table-partials/models";
import ApiService from "@/core/services/ApiService";

// validate
import { hideModal } from "@/core/helpers/dom";
import { ErrorMessage, Field, Form as VForm } from "vee-validate";
import { vue3Debounce } from 'vue-debounce';
import Fillter from "@/views/apps/targets/filterTargetScan.vue";

import * as Yup from "yup";
import Swal from "sweetalert2/dist/sweetalert2.js";

import { Modal } from "bootstrap";

interface APIData {
    status: string;
    created_at: string;
    modified_at: string;
    user: string;
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
            }  else if (speed == 3) {
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

        const getData = () => {
            loading.value = true;
            setTimeout(() => loading.value = false, 500)

            return ApiService.get(`/cve/${getIdFromUrl()}/scan?search=${query.value}&status=${filterStatus.value}&page=${currentPage.value}&page_size=${itemsPerPage.value}&ordering=${orderingID.value}`)
                .then(({ data }) => {
                    list.value = data.results
                    totalPage.value = data.count
                })
                .catch(({ response }) => {
                    notification(response.data.detail, 'error', 'Có lỗi xảy ra')
                });
        }

        const selectedIds = ref<Array<number>>([]);
        const deleteFewSubscriptions = () => {
            deleteSubscription(selectedIds.value);
        };

        const ModalDelete = ref<null | HTMLElement>(null);
        const deleteSubscription = (ids: Array<number>) => {
            let formData = {
                'id': ids
            }
            if (ids) {
                return ApiService.post(`cve/${getIdFromUrl()}/delete`, formData)
                    .then(({ data }) => {
                        notification(data.detail, 'success', 'Xóa thành công')
                        currentPage.value = 1;
                        selectedIds.value.length = 0;
                        getData();
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
                confirmButtonText: "Ok, got it!",
                heightAuto: false,
                customClass: {
                    confirmButton: "btn btn-primary",
                },
            }).then(() => {
                hideModal(newTargetGroupModalRef.value);
                hideModal(ModalDelete.value);
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
                    
                    if(submitButtonRef.value){
                        //Disable button
                        submitButtonRef.value.disabled = true;
                        // Activate indicator
                        submitButtonRef.value.setAttribute("data-kt-indicator", "on");
                        setTimeout(() => {
                            if (submitButtonRef.value) {
                                submitButtonRef.value.disabled = false;
                                submitButtonRef.value?.removeAttribute("data-kt-indicator");
                            }
                            notification(data.detail, 'success', 'Cấu hình quét lỗ hổng thành công')
                            getData();

                        }, 1000);
                    }
                })
                .catch(({response}) => {
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
            deleteFewSubscriptions,
            deleteSubscription,
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
            ModalDelete,
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

            //SCAN
            getScanSpeedName,
            headerInputValue,
            CVEId,
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
