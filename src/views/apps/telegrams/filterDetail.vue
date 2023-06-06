<template>
  <!--begin::Menu 1-->
  <div class="menu menu-sub menu-sub-dropdown w-250px w-md-350px" data-kt-menu="true">
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
          <input type="text" data-kt-subscription-table-filter="search" v-model="debouncedSearchTerm"
            class="form-control form-control-solid w-100 ps-14" placeholder="Tìm kiếm theo nội dung" />
        </div>
      </div>


      <div class="separator my-2"></div>

      <!--begin::Actions-->
      <div class="d-flex justify-content-end">
        <button @click="reset" type="reset" class="btn btn-sm btn-outline btn-outline-dashed btn-outline-info  me-2">
          Reset
        </button>

        <button  type="submit" class="btn btn-sm btn-primary" data-kt-menu-dismiss="true">
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
import { defineComponent, ref, watch } from "vue";
import { debounce } from 'vue-debounce'

interface Filter {
  query: string | null;
}

export default defineComponent({
  name: "filter-scan",
  components: {},
  emits: [
    "filter-data"
  ],
  setup(props, { emit }) {
    var check_return = 0
    const submit = async () => {
      if (data.value.query != debouncedSearchTerm.value) {
        data.value.query = debouncedSearchTerm.value
        return
      }
      if (check_return == 2 || check_return == 1) {
        check_return--
        if (check_return == 0) { // trạng thái ban đầu bằng 1 => return
          return
        }
      }
      emit("filter-data", data.value);
    };
    const debouncedSearchTerm = ref('');
    const debounceSearch = debounce(submit, 700);
    const data = ref<Filter>({
      query: '',
    });
    watch(debouncedSearchTerm, debounceSearch);
    watch(
      data.value,
      debounceSearch
    );

    const reset = () => {
      check_return = 0
      debouncedSearchTerm.value = '';
      data.value.query = '';
    };

    return {
      data,
      debouncedSearchTerm,
      submit,
      reset,
    };
  },
});
</script>
<style>
.el-input.el-input--suffix {
  height: 40px;
}
</style>