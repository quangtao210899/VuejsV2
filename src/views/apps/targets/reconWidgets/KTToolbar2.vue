<template>
    <div id="kt_app_header" class="h-50px custom-top-fixed"
        style="box-shadow: 0px 10px 30px 0px rgba(82, 63, 105, 0.05) !important;z-index:999 !important">
        <div class="h-50px bg-body custom-fixed-bar" id="kt_subheader"
            style="width: -webkit-fill-available ;position: fixed !important;z-index: 9 !important;">
            <div ref="divToMeasure" id="kt_app_toolbar_container"
                class="app-container d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap " :class="{
                    'container-fluid': toolbarWidthFluid,
                    'container-xxl': !toolbarWidthFluid,
                }">

                <!--begin::Details-->
                <KTPageTitle @form-back="formBack" @handle-search="handleSearch" :check-status="checkStatus"
                    @filert-status="handleFilter" @filert-authen="handleFilterAuthen"
                    @filert-severity="handleFilterSeverity" :typeText="typeText" :disabled="disabled"
                    :check-search="checkSearch" :cve-code = "cveCode" :check-type-telegram="checkTypeTelegram" @handle-telegram="handleFilterTelegram"/>
                <!--end::Details-->

                <!--begin::Toolbar-->
                <div class="d-flex align-items-center me-2 h-50px">
                    <button v-if="checkSubmit" :to="addNew" :disabled="disabled || checkProxy" @click="formBack"
                        style="white-space: pre;"
                        class="btn btn-light font-weight-bold py-2 px-5 fs-13px me-2 d-flex justify-content-center align-items-center">
                        Quay Lại
                    </button>
                    <button v-if="checkSubmit" :to="addNew" :disabled="disabled || checkProxy" @click="formSubmit"
                        style="white-space: pre;"
                        class="btn btn-primary font-weight-bold py-2 px-5 fs-13px d-flex justify-content-center align-items-center">
                        Đồng Ý
                    </button>

                    <!--begin::Button-->
                    <template v-if="idsDelete.length == 0">
                        <button v-if="checkSetting == true" to="#" :disabled="disabled" @click="handleSetting"
                            style="white-space: pre;" class="btn btn-light-info font-weight-bold py-2 px-5 me-2 fs-13px">
                            <i class="fa-solid fa-gear"></i>
                            Cấu Hình
                        </button>
                        <button v-if="checkSyncAll == true" to="#" :disabled="disabled" @click="syncAllVisible = true"
                            style="white-space: pre;"
                            class="btn btn-light-success font-weight-bold py-2 px-5 me-2 fs-13px d-flex justify-content-center align-items-center">
                            <i class="fa-solid fa-rotate"></i>
                            Đồng Bộ Tất Cả
                        </button>
                        <!-- data-bs-target="#kt_modal_1" -->
                        <el-tooltip v-if="modalImport" class="box-item" effect="dark" :hide-after="0" content="Tải Lên Tài Khoản Rò Rỉ" placement="top">
                            <button type="button" class="btn btn-light-info font-weight-bold py-2 px-5  me-2 fs-13px d-flex justify-content-center align-items-center" data-bs-toggle="modal" :data-bs-target="modalImport">
                                <KTIcon icon-name="bi bi-upload" icon-class="fs-2"/>
                                Import
                            </button>
                        </el-tooltip>
                        <router-link v-if="addNew != ''" :to="addNew" :disabled="disabled" style="white-space: pre;"
                            class="btn btn-light-primary font-weight-bold py-2 px-5  me-2 fs-13px d-flex justify-content-center align-items-center">
                            <i class="fa-solid fa-circle-plus"></i>
                            Thêm
                        </router-link>
                        <!-- <router-link v-if="addTragetList != ''" :to="addTragetList" :disabled="disabled"
                            style="white-space: pre;"
                            class="btn btn-light-success font-weight-bold py-2 px-5  me-2 fs-13px d-flex justify-content-center align-items-center">
                            <KTIcon icon-name="document" icon-class="fs-2" />
                            Danh sách mục tiêu
                        </router-link> -->
                        <button v-if="checkScan == true" :disabled="disabled" @click="scanCVEVisible = true"
                            style="white-space: pre;"
                            class="btn btn-light-primary font-weight-bold py-2 px-5 fs-13px me-2 d-flex justify-content-center align-items-center">
                            <i class="fa-solid fa-circle-plus"></i>
                            Quét
                        </button>
                        <template v-if="dataInfoScans != null">
                            <el-popover :width="400"
                                popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;">
                                <template #reference>
                                    <button v-if="dataInfoScans != null" :disabled="disabled" style="white-space: pre;"
                                        :class="`btn-light-${getStatus(dataInfoScans.status).color}`"
                                        class="btn font-weight-bold py-2 px-5 fs-13px me-2 d-flex justify-content-center align-items-center">
                                        <i class="fa-solid fa-circle-info"></i>
                                        Thông Tin
                                    </button>
                                </template>
                                <template #default>
                                    <div class=" w-100 mb-4 ">
                                        <div class="text-center mt-5">
                                            <el-progress type="dashboard" striped-flow striped :stroke-width="13"
                                                :width="170" :percentage="+dataInfoScans.progress"
                                                :status="(dataInfoScans.status == 2) ? '' : getStatusProgress(dataInfoScans.status).color">
                                                <template #default="{ percentage }">
                                                    <span class="d-block fs-2">{{ percentage ?? 0 }}%</span><br>
                                                    <span class="d-block fs-13px">Progressing</span>
                                                </template>
                                            </el-progress>
                                        </div>
                                        <div class="my-2 text-center pb-5 fs-13px">
                                            <span class="fw-bold d-inline-block text-center fs-5">
                                                <span class="badge badge-light-primary">Mã CVE :</span>
                                                {{ dataInfoScans.cve_code }}
                                            </span>
                                        </div>
                                        <div class="row my-4 fs-13px">
                                            <span class=" col-5 fw-bold d-inline-block">Người Scan: </span>
                                            <span class="col-7">{{ dataInfoScans.username }}</span>
                                        </div>
                                        <div class="row my-4 fs-13px">
                                            <span class="fw-bold col-5  d-inline-block">Shodan Dock: </span>
                                            <span class="col-7">{{ dataInfoScans.shodan_dock }}</span>
                                        </div>
                                        <div class="row my-4 fs-13px">
                                            <span class="fw-bold col-5  d-inline-block">Thời gian bắt đầu: </span>
                                            <span class="col-7">{{ dataInfoScans.created_at }}</span>
                                        </div>
                                        <div class="row my-4 fs-13px">
                                            <span class="fw-bold col-5  d-inline-block">Thời gian kết thúc: </span>
                                            <span class="col-7">{{ dataInfoScans.modified_at }}</span>
                                        </div>
                                        <div class="row my-4 fs-13px">
                                            <span class="fw-bold col-5  d-inline-block">Trạng thái: </span>
                                            <span class="col-7">
                                                <span
                                                    :class="`badge p-3 badge-light-${getStatus(dataInfoScans.status).color}`">{{
                                                        getStatus(dataInfoScans.status).title }}</span>
                                            </span>
                                        </div>
                                        <div class="row my-4 fs-13px" v-if="dataInfoScans.status == 4">
                                            <span class="fw-bold col-5  d-inline-block">Chi tiết lỗi: </span>
                                            <span class="col-7">
                                                <template v-for="(value , key) in dataInfoScans.description.split('/n')" :key="key">
                                                    <span>{{ value }}</span>.
                                                </template>
                                            </span>
                                        </div>
                                    </div>
                                </template>
                            </el-popover>
                        </template>
                        <template v-if="checkControl == true">
                            <button v-if="statusCVE == 5" :disabled="disabled" style="white-space: pre;"
                                @click="confirmVisibleRestart = true"
                                class="btn btn-light-success font-weight-bold py-2 px-5 fs-13px me-2 d-flex justify-content-center align-items-center">
                                <KTIcon icon-name="bi bi-play-fill" icon-class="fs-2 " />
                                Tiếp Tục
                            </button>
                            <button v-else :disabled="(disabled || statusCVE != 2) ? true : false" style="white-space: pre;"
                                @click="confirmVisiblePauser = true"
                                class="btn btn-light-warning font-weight-bold py-2 px-5 fs-13px me-2 d-flex justify-content-center align-items-center">
                                <KTIcon icon-name="bi bi-pause-fill" icon-class="fs-2 " />
                                Tạm Dừng
                            </button>
                        </template>
                        <button v-if="checkExportFile == true" :disabled="disabled" @click="onExportFile"
                            style="white-space: pre;"
                            class="btn btn-light-primary font-weight-bold py-2 px-5 fs-13px d-flex justify-content-center align-items-center">
                            <i class="fa-solid fa-file-export"></i>
                            Xuất Kết Quả
                        </button>
                    </template>
                    <template v-else>
                        <div class="d-flex justify-content-end align-items-center" style="min-width: 200px !important;">
                            <div class="fw-bold me-5 fs-13px">
                                Đã Chọn <span class="me-1">{{ idsDelete.length }}</span>
                            </div>
                            <button type="button" @click="selectedVisible = true" :disabled="disabled"
                                style="white-space: pre;"
                                class="btn btn-light-danger fs-13px btn-sm d-flex justify-content-center align-items-center">
                                <KTIcon icon-name="detele" icon-class="bi bi-trash" :style="{ fontSize: '16px' }" />
                                Xóa
                            </button>
                        </div>
                    </template>

                    <!--end::Button-->
                </div>
                <!--end::Toolbar-->
            </div>
        </div>
    </div>

    <el-dialog v-model="selectedVisible" width="450px" id="modal-detail" modal-class="my-message-delete"
        :align-center="true" center :append-to-body="true" :show-close="false">
        <div class="text-center fs-13px">
            <template v-if="selectedName.length == 1">
                <span>Bạn có chắc chắn muốn xóa <span class="text-lowercase">{{ title }}</span> <strong>{{ selectedName[0]
                }}</strong> không?</span>
            </template>
            <template v-else>
                <span>Bạn có chắc chắn muốn xóa <strong>{{ idsDelete.length }}</strong> <span
                        class="text-lowercase">{{ title }}</span> này không?</span>
            </template>
        </div>
        <template #footer center>
            <span class="d-flex justify-content-center">
                <el-button class="border-0" plain type="primary" :disabled="disabled" @click="deleteSelectd()"
                    :loading=disabled>
                    Đồng ý
                </el-button>
                <el-button class="border-0" plain type="info" @click="selectedVisible = false">Hủy bỏ</el-button>
            </span>
        </template>
    </el-dialog>

    <el-dialog v-model="syncAllVisible" width="450px" id="modal-detail" modal-class="my-message-delete" :align-center="true"
        center :append-to-body="true" :show-close="false">
        <div class="text-center fs-13px">
            <span>Bạn có chắc chắn muốn đồng bộ hóa tất cả <strong class="text-lowercase">{{ title }}</strong> không?</span>
        </div>
        <template #footer center>
            <span class="d-flex justify-content-center">
                <el-button class="border-0" plain type="primary" :disabled="disabled" @click="handleSyncAll()"
                    :loading=disabled>
                    Đồng ý
                </el-button>
                <el-button class="border-0" plain type="info" @click="syncAllVisible = false">Hủy bỏ</el-button>
            </span>
        </template>
    </el-dialog>

    <el-dialog v-model="scanCVEVisible" width="450px" id="modal-detail" modal-class="my-message-delete" :align-center="true"
        center :append-to-body="true" :show-close="false">
        <div class="text-center fs-13px">
            <span>Bạn có chắc muốn <strong class="text-lowercase">{{ title }}</strong> <strong>CVE</strong> không?</span>
        </div>
        <template #footer center>
            <span class="d-flex justify-content-center">
                <el-button class="border-0" plain type="primary" :disabled="disabled" @click="handleSecurityScan()"
                    :loading=disabled>
                    Đồng ý
                </el-button>
                <el-button class="border-0" plain type="info" @click="scanCVEVisible = false">Hủy bỏ</el-button>
            </span>
        </template>
    </el-dialog>

    <el-dialog v-model="confirmVisiblePauser" width="auto" id="modal-detail" modal-class="my-message-delete"
        :align-center="true" center :append-to-body="true" :show-close="false">
        <div class="text-center fs-13px">
            <span>Bạn có muốn  <strong>tạm dừng</strong> scan này không?</span>
        </div>
        <template #footer center>
            <span class="d-flex justify-content-center">
                <el-button class="border-0" plain type="primary" :disabled="disabled" @click="handlePauser()"
                    :loading=disabled>
                    Đồng ý
                </el-button>
                <el-button class="border-0" plain type="info" @click="confirmVisiblePauser = false">Hủy bỏ</el-button>
            </span>
        </template>
    </el-dialog>

    <el-dialog v-model="confirmVisibleRestart" width="auto" id="modal-detail" modal-class="my-message-delete"
        :align-center="true" center :append-to-body="true" :show-close="false">
        <div class="text-center fs-13px">
            <span>Bạn có muốn  <strong>tiếp tục</strong> scan này không?</span>
        </div>
        <template #footer center>
            <span class="d-flex justify-content-center">
                <el-button class="border-0" plain type="primary" :disabled="disabled" @click="handleRestart()"
                    :loading=disabled>
                    Đồng ý
                </el-button>
                <el-button class="border-0" plain type="info" @click="confirmVisibleRestart = false">Hủy bỏ</el-button>
            </span>
        </template>
    </el-dialog>
