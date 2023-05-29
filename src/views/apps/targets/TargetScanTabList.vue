<template>
    <!--begin::Navbar-->
    <div class="card mb-3 mb-xxl-8">
        <!--begin::Card header-->
        <div class="card-header border-0 pt-6 position-absolute end-0 pe-1 " style="top: -80px;">
            <!--begin::Card toolbar-->
            <div class="card-toolbar">

                <div class="d-flex justify-content-end " data-kt-subscription-table-toolbar="base">
                    <button type="button"
                        class="btn btn-sm fw-bold bg-danger btn-color-gray-700 btn-active-color-primary text-white"
                        data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end" data-kt-menu-flip="top-end">
                        <KTIcon icon-name="cross-square" icon-class="fs-2 text-white" />
                        Hủy bỏ
                    </button>
                    <button type="button"
                        class="btn btn-sm btn-outline btn-outline-dashed fw-bold bg-body btn-color-gray-700 btn-active-color-primary ms-2"
                        data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end" data-kt-menu-flip="top-end">
                        <KTIcon icon-name="filter" icon-class="fs-2" />
                        Tạm dừng
                    </button>
                    <button type="button"
                        class="btn btn-sm fw-bold bg-primary btn-color-gray-700 btn-active-color-primary ms-2 text-white"
                        data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end" data-kt-menu-flip="top-end">
                        <KTIcon icon-name="file-down" icon-class="fs-2 text-white" />
                        Xuất kết quả
                    </button>
                </div>
            </div>
            <!--end::Card toolbar-->
        </div>
        <!--end::Card header-->
        <div class="card-body pt-2 pb-0">
            <!--begin::Details-->
            <div class="d-flex flex-wrap flex-sm-nowrap">
                <!--begin::Info-->
                <div class="flex-grow-1">
                    <!--begin::Title-->
                    <div class="d-flex justify-content-between align-items-start flex-wrap">
                        <!--begin::Card body-->
                        <div class="card-body py-4 px-0">
                            <!--begin::Row-->
                            <div class="row mb-5">
                                <div class="col-3">
                                    <div class="row">
                                        <!--begin::Label-->
                                        <label class="col-4 fw-semobold text-muted">Tên :</label>
                                        <!--end::Label-->

                                        <!--begin::Col-->
                                        <div class="col">
                                            <span class="fw-bold fs-6 text-dark">{{ targetData.name }}</span>
                                        </div>
                                        <!--end::Col-->
                                    </div>
                                </div>
                                <div class="col-3">
                                    <div class="row">
                                        <!--begin::Label-->
                                        <label class="col-4 fw-semobold text-muted">IP :</label>
                                        <!--end::Label-->
                                        <!--begin::Col-->
                                        <div class="col">
                                            <span class="fw-bold fs-6 text-dark">{{ targetData.ip }}</span>
                                        </div>
                                        <!--end::Col-->
                                    </div>
                                </div>
                                <div class="col-3">
                                    <div class="row">
                                        <!--begin::Label-->
                                        <label class="col-4 fw-semobold text-muted">Domain :</label>
                                        <!--end::Label-->

                                        <!--begin::Col-->
                                        <div class="col">
                                            <span class="fw-bold fs-6 text-dark">{{ targetData.domain }}</span>
                                        </div>
                                        <!--end::Col-->
                                    </div>
                                </div>
                            </div>
                            <!--end::Row-->


                            <!--begin::Row-->
                            <div class="row">
                                <div class=" col-3 p-2">
                                    <div class="border border-gray-300 border-dashed rounded py-3 px-4 ">
                                        <!--begin::Number-->
                                        <div class="d-flex align-items-center">
                                            <KTIcon icon-name="timer" icon-class="fs-3 text-success me-2" />
                                            <div class="fs-2 fw-bold">10m 38s </div>
                                        </div>
                                        <!--end::Number-->

                                        <!--begin::Label-->
                                        <div class="fw-semobold fs-6 text-gray-400">Thời Gian</div>
                                        <!--end::Label-->
                                    </div>
                                    <!--end::Stat-->
                                </div>
                                <div class="col-3 p-2">
                                    <div class="border border-gray-300 border-dashed rounded py-3 px-4 ">
                                        <!--begin::Number-->
                                        <div class="d-flex align-items-center">
                                            <KTIcon icon-name="arrow-up-down" icon-class="fs-3 text-success me-2" />
                                            <div class="fs-2 fw-bold">{{ countRequest }}</div>
                                        </div>
                                        <!--end::Number-->

                                        <!--begin::Label-->
                                        <div class="fw-semobold fs-6 text-gray-400">Yêu cầu</div>
                                        <!--end::Label-->
                                    </div>

                                </div>
                                <div class="col-3 p-2">
                                    <div class="border border-gray-300 border-dashed rounded py-3 px-4 ">
                                        <!--begin::Number-->
                                        <div class="d-flex align-items-center">
                                            <KTIcon icon-name="watch" icon-class="fs-3 text-success me-2" />
                                            <div class="fs-2 fw-bold">{{ averageResponseTime }}</div>
                                        </div>
                                        <!--end::Number-->

                                        <!--begin::Label-->
                                        <div class="fw-semobold fs-6 text-gray-400">Average Response Time</div>
                                        <!--end::Label-->
                                    </div>
                                    <!--end::Stat-->

                                </div>
                                <div class="col-3 p-2">
                                    <div class="border border-gray-300 border-dashed rounded py-3 px-4 ">
                                        <!--begin::Number-->
                                        <div class="d-flex align-items-center">
                                            <KTIcon icon-name="pointers" icon-class="fs-3 text-success me-2" />
                                            <div class="fs-2 fw-bold">{{ locations }}</div>
                                        </div>
                                        <!--end::Number-->

                                        <!--begin::Label-->
                                        <div class="fw-semobold fs-6 text-gray-400">Đường dẫn</div>
                                        <!--end::Label-->
                                    </div>
                                    <!--end::Stat-->

                                </div>
                            </div>
                            <!--end::Row-->

                        </div>
                        <!--end::Card body-->
                    </div>
                    <!--end::Title-->
                </div>
                <!--end::Info-->
            </div>
            <!--end::Details-->
        </div>
    </div>
    <!--end::Navbar-->
    <div class="d-flex mb-3 h-50px">
        <div class="py-2">
            <div>
                <button type="button" class="btn btn-icon btn-sm fw-bold bg-success h-35px w-35px text-white">
                    {{ severityInfo }}
                </button>
                <button type="button" class="btn btn-icon btn-sm fw-bold bg-primary h-35px w-35px text-white ms-2">
                    {{ severityLow }}
                </button>
                <button type="button" class="btn btn-icon btn-sm fw-bold bg-warning h-35px w-35px text-white ms-2">
                    {{ severityMedium }}
                </button>
                <button type="button" class="btn btn-icon btn-sm fw-bold bg-danger h-35px w-35px text-white ms-2">
                    {{ severityHigh }}
                </button>
                <button type="button"
                    class="btn btn-icon btn-sm fw-bold btn-outline btn-outline-dashed btn-outline-info h-35px w-35px text-info ms-2">
                    All
                </button>
            </div>
        </div>
        <div class="ms-auto py-2">
            <div class="d-flex">
                <!--begin::Tab nav-->
                <ul class="nav nav-pills me-6 mb-2 mb-sm-0" role="tablist">
                    <li class="nav-item m-0" role="presentation">
                        <a class="btn btn-sm btn-icon btn-light btn-color-muted btn-active-primary me-3 active"
                            data-bs-toggle="tab" href="#kt_project_users_card_pane" aria-selected="true" role="tab">
                            <i class="ki-duotone ki-element-plus fs-2"><span class="path1"></span><span
                                    class="path2"></span><span class="path3"></span><span class="path4"></span><span
                                    class="path5"></span></i> </a>
                    </li>

                    <li class="nav-item m-0" role="presentation">
                        <a class="btn btn-sm btn-icon btn-light btn-color-muted btn-active-primary" data-bs-toggle="tab"
                            href="#kt_project_users_table_pane" aria-selected="false" role="tab" tabindex="-1">
                            <i class="ki-duotone ki-row-horizontal fs-2"><span class="path1"></span><span
                                    class="path2"></span></i> </a>
                    </li>
                </ul>
                <!--end::Tab nav-->

                <!--begin::Actions-->
                <div class="d-flex my-0 mx-2">
                    <!--begin::Select-->
                    <button type="button"
                        class="btn btn-sm h-35px fw-bold bg-primary btn-color-gray-700 btn-active-color-primary ms-2 text-white">
                        <KTIcon icon-name="arrows-loop" icon-class="fs-2 text-white" />
                        Tải lại
                    </button>
                    <!--end::Select-->
                </div>
                <!--end::Actions-->

                <!--begin::Actions-->
                <div class="d-flex my-0">
                    <!--begin::Select-->
                    <el-form-item>
                        <el-select placeholder="Chọn kiểu" name="type" as="select" height="40px"
                            class="input-group-lg w-150px">
                            <el-option value="">Chọn kiểu</el-option>
                            <el-option label="DB Leak" value="1">DB Leak</el-option>
                            <el-option label="Hacker News" value="2">Hacker News</el-option>
                        </el-select>
                    </el-form-item>
                    <!--end::Select-->
                </div>
                <!--end::Actions-->
            </div>
        </div>
    </div>

    <!--begin::Card-->
    <div class="card h-100 d-block">


        <div class="d-flex hand-height-2 shadow-hvover " :class="classDetail ? 'py-2 ps-2 pe-1' : ''">
            <!--begin::Card body-->
            <div class="card-body overflow-scroll h-100 m-0" ref="container" @mousedown="handleMouseDown"
                :style="classDetail ? { width: leftWidth + 'px' } : { width: '100%' }"
                :class="classDetail ? 'd-block border-end p-3' : 'col-12 d-block p-0'">
                <div :style="{ width: contentWidth + 'px' }">
                    <KTDatatable :clickOnRow="true" :data="list" :header="headerConfig" :loading="loading"
                         :itemsPerPage="itemsPerPage" :total="totalPage" :currentPage="currentPage"
                        @page-change="handlePage" @on-items-per-page-change="handlePerPage" @customRow="customRowTable">
                        <template v-slot:severity="{ row: customer }">
                            <div class="text-center">
                                <KTIcon icon-name="severity" icon-class="bi bi-bug-fill"
                                    :style="{ fontSize: '19px', color: getSeverity(customer.severity).color }" /><br>
                                <p class="fst-normal"
                                    :style="{ fontSize: '11px', color: getSeverity(customer.severity).color }">{{
                                        getSeverity(customer.severity).title }}</p>
                            </div>
                        </template>
                        <template v-slot:vt_name="{ row: customer }"><span
                                class="fs-6 fw-bold text-dark text-hover-primary">
                                {{ customer.vt_name ?? customer.port_scan["vt_name"] }}</span></template>
                        <template v-slot:affects_url="{ row: customer }">
                            <div class="badge badge-light">{{ customer.affects_url ?? '--' }}</div>
                        </template>
                        <template v-slot:status="{ row: customer }">
                            <div> <span :class="`badge badge-${getStatus(customer.status).color}`">{{ customer.status ??
                                '--' }}</span>
                            </div>
                        </template>
                        <template v-slot:last_seen="{ row: customer }">
                            <span class="text-gray-600 w-bold d-flex justify-content-end align-items-center fs-7">
                                <KTIcon class="me-1" icon-name="calendar" icon-class="fs-3" />
                                {{ customer.last_seen }}
                            </span>
                        </template>
                    </KTDatatable>
                </div>
            </div>
            <!--end::Card body-->
            <div v-if="classDetail" @mousedown="startDragging" class="drag-handle"></div>
            <!--begin::Card2 body-->
            <div class="overflow-scroll h-100 " :style="classDetail ? { width: rightWidth + 'px' } : { width: '0px' }"
                :class="classDetail ? ' d-block' : 'd-none'">
                <div class="ms-3 pb-10">
                    ````123````
                </div>
            </div>
            <!--end::Card2 body-->
        </div>

    </div>
    <!--end::Card-->
