<template>
    <div class="card h-100 d-block">
        <div class="card-header border-0 pt-6 position-absolute end-0 pe-1 " style="top: -80px;">
            <div class="card-toolbar">
                <div v-show="selectedIds.length === 0">
                    <div class="d-flex justify-content-end" data-kt-subscription-table-toolbar="base">
                        <button type="button"
                            class="btn btn-sm fw-bold bg-body btn-color-gray-700 btn-active-color-primary me-2"
                            data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end" data-kt-menu-flip="top-end">
                            <KTIcon icon-name="filter" icon-class="fs-2" />
                            Filter
                        </button>
                        <Fillter @filterData="handleFilter" :data-group="data_group"></Fillter>
                        <button type="button" class="btn btn-sm fw-bold btn-primary" data-bs-toggle="modal"
                            data-bs-target="#kt_modal_new_target_group" @click.passive="handleClick({}, 'add')">
                            <KTIcon icon-name="plus" icon-class="fs-2" />
                            Thêm
                        </button>
                    </div>
                </div>
                <div v-show="selectedIds.length !== 0">
                    <div class="d-flex justify-content-end align-items-center">
                        <div class="fw-bold me-5">
                            <span class="me-2">{{ selectedIds.length }}</span>Selected
                        </div>
                        <button type="button" data-bs-target="#kt_modal_delete" data-bs-toggle="modal" class="btn btn-danger btn-sm ">
                            Delete Selected
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="card-body pt-0 overflow-scroll h-100 p-0 m-0 ">
            <KTDatatable @on-sort="sort" @on-items-select="onItemSelect" :data="list" :header="headerConfig"
                :loading="loading" :checkbox-enabled="true" :itemsPerPage="itemsPerPage" :total="totalPage"
                :currentPage="currentPage" @page-change="handlePage" @on-items-per-page-change="handlePerPage"
                @customRow="customRowTable">
                <template v-slot:id="{ row: customer }">{{ customer.id }}</template>
                <template v-slot:user="{ row: customer }">{{ customer.user.username }}</template>
                <template v-slot:status_name="{ row: customer }"><span :class="`badge badge-${getStatus(customer.status).color}`">{{ customer.status_name ?? '--' }}</span></template>
                <template v-slot:created_at="{ row: customer }">
                    {{ customer.created_at ? formatDate(customer.created_at) : '--:--' }}
                </template>
                <template v-slot:finished_at="{ row: customer }">
                    {{ customer.finished_at ? formatDate(customer.finished_at) : '--:--' }}
                </template>
                <template v-slot:actions="{ row: customer }">
                    <button type="button" class="btn btn-icon btn-bg-light btn-active-color-warning btn-sm me-1"
                        data-bs-toggle="modal" data-bs-target="#kt_modal_new_target_group"
                        @click="handleClick(customer, 'edit')" title="Sửa">
                        <KTIcon icon-name="pencil" icon-class="fs-3" />
                    </button>
                </template>
            </KTDatatable>
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

                <VForm id="kt_modal_new_target_group_form" class="form" @submit="submit"
                >
                    <div class="modal-body py-10 px-lg-17">
                        <div class="scroll-y me-n7 pe-7" id="kt_modal_new_target_group_scroll" data-kt-scroll="true"
                            data-kt-scroll-activate="{default: false, lg: true}" data-kt-scroll-max-height="auto"
                            data-kt-scroll-dependencies="#kt_modal_new_target_group_header"
                            data-kt-scroll-wrappers="#kt_modal_new_target_group_scroll" data-kt-scroll-offset="300px">
                            <div class="fv-plugins-message-container">
                                <div class="fv-help-block">
                                    <span class="" v-if="errors.tree">{{ Array.isArray(errors.tree) ? errors.tree[0] : errors.tree }}</span>
                                </div>
                            </div>
                            <el-tree
                                ref="treeRef"
                                :data="dataFormCreate"
                                show-checkbox
                                node-key="id"
                                :default-expanded-keys="['0-0']"
                                :props="defaultProps"
                            />
                        </div>
                    </div>

                    <div class="modal-footer flex-center">
                        <button ref="discardButtonRef" type="reset" id="kt_modal_new_target_group_cancel"
                            class="btn btn-sm  btn-light me-3">
                            Discard
                        </button>
                        <button ref="submitButtonRef" type="submit" @click="getCheckedKeys" id="kt_modal_new_target_group_submit"
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
                                <h1 class="fw-bold"><span class="text-gray-400">Người recon:</span> {{ detailData.username }}</h1>
                            </div>
                        </div>
                        <div class="card-body py-0">
                            <div class="mb-10">
                                <h5>Thông tin chi tiết:</h5>
                                <div class="d-flex flex-wrap py-5">
                                    <div class="flex-equal me-5">
                                        <div class="table fs-6 fw-semobold gs-0 gy-2 gx-2 m-0">
                                            <template v-for="(recon, index) in detailData.dataRecon" :key="index">
                                                <div v-if="recon.active">
                                                    <strong class="fw-bolder">{{ recon.title }}: </strong>
                                                </div>
                                                <div class="row">
                                                    <template v-for="(pair, pairIndex) in recon.children" :key="pairIndex">
                                                        <div v-if="pair.active" class="col-6 d-inline-block mb-2" style="float: left;">
                                                            <span>{{ pair.title }}</span>
                                                        </div>
                                                    </template>
                                                </div>
                                            </template>
                                            <div class="row mb-4 ">
                                                <div class="text-gray-400 col-6">Trạng thái:</div>
                                                <span :class="`badge badge-${getStatus(detailData.status).color} col-2`">{{ detailData.statusName }}</span>
                                            </div>
                                            <div class="row mb-4">
                                                <div class="text-gray-400 col-6">Thời gian bắt đầu:</div>
                                                <div class="text-gray-800 col-6">{{ formatDate(detailData.created_at) }}</div>
                                            </div>
                                            <div class="row mb-4">
                                                <div class="text-gray-400 col-6">Thời gian kết thúc:</div>
                                                <div class="text-gray-800 col-6">{{ formatDate(detailData.finished_at) }}</div>
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
import { ElTree } from 'element-plus'
import Fillter from "@/views/apps/targets/filterTargetScan.vue";

