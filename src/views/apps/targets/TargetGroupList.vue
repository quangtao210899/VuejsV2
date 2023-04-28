<template>
  <!--begin::Card-->
  <div class="card">
    <!--begin::Card header-->
    <div class="card-header border-0 pt-6">
      <!--begin::Card title-->
      <div class="card-title">
        <!--begin::Search-->
        <div class="d-flex align-items-center position-relative my-1">
          <KTIcon icon-name="magnifier" icon-class="fs-1 position-absolute ms-6" />
          <input type="text" data-kt-subscription-table-filter="search" :value="query" @input="setQuery"
            class="form-control form-control-solid w-250px ps-14" placeholder="Search Subscriptions" v-debounce:1000ms="getData" />
        </div>
        <!--end::Search-->
      </div>
      <!--begin::Card title-->

      <!--begin::Card toolbar-->
      <div class="card-toolbar">
        <!--begin::Toolbar-->
        <div v-if="selectedIds.length === 0" class="d-flex justify-content-end" data-kt-subscription-table-toolbar="base">
          <!--begin::Export-->
          <!-- <button type="button" class="btn btn-light-primary me-3" data-bs-toggle="modal"
            data-bs-target="#kt_subscriptions_export_modal">
            <KTIcon icon-name="exit-up" icon-class="fs-2" />
            Export
          </button> -->
          <!--end::Export-->

          <!--begin::Add subscription-->
          <button type="button" class="btn btn-sm fw-bold btn-primary" data-bs-toggle="modal"
            data-bs-target="#kt_modal_new_target_group"  @click.passive="handleClick({},'add')">
            <KTIcon icon-name="plus" icon-class="fs-2" />
            Add New
          </button>
          <!--end::Add subscription-->
        </div>
        <!--end::Toolbar-->

        <!--begin::Group actions-->
        <div v-else class="d-flex justify-content-end align-items-center">
          <div class="fw-bold me-5">
            <span class="me-2">{{ selectedIds.length }}</span>Selected
          </div>
          <button type="button"  data-bs-target="#kt_modal_delete" data-bs-toggle="modal" class="btn btn-danger">
            Delete Selected
          </button>
        </div>
        <!--end::Group actions-->
      </div>
      <!--end::Card toolbar-->
    </div>
    <!--end::Card header-->

    <!--begin::Card body-->
    <div class="card-body pt-0">
      <KTDatatable @on-sort="sort" @on-items-select="onItemSelect" :data="list" :header="headerConfig"
        :checkbox-enabled="true" :itemsPerPage="itemsPerPage" :total="totalPage" :currentPage="currentPage" 
        @page-change="handlePage"  @on-items-per-page-change="handlePerPage" >
        <template v-slot:id="{ row: customer }">{{ customer.id }}</template>
        <template v-slot:title="{ row: customer }">{{ customer.title }}</template>
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
          <!-- <a href="#" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1">
            <KTIcon icon-name="switch" icon-class="fs-3" />
          </a> -->
          <button type="button" class="btn btn-icon btn-bg-light btn-active-color-warning btn-sm me-1" data-bs-toggle="modal"
            data-bs-target="#kt_modal_new_target_group"  @click="handleClick(customer, 'edit')">
            <KTIcon icon-name="pencil" icon-class="fs-3" />
          </button>

        </template>
      </KTDatatable>
    </div>
    <!--end::Card body-->
  </div>
  <!--end::Card-->


  <!-- modal  -->
  <div class="modal fade" tabindex="-1" id="kt_modal_new_target_group"    
    ref="newTargetGroupModalRef" aria-hidden="true">
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
          <div
            class="btn btn-sm btn-icon btn-active-color-primary"
            data-bs-dismiss="modal"
          >
            <KTIcon icon-name="cross" icon-class="fs-1" />
          </div>
          <!--end::Close-->
        </div>
        <!--end::Modal header-->

        <!--begin::Form-->
        <VForm
          id="kt_modal_new_target_group_form"
          class="form"
          @submit="submit"
          :validation-schema="validationSchema"
        >
          <!--begin::Modal body-->
          <div class="modal-body py-10 px-lg-17">
            <!--begin::Scroll-->
            <div
              class="scroll-y me-n7 pe-7"
              id="kt_modal_new_target_group_scroll"
              data-kt-scroll="true"
              data-kt-scroll-activate="{default: false, lg: true}"
              data-kt-scroll-max-height="auto"
              data-kt-scroll-dependencies="#kt_modal_new_target_group_header"
              data-kt-scroll-wrappers="#kt_modal_new_target_group_scroll"
              data-kt-scroll-offset="300px"
            >
              <div
                class="notice d-flex bg-light-warning rounded border-warning border border-dashed mb-10 p-6"
              >
                <KTIcon
                  icon-name="information-5"
                  icon-class="fs-2tx text-warning me-4"
                />
                <!--begin::Wrapper-->
                <div class="d-flex flex-stack flex-grow-1">
                  <!--begin::Content-->
                  <div class="fw-semobold">
                    <h4 class="text-gray-800 fw-bold">Please Note!</h4>
                    <div class="fs-6 text-gray-600">
                      Adding new API key may afftect to your
                      <a href="#">Affiliate Income</a>
                    </div>
                  </div>
                  <!--end::Content-->
                </div>
                <!--end::Wrapper-->
              </div>

              <!--begin::Input group-->
              <div class="mb-5 fv-row">
                <!--begin::Label-->
                <label class="d-flex align-items-center fs-6 fw-semobold mb-2">
                <span class="required">Tên nhóm mục tiêu</span>
                <i
                  class="fas fa-exclamation-circle ms-2 fs-7"
                  data-bs-toggle="tooltip"
                  title="Specify a target name for future usage and reference"
                ></i>
              </label>
                <!--end::Label-->

                <!--begin::Input-->
                <Field
                  type="text" 
                  class="form-control form-control-solid"
                  placeholder="Nhập nhóm mục tiêu"
                  name="title"
                  v-model="apiData.title"
                />
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
                <label class="fs-6 fw-semobold mb-2">Mô tả nhóm mục tiêu</label>
                <!--end::Label-->

                <!--begin::Input-->
                <Field
                  as="textarea"
                  class="form-control form-control-solid"
                  rows="5" 
                  name="description"
                  placeholder="Nhập mô tả nhóm mục tiêu"
                  v-model="apiData.description"
                />
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
            <button
              type="reset"
              id="kt_modal_new_target_group_cancel"
              class="btn btn-light me-3"
            >
              Discard
            </button>
            <!--end::Button-->

            <!--begin::Button-->
            <button
              ref="submitButtonRef"
              type="submit"
              id="kt_modal_new_target_group_submit"
              class="btn btn-primary"
            >
              <span class="indicator-label"> Submit </span>
              <span class="indicator-progress">
                Please wait...
                <span
                  class="spinner-border spinner-border-sm align-middle ms-2"
                ></span>
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
<div class="modal fade" tabindex="-1" id="kt_modal_delete"    
    ref="ModalDelete" aria-hidden="true">
    <!--begin::Modal dialog-->
    <div class="modal-dialog modal-dialog-centered">
      <!--begin::Modal content-->
      <div class="modal-content">

        <div class="modal-header">
          <h5 class="modal-title">Xác nhận xóa recon</h5>

          <!--begin::Close-->
          <div
            class="btn btn-icon btn-sm btn-active-light-primary ms-2"
            data-bs-dismiss="modal"
            aria-label="Close"
          >
            <span class="svg-icon svg-icon-2x"></span>
          </div>
          <!--end::Close-->
        </div>
        <!--begin::Form-->
        <div class="modal-body">
          <p>Bạn có chắc chắn muốn xóa <span v-if="selectedIds.length > 0" class="fw-bold">{{ selectedIds.length }} </span> bản ghi này không?.</p>
        </div>
        <!--end::Form-->
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-light"
            data-bs-dismiss="modal"
          >
            Hủy bỏ
          </button>
          <button type="button" class="btn btn-primary" @click.passive="deleteFewSubscriptions()">
            Đồng ý
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
import { useField,useForm, ErrorMessage, Field, Form  as VForm } from "vee-validate";
import { vue3Debounce } from 'vue-debounce'

