<template>
    <!--begin::Card-->
    <div class="card h-100 d-block">
        <!--begin::Card header-->
        <div class="card-header border-0 pt-6 position-absolute end-0 pe-1 " style="top: -80px;">
            <!--begin::Card title-->
            <!-- <div class="card-title"> -->
            <!--begin::Search-->
            <!-- <div class="d-flex align-items-center position-relative my-1">
          <KTIcon icon-name="magnifier" icon-class="fs-1 position-absolute ms-6" />
          <input type="text" data-kt-subscription-table-filter="search" :value="query" @input="setQuery"
            class="form-control form-control-solid w-250px ps-14" placeholder="Search Subscriptions" v-debounce:1000ms="getData" />
        </div> -->
            <!--end::Search-->
            <!-- </div> -->
            <!--begin::Card title-->

            <!--begin::Card toolbar-->
            <div class="card-toolbar">
                <!--begin::Toolbar-->
                <div v-show="selectedIds.length === 0">
                    <div class="d-flex justify-content-end" data-kt-subscription-table-toolbar="base">
                        <!--begin::Export-->
                        <el-tooltip class="box-item" effect="dark" content="Tìm kiếm" placement="top">
                            <button type="button"
                                class="btn btn-sm fw-bold bg-body btn-color-gray-700 btn-active-color-primary me-2"
                                data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end" data-kt-menu-flip="top-end">
                                <KTIcon icon-name="filter" icon-class="fs-2" />
                                Filter
                            </button>
                        </el-tooltip>
                        <Fillter @filterData="handleFilter" :data-group="data_group"></Fillter>
    
                        <!--end::Export-->
    
                        <!--begin::Add subscription-->
                        <el-tooltip class="box-item" effect="dark" content="Scan mục tiêu" placement="top">
                            <button type="button" class="btn btn-sm fw-bold btn-primary" data-bs-toggle="modal"
                                data-bs-target="#kt_modal_new_target_group" @click.passive="handleClick({}, 'add')">
                                <KTIcon icon-name="plus" icon-class="fs-2" />
                                Quét
                            </button>
                        </el-tooltip>
                        <!--end::Add subscription-->
                    </div>
                </div>
                <!--end::Toolbar-->

                <!--begin::Group actions-->
                <div v-show="selectedIds.length !== 0">
                    <div class="d-flex justify-content-end align-items-center">
                        <div class="fw-bold me-5">
                            <span class="me-2">{{ selectedIds.length }}</span>Selected
                        </div>
                        <el-tooltip class="box-item" effect="dark" content="Xóa" placement="top">
                            <button type="button" data-bs-target="#kt_modal_delete" data-bs-toggle="modal" class="btn btn-danger btn-sm ">
                                Delete Selected
                            </button>
                        </el-tooltip>
                    </div>
                </div>
                <!--end::Group actions-->
            </div>
            <!--end::Card toolbar-->
        </div>
        <!--end::Card header-->

        <!--begin::Card body-->
        <div class="card-body pt-0 overflow-scroll h-100 p-0 m-0 ">
            <KTDatatable @on-sort="sort" @on-items-select="onItemSelect" :data="list" :header="headerConfig"
                :loading="loading" :checkbox-enabled="true" :itemsPerPage="itemsPerPage" :total="totalPage"
                :currentPage="currentPage" @page-change="handlePage" @on-items-per-page-change="handlePerPage"
                @customRow="customRowTable">
                <template v-slot:id="{ row: customer }">{{ customer.id }}</template>
                <template v-slot:user="{ row: customer }">{{ customer.user.username }}</template>
                <template v-slot:status_name="{ row: customer }"><span :class="`badge badge-${getStatus(customer.status).color}`">{{ customer.status_name ?? '--' }}</span></template>
                <template v-slot:created_at="{ row: customer }">
                    {{ customer.created_at ? customer.created_at: '--:--' }}
                </template>
                <template v-slot:finished_at="{ row: customer }">
                    {{ customer.finished_at ?customer.finished_at : '--:--' }}
                </template>
                <template v-slot:actions="{ row: customer }">
                    <el-tooltip class="box-item" effect="dark" content="Chi tiết" placement="top">
                        <router-link :to="`/target-scan-detail/${targetId}/${customer.id}/detail`" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1">
                            <KTIcon icon-name="eye" icon-class="fs-3" />
                        </router-link>
                    </el-tooltip>
                </template>
            </KTDatatable>
        </div>
        <!--end::Card body-->
    </div>
    <!--end::Card-->


    <!-- modal  -->
    <div class="modal fade" tabindex="-1" id="kt_modal_new_target_group" ref="newTargetGroupModalRef" aria-hidden="true">
        <!--begin::Modal dialog-->
        <div class="modal-dialog modal-dialog-centered mw-650px">
            <!--begin::Modal content-->
            <div class="modal-content">
                <!--begin::Modal header-->
                <div class="modal-header" id="kt_modal_new_target_group_header">
                    <!--begin::Modal title-->
                    <h2>{{ nameType }}</h2>
                    <!--end::Modal title-->

                    <!--begin::Close-->
                    <div class="btn btn-sm btn-icon btn-active-color-primary" data-bs-dismiss="modal">
                        <KTIcon icon-name="cross" icon-class="fs-1" />
                    </div>
                    <!--end::Close-->
                </div>
                <!--end::Modal header-->

                <!--begin::Form-->
                <VForm id="kt_modal_new_target_group_form" class="form" @submit="submit"
                    :validation-schema="scanFormState.proxyAuthenticationCheck && scanFormState.proxyCheck ? validationSchema 
                                        : (scanFormState.proxyCheck && !scanFormState.proxyAuthenticationCheck) ? validationSchemaProxyCheck
                                        : (!scanFormState.proxyCheck && scanFormState.proxyAuthenticationCheck) ||  (!scanFormState.proxyCheck && !scanFormState.proxyAuthenticationCheck) ? validationSchemaFalse
                                        : validationSchemaFalse"
                >
                    <div class="modal-body py-10 px-lg-17">
                        <div class="scroll-y me-n7 pe-7" id="kt_modal_new_target_group_scroll" data-kt-scroll="true"
                            data-kt-scroll-activate="{default: false, lg: true}" data-kt-scroll-max-height="auto"
                            data-kt-scroll-dependencies="#kt_modal_new_target_group_header"
                            data-kt-scroll-wrappers="#kt_modal_new_target_group_scroll" data-kt-scroll-offset="300px">
                            <div class="mb-5 fv-row">
                                <label class="d-flex align-items-center fs-6 fw-semobold mb-2">
                                    <span class="required"><b>Tốc độ scan</b></span>
                                </label>
                                <div class="d-flex align-items-center" style="padding-left: 20px;">
                                    <label class="form-check form-check-custom form-check-solid me-10">
                                        <input
                                            class="form-check-input h-20px w-20px"
                                            type="radio"
                                            name="type"
                                            :value="1"
                                            v-model="scanFormState.scanSpeedOption"
                                        />
                                        <span class="form-check-label fw-semobold"> Tuần tự </span>
                                    </label>
                                    <label class="form-check form-check-custom form-check-solid me-10">
                                        <input
                                            class="form-check-input h-20px w-20px"
                                            type="radio"
                                            name="type"
                                            :value="2"
                                            v-model="scanFormState.scanSpeedOption"
                                        />
                                        <span class="form-check-label fw-semobold"> Chậm </span>
                                    </label>
                                    <label class="form-check form-check-custom form-check-solid me-10">
                                        <input
                                            class="form-check-input h-20px w-20px"
                                            type="radio"
                                            name="type"
                                            :value="3"
                                            v-model="scanFormState.scanSpeedOption"
                                            checked
                                        />
                                        <span class="form-check-label fw-semobold"> Trung bình </span>
                                    </label>
                                    <label class="form-check form-check-custom form-check-solid">
                                        <input
                                            class="form-check-input h-20px w-20px"
                                            type="radio"
                                            name="type"
                                            :value="4"
                                            v-model="scanFormState.scanSpeedOption"
                                        />
                                        <span class="form-check-label fw-semobold"> Nhanh </span>
                                    </label>
                                </div>
                            </div>
                            <div class="d-flex flex-stack mb-8">
                                <div class="me-5">
                                    <label class="fs-6 fw-semobold"><b>Proxy</b></label>
                                </div>
                                <label class="form-check form-switch form-check-custom form-check-solid">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        name="proxyCheck"
                                        v-model="scanFormState.proxyCheck"
                                    />
                                    <span class="form-check-label fw-semobold text-gray-400">Allowed</span>
                                </label>
                            </div>
                            <div style="padding-left: 20px;" v-if="scanFormState.proxyCheck">
                                <div class="mb-5 fv-row">
                                    <label class="d-flex align-items-center fs-6 fw-semobold mb-2">
                                        <span>Giao thức</span>
                                    </label>
                                    <el-select v-model="scanFormState.proxyScheme" name="proxyScheme" as="select" placeholder="Chọn giao thức">
                                        <el-option value="">Chọn trạng thái</el-option>
                                        <el-option label="HTTP" value="HTTP">HTTP</el-option>
                                        <el-option label="SOCKS5" value="SOCKS5">SOCKS5</el-option>
                                    </el-select>
                                    <div class="fv-plugins-message-container">
                                        <div class="fv-help-block">
                                            <ErrorMessage name="proxyScheme" />
                                            <span class="" v-if="errors.proxyScheme">{{ errors.proxyScheme[0] }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-5 fv-row row">
                                    <div class="col-6">
                                        <label class="d-flex align-items-center fs-6 fw-semobold mb-2">
                                            <span>Địa chỉ</span>
                                        </label>
                                        <Field type="text" class="form-control form-control-solid"
                                            placeholder="example.com" name="proxyAdress" v-model="scanFormState.proxyAdress" />
                                        <div class="fv-plugins-message-container">
                                            <div class="fv-help-block">
                                                <ErrorMessage name="proxyAdress" />
                                                <span class="" v-if="errors.proxyAdress">{{ errors.proxyAdress[0] }}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-6">
                                        <label class="d-flex align-items-center fs-6 fw-semobold mb-2">
                                            <span>Cổng dịch vụ</span>
                                        </label>
                                        <Field type="text" class="form-control form-control-solid"
                                            placeholder="80" name="proxyPort" v-model="scanFormState.proxyPort" />
                                        <div class="fv-plugins-message-container">
                                            <div class="fv-help-block">
                                                <ErrorMessage name="proxyPort" />
                                                <span class="" v-if="errors.proxyPort">{{ errors.proxyPort[0] }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="mb-5 fv-row">
                                    <div class="form-check form-check-custom form-check-solid" name="proxyAuthenticationCheck">
                                        <label class="d-flex align-items-center fs-6 fw-semobold" for="is_staff">Proxy yêu cầu xác thực</label>
                                        <input 
                                            class="form-check-input" style="margin-left: 20px;" 
                                            type="checkbox" value="1" 
                                            v-model="scanFormState.proxyAuthenticationCheck"
                                        >
                                    </div>
                                </div>
                                <div v-if="scanFormState.proxyAuthenticationCheck">
                                    <div class="mb-5 fv-row row">
                                        <div class="col-6">
                                            <label class="d-flex align-items-center fs-6 fw-semobold mb-2">
                                                <span>Tên đăng nhập</span>
                                            </label>
                                            <Field type="text" class="form-control form-control-solid"
                                                name="proxyUsername" v-model="scanFormState.proxyUsername" />
                                            <div class="fv-plugins-message-container">
                                                <div class="fv-help-block">
                                                    <ErrorMessage name="proxyUsername" />
                                                    <span class="" v-if="errors.proxyUsername">{{ errors.proxyUsername[0] }}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-6">
                                            <label class="d-flex align-items-center fs-6 fw-semobold mb-2">
                                                <span>Mật khẩu</span>
                                            </label>
                                            <div class="position-relative mb-3">
                                                <Field :type="!eyeButtonRef ? 'password' : 'text'" class="form-control form-control-solid" name="proxyUserPassword"
                                                id="proxyUserPassword" v-model="scanFormState.proxyUserPassword" />

                                                <span class="btn btn-sm btn-icon position-absolute translate-middle top-50 end-0 me-n2">
                                                    <KTIcon :icon-name="!eyeButtonRef ? 'eye-slash' : 'eye'" icon-class="fs-2" @click="eyePassword"/>
                                                </span>
                                            </div>
                                            <div class="fv-plugins-message-container">
                                                <div class="fv-help-block">
                                                    <ErrorMessage name="proxyUserPassword" />
                                                    <span class="" v-if="errors.proxyUserPassword">{{ errors.proxyUserPassword[0] }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mb-5 fv-row">
                                        
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex flex-stack mb-8">
                                <div class="me-5">
                                    <label class="fs-6 fw-semobold"><b>Sử dụng Header tùy chọn</b></label>
                                </div>
                                <label class="form-check form-switch form-check-custom form-check-solid">
                                    <input
                                        @click="clearHeaderOptions"
                                        class="form-check-input"
                                        type="checkbox"
                                        name="headerOption"
                                        v-model="scanFormState.headerOptionCheck"
                                    />
                                    <span class="form-check-label fw-semobold text-gray-400">Allowed</span>
                                </label>
                            </div>
                            <div style="padding-left: 20px;" v-if="scanFormState.headerOptionCheck">
                                <div class="mb-5 fv-row">
                                    <el-form-item prop="tags">
                                        <el-select
                                            v-model="scanFormState.headerOptionValue"
                                            multiple
                                            filterable
                                            allow-create
                                            default-first-option
                                            placeholder="Ví dụ: Cookie: e8452aaa"
                                        >
                                        </el-select>
                                        <div class="fv-plugins-message-container">
                                            <div class="fv-help-block">
                                                <ErrorMessage name="headerOptionValue" />
                                                <span class="" v-if="errors.headerOptionValue">{{ errors.headerOptionValue[0] }}</span>
                                            </div>
                                        </div>
                                    </el-form-item>
                                </div>
                            </div>
                            <div class="d-flex flex-stack mb-8">
                                <div class="me-5">
                                    <label class="fs-6 fw-semobold"><b>Quét bằng Nmap</b></label>
                                </div>
                                <label class="form-check form-switch form-check-custom form-check-solid">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        name="nmap_check"
                                        v-model="scanFormState.nmap_check"
                                    />
                                    <span class="form-check-label fw-semobold text-gray-400">Allowed</span>
                                </label>
                            </div>
                            <div class="d-flex flex-stack mb-8">
                                <div class="me-5">
                                    <label class="fs-6 fw-semobold"><b>Quét bằng Nuclei</b></label>
                                </div>
                                <label class="form-check form-switch form-check-custom form-check-solid">
                                    <input
                                        class="form-check-input"
                                        type="checkbox"
                                        name="nuclei_check"
                                        v-model="scanFormState.nuclei_check"
                                    />
                                    <span class="form-check-label fw-semobold text-gray-400">Allowed</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="modal-footer flex-center">
                        <button ref="discardButtonRef" type="reset" id="kt_modal_new_target_group_cancel"
                            class="btn btn-sm  btn-light me-3">
                            Discard
                        </button>
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

    <div class="modal fade" tabindex="-1" ref="ModalDetail" aria-hidden="true" id="kt_modal_detail">
        <div class="modal-dialog modal-dialog-centered mw-650px">
            <div class="modal-content">
                <div class="modal-body">
                    <div class="card card-flush pt-3 mb-5 mb-xl-10">
                        <div class="card-header">
                            <div class="card-title">
                                <h1 class="fw-bold">{{ detailData.username }}</h1>
                            </div>
                        </div>
                        <div class="card-body py-0">
                            <div class="mb-10">
                                <h5>Thông tin chi tiết:</h5>
                                <div class="d-flex flex-wrap py-5">
                                    <div class="flex-equal me-5">
                                        <div class="table fs-6 fw-semobold gs-0 gy-2 gx-2 m-0">
                                            <div class="row mb-4">
                                                <div class="text-gray-400 col-6">Tốc độ Scan:</div>
                                                <div class="text-gray-800 pe-2 col-6">{{ getScanSpeedName(detailData.dataScanner.scanSpeedOption) }} </div>
                                            </div>
                                            <div class="row mb-4">
                                                <div class="text-gray-400 col-6">Proxy:</div>
                                                <div class="text-gray-800 col-6 pe-2">{{ detailData.dataScanner.proxyCheck ? 'Bật' : 'Tắt' }}
                                                </div>
                                            </div>
                                            <ul v-if="detailData.dataScanner.proxyCheck">
                                                <li>Giao thức: {{ detailData.dataScanner.proxyScheme }}</li>
                                                <li>Địa chỉ: {{ detailData.dataScanner.proxyAdress }}</li>
                                                <li>Proxy yêu cẫu xác thực: {{ detailData.dataScanner.proxyAuthenticationCheck ? 'Bật' : 'Tắt' }}</li>
                                                <li v-if="detailData.dataScanner.proxyAuthenticationCheck">Tên đăng nhập: {{ detailData.dataScanner.proxyUsername }}</li>
                                                <li v-if="detailData.dataScanner.proxyAuthenticationCheck">Mật khẩu: {{ detailData.dataScanner.proxyUserPassword }}</li>
                                            </ul>
                                            <div class="row mb-4">
                                                <div class="text-gray-400 col-6">Sử dụng Header tùy chọn:</div>
                                                <div class="text-gray-800 col-6 pe-2" style="display: inline;">{{ detailData.dataScanner.headerOptionCheck ? 'Bật' : 'Tắt' }}</div>
                                            </div>
                                            <div class="row mb-4">
                                                <div class="text-gray-400 col-6">Quét bằng Nmap:</div>
                                                <div class="text-gray-800 col-6">{{ detailData.dataScanner.nmap_check ? 'Bật' : 'Tắt' }}</div>
                                            </div>
                                            <div class="row mb-4">
                                                <div class="text-gray-400 col-6">Quét bằng Nuclei:</div>
                                                <div class="text-gray-800 col-6">{{ detailData.dataScanner.nuclei_check ? 'Bật' : 'Tắt' }}</div>
                                            </div>
                                            <div class="row mb-4">
                                                <div class="text-gray-400 col-6">Trạng thái:</div>
                                                <span :class="`badge badge-${getStatus(detailData.status).color} col-2`">{{ detailData.statusName }}</span>
                                            </div>
                                            <div class="row mb-4">
                                                <div class="text-gray-400 col-6">Thời gian bắt đầu:</div>
                                                <div class="text-gray-800 col-6">{{ detailData.created_at? detailData.created_at :"--:--"}}</div>
                                            </div>
                                            <div class="row mb-4">
                                                <div class="text-gray-400 col-6">Thời gian kết thúc:</div>
                                                <div class="text-gray-800 col-6">{{ detailData.finished_at ? detailData.finished_at : "--:--" }}</div>
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
</template>

<style lang="scss">
.el-select {
  width: 100%;
}

.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
}
</style>
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
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
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
        const search_group = ref<String>('');
        const orderingID = ref<String>('');
        const typeModal = ref<String>('');
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
            proxyScheme: '',
            proxyAdress: '',
            proxyPort: '',
            proxyUsername: '',
            proxyUserPassword: '',
            headerOptionValue: '',
        });
        const detailData = reactive({
            id: '',
            username: "",
            created_at: "",
            finished_at: '',
            status: '',
            statusName: '',
            dataScanner: {
                scanSpeedOption: '',
                proxyCheck: false,
                proxyScheme: '',
                proxyAdress: '',
                proxyAuthenticationCheck: false,
                proxyUsername: '',
                proxyUserPassword: '',
                headerOptionCheck: false,
                nmap_check: false,
                nuclei_check: false,
            },
        });
        // const target_id = ref(null);
        const getIdFromUrl = () => {
            const url = window.location.href;
            const idMatch = url.match(/target-scans\/(\d+)/);
            if (idMatch) {
                return parseInt(idMatch[1]);
            }
        };
        const targetId = getIdFromUrl();
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
                columnLabel: "user",
            },
            {
                columnName: "Thời gian bắt đầu",
                columnLabel: "created_at",
            },
            {
                columnName: "Thời gian kết thúc",
                columnLabel: "finished_at",
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
            
            nameType.value = "Quét lỗ hổng bảo mật"
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
            let target_id = getIdFromUrl()
            
            setTimeout(() => loading.value = false, 500)
            return ApiService.get(`/scan/${target_id}/target?search_scan=${query.value}&search_status=${filterStatus.value}&page=${currentPage.value}&page_size=${itemsPerPage.value}&ordering=${orderingID.value}`)
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
            if (ids) {
                return ApiService.delete(`scan/multi-delete?id=${ids}`)
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
                
                detailData.username = detail.user.username
                detailData.finished_at = detail.finishedAt
                detailData.status = detail.status
                detailData.statusName = detail.status_name
                detailData.dataScanner = detail.data_scanner
                detailData.created_at = detail.created_at
                detailData.finished_at = detail.finished_at
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
        const PatternTargetGroup = /^[ a-zA-Z0-9_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+$/

        const scanFormState = reactive({
            targetID: getIdFromUrl(),
            scanSpeedOption: 3,
            proxyCheck: false,
            proxyScheme: "",
            proxyAdress: '',
            proxyPort: '',
            proxyAuthenticationCheck: false,
            proxyUsername: '',
            proxyUserPassword: '',
            headerOptionCheck: false,
            headerOptionValue: [],
            rescanOptionCheck: false,
            rescanRecurTime: '',
            nmap_check: false,
            nuclei_check: false,
        })

        const validationSchema = Yup.object().shape({
            proxyAdress: Yup.string()
                .required('Vui lòng nhập địa chỉ'),
            proxyPort: Yup.string()
                .required('Vui lòng nhập cổng'),
            proxyUsername: Yup.string()
                .required('Vui lòng nhập username'),
            proxyUserPassword: Yup.string()
                .required('Vui lòng nhập mật khẩu'),
        });

        const validationSchemaProxyCheck = Yup.object().shape({
            proxyAdress: Yup.string()
                .required('Vui lòng nhập địa chỉ'),
            proxyPort: Yup.string()
                .required('Vui lòng nhập cổng'),
        });
        const validationSchemaFalse = Yup.object().shape({
            proxyAdress: Yup.string(),
            proxyPort: Yup.string(),
            headerOptionValue: Yup.array().min(1, 'Vui lòng nhập giá trị').of(Yup.string()),
        });

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
        const abc = 1
        
        const headerInputValue = ref("")
        const eyeButtonRef = ref<boolean>(false);
        const eyePassword = () => {
            eyeButtonRef.value = (eyeButtonRef.value) ? false : true;
        };
        const submit = async () => {
            if (!submitButtonRef.value) {
                return;
            }
            if (!scanFormState.proxyCheck) {
                scanFormState.proxyScheme = ""
                scanFormState.proxyAdress = ""
                scanFormState.proxyPort = ""
                scanFormState.proxyUsername = ""
                scanFormState.proxyUserPassword = ""
            }
            
            if (!scanFormState.proxyAuthenticationCheck) {
                scanFormState.proxyUsername = ""
                scanFormState.proxyUserPassword = ""
            }

            if (!scanFormState.headerOptionCheck) {
                scanFormState.headerOptionValue = []
            }
            
            if (typeModal.value == 'add') {
                
                return ApiService.post("scan/create/", scanFormState)
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
        const clearHeaderOptions = () => {            
            scanFormState.headerOptionValue = []
        }
        
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
            validationSchema,
            validationSchemaProxyCheck,
            validationSchemaFalse,
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
            clearHeaderOptions,
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
            search_group,
            handleFilter,

            // edit 
            nameType,
            loading,

            getStatus,

            //SCAN
            scanFormState,
            getScanSpeedName,
            headerInputValue,
            eyePassword,
            eyeButtonRef,
            targetId
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
