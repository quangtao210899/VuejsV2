<template>
  <div class="position-relative w-100 h-100">

    <div ref="mapContainer" class="h-100 w-100"></div>
    <div class="position-absolute top-0 start-0 z-index-1">
      <div class="w-300px bg-white rounded-3 m-2">
        <div class="p-5">
          <div class="mb-3 fs-8"
            :class="(connecting == true) ? 'CONNECTING...' : ((infoStatus == 1) ? 'text-success' : 'text-danger')">
            <i class="fa-solid  me-1"
              :class="(infoStatus == 1) ? 'fa-lock-open text-success' : 'fa-lock text-danger'"></i>
            <span class="fw-bold text-uppercase">{{ (connecting == true) ? 'CONNECTING...' : ((infoStatus == 1) ?
              'CONNECT' : 'NOT CONNECTED') }} </span>
          </div>
          <div class="d-flex justify-content-between align-items-center mb-5">
            <h3>{{ (infoStatus == 1) ? infoCountry : 'Connect to VPN' }}</h3>
            <el-tooltip :disabled="(infoStatus == 1 || loading == false || connecting == false) ? false : true" class="box-item" effect="dark"
              :content="`IP: ${infoIp}`" placement="top" :auto-close="0">
              <el-button :disabled="(infoStatus == 1) ? false : true" circle>IP</el-button>
            </el-tooltip>
          </div>
          <div class="d-flex justify-content-between align-items-center">
            <el-button :disabled="(loading || connecting) ? true : false" type="primary" class="fs-6 px-14" @click=randomCountry>Quick Connect</el-button>
            <el-button :disabled="(infoStatus == 0 || loading  || connecting ) ? true : false" @click="disConnectNordvpn" type="danger" link><i
                class="fa-solid fa-power-off fs-2 text-danger"></i></el-button>
            <el-button :disabled="(infoStatus == 0  || loading  || connecting ) ? true : false" @click="getStatus" type="primary" link>
              <i class="fa-solid fa-spinner fs-2 " :class="(loading) ? 'fa-spin text-warning' : 'text-success'"></i>
            </el-button>
          </div>
        </div>
        <div class="pb-5 border-top pt-5">
          <div class="mx-5">
            <el-select v-model="infoCountry" @change="changeCountry" value-key="id" placeholder="Select" class="w-100"
            :disabled="(infoStatus == 0  || loading  || connecting ) ? true : false">
              <el-option v-for="(item, key) in dataMap" :key="key" :label="item.title" :value="item.title" />
            </el-select>
          </div>
        </div>

      </div>

    </div>


  </div>
</template>

<script lang="ts">
import 'leaflet/dist/leaflet.css';
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import L from 'leaflet';
import dataMap from "@/views/apps/vpn/dataMap.json";
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import ApiService from "@/core/services/ApiService";

