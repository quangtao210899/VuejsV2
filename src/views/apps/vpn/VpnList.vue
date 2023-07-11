<template>
  <div class="position-relative w-100 h-100">

    <div ref="mapContainer" id="mapContainer" class="h-100 w-100"></div>
    <div class="position-absolute top-0 start-0 z-index-1">
      <div class="w-300px bg-white rounded-3 m-2 shadow-map">
        <div class="p-5">
          <div class="mb-3 fs-8"
            :class="(connecting == true) ? 'Đang kết nối...' : ((infoStatus == 1) ? 'text-success' : 'text-danger')">
            <i class="fa-solid  me-1"
              :class="(infoStatus == 1) ? 'fa-lock-open text-success' : 'fa-lock text-danger'"></i>
            <span class="fw-bold text-uppercase">{{ (connecting == true) ? 'Đang kết nối...' : ((infoStatus == 1) ?
              'Đã kết nối' : 'Không kết nối') }} </span>
          </div>
          <div class="d-flex justify-content-between align-items-center mb-5">
            <h3>{{ (infoStatus == 1) ? infoCountry : 'Kết nối đến VPN' }}</h3>
            <el-tooltip :disabled="(infoStatus == 1 || loading == false || connecting == false) ? false : true"
              class="box-item" effect="dark" placement="top" :auto-close="0">
              <template #content>
                IP: {{ infoIp }}<br />
                Connect Time: {{ infoConnectTime }}<br />
                Check Time: {{ infoCheckTime }}<br />
              </template>
              <el-button :disabled="(infoStatus == 1) ? false : true" circle class="h-25px w-25px"><i
                  class="fa-solid fa-info"></i></el-button>
            </el-tooltip>
          </div>
          <div class="d-flex justify-content-between align-items-center">
            <el-button :disabled="(loading || connecting) ? true : false" type="primary" class="fs-6 px-14"
              @click=randomCountry>Kết nối nhanh</el-button>
            <el-button :disabled="(infoStatus == 0 || loading || connecting) ? true : false" @click="disConnectNordvpn"
              type="danger" link><i class="fa-solid fa-power-off fs-2 text-danger"></i></el-button>
            <el-button :disabled="(loading || connecting) ? true : false" @click="getStatus" type="primary" link>
              <i class="fa-solid fa-spinner fs-2 " :class="(loading) ? 'fa-spin text-warning' : 'text-success'"></i>
            </el-button>
          </div>
        </div>
        <div class="pb-5 border-top pt-5">
          <div class="mx-5">
            <el-select v-model="infoCountry" @change="changeCountry" :loading="loading" value-key="id" filterable
              placeholder="Select" class="w-100" :disabled="(loading || connecting) ? true : false">
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
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import L from 'leaflet';
import dataMap from "@/views/apps/vpn/dataMap.json";
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import ApiService from "@/core/services/ApiService";

