<template>
  <div class=" overflow-auto h-100 w-100">
    <!--begin::Row-->
    <div class="row g-5 g-xl-10 mb-5 mb-xl-10">
      <!--begin::Col-->
      <div class="col-md-6 col-lg-6 col-xl-4 col-xxl-4 mb-md-5 mb-xl-10">
        <Widget1 className="h-md-50 mb-5 mb-xl-10" description="Mục tiêu" :target="target" bgColor="#F1416C"
          :bgImage="getAssetPath('media/patterns/vector-1.png')" />

        <Widget2 className="h-md-50 mb-5 mb-xl-10" :icon="false" :subdomain="subdomain" :liveSubdomain="subdomainLive"
          description="Subdomains" labelColor="dark" textColor="gray-300" />
      </div>
      <!--end::Col-->

      <!--begin::Col-->
      <div class="col-md-6 col-lg-6 col-xl-4 col-xxl-4 mb-md-5 mb-xl-10">
        <Widget3 className="h-md-50 mb-5 mb-xl-10" :open="serviceOpen" :closed="serviceClone" description="Services"
          :services="service" />

        <Widget4 bgColor="#0e367b" :bgImage="getAssetPath('media/patterns/pattern-2.jpg')" className="h-lg-50"
          :scanHigh="serviceHigh" :scanMedium="serviceMedium" :scanLow="serviceLow" :scanInfo="serviceInfo"
          description="Lỗ Hổng Bảo Mật" :scan="scan" />
      </div>
      <!--end::Col-->

      <!--begin::Col-->
      <div class="col-xxl-4 col-xl-4">
        <Widget5 className="h-md-100" />
      </div>
      <!--end::Col-->
    </div>
    <!--end::Row-->

    <!--begin::Row-->
    <div class="row gx-5 gx-xl-10">
      <!--begin::Col-->
      <div class="col-xxl-6 mb-5 mb-xl-10">
        <Widget6 className="h-xl-100" v-bind:height="300" :targetGroupLabels="targetGroupLabels"
          :targetGroupData="targetGroupData" :targetGroupColor="targetGroupColor" />
      </div>
      <!--end::Col-->

      <!--begin::Col-->
      <div class="col-xl-6 mb-5 mb-xl-10">
        <Widget7 className="h-xl-100" v-bind:height="300" :vulnerableColor="vulnerableColor"
          :vulnerableData="vulnerableData" :vulnerableLabels="vulnerableLabels" />
      </div>
      <!--end::Col-->
    </div>
    <!--end::Row-->

    <!--begin::Row-->
    <div class="row g-5 g-xl-10 mb-5 mb-xl-10">
      <!--begin::Col-->
      <div class="col-xxl-6">
        <Widget8 className="h-xl-100" :DBLeakData="DBLeak" />
      </div>
      <!--end::Col-->

      <!--begin::Col-->
      <div class="col-xl-6">
        <Widget9 className="h-lg-100" :dataMostVulnerable="dataMostVulnerable" />
      </div>
      <!--end::Col-->
    </div>
    <!--end::Row-->

    <!--begin::Row-->
    <div class="row g-5 g-xl-10 mb-5 mb-xl-10">
      <!--begin::Col-->
      <div class="col-xl-6">
        <Widget10 className="h-md-100" :HackerNews="HackerNews" />
      </div>
      <!--end::Col-->

      <!--begin::Col-->
      <div class="col-xl-6">
        <Widget11 className="h-md-100" />
      </div>
      <!--end::Col-->
    </div>
    <!--end::Row-->

    <!--begin::Row-->
    <div class="row g-5 g-xl-10 mb-5 mb-xl-10">
      <!--begin::Col-->
      <div class="col-xl-12">
        <Widget12 className="h-md-100" :latestVulnerabilitiesData="LatestVulnerabilities" />
      </div>
      <!--end::Col-->
    </div>
    <!--end::Row-->
  </div>
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref, onMounted } from "vue";
import ApiService from "@/core/services/ApiService";
import Swal from "sweetalert2/dist/sweetalert2.js";

import Widget1 from "@/components/dashboard-default-widgets/Widget1.vue";
import Widget2 from "@/components/dashboard-default-widgets/Widget2.vue";
import Widget3 from "@/components/dashboard-default-widgets/Widget3.vue";
import Widget4 from "@/components/dashboard-default-widgets/Widget4.vue";
import Widget5 from "@/components/dashboard-default-widgets/Widget5.vue";
import Widget6 from "@/components/dashboard-default-widgets/Widget6.vue";
import Widget7 from "@/components/dashboard-default-widgets/Widget7.vue";
import Widget8 from "@/components/dashboard-default-widgets/Widget8.vue";
import Widget9 from "@/components/dashboard-default-widgets/Widget9.vue";
import Widget10 from "@/components/dashboard-default-widgets/Widget10.vue";
import Widget11 from "@/components/dashboard-default-widgets/Widget11.vue";
import Widget12 from "@/components/dashboard-default-widgets/Widget12.vue";

