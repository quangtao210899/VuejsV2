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
        <!--begin::Input group-->
        <div class="mb-7">
          <!--begin::Label-->
          <label class="form-label fw-semobold">Trạng thái:</label>
          <!--end::Label-->
  
          <!--begin::Input-->
          <div>
            <select
              class="form-select form-select-solid select2-hidden-accessible form-check-select h-40px w-100 py-2"
              v-model="data.status"
            >
              <option label="Chọn trạng thái" value="">Chọn trạng thái</option>
              <option label="open" value="open">Open</option>
              <option label="re-open" value="re-open">Reopen</option>
              <option label="closed" value="closed">Close</option>
              <option label="rick-accepted" value="rick-accepted">Accepted</option>
            </select>
          </div>
          <!--end::Input-->
        </div>
        <!--end::Input group-->


        <!--begin::Input group-->
          <div class="mb-7">
          <!--begin::Label-->
          <label class="form-label fw-semobold">Mức độ lỗ hổng:</label>
          <!--end::Label-->
  
          <!--begin::Input-->
          <div>
            <select
              class="form-select form-select-solid select2-hidden-accessible form-check-select h-40px w-100 py-2"
              v-model="data.severity"
            >
              <option label="Chọn lỗ hổng" value="">Chọn lỗ hổng</option>
              <option label="Info" value="0">Info</option>
              <option label="Low" value="1">Low</option>
              <option label="Medium" value="2">Medium</option>
              <option label="High" value="3">High</option>
            </select>
          </div>
          <!--end::Input-->
        </div>
        <!--end::Input group-->


        <!--begin::Input group-->
        <div class="mb-7">
          <!--begin::Label-->
          <label class="form-label fw-semobold">IP:</label>
          <!--end::Label-->
  
          <!--begin::Input-->
          
          <div class="row">
            <div class="col-8 pe-0">
              <input type="text" class="form-control form-check-input h-40px w-100 form-control-solid " placeholder="Nhập IP" v-model="data.ip" />
            </div>
            <div class="col-4 ">
              <select
              class="form-select form-select-solid form-check-select h-40px w-100 select2-hidden-accessible py-2"
              v-model="data.typeIp"
            >
              <option label="Equal" value="equal">Equal</option>
              <option label="NContains" value="not_contains">NContains</option>
              <option label="Contains" value="contains">Contains</option>
            </select>
            </div>
          </div>
          <!--end::Input-->
        </div>
        <!--end::Input group-->


         <!--begin::Input group-->
         <div class="mb-7">
          <!--begin::Label-->
          <label class="form-label fw-semobold">Domain:</label>
          <!--end::Label-->
  
          <!--begin::Input-->
          
          <div class="row">
            <div class="col-8 pe-0">
              <input type="text" class="form-control form-check-input h-40px w-100 form-control-solid" placeholder="Nhập IP" v-model="data.domain"/>
            </div>
            <div class="col-4 ">
              <select
              class="form-select form-select-solid form-check-select h-40px w-100 select2-hidden-accessible py-2"
              v-model="data.typeDomain"
            >
              <option label="Equal" value="equal">Equal</option>
              <option label="NContains" value="not_contains">NContains</option>
              <option label="Contains" value="contains">Contains</option>
            </select>
            </div>
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
import { defineComponent, ref  } from "vue";

  interface Filter {
    status: string | null;
    severity: string | null;
    ip: string | null;
    typeIp: string | null;
    domain: string | null;
    typeDomain: string | null;
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
        status: '',
        severity: '',
        ip: '',
        typeIp: 'equal',
        domain: '',
        typeDomain: 'equal',
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
        data.value.status = '';
        data.value.severity = '';
        data.value.ip = '';
        data.value.typeIp = 'equal';
        data.value.domain = '';
        data.value.typeDomain = 'equal';
      };

  
      return {
        data,
        submit,
        reset,
      };
    },
  });
  </script>
  