export default {
  name: 'VpnComponent',

  setup() {
    // Khởi tạo một tham chiếu đến DOM element container để chứa bản đồ
    const mapContainer = ref<string | HTMLElement | any>(null);
    const map = ref<any>(null)
    const country = ref('Vietnam');
    const countryLoading = ref<string>('');
    const loading = ref<boolean>(false)
    const iconUrl = ref<string | undefined>(undefined)
    const markers = ref<any>([]);
    const connecting = ref<boolean>(false)
    const customIcon = L.icon({
      iconUrl: '/media/icons/duotune/vpn/123.png',
      iconSize: [35, 35], // Kích thước biểu tượng
      iconAnchor: [16, 16], // Vị trí neo của biểu tượng
      className: 'hoverIcon' // Lớp (class) cho biểu tượng
    });
    // Hàm khởi tạo bản đồ
    const initializeMap = () => {
      map.value = L.map(mapContainer.value, {
        zoomControl: false,
        worldCopyJump: false
      }).setView([21.028511, 105.804817], 4);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
        attribution: 'Map ETC',
        maxZoom: 8,
        minZoom: 2
      }).addTo(map.value);

      createMarkers();
    };

    // Hàm tạo các đánh dấu ban đầu trên bản đồ
    const createMarkers = () => {
      if (!map.value) {
        console.error('Bản đồ chưa được khởi tạo.');
        return;
      }

      dataMap.forEach((el, i) => {
        const customTooltipContent = (connecting.value) ? 'Đang kết nối đến ' + el.title + ' ...' : 'Kết nối ' + el.title
        const marker = L.marker({ lat: el.markerLatLng[0], lng: el.markerLatLng[1] }, { icon: customIcon })
          .addTo(map.value)
          .bindTooltip(customTooltipContent, {
            permanent: false,
            interactive: false,
            direction: 'top',
            className: 'py-2 px-6 fs-5 text-primary fw-bold',
            offset: [0, -16] as [number, number],
          });
        markers.value[i] = marker;
        marker.on('click', () => handleClickMap(el));
      });
    };

    // Hàm callback để chỉnh sửa các đánh dấu trên bản đồ
    const updateMarkers = (newloading: any, newconnecting: any, NewInfoStatus: any) => {
      if (!map.value) {
        console.error('Bản đồ chưa được khởi tạo.');
        return;
      }

      //console.log(newloading,newconnecting,NewInfoStatus  )
      const customIconConnecting = L.divIcon({
          className: customIcon.options.className,
          html: `<div class="position-relative h-100 w-100">
            <img class="h-100 w-100 z-index-1" src="/media/icons/duotune/vpn/123.png" alt="icon">
            <div class="position-absolute start-0 h-100 w-100" style="top: 1.1px">
              <div class="d-flex justify-content-center align-items-center h-100 w-100">
                <i class="fa-solid fa-circle-notch fa-spin text-primary fs-4 z-index-2"></i>
              </div>
            </div></div>`,
          iconSize: customIcon.options.iconSize,
          iconAnchor: customIcon.options.iconAnchor,
        });

        const customIconDisconnect= L.divIcon({
          className: customIcon.options.className,
          html: `<div class="position-relative h-100 w-100">
            <img class="h-100 w-100 z-index-1 opacity-50 bg-danger rounded-circle" src="/media/icons/duotune/vpn/123.png" alt="icon">
            <div class="position-absolute start-0 h-100 w-100" style="top: 1.1px">
              <div class="d-flex justify-content-center align-items-center h-100 w-100">
                <i class="fa-solid fa-circle-xmark text-danger fs-3 z-index-2 rounded-circle bg-white"></i>
              </div>
            </div></div>`,
          iconSize: customIcon.options.iconSize,
          iconAnchor: customIcon.options.iconAnchor,
        });

        const customIconConnect= L.divIcon({
          className: customIcon.options.className,
          html: `<div class="position-relative h-100 w-100">
            <img class="h-100 w-100 z-index-1 opacity-50 bg-success rounded-circle" src="/media/icons/duotune/vpn/123.png" alt="icon">
            <div class="position-absolute start-0 h-100 w-100" style="top: 1.1px">
              <div class="d-flex justify-content-center align-items-center h-100 w-100">
                <i class="fa-solid fa-circle-check text-success fs-3 z-index-2 rounded-circle bg-white"></i>
             </div>
            </div></div>`,
          iconSize: customIcon.options.iconSize,
          iconAnchor: customIcon.options.iconAnchor,
        });

      dataMap.forEach((el, i) => {
        // Kiểm tra nếu đánh dấu đã tồn tại, thực hiện chỉnh sửa
        if (markers.value[i]) {
          const marker = markers.value[i];
          if (newloading == true || newconnecting == true ) {
            if(countryLoading.value == el.title){
              //console.log(newconnecting, newloading, countryLoading.value, 2222);
              marker.setIcon(customIconConnecting);
            }
            marker.off('click');
          } else {
            if(countryLoading.value == el.title && NewInfoStatus == 0){
              marker.setIcon(customIconDisconnect);
            }else if(countryLoading.value == el.title && NewInfoStatus == 1){
              marker.setIcon(customIconConnect);
            }else{
              marker.setIcon(customIcon);
            }
            marker.on('click', () => handleClickMap(el));
          }
          // marker.setLatLng(el.markerLatLng);
          // marker.bindPopup(el.title);
        }else{
          console.error(' lỗi');
          return
        }
      });
    };


    const handleClickMap = (e: any) => {
      ElMessageBox.confirm(
        'Bạn có chắc muốn kết nối với ' + e.title + ' không?',
        'Kết nối với quốc gia ' + e.title,
        {
          confirmButtonText: 'Đồng ý',
          cancelButtonText: 'Quay lại',
          type: 'warning',
        }
      )
        .then(() => {
          ElMessage({
            type: 'success',
            message: 'Đang kết nối đến ' + e.title + '...',
          })
          connectNordvpn(e.title);
        })
        .catch(() => {
          // ElMessage({
          //   type: 'info',
          //   message: 'Disconnect',
          // })
        })
    };

    const infoCountry = ref<string>('')
    const infoStatus = ref<number>(0)
    const infoIp = ref<string>('')
    const infoCheckTime = ref<string>('')
    const infoConnectTime = ref<string>('')
    const getInfo = async () => {
      loading.value = true;
      return await ApiService.get(`nordvpn/info`)
        .then(({ data }) => {
          //console.log(data)
          infoCountry.value = (data.info == null) ? 'Vietnam' : data.info.country
          infoIp.value = (data.info == null) ? 'null' : data.info.ip
          infoConnectTime.value = (data.info == null) ? 'null' : data.info.connect_time
          infoCheckTime.value = (data.info == null) ? 'null' : data.info.check_time
          infoStatus.value = data.status
          countryLoading.value = (data.status  == 1 && data.info.country !== null) ? data.info.country : null
          if (data.info) {
            let country = data.info.country
            dataMap.forEach(element => {
              if (element['title'] == country) {
                map.value.setView(element['markerLatLng'], 4);
              }
            });
            //console.log(data)
          }
        })
        .catch(({ response }) => {
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
            title: 'Trạng thái Kết nối ',
            message: data.detail ?? 'Có lỗi xảy ra',
            type: (infoStatus.value == 0) ? 'error' : 'success',
          })
        })
        .catch(({ response }) => {
          ElNotification({
            title: 'Trạng thái Kết nối',
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
      countryLoading.value = country
      let form = { country: country }
      return await ApiService.post(`nordvpn/connect`, form)
        .then(({ data }) => {
          ElNotification({ 
            title: 'Trạng thái Kết nối',
            message: data.detail ?? 'Có lỗi xảy ra',
            type: 'success',
          })
          getInfo()
        })
        .catch(({ response }) => {
          ElNotification({
            title: 'Trạng thái Kết nối',
            message: response.data.detail ?? 'Có lỗi xảy ra',
            type: 'error',
          })
          getInfo()
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
          //console.log(data);
          ElNotification({
            title: 'Trạng thái Kết nối',
            message: data.detail ?? 'Có lỗi xảy ra',
            type: 'success',
          })
          getInfo();
          resetDataInfo();
        })
        .catch(({ response }) => {
          ElNotification({
            title: 'Trạng thái Kết nối',
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
      if (infoCountry.value) {
        connectNordvpn(infoCountry.value)
      }
    };

    const randomCountry = () => {
      if (dataMap) {
        const randomIndex = Math.floor(Math.random() * dataMap.length);
        const randomSubArray = dataMap[randomIndex];
        connectNordvpn(randomSubArray.title)
      }
    };

    const resetDataInfo = () => {
      infoCountry.value = '';
      infoStatus.value = 0;
      infoIp.value = '';
    };

    watch([loading, connecting, infoStatus], ([newloading, newconnecting, NewInfoStatus]) => {
      updateMarkers(newloading, newconnecting, NewInfoStatus)
    })

    onMounted(() => {
      initializeMap();
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
      infoCheckTime,
      infoConnectTime,
      getStatus,
      disConnectNordvpn,
      changeCountry,
      randomCountry,
    };
  }
};
</script>

<style >
/* Zoom In #1 */
.hoverIcon,
.hoverIcon2 {
  transition-duration: 0.1s;
}

.hoverIcon2:hover {
  margin-left: -25px !important;
  margin-top: -25px !important;
  height: 55px !important;
  width: 55px !important;
}

.hoverIcon:hover {
  margin-left: -21px !important;
  margin-top: -21px !important;
  height: 45px !important;
  width: 45px !important;
}

.shadow-map {
  box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
}</style>
