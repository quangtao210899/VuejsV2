<template>
  <div class="card card-flush" :class="className">
    <!--begin::Header-->
    <div class="card-header pt-5">
      <!--begin::Title-->
      <div class="card-title d-flex flex-column">
        <!--begin::Amount-->
        <span class="fs-3x fw-bold text-dark me-2 lh-1 ls-n2">{{ subdomain }}</span>
        <!--end::Amount-->

        <!--begin::Subtitle-->
        <span class="text-gray-400 pt-1 fw-semibold fs-6">{{
          description
        }}</span>
        <!--end::Subtitle-->
      </div>
      <!--end::Title-->
    </div>
    <!--end::Header-->

    <!--begin::Card body-->
    <div class="card-body d-flex align-items-end pt-0">
      <!--begin::Title-->

      <li class="d-flex align-items-center py-2 fw-bolder col-9 ">
        <span class="bullet bullet-dot bg-success h-10px w-10px me-2"></span> 
        <span class="fs-6 text-gray-800 badge badge-light-success">
          <span class="fs-3 text-success">{{liveSubdomain }}  </span>
           - Subdomain live
        </span>
      </li>
      <div class="d-flex align-items-end flex-column w-100">
        <KTIcon icon-name="bi bi-life-preserver" icon-class="fs-3x" />
      </div>
      <!--end::Title-->
    </div>
    <!--end::Card body-->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "default-dashboard-widget-3",
  components: {},
  props: {
    subdomain: { type: Number, required: true },
    description: { type: String, required: true },
    className: { type: String, required: false },
    liveSubdomain: { type: Number, required: false },
  },
});
</script>
