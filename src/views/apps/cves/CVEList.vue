<template>
    <div class="card h-100 d-block">
        <div class="card-header border-0 pt-6 position-absolute end-0 pe-1 " style="top: -80px;">
            <div class="card-toolbar">
                <div v-if="selectedIds.length === 0" class="d-flex justify-content-end"
                    data-kt-subscription-table-toolbar="base">
                    <button type="button"
                        class="btn btn-sm fw-bold bg-body btn-color-gray-700 btn-active-color-primary me-2"
                        data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end" data-kt-menu-flip="top-end">
                        <KTIcon icon-name="filter" icon-class="fs-2" />
                        Filter
                    </button>
                    <Fillter @filterData="handleFilter"></Fillter>

                    <button type="button" class="btn btn-sm fw-bold btn-primary" data-bs-toggle="modal"
                        data-bs-target="#kt_modal_new_target_group" @click.passive="handleClick({}, 'add')">
                        <KTIcon icon-name="plus" icon-class="fs-2" />
                        Thêm
                    </button>
                </div>

                <div v-else class="d-flex justify-content-end align-items-center">
                    <div class="fw-bold me-5">
                        <span class="me-2">{{ selectedIds.length }}</span>Selected
                    </div>
                    <button type="button" data-bs-target="#kt_modal_delete" data-bs-toggle="modal"
                        class="btn btn-danger btn-sm ">
                        Delete Selected
                    </button>
                </div>
            </div>
        </div>

        <div class="card-body pt-0 hand-height-2 overflow-scroll h-100">
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
                    {{ customer.description }}
                </template>
                <template v-slot:actions="{ row: customer }">
                    <button type="button" class="btn btn-icon btn-bg-light btn-active-color-warning btn-sm me-1"
                        data-bs-toggle="modal" data-bs-target="#kt_modal_new_target_group"
                        @click="handleClick(customer, 'edit')">
                        <KTIcon icon-name="pencil" icon-class="fs-3" />
                    </button>
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
                                    <Field type="text" class="form-control form-control-solid" placeholder="CVE-YYYY-xxxxxx"
                                        name="code" v-model="apiData.code" />
                                    <div class="fv-plugins-message-container">
                                        <div class="fv-help-block">
                                            <ErrorMessage name="code" />
                                            <span class="" v-if="errors.code">{{ errors.code[0] }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <label class="form-label fw-semobold required">Loại sản phẩm</label>
                                    <div>
                                        <select
                                            class="form-select form-select-solid select2-hidden-accessible form-check-select h-40px w-100 py-2"
                                            v-model="apiData.product_type">
                                            <option label="Chọn loại sản phẩm" value="">Chọn loại sản phẩm</option>
                                            <option label="Microsoft" value="0">Microsoft</option>
                                            <option label="Oracle" value="1">Oracle</option>
                                            <option label="Google" value="2">Google</option>
                                            <option label="Debian" value="3">Debian</option>
                                            <option label="Apple" value="4">Apple</option>
                                            <option label="IBM" value="5">IBM</option>
                                            <option label="Redhat" value="6">Redhat</option>
                                            <option label="Fedoraproject" value="7">Fedoraproject</option>
                                            <option label="Fedoraproject" value="8">Canonical</option>
                                            <option label="Cisco" value="9">Cisco</option>
                                            <option label="Linux" value="10">Linux</option>
                                            <option label="Opensuse" value="11">Opensuse</option>
                                            <option label="Mozilla" value="12">Mozilla</option>
                                            <option label="Netapp" value="13">Netapp</option>
                                            <option label="Apache" value="14">Apache</option>
                                            <option label="HP" value="15">HP</option>
                                            <option label="Adobe" value="16">Adobe</option>
                                            <option label="SUN" value="17">SUN</option>
                                            <option label="Jenkins" value="18">Jenkins</option>
                                            <option label="SAP" value="19">SAP</option>
                                            <option label="Suse" value="20">Suse</option>
                                            <option label="Siemens" value="21">Siemens</option>
                                            <option label="GNU" value="22">GNU</option>
                                            <option label="Gitlab" value="23">Gitlab</option>
                                            <option label="Huawei" value="24">Huawei</option>
                                            <option label="F5" value="25">F5</option>
                                            <option label="PHP" value="26">PHP</option>
                                            <option label="Intel" value="27">Intel</option>
                                            <option label="Vmware" value="28">Vmware</option>
                                            <option label="Imagemagick" value="29">Imagemagick</option>
                                            <option label="Wireshark" value="30">Wireshark</option>
                                            <option label="Novell" value="31">Novell</option>
                                            <option label="Dell" value="32">Dell</option>
                                            <option label="Mcafee" value="33">Mcafee</option>
                                            <option label="Symantec" value="34">Symantec</option>
                                            <option label="Fortinet" value="35">Fortinet</option>
                                            <option label="Moodle" value="36">Moodle</option>
                                            <option label="Juniper" value="37">Juniper</option>
                                            <option label="Freebsd" value="38">Freebsd</option>
                                            <option label="Joomla" value="39">Joomla</option>
                                            <option label="XEN" value="40">XEN</option>
                                            <option label="Broadcom" value="41">Broadcom</option>
                                            <option label="Cpanel" value="42">Cpanel</option>
                                            <option label="Zohocorp" value="43">Zohocorp</option>
                                            <option label="Ffmpeg" value="44">Ffmpeg</option>
                                            <option label="Atlassian" value="45">Atlassian</option>
                                            <option label="Mariadb" value="46">Mariadb</option>
                                            <option label="EMC" value="47">EMC</option>
                                            <option label="Wordpress" value="48">Wordpress</option>
                                            <option label="Qemu" value="49">Qemu</option>
                                            <option label="Khác" value="50">Khác</option>
                                        </select>
                                        <div class="fv-plugins-message-container">
                                            <div class="fv-help-block">
                                                <ErrorMessage name="product_type" />
                                                <span class="" v-if="errors.product_type">{{ errors.product_type[0]
                                                }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-4">
                                    <label class="form-label fw-semobold">Loại lỗ hổng:</label>
                                    <div>
                                        <select
                                            class="form-select form-select-solid select2-hidden-accessible form-check-select h-40px w-100 py-2"
                                            v-model="apiData.vul_type">
                                            <option label="Chọn loại lỗ hổng" value="">Chọn loại lỗ hổng</option>
                                            <option label="DoS" value="0">DoS</option>
                                            <option label="Code Execution" value="1">Code Execution</option>
                                            <option label="Overflow" value="2">Overflow</option>
                                            <option label="Memory Corruption" value="3">Memory Corruption</option>
                                            <option label="Sql Injection" value="4">Sql Injection</option>
                                            <option label="XSS" value="5">XSS</option>
                                            <option label="Directory Traversal" value="6">Directory Traversal</option>
                                            <option label="Http Response Splitting" value="7">Http Response Splitting
                                            </option>
                                            <option label="Bypass something" value="8">Bypass something</option>
                                            <option label="Gain Information" value="9">Gain Information</option>
                                            <option label="Gain Privileges" value="10">Gain Privileges</option>
                                            <option label="CSRF" value="11">CSRF</option>
                                            <option label="File Inclusion" value="12">File Inclusion</option>
                                            <option label="Khác" value="13">Khác</option>
                                        </select>
                                        <div class="fv-plugins-message-container">
                                            <div class="fv-help-block">
                                                <ErrorMessage name="vul_type" />
                                                <span class="" v-if="errors.vul_type">{{ errors.vul_type[0] }}</span>
                                            </div>
                                        </div>
                                    </div>
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
                                <div class="d-flex flex-wrap py-5">
                                    <div class="me-5">
                                        <!--begin::Details-->
                                        <table class="table fs-6 fw-semobold gs-0 gy-2 gx-2 m-0">

                                            <!--begin::Row-->
                                            <tr>
                                                <td class="text-gray-400 w-80px d-inline-block">Loại sản phẩm:</td>
                                                <td class="text-gray-800 text-dark fs-5 fw-bold">{{ detailData.product_text ??
                                                    '--' }}</td>
                                            </tr>
                                            <!--end::Row-->

                                            <!--begin::Row-->
                                            <tr>
                                                <td class="text-gray-400 w-80px d-inline-block">Loại lỗ hổng:</td>
                                                <td class="text-gray-800 ">{{ detailData.vul_text ?? '--' }}</td>
                                            </tr>
                                            <tr>
                                                <td class="text-gray-400 w-80px d-inline-block">Mô tả:</td>
                                                <td class="text-gray-800 ">{{ detailData.description ?? '--' }}</td>
                                            </tr>
                                            <tr>
                                                <td class="text-gray-400 w-80px d-inline-block">Phiên bản:</td>
                                                <td class="text-gray-800 ">{{ detailData.version ?? '--' }}</td>
                                            </tr>
                                            <tr>
                                                <td class="text-gray-400 w-80px d-inline-block">Shodan Dock:</td>
                                                <td class="text-gray-800 ">{{ detailData.shodan_dock ?? '--' }}</td>
                                            </tr>
                                            <tr>
                                                <td class="text-gray-400 w-80px d-inline-block">POC:</td>
                                                <td class="text-gray-800 ">{{ detailData.poc ?? '--' }}</td>
                                            </tr>
                                            <!--end::Row-->

                                            <!--begin::Row-->
                                            <tr>
                                                <td class="text-gray-400 w-80px d-inline-block">Ngày tạo:</td>
                                                <td class="text-gray-800">{{ formatDate(detailData.created_at) }}</td>
                                            </tr>
                                            <tr>
                                                <td class="text-gray-400 w-80px d-inline-block">Ngày cập nhập cuối:</td>
                                                <td class="text-gray-800">{{ formatDate(detailData.modified_at) }}</td>
                                            </tr>
                                            <!--end::Row-->

                                        </table>
                                        <!--end::Details-->
                                    </div>
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
import { vue3Debounce } from 'vue-debounce';
import Fillter from "@/views/apps/targets/filtersTarget.vue";

import * as Yup from "yup";
import Swal from "sweetalert2/dist/sweetalert2.js";

import { Modal } from "bootstrap";
import dayjs from 'dayjs';

interface APIData {
    code: string;
    product_text: string;
    product_type: number;
    vul_text: string;
    vul_type: number;
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
        const orderingID = ref<String>('');
        const typeModal = ref<String>('');
        const id = ref<number>(0);
        const nameType = ref<string>('');
        const apiData = ref<APIData>({
            code: "",
            product_type: 0,
            product_text: "",
            vul_type: 0,
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

        const headerConfig = ref([
            {
                columnName: "ID",
                columnLabel: "id",
                sortEnabled: true,
            },
            {
                columnName: "Mã CVE",
                columnLabel: "code",
            },
            {
                columnName: "Loại sản phẩm",
                columnLabel: "product_text",
            },
            {
                columnName: "Loại lỗ hổng",
                columnLabel: "vul_text",
            },
            {
                columnName: "Mô tả",
                columnLabel: "description",
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
                console.log(data)
                id.value = data.id;
                console.log(id.value);

            } else {
                nameType.value = "Thêm mới CVE"
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

        const handlePerPage = (itemsPage: number) => {
            currentPage.value = 1
            itemsPerPage.value = itemsPage ?? 20;
            getData();
        };

        const getData = () => {
            loading.value = true;
            setTimeout(() => loading.value = false, 500)
            return ApiService.get(`cve/index?code=${query.value}&page=${currentPage.value}&page_size=${itemsPerPage.value}&ordering=${orderingID.value}`)
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
                console.log(detail, 1111);
                
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
                        console.log(response, response.data);

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
                            errors.product_type = response.data.product_text;
                            errors.vul_type = response.data.vul_text;
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

        const formatDate = (date: string) => {
            if (date === "false" || date === "null") {
                return '--:--';
            }
            const dateFormat = 'DD/MM/YYYY HH:mm:ss';
            return dayjs(date).format(dateFormat)
        }

        // end validate

        // tìm kiếm
        const setQuery = (event) => {
            query.value = event.target.value
            console.log(query.value, 'searrrrrrrrrr');

            currentPage.value = 1
        }

        const handleFilter = (data: any) => {
            if (data) {
                query.value = data.query;
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
            formatDate,
            loading,
        };
    },
});
</script>