export default defineComponent({
  name: "main-dashboard",
  components: {
    Widget1,
    Widget2,
    Widget3,
    Widget4,
    Widget5,
    Widget6,
    Widget7,
    Widget8,
    Widget9,
    Widget10,
    Widget11,
    Widget12,
  },
  setup() {
    const loading = ref<boolean>(false)
    // target
    const target = ref<number>(0);

    // subdomains
    const subdomain = ref<number>(0);
    const subdomainLive = ref<number>(0);

    //service
    const service = ref<number>(0);
    const serviceOpen = ref<number>(0);
    const serviceClone = ref<number>(0);

    //scan
    const scan = ref<number>(0);
    const serviceHigh = ref<number>(0);
    const serviceMedium = ref<number>(0);
    const serviceLow = ref<number>(0);
    const serviceInfo = ref<number>(0);

    // Vulmerabilities by serverity
    const vulnerableLabels = ref(['Info', 'Low', 'Medium', 'High']);
    const vulnerableData = ref<number[]>([]);
    const vulnerableColor = ref(['#28a745', '#23b7e5', '#fcba32', '#e11f26']);

    // Nhóm mục tiêu
    const targetGroupLabels = ref<string[]>([]);
    const targetGroupData = ref<any>([]);
    const targetGroupColor = ref(['rgb(255, 99, 132)', 'rgb(75, 192, 192)', 'rgb(255, 205, 86)', 'rgb(201, 203, 207)', 'rgb(54, 162, 235)']);

    // DB Leak
    const DBLeak = ref<Array<string | any>>([]);

    //most_vuls
    const dataMostVulnerable = ref<Array<string | any>>([]);

    // Hacker News 
    const HackerNews = ref<Array<string | any>>([]);

    // Most common Ports 
    const MostcommonPorts = ref<Array<string | any>>([]);

    // Latest Most common Ports
    const LatestVulnerabilities = ref<Array<string | any>>([]);

    const getData = async () => {
      loading.value = true;
      setTimeout(() => loading.value = false, 500)
      return ApiService.get('/dashboard')
        .then(({ data }) => {
          // target
          target.value = data.count_target;
          // console.log(data)

          // subdomains
          subdomain.value = data.subdomains;
          subdomainLive.value = data.total_subdomain_live;

          // Services
          service.value = data.total_service;
          serviceOpen.value = data.open_service;
          serviceClone.value = data.close_service;

          // scan
          scan.value = data.total_scan;
          serviceHigh.value = data.total_scan_high;
          serviceMedium.value = data.total_scan_medium;
          serviceLow.value = data.total_scan_low;
          serviceInfo.value = data.total_scan_info;

          // Vulmerabilities by serverity
          vulnerableData.value = [data.total_scan_info, data.total_scan_low, data.total_scan_medium, data.total_scan_high];

          // Nhóm mục tiêu
          targetGroupLabels.value = Object.keys(data.target_group);
          targetGroupData.value = Object.values(data.target_group);

          // DB Leak
          DBLeak.value = data.db_leak

          // Most Vulnerable
          dataMostVulnerable.value.push(...data.most_vuls)

          // Hacker News
          HackerNews.value = data.hacker_new

          // Most common Ports 
          MostcommonPorts.value = data.top_service

          // Latest Most common Ports
          LatestVulnerabilities.value = data.last_vuls

          console.log(LatestVulnerabilities.value)

        })
        .catch(({ response }) => {
          notification(response.data.detail, 'error', 'Có lỗi xảy ra')
        });
    };

    const notification = (values: string, icon: string, more: string) => {
      Swal.fire({
        text: values ?? more,
        icon: icon,
        buttonsStyling: false,
        confirmButtonText: "Ok, got it!",
        heightAuto: false,
        customClass: {
          confirmButton: "btn btn-primary",
        },
      }).then(() => {
      });
    }


    onMounted(() => {
      getData();
    });

    return {
      getData,
      getAssetPath,
      serviceInfo,
      serviceLow,
      serviceMedium,
      serviceHigh,
      scan,
      serviceClone,
      serviceOpen,
      subdomain,
      subdomainLive,
      target,
      service,
      vulnerableLabels,
      vulnerableData,
      vulnerableColor,
      targetGroupColor,
      targetGroupData,
      targetGroupLabels,
      DBLeak,
      dataMostVulnerable,
      HackerNews,
      MostcommonPorts,
      LatestVulnerabilities,
    };
  },
});
</script>
