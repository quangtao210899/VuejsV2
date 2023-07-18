<template>
  <div id="kt_app_content" class="app-content flex-column-fluid">
    <!--begin::Content container-->
    <!-- <div id="kt_app_content_container" class="h-100 container-xxl" :class="{
      'container-fluid': contentWidthFluid,
      'container-xxl': !contentWidthFluid,
    }"> -->
        <div id="kt_app_content_container" class="h-100">
      <RouterView></RouterView>
    </div>
    <!--end::Content container-->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { contentWidthFluid } from "@/core/helpers/config";
import { RouterView } from "vue-router";

export default defineComponent({
  name: "default-layout-content",
  components: {
    RouterView,
  },
  setup() {
    return {
      contentWidthFluid,
    };
  },
});
</script>
