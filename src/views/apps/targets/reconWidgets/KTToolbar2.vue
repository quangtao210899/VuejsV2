<template>
    <div id="kt_app_header" class="h-50px custom-top-fixed"
        style="box-shadow: 0px 10px 30px 0px rgba(82, 63, 105, 0.05) !important;z-index:999 !important">
        <div class="py-1 bg-body custom-fixed-bar" id="kt_subheader"
            style="width: -webkit-fill-available ;position: fixed !important;z-index: 9 !important;">
            <div ref="divToMeasure" id="kt_app_toolbar_container" style="min-height: 43px;"
                class="app-container d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap "
                :class="{
                    'container-fluid': toolbarWidthFluid,
                    'container-xxl': !toolbarWidthFluid,
                }">

                <!--begin::Details-->
                <KTPageTitle @form-submit="formSubmit" @form-back="formBack" @handle-search="handleSearch"
                    :typeText="typeText" :disabled="disabled" :check-search="checkSearch" />
                <!--end::Details-->

                <!--begin::Toolbar-->
                <div class="d-flex align-items-center py-1 me-2">
                    <router-link v-if="checkSubmit" :to="addNew" :disabled="disabled" @click="formBack"
                        class="btn btn-light font-weight-bold py-2 px-5 fs-13px me-2">
                        Quay Lại
                    </router-link>

                    <router-link v-if="checkSubmit" :to="addNew" :disabled="disabled" @click="formSubmit"
                        class="btn btn-primary font-weight-bold py-2 px-5 fs-13px">
                        Đồng Ý
                    </router-link>

                    <!--begin::Button-->
                    <template v-if="idsDelete.length == 0">
                        <router-link v-if="checkSetting == true" to="#" :disabled="disabled"  @click="handleSetting"
                            class="btn btn-light-info font-weight-bold py-2 px-5 me-2 fs-13px">
                            Cấu Hình
                        </router-link>
                        <router-link v-if="checkSyncAll == true" to="#" :disabled="disabled" @click="handleSyncAll"
                            class="btn btn-light-success font-weight-bold py-2 px-5 me-2 fs-13px">
                            Đồng Bộ Tất Cả
                        </router-link>
                        <router-link v-if="addNew != ''" :to="addNew" :disabled="disabled"
                            class="btn btn-light-primary font-weight-bold py-2 px-5 fs-13px">
                            Thêm
                        </router-link>
                    </template>
                    <template v-else>
                        <div class="d-flex justify-content-end align-items-center">
                            <div class="fw-bold me-5 fs-13px">
                                Đã Chọn <span class="me-1">{{ idsDelete.length }}</span>
                            </div>
                            <button type="button" @click="deleteSelectd()" :disabled="disabled"
                                class="btn btn-light-danger fs-13px btn-sm">
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
</template>
  
<script lang="ts">
import { defineComponent, markRaw, ref, onMounted, onUnmounted, watch } from "vue";
import { toolbarWidthFluid } from "@/core/helpers/config";
import KTPageTitle from "@/views/apps/targets/reconWidgets/KTPageTitle2.vue";
import { ElMessageBox } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'

export default defineComponent({
    name: "layout-toolbar",
    components: {
        KTPageTitle,
        Delete,
    },
    props: {
        addNew: { type: String, required: false, default: '' },
        disabled: { type: Boolean, required: false, default: false },
        idsDelete: { type: Array, required: false, default: [] },
        checkSearch: { type: Boolean, required: false, default: false },
        checkBack: { type: Boolean, required: false, default: false },
        checkSubmit: { type: Boolean, required: false, default: false },
        checkSetting: { type: Boolean, required: false, default: false },
        checkSyncAll: { type: Boolean, required: false, default: false },
        typeText: { type: String, required: false, default: '' },
        headerHeight: { type: Number, required: false, default: 0 },
    },
    emits: [
        "handle-delete-selectd",
        "handle-search",
        "form-back",
        "form-submit",
        "on-header-height",
        "handle-sync-all",
        "handle-setting",
    ],
    setup(props, { emit }) {
        const handleSearch = (search: any) => {
            emit("handle-search", search);
        }
        const formBack = (back: any) => {
            emit("form-back", back);
        }
        const formSubmit = (submit: any) => {
            emit("form-submit", submit);
        }
        const deleteSelectd = () => {
            ElMessageBox.confirm(
                'Tập tin sẽ được xóa vĩnh viễn. Tiếp tục?',
                'Xác Nhận Xóa',
                {
                    confirmButtonText: 'Đồng Ý',
                    cancelButtonText: 'Hủy Bỏ',
                    type: 'warning',
                    icon: markRaw(Delete)
                }
            )
                .then(() => {
                    emit("handle-delete-selectd", props.idsDelete);
                })
                .catch(() => {
                    return;
                })
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

        const handleSyncAll = () => {
            emit("handle-sync-all");
        };
        const handleSetting = () => {
            emit("handle-setting");
        };
        return {
            toolbarWidthFluid,
            deleteSelectd,
            handleSearch,
            formBack,
            formSubmit,
            divToMeasure,
            handleSyncAll,
            handleSetting,
        };
    },
});
</script>

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
  