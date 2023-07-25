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
                            
                        </li>
                    </template>
                </ul>
                <!--end::Breadcrumb-->
            </template>
        </div>
        <div v-else class="align-items-stretch"></div>
        <!--end::Title-->

        <!--begin::Separator-->
        <div  v-if="checkSearch" class="bg-gray-300 h-25px w-1px me-6 ms-3 d-block"></div>
        <!--end::Separator-->

        <!--begin::Search Form-->
        <div class="d-flex align-items-center">
            <!-- <el-input v-model="search" class="w-175px" placeholder="Tìm kiếm..." :suffix-icon="SearchIcon"
                :disabled="disabled" /> -->
            <div v-if="checkSearch" class="input-group input-group-sm input-group-solid" style="max-width: 175px">
                <input type="text" class="form-control" placeholder="Tìm kiếm..." v-model="search">
                <div class="input-group-append">
                    <span class="input-group-text">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </span>
                </div>
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
        disabled: { type: Boolean, required: false, default: false },
        search: { type: String, required: false, default: '' },
        checkSearch: { type: Boolean, required: false, default: true},
        typeText: { type: String, required: false, default: '' },
    },
    emits: ['handle-search'],

    setup(props, { emit }) {
        const SearchIcon = ref(Search)
        const search = ref(props.search);

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
            }
            else if (route.name == 'target-recon-tab') {
                linkToBack.value = `/target-recons/${route.params['idRecon']}`
            }
            else if (route.name == 'target-recon-tab-subdomains') {
                linkToBack.value = `/target-recons/${route.params['idRecon']}`
            }
            else if (route.name == 'targetDetectionListCVE') {
                linkToBack.value = `/cve/${route.params['idCVE']}/scan`
            } else if (route.name == 'targetDetectionListCVEAll') {
                linkToBack.value = `/cve/${route.params['id']}/scan`
            }
            return route.meta.links as string[];
        });


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
        };
    },
});
</script>