<template>
    <div class="card h-100 d-block">
        <div class="card-header border-0 pt-6 position-absolute end-0 pe-1 " style="top: -80px;">
            <div class="card-toolbar">
                <div v-show="selectedIds.length === 0">
                    <div class="d-flex justify-content-end" data-kt-subscription-table-toolbar="base">
                        <el-tooltip class="box-item" effect="dark" hide-after="0" content="Tìm kiếm" placement="top">
                            <button type="button"
                                class="btn btn-sm fw-bold bg-body btn-color-gray-700 btn-active-color-primary me-2"
                                data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end"
                                data-kt-menu-flip="top-end">
                                <KTIcon icon-name="filter" icon-class="fs-2" />
                                Filter
                            </button>
                        </el-tooltip>
                        <Fillter @filterData="handleFilter" :data-group="data_group"></Fillter>

                        <!-- <button type="button" class="btn btn-sm fw-bold btn-primary" data-bs-toggle="modal"
                            data-bs-target="#kt_modal_new_target_group" @click.passive="handleClick({}, 'add')">
                            <KTIcon icon-name="plus" icon-class="fs-2" />
                            Quét
                        </button> -->
                    </div>
                </div>
                <div v-show="selectedIds.length !== 0">
                    <div class="d-flex justify-content-end align-items-center">
                        <div class="fw-bold me-5">
                            <span class="me-2">{{ selectedIds.length }}</span>Selected
                        </div>
                        <el-tooltip class="box-item" effect="dark" hide-after="0" content="Xóa" placement="top">
                            <button type="button" data-bs-target="#kt_modal_delete" data-bs-toggle="modal"
                                class="btn btn-danger btn-sm " :disabled="disabled">
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
                <template v-slot:ip="{ row: customer }">{{ customer.ip }}</template>
                <template v-slot:port="{ row: customer }">{{ customer.port ?? '--' }}</template>
                <template v-slot:hostnames="{ row: customer }">
                    <template v-if="customer.hostnames.length">
                        <span v-for="(value, index) in customer.hostnames" :key="index" :class="`badge badge-success`" class="me-1">
                            {{ value }}
                        </span>
                    </template>
                    <template v-else>
                        <span>--:--</span>
                    </template>
                </template>
                <template v-slot:country="{ row: customer }">
                    {{ customer.country ? customer.country : '--:--' }}
                </template>
                <template v-slot:org="{ row: customer }">
                    {{ customer.org ? customer.org : '--:--' }}
                </template>
                <template v-slot:actions="{ row: customer }">
                    <router-link :to="`/cve/scan-detail/${customer.id}`"
                        class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1">
                        <KTIcon icon-name="eye" icon-class="fs-3" />
                    </router-link>
                </template>
            </KTDatatable>
        </div>
    </div>


    <!-- modal detail  -->
    <div class="modal fade" tabindex="-1" ref="ModalDetail" aria-hidden="true" id="kt_modal_detail">
        <!--begin::Modal dialog-->
        <div class="modal-dialog modal-dialog-centered mw-650px">
            <!--begin::Modal content-->
            <div class="modal-content">
                <!--begin::Form-->
                <div class="modal-body">
                    <!--begin::Card-->
                    <div class="card card-flush pt-3 mb-5 mb-xl-10">
                        <!--begin::Card header-->
                        <div class="card-header">
                            <!--begin::Card title-->
                            <div class="card-title">
                                <h1 class="fw-bold"><span class="text-gray-400">IP:</span> {{ detailData.ip }}</h1>
                            </div>
                        </div>
                        <div class="card-body py-0">
                            <div class="mb-10">
                                <h6>Thông tin chi tiết:</h6>
                                <div class="py-5">
                                    <!--begin::Row-->
                                    <div class="me-5">
                                        <!--begin::Details-->
                                        <div>
                                            <div class="row fs-6 mb-3">
                                                <div class="col-3 text-gray-400">Port:</div>
                                                <div class="col-9 text-gray-800 fs-5 fw-bold"><span>{{ detailData.port ?? ''
                                                }}</span></div>
                                            </div>
                                            <div class="row fs-6 mb-3">
                                                <div class="col-3 text-gray-400">Hostnames:</div>
                                                <div class="col-9 text-gray-800">
                                                    <template v-if="detailData.hostnames.length">
                                                        <span v-for="(value, index) in detailData.hostnames" :key="index" :class="`badge badge-success`" class="me-1">
                                                            {{ value }}
                                                        </span>
                                                    </template>
                                                    <template v-else>
                                                        <span>--:--</span>
                                                    </template>
                                                </div>
                                            </div>
                                            <div class="row fs-6 mb-3">
                                                <div class="col-3 text-gray-400">Quốc gia:</div>
                                                <div class="col-9 text-gray-800"><span>{{ detailData.country ?? '' }}</span>
                                                </div>
                                            </div>
                                            <div class="row fs-6 mb-3">
                                                <div class="col-3 text-gray-400">Tổ chức:</div>
                                                <div class="col-9 text-gray-800"><span>{{ detailData.org ?? '' }}</span>
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
                </div>
                <!--end::Form-->
                <div class="modal-footer">
                    <button type="button" class="btn btn-sm  btn-primary me-9" data-bs-dismiss="modal">
                        Quay lại
                    </button>
                </div>
            </div>
            <!--end::Modal content-->
        </div>
        <!--end::Modal dialog-->
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
                    <div class="modal-body py-10 px-lg-17">
                        <div class="scroll-y me-n7 pe-7" id="kt_modal_new_target_group_scroll" data-kt-scroll="true"
                            data-kt-scroll-activate="{default: false, lg: true}" data-kt-scroll-max-height="auto"
                            data-kt-scroll-dependencies="#kt_modal_new_target_group_header"
                            data-kt-scroll-wrappers="#kt_modal_new_target_group_scroll" data-kt-scroll-offset="300px">
                            <span class="d-flex align-items-center fs-6 fw-semobold mb-2">
                                <h4>Bạn có chắc muốn scan CVE không</h4>
                            </span>

                        </div>
                    </div>

                    <div class="modal-footer flex-center">
                        <button ref="submitButtonRef" type="submit" id="kt_modal_new_target_group_submit"
                            class="btn btn-sm  btn-primary">
                            <span class="indicator-label"> Submit </span>
                            <span class="indicator-progress">
                                Please wait...
                                <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                            </span>
                        </button>
                    </div>
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
import { defineComponent, ref, onMounted, reactive, onBeforeUnmount } from "vue";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import type { Sort } from "@/components/kt-datatable/table-partials/models";
import ApiService from "@/core/services/ApiService";

