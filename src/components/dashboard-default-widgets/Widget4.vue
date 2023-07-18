<template>
  <div class="card card-flush bgi-no-repeat bgi-size-contain bgi-position-x-end"
   :class="className" :style="{ backgroundColor: bgColor, backgroundImage: `url('${bgImage}')` }">
    <div class="card-header pt-5">
      <div class="card-title d-flex flex-column">
        <span class="text-gray-400 pt-1 fw-semibold fs-6">{{
          description
        }}</span>
        <router-link to="/scans" class="link-primary fw-bold">
          <span class="fs-3x fw-bold text-white me-2 lh-1 ls-n2">{{ scan }}</span>
        </router-link>
      </div>
    </div>

    <br>
    <div class="card-body pt-2 pb-4 flex-wrap align-items-end">
      <div class="row">
        <div class="col-12 d-flex fw-semibold align-items-center">
          <div class="text-gray-500 me-4"><span class="text-danger">{{ scanHigh }}</span> High, <span class="text-warning">{{ scanMedium }}</span> Medium, <span class="text-success">{{ scanLow }}</span> Low, <span class="text-primary">{{ scanInfo }}</span> Info</div>
        </div>
      </div>
    </div>
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
