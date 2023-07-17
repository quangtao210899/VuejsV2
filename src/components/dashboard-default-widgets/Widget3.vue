<template>
  <div class="card card-flush" :class="className">
    <div class="card-header pt-5"> 
      <div class="card-title d-flex flex-column">
        <span class="text-gray-400 pt-1 fw-semibold fs-6"
        >{{ description }}</span>
        <div class="d-flex align-items-center">
          <span class="fs-3x fw-bold text-dark me-2 lh-1 ls-n2">{{ services }}</span>
        </div>
        <!--end::Subtitle-->
      </div>
      <!--end::Title-->
    </div>
    <!--end::Header-->

    <!--begin::Card body-->
    <div class="card-body pt-2 pb-4 d-flex flex-wrap align-items-end">

      <!--begin::Labels-->
      <div class="d-flex flex-column content-justify-center flex-row-fluid">
        <!--begin::Label-->
        <div class="d-flex fw-semibold align-items-center">
          <!--begin::Bullet-->
          <div class="bullet w-8px h-3px rounded-2 bg-primary me-3"></div>
          <!--end::Bullet-->

          <!--begin::Label-->
          <div class="text-gray-500 me-4 w-100px">Open :</div>
          <!--end::Label-->

          <!--begin::Stats-->
          <div class="fw-bolder text-gray-700 text-xxl-end"><span class="text-primary">{{ open }}</span></div>
          <!--end::Stats-->
        </div>
        <!--end::Label-->

        <!--begin::Label-->
        <div class="d-flex fw-semibold align-items-center my-3">
          <!--begin::Bullet-->
          <div class="bullet w-8px h-3px rounded-2 bg-danger me-3"></div>
          <!--end::Bullet-->

          <!--begin::Label-->
          <div class="text-gray-500 me-4 w-100px">Closed :</div>
          <!--end::Label-->

          <!--begin::Stats-->
          <div class="fw-bolder text-gray-700 text-xxl-end"><span class="text-danger">{{ closed }}</span></div>

          <!--end::Stats-->
        </div>
        <!--end::Label-->
      </div>
      <!--end::Labels-->
    </div>
    <!--end::Card body-->
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue";

export default defineComponent({
  name: "default-dashboard-widget-2",
  components: {},
  props: {
    className: { type: String, required: false },
    closed: { type: Number, required: true },
    open: { type: Number, required: true },
    description: { type: String, required: true },
    services: { type: Number, required: true },
  },

});
</script>
