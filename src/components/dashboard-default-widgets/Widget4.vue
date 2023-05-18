<template>
  <div class="card card-flush bgi-no-repeat bgi-size-contain bgi-position-x-end"
   :class="className" :style="{ backgroundColor: bgColor, backgroundImage: `url('${bgImage}')` }">
    <!--begin::Header-->
    <div class="card-header pt-5">
      <!--begin::Title-->
      <div class="card-title d-flex flex-column">
        <!--begin::Amount-->
        <span class="fs-3x fw-bold text-white me-2 lh-1 ls-n2">{{ scan }}</span>
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
    <div class="card-body pt-2 pb-4 d-flex flex-wrap align-items-end">

      <!--begin::Labels-->
      <!--begin::Row-->
      <div class="row g-0">
        <!--begin::Col-->
        <div class="col-6">
          <div class="d-flex align-items-center mb-4 me-2">
            <!--begin::Symbol-->
            <div class="symbol symbol-40px me-3">
              <div class="symbol-label bg-light-success  pulse pulse-success">
                <KTIcon icon-name="shield" icon-class="fs-1 text-success" />
                <span class="pulse-ring"></span>
              </div>
            </div>
            <!--end::Symbol-->

            <!--begin::Title-->
            <div>
              <div class="fs-5 text-success fw-bold lh-1">{{ scanInfo }}</div>
              <div class="fs-7 fw-semobold text-success">Info</div>
            </div>
            <!--end::Title-->
          </div>
        </div>
        <!--end::Col-->

        <!--begin::Col-->
        <div class="col-6">
          <div class="d-flex align-items-center mb-4 ms-2">
            <!--begin::Symbol-->
            <div class="symbol symbol-40px me-3">
              <div class="symbol-label bg-light-primary pulse pulse-primary">
                <KTIcon icon-name="shield" icon-class="fs-1 text-primary" />
                <span class="pulse-ring"></span>
              </div>
            </div>
            <!--end::Symbol-->

            <!--begin::Title-->
            <div>
              <div class="fs-5 fw-bold lh-1 text-primary">{{ scanLow }}</div>
              <div class="fs-7 fw-semobold text-primary">Low</div>
            </div>
            <!--end::Title-->
          </div>
        </div>
        <!--end::Col-->

        <!--begin::Col-->
        <div class="col-6">
          <div class="d-flex align-items-center me-2">
            <!--begin::Symbol-->
            <div class="symbol symbol-40px me-3">
              <div class="symbol-label bg-light-warning  pulse pulse-warning">
                <KTIcon icon-name="shield" icon-class="fs-1 text-warning" />
                <span class="pulse-ring"></span>
              </div>
            </div>
            <!--end::Symbol-->

            <!--begin::Title-->
            <div>
              <div class="fs-5 fw-bold lh-1 text-warning">{{ scanMedium }}</div>
              <div class="fs-7 fw-semobold text-warning">Medium</div>
            </div>
            <!--end::Title-->
          </div>
        </div>
        <!--end::Col-->

        <!--begin::Col-->
        <div class="col-6">
          <div class="d-flex align-items-center ms-2">
            <!--begin::Symbol-->
            <div class="symbol symbol-40px me-3">
              <div class="symbol-label bg-light-danger pulse pulse-danger">
                <KTIcon icon-name="shield" icon-class="fs-1 text-danger" />
                <span class="pulse-ring"></span>
              </div>
            </div>
            <!--end::Symbol-->

            <!--begin::Title-->
            <div>
              <div class="fs-5 text-danger fw-bold lh-1">{{ scanHigh }}</div>
              <div class="fs-7 text-danger fw-semobold">High</div>
            </div>
            <!--end::Title-->
          </div>
        </div>
        <!--end::Col-->
      </div>
      <!--end::Row-->
      <!--end::Labels-->
    </div>
    <!--end::Card body-->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "default-dashboard-widget-4",
  props: {
    className: { type: String, required: false },
    description: { type: String, required: true },
    scan: { type: Number, required: true },
    scanInfo: { type: Number, required: true },
    scanLow: { type: Number, required: true },
    scanMedium: { type: Number, required: true },
    scanHigh: { type: Number, required: true },
    bgImage: { type: String, required: false },
    bgColor: { type: String, required: false, default: "#065387" },
  },
});
</script>
