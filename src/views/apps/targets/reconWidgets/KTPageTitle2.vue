<template>
    <div class="d-flex align-items-center flex-wrap py-1">

        <!--begin::Title-->
        <div v-if="pageTitleDisplay"
            :class="`page-title d-flex flex-${pageTitleDirection} justify-content-center flex-wrap me-3`">
            <template v-if="pageTitle">
                <!--begin::Title-->
                <!-- <h1 class="page-heading d-flex text-dark fw-bold fs-5 flex-column justify-content-center my-0" :class="(pageTitleDirection == 'row') ? 'me-5' : ''">
                    {{ pageTitle }}
                </h1> -->
                <!--end::Title-->

                <!--begin::Breadcrumb-->

                <ul v-if="breadcrumbs && pageTitleBreadcrumbDisplay"
                    class="breadcrumb breadcrumb-dot fw-semibold fs-7 my-0 pt-1">
                    <!--begin::Item-->
                    <li class="breadcrumb-item text-muted">
                        <router-link to="/" class="text-hover-danger text-primary fw-bold">Trang Chủ</router-link>
                    </li>
                    <!--end::Item-->
                    <template v-for="(item, i) in breadcrumbs" :key="i">
                        <li class="breadcrumb-item text-muted"
                            v-if="links && (i >= 0 && i < (<any>breadcrumbs).length - 1)">
                            <router-link :to="links[i]" class="text-hover-danger text-primary" v-if="links[i]">
                                {{ item }}
                            </router-link>
                            <router-link :to="linkToBack" class="text-hover-danger text-primary" v-else-if="linkToBack">
                                {{ item }}
                            </router-link>
                            <template v-else>
                                {{ item }}
                            </template>
                        </li>
                        <li class="breadcrumb-item text-muted" v-else>
                            <!-- {{ (typeText) ? typeText : item  }} -->
                            {{ (item == 'addForm') ? typeText : ((item == 'detail') ? 'Chi Tiết' : item) }}
                            {{ checkSitebarTitle }}
                            <span v-></span>
                        </li>
                    </template>
                </ul>
                <!--end::Breadcrumb-->
            </template>
        </div>
        <div v-else class="align-items-stretch"></div>
        <!--end::Title-->

        <!--begin::Separator-->
        <div v-if="checkSearch" class="bg-gray-300 h-25px w-1px me-6 ms-3 d-block"></div>
        <!--end::Separator-->

        <!--begin::Search Form-->
        <div class="d-flex align-items-center row">
            <!-- <el-input v-model="search" class="w-175px" placeholder="Tìm kiếm..." :suffix-icon="SearchIcon"
                :disabled="disabled" /> -->
            <div v-if="checkSearch" class="input-group input-group-sm input-group-solid my-1 px-0 col" style="max-width: 175px;border-radius: 4px !important;">
                <input type="text" class="form-control fs-13px h-35px" placeholder="Tìm kiếm..." v-model="search">
                <div class="input-group-append rounded-0 m-0 p-0 h-35px">
                    <span class="input-group-text rounded-end h-35px" 
                    style="border-top-left-radius: 0 !important;border-bottom-left-radius: 0 !important;">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </span>
                </div>
            </div>
            <div v-if="checkStatus" class="input-group input-group-sm input-group-solid my-1 px-0 col" style="max-width: 175px;">
                <el-select v-model="status" class="ms-2 me-1 my-select-filter fs-13px" placeholder="Select" >
                    <el-option key="" label="Trạng Thái" value="" />
                    <el-option key="open" label="Open" value="open" />
                    <el-option key="re-open" label="Reopen" value="re-open" />
                    <el-option key="closed" label="Closed" value="closed" />
                    <el-option key="rick-accepted" label="Accepted" value="rick-accepted" />
                </el-select>
            </div>
            <div v-if="checkStatus" class="input-group input-group-sm input-group-solid my-1 px-0 col" style="max-width: 175px;">
                <el-select v-model="severity" class="mx-1 my-select-filter fs-13px" placeholder="Select" >
                    <el-option key="" label="Mức Độ" value="" />
                    <el-option :key="0" label="Info" :value="0" />
                    <el-option :key="1" label="Low" :value="1" />
                    <el-option :key="2" label="Medium" :value="2" />
                    <el-option :key="3" label="High" :value="3" />
                </el-select>
            </div>
            <div v-if="checkStatus" class="input-group input-group-sm input-group-solid my-1 px-0 col" style="max-width: 175px;">
                <el-select v-model="authen" class="mx-1 my-select-filter fs-13px" placeholder="Select" >
                    <el-option key="" label="Xác Thực" value="" />
                    <el-option :key="0" label="Chưa Xác Thực" :value="0" />
                    <el-option :key="1" label="Đã Xác Thực" :value="1" />
                </el-select>
            </div>
        </div>
        <!--end::Search Form-->
    </div>