export default {

  setup() {
    // Khởi tạo một tham chiếu đến DOM element container để chứa bản đồ
    const mapContainer = ref(null);
    const map = ref<any>(null)
    const country = ref('Vietnam');
    const loading = ref<boolean>(false)
    const iconUrl = ref<string | undefined>(undefined)
    const markers = ref<any>([]);
    const connecting = ref<boolean>(false)

    // Sử dụng onMounted để thực hiện các hành động sau khi thành phần được gắn kết (mounted)
    onMounted(() => {
      // Khởi tạo bản đồ Leaflet và gắn nó vào DOM element container
      map.value = L.map(mapContainer.value).setView([21.028511, 105.804817], 5);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: 'OpenStreetMap', minZoom: 4, maxZoom: 8 }).addTo(map.value);
      //use a mix of renderers
      var customPane = map.value.createPane("customPane");
      var canvasRenderer = L.canvas({ pane: "customPane" });
      customPane.style.zIndex = 399; // put just behind the standard overlay pane which is at 400

      // tạo điểm
      dataMap.forEach((el, i) => {
        const customIcon = L.icon({
          iconUrl: '/media/icons/duotune/vpn/favpng_circle.png',
          iconSize: [32, 32], // Kích thước biểu tượng
          iconAnchor: [16, 16], // Vị trí neo của biểu tượng
          className: '' // Lớp (class) cho biểu tượng
        });
        const customTooltip = {
          permanent: false,
          interactive: false,
          direction: 'top',
          className: 'py-2 px-6 fs-5 text-primary fw-bold',
          offset: [0, -16],
        };
        const customTooltipContent = (connecting.value) ? 'Connecting to ' + el.title + ' ...' : 'Connect to ' + el.title

        const marker = L.marker(el.markerLatLng, { icon: customIcon }).addTo(map.value);
        marker.bindTooltip(customTooltipContent, customTooltip);
        markers.value[i] = marker;
        marker.on('click', () => handleClickMap(el));
      })

    });

    const handleClickMap = (e: any) => {
      ElMessageBox.confirm(
        'Bạn có chắc muốn kết nối với ' + e.title + ' không?',
        'Kết nối với quốc gia ' + e.title,
        {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning',
        }
      )
        .then(() => {
          ElMessage({
            type: 'success',
            message: 'Connecting with the ' + e.title + '...',
          })
          connectNordvpn(e.title);
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: 'Disconnect',
          })
        })
    };

    const infoCountry = ref<string>('')
    const infoStatus = ref<number>(0)
    const infoIp = ref<string>('')
    const getInfo = async () => {
      loading.value = true;
      return await ApiService.get(`nordvpn/info`)
        .then(({ data }) => {
          infoCountry.value = (data.info == null) ? 'Vietnam' : data.info.country
          infoIp.value = (data.info == null) ? 'null' : data.info.ip
          infoStatus.value = data.status
          console.log(data);
        })
        .catch(({ response }) => {
          console.log(response);

          ElNotification({
            title: 'Lỗi',
            message: (response == null || response == undefined) ? 'Có lỗi xảy ra' : 'Có lỗi xảy ra',
            type: 'error',
          })
        })
        .finally(() => {
          loading.value = false
        });
    };

    const getStatus = async () => {
      loading.value = true;
      let form = {}
      return await ApiService.post(`nordvpn/status`, form)
        .then(({ data }) => {
          ElNotification({
            title: 'Trạng thái Kết nối',
            message: data.detail ?? 'Có lỗi xảy ra',
            type: 'success',
          })
        })
        .catch(({ response }) => {
          ElNotification({
            title: 'error',
            message: response.detail ?? 'Có lỗi xảy ra',
            type: 'error',
          })
        })
        .finally(() => {
          loading.value = false
        });
    };

    const connectNordvpn = async (country: string) => {
      loading.value = true;
      connecting.value = true;
      let form = { country: country }
      return await ApiService.post(`nordvpn/connect`, form)
        .then(({ data }) => {
          console.log(data);
          ElNotification({
            title: 'Trạng thái Kết nối',
            message: data.detail ?? 'Có lỗi xảy ra',
            type: 'success',
          })
          getInfo()
        })
        .catch(({ response }) => {
          ElNotification({
            title: 'error',
            message: response.detail ?? 'Có lỗi xảy ra',
            type: 'error',
          })
        })
        .finally(() => {
          loading.value = false
          connecting.value = false;

        });
    };

    const disConnectNordvpn = async () => {
      loading.value = true;
      connecting.value = true;
      let form = { country: infoCountry.value }
      return await ApiService.post(`nordvpn/disconnect`, form)
        .then(({ data }) => {
          console.log(data);
          ElNotification({
            title: 'Trạng thái Kết nối',
            message: data.detail ?? 'Có lỗi xảy ra',
            type: 'success',
          })
          getInfo();
        })
        .catch(({ response }) => {
          ElNotification({
            title: 'error',
            message: response.detail ?? 'Có lỗi xảy ra',
            type: 'error',
          })
        })
        .finally(() => {
          loading.value = false
          connecting.value = false
        });
    };

    const changeCountry = () => {
      console.log(infoCountry.value)
      connectNordvpn(infoCountry.value)
    }

    const randomCountry = () => {
      if(dataMap){
        const randomIndex = Math.floor(Math.random() * dataMap.length);
        const randomSubArray = dataMap[randomIndex];
        connectNordvpn(randomSubArray.title)
      }
    }

    onMounted(() => {
      getInfo();
      getStatus();
    });

    onBeforeUnmount(() => {
      if (map.value) {
        map.value.remove();
      }
    });

    return {
      mapContainer,
      dataMap,
      country,
      iconUrl,
      infoStatus,
      infoCountry,
      infoIp,
      loading,
      connecting,
      getStatus,
      disConnectNordvpn,
      changeCountry,
      randomCountry,
    };
  }
};
</script>