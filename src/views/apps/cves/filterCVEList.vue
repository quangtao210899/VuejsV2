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
        <div class="d-flex align-items-center position-relative my-1 ">
          <KTIcon icon-name="magnifier" icon-class="fs-1 position-absolute ms-6" />
          <input id="search" name="search" type="text" data-kt-subscription-table-filter="search" v-model="debouncedSearchTerm"
            class="form-control form-control-solid w-100 ps-14" placeholder="Tìm kiếm theo mã CVE" />
        </div>

      </div>

      <!--begin::Input group-->
      <div class="mb-7">
        <!--begin::Label-->
        <label class="form-label fw-semobold" for="product_type">Tìm kiếm theo loại sản phẩm:</label>
        <!--end::Label-->

        <el-form-item prop="assign">

          <el-select v-model="data.product_type" placeholder="Chọn loại sản phẩm" id="product_type" name="product_type" as="select"
            height="40px" class="input-group-lg w-100" size="large">
            <el-option label="Chọn loại sản phẩm" value="">Chọn loại sản phẩm</el-option>
            <el-option label="Microsoft" value="0">Microsoft</el-option>
            <el-option label="Oracle" value="1">Oracle</el-option>
            <el-option label="Google" value="2">Google</el-option>
            <el-option label="Debian" value="3">Debian</el-option>
            <el-option label="Apple" value="4">Apple</el-option>
            <el-option label="IBM" value="5">IBM</el-option>
            <el-option label="Redhat" value="6">Redhat</el-option>
            <el-option label="Fedoraproject" value="7">Fedoraproject</el-option>
            <el-option label="Canonical" value="8">Canonical</el-option>
            <el-option label="Cisco" value="9">Cisco</el-option>
            <el-option label="Linux" value="10">Linux</el-option>
            <el-option label="Opensuse" value="11">Opensuse</el-option>
            <el-option label="Mozilla" value="12">Mozilla</el-option>
            <el-option label="Netapp" value="13">Netapp</el-option>
            <el-option label="Apache" value="14">Apache</el-option>
            <el-option label="HP" value="15">HP</el-option>
            <el-option label="Adobe" value="16">Adobe</el-option>
            <el-option label="SUN" value="17">SUN</el-option>
            <el-option label="Jenkins" value="18">Jenkins</el-option>
            <el-option label="SAP" value="19">SAP</el-option>
            <el-option label="Suse" value="20">Suse</el-option>
            <el-option label="Siemens" value="21">Siemens</el-option>
            <el-option label="GNU" value="22">GNU</el-option>
            <el-option label="Gitlab" value="23">Gitlab</el-option>
            <el-option label="Huawei" value="24">Huawei</el-option>
            <el-option label="F5" value="25">F5</el-option>
            <el-option label="PHP" value="26">PHP</el-option>
            <el-option label="Intel" value="27">Intel</el-option>
            <el-option label="Vmware" value="28">Vmware</el-option>
            <el-option label="Imagemagick" value="29">Imagemagick</el-option>
            <el-option label="Wireshark" value="30">Wireshark</el-option>
            <el-option label="Novell" value="31">Novell</el-option>
            <el-option label="Dell" value="32">Dell</el-option>
            <el-option label="Mcafee" value="33">Mcafee</el-option>
            <el-option label="Symantec" value="34">Symantec</el-option>
            <el-option label="Fortinet" value="35">Fortinet</el-option>
            <el-option label="Moodle" value="36">Moodle</el-option>
            <el-option label="Juniper" value="37">Juniper</el-option>
            <el-option label="Freebsd" value="38">Freebsd</el-option>
            <el-option label="Joomla" value="39">Joomla</el-option>
            <el-option label="XEN" value="40">XEN</el-option>
            <el-option label="Broadcom" value="41">Broadcom</el-option>
            <el-option label="Cpanel" value="42">Cpanel</el-option>
            <el-option label="Zohocorp" value="43">Zohocorp</el-option>
            <el-option label="Ffmpeg" value="44">Ffmpeg</el-option>
            <el-option label="Atlassian" value="45">Atlassian</el-option>
            <el-option label="Mariadb" value="46">Mariadb</el-option>
            <el-option label="EMC" value="47">EMC</el-option>
            <el-option label="Wordpress" value="48">Wordpress</el-option>
            <el-option label="Qemu" value="49">Qemu</el-option>
            <el-option label="Khác" value="50">Khác</el-option>
          </el-select>
        </el-form-item>

      </div>
      <!--end::Input group-->


      <!--begin::Input group-->
      <div class="mb-7">
        <!--begin::Label-->
        <label class="form-label fw-semobold" for="vul_type">Tìm kiếm theo loại lỗ hổng:</label>
        <!--end::Label-->

        <!--begin::Input-->

        <el-form-item prop="assign">
          <el-select v-model="data.vul_type" placeholder="Chọn loại lỗ hổng" id="vul_type" name="vul_type" as="select" size="large" class="input-group-lg w-100">
            <el-option label="Chọn loại lỗ hổng" value="">Chọn loại lỗ hổng</el-option>
            <el-option label="DoS" value="0">DoS</el-option>
            <el-option label="Code Execution" value="1">Code Execution</el-option>
            <el-option label="Overflow" value="2">Overflow</el-option>
            <el-option label="Memory Corruption" value="3">Memory Corruption</el-option>
            <el-option label="Sql Injection" value="4">Sql Injection</el-option>
            <el-option label="XSS" value="5">XSS</el-option>
            <el-option label="Directory Traversal" value="6">Directory Traversal</el-option>
            <el-option label="Http Response Splitting" value="7">Http Response Splitting</el-option>
            <el-option label="Bypass something" value="8">Bypass something</el-option>
            <el-option label="Gain Information" value="9">Gain Information</el-option>
            <el-option label="Gain Privileges" value="10">Gain Privileges</el-option>
            <el-option label="CSRF" value="11">CSRF</el-option>
            <el-option label="File Inclusion" value="12">File Inclusion</el-option>
            <el-option label="Khác" value="13">Khác</el-option>

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
  product_type: string | null;
  query: string | null;
  vul_type: string | null;
}

export default defineComponent({
  name: "filter-scan",
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
      product_type: '',
      query: '',
      vul_type: '',
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
      debouncedSearchTerm.value = '';
      data.value.product_type = '';
      data.value.query = '';
      data.value.vul_type = '';
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

<style scoped>
.el-input.el-input--suffix {
  height: 40px;
}
</style>

  