import * as Yup from "yup";
import Swal from "sweetalert2/dist/sweetalert2.js";

import { Modal } from "bootstrap";
import dayjs from 'dayjs';
import { useToast } from 'vue-toast-notification';

interface APIData {
    status: string;
    created_at: string;
    finished_at: string;
    user: string;
}

interface Errors {
    status: string;
    created_at: string;
    finished_at: string;
    user: string;
    detail: string;
    tree: string;
    notifi_error_select: string[];
    proxyScheme: string;
    proxyAdress: string;
    proxyPort: string;
    proxyUsername: string;
    proxyUserPassword: string;
    headerOptionValue: string;
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
        const treeRef = ref<InstanceType<typeof ElTree>>()
        // const testPage = ref<number>(0);
        const currentPage = ref<number>(1);
        const itemsPerPage = ref<number>(20);
        const query = ref<String>('');
        const search_group = ref<String>('');
        const orderingID = ref<String>('');
        const typeModal = ref<String>('');
        const id = ref<number>(0);
        const nameType = ref<string>('');
        const toastr = useToast();
        const apiData = ref<APIData>({
            status: '',
            created_at: "",
            finished_at: '',
            user: '',
        });
        const errors: Errors = reactive({
            status: "",
            created_at: "",
            finished_at: '',
            user: '',
            detail: '',
            tree: '',
            notifi_error_select: [],
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
            dataRecon: [{
                active: false,
                title: '',
                children: [{
                    name: '',
                    title: '',
                    active: false,
                }],
            }],
        });

        const getIdFromUrl = () => {
            const url = window.location.href;
            const idMatch = url.match(/target-recons\/(\d+)/);
            if (idMatch) {
                return parseInt(idMatch[1]);
            }
        };
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