</template>
  
<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, watch } from "vue";
import { toolbarWidthFluid } from "@/core/helpers/config";
import KTPageTitle from "@/views/apps/targets/reconWidgets/KTPageTitle2.vue";
import { Delete, QuestionFilled } from '@element-plus/icons-vue'

export default defineComponent({
    name: "layout-toolbar",
    components: {
        KTPageTitle,
        Delete,
        QuestionFilled,
    },
    props: {
        addNew: { type: String, required: false, default: '' },
        title: { type: String, required: false, default: 'mục' },
        selectedName: { type: Array, required: false, default: [] },
        statusCVE: { type: Number || null, required: false, default: null },
        addTragetList: { type: String, required: false, default: '' },
        modalImport: { type: String, required: false, default: '' },
        disabled: { type: Boolean, required: false, default: false },
        idsDelete: { type: Array, required: false, default: [] },
        dataInfoScans: { type: Object || null, required: false, default: null },
        checkControl: { type: Boolean, required: false, default: false },
        checkSearch: { type: Boolean, required: false, default: false },
        checkTypeTelegram: { type: Boolean, required: false, default: false },
        checkBack: { type: Boolean, required: false, default: false },
        checkProxy: { type: Boolean, required: false, default: false },
        checkStatus: { type: Boolean, required: false, default: false },
        checkSubmit: { type: Boolean, required: false, default: false },
        checkExportFile: { type: Boolean, required: false, default: false },
        checkScan: { type: Boolean, required: false, default: false },
        checkSetting: { type: Boolean, required: false, default: false },
        checkSyncAll: { type: Boolean, required: false, default: false },
        typeText: { type: String, required: false, default: '' },
        headerHeight: { type: Number, required: false, default: 0 },
        cveCode: {type: String, required: false, default: ''}
    },
    emits: [
        "handle-delete-selectd",
        "handle-search",
        "form-back",
        "form-submit",
        "on-header-height",
        "handle-sync-all",
        "handle-setting",
        "filert-status",
        "handle-security-scan",
        "handle-export-file",
        "handle-pauser",
        "handle-restart",
        "filert-authen",
        "filert-severity",
        "handle-telegram",
    ],
    setup(props, { emit }) {

        const scanCVEVisible = ref<boolean>(false)
        const handleSecurityScan = () => {
            scanCVEVisible.value = false
            emit("handle-security-scan");
        }
        const onExportFile = () => {
            emit("handle-export-file");
        }
        const confirmVisiblePauser = ref(false)
        const confirmVisibleRestart = ref(false)

        const handlePauser = () => {
            confirmVisiblePauser.value = false
            emit("handle-pauser");
        }
        const handleRestart = () => {
            confirmVisibleRestart.value = false
            emit("handle-restart");
        }
        const handleFilter = (data: any) => {
            emit("filert-status", data);
        }
        const handleFilterAuthen = (data: any) => {
            emit("filert-authen", data);
        }
        const handleFilterSeverity = (data: any) => {
            emit("filert-severity", data);
        }
        const handleSearch = (search: any) => {
            emit("handle-search", search);
        }
        const handleFilterTelegram = (type: any) => {
            emit("handle-telegram", type);
        }
        const formBack = (back: any) => {
            emit("form-back", back);
        }
        const formSubmit = (submit: any) => {
            emit("form-submit", submit);
        }
        const selectedVisible = ref(false)
        const deleteSelectd = () => {
            selectedVisible.value = false
            emit("handle-delete-selectd", props.idsDelete);
        };

        // đô chiều cao của thẻ devi.container
        const divToMeasure = ref<null | HTMLFormElement>(null);
        const height = ref(0);
        // Function to update the height value
        const updateHeight = () => {
            if (divToMeasure.value !== null) {
                height.value = divToMeasure.value.clientHeight - 28;
            }
        }; 

        watch(height, (newHeight) => {
            if (newHeight !== null) {
                emit("on-header-height", newHeight);
            }
        });

        // Event listener to update the height when the window is resized
        const onResize = () => {
            updateHeight();
        };

        onMounted(() => {
            // Initial measurement
            updateHeight();
            // Attach the event listener when the component is mounted
            window.addEventListener('resize', onResize);
        });

        onUnmounted(() => {
            // Remove the event listener when the component is unmounted
            window.removeEventListener('resize', onResize);
        });
        const syncAllVisible = ref(false)
        const handleSyncAll = () => {
            syncAllVisible.value = false
            emit("handle-sync-all");
        };
        const handleSetting = () => {
            emit("handle-setting");
        };
        const getStatus = (status: number | string) => {
            if (status == 1) {
                return { title: 'Chưa thực hiện', color: 'dark' };
            } else if (status == 2) {
                return { title: 'Đang thực hiện', color: 'primary' };
            } else if (status == 3) {
                return { title: 'Đã thực hiện', color: 'success' };
            } else if (status == 4) {
                return { title: 'Lỗi', color: 'danger' };
            }
            return { title: 'Lỗi', color: 'warning' };
        };
        const getStatusProgress = (status: number | string) => {
            if (status == 1) {
                return { color: '' };
            } else if (status == 2) {
                return { color: 'primary' };
            } else if (status == 3) {
                return { color: 'success' };
            } else if (status == 4) {
                return { color: 'exception' };
            }
            return { color: 'warning' };
        };
        const cancelEvent = () => {
        }

        return {
            toolbarWidthFluid,
            deleteSelectd,
            handleSearch,
            handleFilterTelegram,
            formBack,
            formSubmit,
            divToMeasure,
            handleSyncAll,
            handleSetting,
            handleFilter,
            handleSecurityScan,
            onExportFile,
            handleRestart,
            handlePauser,
            getStatus,
            getStatusProgress,
            cancelEvent,
            handleFilterAuthen,
            handleFilterSeverity,
            selectedVisible,
            syncAllVisible,
            scanCVEVisible,
            confirmVisiblePauser,
            confirmVisibleRestart,
        };
    },
});
</script>
<style lang="scss">
.my-message-delete .el-dialog__body {
    padding: 0 30px 10px 30px !important;
}
.my-select-filter .el-input__wrapper {
    color: var(--bs-gray-700) !important;
    background: var(--bs-gray-100);
}
</style>

<style lang="scss" scoped>

.custom-fixed-bar {
    box-shadow: rgba(33, 35, 38, 0.1) 0px 10px 10px -10px;
}

.custom-top-fixed {
    top: 60px !important;
}

// Small devices (landscape phones, 576px and up)
@media (min-width: 576px) {
    .custom-top-fixed {
        top: 60px !important;
    }
}

// Medium devices (tablets, 768px and up)
@media (min-width: 768px) {
    .custom-top-fixed {
        top: 60px !important;
    }
}

// Large devices (desktops, 992px and up)
@media (min-width: 992px) {
    .custom-top-fixed {
        top: 70px !important;
    }
}

// X-Large devices (large desktops, 1200px and up)
@media (min-width: 1200px) {
    .custom-top-fixed {
        top: 70px !important;
    }
}

// XX-Large devices (larger desktops, 1400px and up)
@media (min-width: 1400px) {
    .custom-top-fixed {
        top: 70px !important;
    }
}</style>
  