<template>
    <!--begin::Card-->
    <div class="card h-100 d-block">
        <!--begin::Card header-->
        <div class="card-header border-0 pt-10 pt-sm-10 pt-lg-6 position-absolute end-0 pe-1  " style="top: -80px;">
            <!--begin::Card toolbar-->
            <div class="card-toolbar">
                <!--begin::Toolbar-->
                <div v-show="selectedIds.length === 0">
                    <div class="d-flex justify-content-end" data-kt-subscription-table-toolbar="base">
                        <!--begin::Export-->
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
                        <el-tooltip class="box-item" effect="dark" hide-after="0" content="Thêm mới" placement="top">
                            <button type="button" class="btn btn-sm fw-bold btn-primary" data-bs-toggle="modal"
                                data-bs-target="#kt_modal_new_target_group" @click.passive="handleClick({}, 'add')">
                                <KTIcon icon-name="plus" icon-class="fs-2" />
                                Thêm
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
                        <el-tooltip class="box-item" effect="dark" hide-after="0" content="Xóa" placement="top">
                            <button type="button" @click="deleteSelectd()"
                                class="btn btn-danger btn-sm " :disabled="disabled">
                                Xóa mục đã chọn
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
        <div class="card-body overflow-y-auto overflow-x-auto h-100 p-0 m-0 ">
            <KTDatatable @on-sort="sort" @on-items-select="onItemSelect" :data="list" :header="headerConfig"
                :loading="loading" :checkbox-enabled="true" :itemsPerPage="itemsPerPage" :total="totalPage"
                :currentPage="currentPage" @page-change="handlePage" @on-items-per-page-change="handlePerPage"
                @customRow="customRowTable">

                <template v-slot:id="{ row: customer }">{{ customer.id }}</template>
                <template v-slot:first_name="{ row: customer }"><span class="fs-6 fw-bold text-dark text-hover-primary">{{
                    customer.first_name }}</span></template>
                <template v-slot:username="{ row: customer }">
                    {{ customer.username }}
                </template>
                <template v-slot:actions="{ row: customer }">
                    <el-tooltip class="box-item" effect="dark" hide-after="0" content="Chỉnh sửa" placement="top">
                        <button type="button" class="btn btn-icon btn-bg-light btn-active-color-warning btn-sm me-1"
                            data-bs-toggle="modal" data-bs-target="#kt_modal_new_target_group"
                            @click="handleClick(customer, 'edit')" title="Sửa">
                            <KTIcon icon-name="pencil" icon-class="fs-3" />
                        </button>
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
                    :validation-schema="nameType == 'Chỉnh Sửa Thông Tin Người Dùng' ? validationSchemaUpdate : validationSchema">
                    <!--begin::Modal body-->
                    <div class="modal-body py-10 px-lg-17">
                        <!--begin::Scroll-->
                        <div class="scroll-y me-n7 pe-7" id="kt_modal_new_target_group_scroll" data-kt-scroll="true"
                            data-kt-scroll-activate="{default: false, lg: true}" data-kt-scroll-max-height="auto"
                            data-kt-scroll-dependencies="#kt_modal_new_target_group_header"
                            data-kt-scroll-wrappers="#kt_modal_new_target_group_scroll" data-kt-scroll-offset="300px">
                            <div class="mb-5 fv-row">
                                <label class="d-flex align-items-center fs-6 fw-semobold mb-2" for="username">
                                    <span
                                        v-bind:class="{ 'required': nameType != 'Chỉnh Sửa Thông Tin Người Dùng' }">Tên Đăng Nhập</span>
                                </label>
                                <Field type="text" class="form-control form-control-solid"
                                    :disabled="nameType == 'Chỉnh Sửa Thông Tin Người Dùng'"
                                    :style="{ cursor: nameType == 'Chỉnh Sửa Thông Tin Người Dùng' ? 'not-allowed' : '', 'background-color': nameType == 'Chỉnh Sửa Thông Tin Người Dùng' ? '#eee' : '' }"
                                    placeholder="Nhập tên đăng nhập" autocomplete="username" id="username" name="username" v-model="apiData.username" />
                                <div v-if="nameType != 'Chỉnh Sửa Thông Tin Người Dùng'"
                                    class="fv-plugins-message-container">
                                    <div class="fv-help-block">
                                        <ErrorMessage name="username" />
                                        <span class="" v-if="errors.username">{{ errors.username[0] }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="mb-5 fv-row">
                                <label class="d-flex align-items-center fs-6 fw-semobold mb-2" for="first_name">
                                    <span class="required">Họ Tên</span>
                                </label>
                                <Field type="text" class="form-control form-control-solid" placeholder="Nhập họ tên"
                                    id="first_name" autocomplete="first_name" name="first_name" v-model="apiData.first_name" />
                                <div class="fv-plugins-message-container">
                                    <div class="fv-help-block">
                                        <ErrorMessage name="first_name" />
                                        <span class="" v-if="errors.first_name">{{ errors.first_name[0] }}</span>
                                    </div>
                                </div>
                            </div>
                            <div v-if="nameType != 'Chỉnh Sửa Thông Tin Người Dùng'" class="mb-5 fv-row">
                                <label class="d-flex align-items-center fs-6 fw-semobold mb-2" for="password">
                                    <span class="required">Mật Khẩu Mới</span>
                                </label>
                                <!--end::Label-->

                                <!--begin::Input wrapper-->
                                <div class="position-relative mb-3">
                                    <Field :type="!eyeButtonRef ? 'password' : 'text'"
                                        class="form-control form-control-solid h-35px" name="password" id="password"
                                        v-model="apiData.password" />

                                    <span class="btn btn-sm btn-icon position-absolute translate-middle top-50 end-0 me-n2">
                                        <KTIcon :icon-name="!eyeButtonRef ? 'eye-slash' : 'eye'" icon-class="fs-2"
                                            @click="eyePassword" />
                                    </span>
                                </div>
                                <div class="fv-plugins-message-container">
                                    <div class="fv-help-block">
                                        <ErrorMessage name="password" />
                                        <span v-if="Object.keys(errors.password).length !== 0">
                                            <template v-for="(el, key) in errors.password" :key="key">{{ el
                                            }}<br></template>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div v-if="nameType != 'Chỉnh Sửa Thông Tin Người Dùng'" class="mb-5 fv-row">
                                <label class="d-flex align-items-center fs-6 fw-semobold mb-2" for="password_confirm">
                                    <span class="required">Nhập Lại Mật Khẩu</span>
                                </label>
                                <div class="position-relative mb-3">
                                    <Field :type="!eyeButtonRef2 ? 'password' : 'text'"
                                        class="form-control form-control-solid h-35px" name="password_confirm"
                                        id="password_confirm" v-model="apiData.password_confirm" />

                                    <span class="btn btn-sm btn-icon position-absolute translate-middle top-50 end-0 me-n2">
                                        <KTIcon :icon-name="!eyeButtonRef2 ? 'eye-slash' : 'eye'" icon-class="fs-2"
                                            @click="eyePassword2" />
                                    </span>
                                </div>

                                <div class="fv-plugins-message-container">
                                    <div class="fv-help-block">
                                        <ErrorMessage name="password_confirm" />
                                        <span v-if="Object.keys(errors.password_confirm).length !== 0">
                                            <template v-for="(el, key) in errors.password_confirm" :key="key">{{ el
                                            }}<br></template>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div class="mt-5 fv-row">
                                <div class="form-check form-check-custom form-check-solid">
                                    <input class="form-check-input" type="checkbox" value="1" id="is_staff" name="is_staff"
                                        v-model="apiData.is_staff" :checked="apiData.is_staff">
                                        
                                    <label style="padding-left: 10px;" class="fs-6 fw-semobold" for="is_staff">Quản Trị Viên</label>
                                </div>
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
                        <button ref="discardButtonRef" @click="removeTextModal" type="reset"
                            id="kt_modal_new_target_group_cancel" class="btn btn-sm  btn-light me-3">
                            Loại Bỏ
                        </button>
                        <!--end::Button-->

                        <!--begin::Button-->
                        <button ref="submitButtonRef" type="submit" id="kt_modal_new_target_group_submit"
                            class="btn btn-sm  btn-light-primary">
                            <span class="indicator-label"> Gửi </span>
                            <span class="indicator-progress">
                                Đang Gửi...
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
                                <h1 class="fw-bold">{{ detailData.username }}</h1>
                            </div>
                            <!--begin::Card toolbar-->
                            <div class="card-toolbar">
                                <button type="button" class="btn btn-light-warning btn-sm me-1" data-bs-toggle="modal"
                                    data-bs-target="#kt_modal_new_target_group" @click="handleClick(detailData, 'edit')">
                                    <KTIcon icon-name="pencil" icon-class="fs-3" /> Cập Nhật
                                </button>
                            </div>
                            <!--end::Card toolbar-->
                        </div>
                        <!--end::Card header-->

                        <!--begin::Card body-->
                        <div class="card-body py-0">
                            <!--begin::Section-->
                            <div class="mb-10">
                                <!--begin::Title-->
                                <h5>Thông Tin Chi Tiết:</h5>
                                <!--end::Title-->
                                <!--begin::Details-->
                                <div class="d-flex flex-wrap py-5">
                                    <!--begin::Row-->
                                    <div class="flex-equal me-5">
                                        <!--begin::Details-->
                                        <table class="table fs-6 fw-semobold gs-0 gy-2 gx-2 m-0">
                                            <!--begin::Row-->
                                            <tr>
                                                <td class="text-gray-500">Họ Tên:</td>
                                                <td class="text-dark badge badge-light pe-2">{{ detailData.first_name }}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td class="text-gray-500">Phân Quyền:</td>
                                                <td class="text-dark badge badge-light pe-2">{{ detailData.is_staff ?
                                                    'Quản trị viên' : 'Người dùng' }}</td>
                                            </tr>
                                            <!--end::Row-->
                                            <!--begin::Row-->
                                            <tr>
                                                <td class="text-gray-500">Ngày Tạo:</td>
                                                <td class="text-dark">{{ formatDate(detailData.date_joined) }}</td>
                                            </tr>
                                            <!--end::Row-->
                                            <!--begin::Row-->
                                            <tr>
                                                <td class="text-gray-500">Ngày Cập Nhật Cuối:</td>
                                                <td class="text-dark">{{ formatDate(detailData.last_login) }}</td>
                                            </tr>
                                            <!--end::Row-->
                                        </table>
                                        <!--end::Details-->
                                    </div>
                                    <!--end::Row-->

                                </div>
                                <!--end::Row-->
                            </div>
                            <!--end::Section-->
                        </div>
                        <!--end::Card body-->
                    </div>
                    <!--end::Card-->
                </div>
                <!--end::Form-->
                <div class="modal-footer text-center">
                    <button type="button" class="btn btn-sm  btn-light-primary me-9" data-bs-dismiss="modal">
                        Đóng
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
import Fillter from "@/views/apps/users/filterUser.vue";

import * as Yup from "yup";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import { markRaw } from 'vue'
import { Modal } from "bootstrap";

interface APIData {
    first_name: string;
    username: string;
    password: string;
    password_confirm: string;
    is_staff: boolean;
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
            first_name: "",
            username: "",
            is_staff: false,
            password: '',
            password_confirm: '',
        });
        const errors = reactive({
            first_name: '',
            username: '',
            password: '',
            password_confirm: '',
            detail: '',
            is_staff: false,
        });
        const detailData = reactive({
            id: '',
            first_name: '',
            username: '',
            is_staff: '',
            last_login: '',
            date_joined: '',
        });
        const discardButtonRef = ref<HTMLElement | null>(null);
        const ModalDetail = ref<null | HTMLElement>(null);
        const loading = ref<boolean>(false)
        const editEmail = ref<string>('');
        const headerConfig = ref([
            {
                columnName: "ID",
                columnLabel: "id",
                sortEnabled: true,
            },
            {
                columnName: "Họ Tên",
                columnLabel: "first_name",
            },
            {
                columnName: "Tên người dùng",
                columnLabel: "username",
            },
            {
                columnName: "Hành động",
                columnLabel: "actions",
                columnWidth: 50,
            },
        ]);

        // eyePassword
        const eyeButtonRef = ref<boolean>(false);
        const eyePassword = () => {
            eyeButtonRef.value = (eyeButtonRef.value) ? false : true;
        };

        const eyeButtonRef2 = ref<boolean>(false);
        const eyePassword2 = () => {
            eyeButtonRef2.value = (eyeButtonRef2.value) ? false : true;
        };

        const handleClick = (data: object | any, type: String) => {
            typeModal.value = type
            errors.first_name = ''
            errors.username = ''
            errors.is_staff = false
            errors.detail = ''
            if (Object.keys(data).length != 0 && type === 'edit') {
                nameType.value = "Chỉnh Sửa Thông Tin Người Dùng"
                apiData.value.first_name = data.first_name;
                apiData.value.username = data.username;
                apiData.value.is_staff = data.is_staff;
                editEmail.value = data.username ? data.username : 'Nhập tên người dùng';
                id.value = data.id;
            } else {
                nameType.value = "Thêm Mới Người Dùng"
                if (discardButtonRef.value !== null) {
                    apiData.value.is_staff = false;
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

            return ApiService.get(`user?query=${query.value}&page=${currentPage.value}&page_size=${itemsPerPage.value}&orderingID=${orderingID.value}`)
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

        const selectedIds = ref<Array<number>>([]);
            const deleteSelectd = () => {
      ElMessageBox.confirm(
        'Tập tin sẽ được xóa vĩnh viễn. Tiếp tục?',
        'Xác nhận xóa',
        {
          confirmButtonText: 'Đồng ý',
          cancelButtonText: 'Hủy bỏ',
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
            if (ids) {
                disabled.value = true
                setTimeout(() => {
                    disabled.value = false
                }, 1000);
                return ApiService.delete(`user/multi-delete?id=${ids}`)
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
                detailData.first_name = detail.first_name
                detailData.username = detail.username
                detailData.is_staff = detail.is_staff
                detailData.date_joined = detail.date_joined
                detailData.last_login = detail.last_login
                const modal = new Modal(
                    document.getElementById("kt_modal_detail") as Element
                );
                modal.show();
            } else {
                notification('', 'error', 'Có lỗi xảy ra')
            }
        };

        const onItemSelect = (selectedItems: Array<number>) => {
            selectedIds.value = selectedItems
        };

        // validate start
        const submitButtonRef = ref<null | HTMLButtonElement>(null);
        const modalRef = ref<null | HTMLElement>(null);
        const newTargetGroupModalRef = ref<null | HTMLElement>(null);

        const validationSchema = Yup.object().shape({
            first_name: Yup.string()
                .required('Vui lòng nhập tên')
                .matches(/^[a-zA-Z\sÀ-ỹ]+$/, 'Chỉ ký tự chữ được cho phép')
                .max(50, 'Tên đăng nhập không được nhiều hơn 50 ký tự'),
            username: Yup.string()
                .required('Vui lòng nhập tên đăng nhập'),
            password: Yup.string()
                .required('Vui lòng nhập mật khẩu')
                .min(8, 'Mật khẩu nhập không được ít hơn 8 ký tự')
                .max(150, 'Mật khẩu không được nhiều hơn 150 ký tự')
                .matches(
                    /^^(?=.*[ a-z])(?=.*[ A-Z])(?=.*\d)(?=.*[ @$!%*?&])[ A-Za-z\d@$!%*?&]{0,}$/,
                    'Mật khẩu phải chứa ít nhất 1 chữ cái, chữ hoa, ký tự đặc biệt'
                ),
            password_confirm: Yup.string()
                .required('Vui lòng nhập mật khẩu xác nhận')
                .oneOf([Yup.ref('password'), null], 'Mật khẩu xác nhận không khớp')
        });

        const validationSchemaUpdate = Yup.object().shape({
            first_name: Yup.string()
                .required('Vui lòng nhập họ tên')
                .matches(/^[a-zA-Z\sÀ-ỹ]+$/, 'Chỉ ký tự chữ được cho phép')
                .max(50, 'Tên đăng nhập không được nhiều hơn 50 ký tự')
        });

        const notification = (values: string, icon: string, more: string) => {
            Swal.fire({
                text: values ?? more,
                icon: icon,
                buttonsStyling: false,
                confirmButtonText: "Đồng ý!",
                heightAuto: false,
                customClass: {
                    confirmButton: "btn btn-primary",
                },
            }).then(() => {
                hideModal(newTargetGroupModalRef.value);
                
                hideModal(ModalDetail.value);
            });
        }

        const submit = async () => {
            if (!submitButtonRef.value) {
                return;
            }
            let formData = {
                'first_name': apiData.value.first_name,
                'username': apiData.value.username ?? "",
                'password': apiData.value.password ?? "",
                'is_staff': apiData.value.is_staff,
            }

            if (typeModal.value == 'add') {
                return ApiService.post("/auth/register/", formData)
                    .then(({ data }) => {
                        if (submitButtonRef.value) {
                            notification(data.detail, 'success', 'Thêm mới thành công')
                            getData();
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
                            errors.username = response.data.Errors.username ?? '';
                            errors.first_name = response.data.Errors.first_name ?? '';
                            errors.password = response.data.Errors.password ?? '';
                            errors.detail = response.data.detail ?? '';
                        } else {
                            notification(response?.data?.detail, 'error', 'Có lỗi xảy ra')
                        }
                    });
            } else {
                let formDataUpdate = {
                    'first_name': apiData.value.first_name,
                    'is_staff': apiData.value.is_staff,
                }

                return ApiService.put(`/user/${id.value}/update`, formData)
                    .then(({ data }) => {
                        notification(data.detail, 'success', 'Sửa mới thành công')
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
                    .catch(({ response }) => {
                        if (response.data) {
                            errors.username = response.data.Errors.username ?? '';
                            errors.first_name = response.data.Errors.first_name ?? '';
                            errors.password = response.data.Errors.password ?? '';
                            errors.detail = response.data.detail ?? '';
                        } else {
                            notification(response.data.detail, 'error', 'Có lỗi xảy ra')
                        }
                    });
            }

        };

        const formatDate = (date: string) => {
            return date ? date : "--:--";
        }

        const removeTextModal = () => {
            // typeModal.value == 'edit' && 


            apiData.value.is_staff = false
        }

        // end validate


        const handleFilter = (data: any) => {
            if (data) {
                query.value = data.query;
                search_group.value = data.type;
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
            validationSchema,
            validationSchemaUpdate,
            submit,
            submitButtonRef,
            modalRef,
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
            search_group,
            handleFilter,

            // edit 
            nameType,
            formatDate,
            loading,

            // eye
            eyePassword,
            eyeButtonRef,
            // dataPasswordChange,
            eyeButtonRef2,
            eyePassword2,

            removeTextModal,
            editEmail,
            disabled,
        };
    },
});
</script>
