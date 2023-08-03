<template>
  <div class="app-container container-fluid p-5 mt-10">
  <div class="card h-100 d-block">
    <div
      class="card-header border-0 pt-2 pt-sm-10 pt-md-10 position-sm-absolute justify-content-end end-0 pe-1 me-2 me-md-0 me-sm-0"
      style="top: -80px">
      <div class="card-toolbar">
        <div v-show="selectedIds.length === 0">
          <div class="d-flex justify-content-end" data-kt-subscription-table-toolbar="base">
            <el-tooltip class="box-item" effect="dark" :hide-after="0" content="Tìm kiếm" placement="top">
              <button type="button"
                class="btn btn-sm fw-bold bg-light bg-md-body btn-color-gray-700 btn-active-color-primary me-2 btn-outline btn-outline-dashed btn-outline-default"
                data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end" data-kt-menu-flip="top-end">
                <KTIcon icon-name="filter" icon-class="fs-2" />
                Filter
              </button>
            </el-tooltip>
            <Fillter @filterData="handleFilter" :country-list='countryList'></Fillter>
            <importAccountLeak ref="importComponentRef" @notify="(info, noti_type, more_detail, hideImportModal) =>
              notification(info, noti_type, more_detail, hideImportModal)" @resetData="() => getData()"
              @confirm="(info, noti_type) => comfirmDownload(info, noti_type)" />
            <el-tooltip class="box-item" effect="dark" :hide-after="0" content="Thêm mới" placement="top">
              <button type="button" class="btn btn-sm fw-bold btn-primary" data-bs-toggle="modal"
                data-bs-target="#kt_modal_new_target_group" @click="handleClick({}, 'add')">
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
            <el-tooltip class="box-item" effect="dark" :hide-after="0" content="Xóa" placement="top">
              <button type="button" @click="deleteSelectd()" class="btn btn-danger btn-sm" :disabled="disabled">
                Xóa mục đã chọn
              </button>
            </el-tooltip>
          </div>
        </div>
      </div>
    </div>

    <div class="card-body overflow-y-auto overflow-x-auto h-100 p-0 m-0">
      <KTDatatable @on-sort="sort" @on-items-select="onItemSelect" :data="accountLeakList" :header="headerConfig"
        :loading="loading" :checkbox-enabled="true" :itemsPerPage="itemsPerPage" :total="totalPage"
        :currentPage="currentPage" @page-change="handlePage" @on-items-per-page-change="handlePerPage"
        @customRow="customRowTable">
        <template v-slot:id="{ row: account }">{{ account.id }}</template>
        <template v-slot:email="{ row: account }">{{ account.email }}</template>
        <template v-slot:username="{ row: account }">
          {{ account.username }}
        </template>
        <template v-slot:password_hash="{ row: account }">
          {{ truncateText(account.password_hash ?? "", 25) }}
        </template>
        <template v-slot:password_crack="{ row: account }">
          {{ truncateText(account.password_crack ?? "", 25) }}
        </template>
        <template v-slot:source_data="{ row: account }">
          {{ truncateText(account.source_data ?? "", 25) }}
        </template>
        <template v-slot:country="{ row: account }">
          {{ truncateText(account.country ?? "", 25) }}
        </template>
        <template v-slot:actions="{ row: account }">
          <el-tooltip class="box-item" effect="dark" :hide-after="0" content="Chỉnh sửa" placement="top">
            <button type="button" class="btn btn-icon btn-bg-light btn-active-color-warning btn-sm me-1"
              data-bs-toggle="modal" data-bs-target="#kt_modal_new_target_group" @click="handleClick(account, 'edit')">
              <KTIcon icon-name="pencil" icon-class="fs-3" />
            </button>
          </el-tooltip>
        </template>
      </KTDatatable>
    </div>
  </div></div>

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

        <VForm id="kt_modal_new_target_group_form" class="form" @submit="submit" :validation-schema="validationSchema">
          <div class="modal-body py-10 px-lg-17">
            <div class="scroll-y me-n7 pe-7" id="kt_modal_new_target_group_scroll" data-kt-scroll="true"
              data-kt-scroll-activate="{default: false, lg: true}" data-kt-scroll-max-height="auto"
              data-kt-scroll-dependencies="#kt_modal_new_target_group_header"
              data-kt-scroll-wrappers="#kt_modal_new_target_group_scroll" data-kt-scroll-offset="300px">
              <!--begin::Input group-->
              <div class="mb-10" v-if="typeModal == 'edit'">
                <!--begin::Label-->
                <label class="form-label fw-semobold" for="is_ok">Tình trạng:</label>
                <!--end::Label-->

                <!--begin::Switch-->
                <div class="form-check form-switch form-switch-sm form-check-custom form-check-solid">
                  <label class="form-check-label">
                    <el-switch v-model="apiData.is_ok" class="ml-2" name="is_ok"
                      style="--el-switch-on-color: #13ce66; --el-switch-off-color: #f1416C" />
                    <span class="form-check-label user-select-none">
                      {{ apiData.is_ok ? "Đã kiểm tra" : "Chưa kiểm tra" }}
                    </span>
                  </label>
                </div>
                <!--end::Switch-->
              </div>
              <!--end::Input group-->
              <div class="mb-5 fv-row row">
                <div class="col-4">
                  <label class="d-flex align-items-center fs-6 fw-semobold mb-2" for="username">
                    <span class="required">Username</span>
                  </label>
                  <Field type="text" class="form-control form-control-solid" placeholder="Nhập username"
                    @keydown="removeErrorMsgText" id="username" name="username" autocomplete="username"
                    v-model="apiData.username" />
                  <div class="fv-plugins-message-container">
                    <div class="fv-help-block">
                      <ErrorMessage name="username" />
                      <span class="" v-if="errors.username">{{
                        errors.username[0]
                      }}</span>
                    </div>
                  </div>
                </div>
                <div class="col-4">
                  <label class="d-flex align-items-center fs-6 fw-semobold mb-2" for="email">
                    <span>Email</span>
                  </label>
                  <Field type="text" class="form-control form-control-solid" placeholder="Nhập email"
                    @keydown="removeErrorMsgText" id="email" name="email" autocomplete="email" v-model="apiData.email" />
                  <div class="fv-plugins-message-container">
                    <div class="fv-help-block">
                      <ErrorMessage name="email" />
                      <span class="" v-if="errors.email">{{
                        errors.email[0]
                      }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="d-flex flex-column mb-5 fv-row">
                <label class="fs-6 fw-semobold mb-2 required" for="password_hash">Password Hash</label>
                <Field as="textarea" class="form-control form-control-solid" rows="3" id="password_hash"
                  name="password_hash" placeholder="Nhập password hash" v-model="apiData.password_hash" />
                <div class="fv-plugins-message-container">
                  <div class="fv-help-block">
                    <ErrorMessage name="password_hash" />
                  </div>
                </div>
              </div>
              <div class="d-flex flex-column mb-5 fv-row">
                <label class="fs-6 fw-semobold mb-2" for="password_crack">Password Crack</label>
                <Field type="text" class="form-control form-control-solid" placeholder="Nhập password crack"
                  @keydown="removeErrorMsgText" id="password_crack" name="password_crack"
                  v-model="apiData.password_crack" />
                <div class="fv-plugins-message-container">
                  <div class="fv-help-block">
                    <ErrorMessage name="password_crack" />
                    <span class="" v-if="errors.password_crack">{{
                      errors.password_crack[0]
                    }}</span>
                  </div>
                </div>
              </div>
              <div class="d-flex flex-column mb-5 fv-row">
                <label class="fs-6 fw-semobold mb-2" for="source_data">Nguồn dữ liệu</label>
                <Field type="text" class="form-control form-control-solid" placeholder="Mua dữ liệu"
                  @keydown="removeErrorMsgText" id="source_data" name="source_data" v-model="apiData.source_data" />
                <div class="fv-plugins-message-container">
                  <div class="fv-help-block">
                    <ErrorMessage name="source_data" />
                    <span class="" v-if="errors.source_data">{{
                      errors.source_data[0]
                    }}</span>
                  </div>
                </div>
              </div>
              <div class="d-flex flex-column mb-5 fv-row">
                <div class="col-4">
                  <label class="d-flex align-items-center fs-6 fw-semobold mb-2" for="product_text">
                    <span class="required">Quốc gia</span>
                  </label>
                  <el-form-item prop="assign">
                    <el-select filterable="true" placeholder="Chọn kiểu" as="select" height="40px" id="product_text"
                      name="product_text" class="input-group-lg" v-model="apiData.country_id">
                      <el-option label="Chọn quốc gia" value="" disabled>Chọn quốc gia</el-option>
                      <el-option label="Khác" value="0"></el-option>
                      <el-option v-for="item in countryList" :key="item.id" :label="item.name" :value="item.id" />
                    </el-select>
                    <div class="fv-plugins-message-container">
                      <div class="fv-help-block">
                        <ErrorMessage name="country_id" />
                        <span class="" v-if="errors.country_id">{{
                          errors.country_id[0]
                        }}</span>
                      </div>
                    </div>
                  </el-form-item>
                </div>
              </div>
              <div class="fv-plugins-message-container">
                <div class="fv-help-block">
                  <span class="" v-if="errors.detail">{{
                    Array.isArray(errors.detail)
                    ? errors.detail[0]
                    : errors.detail
                  }}</span>
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
              class="btn btn-sm  btn-light me-3" @click="resetForm">
              Loại bỏ
            </button>
            <!--end::Button-->

            <!--begin::Button-->
            <button ref="submitButtonRef" type="submit" id="kt_modal_new_target_group_submit"
              class="btn btn-sm  btn-primary">
              <span class="indicator-label"> Gửi </span>
              <span class="indicator-progress">
                Đang gửi...
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
    <div class="modal-dialog modal-dialog-centered mw-750px">
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
                <h1 class="fw-bold">Thông tin tài khoản</h1>
              </div>
              <!--begin::Card toolbar-->
              <div class="card-toolbar">
                <button type="button" class="btn btn-light-warning btn-sm me-1" data-bs-toggle="modal"
                  data-bs-target="#kt_modal_new_target_group" @click="handleClick(detailData, 'edit')">
                  <KTIcon icon-name="pencil" icon-class="fs-3" /> Cập nhật
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
                        <div class="col-3 text-gray-400">Tình trạng:</div>
                        <div class="col-9 text-gray-800 fs-5 fw-bold">
                          <span class="badge"
                            :class="{ 'badge-success': detailData.is_ok, 'badge-danger': !detailData.is_ok }">{{
                              detailData.is_ok ? "Đã kiểm tra" : "Chưa kiểm tra" }}</span>
                        </div>
                      </div>
                      <div class="row fs-6 mb-3">
                        <div class="col-3 text-gray-400">Tên người dùng:</div>
                        <div class="col-9 text-gray-800">
                          <span>{{ detailData.username ? detailData.username : "--:--" }}</span>
                        </div>
                      </div>
                      <div class="row fs-6 mb-3">
                        <div class="col-3 text-gray-400">Email:</div>
                        <div class="col-9 text-gray-800">
                          <span>{{ detailData.email ? detailData.email : "--:--" }}</span>
                        </div>
                      </div>
                      <div class="row fs-6 mb-3">
                        <div class="col-3 text-gray-400">Password Crack:</div>
                        <div class="col-9 text-gray-800">
                          <span>{{ detailData.password_crack ? detailData.password_crack : "--:--" }}</span>
                        </div>
                      </div>
                      <div class="row fs-6 mb-3">
                        <div class="col-3 text-gray-400">Pasword Hash:</div>
                        <div class="col-9 text-gray-800">
                          <span>{{ detailData.password_hash ? detailData.password_hash : "--:--" }}</span>
                        </div>
                      </div>
                      <div class="row fs-6 mb-3" v-if="detailData.hash_type && detailData.hash_type.length">
                        <div class="col-3 text-gray-400">
                          Hash Type:
                        </div>
                        <div class="col-9 text-gray-800">
                          <template v-for="(value, key) in detailData.hash_type" :key="key">
                            <div class="col-6 d-inline-block mb-2" style="float: left;">
                              <li class="d-flex align-items-center" style="padding: 5px 0px 0px 0px;">
                                <span class="bullet bullet-dot bg-primary h-5px w-5px me-2"></span><span
                                  class="text-gray-800">{{ value }}</span>
                              </li>
                            </div>
                          </template>
                        </div>
                      </div>
                      <div class="row fs-6 mb-3">
                        <div class="col-3 text-gray-400">Nguồn dữ liệu:</div>
                        <div class="col-9 text-gray-800">
                          <span>{{ detailData.source_data ? detailData.source_data : "--:--" }}</span>
                        </div>
                      </div>
                      <div class="row fs-6 mb-3">
                        <div class="col-3 text-gray-400">Quốc gia:</div>
                        <div class="col-9 text-gray-800">
                          <span>{{ detailData.country ? detailData.country : "--:--" }}</span>
                        </div>
                      </div>
                      <div class="row fs-6 mb-3">
                        <div class="col-3 text-gray-400">Ngày tạo:</div>
                        <div class="col-9 text-gray-800">
                          <span>{{ formatDate(detailData.created_at) }}</span>
                        </div>
                      </div>
                      <div class="row fs-6">
                        <div class="col-3 text-gray-400">Ngày cập nhập:</div>
                        <div class="col-9 text-gray-800">
                          <span>{{ formatDate(detailData.modified_at) }}</span>
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
          <button type="button" class="btn btn-sm btn-primary me-9" data-bs-dismiss="modal">
            Quay lại
          </button>
        </div>
      </div>
      <!--end::Modal content-->
    </div>
    <!--end::Modal dialog-->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import type { Sort } from "@/components/kt-datatable/table-partials/models";
import ApiService from "@/core/services/ApiService";
import { ElMessage, ElMessageBox } from 'element-plus'

// validate
import { hideModal } from "@/core/helpers/dom";
import { ErrorMessage, Field, Form as VForm } from "vee-validate";
import Fillter from "@/views/apps/account_leaks/filterAccountLeak.vue";
import importAccountLeak from "@/views/apps/account_leaks/components/importButton.vue";
type ImportAccountLeakType = typeof importAccountLeak;
import * as Yup from "yup";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { Delete } from '@element-plus/icons-vue'
import { markRaw } from 'vue'
import { Modal } from "bootstrap";

const importComponentRef = ref<null | ImportAccountLeakType>(null);

const accountLeakList = ref<object | any>([]);
interface APIData {
  email: string;
  username: string;
  password_hash: string;
  password_crack: string;
  source_data: string;
  country_id: String;
  is_ok: boolean;
}
const headerConfig = ref([
  {
    columnName: "ID",
    columnLabel: "id",
    sortEnabled: true,
  },
  {
    columnName: "Username",
    columnLabel: "username",
    columnWidth: 100,
  },
  {
    columnName: "Email",
    columnLabel: "email",
    columnWidth: 100,
  },
  {
    columnName: "Password Hash",
    columnLabel: "password_hash",
    columnWidth: 100,
  },
  {
    columnName: "Password Crack",
    columnLabel: "password_crack",
    columnWidth: 120,
  },
  {
    columnName: "Nguồn dữ liệu",
    columnLabel: "source_data",
    columnWidth: 120,
  },
  {
    columnName: "Quốc gia",
    columnLabel: "country",
    columnWidth: 120,
  },
  {
    columnName: "Hành động",
    columnLabel: "actions",
    columnWidth: 50,
  },
]);

const totalPage = ref<number>(0);
const currentPage = ref<number>(1);
const itemsPerPage = ref<number>(20);
const query = ref<String>("");
const orderingID = ref<String>("");
const typeModal = ref<String>("");
const id = ref<number>(0);
const nameType = ref<string>("");
const search_country = ref<String>('');
const apiData = ref<APIData>({
  email: "",
  username: "",
  password_hash: "",
  password_crack: "",
  source_data: "",
  country_id: "",
  is_ok: false,
});

const errors = reactive({
  username: "",
  email: "",
  password_hash: "",
  password_crack: "",
  source_data: "",
  country_id: "",
  country: "",
  detail: "",
});
const detailData = reactive({
  id: "",
  email: "",
  password_hash: "",
  password_crack: "",
  source_data: "",
  country: "",
  country_id: "",
  hash_type: [],
  username: "",
  is_ok: false,
  modified_at: "",
  created_at: "",
});

interface CountryItem {
  id: number;
  name: string;
}
interface CountryList extends Array<CountryItem> { }

const discardButtonRef = ref<HTMLElement | null>(null);
const ModalDetail = ref<null | HTMLElement>(null);
const loading = ref<boolean>(false);
const countryList = ref<CountryList>([
  {
    id: 0,
    name: "Khác",
  },
]);
const getCountryList = () => {
  return ApiService.get("/countries")
    .then(({ data }) => {
      countryList.value = data;
    })
    .catch(({ response }) => {
      notification(
        response.data.detail,
        "error",
        "Không tải được danh sách quốc gia",
      );
    });
};
// Khai báo header
const resetForm = () => {
  apiData.value.country_id = "";
  apiData.value.is_ok = false;
}
const handleClick = (data: object | any, type: String) => {
  typeModal.value = type;
  for (let key in errors) {
    errors[key] = "";
  }
  resetForm()
  if (Object.keys(data).length != 0 && type === "edit") {
    nameType.value = "Chỉnh sửa tài khoản rò rỉ";
    apiData.value.email = data.email;
    apiData.value.username = data.username;
    apiData.value.password_hash = data.password_hash;
    apiData.value.password_crack = data.password_crack;
    apiData.value.source_data = data.source_data;
    apiData.value.country_id = data.country_id == 0 ? '0' : data.country_id;
    apiData.value.is_ok = data.is_ok;
    id.value = data.id;
  } else {
    nameType.value = "Thêm tài khoản rò rỉ mới";
    // apiData.value.email = "";
    // apiData.value.username = "";
    // apiData.value.password_hash = "";
    // apiData.value.password_crack = "";
    // apiData.value.source_data = "";

    if (discardButtonRef.value !== null) {
      discardButtonRef.value.click();
    }
    // resetData();
  }
};

// const resetData = () => {
//   apiData.value.username = '';
//   apiData.value.password_hash = '';
//   id.value = 0;
// }

const handlePage = (page: number) => {
  currentPage.value = page ?? 1;
  getData();
};

const truncateText = (text: string, maxLength: number) => {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
};

const handlePerPage = (itemsPage: number) => {
  currentPage.value = 1;
  itemsPerPage.value = itemsPage ?? 20;
  getData();
};

const getData = () => {
  loading.value = true;
  return ApiService.get(
    `account-leak/index?search=${query.value}&country_id=${search_country.value}&page=${currentPage.value}&page_size=${itemsPerPage.value}&ordering=${orderingID.value}`,
  )
    .then(({ data }) => {
      accountLeakList.value = data.results;
      totalPage.value = data.count;
    })
    .catch(({ response }) => {
      notification(response.data.detail, "error", "Có lỗi xảy ra");
    })
    .finally(() => {
      loading.value = false
    });
};

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

const removeErrorMsgText = () => {
  errors.username = "";
  errors.email = "";
  errors.password_crack = "";
  errors.password_hash = "";
};
const disabled = ref<boolean>(false);


const deleteSubscription = (ids: Array<number>) => {
  let formData = {
    id: ids,
  };
  if (ids) {
    disabled.value = true
    setTimeout(() => {
      disabled.value = false
    }, 1000);
    return ApiService.post(`account-leak/delete`, formData)
      .then(({ data }) => {
        notification(data.detail, "success", "Xóa thành công");
        currentPage.value = 1;
        selectedIds.value.length = 0;
        getData();
      })
      .catch(({ response }) => {
        notification(response.data.detail, "error", "Có lỗi xảy ra");
      });
  }
};

const sort = (sort: Sort) => {
  if (sort.label) {
    orderingID.value =
      sort.order === "asc" ? `${sort.label}` : `-${sort.label}`;
  }
  getData();
};
const customRowTable = (detail: any) => {
  if (detail) {
    detailData.id = detail.id;
    detailData.email = detail.email;
    detailData.username = detail.username;
    detailData.password_hash = detail.password_hash;
    detailData.hash_type = detail.hash_type;
    detailData.password_crack = detail.password_crack;
    detailData.source_data = detail.source_data;
    detailData.country = detail.country;
    detailData.country_id = detail.country_id;
    detailData.is_ok = detail.is_ok;
    detailData.modified_at = detail.modified_at;
    detailData.created_at = detail.created_at;
    const modal = new Modal(
      document.getElementById("kt_modal_detail") as Element,
    );
    modal.show();
  } else {
    notification("", "error", "Có lỗi xảy ra");
  }
};

const onItemSelect = (selectedItems: Array<number>) => {
  selectedIds.value = selectedItems;
};

// validate start
const submitButtonRef = ref<null | HTMLButtonElement>(null);
const modalRef = ref<null | HTMLElement>(null);
const newTargetGroupModalRef = ref<null | HTMLElement>(null);
const usernameMatchingPattern = /[0-9a-zA-Z]+$/;

const validationSchema = Yup.object().shape({
  username: Yup.mixed().test('required', 'Hãy điền vào Email hoặc Username', function (value) {
    const { email } = this.parent;
    return !!value || !!email;
  }),
  email: Yup.string().nullable(),
  password_hash: Yup.mixed().test('required', 'Hãy điền vào Password Hash hoặc Password Crack', function (value) {
    const { password_crack } = this.parent;
    return !!value || !!password_crack;
  }),
  password_crack: Yup.string().nullable(),
});


// field: email, username, password, password_hash, source_data, country

const notification = (values: string, icon: string, more: string = '', hideImportModal: boolean = true) => {
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
    if (importComponentRef.value && hideImportModal) {
      importComponentRef.value.closeModal()
    }
  });
};