        const defaultProps = reactive({
            children: 'children',
            label: 'label',
        });
        const dataFormCreate = ref([
            {
                label: 'Full recon',
                id: '0-0',
                children: [
                    {
                        label: 'OSINT',
                        name: "OSINT",
                        id: '0-0-0',
                        children: [
                            {
                                label: 'Domain information',
                                name: "domain",
                                id: '0-0-0-0',
                            },
                            {
                                label: 'Emails addresses and users',
                                name: "email",
                                id: '0-0-0-1',
                            },
                            {
                                label: 'Password leaks',
                                name: "password",
                                id: '0-0-0-2',
                            },
                            {
                                label: 'Metadata finder',
                                name: "metadata",
                                id: '0-0-0-3',
                            },
                        ],
                    },
                    {
                        label: 'Subdomains',
                        name: "Subdomains",
                        id: '0-0-1',
                        children: [
                            {
                                id: '0-0-1-0',
                                label: 'Passive',
                                name: "sub_passive",
                            },
                            {
                                id: '0-0-1-1',
                                label: 'Certificate transparency',
                                name: "sub_crt",
                            },
                            {
                                id: '0-0-1-2',
                                label: 'TLS handshake',
                                name: "sub_active",
                            },
                            {
                                id: '0-0-1-3',
                                label: 'NOERROR subdomain discovery',
                                name: "sub_noerror",
                            },
                            {
                                id: '0-0-1-4',
                                label: 'Bruteforce',
                                name: "sub_brute",
                            },
                            {
                                id: '0-0-1-5',
                                label: 'DNS Records',
                                name: "sub_dns",
                            },
                            {
                                id: '0-0-1-6',
                                label: 'JS files & Source Code Scraping',
                                name: "sub_scraping",
                            },
                            {
                                id: '0-0-1-7',
                                label: 'Google Analytics ID',
                                name: "sub_analytics",
                            },
                            {
                                id: '0-0-1-8',
                                label: 'Cloud checkers',
                                name: "s3buckets",
                            },
                            {
                                id: '0-0-1-9',
                                label: 'Subdomains takeover',
                                name: "subdomains_takeover",
                            },
                        ],
                    },
                    {
                        label: 'Hosts',
                        name: 'Hosts',
                        id: '0-0-2',
                        children: [
                            {
                                id: '0-0-2-0',
                                label: 'IP info',
                                name: "whoisxml",
                            },
                            {
                                id: '0-0-2-1',
                                label: 'CDN checker',
                                name: "ipcdn",
                            },
                            {
                                id: '0-0-2-2',
                                label: 'WAF checker',
                                name: "wafw00f",
                            },
                            {
                                id: '0-0-2-3',
                                label: 'Port Scanner',
                                name: "port_scanner",
                            },
                        ],
                    },
                    {
                        label: 'Webs',
                        name: 'Webs',
                        id: '0-0-3',
                        children: [
                            {
                                id: '0-0-3-0',
                                label: 'Web Prober',
                                name: "web_probe_full",
                            },
                            {
                                id: '0-0-3-1',
                                label: 'CMS Scanner',
                                name: "cms_scanner",
                            },
                            {
                                id: '0-0-3-2',
                                label: 'Url extraction',
                                name: "urlchecks",
                            },
                            {
                                id: '0-0-3-3',
                                label: 'URL patterns Search and filtering',
                                name: "url_gf",
                            },
                            {
                                id: '0-0-3-4',
                                label: 'Javascript analysis',
                                name: "jschecks",
                            },
                            {
                                id: '0-0-3-5',
                                label: 'Fuzzing',
                                name: "fuzz",
                            },
                        ],
                    },
                ],
            },
        ]);

        const dataValidateTree = ref([
            {
                key: "0-0-0-2",
                title: "Password leaks",
                children: [
                    {
                        key: "0-0-0-1",
                        title: "Emails addresses and users",
                    },
                ],
            },
            {
                key: "0-0-1-5",
                title: "DNS Records",
                children: [
                    {
                        key: "0-0-1-0",
                        title: "Passive",
                    },
                    {
                        key: "0-0-1-1",
                        title: "Certificate transparency",
                    },
                    {
                        key: "0-0-1-3",
                        title: "NOERROR subdomain discovery",
                    },
                    {
                        key: "0-0-1-4",
                        title: "Bruteforce",
                    }
                ],
            },
            {
                key: "0-0-1-6",
                title: "JS files & Source Code Scraping",
                children: [
                    {
                        key: "0-0-1-0",
                        title: "Passive",
                    },
                    {
                        key: "0-0-1-1",
                        title: "Certificate transparency",
                    },
                    {
                        key: "0-0-1-3",
                        title: "NOERROR subdomain discovery",
                    },
                    {
                        key: "0-0-1-4",
                        title: "Bruteforce",
                    }
                ],
            },
            {
                key: "0-0-1-8",
                title: "Cloud checkers",
                children: [
                    {
                        key: "0-0-1-0",
                        title: "Passive",
                    },
                    {
                        key: "0-0-1-1",
                        title: "Certificate transparency",
                    },
                    {
                        key: "0-0-1-3",
                        title: "NOERROR subdomain discovery",
                    },
                    {
                        key: "0-0-1-4",
                        title: "Bruteforce",
                    }
                ],
            },
            {
                key: "0-0-1-9",
                title: "Subdomains takeover",
                children: [
                    {
                        key: "0-0-1-0",
                        title: "Passive",
                    },
                    {
                        key: "0-0-1-1",
                        title: "Certificate transparency",
                    },
                    {
                        key: "0-0-1-3",
                        title: "NOERROR subdomain discovery",
                    },
                    {
                        key: "0-0-1-4",
                        title: "Bruteforce",
                    }
                ],
            },
            {
                key: "0-0-3-0",
                title: "Web Prober",
                children: [
                    {
                        key: "0-0-1-0",
                        title: "Passive",
                    },
                    {
                        key: "0-0-1-1",
                        title: "Certificate transparency",
                    },
                    {
                        key: "0-0-1-3",
                        title: "NOERROR subdomain discovery",
                    },
                    {
                        key: "0-0-1-4",
                        title: "Bruteforce",
                    }
                ],
            },
            {
                key: "0-0-2-1",
                title: "CDN checker",
                children: [
                    {
                        key: "0-0-1-5",
                        title: "DNS Records",
                    },
                ],
            },
            {
                key: "0-0-2-2",
                title: "WAF checker",
                children: [
                    {
                        key: "0-0-3-0",
                        title: "Web Prober",
                    },
                ],
            },
            {
                key: "0-0-3-2",
                title: "Url extraction",
                children: [
                    {
                        key: "0-0-3-0",
                        title: "Web Prober",
                    },
                ],
            },
            {
                key: "0-0-3-1",
                title: "CMS Scanner",
                children: [
                    {
                        key: "0-0-3-0",
                        title: "Web Prober",
                    },
                ],
            },
            {
                key: "0-0-3-5",
                title: "Fuzzing",
                children: [
                    {
                        key: "0-0-3-0",
                        title: "Web Prober",
                    },
                ],
            },
            {
                key: "0-0-3-4",
                title: "Javascript analysis",
                children: [
                    {
                        key: "0-0-1-6",
                        title: "JS files & Source Code Scraping",
                    },
                ],
            },
            {
                key: "0-0-3-3",
                title: "URL patterns Search and filtering",
                children: [
                    {
                        key: "0-0-3-2",
                        title: "Url extraction",
                    },
                ],
            },
        ]);
        
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

