<template>
  <!--begin::App-->
  <div class="d-flex flex-column flex-root app-root" id="kt_app_root">
    <!--begin::Page-->
    <div class="app-page flex-column flex-column-fluid" id="kt_app_page">
      <KTHeader />
      <!--begin::Wrapper-->
      <div class="app-wrapper flex-column flex-row-fluid" id="kt_app_wrapper">
        <KTSidebar />
        <!--begin::Main-->
        <div class="app-main flex-column flex-row-fluid overflow-hidden hand-height" id="kt_app_main">
          <!--begin::Content wrapper-->
          <div class="d-flex flex-column flex-column-fluid h-100">
            <KTToolbar />
            <div id="kt_app_content" class="app-content flex-column-fluid hand-content">
              <KTContent></KTContent>
            </div>
          </div>
          <!--end::Content wrapper-->
          <!-- <KTFooter /> -->
        </div>
        <!--end:::Main-->
      </div>
      <!--end::Wrapper-->
    </div>
    <!--end::Page-->
  </div>
  <!--end::App-->

  <!-- <KTDrawers /> -->
  <!-- <KTScrollTop /> -->
  <!-- <KTModals /> -->
  <!-- <KTCustomize /> -->
</template>

<script lang="ts">
import {
  defineComponent,
  nextTick,
  onBeforeMount,
  onMounted,
  watch,
} from "vue";
import KTHeader from "@/layouts/main-layout/header/Header.vue";
import KTSidebar from "@/layouts/main-layout/sidebar/Sidebar.vue";
import KTContent from "@/layouts/main-layout/content/Content.vue";
import KTToolbar from "@/layouts/main-layout/toolbar/Toolbar.vue";
import KTFooter from "@/layouts/main-layout/footer/Footer.vue";
// import KTDrawers from "@/layouts/main-layout/drawers/Drawers.vue";
// import KTModals from "@/layouts/main-layout/modals/Modals.vue";
// import KTScrollTop from "@/layouts/main-layout/extras/ScrollTop.vue";
// import KTCustomize from "@/layouts/main-layout/extras/Customize.vue";
import { useRoute } from "vue-router";
import { reinitializeComponents } from "@/core/plugins/keenthemes";
import LayoutService from "@/core/services/LayoutService";

export default defineComponent({
  name: "default-layout",
  components: {
    KTHeader,
    KTSidebar,
    KTContent,
    KTToolbar,
    KTFooter,
    // KTDrawers,
    // KTScrollTop,
    // KTModals,
    // KTCustomize,
  },
  setup() {
    const route = useRoute();

    onBeforeMount(() => {
      LayoutService.init();
    });

    onMounted(() => {
      nextTick(() => {
        reinitializeComponents();
      });
    });

    watch(
      () => route.path,
      () => {
        nextTick(() => {
          reinitializeComponents();
        });
      }
    );
  },
});
</script>

<style>
.hand-height{
  height: calc(100vh - 70px) !important;
  width: -webkit-fill-available;
  position: absolute;
}

/* .hand-height {
    height: 100% !important;
    width: -webkit-fill-available;
    position: absolute;
    display: contents;
} */

.hand-content {
  display: block;
  height: calc(100% - 80px) !important;
  margin-bottom: unset !important;
  padding-bottom: unset !important;
}
.hand-height-2{
  /* height: calc(100% - 76px) !important; */
  height: 100%;
}
.custom-Message-box-class-text-primary .el-message-box__status.el-message-box-icon--info{
  color: #2196F3 !important;
}
</style>
