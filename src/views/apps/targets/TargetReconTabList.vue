<template>
    <!--begin::Navbar-->
    <div class="card mb-3">
        <!--begin::Card header-->
        <div class="card-header border-0 pt-6 position-absolute end-0 pe-1 " style="top: -80px;">
            <!--begin::Card toolbar-->
            <div class="card-toolbar">
                <div class="d-flex justify-content-end ">
                    <el-popconfirm confirm-button-text="Đồng ý" width="250" cancel-button-text="Không" icon="InfoFilled"
                        icon-color="#626AEF" title="Bạn có chắc muốn hủy chương trình quét này?" @confirm="confirmEvent"
                        @cancel="cancelEvent">
                        <template #reference>
                            <button type="button" :disabled="checkDisabled"
                                class="btn btn-sm fw-bold bg-danger btn-color-gray-700 btn-active-color-primary text-white">
                                <KTIcon icon-name="cross-square" icon-class="fs-2 text-white" />Hủy bỏ
                            </button>
                        </template>
                    </el-popconfirm>

                    <button v-if="scanStatus != 5" type="button" @click="handlePauser"
                        :disabled="(checkDisabled || scanStatus == 3)"
                        class="btn btn-sm btn-outline btn-outline-dashed fw-bold bg-body btn-color-gray-700 btn-active-color-danger  ms-2">
                        <KTIcon icon-name="bi bi-pause-fill text-danger" icon-class="fs-2 " />
                        <span class="text-danger">Tạm dừng</span>
                    </button>
                    <button v-else type="button" @click="handlePauser" :disabled="(checkDisabled)"
                        class="btn btn-sm btn-outline btn-outline-dashed fw-bold bg-body btn-color-gray-700 btn-active-color-primary  ms-2">
                        <KTIcon icon-name="bi bi-play-fill text-primary" icon-class="fs-2 " />
                        <span class="text-primary"> Tiếp tục</span>
                    </button>
                    <button type="button" :disabled="checkDisabled" @click="fileDownVisible = true"
                        class="btn btn-sm fw-bold bg-primary btn-color-gray-700 btn-active-color-primary ms-2 text-white">
                        <KTIcon icon-name="file-down" icon-class="fs-2 text-white" />
                        Xuất kết quả
                    </button>
                </div>
            </div>
            <!--end::Card toolbar-->
        </div>
        <!--end::Card header-->
        <div class="row px-2 h-50px align-items-center ">
            <div class="col-8 py-2 d-flex justify-content-start ">
                <div class="row">

                </div>
            </div>
            <div class="col-4 text-end ms-auto py-2">
                <div class="d-flex justify-content-end">

                    <!--begin::Select-->
                    <button type="button" @click="reloadData" :disabled="checkDisabled"
                        class="btn btn-sm w-100px h-35px fw-bold bg-primary btn-color-gray-700 btn-active-color-primary me-2 py-1 text-white">
                        <KTIcon icon-name="arrows-loop" icon-class="fs-2 text-white" />
                        Tải lại
                    </button>
                    <!--end::Select-->

                    <!--begin::Select-->
                    <el-select v-model="eventTime" class="d-block w-150px" height="40px" as="select">
                        <el-option value="300000" key="300000" label="5 phút" />
                        <el-option value="60000" key="60000" label="1 phút" />
                        <el-option value="30000" key="30000" label="30 giây" />
                        <el-option value="15000" key="15000" label="15 giây" />
                        <el-option value="5000" key="5000" label="5 giây" />
                    </el-select>
                    <!--end::Select-->
                </div>
            </div>
        </div>
    </div>
    <!--end::Navbar-->


    <!--begin::Card-->
    <div class="">
        <el-scrollbar>
            <el-row :gutter="10">
                <el-col :span="8">
                    <el-card shadow="hover" class="box-card rounded-3" :body-style="{ padding: '20px 15px' }">
                        <reconActivity :activities="activities"></reconActivity>
                    </el-card>
                </el-col>
                <el-col :span="16">
                    <el-row :gutter="10">
                        <el-col :span="6" class="mb-3">
                            <el-card shadow="hover" class="box-card rounded-3 h-100" :body-style="{ padding: '20px 10px' }">
                                <!--begin::Label-->
                                <div class="fs-7 text-muted fw-semobold">Subdomains</div>
                                <!--end::Label-->
                                <!--begin::Stat-->
                                <div class="d-flex align-items-center">
                                    <div class="fs-2x fw-bold me-2">650</div>
                                    <!--begin::Badge-->
                                    <span class="badge badge-light-success fs-base">
                                        <KTIcon icon-name="notification-bing" icon-class="fs-5 text-success ms-n1" />
                                        <span class="fs-7 text-success">12 Alive</span>
                                    </span>
                                    <!--end::Badge-->
                                </div>

                            </el-card>
                        </el-col>
                        <el-col :span="6" class="mb-3">
                            <el-card shadow="hover" class="box-card h-100 rounded-3" :body-style="{ padding: '20px 10px' }">
                                <!--begin::Label-->
                                <div class="fs-7 text-muted fw-semobold">Subdomains</div>
                                <!--end::Label-->
                                <!--begin::Stat-->
                                <div class="d-flex align-items-center">
                                    <div class="fs-2x fw-bold me-2">650</div>
                                    <!--begin::Badge-->
                                    <span class="badge badge-light-success fs-base">
                                        <KTIcon icon-name="notification-bing" icon-class="fs-5 text-success ms-n1" />
                                        <span class="fs-7 text-success">12 Alive</span>
                                    </span>
                                    <!--end::Badge-->
                                </div>

                            </el-card>
                        </el-col>
                        <el-col :span="6" class="mb-3">
                            <el-card shadow="hover" class="box-card h-100 rounded-3" :body-style="{ padding: '20px 10px' }">
                                <!--begin::Label-->
                                <div class="fs-7 text-muted fw-semobold">Subdomains</div>
                                <!--end::Label-->
                                <!--begin::Stat-->
                                <div class="">
                                    <div class="fs-2x fw-bold me-2">650</div>
                                </div>
                                <div>
                                    <span class="badge badge-light-primary me-1">Open: 17</span>
                                    <span class="badge badge-light-danger">Closed: 1</span>
                                </div>
                            </el-card>
                        </el-col>
                        <el-col :span="6" class="mb-3">
                            <el-card shadow="hover" class="box-card h-100 rounded-3" :body-style="{ padding: '20px 10px' }">
                                <!--begin::Label-->
                                <div class="fs-7 text-muted fw-semobold">Subdomains</div>
                                <!--end::Label-->
                                <!--begin::Stat-->
                                <div class="">
                                    <div class="fs-2x fw-bold me-2">650</div>
                                </div>
                                <!--begin::Stats-->
                                <div class="d-flex flex-wrap">
                                    <!--begin::Stat-->
                                    <div
                                        class="border border-gray-300 border-dashed rounded min-w-80px py-1 px-2 me-2 mb-2 ">
                                        <div class="fw-semobold fs-7 text-gray-800"><span
                                                class="text-info fw-bold fs-6">15</span> Địa chỉ Email</div>
                                    </div>
                                    <!--end::Stat-->

                                    <!--begin::Stat-->
                                    <div
                                        class="border border-gray-300 border-dashed rounded min-w-80px py-1 px-2 me-2 mb-2">
                                        <div class="fw-semobold fs-7 text-gray-800"><span
                                                class="text-info fw-bold fs-6">1</span> Credentials</div>
                                    </div>
                                    <!--end::Stat-->
                                </div>
                                <!--end::Stats-->
                            </el-card>
                        </el-col>
                    </el-row>
                    <el-row :gutter="10" class="h-100">
                        <el-col :span="12" class="mb-3 h-100">
                            <el-card shadow="hover" class="box-card rounded-3" :body-style="{ padding: '20px 10px' }">
                                <template #header>
                                    <div class="card-header">
                                        <span>Card name</span>
                                        <el-button class="button" text>Operation button</el-button>
                                    </div>
                                </template>
                                <div class="text item">
                                    <el-skeleton :rows="5" animated />
                                </div>
                            </el-card>
                        </el-col>
                        <el-col :span="12" class="mb-3 h-100">
                            <el-card shadow="hover" class="box-card rounded-3 h-100" :body-style="{ padding: '20px 10px' }">
                                <template #header>
                                    <div class="card-header">
                                        <span>Card name</span>
                                        <el-button class="button" text>Operation button</el-button>
                                    </div>
                                </template>
                                <div class="text item ">Lorem Ipsum is simply dummy text</div>
                            </el-card>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
        </el-scrollbar>



    </div>
    <!--end::Card-->


    <!-- // modoal  -->
    <el-dialog v-model="fileDownVisible" title="Xác nhận xuất file">
        <div class="card h-100 bg-secondary ">
            <!--begin::Card body-->
            <div class="card-body d-flex justify-content-center text-center flex-column p-8">
                <!--begin::Name-->
                <div class="symbol symbol-60px mb-5">
                    <KTIcon class="me-1" icon-name="document" icon-class="fs-4x text-success" />
                </div>
                <!--end::Image-->

                <!--begin::Title-->
                <div class="fs-5 fw-bold mb-2 text-dark"> {{ `Scan_${scanID}_report.xlsx` }} </div>
                <!--end::Name-->
            </div>
            <!--end::Card body-->
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="fileDownVisible = false">Hủy bỏ</el-button>
                <el-button type="primary" @click="downloadAcunetix">Tải về</el-button>
            </span>
        </template>
    </el-dialog>