        const getCheckedKeys = () => {
            return treeRef.value!.getCheckedKeys(false)
        }

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
            return ApiService.get(`/recon/${target_id}/target?search_recon=${query.value}&search_status=${filterStatus.value}&page=${currentPage.value}&page_size=${itemsPerPage.value}&ordering=${orderingID.value}`)
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
                return ApiService.delete(`recon/multi-delete?id=${ids}`)
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
                detailData.dataRecon = detail.data_recon
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

        const validationSchema = () => {
            const checkedKeys = getCheckedKeys()
            
            if (getCheckedKeys().length == 0) {
                toastr.error('Bạn phải chọn ít nhất một recon', { position: 'top-right' });

                return true
            } else {
                dataValidateTree.value.map(el => {
                    el.children.map(e => {
                        if (checkedKeys.includes(el.key) && !checkedKeys.includes(e.key)) {
                            errors.notifi_error_select.push("Để recon " + el.title + " bạn cần chạy thêm " + e.title);
                        }
                    })
                })

                if (errors.notifi_error_select.length) {
                    for (let i = 0; i < errors.notifi_error_select.length; i++) {
                        const error = errors.notifi_error_select[i];
                        toastr.error(error, { position: 'top-right' });
                    }    
                    errors.notifi_error_select = []

                    return true
                }

                return false
            }
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
                hideModal(newTargetGroupModalRef.value);
                hideModal(ModalDelete.value);
                hideModal(ModalDetail.value);
            });
        }
        
        const eyeButtonRef = ref<boolean>(false);
        const eyePassword = () => {
            eyeButtonRef.value = (eyeButtonRef.value) ? false : true;
        };

        const submit = async () => {
            if (!submitButtonRef.value) {
                return;
            }
            
            if (validationSchema()) {
                return
            }

            if (typeModal.value == 'add') {
                let dataTree = dataFormCreate.value[0]['children']
                let checkedKey = getCheckedKeys();

                let arr: string[]  = [];
                
                checkedKey.forEach((element) => {
                    if (typeof element === 'string' && element.length > 5) {
                        arr.push(element.slice(0, 5));
                    }
                });
                const checkedKeyNew = [...new Set(checkedKey.concat(arr))];

                const form_data = {
                    recon: dataTree.map(({ id, label, children }) => ({
                        title: label,
                        active: checkedKeyNew.find(name => name == id) == id ? true : false,
                        children: children.map(({ name, id, label }) => ({
                            title: label,
                            name: name,
                            active: checkedKeyNew.find(name => name == id) == id ? true : false,
                        }))
                    })),
                    target_id: getIdFromUrl(),
                }
                
                return ApiService.post("recon/create/", form_data)
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
                    .catch(({ response }) => {
                        if (response?.data) {
                            errors.detail = response.data.detail;
                            
                            notification(response?.data?.detail, 'error', 'Có lỗi xảy ra')
                        } else {
                            notification(response?.data?.detail, 'error', 'Có lỗi xảy ra')
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
            formatDate,
            loading,

            getStatus,

            //SCAN
            scanFormState,
            getScanSpeedName,
            eyePassword,
            eyeButtonRef,

            //Recon
            defaultProps,
            dataFormCreate,
            treeRef,
            getCheckedKeys,
            dataValidateTree,
        };
    },
});
</script>
