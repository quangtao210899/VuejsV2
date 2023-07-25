<template>
  <el-scrollbar :height="heightTable">
    <div class=" px-5 pt-5 h-100 w-100">
      <div class="row g-5 g-xl-10">
        <div class="col-6 col-md-3">
          <Widget1 className="h-md-100 h-lg-75 mb-5 mb-xl-10" description="Mục Tiêu" :target="target" bgColor="#F1416C"
            :bgImage="getAssetPath('media/patterns/vector-1.png')" />
        </div>
        <div class="col-6 col-md-3">
          <Widget2 className="h-md-100 h-lg-75 mb-5 mb-xl-10" :icon="false" :subdomain="subdomain"
            :liveSubdomain="subdomainLive" description="Subdomains" labelColor="dark" textColor="gray-300" />
        </div>

        <div class="col-6 col-md-3">
          <Widget3 className="h-md-100 h-lg-75 mb-5 mb-xl-10" :open="serviceOpen" :closed="serviceClone"
            description="Dịch Vụ" :services="service" />
        </div>

        <div class="col-6 col-md-3">
          <Widget4 bgColor="#0e367b" :bgImage="getAssetPath('media/patterns/pattern-2.jpg')"
            className="h-md-100 mb-5 mb-xl-10 h-lg-75" :scanHigh="serviceHigh" :scanMedium="serviceMedium"
            :scanLow="serviceLow" :scanInfo="serviceInfo" description="Lỗ Hổng Bảo Mật" :scan="scan" />
        </div>
      </div>

      <div class="row gx-5 gx-xl-10">
        <!--begin::Col-->
        <div class="col-xl-6 mb-5 mb-xl-10">
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
        <div class="col-xl-6">
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
          <Widget11 className="h-md-100" :MostcommonPortData="MostcommonPorts"
            :MostcommonPortLabels="MostcommonPortLabels" :MostcommonPortColor="MostcommonPortColor" />
        </div>
        <!--end::Col-->

        <!-- <div class="col-xl-6">
        <Widget13 className="h-md-100" />
      </div> -->
        <!--end::Col-->
      </div>
      <!--end::Row-->

      <!--begin::Row-->
      <div class="row g-5 g-xl-10">
        <!--begin::Col-->
        <div class="col-xl-12">
          <Widget12 className="h-md-100" :latestVulnerabilitiesData="LatestVulnerabilities" />
        </div>
        <!--end::Col-->
      </div>
      <!--end::Row-->
    </div>
  </el-scrollbar>
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref, onMounted, onUnmounted } from "vue";
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
import Widget13 from "@/components/dashboard-default-widgets/Widget13.vue";
interface typeMostcommonPorts {
  total_service: number;
  port: string;
  service: string;
}
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
    Widget13
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

    // Vulnerabilities by serverity
    const vulnerableLabels = ref(['Info', 'Low', 'Medium', 'High']);
    const vulnerableData = ref<number[]>([]);
    const vulnerableColor = ref(['#50cd89', '#009ef7', '#ffc700', '#f1416c']);

    // Nhóm mục tiêu
    const targetGroupLabels = ref<string[]>([]);
    const targetGroupData = ref<any>([]);
    const targetGroupColor = ref(['#67b7dc', '#6771dc', '#8067dc', '#a367dc', '#c767dc', '#dc67ce', '#dc67ab', '#dc6788', '#dc6967', '#dcaf67']);

    // DB Leak
    const DBLeak = ref<Array<string | any>>([]);

    //most_vuls
    const dataMostVulnerable = ref<Array<string | any>>([]);

    // Hacker News 
    const HackerNews = ref<Array<string | any>>([]);

    // Most common Ports 
    const MostcommonPorts = ref<Array<string | any>>([]);
    const MostcommonPortLabels = ref<Array<string | any>>([]);
    const MostcommonPortColor = ref<Array<string | any>>([]);

    // Latest Most common Ports
    const LatestVulnerabilities = ref<Array<string | any>>([]);

    const getData = async () => {
      loading.value = true;

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

          // Vulnerabilities by serverity
          vulnerableData.value = [data.total_scan_info, data.total_scan_low, data.total_scan_medium, data.total_scan_high];

          // Nhóm mục tiêu
          targetGroupLabels.value.push(...Object.keys(data.target_group))
          targetGroupData.value.push(...Object.values(data.target_group))

          // DB Leak
          DBLeak.value.push(...data.db_leak)

          // Most Vulnerable
          dataMostVulnerable.value.push(...data.most_vuls)

          // Hacker News
          HackerNews.value.push(...data.hacker_new)

          // Most common Ports 
          MostcommonPorts.value.push({ name: "Tổng ", data: data.top_service.map((el: typeMostcommonPorts) => el.total_service) })

          MostcommonPortColor.value.push('#67b7dc', '#6771dc', '#8067dc', '#a367dc', '#c767dc', '#dc67ce', '#dc67ab', '#dc6788', '#dc6967', '#dcaf67')
          MostcommonPortLabels.value.push(...data.top_service.map((el: typeMostcommonPorts) => ((el.port + "/" + el.service).length > 14) ? ([el.port, el.service]) : (el.port + "/" + el.service)))

          // Latest Most common Ports
          LatestVulnerabilities.value.push(...data.last_vuls)

          // console.log(targetGroupLabels.value)
          // console.log(MostcommonPortColor.value)
          // console.log(MostcommonPortLabels.value)

        })
        .catch(({ response }) => {
          notification(response.data.detail, 'error', 'Có lỗi xảy ra')
        })
        .finally(() => {
          loading.value = false
        });
    };

    const notification = (values: string, icon: string, more: string) => {
      Swal.fire({
        text: values ?? more,
        icon: icon,
        buttonsStyling: false,
        confirmButtonText: (icon == 'error') ? "Thử Lại" : "Đồng Ý",
        heightAuto: false,
        customClass: {
          confirmButton: (icon == 'error') ? "btn btn-light-danger" : "btn btn-light-primary",
        },
      }).then(() => {

      });
    }
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
      getData();
      handleResize();
      window.addEventListener('resize', handleResize);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', handleResize);
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
      MostcommonPortLabels,
      MostcommonPortColor,
      heightTable,
    };
  },
});
</script>
