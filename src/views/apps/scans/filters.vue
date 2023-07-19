<template>
  <!--begin::Menu 1-->
  <div class="menu menu-sub menu-sub-dropdown w-250px w-md-350px" data-kt-menu="true">
    <!--begin::Header-->
    <div class="px-7 py-5">
      <div class="fs-5 text-dark fw-bold">Bộ Lọc</div>
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
        <label class="form-label fw-semobold" for="status">Trạng Thái:</label>
        <!--end::Label-->

        <!--begin::Input-->
        <div>
          <el-form-item prop="assign">
            <el-select v-model="data.status" id="status" name="status" as="select" placeholder="Chọn trạng thái"  size="large" class="input-group-lg w-100">
              <el-option value="">Chọn trạng thái</el-option>
              <el-option label="open" value="open">open</el-option>
              <el-option label="re-open" value="re-open">re-open</el-option>
              <el-option label="Close" value="closed">Close</el-option>
              <el-option label="Accepted" value="rick-accepted">Accepted</el-option>

            </el-select>
          </el-form-item>
        </div>
        <!--end::Input-->
      </div>
      <!--end::Input group-->


      <!--begin::Input group-->
      <div class="mb-7">
        <!--begin::Label-->
        <label class="form-label fw-semobold" for="severity">Mức Độ Lỗ Hổng:</label>
        <!--end::Label-->

        <!--begin::Input-->
        <div>
          <el-form-item prop="assign">
            <el-select v-model="data.severity" id="severity" name="severity" as="select" placeholder="Chọn mức độ lỗ hổng"  size="large" class="input-group-lg w-100">
              <el-option value="">Chọn lỗ hổng</el-option>
              <el-option label="Info" value="0">Info</el-option>
              <el-option label="Low" value="1">Low</el-option>
              <el-option label="Medium" value="2">Medium</el-option>
              <el-option label="High" value="3">High</el-option>

            </el-select>
          </el-form-item>
        </div>
        <!--end::Input-->
      </div>
      <!--end::Input group-->


      <!--begin::Input group-->
      <div class="mb-7">
        <!--begin::Label-->
        <label class="form-label fw-semobold" for="typeIp">IP:</label>
        <!--end::Label-->

        <!--begin::Input-->

        <div class="row">
          <div class="col-8 pe-0">
            <el-input  v-model="debouncedSearchIp" type="text" placeholder="Nhập IP" id="typeIp" name="typeIp" size="large"></el-input>
          </div>
          <div class="col-4 ">
            <el-form-item prop="assign">
              <el-select v-model="data.typeIp"  name="typeIp" as="select"  size="large" class="input-group-lg w-100">
                <el-option value="equal" label="Equal">Equal</el-option>
                <el-option label="NContains" value="not_contains">NContains</el-option>
                <el-option label="contains" value="contains">contains</el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
        <!--end::Input-->
      </div>
      <!--end::Input group-->


      <!--begin::Input group-->
      <div class="mb-7">
        <!--begin::Label-->
        <label class="form-label fw-semobold" for="typeDomain">Domain:</label>
        <!--end::Label-->

        <!--begin::Input-->

        <div class="row">
          <div class="col-8 pe-0">
            <el-input v-model="debouncedSearchDomain" type="text" placeholder="Nhập Domain" id="typeDomain" name="typeDomain" size="large"></el-input>
          </div>
          <div class="col-4 ">
            <el-form-item prop="assign">
              <el-select v-model="data.typeDomain" name="typeDomain" as="select"  size="large" class="input-group-lg w-100">
                <el-option value="equal" label="Equal">Equal</el-option>
                <el-option label="NContains" value="not_contains">NContains</el-option>
                <el-option label="contains" value="contains">contains</el-option>

              </el-select>
            </el-form-item>
          </div>
        </div>
        <!--end::Input-->
      </div>
      <!--end::Input group-->

      <div class="separator my-2"></div>

      <!--begin::Actions-->
      <div class="d-flex justify-content-end">
        <button @click="reset" type="reset" class="btn btn-sm btn-outline btn-outline-dashed btn-outline-info  me-2">
          Đặt Lại
        </button>

        <button type="submit" class="btn btn-sm btn-light-primary" data-kt-menu-dismiss="true">
          Áp Dụng
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
  status: string | null;
  severity: string | null;
  ip: string | null;
  typeIp: string | null;
  domain: string | null;
  typeDomain: string | null;
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
      if (data.value.ip != debouncedSearchIp.value) {
        data.value.ip = debouncedSearchIp.value
        return
      }
      if (data.value.domain != debouncedSearchDomain.value) {
        data.value.domain = debouncedSearchDomain.value
        return
      }
      if (check_return) {
        check_return--
        if (check_return == 0 || check_return == 1) { // trạng thái ban đầu bằng 1,2 => return
          return
        }
      }
      emit("filter-data", data.value);
    };
    const debouncedSearchIp = ref('');
    const debounceSearchIp = debounce(submit, 1000);
    const debouncedSearchDomain = ref('');
    const debounceSearchDomain = debounce(submit, 1000);
    const data = ref<Filter>({
      status: '',
      severity: '',
      ip: '',
      typeIp: 'equal',
      domain: '',
      typeDomain: 'equal',
    });
    watch(debouncedSearchIp, debounceSearchIp);
    watch(debouncedSearchDomain, debounceSearchDomain);
    watch(
      data.value,
      () => {
        submit()
      }
    );

    // const emit = defineEmits(['filter-data'])


    const reset = () => {
      check_return = 0
      debouncedSearchIp.value = ''
      debouncedSearchDomain.value = ''
      data.value.status = '';
      data.value.severity = '';
      data.value.ip = '';
      data.value.typeIp = 'equal';
      data.value.domain = '';
      data.value.typeDomain = 'equal';
    };


    return {
      data,
      debouncedSearchIp,
      debouncedSearchDomain,
      submit,
      reset,
    };
  },
});
</script>