const comfirmDownload = (values: string, icon: string) => {
  ElMessageBox.confirm(
    values,
    icon,
    {
      confirmButtonText: 'Tải File Lỗi',
      cancelButtonText: 'Hủy Bỏ',
      type: 'error',
    }
  )
    .then(() => {
      downloadFile()
      if (importComponentRef.value) {
        importComponentRef.value.closeModal()
      }
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Hủy bỏ lệnh',
      })
    })

};
const downloadFile = async () => {
  try {
    const response = await ApiService.query(`account-leak/import`, {
      responseType: 'blob'
    })

    const fileData = response.data;
    const fileBlob = new Blob([fileData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const fileUrl = URL.createObjectURL(fileBlob);

    const link = document.createElement('a');
    link.href = fileUrl;
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const day = now.getDate();
    const month = now.getMonth() + 1; // Tháng bắt đầu từ 0, nên cần +1
    const year = now.getFullYear();
    link.download = `chi_tiết_lỗi_${hours}h${minutes}p_${day}-${month}-${year}.xlsx`;
    link.click();

    // Giải phóng đường dẫn URL sau khi hoàn thành
    URL.revokeObjectURL(fileUrl);
  } catch (error: any) {
    notification(error.detail ?? 'Lỗi khi tải file', 'error')
    console.error('Lỗi khi tải file:', error);
  }
}

const submit = async () => {
  if (!submitButtonRef.value) {
    return;
  }
  let formData = {
    username: apiData.value.username,
    email: apiData.value.email ?? "",
    password_hash: apiData.value.password_hash,
    password_crack: apiData.value.password_crack,
    source_data: apiData.value.source_data,
    country_id: apiData.value.country_id,
  };
  if (typeModal.value == "edit") {
    formData["is_ok"] = apiData.value.is_ok;
  }
  if (typeModal.value == "add") {
    return ApiService.post("account-leak/create", formData)
      .then(({ data }) => {
        notification(data.detail, "success", "Thêm mới thành công");
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
        if (response?.data) {

          errors.username = response.data.username;
          errors.email = response.data.email;
          errors.password_hash = response.data.password_hash;
          errors.password_crack = response.data.password_crack;
          errors.source_data = response.data.source_data;
          errors.country_id = response.data.country_id;
          errors.detail = response.data.detail;
        } else {
          notification(response?.data?.detail, "error", "Có lỗi xảy ra");
        }
      });
  } else {
    return ApiService.put(`/account-leak/${id.value}/update/`, formData)
      .then(({ data }) => {
        notification(
          data.detail,
          "success",
          "Thao tác thực hiện thành công",
        );
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
          errors.username = response.data.username;
          errors.email = response.data.email;
          errors.password_hash = response.data.password_hash;
          errors.password_crack = response.data.password_crack;
          errors.source_data = response.data.source_data;
          errors.country = response.data.country;
          errors.detail = response.data.detail;
        } else {
          notification(response.data.detail, "error", "Có lỗi xảy ra");
        }
      });
  }
};

const formatDate = (date: string) => {
  return date ? date : '--:--'
};

const handleFilter = (data: any) => {
  if (data) {
    query.value = data.query;
    search_country.value = data.type;
    currentPage.value = 1;
    getData();
  } else {
    notification("Có lỗi với filter", "error", "Có lỗi xảy ra");
  }
};

onMounted(() => {
  getData();
  getCountryList();
});
</script>