// validate
import { hideModal } from "@/core/helpers/dom";
import { ErrorMessage, Field, Form as VForm } from "vee-validate";
import { vue3Debounce } from 'vue-debounce';
import Fillter from "@/views/apps/targets/filterTargetDectionListCVE.vue";

import Swal from "sweetalert2/dist/sweetalert2.js";

import { Modal } from "bootstrap";
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { string } from "yup";
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
        const description = ref<String>('');
        const id = ref<number>(0);
        const nameType = ref<string>('');
        const apiData = ref<APIData>({
            status: '',
            created_at: "",
            finished_at: '',
            user: '',
        });
        const errors = reactive({
            status: "",
            created_at: "",
            finished_at: '',
            user: '',
            detail: '',
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
        const CVEScanId = getIdFromUrl();
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
                columnName: "IP",
                columnLabel: "ip",
            },
            {
                columnName: "Port",
                columnLabel: "port",
            },
            {
                columnName: "Host names",
                columnLabel: "hostnames",
            },
            {
                columnName: "Quốc gia",
                columnLabel: "country",
            },
            {
                columnName: "Tổ chức",
                columnLabel: "org",
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

        // const handleClick = (data: object | any, type: String) => {
        //     typeModal.value = type
        //     // errors.name = ''
        //     // errors.domain = ''
        //     // errors.ip = ''
        //     // errors.group = ''
        //     // errors.detail = ''

        //     nameType.value = "Quét CVE"
        //     if (discardButtonRef.value !== null) {
        //         discardButtonRef.value.click();
        //     }
        //         // resetData();
        // };

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
            return ApiService.get(`/cve/scan-detail/${getIdFromUrl()}?search=${query.value}&status=${filterStatus.value}&page=${currentPage.value}&page_size=${itemsPerPage.value}&ordering=${orderingID.value}`)
                .then(({ data }) => {
                    list.value = data.results
                    totalPage.value = data.count
                    // if(!description.value && data.description){
                    //     description.value = data.description
                    //     notification(data.description, 'error','')
                    // }
                })
                .catch(({ response }) => {
                    notification(response.data.detail, 'error', 'Có lỗi xảy ra')
                })
                .finally(() => {
                    loading.value = false
                })
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
        const deleteFewSubscriptions = () => {
            deleteSubscription(selectedIds.value);
        };
        const disabled = ref<boolean>(false);

        const ModalDelete = ref<null | HTMLElement>(null);
        const deleteSubscription = (ids: Array<number>) => {
            let formData = {
                'id': ids
            }
            if (ids) {
                disabled.value = true
                setTimeout(() => {
                    disabled.value = false
                }, 1000);
                return ApiService.post(`/cve/scan-delete/${getIdFromUrl()}`, formData)
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
                detailData.country = detail.country
                detailData.cve_id = detail.cve_id
                detailData.cve_scan_id = detail.cve_scan_id
                detailData.id = detail.id
                detailData.ip = detail.ip
                detailData.org = detail.org
                detailData.port = detail.port
                detailData.hostnames = detail.hostnames
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
            if (typeModal.value == 'add') {

                return ApiService.post(`cve/${getIdFromUrl()}/create_scan`, {})
                    .then(({ data }) => {
                        notification(data.detail, 'success', 'Cấu hình quét lỗ hổng thành công')
                        getData();
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
                    .catch((response) => {
                        if (response?.data) {
                            errors.detail = response.data.detail;

                            notification(response?.data?.detail, 'error', 'Có lỗi xảy ra')
                        } else {
                            notification(response?.data?.detail, 'error', 'Có lỗi xảy ra')
                        }
                    });
            }
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
            getIdFromUrl,
            newTargetGroupModalRef,
            // handleClick,
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
            CVEScanId,
            disabled,
        };
    },
});
</script>

<style lang="scss">.override-styles {
    z-index: 99999 !important;
    pointer-events: initial;
}</style>
