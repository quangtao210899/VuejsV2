<template>
  <!--begin::Card-->
  <div class="card h-100 d-block">
    <!--begin::Card header-->
    <div class="card-header border-0 pt-10 pt-sm-10 pt-lg-6 position-absolute end-0 pe-1 " style="top: -80px;">
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
            <el-tooltip class="box-item" effect="dark" hide-after="0" content="Tìm kiếm" placement="top">
              <button type="button" class="btn btn-sm fw-bold bg-body btn-color-gray-700 btn-active-color-primary me-2"
                data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end" data-kt-menu-flip="top-end">
                <KTIcon icon-name="filter" icon-class="fs-2" />
                Filter
              </button>
            </el-tooltip>
            <Fillter @filterData="handleFilter"></Fillter>
            <!--end::Export-->

            <!--begin::Add subscription-->
            <el-tooltip class="box-item" effect="dark" hide-after="0" content="Thêm mới" placement="top">
              <button type="button" class="btn btn-sm fw-bold btn-primary" data-bs-toggle="modal"
                data-bs-target="#kt_modal_new_target_group" @click.passive="handleClick({}, 'add')">
                <KTIcon icon-name="plus" icon-class="fs-2" />
                Thêm
              </button>
            </el-tooltip>
            <!--end::Add subscription-->
          </div>
          <!--end::Toolbar-->
        </div>
        <div v-show="selectedIds.length !== 0">
          <!--begin::Group actions-->
          <div class="d-flex justify-content-end align-items-center">
            <div class="fw-bold me-5">
              <span class="me-2">{{ selectedIds.length }}</span>Selected
            </div>
            <el-tooltip class="box-item" effect="dark" hide-after="0" content="Xóa" placement="top">
              <button type="button" @click="deleteSelectd()"
                class="btn btn-sm  btn-danger">
                Xóa mục đã chọn
              </button>
            </el-tooltip>
          </div>
          <!--end::Group actions-->
        </div>
      </div>
      <!--end::Card toolbar-->
    </div>
    <!--end::Card header-->

    <!--begin::Card body-->
    <div class="card-body pt-0  overflow-y-auto overflow-x-auto h-100 p-0 m-0">
      <KTDatatable @on-sort="sort" @on-items-select="onItemSelect" :data="list" :header="headerConfig" :loading="loading"
        :checkbox-enabled="true" :itemsPerPage="itemsPerPage" :total="totalPage" :currentPage="currentPage"
        @page-change="handlePage" @on-items-per-page-change="handlePerPage" @customRow="customRowTable">

        <!-- <template v-slot:customRow="{ row: customer }">
          <span v-if="customer.id">{{ customer.id }}</span>
          <span v-if="customer.title">{{ customer.title }}</span>
        </template> -->

        <template v-slot:id="{ row: customer }">{{ customer.id }}</template>
        <template v-slot:title="{ row: customer }"><span class="fs-6 fw-bold text-dark text-hover-primary">{{
          customer.title }}</span></template>
        <template v-slot:target_count="{ row: customer }">
          <div class="badge badge-light">{{ customer.target_count ?? 0 }}</div>
        </template>
        <template v-slot:flaw_count="{ row: customer }">
          <div class="badge badge-light">{{ customer.flaw_count ?? 0 }}</div>
        </template>
        <template v-slot:service_count="{ row: customer }">
          <div class="badge badge-light">{{ customer.service_count ?? 0 }}</div>
        </template>
        <template v-slot:actions="{ row: customer }">
          <el-tooltip class="box-item" effect="dark" hide-after="0" content="Chỉnh sửa" placement="top">
            <button type="button" class="btn btn-icon btn-bg-light btn-active-color-warning btn-sm me-1"
              data-bs-toggle="modal" data-bs-target="#kt_modal_new_target_group" @click="handleClick(customer, 'edit')"
              title="Sửa">
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
        <VForm id="kt_modal_new_target_group_form" class="form" @submit="submit" :validation-schema="validationSchema">
          <!--begin::Modal body-->
          <div class="modal-body py-10 px-lg-17">
            <!--begin::Scroll-->
            <div class="scroll-y me-n7 pe-7" id="kt_modal_new_target_group_scroll" data-kt-scroll="true"
              data-kt-scroll-activate="{default: false, lg: true}" data-kt-scroll-max-height="auto"
              data-kt-scroll-dependencies="#kt_modal_new_target_group_header"
              data-kt-scroll-wrappers="#kt_modal_new_target_group_scroll" data-kt-scroll-offset="300px">
              <!--begin::Input group-->
              <div class="mb-5 fv-row">
                <!--begin::Label-->
                <label for="title" class="d-flex align-items-center fs-6 fw-semobold mb-2">
                  <span class="required">Tên nhóm mục tiêu</span>
                  <i class="fas fa-exclamation-circle ms-2 fs-7" data-bs-toggle="tooltip" title="Bắt buộc phải nhập"></i>
                </label>
                <!--end::Label-->
                <!--begin::Input-->
                <Field type="text" class="form-control form-control-solid" placeholder="Nhập nhóm mục tiêu" id="title" name="title"
                  v-model="apiData.title" />
                <div class="fv-plugins-message-container">
                  <div class="fv-help-block">
                    <ErrorMessage name="title" />
                    <span class="" v-if="errors.title">{{ errors.title[0] }}</span>
                  </div>
                </div>
                <!--end::Input-->
              </div>
              <!--end::Input group-->

              <!--begin::Input group-->
              <div class="d-flex flex-column mb-5 fv-row">
                <!--begin::Label-->
                <label for="description" class="fs-6 fw-semobold mb-2">Mô tả nhóm mục tiêu</label>
                <!--end::Label-->

                <!--begin::Input-->
                <Field as="textarea" class="form-control form-control-solid" rows="5" id="description" name="description"
                  placeholder="Nhập mô tả nhóm mục tiêu" v-model="apiData.description" />
                <div class="fv-plugins-message-container">
                  <div class="fv-help-block">
                    <ErrorMessage name="description" />
                  </div>
                </div>
                <!--end::Input-->
              </div>
              <!--end::Input group-->
            </div>
            <!--end::Scroll-->
          </div>
          <!--end::Modal body-->

          <!--begin::Modal footer-->
          <div class="modal-footer flex-center">
            <!--begin::Button-->
            <button ref="discardButtonRef" type="reset" id="kt_modal_new_target_group_cancel"
              class="btn btn-sm  btn-light me-3">
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
                <h1 class="fw-bold">{{ detailData.title }}</h1>
              </div>
              <!--begin::Card toolbar-->
              <div class="card-toolbar">
                <button type="button" class="btn btn-light-warning btn-sm me-1" data-bs-toggle="modal"
                  data-bs-target="#kt_modal_new_target_group" @click="handleClick(detailData, 'edit')">
                  <KTIcon icon-name="pencil" icon-class="fs-3" /> Cập nhật
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
                <h5>Thông tin chi tiết:</h5>
                <!--end::Title-->
                <!--begin::Details-->
                <div class="d-flex flex-wrap py-5">
                  <!--begin::Row-->
                  <div class="flex-equal me-5">
                    <!--begin::Details-->
                    <table class="table fs-6 fw-semobold gs-0 gy-2 gx-2 m-0">
                      <!--begin::Row-->
                      <tr>
                        <td class="text-gray-400">Số mục tiêu:</td>
                        <td class="text-gray-800 badge badge-light pe-2">{{ detailData.target_count ?? 0 }} </td>
                      </tr>
                      <!--end::Row-->

                      <!--begin::Row-->
                      <tr>
                        <td class="text-gray-400">Số lỗ hổng:</td>
                        <td class="text-gray-800  badge badge-light pe-2">{{ detailData.flaw_count ?? 0 }}</td>
                      </tr>
                      <!--end::Row-->
                      <!--begin::Row-->
                      <tr>
                        <td class="text-gray-400">Số dịch vụ:</td>
                        <td class="text-gray-800 badge badge-light pe-2">{{ detailData.service_count ?? 0 }}</td>
                      </tr>
                      <!--end::Row-->
                      <!--begin::Row-->
                      <tr>
                        <td class="text-gray-400">Ngày tạo:</td>
                        <td class="text-gray-800">{{ detailData.created_at }}</td>
                      </tr>
                      <!--end::Row-->
                      <!--begin::Row-->
                      <tr>
                        <td class="text-gray-400">Ngày cập nhật cuối:</td>
                        <td class="text-gray-800">{{ detailData.modified_at }}</td>
                      </tr>
                      <!--end::Row-->
                    </table>
                    <!--end::Details-->
                    <!--begin::Label-->
                    <label for="description" class="fs-6 fw-semobold mb-2 text-gray-400">Mô tả:</label>
                    <!--end::Label-->
                    <!--begin::Input-->
                    <Field as="textarea" class="form-control form-control-solid" rows="5" id="description" name="description"
                      v-model="detailData.description" disabled  :placeholder="(detailData.description) ? '' : 'Chưa có mô tả'" />
                    <div class="fv-plugins-message-container">
                      <div class="fv-help-block">
                        <ErrorMessage name="description" />
                      </div>
                    </div>
                    <!--end::Input-->
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
import Fillter from "@/views/apps/targets/filters.vue";

