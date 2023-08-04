<template>
  <div id="kt_app_content" class="app-content flex-column-fluid h-100 pb-0">
    <el-scrollbar :height="heightTable">

    <!--begin::Content container-->
    <!-- <div id="kt_app_content_container" class="h-100 container-xxl" :class="{
      'container-fluid': contentWidthFluid,
      'container-xxl': !contentWidthFluid,
    }"> -->
      <div id="kt_app_content_containern " class="h-100 w-100 position-relative">
          <RouterView></RouterView>
      </div>
    <!-- </div> -->
    <!--end::Content container-->
  </el-scrollbar>

  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onUnmounted, onMounted } from "vue";
import { contentWidthFluid } from "@/core/helpers/config";
import { RouterView } from "vue-router";

export default defineComponent({
  name: "default-layout-content",
  components: {
    RouterView,
  },
  setup() {
    // tính toán chiều cao table
    const heightTable = ref(0)
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      if (windowWidth >= 1400) {
        heightTable.value = window.innerHeight - 80;
      } else if (windowWidth >= 1200) {
        heightTable.value = window.innerHeight - 80;
      } else if (windowWidth >= 992) {
        heightTable.value = window.innerHeight - 80;
      } else if (windowWidth >= 768) {
        heightTable.value = window.innerHeight - 75;
      } else if (windowWidth >= 576) {
        heightTable.value = window.innerHeight - 75;
      } else {
        // Kích thước cửa sổ nhỏ hơn 576px, đặt giá trị mặc định
        heightTable.value = window.innerHeight - 70;
      }
    };

    onMounted(() => {
      handleResize();
      window.addEventListener('resize', handleResize);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
    });
    return {
      contentWidthFluid,
      heightTable,
    };
  },
});
</script>
<style>
.fs-13px {
  font-size: 13px !important;
}
.el-dialog{
  border-radius: 0.475rem;
}
</style>