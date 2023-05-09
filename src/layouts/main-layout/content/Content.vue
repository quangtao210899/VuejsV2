<template>
  <div id="kt_app_content" class="app-content flex-column-fluid hand-content-children">
    <!--begin::Content container-->
    <div
      id="kt_app_content_container"
      class="app-container h-100"
      :class="{
        'container-fluid': contentWidthFluid,
        'container-xxl': !contentWidthFluid,
      }"
    >
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
<style>
.hand-content-children {
  display: block;
  height: 100% !important;
  margin-bottom: unset !important;
  padding-bottom: unset !important;
}
</style>
