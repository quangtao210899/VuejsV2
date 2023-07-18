<template>
  <div
    class="card card-flush bgi-no-repeat bgi-size-contain bgi-position-x-end"
    :class="className"
    :style="{ backgroundColor: bgColor, backgroundImage: `url('${bgImage}')` }"
  >
    <div class="card-header pt-5">
      <div class="card-title d-flex flex-column">
        <span class="text-white opacity-50 pt-1 fw-semibold fs-6">{{
          description
        }}</span>
        <router-link to="/target-list" class="link-primary fw-bold">
          <span class="fs-3x fw-bold text-white me-2 lh-1 ls-n2">{{ target }}</span>
        </router-link>
      </div>
    </div>

    <!--begin::Card body-->
    <!-- <div class="card-body d-flex align-items-end pt-0"> -->
      <!--begin::Progress-->
      <!-- <div class="d-flex align-items-end flex-column mt-3 w-100">
        <KTIcon icon-name="bi bi-life-preserver" icon-class="text-white  fs-3x" />
      </div> -->
      <!--end::Progress-->
    <!-- </div> -->
    <!--end::Card body-->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "default-dashboard-widget-1",
  components: {},
  props: {
    className: { type: String, required: false },
    bgColor: { type: String, required: false, default: "#080655" },
    bgImage: { type: String, required: false },
    description: { type: String, required: true },
    target: { type: Number, required: true },
  },
});
</script>
