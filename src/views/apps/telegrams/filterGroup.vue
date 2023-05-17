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
          <div class="d-flex align-items-center position-relative my-1 ">
          <KTIcon icon-name="magnifier" icon-class="fs-1 position-absolute ms-6" />
          <input type="text" data-kt-subscription-table-filter="search" v-model="data.query"
            class="form-control form-control-solid w-100 ps-14" placeholder="Tìm kiếm theo tên group" v-debounce:100000ms="submit()" />
          </div>

        </div>

        <!--begin::Input group-->
        <div class="mb-7">
          <!--begin::Label-->
          <label class="form-label fw-semobold">Chọn kiểu:</label>
          <!--end::Label-->

          <el-form-item prop="assign">
            
            <el-select
              v-model="data.type"
              placeholder="Chọn kiểu"
              name="type"
              as="select"
              height="40px"
              class="input-group-lg"
            >
              <el-option value="">Chọn kiểu</el-option>
              <el-option label="DB Leak" value="1">DB Leak</el-option>
              <el-option label="Hacker News" value="2">Hacker News</el-option>
            </el-select>
          </el-form-item>
          
        </div>
        <!--end::Input group-->

        
        <!--begin::Input group-->
        <div class="mb-7">
          <!--begin::Label-->
          <label class="form-label fw-semobold">Trạng thái:</label>
          <!--end::Label-->
  
          <!--begin::Input-->

          <el-form-item prop="assign">
            <el-select
              v-model="data.status"
              placeholder="Chọn trạng thái"
              name="status"
              as="select"
            >
              <el-option value="">Chọn trạng thái</el-option>
              <el-option label="Có thể đồng bộ" value="0">Có thể đồng bộ</el-option>
              <el-option label="không đồng bộ" value="1">không đồng bộ</el-option>

            </el-select>
          </el-form-item>
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
import { vue3Debounce } from 'vue-debounce'

  interface Filter {
    type: string | null;
    query: string | null;
    status: string | null;
  }
  
  export default defineComponent({
    name: "filter-scan",
    emits: [
      "filter-data"
    ],

    setup(props, { emit }) {

      const data = ref<Filter>({
        type: '',
        query: '',
        status: '',
      });

      watch(
        data.value,
        () => {
          submit()
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
        submit,
        reset,
      };
    },
    directives: {
      debounce: vue3Debounce({ lock: true })
    },
  });
  </script>

  <style>
  .el-input.el-input--suffix {
      height: 40px;
  }
</style>

  