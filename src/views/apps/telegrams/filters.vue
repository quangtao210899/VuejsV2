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
        <label class="form-label fw-semobold" for="search">Tìm kiếm:</label>
        <!--end::Label-->

        <!--begin::Input-->
        <div class="d-flex align-items-center position-relative my-1">
          <KTIcon icon-name="magnifier" icon-class="fs-1 position-absolute ms-6" />
          <input id="search" name="search" type="text" data-kt-subscription-table-filter="search" v-model="debouncedSearchTerm"
            class="form-control form-control-solid w-100 ps-14" placeholder="Tìm kiếm theo nội dung" />
        </div>
      </div>

      <!--begin::Input group-->
      <div class="mb-7">
        <!--begin::Label-->
        <label class="form-label fw-semobold" for="type">Tìm kiếm theo kiểu:</label>
        <!--end::Label-->

        <!--begin::Input-->
        <el-form-item prop="assign">
          <el-select v-model="data.type" placeholder="Chọn kiểu" id="type" name="type" as="select"  size="large"
            class="input-group-lg w-100">
            <el-option value="">Chọn kiểu</el-option>
            <el-option label="DB Leak" value="1">DB Leak</el-option>
            <el-option label="Hacker News" value="2">Hacker News</el-option>
          </el-select>
        </el-form-item>

        <!--end::Input-->
      </div>
      <!--end::Input group-->


      <div class="separator my-2"></div>

      <!--begin::Actions-->
      <div class="d-flex justify-content-end">
        <button @click="reset" type="reset" class="btn btn-sm btn-outline btn-outline-dashed btn-outline-info  me-2">
          Reset
        </button>

        <button type="submit" class="btn btn-sm btn-primary" data-kt-menu-dismiss="true">
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
  type: string | null;
  query: string | null;

}

export default defineComponent({
  name: "filter-scan",
  props: {
    type: { type: String || Number, required: false },
  },
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
      type: (props.type) ? props.type : '',
      query: '',
    });

    let isReset = false;

    watch(debouncedSearchTerm, () => {
      if (!isReset) {
        debounceSearch();
      }
      
      isReset = false
    });
    watch(data.value, () => {
      if (!isReset) {
        submit();
      }
      isReset = false
    });

    const reset = () => {
      isReset = true;
      check_return = 0
      debouncedSearchTerm.value = ''
      data.value.type = '';
      data.value.query = '';
      submit()
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