import * as Yup from "yup";
import Swal from "sweetalert2/dist/sweetalert2.js";

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
  },
  directives: {
      debounce: vue3Debounce({ lock: true })
  },
  setup() {
    const list = ref([])
    const totalPage = ref<number>(0)
    // const testPage = ref<number>(0)
    const currentPage = ref<number>(1)
    const itemsPerPage = ref<number>(20)
    const query = ref<String>('')
    const orderingID = ref<String>('')
    const orderingTarget = ref<String>('')
    const orderingflaw = ref<String>('')
    const orderingServer = ref<String>('')
    const typeModal = ref<String>('')
    const id = ref<number>(0)
    const nameType = ref<string>('')
    const apiData = ref<APIData>({
      title: "",
      description: "",
    });
    const errors = reactive({title: ''});

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
      },
      {
        columnName: "Lỗ hổng",
        columnLabel: "flaw_count",
        sortEnabled: true,
      },
      {
        columnName: "Dịch vụ",
        columnLabel: "service_count",
        sortEnabled: true,
      },
      {
        columnName: "Actions",
        columnLabel: "actions",
      },
    ]);

    const handleClick = (data: Object, type: String) => {
      typeModal.value = type
      errors.title = ''
      if(Object.keys(data).length != 0 && type === 'edit'){
        nameType.value = "Sửa nhóm mục tiêu"
        const obj: object = data; 
        const objForm = obj as {id: number, title: string , description: string  }; 
        apiData.value.title = objForm.title;
        apiData.value.description = objForm.description;
        id.value = objForm.id;
      }else{
        nameType.value = "Thêm Mới nhóm mục tiêu"
        resetData();
      }
    };

    const resetData = () => {
      apiData.value.title = '';
      apiData.value.description = '';
      id.value = 0;
    }

    const handlePage = (page: number) => {
      currentPage.value = page ?? 1;
      getData();
    };

    const handlePerPage = (itemsPage: number) => {
      itemsPerPage.value = itemsPage ?? 20;
      getData();
    };

    const getData = () => {
      return ApiService.get(`targetgroup/index?search=${query.value}&page=${currentPage.value}&page_size=${itemsPerPage.value}&orderingTarget=${orderingTarget.value}&orderingID=${orderingID.value}&orderingServer=${orderingServer.value}&orderingflaw=${orderingflaw.value}`)
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
      if(ids){
        return ApiService.delete(`targetgroup/${ids}`)
          .then(({ data }) => {
            notification(data.detail, 'success', 'Xóa thành công')
            selectedIds.value.length = 0;
            getData();
          })
          .catch(({ response }) => {
            notification(response.data.detail, 'error', 'Có lỗi xảy ra')
          });
      }
    };

    const sort = (sort: Sort) => {
      if(sort.label){
        orderingID.value = (sort.order === "asc") ? `${sort.label}` : `-${sort.label}` ;
      }
      getData();
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
      .matches(PatternTargetGroup, 'Tên nhóm không được chứa chữ số và ký tự đặc biệt')
      .min(3, 'tối thiểu 3 kí tự')
      .required('Vui lòng nhập tên')
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
        hideModal( ModalDelete.value);
      });
    }

    const submit = () => {
      if (!submitButtonRef.value) {
        return;
      }
      //Disable button
      submitButtonRef.value.disabled = true;
      // Activate indicator
      submitButtonRef.value.setAttribute("data-kt-indicator", "on");

      setTimeout(() => {
        if (submitButtonRef.value) {
          submitButtonRef.value.disabled = false;
          submitButtonRef.value?.removeAttribute("data-kt-indicator");
        }
        let formData = {
          'title': apiData.value.title,
          'description': apiData.value.description
        }
        if(typeModal.value == 'add'){
          return ApiService.post("/targetgroup", formData)
            .then(({ data }) => {
              notification(data.detail,'success','Thêm mới thành công')
              getData();
            })
            .catch(({ response }) => {
              if(response.data){
                errors.title = response.data.title;
              }else{
                notification(response.data.detail, 'error', 'Có lỗi xảy ra')
              }
            });
        }else{
          return ApiService.put(`/targetgroup/${id.value}`, formData)
            .then(({ data }) => {
              notification(data.detail, 'success', 'Sửa mới thành công')
              getData();
            })
            .catch(({ response }) => {
              if(response.data){
                errors.title = response.data.title;
              }else{
                notification(response.data.detail, 'error', 'Có lỗi xảy ra')
              }
            });
        }
      }, 1000);
    };

    // end validate

    // tìm kiếm
    const setQuery = (event) => {
      query.value = event.target.value
      currentPage.value = 1
    }

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

      // page 
      itemsPerPage,
      totalPage,
      currentPage,
      handlePage,
      handlePerPage,

      // search query 
      query,
      setQuery,

      // edit 
      nameType,
    };
  },
});
</script>