</template>
  
<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";
import { Search } from '@element-plus/icons-vue'

import {
    pageTitleBreadcrumbDisplay,
    pageTitleDirection,
    pageTitleDisplay,
} from "@/core/helpers/config";
import { useRoute } from "vue-router";
import { debounce } from 'vue-debounce'

export default defineComponent({
    name: "layout-page-title",
    components: { Search },
    props: {
        checkSitebarTitle: { type: String, required: false, default: '' },
        disabled: { type: Boolean, required: false, default: false },
        checkSearch: { type: Boolean, required: false, default: true },
        typeText: { type: String, required: false, default: '' },
        checkStatus: { type: Boolean, required: false, default: false },
    },
    emits: [
        'handle-search',
        "filert-status",
        "filert-authen",
        "filert-severity"
    ],
    setup(props, { emit }) {
        const SearchIcon = ref(Search)
        const search = ref('');

        // Hàm xử lý tìm kiếm
        const handleSearch = (newSearch: string) => {
            emit('handle-search', newSearch);
        };

        // Sử dụng watch kết hợp với debounce
        watch(
            () => search.value,
            debounce(handleSearch, 700)
        );
        const route = useRoute();
        const linkToBack = ref('');
        const pageTitle = computed(() => {
            return route.meta.pageTitle;
        });

        const breadcrumbs = computed(() => {
            return route.meta.breadcrumbs;
        });

        const links = computed<string[]>(() => {
            if (route.name == 'target-scanstab') {
                linkToBack.value = `/target-scans/${route.params['idScan']}`
            } else if (route.name == 'target-recon-tab') {
                linkToBack.value = `/target-recons/${route.params['idRecon']}`
            } else if (route.name == 'target-recon-tab-subdomains') {
                linkToBack.value = `/target-recons/${route.params['idRecon']}`
            } else if (route.name == 'targetDetectionListCVE') {
                linkToBack.value = `/cve/${route.params['idCVE']}/scan`
            } else if (route.name == 'targetDetectionListCVEAll') {
                linkToBack.value = `/cve/${route.params['id']}/scan`
            } else if (route.name == 'target-recon-add') {
                linkToBack.value = `/target-recons/${route.params['id']}`
            } else if (route.name == 'target-scan-add') {
                linkToBack.value = `/target-scans/${route.params['id']}`
            }

            return route.meta.links as string[];
        });

        const status = ref('')
        watch(status, (newStatus) => {
            emit("filert-status", newStatus);
        })
        const severity = ref('')
        watch(severity, (newSeverity) => {
            emit("filert-severity", newSeverity);
        })
        const authen = ref('')
        watch(authen, (newAuthen) => {
            emit("filert-authen", newAuthen);
        })

        return {
            pageTitle,
            breadcrumbs,
            links,
            linkToBack,
            pageTitleDisplay,
            pageTitleBreadcrumbDisplay,
            pageTitleDirection,
            SearchIcon,
            search,
            status,
            authen,
            severity,
        };
    },
});
</script>
<style>
.my-select-filter .el-input__wrapper {
    background: #f9f9f9;
    box-shadow: unset !important;
    padding: 2.5px 10px !important;
}

.my-select-filter .el-select .el-input.is-focus .el-input__wrapper{
    box-shadow: unset !important
}

.my-select-filter .el-input__wrapper.is-focus {
    box-shadow: unset !important
}
.el-input__inner{
    font-size: 13px !important;
    font-weight: 500;
    color: #5e6278;
    line-height: 20px;
}
</style>