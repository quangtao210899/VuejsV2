<template>
  <!--begin::Menu 1-->
  <div class="menu menu-sub menu-sub-dropdown w-250px w-md-450px" data-kt-menu="true">
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
      <div class="mb-7 text-center row">
        <!--begin::Label-->
        <div class="col-6">
          <div class="text-center">
            <el-progress type="dashboard" :percentage="progress" :status="checkStatus()" >
              <template #default="{ percentage }">
                <span class="percentage-value fs-1 ">{{ percentage }}%</span><br>
                <span class="percentage-label fs-6 mt-1">Tiến trình</span>
              </template>
            </el-progress>
          </div>

        </div>
        <div class="col-6">
          <!--begin::Row-->
          <div class="row text-start">
            <div class="col-12 mb-3">
              <div class="row">
                <!--begin::Label-->
                <label class="w-60px fw-semobold text-muted">ID </label>
                <!--end::Label-->

                <!--begin::Col-->
                <div class="col">
                  <span class="fw-bold fs-6 text-dark">{{ targetData.id }}</span>
                </div>
                <!--end::Col-->
              </div>
            </div>
            <div class="col-12 mb-3">
              <div class="row">
                <!--begin::Label-->
                <label class="w-60px fw-semobold text-muted">Tên</label>
                <!--end::Label-->

                <!--begin::Col-->
                <div class="col">
                  <span class="fw-bold fs-6 text-dark">{{ targetData.name }}</span>
                </div>
                <!--end::Col-->
              </div>
            </div>
            <div class="col-12 mb-3">
              <div class="row">
                <!--begin::Label-->
                <label class="w-60px fw-semobold text-muted">IP</label>
                <!--end::Label-->
                <!--begin::Col-->
                <div class="col">
                  <span class="fw-bold fs-6 text-dark">{{ targetData.ip ?? '--' }}</span>
                </div>
                <!--end::Col-->
              </div>
            </div>
            <div class="col-12">
              <div class="d-flex w-100">
                <!--begin::Label-->
                <label class="w-60px fw-semobold text-muted">Domain</label>
                <!--end::Label-->

                <!--begin::Col-->
                <span class="fw-bold fs-6 text-dark">{{ targetData.domain }}</span>
                <!--end::Col-->
              </div>
            </div>
          </div>
          <!--end::Row-->
        </div>
        <!--end::Input-->
      </div>
      <div class="mb-7">
        <!--begin::Row-->
        <div class="row">
          <div class=" col-6 p-2">
            <div class="border border-gray-300 border-dashed rounded py-3 px-4 ">
              <!--begin::Number-->
              <div class="d-flex align-items-center">
                <KTIcon icon-name="timer" icon-class="fs-3 text-success me-2" />
                <div class="fs-2 fw-bold">{{ diffTime }}</div>
              </div>
              <!--end::Number-->

              <!--begin::Label-->
              <div class="fw-semobold fs-6 text-gray-400">Thời Gian</div>
              <!--end::Label-->
            </div>
            <!--end::Stat-->
          </div>
          <div class="col-6 p-2">
            <div class="border border-gray-300 border-dashed rounded py-3 px-4 ">
              <!--begin::Number-->
              <div class="d-flex align-items-center">
                <KTIcon icon-name="arrow-up-down" icon-class="fs-3 text-success me-2" />
                <div class="fs-2 fw-bold">{{ countRequest }}</div>
              </div>
              <!--end::Number-->

              <!--begin::Label-->
              <div class="fw-semobold fs-6 text-gray-400">Yêu cầu</div>
              <!--end::Label-->
            </div>

          </div>
          <div class="col-6 p-2">
            <div class="border border-gray-300 border-dashed rounded py-3 px-4 ">
              <!--begin::Number-->
              <div class="d-flex align-items-center">
                <KTIcon icon-name="watch" icon-class="fs-3 text-success me-2" />
                <div class="fs-2 fw-bold">{{ averageResponseTime }}</div>
              </div>
              <!--end::Number-->

              <!--begin::Label-->
              <div class="fw-semobold fs-6 text-gray-400">Average Response Time</div>
              <!--end::Label-->
            </div>
            <!--end::Stat-->

          </div>
          <div class="col-6 p-2">
            <div class="border border-gray-300 border-dashed rounded py-3 px-4 ">
              <!--begin::Number-->
              <div class="d-flex align-items-center">
                <KTIcon icon-name="pointers" icon-class="fs-3 text-success me-2" />
                <div class="fs-2 fw-bold">{{ locations }}</div>
              </div>
              <!--end::Number-->

              <!--begin::Label-->
              <div class="fw-semobold fs-6 text-gray-400">Đường dẫn</div>
              <!--end::Label-->
            </div>
            <!--end::Stat-->

          </div>
        </div>
        <!--end::Row-->
      </div>
      <!--end::Input group-->

      <!-- <div class="separator my-2"></div> -->

      <!--begin::Actions-->
      <!-- <div class="d-flex justify-content-end">
        <button @click="reset" type="reset" class="btn btn-sm btn-outline btn-outline-dashed btn-outline-info  me-2">
          Reset
        </button>

        <button type="submit" class="btn btn-sm btn-primary" data-kt-menu-dismiss="true">
          Apply
        </button>
      </div> -->
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
interface targetData {
  ip: string | null;
  name: string | null;
  domain: string | null;
}

export default defineComponent({
  name: "filter-scan",
  props: {
    targetData: { type: Object, required: true },
    locations: { type: String || Number, required: false },
    averageResponseTime: { type: String || Number, required: false },
    countRequest: { type: String || Number, required: false },
    diffTime: { type: String || Number, required: false },
    progress: { type: Number, required: false },
    scanStatus: { type: Number, required: false },
  },
  components: {},
  emits: [
    "filter-data"
  ],
  setup(props, { emit }) {
    var check_return = 0
    const checkStatus = () => {
      if (props.scanStatus == 3) {
        return 'success'
      } else if (props.scanStatus == 4) {
        return 'exception'
      } else {
        return ''
      }
    };
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
    const debounceSearch = debounce(submit, 1000);
    const data = ref<Filter>({
      query: '',
    });
    watch(debouncedSearchTerm, debounceSearch);
    watch(data.value, () => { submit() });
    // watch(() => props.progress, () => { console.log('123') });

    // const emit = defineEmits(['filter-data'])


    const reset = () => {
      check_return = 2
      debouncedSearchTerm.value = '';
      data.value.query = '';
    };


    return {
      data,
      debouncedSearchTerm,
      submit,
      reset,
      checkStatus,
    };
  },
});
</script>
  