import * as Yup from "yup";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import { markRaw } from 'vue'
import { Modal } from "bootstrap";

interface APIData {
  title: string;
  description: string;
}

export default defineComponent({
  name: "kt-target-group-list",

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
    const orderingTarget = ref<String>('');
    const orderingflaw = ref<String>('');
    const orderingServer = ref<String>('');
    const typeModal = ref<String>('');
    const id = ref<number>(0);
    const nameType = ref<string>('');
    const apiData = ref<APIData>({
      title: '',
      description: '',

    });
    const errors = reactive({ title: '' });
    const detailData = reactive({
      id: '',
      title: '',
      description: '',
      modified_at: '',
      service_count: '',
      target_count: '',
      created_at: '',
      flaw_count: '',
    });
    const discardButtonRef = ref<HTMLElement | null>(null);
    const ModalDetail = ref<null | HTMLElement>(null);
    const loading = ref<boolean>(false)
    const disabled = ref<boolean>(false);

    const headerConfig = ref([
      {
        columnName: "ID",
        columnLabel: "id",
        sortEnabled: true,
        // columnWidth: 50,
      },
      {
        columnName: "Nhóm mục tiêu",
        columnLabel: "title",
      },
      {
        columnName: "Mục tiêu",
        columnLabel: "target_count",
        sortEnabled: true,
        columnWidth: 100,
      },
      {
        columnName: "Lỗ hổng",
        columnLabel: "flaw_count",
        sortEnabled: true,
        columnWidth: 100,
      },
      {
        columnName: "Dịch vụ",
        columnLabel: "service_count",
        sortEnabled: true,
        columnWidth: 100,
      },
      {
        columnName: "Actions",
        columnLabel: "actions",
        columnWidth: 50,
      },
    ]);

    const handleClick = (data: object | any, type: String) => {
      typeModal.value = type
      errors.title = ''
      if (Object.keys(data).length != 0 && type === 'edit') {
        nameType.value = "Chỉnh sửa nhóm mục tiêu"
        apiData.value.title = data.title;
        apiData.value.description = data.description;
        id.value = data.id;
      } else {
        nameType.value = "Thêm mới nhóm mục tiêu"
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

    const getData = async () => {
      loading.value = true;
      return ApiService.get(`targetgroup/index?search=${query.value}&page=${currentPage.value}&page_size=${itemsPerPage.value}&orderingTarget=${orderingTarget.value}&orderingID=${orderingID.value}&orderingServer=${orderingServer.value}&orderingflaw=${orderingflaw.value}`)
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

    
    const deleteSubscription = (ids: Array<number>) => {
      if (ids) {
        return ApiService.delete(`targetgroup/${ids}`)
          .then(({ data }) => {
            disabled.value = true
            setTimeout(() => {
              disabled.value = false
            }, 1000);
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
        detailData.title = detail.title
        detailData.description = detail.description
        detailData.modified_at = detail.modified_at
        detailData.service_count = detail.service_count
        detailData.target_count = detail.target_count
        detailData.created_at = detail.created_at
        detailData.flaw_count = detail.flaw_count
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

    const validationSchema = Yup.object().shape({
      title: Yup.string()
        .min(3, 'Tối thiểu 3 kí tự')
        .required('Vui lòng nhập tên')
        .matches(PatternTargetGroup, 'Tên nhóm không được chứa ký tự đặc biệt')
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
        'title': apiData.value.title,
        'description': apiData.value.description
      }
      if (typeModal.value == 'add') {
        return ApiService.post("/targetgroup", formData)
          .then(({ data }) => {
            if (submitButtonRef.value) {
              notification(data.detail, 'success', 'Thêm mới thành công')
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
              getData();
            }
          })
          .catch(({ response }) => {
            if (response.data) {
              errors.title = response.data.title;
            } else {
              notification(response.data.detail, 'error', 'Có lỗi xảy ra')
            }
          });
      } else {
        return ApiService.put(`/targetgroup/${id.value}`, formData)
          .then(({ data }) => {
            if (submitButtonRef.value) {
              notification(data.detail, 'success', 'Sửa mới thành công')
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
              getData();
            }
          })
          .catch(({ response }) => {
            if (response.data) {
              errors.title = response.data.title;
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
      validationSchema,
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
      setQuery,
      handleFilter,

      // edit 
      nameType,
      loading,
      disabled,
    };
  },
});
</script>
