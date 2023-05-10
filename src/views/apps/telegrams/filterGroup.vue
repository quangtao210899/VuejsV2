<template>
    <!--begin::Menu 1-->
    <div
      class="menu menu-sub menu-sub-dropdown w-250px w-md-350px"
      data-kt-menu="true"
    >
      <!--begin::Header-->
      <div class="px-7 py-5">
        <div class="fs-5 text-dark fw-bold">Filter Options</div>
      </div>
      <!--end::Header-->
  
      <!--begin::Menu separator-->
      <div class="separator border-gray-200"></div>
      <!--end::Menu separator-->
  
      <!--begin::Form-->
      <div class="px-7 py-5">

        <div class="mb-7">
          <!--begin::Label-->
          <label class="form-label fw-semobold">Tìm kiếm:</label>
          <!--end::Label-->
  
          <!--begin::Input-->
          <div class="d-flex align-items-center position-relative my-1">
          <KTIcon icon-name="magnifier" icon-class="fs-1 position-absolute ms-6" />
          <input type="text" data-kt-subscription-table-filter="search" v-model="data.query"
            class="form-control form-control-solid w-100 ps-14" placeholder="Search Subscriptions" />
          </div>

        </div>

        <!--begin::Input group-->
        <div class="mb-7">
          <!--begin::Label-->
          <label class="form-label fw-semobold">Chọn kiểu:</label>
          <!--end::Label-->
  
          <!--begin::Input-->
          <div>
            <Multiselect class="bg-light multiselect-blue text-gray-600"
              v-model="data.type"
              :options="{'':'Chọn kiểu','1':'DB Leak','2':'Hacker News' }"
              locale="de"
              fallback-locale="en"
            />
          </div>
          <!--end::Input-->
          
        </div>
        <!--end::Input group-->

        
        <!--begin::Input group-->
        <div class="mb-7">
          <!--begin::Label-->
          <label class="form-label fw-semobold">Trạng thái:</label>
          <!--end::Label-->
  
          <!--begin::Input-->
          <div>
            <Multiselect class="bg-light multiselect-blue text-gray-600"
              v-model="data.status"
              :options="options"
              locale="de"
              fallback-locale="en"
            />

          </div>
          <!--end::Input-->
          
        </div>
        <!--end::Input group-->

  
        <div class="separator my-2"></div>

        <!--begin::Actions-->
        <div class="d-flex justify-content-end">
          <button
          @click="reset"
            type="reset"
            class="btn btn-sm btn-outline btn-outline-dashed btn-outline-info  me-2"
          >
            Reset
          </button>
  
          <button
            @click="submit"
            type="submit"
            class="btn btn-sm btn-primary"
            data-kt-menu-dismiss="true"
          >
            Apply
          </button>
        </div>
        <!--end::Actions-->
      </div>
      <!--end::Form-->
    </div>
    <!--end::Menu 1-->
  </template>
  
  <script lang="ts">
import { defineComponent, watch ,ref  } from "vue";
import Multiselect from '@vueform/multiselect'

  interface Filter {
    type: string | null;
    query: string | null;
    status: string | null;
  }
  
  export default defineComponent({
    name: "filter-scan",
    components: {
      Multiselect,
    },
    emits: [
      "filter-data"
    ],
    setup(props, { emit }) {
      const options = ref<object>({
        '':'Chọn trạng thái',
        '0':'Có thể đồng bộ',
        '1':'không đồng bộ'
      });

      const data = ref<Filter>({
        type: '',
        query: '',
        status: '',
      });

      watch(
        data.value,
        (data) => {
          console.log(data, '123')
        }
      );

      const submit = async () => {
        emit("filter-data", data.value);
      };

      const reset = () => {
        data.value.type = '';
        data.value.query = '';
        data.value.status = '';
      };

  
      return {
        data,
        options,
        submit,
        reset,
      };
    },
  });
  </script>

  <style>

.multiselect-blue .multiselect-option.is-selected {
  background: #e6f7ff !important;
  font-weight: 500;
}

.multiselect-blue .multiselect-option{
  color: #5e6278;
  font-size: 14px;
  /* box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px; */
}

.multiselect>* {
    font-size: 14px !important;
}
</style>
  