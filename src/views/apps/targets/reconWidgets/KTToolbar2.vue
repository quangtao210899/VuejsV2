<template>
    <div class="py-3 mb-5 bg-body" id="kt_subheader" style="box-shadow: 0px 10px 30px 0px rgba(82, 63, 105, 0.05);">
        <div id="kt_app_toolbar_container"
            class="app-container d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap" :class="{
                'container-fluid': toolbarWidthFluid,
                'container-xxl': !toolbarWidthFluid,
            }">
            <!--begin::Details-->
            <KTPageTitle @handle-search="handleSearch" :disabled="disabled" />
            <!--end::Details-->

            <!--begin::Toolbar-->
            <div class="d-flex align-items-center py-1">
                <!--begin::Button-->
                <template v-if="idsDelete.length == 0">
                    <router-link v-if="addNew != ''" :to="addNew" :disabled="disabled"
                        class="btn btn-light-primary font-weight-bold py-2 px-5 ml-2">
                        Thêm Mới
                    </router-link>
                </template>
                <template v-else>
                    <div class="d-flex justify-content-end align-items-center">
                        <div class="fw-bold me-5">
                            <span class="me-2">{{ idsDelete.length }}</span>Chọn
                        </div>
                        <el-tooltip class="box-item" effect="dark" hide-after="0" content="Xóa" placement="top">
                            <button type="button" @click="deleteSelectd()" :disabled="disabled"
                                class="btn btn-light-danger  btn-sm">
                                <KTIcon icon-name="detele" icon-class="bi bi-trash" :style="{ fontSize: '16px' }" />
                                Xóa mục đã chọn
                            </button>
                        </el-tooltip>
                    </div>
                </template>

                <!--end::Button-->
            </div>
            <!--end::Toolbar-->
        </div>
    </div>
</template>
  
<script lang="ts">
import { defineComponent, ref, markRaw, watch } from "vue";
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
    },
    emits: [
        "handle-delete-selectd",
        "handle-search"
    ],
    setup(props, { emit }) {
        const handleSearch = (search: any) => {
            emit("handle-search", search);
        }
        const deleteSelectd = () => {
            ElMessageBox.confirm(
                'Tập tin sẽ được xóa vĩnh viễn. Tiếp tục?',
                'Xác nhận xóa',
                {
                    confirmButtonText: 'Đồng ý',
                    cancelButtonText: 'Hủy bỏ',
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

        return {
            toolbarWidthFluid,
            deleteSelectd,
            handleSearch,
        };
    },
});
</script>
  