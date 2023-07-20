<template>
    <div class="py-2 bg-body position-fixed" id="kt_subheader" 
    style="box-shadow: 0px 10px 30px 0px rgba(82, 63, 105, 0.05) !important;width: -webkit-fill-available;;z-index:99">
        <div id="kt_app_toolbar_container"
            class="app-container d-flex align-items-center justify-content-between flex-wrap flex-sm-nowrap " :class="{
                'container-fluid': toolbarWidthFluid,
                'container-xxl': !toolbarWidthFluid,
            }">
            
            <!--begin::Details-->
            <KTPageTitle @form-submit="formSubmit" @form-back="formBack" @handle-search="handleSearch" :typeText="typeText" :disabled="disabled" :check-search="checkSearch" />
            <!--end::Details-->

            <!--begin::Toolbar-->
            <div class="d-flex align-items-center py-1">
                <router-link v-if="checkSubmit" :to="addNew" :disabled="disabled" @click="formBack"
                    class="btn btn-light font-weight-bold py-2 px-5 ">
                    Quay Lại
                </router-link>

                <router-link v-if="checkSubmit" :to="addNew" :disabled="disabled" @click="formSubmit"
                    class="btn btn-primary font-weight-bold py-2 px-5 ms-2">
                    Đồng Ý
                </router-link>

                <!--begin::Button-->
                <template v-if="idsDelete.length == 0">
                    <router-link v-if="addNew != ''" :to="addNew" :disabled="disabled"
                        class="btn btn-light-primary font-weight-bold py-2 px-5 ml-2">
                        Thêm
                    </router-link>
                </template>
                <template v-else>
                    <div class="d-flex justify-content-end align-items-center">
                        <div class="fw-bold me-5">
                            Đã Chọn <span class="me-1">{{ idsDelete.length }}</span>
                        </div>
                        <el-tooltip class="box-item" effect="dark" hide-after="0" content="Xóa" placement="top">
                            <button type="button" @click="deleteSelectd()" :disabled="disabled"
                                class="btn btn-light-danger  btn-sm">
                                <KTIcon icon-name="detele" icon-class="bi bi-trash" :style="{ fontSize: '16px' }" />
                                Xóa
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
        checkSearch: { type: Boolean, required: false, default: false },
        checkBack: { type: Boolean, required: false, default: false },
        checkSubmit: { type: Boolean, required: false, default: false },
        typeText: { type: String, required: false, default: '' },
    },
    emits: [
        "handle-delete-selectd",
        "handle-search",
        "form-back",
        "form-submit"
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
            formBack,
            formSubmit,
        };
    },
});
</script>
  