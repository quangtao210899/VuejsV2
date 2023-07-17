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
    <br>
    <div class="card-body pt-2 pb-4 flex-wrap align-items-end">
      <div class="row">
        <div class="col-12 d-flex fw-semibold align-items-center">
          <div class="text-gray-500 me-4"><span class="text-primary">{{ open }}</span> Opened, <span class="text-danger">{{ closed }}</span> Closed</div>
        </div>
      </div>
    </div>
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