</template>
  
<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref, onMounted, reactive } from "vue";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import ApiService from "@/core/services/ApiService";

// validate
import { hideModal } from "@/core/helpers/dom";
import { ErrorMessage, Field, Form as VForm } from "vee-validate";
import { vue3Debounce } from 'vue-debounce';

import Swal from "sweetalert2/dist/sweetalert2.js";
import Fillter from "@/views/apps/scans/filters.vue";
import CodeHighlighter from "@/components/highlighters/CodeHighlighter.vue";
import { Modal } from "bootstrap";
import { useRoute } from 'vue-router';

interface APIData {
    title: string;
    description: string;
}

interface getData {
    last_seen: string;
    status: string;
    affects_url: string;
    vt_name: string;
    severity: string;
}

interface detailData {
    last_seen: string;
    status: string;
    affects_url: string;
    vt_name: string;
    severity: string;
}

interface targetData {
    created_at: string;
    modified_at: string;
    domain: string;
    group: string;
    id: string;
    ip: string;
    name: string;
}


export default defineComponent({
    name: "kt-scanstabs-list",

    components: {
        KTDatatable,
        ErrorMessage,
        Field,
        VForm,
        Fillter,
        CodeHighlighter,
    },
    directives: {
        debounce: vue3Debounce({ lock: true })
    },
    setup() {
        const route = useRoute();
        const scanID = ref<null | number | any>(route.params.id ?? '');
        const list = ref<getData | any>()
        const loading = ref<boolean>(false)
        const totalPage = ref<number>(0);
        const currentPage = ref<number>(1);
        const itemsPerPage = ref<number>(20);
        const query = ref<String>('');
        const typeModal = ref<String>('');
        const nameType = ref<string>('');
        const classDetail = ref<boolean>(false);
        const countRequest = ref<number | string>(0);
        const averageResponseTime = ref<number | string>(0);
        const locations = ref<number | string>(0);
        const maxResponseTime = ref<number | string>(0);
        const apiData = ref<APIData>({
            title: '',
            description: '',
        });
        const detailData = ref({
            id: '',
            vt_name: '',
        });
        const targetData = ref<targetData>({
            created_at: '',
            modified_at: '',
            domain: '',
            group: '',
            id: '',
            ip: '',
            name: ''
        })
        const severityInfo = ref<number>()
        const severityLow = ref<number>()
        const severityMedium = ref<number>()
        const severityHigh = ref<number>()

        const headerConfig = ref([
            {
                columnName: "Mức độ",
                columnLabel: "severity",
            },
            {
                columnName: "Lỗ hổng",
                columnLabel: "vt_name",
            },
            {
                columnName: "URL",
                columnLabel: "affects_url",
            },
            {
                columnName: "Trạng thái",
                columnLabel: "status",
            },
            {
                columnName: "Ngày tạo",
                columnLabel: "last_seen",
            }
        ]);

        const handleClick = (data: object | any, type: String) => {
            typeModal.value = type
            apiData.value.description = data.description;
        };

        const handlePage = (page: number) => {
            currentPage.value = page ?? 1;
            getData();
        };

        const handlePerPage = (itemsPage: number) => {
            itemsPerPage.value = itemsPage ?? 20;
            getData();
        };

        const getData = async () => {
            loading.value = true;
            setTimeout(() => loading.value = false, 500)
            return ApiService.get(`/scan/detail/${scanID.value}`)
                .then(({ data }) => {
                    list.value = data.vulnerabilities
                    targetData.value.id = data.target.id
                    targetData.value.domain = data.target.domain
                    targetData.value.ip = data.target.ip
                    targetData.value.name = data.target.name
                    totalPage.value = data.count

                    // time'..
                    countRequest.value = new Intl.NumberFormat("en-US").format(data.web_scan_status.request_count ?? 0);
                    averageResponseTime.value = data.web_scan_status.avg_response_time != undefined ? data.web_scan_status.avg_response_time + 'ms' : '0ms';
                    locations.value = new Intl.NumberFormat("en-US").format(data.web_scan_status.locations ?? 0);
                    maxResponseTime.value = data.web_scan_status.max_response_time

                    // severity
                    severityInfo.value = data.severity_counts.info
                    severityLow.value = data.severity_counts.low
                    severityHigh.value = data.severity_counts.high
                    severityMedium.value = data.severity_counts.medium
                    console.log(countRequest.value)
                    console.log(averageResponseTime.value)
                    console.log(locations.value)
                    console.log(maxResponseTime.value)
                    console.log(data)
                })
                .catch(({ response }) => {
                    notification(response.data.detail, 'error', 'Có lỗi xảy ra')
                });
        }

        const customRowTable = (detail: any) => {
            classDetail.value = true;
            console.log(detail)
        };

        const handleCloseDetail = () => {
            classDetail.value = false;
        };

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
                // hideModal(ModalDelete.value);
                // hideModal( ModalConfirm.value);
            });
        };

        const getSeverity = (severity: number | string) => {
            if (severity == 0) {
                return { id: 0, title: 'Info', color: '#28a745', class: 'severityInfo' };
            } else if (severity == 1) {
                return { id: 1, title: 'Low', color: '#23b7e5', class: 'severityLow' };
            } else if (severity == 2) {
                return { id: 2, title: 'Medium', color: '#fcba32', class: 'severityMedium' };
            } else if (severity == 3) {
                return { id: 3, title: 'High', color: '#e11f26', class: 'severityHigh' };
            }
            return { id: 4, title: 'undefined', color: 'light', class: 'severityundefined' };
        };

        const getStatus = (status: string) => {
            if (status === 'open') {
                return { id: 3, title: 'Open', color: 'success' };
            } else if (status === 're-open') {
                return { id: 5, title: 'Reopen', color: 'primary' };
            } else if (status === 'closed') {
                return { id: 6, title: 'Close', color: 'danger' };
            } else if (status === 'rick-accepted') {
                return { id: 7, title: 'Accepted', color: 'info' };
            }
            return { id: 8, title: 'undefined', color: 'light' };
        };

        // chia màn hình
        const leftWidth = ref(window.innerWidth / 2);
        const rightWidth = ref(window.innerWidth / 2);
        let startX = ref<null | any>(null);

        const startDragging = (event: any) => {
            startX = event.clientX;

            const handleDragging = (e: any) => {
                const deltaX = e.clientX - startX;

                leftWidth.value += deltaX;
                rightWidth.value -= deltaX;

                startX = e.clientX;
            };

            const stopDragging = () => {
                window.removeEventListener("mousemove", handleDragging);
                window.removeEventListener("mouseup", stopDragging);
            };

            window.addEventListener("mousemove", handleDragging);
            window.addEventListener("mouseup", stopDragging);
        };

        // keos thar
        const container = ref<null | any>(null);
        const state = reactive({
            isDragging: false,
            startX: 0,
            startScrollLeft: 0,
        });

        const handleMouseDown = (event: any) => {
            state.isDragging = true;
            state.startX = event.clientX;
            state.startScrollLeft = container.value.scrollLeft;

            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        };

        const handleMouseMove = (event: any) => {
            if (!state.isDragging) return;

            const deltaX = event.clientX - state.startX;
            container.value.scrollLeft = state.startScrollLeft - deltaX;
        };

        const handleMouseUp = () => {
            state.isDragging = false;

            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };

        // Tính toán chiều rộng nội dung
        const contentWidth = ref(0);
        onMounted(() => {
            contentWidth.value = container.value.scrollWidth;
        });

        onMounted(() => {
            getData();
        });

        return {
            getData,
            list,
            headerConfig,
            getAssetPath,
            handleCloseDetail,
            targetData,
            maxResponseTime,
            locations,
            averageResponseTime,
            countRequest,
            severityMedium,
            severityHigh,
            severityLow,
            severityInfo,

            // crud
            apiData,
            handleClick,

            // detials
            customRowTable,

            // page 
            itemsPerPage,
            totalPage,
            currentPage,
            handlePage,
            handlePerPage,

            // search query 
            query,

            // edit 
            nameType,

            // sử lý dữ liệu
            getSeverity,
            getStatus,

            // filter
            loading,

            // detail
            classDetail,
            detailData,

            // Dragging kéo lề
            startDragging,
            leftWidth,
            rightWidth,

            // mouse down di chuột xuống
            handleMouseDown,
            contentWidth,
            container,
        };
    },
});
</script>
  
<style>
.shadow-hvover {
    box-shadow: 5px 6px 10px -9px rgba(0, 0, 0, .3);
}

.el-select .el-input__wrapper {
    height: 35px !important;
}

/* cursor: col-resize; */
.drag-handle {
    flex-basis: 5px;
    background-color: unset;
    cursor: col-resize;
    position: relative;
}

.drag-handle:hover,
.drag-handle:active {
    background-color: rgba(211, 211, 211, 0.822);
}

.drag-handle::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 0px;
    background-color: black;
}
</style>
  