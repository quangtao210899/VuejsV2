<template>
  <div class="card card-flush" :class="className">
    <!--begin::Header-->
    <div class="card-header pt-5">
      <!--begin::Title-->
      <div class="card-title d-flex flex-column">
        <!--begin::Info-->
        <div class="d-flex align-items-center">
          <!--begin::Amount-->
          <span class="fs-3x fw-bold text-dark me-2 lh-1 ls-n2">{{ subdomain }}</span>
          <!--end::Amount-->

          <!--begin::Badge-->
          <span class="badge badge-light-success fs-base">
            <KTIcon icon-name="notification-bing" icon-class="fs-5 text-success ms-n1" />
            <span class="fs-5 text-success">{{ liveSubdomain }} Live</span> 
          </span>
          <!--end::Badge-->
        </div>
        <!--end::Badge-->
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
    <div class="card-body d-flex align-items-end flex-column mt-0 pt-0 pb-0 mb-0">
      <!--begin::Progress-->
      <img src="/media/icons/duotune/vpn/subdomain.gif" alt="target" class="h-150px w-150px p-0 m-0" />
      <!--end::Progress-->
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
