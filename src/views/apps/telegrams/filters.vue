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

        <!--begin::Input group-->
        <div class="mb-7">
          <!--begin::Label-->
          <label class="form-label fw-semobold">Chọn kiểu:</label>
          <!--end::Label-->
  
          <!--begin::Input-->
          <div>
            <select
              class="form-select form-select-solid select2-hidden-accessible form-check-select h-40px w-100 py-2"
              v-model="data.type"
            >
              <option label="Chọn kiểu" value="">Chọn kiểu</option>
              <option label="DB Leak" value="1">DB Leak</option>
              <option label="Hacker News" value="2">Hacker News</option>
            </select>
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
    </div>
      <!--end::Form-->
    </div>
    <!--end::Menu 1-->
  </template>
  
  <script lang="ts">
import { defineComponent, ref  } from "vue";

  interface Filter {
    type: string | null;
    query: string | null;

  }
  
  export default defineComponent({
    name: "filter-scan",
    // props: {
    //   status: { type: String , required: false },
    //   severity: { type: Number, required: false },
    //   ip: { type: String, required: false },
    //   typeIp: { type: String, default: 'equal' },
    //   domain: { type: String, required: false },
    //   typeDomain: { type: String, default: 'equal' }
    // },
    components: {},
    emits: [
      "filter-data"
    ],
    setup(props, { emit }) {
      const data = ref<Filter>({
        type: '',
        query: '',
      });

      // watch(
      //   data.value,
      //   (data) => {
      //     emit("on-items-per-page-change", data);
      //     console.log(data, '123')
      //   }
      // );

      // const emit = defineEmits(['filter-data'])

      const submit = async () => {
        emit("filter-data", data.value);
      };

      const reset = () => {
        data.value.type = '';
        data.value.query = '';
      };

  
      return {
        data,
        submit,
        reset,
      };
    },
  });
  </script>
  