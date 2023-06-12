<template>
    <div class="card h-100 d-block">
        <div class="card-header border-0 pt-6 position-absolute end-0 pe-1 " style="top: -80px;">
            <div class="card-toolbar">
                <div v-show="selectedIds.length === 0">
                    <div class="d-flex justify-content-end"
                        data-kt-subscription-table-toolbar="base">
                        <el-tooltip class="box-item" effect="dark" hide-after="0" content="Tìm kiếm" placement="top">
                            <button type="button"
                                class="btn btn-sm fw-bold bg-body btn-color-gray-700 btn-active-color-primary me-2"
                                data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end" data-kt-menu-flip="top-end">
                                <KTIcon icon-name="filter" icon-class="fs-2" />
                                Filter
                            </button>
                        </el-tooltip>
                        <Fillter @filterData="handleFilter"></Fillter>
                        <el-tooltip class="box-item" effect="dark" hide-after="0" content="Thêm mới" placement="top">
                            <button type="button" class="btn btn-sm fw-bold btn-primary" data-bs-toggle="modal"
                                data-bs-target="#kt_modal_new_target_group" @click.passive="handleClick({}, 'add')">
                                <KTIcon icon-name="plus" icon-class="fs-2" />
                                Thêm
                            </button>
                        </el-tooltip>
                    </div>
                </div>
                <div v-show="selectedIds.length !== 0">
                    <div class="d-flex justify-content-end align-items-center">
                        <div class="fw-bold me-5">
                            <span class="me-2">{{ selectedIds.length }}</span>Selected
                        </div>
                        <el-tooltip class="box-item" effect="dark" hide-after="0" content="Xóa" placement="top">
                            <button type="button" data-bs-target="#kt_modal_delete" data-bs-toggle="modal"
                                class="btn btn-danger btn-sm ">
                                Delete Selected
                            </button>
                        </el-tooltip>
                    </div>
                </div>
            </div>
        </div>

        <div class="card-body pt-0  overflow-y-auto overflow-x-hidden h-100 p-0 m-0">
            <KTDatatable @on-sort="sort" @on-items-select="onItemSelect" :data="list" :header="headerConfig"
                :loading="loading" :checkbox-enabled="true" :itemsPerPage="itemsPerPage" :total="totalPage"
                :currentPage="currentPage" @page-change="handlePage" @on-items-per-page-change="handlePerPage"
                @customRow="customRowTable">

                <template v-slot:id="{ row: customer }">{{ customer.id }}</template>
                <template v-slot:code="{ row: customer }">{{ customer.code }}</template>
                <template v-slot:product_text="{ row: customer }">
                    {{ customer.product_text }}
                </template>
                <template v-slot:vul_text="{ row: customer }">
                    {{ customer.vul_text }}
                </template>
                <template v-slot:description="{ row: customer }">
                    {{ truncateText(customer.description ?? '', 25) }}
                </template>
                <template v-slot:actions="{ row: customer }">
                    <el-tooltip class="box-item" effect="dark" hide-after="0" content="Scan" placement="top">
                        <router-link :to="`cve/${customer.id}/scan`" class="btn btn-icon btn-bg-light btn-active-color-warning btn-sm me-1">
                            <KTIcon icon-name="search-list" icon-class="fs-3" />
                        </router-link>
                    </el-tooltip>
                    <el-tooltip class="box-item" effect="dark" hide-after="0" content="Chỉnh sửa" placement="top">
                        <button type="button" class="btn btn-icon btn-bg-light btn-active-color-warning btn-sm me-1"
                            data-bs-toggle="modal" data-bs-target="#kt_modal_new_target_group"
                            @click="handleClick(customer, 'edit')">
                            <KTIcon icon-name="pencil" icon-class="fs-3" />
                        </button>
                    </el-tooltip>
                </template>
            </KTDatatable>
        </div>
    </div>


    <!-- modal  -->
    <div class="modal fade" tabindex="-1" id="kt_modal_new_target_group" ref="newTargetGroupModalRef" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered mw-900px">
            <div class="modal-content">
                <div class="modal-header" id="kt_modal_new_target_group_header">
                    <h2>{{ nameType }}</h2>
                    <div class="btn btn-sm btn-icon btn-active-color-primary" data-bs-dismiss="modal">
                        <KTIcon icon-name="cross" icon-class="fs-1" />
                    </div>
                </div>

                <VForm id="kt_modal_new_target_group_form" class="form" @submit="submit"
                    :validation-schema="validationSchema">
                    <div class="modal-body py-10 px-lg-17">
                        <div class="scroll-y me-n7 pe-7" id="kt_modal_new_target_group_scroll" data-kt-scroll="true"
                            data-kt-scroll-activate="{default: false, lg: true}" data-kt-scroll-max-height="auto"
                            data-kt-scroll-dependencies="#kt_modal_new_target_group_header"
                            data-kt-scroll-wrappers="#kt_modal_new_target_group_scroll" data-kt-scroll-offset="300px">
                            <div class="mb-5 fv-row row">
                                <div class="col-4">
                                    <label class="d-flex align-items-center fs-6 fw-semobold mb-2">
                                        <span class="required">Mã CVE</span>
                                    </label>
                                    <Field type="text" class="form-control form-control-solid" placeholder="CVE-YYYY-xxxxxx" @keydown="removeErrorMsgText" style="height: 40px;"
                                        name="code" v-model="apiData.code" />
                                    <div class="fv-plugins-message-container">
                                        <div class="fv-help-block">
                                            <ErrorMessage name="code" />
                                            <span class="" v-if="errors.code">{{ errors.code[0] }}</span>
                                        </div>
                                    </div>
                                </div>

                                <div class="col-4">
                                    <label class="d-flex align-items-center fs-6 fw-semobold mb-2">
                                        <span class="required">Loại sản phẩm</span>
                                    </label>
                                    <el-form-item prop="assign">
                                        <el-select name="product_type" placeholder="Select"
                                            @change="removeErrorMsgOption"
                                            v-model="apiData.product_type">
                                            <!-- <el-option label="Chọn loại sản phẩm" value="">Chọn loại sản phẩm</el-option> -->
                                            <el-option
                                                v-for="item in dataProduct"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                            />
                                        </el-select>
                                        <div class="fv-plugins-message-container">
                                            <div class="fv-help-block">
                                                <ErrorMessage name="product_type" />
                                                <span class="" v-if="errors.product_type">{{ errors.product_type[0] }}</span>
                                            </div>
                                        </div>
                                    </el-form-item>
                                </div>
                                <div class="col-4">
                                    <label class="d-flex align-items-center fs-6 fw-semobold mb-2">
                                        <span class="required">Loại lỗ hổng</span>
                                    </label>
                                    <el-form-item prop="assign">
                                        <el-select name="vul_type" placeholder="Select"
                                            @change="removeErrorMsgOption"
                                            v-model="apiData.vul_type">
                                            <!-- <el-option label="Chọn loại lỗ hổng" value="">Chọn loại lỗ hổng</el-option> -->
                                            <el-option
                                                v-for="item in dataVul"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value"
                                            />
                                        </el-select>
                                        <div class="fv-plugins-message-container">
                                            <div class="fv-help-block">
                                                <ErrorMessage name="vul_type" />
                                                <span class="" v-if="errors.vul_type">{{ errors.vul_type[0] }}</span>
                                            </div>
                                        </div>
                                    </el-form-item>
                                    <!-- <Field type="text" class="form-control form-control-solid" placeholder="Chọn nhóm mục tiêu"
                                        name="group" v-model="apiData.group" /> -->
                                    <!-- <div class="fv-plugins-message-container">
                                        <div class="fv-help-block">
                                            <ErrorMessage name="group" />
                                            <span class="" v-if="errors.group">{{ errors.group[0] }}</span>
                                        </div>
                                    </div> -->
                                </div>
                            </div>
                            <div class="d-flex flex-column mb-5 fv-row">
                                <label class="fs-6 fw-semobold mb-2">Mô tả</label>
                                <Field as="textarea" class="form-control form-control-solid" rows="5" name="description"
                                    placeholder="Mô tả về CVE" v-model="apiData.description" />
                                <div class="fv-plugins-message-container">
                                    <div class="fv-help-block">
                                        <ErrorMessage name="description" />
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex flex-column mb-5 fv-row">
                                <label class="fs-6 fw-semobold mb-2 required">Phiên bản ảnh hưởng</label>
                                <Field as="textarea" class="form-control form-control-solid" rows="5" name="version"
                                    placeholder="Phiên bản sản phẩm bị ảnh hưởng bởi CVE" v-model="apiData.version" />
                                <div class="fv-plugins-message-container">
                                    <div class="fv-help-block">
                                        <ErrorMessage name="version" />
                                        <span class="" v-if="errors.version">{{ errors.version[0] }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="d-flex flex-column mb-5 fv-row">
                                <!--begin::Label-->
                                <label class="fs-6 fw-semobold mb-2 required">Shodan Dock</label>
                                <!--end::Label-->

                                <!--begin::Input-->
                                <Field as="textarea" class="form-control form-control-solid" rows="5" name="shodan_dock"
                                    placeholder="Câu query shodan để tìm kiếm mục tiêu trên diện rộng. Cú pháp theo cú pháp tìm kiếm của shodan. Query phân cách bởi dấu ;"
                                    v-model="apiData.shodan_dock" />
                                <div class="fv-plugins-message-container">
                                    <div class="fv-help-block">
                                        <ErrorMessage name="shodan_dock" />
                                        <span class="" v-if="errors.shodan_dock">{{ errors.shodan_dock[0] }}</span>
                                    </div>
                                </div>
                                <!--end::Input-->
                            </div>
                            <div class="d-flex flex-column mb-5 fv-row">
                                <!--begin::Label-->
                                <label class="fs-6 fw-semobold mb-2">POC</label>
                                <!--end::Label-->

                                <!--begin::Input-->
                                <Field as="textarea" class="form-control form-control-solid" rows="5" name="poc"
                                    placeholder="Thông tin POC, cách khai thác" v-model="apiData.poc" />
                                <div class="fv-plugins-message-container">
                                    <div class="fv-help-block">
                                        <ErrorMessage name="poc" />
                                        <span class="" v-if="errors.poc">{{ errors.poc[0] }}</span>
                                    </div>
                                </div>
                                <!--end::Input-->
                            </div>
                            <div class="fv-plugins-message-container">
                                <div class="fv-help-block">
                                    <span class="" v-if="errors.detail">{{ Array.isArray(errors.detail) ? errors.detail[0] :
                                        errors.detail }}</span>
                                </div>
                            </div>
                        </div>
                        <!--end::Scroll-->
                    </div>
                    <!--end::Modal body-->

                    <!--begin::Modal footer-->
                    <div class="modal-footer flex-center">
                        <!--begin::Button-->
                        <button ref="discardButtonRef" type="reset" id="kt_modal_new_target_group_cancel"
                            class="btn btn-sm  btn-light me-3">
                            Discard
                        </button>
                        <!--end::Button-->

                        <!--begin::Button-->
                        <button ref="submitButtonRef" type="submit" id="kt_modal_new_target_group_submit"
                            class="btn btn-sm  btn-primary">
                            <span class="indicator-label"> Submit </span>
                            <span class="indicator-progress">
                                Please wait...
                                <span class="spinner-border spinner-border-sm align-middle ms-2"></span>
                            </span>
                        </button>
                        <!--end::Button-->
                    </div>
                    <!--end::Modal footer-->
                </VForm>
                <!--end::Form-->
            </div>
            <!--end::Modal content-->
        </div>
        <!--end::Modal dialog-->
    </div>

    <!-- modal delete  -->
    <div class="modal fade" tabindex="-1" id="kt_modal_delete" ref="ModalDelete" aria-hidden="true">
        <!--begin::Modal dialog-->
        <div class="modal-dialog modal-dialog-centered">
            <!--begin::Modal content-->
            <div class="modal-content">

                <div class="modal-header">
                    <h3 class="modal-title">Xác nhận xóa CVE</h3>

                    <!--begin::Close-->
                    <div class="btn btn-icon btn-sm btn-active-light-primary ms-2" data-bs-dismiss="modal"
                        aria-label="Close">
                        <span class="svg-icon svg-icon-2x"></span>
                    </div>
                    <!--end::Close-->
                </div>
                <!--begin::Form-->
                <div class="modal-body">
                    <p style="font-size: 16px;">Bạn có chắc chắn muốn xóa <span v-if="selectedIds.length > 0"
                            class="fw-bold" style="color:red;">{{ selectedIds.length
                            }}</span> bản ghi này không?
                    </p>
                </div>
                <!--end::Form-->
                <div class="modal-footer">
                    <button type="button" class="btn btn-sm  btn-light" data-bs-dismiss="modal">
                        Hủy bỏ
                    </button>
                    <button type="button" class="btn btn-sm  btn-primary" @click.passive="deleteFewSubscriptions()">
                        Đồng ý
                    </button>
                </div>
            </div>
            <!--end::Modal content-->
        </div>
        <!--end::Modal dialog-->
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
                                <h1 class="fw-bold">{{ detailData.code }}</h1>
                            </div>
                            <!--begin::Card toolbar-->
                            <div class="card-toolbar">
                                <button type="button" class="btn btn-light-warning btn-sm me-1" data-bs-toggle="modal"
                                    data-bs-target="#kt_modal_new_target_group" @click="handleClick(detailData, 'edit')">
                                    <KTIcon icon-name="pencil" icon-class="fs-3" /> Update
                                </button>
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
                          <div class="col-3 text-gray-400">Loại sản phẩm:</div>
                          <div class="col-9 text-gray-800 fs-5 fw-bold"><span>{{ detailData.product_text ? detailData.product_text : '--:--' }}</span></div>
                        </div>
                        <div class="row fs-6 mb-3">
                          <div class="col-3 text-gray-400">Loại lỗ hổng:</div>
                          <div class="col-9 text-gray-800"><span>{{ detailData.vul_text ? detailData.vul_text: '--:--' }}</span></div>
                        </div>
                        <div class="row fs-6 mb-3">
                          <div class="col-3 text-gray-400">Mô tả:</div>
                          <div class="col-9 text-gray-800"><span>{{ detailData.description ? detailData.description: '--:--' }}</span></div>
                        </div>
                        <div class="row fs-6 mb-3">
                          <div class="col-3 text-gray-400">Phiên bản:</div>
                          <div class="col-9 text-gray-800"><span>{{ detailData.version ? detailData.version:'--:--' }}</span></div>
                        </div>
                        <div class="row fs-6 mb-3">
                          <div class="col-3 text-gray-400">Shodan dock:</div>
                          <div class="col-9 text-gray-800"><span>{{ detailData.shodan_dock ? detailData.shodan_dock: '--:--' }}</span></div>
                        </div>
                        <div class="row fs-6 mb-3">
                          <div class="col-3 text-gray-400">POC:</div>
                          <div class="col-9 text-gray-800"><span>{{ detailData.poc ? detailData.poc: '--:--' }}</span></div>
                        </div>
                        <div class="row fs-6 mb-3">
                          <div class="col-3 text-gray-400">Ngày tạo:</div>
                          <div class="col-9 text-gray-800"><span>{{ detailData.created_at }}</span></div>
                        </div>
                        <div class="row fs-6">
                          <div class="col-3 text-gray-400">Ngày cập nhập:</div>
                          <div class="col-9 text-gray-800"><span>{{ detailData.modified_at }}</span></div>
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
import { vue3Debounce } from "vue-debounce";
import Fillter from "@/views/apps/cves/filterCVEList.vue";

import * as Yup from "yup";
import Swal from "sweetalert2/dist/sweetalert2.js";

import { Modal } from "bootstrap";

interface APIData {
    code: string;
    product_text: string;
    product_type: string;
    vul_text: string;
    vul_type: string;
    description: string;
    version: string;
    shodan_dock: string;
    poc: string;
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
        const totalPage = ref<number>(0);
        // const testPage = ref<number>(0);
        const currentPage = ref<number>(1);
        const itemsPerPage = ref<number>(20);
        const query = ref<String>('');
        const filterProductType = ref<String | null>('');
        const filterVulType = ref<String | null>('');
        const orderingID = ref<String>('');
        const typeModal = ref<String>('');
        const id = ref<number>(0);
        const nameType = ref<string>('');
        const apiData = ref<APIData>({
            code: "",
            product_type: '',
            product_text: "",
            vul_type: '',
            vul_text: '',
            description: '',
            version: '',
            shodan_dock: '',
            poc: '',
        });
        const errors = reactive({
            code: '',
            product_type: '',
            vul_type: '',
            description: '',
            version: '',
            shodan_dock: '',
            poc: '',
            detail: ''
        });
        const detailData = reactive({
            id: '',
            code: '',
            product_text: '',
            product_type: '',
            vul_text: '',
            vul_type: '',
            description: '',
            version: '',
            shodan_dock: '',
            poc: '',
            modified_at: '',
            created_at: '',
        });
        const discardButtonRef = ref<HTMLElement | null>(null);
        const ModalDetail = ref<null | HTMLElement>(null);
        const loading = ref<boolean>(false)
        const dataVul = [
            {
                value: 0,
                label: 'DoS',
            },
            {
                value: 1,
                label: 'Code Execution',
            },
            {
                value: 2,
                label: 'Overflow',
            },
            {
                value: 3,
                label: 'Memory Corruption',
            },
            {
                value: 4,
                label: 'Code Execution',
            },
            {
                value: 5,
                label: 'XSS',
            },
            {
                value: 6,
                label: 'Directory Traversal',
            },
            {
                value: 7,
                label: 'Http Response Splitting',
            },
            {
                value: 8,
                label: 'Bypass something',
            },
            {
                value: 9,
                label: 'Gain Information',
            },
            {
                value: 10,
                label: 'Gain Privileges',
            },
            {
                value: 11,
                label: 'CSRF',
            },
            {
                value: 12,
                label: 'File Inclusion',
            },
            {
                value: 13,
                label: 'Khác',
            },
        ]
        const dataProduct = [
            {
                value: 0,
                label: 'Microsoft',
            },
            {
                value: 1,
                label: 'Oracle',
            },
            {
                value: 2,
                label: 'Google',
            },
            {
                value: 3,
                label: 'Debian',
            },
            {
                value: 4,
                label: 'Apple',
            },
            {
                value: 5,
                label: 'IBM',
            },
            {
                value: 6,
                label: 'Redhat',
            },
            {
                value: 7,
                label: 'Fedoraproject',
            },
            {
                value: 8,
                label: 'Canonical',
            },
            {
                value: 9,
                label: 'Cisco',
            },
            {
                value: 10,
                label: 'Linux',
            },
            {
                value: 11,
                label: 'Opensuse',
            },
            {
                value: 12,
                label: 'Mozilla',
            },
            {
                value: 13,
                label: 'Netapp',
            },
            {
                value: 14,
                label: 'Apache',
            },
            {
                value: 15,
                label: 'HP',
            },
            {
                value: 16,
                label: 'Adobe',
            },
            {
                value: 17,
                label: 'SUN',
            },
            {
                value: 18,
                label: 'Jenkins',
            },
            {
                value: 19,
                label: 'SAP',
            },
            {
                value: 20,
                label: 'Suse',
            },
            {
                value: 21,
                label: 'Siemens',
            },
            {
                value: 22,
                label: 'GNU',
            },
            {
                value: 23,
                label: 'Gitlab',
            },
            {
                value: 24,
                label: 'Huawei',
            },
            {
                value: 25,
                label: 'F5',
            },
            {
                value: 26,
                label: 'PHP',
            },
            {
                value: 27,
                label: 'Intel',
            },
            {
                value: 28,
                label: 'Vmware',
            },
            {
                value: 29,
                label: 'Imagemagick',
            },
            {
                value: 30,
                label: 'Wireshark',
            },
            {
                value: 31,
                label: 'Novell',
            },
            {
                value: 32,
                label: 'Dell',
            },
            {
                value: 33,
                label: 'Mcafee',
            },
            {
                value: 34,
                label: 'Symantec',
            },
            {
                value: 35,
                label: 'Fortinet',
            },
            {
                value: 36,
                label: 'Moodle',
            },
            {
                value: 37,
                label: 'Juniper',
            },
            {
                value: 38,
                label: 'Freebsd',
            },
            {
                value: 39,
                label: 'Joomla',
            },
            {
                value: 40,
                label: 'XEN',
            },
            {
                value: 41,
                label: 'Broadcom',
            },
            {
                value: 42,
                label: 'Cpanel',
            },
            {
                value: 43,
                label: 'Zohocorp',
            },
            {
                value: 44,
                label: 'Ffmpeg',
            },
            {
                value: 45,
                label: 'Atlassian',
            },
            {
                value: 46,
                label: 'Mariadb',
            },
            {
                value: 47,
                label: 'EMC',
            },
            {
                value: 48,
                label: 'Wordpress',
            },
            {
                value: 49,
                label: 'Qemu',
            },
            {
                value: 50,
                label: 'Khác',
            },
        ]
        const headerConfig = ref([
            {
                columnName: "ID",
                columnLabel: "id",
                sortEnabled: true,
            },
            {
                columnName: "Mã CVE",
                columnLabel: "code",
                columnWidth: 150,
            },
            {
                columnName: "Loại sản phẩm",
                columnLabel: "product_text",
                columnWidth: 150,
            },
            {
                columnName: "Loại lỗ hổng",
                columnLabel: "vul_text",
                columnWidth: 150,
            },
            {
                columnName: "Mô tả",
                columnLabel: "description",
                columnWidth: 220,
            },
            {
                columnName: "Hành động",
                columnLabel: "actions",
                columnWidth: 50,
            },
        ]);

        const handleClick = (data: object | any, type: String) => {
            typeModal.value = type
            errors.code = ''
            errors.product_type = ''
            errors.vul_type = ''
            errors.description = ''
            errors.version = '',
            errors.shodan_dock = '',
            errors.poc = '',
            errors.detail = ''
            if (Object.keys(data).length != 0 && type === 'edit') {
                nameType.value = "Chỉnh sửa CVE"
                apiData.value.code = data.code;
                apiData.value.product_type = data.product_type;
                apiData.value.vul_type = data.vul_type;
                apiData.value.description = data.description;
                apiData.value.version = data.version;
                apiData.value.shodan_dock = data.shodan_dock;
                apiData.value.poc = data.poc;
                id.value = data.id;

            } else {
                nameType.value = "Thêm mới CVE"
                apiData.value.vul_type = '';
                apiData.value.product_type = '';
                if (discardButtonRef.value !== null) {
                    discardButtonRef.value.click();
                }
                // resetData();
            }
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

        const truncateText = (text: string, maxLength: number) => {
            if (text.length > maxLength) {
                return text.substring(0, maxLength) + '...';
            }
            return text;
        };

        const handlePerPage = (itemsPage: number) => {
            currentPage.value = 1
            itemsPerPage.value = itemsPage ?? 20;
            getData();
        };

        const getData = () => {
            loading.value = true;
            setTimeout(() => loading.value = false, 500)
            return ApiService.get(`cve/index?code=${query.value}&product_type=${filterProductType.value}&vul_type=${filterVulType.value}&page=${currentPage.value}&page_size=${itemsPerPage.value}&ordering=${orderingID.value}`)
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
        const removeErrorMsgOption = () => {
            apiData.value.product_type !== '' ? errors.product_type = '' : ''
            apiData.value.vul_type !== '' ? errors.vul_type = '' : ''
        };

        const removeErrorMsgText = () => {
            errors.code = ''
        };

        const ModalDelete = ref<null | HTMLElement>(null);
        const deleteSubscription = (ids: Array<number>) => {
            let formData = {
                'id': ids
            }
            if (ids) {
                return ApiService.post(`cve/delete`, formData)
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
                detailData.id = detail.id
                detailData.code = detail.code
                detailData.product_text = detail.product_text
                detailData.product_type = detail.product_type
                detailData.vul_text = detail.vul_text
                detailData.vul_type = detail.vul_type
                detailData.description = detail.description
                detailData.version = detail.version
                detailData.shodan_dock = detail.shodan_dock
                detailData.poc = detail.poc
                detailData.modified_at = detail.modified_at
                detailData.created_at = detail.created_at
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
        const PatternCVECode = /^[Cc][Vv][Ee]-\d{4}-\d+$/
        

        const validationSchema = Yup.object().shape({
            code: Yup.string()
                .matches(PatternCVECode, 'Mã CVE không đúng định dạng')
                .required('Vui lòng nhập mã CVE'),
            product_type: Yup.number(),
            // .required('Vui lòng nhập loại sản phẩm'),
            vul_type: Yup.number(),
            // .required('Vui lòng nhập loại lỗ hổng'),
            version: Yup.string()
                .required('Mục phiên bản ảnh hưởng không được để trống'),
            shodan_dock: Yup.string()
                .required('Mục Shodan Dock không được để trống'),
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

        const submit = async () => {
            if (!submitButtonRef.value) {
                return;
            }
            let formData = {
                'code': apiData.value.code,
                'product_type': apiData.value.product_type ?? "",
                'vul_type': apiData.value.vul_type ?? "",
                'description': apiData.value.description,
                'version': apiData.value.version,
                'shodan_dock': apiData.value.shodan_dock,
                'poc': apiData.value.poc,
            }

            if (typeModal.value == 'add') {
                return ApiService.post("cve/create/", formData)
                    .then(({ data }) => {
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
                                notification(data.detail, 'success', 'Thêm mới thành công')
                                getData();

                            }, 1000);
                        }
                    })
                    .catch(({ response }) => {
                        if (response?.data) {
                            errors.code = response.data.code;
                            errors.product_type = response.data.product_type;
                            errors.vul_type = response.data.vul_type;
                            errors.description = response.data.description;
                            errors.version = response.data.version;
                            errors.shodan_dock = response.data.shodan_dock;
                            errors.poc = response.data.poc;
                            errors.detail = response.data.detail;
                        } else {
                            notification(response?.data?.detail, 'error', 'Có lỗi xảy ra')
                        }
                    });
            } else {
                return ApiService.put(`/cve/${id.value}/update/`, formData)
                    .then(({ data }) => {
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
                                notification(data.detail, 'success', 'Sửa mới thành công')
                                getData();
                            }, 1000);
                        }

                    })
                    .catch(({ response }) => {
                        if (response.data) {
                            errors.code = response.data.code;
                            errors.product_type = response.data.product_type;
                            errors.vul_type = response.data.vul_type;
                            errors.description = response.data.description;
                            errors.version = response.data.version;
                            errors.shodan_dock = response.data.shodan_dock;
                            errors.poc = response.data.poc;
                            errors.detail = response.data.detail;
                        } else {
                            notification(response.data.detail, 'error', 'Có lỗi xảy ra')
                        }
                    });
            }

        };


        // end validate

        // tìm kiếm
        const setQuery = (event) => {
            query.value = event.target.value
            currentPage.value = 1
        }

        const handleFilter = (data: any) => {
            if (data) {
                query.value = data.query;
                filterProductType.value = data.product_type;
                filterVulType.value = data.vul_type;
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
            truncateText,
            // validate
            // crud
            apiData,
            validationSchema,
            submit,
            submitButtonRef,
            modalRef,
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
            setQuery,
            handleFilter,

            // edit 
            nameType,
            loading,
            dataVul,
            dataProduct,

            removeErrorMsgOption,
            removeErrorMsgText,
        };
    },
});
</script>

<style>
.el-select .el-input__wrapper {
    height: 40px !important;
}
</style>