</template>
  
<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref, onMounted, reactive, watch, onBeforeUnmount } from "vue";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import ApiService from "@/core/services/ApiService";
import Swal from "sweetalert2/dist/sweetalert2.js";
import filtersTabScan from "@/views/apps/targets/filtersTabScan.vue";
import CodeHighlighter from "@/components/highlighters/CodeHighlighter.vue";
import { useRoute } from 'vue-router';
import { debounce } from 'vue-debounce'
import { ElMessage } from 'element-plus'
import reconActivity from "@/views/apps/targets/reconWidgets/reconActivity.vue";

// import dayjs from 'dayjs';
import axios from 'axios'


interface APIData {
    title: string;
    description: string;
}

interface getData {
    last_seen: string;
    status: string;
    affects_url: string;
    vt_name: string;
    severity: string;
}

interface detailData {
    last_seen: string;
    status: string;
    affects_url: string;
    vt_name: string;
    severity: string | number;
}

interface targetData {
    created_at: string;
    modified_at: string;
    domain: string;
    group: string;
    id: string;
    ip: string;
    name: string;
}


export default defineComponent({
    name: "kt-scanstabs-list",

    components: {
        KTDatatable,
        filtersTabScan,
        CodeHighlighter,
        reconActivity,
    },
    setup() {
        const route = useRoute();
        const scanID = ref<null | number | any>(route.params.id ?? '');
        const list = ref<getData | any>()
        const loading = ref<boolean>(false)
        const apiData = ref<APIData>({
            title: '',
            description: '',
        });
        const activeName = ref('1')

        const targetData = ref<targetData>({
            created_at: '',
            modified_at: '',
            domain: '',
            group: '',
            id: '',
            ip: '',
            name: ''
        })
        const severityInfo = ref<number>(0)
        const progress = ref<number>(0)
        const checkStatus = ref<boolean>(false)
        const severityLow = ref<number>(0)
        const severityMedium = ref<number>(0)
        const severityHigh = ref<number>(0)
        const scanStatus = ref<number>(0)
        const filterSeverity = ref<number | null>(null)
        const timeEnd = ref<number | any>(null)
        const timeStart = ref<number | any>(null)


        const handleClick = (data: object | any, type: String) => {
            apiData.value.description = data.description;
        };


        const getData = async () => {
            loading.value = true;
            setTimeout(() => loading.value = false, 500)
            return ApiService.get(`/scan/detail/${scanID.value}`)
                .then(({ data }) => {
                    list.value = data.vulnerabilities;
                    // severity
                    severityInfo.value = data.severity_counts.info
                    severityLow.value = data.severity_counts.low
                    severityHigh.value = data.severity_counts.high
                    severityMedium.value = data.severity_counts.medium

                    // check
                    progress.value = data.progress
                    timeStart.value = data.scan_started_at
                    timeEnd.value = data.scan_finished_at
                    checkStatus.value = (data.scan_status == 3) ? true : false
                    scanStatus.value = data.scan_status
                    humanDiffTime()
                    showLocaleTime()
                    // console.log(countRequest.value)
                    // console.log(averageResponseTime.value)
                    // console.log(locations.value)
                    // console.log(maxResponseTime.value)
                    // console.log(data)
                    // console.log(new Date(timeEnd.value))
                    // console.log(new Date(timeStart.value))
                })
                .catch(({ response }) => {
                    notification(response.data.detail, 'error', 'Có lỗi xảy ra')
                });
        }


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
                // hideModal(ModalDelete.value);
                // hideModal( ModalConfirm.value);
            });
        };

        const handleSeverity = (data: number) => {
            if (data == 4) {
                filterSeverity.value = null
            } else {
                filterSeverity.value = data
            }
            getData();
        };

        const getSeverity = (severity: number | string) => {
            if (severity == 0 || severity == 'Info') {
                return { id: 0, title: 'Info', color: '#28a745', class: 'severityInfo' };
            } else if (severity == 1 || severity == 'Low') {
                return { id: 1, title: 'Low', color: '#23b7e5', class: 'severityLow' };
            } else if (severity == 2 || severity == 'Medium') {
                return { id: 2, title: 'Medium', color: '#fcba32', class: 'severityMedium' };
            } else if (severity == 3 || severity == 'High') {
                return { id: 3, title: 'High', color: '#e11f26', class: 'severityHigh' };
            }
            return { id: 4, title: 'undefined', color: '#7239ea', class: 'severityundefined' };
        };

        const getStatus = (status: string) => {
            if (status == 'open') {
                return { id: 3, title: 'Open', color: 'success' };
            } else if (status == 're-open') {
                return { id: 5, title: 'Reopen', color: 'primary' };
            } else if (status == 'closed') {
                return { id: 6, title: 'Close', color: 'danger' };
            } else if (status == 'rick-accepted') {
                return { id: 7, title: 'Accepted', color: 'info' };
            }
            return { id: 8, title: 'undefined', color: 'light' };
        };

        // reloadData
        const reloadgetData = () => {
            getData();
            ElMessage({
                message: 'Tải lại thành công',
                type: 'success',
                center: false,
            })
        };
        const reloadData = debounce(reloadgetData, 500);

        // tạm dừng
        // false - tạm dừng
        // true - tiếp tục
        const checkPauser = ref<boolean>(false);
        const checkDisabled = ref<boolean>(false);
        const handlePauser = async () => {
            checkPauser.value = !checkPauser.value
            checkDisabled.value = true
            setTimeout(() => {
                checkDisabled.value = false;
            }, 500);
            if (checkStatus.value) {
                ElMessage({
                    message: 'Danh dách đã được quét thành công không thể tạm dừng',
                    type: 'success',
                    center: false,
                })
            } else if (scanStatus.value == 5) {
                // console.log('tiếp tục')
                getResume()
            } else {
                // console.log('tạm dừng')
                getPauser()
            }

        };

        const getResume = async () => {
            const formData = {
                control_param: {
                    "action": 'continue'
                }
            }
            return ApiService.post(`/scan/${scanID.value}/control`, formData)
                .then(({ data }) => {
                    getData()
                    ElMessage({
                        message: data.detail ?? 'Tiếp tục thành công',
                        type: 'success',
                        center: false,
                    })
                })
                .catch(({ response }) => {
                    ElMessage({
                        message: response.data.detail ?? 'Có lỗi xảy ra',
                        type: 'error',
                        center: false,
                    })
                });
        };

        const getPauser = async () => {
            const formData = {
                control_param: {
                    "action": 'pause'
                }
            }
            return ApiService.post(`/scan/${scanID.value}/control`, formData)
                .then(({ data }) => {
                    getData()
                    ElMessage({
                        message: data.detail ?? 'Tạm dừng thành công',
                        type: 'success',
                        center: false,
                    })
                })
                .catch(({ response }) => {
                    ElMessage({
                        message: response.data.detail ?? 'Có lỗi xảy ra',
                        type: 'error',
                        center: false,
                    })
                });
        };

        // thời gian tự động chạy
        const timeAuto = ref<any>(null);

        const showLocaleTime = async () => {
            if (checkStatus.value || !checkPauser.value) {
                clearInterval(timeAuto.value);
                humanDiff();
            } else {
                clearInterval(timeAuto.value);
                timeAuto.value = setInterval(() => { humanDiff(); }, 1000);
            }
        };

        // tải về files
        const fileDownVisible = ref(false)
        const downloadAcunetix = async () => {
            axios({
                url: `/scan/${scanID.value}/download/v1`, //your url
                method: 'GET',
                responseType: 'blob', // important
            }).then((response) => {
                const href = URL.createObjectURL(response.data);
                const link = document.createElement('a');
                link.href = href;
                link.setAttribute('download', `Scan_${scanID.value}_report.xlsx`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(href);
                fileDownVisible.value = false;
            }).catch(async error => {
                // xử lý hiển thị lỗi 
                const reponse_message = JSON.parse(await error.response.data.text()).detail ?? "Có lỗi xảy ra"
                ElMessage({
                    message: reponse_message ?? 'Tạm dừng thành công',
                    type: 'success',
                    center: false,
                })
                fileDownVisible.value = false;
            })
        };
        // hủy
        const confirmEvent = () => {
            ElMessage({
                message: 'Test hủy',
                type: 'success',
                center: false,
            })
        }

        const cancelEvent = () => {
            ElMessage({
                message: 'Hủy bỏ lệnh thành công',
                type: 'info',
                center: false,
            })
        }

        // tính thời gian
        const diffTime = ref<string | any>(0);
        const time = ref<any>(null);
        const eventTime = ref<number | any>('30000');

        const humanDiff = async () => {
            let date1: any = (checkStatus.value == false) ? new Date() : new Date(timeEnd.value);
            let date2: any = new Date(timeStart.value);
            let diff = Math.max(date2, date1) - Math.min(date2, date1);
            let SEC = 1000, MIN = 60 * SEC, HRS = 60 * MIN;
            let hrs = Math.floor(diff / HRS);
            let min = Math.floor((diff % HRS) / MIN).toLocaleString('en-US', { minimumIntegerDigits: 1 });
            let sec = Math.floor(((diff % MIN) / SEC)).toLocaleString('en-US', { minimumIntegerDigits: 2 });
            if (hrs == 0) {
                return diffTime.value = min + 'm ' + sec + 's';
            }
            return diffTime.value = hrs + 'h ' + min + 'm ' + sec + 's';
        };

        const humanDiffTime = () => {
            checkDisabled.value = true
            setTimeout(() => {
                checkDisabled.value = false;
            }, 500);
            if (checkStatus.value || !checkPauser.value) {
                clearInterval(time.value);

                humanDiff();
            } else {
                clearInterval(time.value);
                humanDiff();
                time.value = setInterval(() => { getData(); humanDiff(); }, eventTime.value);
            }
        };
        watch(eventTime, humanDiffTime);


        onMounted(() => {
            getData();
            humanDiffTime();
        });

        onBeforeUnmount(() => {
            clearInterval(timeAuto);
            clearInterval(time);
        });

        const activities = ref([
            {
                content: 'Custom icon',
                timestamp: '2018-04-12 20:46',
                size: 'large',
                type: 'primary',
                icon: 'MoreFilled',
            },
            {
                content: 'Custom color',
                timestamp: '2018-04-03 20:46',
                color: '#0bbd87',
            },
            {
                content: 'Custom size',
                timestamp: '2018-04-03 20:46',
                size: 'large',
            },
            {
                content: 'Custom hollow',
                timestamp: '2018-04-03 20:46',
                type: 'primary',
                hollow: true,
            },
            {
                content: 'Default node',
                timestamp: '2018-04-03 20:46',
            },
            {
                content: '123',
                timestamp: '2018-04-03 20:46',
            },
            {
                content: '321',
                timestamp: '2018-04-03 20:46',
            },
        ]);

        return {
            activities,
            scanID,
            getData,
            list,
            getAssetPath,
            targetData,
            severityMedium,
            severityHigh,
            severityLow,
            severityInfo,
            handleSeverity,
            filterSeverity,
            activeName,

            // tải về
            fileDownVisible,
            downloadAcunetix,


            // crud
            apiData,
            handleClick,



            // sử lý dữ liệu
            getSeverity,
            getStatus,

            // filter
            loading,


            // reloadData
            reloadData,
            progress,
            checkStatus,
            diffTime,
            eventTime,
            checkPauser,

            // tạm dừng
            handlePauser,
            checkDisabled,
            scanStatus,

            // hủy 
            confirmEvent,
            cancelEvent,
        };
    },
});
</script>
  
<style>
.shadow-hvover {
    box-shadow: 5px 6px 10px -9px rgba(0, 0, 0, .3);
}
</style>
  