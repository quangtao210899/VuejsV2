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
          <input type="text" data-kt-subscription-table-filter="search"
            class="form-control form-control-solid w-250px ps-14" placeholder="Search Subscriptions" />
        </div>
        <!--end::Search-->
      </div>
      <!--begin::Card title-->

      <!--begin::Card toolbar-->
      <div class="card-toolbar">
        <!--begin::Toolbar-->
        <div v-if="selectedIds.length === 0" class="d-flex justify-content-end" data-kt-subscription-table-toolbar="base">
          <!--begin::Export-->
          <button type="button" class="btn btn-light-primary me-3" data-bs-toggle="modal"
            data-bs-target="#kt_subscriptions_export_modal">
            <KTIcon icon-name="exit-up" icon-class="fs-2" />
            Export
          </button>
          <!--end::Export-->

          <!--begin::Add subscription-->
          <button type="button" class="btn btn-sm fw-bold btn-primary" data-bs-toggle="modal"
            data-bs-target="#kt_modal_new_target_group"  @click="handleClick('add')">
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
          <button type="button" class="btn btn-danger" @click.passive="deleteFewSubscriptions()">
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
        :checkbox-enabled="true" :itemsPerPage="10" :total="28" :currentPage="2">
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
          <a href="#" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1">
            <KTIcon icon-name="switch" icon-class="fs-3" />
          </a>

          <a href="#" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1">
            <KTIcon icon-name="pencil" icon-class="fs-3" />
          </a>

          <a href="#" class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm">
            <KTIcon icon-name="trash" icon-class="fs-3" />
          </a>
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
          <h2>Create API Key</h2>
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
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref, onMounted } from "vue";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import type { Sort } from "@/components/kt-datatable/table-partials/models";
import arraySort from "array-sort";
import ApiService from "@/core/services/ApiService";


// validate
import { hideModal } from "@/core/helpers/dom";
import { ErrorMessage, Field, Form as VForm } from "vee-validate";
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
  setup() {
    const list = ref([])
    const typeModal = ref('')

    const headerConfig = ref([
      {
        columnName: "ID",
        columnLabel: "id",
        sortEnabled: true,
      },
      {
        columnName: "Nhóm mục tiêu",
        columnLabel: "title",
        sortEnabled: true,
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
    function handleClick(type){
      typeModal.value = type
    };
    function getData() {
      return ApiService.get("/targetgroup/index")
        .then(({ data }) => {
          list.value = data.results
          // console.log(list.value)
        })
        .catch(({ response }) => {
          console.log(response)
        });
    }

    const selectedIds = ref<Array<number>>([]);
    const deleteFewSubscriptions = () => {
      selectedIds.value.forEach((item) => {
        deleteSubscription(item);
      });
      selectedIds.value.length = 0;
    };
    const deleteSubscription = (id: number) => {
      for (let i = 0; i < list.value.length; i++) {
        if (list.value[i].id === id) {
          list.value.splice(i, 1);
        }
      }
    };
    const sort = (sort: Sort) => {
      const reverse: boolean = sort.order === "asc";
      if (sort.label) {
        arraySort(list.value, sort.label, { reverse });
      }
    };
    const onItemSelect = (selectedItems: Array<number>) => {
      selectedIds.value = selectedItems;
    };

    // validate start
    const submitButtonRef = ref<null | HTMLButtonElement>(null);
    const modalRef = ref<null | HTMLElement>(null);
    const newTargetGroupModalRef = ref<null | HTMLElement>(null);

    const apiData = ref<APIData>({
      title: "",
      description: "",
    });

    const PatternTargetGroup = /^[ a-zA-Z0-9_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]+$/

    const validationSchema = Yup.object().shape({
      title: Yup.string()
      .matches(PatternTargetGroup, 'Tên nhóm không được chứa chữ số và ký tự đặc biệt')
      .min(3, 'tối thiểu 3 kí tự')
      .required('Vui lòng nhập tên')
    });

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
        if(typeModal.value == 'add'){
          let formData = {
            'title': apiData.value.title,
            'description': apiData.value.description
          }
          return ApiService.post("/targetgroup", formData)
            .then(({ data }) => {
              console.log(data)
              Swal.fire({
                text: data.detail,
                icon: "success",
                buttonsStyling: false,
                confirmButtonText: "Ok, got it!",
                heightAuto: false,
                customClass: {
                  confirmButton: "btn btn-primary",
                },
              }).then(() => {
                hideModal(newTargetGroupModalRef.value);
              });
            })
            .catch(({ response }) => {
              console.log(response)
            });
        }

      }, 2000);
    };

    // end validate

    onMounted(() => {
      getData();
    });

    return {
      list,
      headerConfig,
      sort,
      onItemSelect,
      selectedIds,
      deleteFewSubscriptions,
      deleteSubscription,
      getAssetPath,

      // validate
      apiData,
      validationSchema,
      submit,
      submitButtonRef,
      modalRef,
      newTargetGroupModalRef,
      handleClick,
    };
  },
});
</script>


