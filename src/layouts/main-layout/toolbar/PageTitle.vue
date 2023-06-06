<template>
  <!--begin::Page title-->
  <div
    v-if="pageTitleDisplay"
    :class="`page-title d-flex flex-${pageTitleDirection} justify-content-center flex-wrap me-3`"
  >
    <template v-if="pageTitle">
      <!--begin::Title-->
      <h1
        class="page-heading d-flex text-dark fw-bold fs-3 flex-column justify-content-center my-0"
      >
        {{ pageTitle }}
      </h1>
      <!--end::Title-->

      <span
        v-if="pageTitleDirection === 'row' && pageTitleBreadcrumbDisplay"
        class="h-20px border-gray-200 border-start mx-3"
      ></span>

      <!--begin::Breadcrumb-->
      <ul
        v-if="breadcrumbs && pageTitleBreadcrumbDisplay"
        class="breadcrumb breadcrumb-separatorless fw-semibold fs-7 my-0 pt-1"
      >
        <!--begin::Item-->
        <li class="breadcrumb-item text-muted">
          <router-link to="/" class="text-muted text-hover-primary"
            >Home</router-link
          >
        </li>
        <!--end::Item-->
        <template v-for="(item, i) in breadcrumbs" :key="i">
          <li class="breadcrumb-item">
            <span class="bullet bg-gray-400 w-5px h-2px"></span>
          </li>
          <li class="breadcrumb-item text-muted" v-if="links&&(i>=0 && i < (<any>breadcrumbs).length - 1  )">
            <router-link :to="links[i]" class="text-muted text-hover-primary" v-if="links[i]">
              {{ item }}
            </router-link>
            <router-link :to="linkToBack" class="text-muted text-hover-primary" v-else-if="linkToBack">
              {{ item }}
            </router-link>
            <template v-else>
              {{ item }}
            </template>
          </li>
          <li class="breadcrumb-item text-muted" v-else>{{ item }}</li>
        </template>
      </ul>
      <!--end::Breadcrumb-->
    </template>
  </div>
  <div v-else class="align-items-stretch"></div>
  <!--end::Page title-->
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import {
  pageTitleBreadcrumbDisplay,
  pageTitleDirection,
  pageTitleDisplay,
} from "@/core/helpers/config";
import { useRoute   } from "vue-router";

export default defineComponent({
  name: "layout-page-title",
  components: {},
  setup() {
    const route = useRoute();
    const linkToBack = ref('');
    const pageTitle = computed(() => {
      return route.meta.pageTitle;
    });

    const breadcrumbs = computed(() => {
      return route.meta.breadcrumbs;
    });

    const links = computed<string[]>(() => {
      if(route.name=='target-scanstab'){
        linkToBack.value = `/target-scans/${route.params['idScan']}`
      } else if (route.name=='targetDetectionListCVE') {
        linkToBack.value = `/cve/${route.params['idCVE']}/scan`
      } else if (route.name=='targetDetectionListCVEAll') {
        linkToBack.value = `/cve/${route.params['id']}/scan`
      }
      return route.meta.links as string[];
    });


    return {
      pageTitle,
      breadcrumbs,
      links,
      linkToBack,
      pageTitleDisplay,
      pageTitleBreadcrumbDisplay,
      pageTitleDirection,
    };
  },
});
</script>
