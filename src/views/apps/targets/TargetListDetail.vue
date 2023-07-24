<template>
    <KTToolbar></KTToolbar>
    <!--begin::Card-->
    <el-scrollbar :height="heightTable">
        <div class="app-container container-fluid mt-10 pt-10">
            <div class="card h-100 d-block bg-transparent">
                <div class="card px-5 mb-3 card-custom">
                    <div class="card-body p-0">
                        <!--begin::Details-->
                        <div class="w-100  mb-3">
                            <div class="row pt-3 lh-lg fs-13px">
                                <div v-if="targetData.name" class="col-sm-6 col-md-3 col-lg-3 col-12">
                                    <span class="w-70px text-capitalize">Mục tiêu: </span>
                                    <span class="fw-bold">{{ targetData.name }}</span>
                                </div>
                                <div v-if="targetData.group" class="col-sm-6 col-md-3 col-lg-3 col-12">
                                    <span class="w-70px text-capitalize">Nhóm mục tiêu: </span>
                                    <span class="fw-bold">{{ targetData.group }}</span>
                                </div>
                                <div v-if="targetData.ip" class="col-sm-6 col-md-3 col-lg-3 col-12">
                                    <span class="w-70px text-capitalize">Ip: </span>
                                    <span class="fw-bold">{{ targetData.ip }}</span>

                                </div>
                                <div v-if="targetData.domain" class="col-sm-6 col-md-3 col-lg-3 col-12">
                                    <span class="w-70px text-capitalize">Domain: </span>
                                    <span class="fw-bold">{{ targetData.domain }}</span>
                                </div>
                            </div>
                        </div>
                        <!--end::Details-->
                    </div>
                </div>
                <!--begin::Navbar-->
                <div class="card card-custom px-5 rounded-top border-bottom rounded-0 ">
                    <div class="card-body p-0 pt-3">
                        <!--begin::Content-->
                        <div class="d-flex overflow-auto h-55px">
                            <!--begin:::Tabs-->
                            <ul
                                class="nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bold flex-nowrap">
                                <!--begin:::Tab item-->
                                <li class="nav-item">
                                    <a class="nav-link text-active-primary pb-4 active" data-bs-toggle="tab"
                                        href="#kt_customer_view_overview_tab">Recon</a>
                                </li>
                                <!--end:::Tab item-->

                                <!--begin:::Tab item-->
                                <li class="nav-item">
                                    <a class="nav-link text-active-primary me-6" data-bs-toggle="tab"
                                        href="#kt_password_tab">Scans</a>
                                </li>
                                <!--end:::Tab item-->
                            </ul>
                            <!--end:::Tabs-->
                        </div>
                        <!--end::Content-->
                    </div>
                </div>
                <!--end::Navbar-->
                <!--begin:::Tab content-->
                <div class="tab-content " id="myTabContent">
                    <!--begin:::Tab pane-->
                    <div class="tab-pane fade show active" id="kt_customer_view_overview_tab" role="tabpanel">
                        <div>
                            <div class="card rounded-0 rounded-bottom ">
                                <!--begin::Card header-->
                                <div class="card-header border-0 px-5">
                                    <!--begin::Card title-->
                                    <div class="card-title">
                                        <h2>Profile</h2>
                                    </div>
                                    <!--end::Card title-->
                                </div>
                                <!--end::Card header-->

                                <!--begin::Card body-->
                                <div class="card-body pt-0 pb-5 px-5">
                                    <TargetReconTabList :reconId="reconId.data"></TargetReconTabList>
                                </div>
                                <!--end::Card body-->
                            </div>
                        </div>
                    </div>
                    <!--end:::Tab pane-->

                    <!--begin:::Tab pane-->
                    <div class="tab-pane fade" id="kt_password_tab" role="tabpanel">
                        <div>
                            <div class="card rounded-0 rounded-bottom position-relative">
                                <div class="position-absolute" style="top: -50px; right: 15px;">
                                    <div class="d-flex align-items-center">
                                        <!-- <el-input v-model="search" class="w-175px" placeholder="Tìm kiếm..." :suffix-icon="SearchIcon"
                                            :disabled="disabled" /> -->
                                        <div class="input-group input-group-sm input-group-solid" style="max-width: 175px">
                                            <input type="text" class="form-control" placeholder="Tìm kiếm..."
                                                v-model="search">
                                            <div class="input-group-append">
                                                <span class="input-group-text">
                                                    <i class="fa-solid fa-magnifying-glass"></i>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="bg-body px-5 d-flex">
                                    <div class="overflow-auto h-100" ref="containerscans"
                                        @mousedown="handleMouseDown"
                                        :style="classDetail ? { width: leftWidth + 'px' } : { width: '100%' }">
                                        <!--begin::Card body-->
                                        <el-table :data="getScansData" style="width: 100%"
                                            class-name=" my-custom-table rounded-top cursor-pointer mt-2" table-layout="fixed"
                                            v-loading="loading" highlight-current-row @current-change="handleCurrentChange">
                                            <template #empty>
                                                <div class="flex items-center justify-center h-100%">
                                                    <el-empty />
                                                </div>
                                            </template>

                                            <el-table-column width="80" label-class-name="fs-13px fw-bold text-dark"
                                                prop="severity" align="center" label="SEV">
                                                <template #default="scope">
                                                    <div class="text-center">
                                                        <KTIcon icon-name="severity" 
                                                        :icon-class="`bi bi-bug-fill fs-2 text-${getSeverity(scope.row.severity).color}`"/>
                                                        <br>
                                                        <p :class="`fst-normal my-0 fs-7 text-${getSeverity(scope.row.severity).color}`">
                                                            {{ getSeverity(scope.row.severity).title }}</p>
                                                    </div>
                                                </template>
                                            </el-table-column>

                                            <el-table-column label-class-name="fs-13px fw-bold text-dark" min-width="150"
                                                prop="vt_name" label="TÊN">
                                                <template #default="scope">
                                                    <span v-if="scope.row.vt_name != '' || scope.row.port_scan != ''"
                                                        class="fs-13px text-gray-700 text-hover-primary">
                                                        {{scope.row.vt_name ?? scope.row.port_scan["vt_name"] }}</span>
                                                    <span v-else class="badge badge-light-danger">--</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column min-width="150" label-class-name="fs-13px text-dark fw-bold"
                                                prop="hostname" label="HOST NAME">
                                                <template #default="scope">
                                                    <span v-if="scope.row.hostname != '' || scope.row.port_scan.hostname != ''"
                                                        class="fs-13px text-gray-700 text-hover-primary">
                                                        <i class="fa-solid fa-link fs-8"></i>
                                                        {{ scope.row.hostname }}</span>
                                                    <span v-else class="badge badge-light-danger">--</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column min-width="160" label-class-name="fs-13px text-dark fw-bold"
                                                prop="last_seen" label="NGÀY TẠO">
                                                <template #default="scope">
                                                    <span v-if="scope.row.last_seen != ''"
                                                        class="fs-13px text-gray-700 text-hover-primary">{{
                                                            scope.row.last_seen }}</span>
                                                    <span v-else class="badge badge-light-danger">--</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column min-width="120" label-class-name="fs-13px text-dark fw-bold"
                                                align="center" prop="status" label="TRẠNG THÁI">
                                                <template #default="scope">
                                                    <span v-if="scope.row.status != ''" class="badge fs-13px"
                                                        :class="`badge-light-${getStatus(scope.row.status).color}`">
                                                        {{ scope.row.status }}
                                                    </span>
                                                    <span v-else class="badge badge-light-danger">--</span>
                                                </template>
                                            </el-table-column>

                                        </el-table>
                                        <div
                                            class="d-flex justify-content-between align-items-center mx-auto w-100 py-5 bg-white rounded-bottom">
                                            <div>
                                                <span class="text-capitalize fs-13px">Tổng Số Scans: {{ totalPage }}</span>
                                            </div>
                                            <el-pagination background v-model:current-page="currentPage"
                                                :hide-on-single-page="true" v-model:page-size="itemsPerPage"
                                                :total="totalPage" layout="prev, pager, next"
                                                :disabled="disabled"></el-pagination>
                                            <div></div>
                                        </div>
                                    </div>
                                    <!--end::Card body-->
                                    <div v-if="classDetail" @mousedown="startDragging"
                                        class="drag-handle position-relative border-start">
                                        <div class="position-absolute top-0 start-50 translate-middle-x mt-1">
                                        </div>
                                    </div>
                                    <!--begin::Card2 body-->
                                    <div class="h-100 d-block"
                                        :style="classDetail ? { width: rightWidth + 'px' } : { width: '0px' }"
                                        :class="classDetail ? ' d-block' : 'd-none'">
                                        <div class="ms-3 pb-10 affix-container">
                                            <div class="card-title py-5 ">
                                                <h2 class="fw-bold pe-15 mt-5 fs-3">{{ detailData.vt_name }}</h2>
                                                <div  class="">
                                                    <a href="#" disabled class="btn btn-sm me-2 cursor-default" 
                                                    :class="`btn-${getSeverity(detailData.severity).color}`">
                                                        {{ getSeverity(detailData.severity).title }}
                                                    </a>
                                                    <a href="#" disabled class="btn btn-sm cursor-default" 
                                                    :class="`btn-${getStatus(detailData.status).color}`">
                                                        {{ getStatus(detailData.status).title }}
                                                    </a>
                                                </div>
                                                <div class="position-absolute translate-middle-y"
                                                    :style="{ top: '-130px', right: '10px' }">
                                                    <el-affix target=".affix-container" :offset="170">
                                                        <button @click="handleCloseDetail" type="button"
                                                            class="btn zindex-fixed btn-icon " :disabled="disabled">
                                                                <i class="fa-solid fa-xmark fs-1"></i>
                                                        </button>
                                                    </el-affix>
                                                </div>
                                            </div>
                                            <div class="lh-lg fs-13px">
                                                <div class="mb-5"
                                                    v-if="(detailData.url != null && detailData.url != '') || (detailData.parameter != null && detailData.parameter != '')">
                                                    <h4 class="text-gray-800 fs-6 fw-bold cursor-pointer mb-0">Vulnerable
                                                        URL</h4>
                                                    <div v-if="detailData.url != null && detailData.url != ''">
                                                        <span class="w-100">URL : </span>
                                                        <span class="ps-1">
                                                            <a target="_blank" :href="`${detailData.url}`"
                                                                class="text-primary">
                                                                <KTIcon icon-name="link" icon-class="bi bi-link-45deg"
                                                                    :style="{ fontSize: '16px' }" />
                                                                {{ detailData.url }}
                                                            </a>
                                                        </span>
                                                    </div>
                                                    <div v-if="detailData.parameter != null && detailData.parameter != ''">
                                                        <span class="w-100">Parameter : </span>
                                                        <span class="ps-1"> {{ detailData.parameter }}</span>
                                                    </div>
                                                </div>

                                                <div class="mb-5" v-if="detailData.tags != null && detailData.tags != ''">
                                                    <h4 class="text-gray-800 fs-13px fw-bold cursor-pointer mb-0">CVE/CWE</h4>
                                                    <div class="lh-base">
                                                        <template v-for="(tag, index) in detailData.tags" :key="index">
                                                            <li class="d-flex align-items-center py-2">
                                                                <span class="bullet bullet-vertical bg-success me-5"></span>
                                                                {{ tag }}
                                                            </li>
                                                        </template>
                                                    </div>
                                                </div>

                                                <div class="mb-5"
                                                    v-if="detailData.cvss_score != null && detailData.cvss_score != ''">
                                                    <h4 class="text-gray-800 fs-13px fw-bold cursor-pointer mb-0">CVSS Score
                                                    </h4>
                                                    <div>
                                                        <li class="d-flex align-items-center py-2">
                                                            <span class="bullet bg-warning me-5"></span>
                                                            <span>Base Score:<strong class="ps-2"> {{ detailData.cvss_score
                                                            }}</strong></span>
                                                        </li>
                                                    </div>
                                                </div>

                                                <div class="mb-5"
                                                    v-if="detailData.details != null && detailData.details != ''">
                                                    <h4 class="text-gray-800 fs-13px fw-bold cursor-pointer mb-0">Attack
                                                        Details</h4>
                                                    <div>
                                                        <div class="ps-1" v-html="detailData.details"></div>
                                                    </div>
                                                </div>

                                                <div class="mb-5"
                                                    v-if="detailData.in_cpe != null && detailData.in_cpe != ''">
                                                    <div class="d-flex align-items-end ">
                                                        <h4 class="text-gray-800 fs-13px lh-lg fs-13px fw-bold m-0 pe-2">In CPE :
                                                        </h4>
                                                        <span> {{ detailData.in_cpe }}</span>
                                                    </div>
                                                </div>

                                                <div class="mb-5"
                                                    v-if="detailData.protocol != null && detailData.protocol != ''">
                                                    <div class="d-flex align-items-end ">
                                                        <h4 class="text-gray-800 fs-13px lh-lg fs-13px fw-bold m-0 pe-2">Protocol
                                                            : </h4>
                                                        <span> {{ detailData.protocol }}</span>
                                                    </div>
                                                </div>

                                                <div class="mb-5"
                                                    v-if="detailData.service != null && detailData.service != ''">
                                                    <div class="d-flex align-items-end ">
                                                        <h4 class="text-gray-800 fs-13px lh-lg fs-13px fw-bold m-0 pe-2">Service :
                                                        </h4>
                                                        <span> {{ detailData.service }}</span>
                                                    </div>
                                                </div>

                                                <div class="mb-5" v-if="detailData.port != null && detailData.port != ''">
                                                    <div class="d-flex align-items-end">
                                                        <h4 class="text-gray-800 fs-13px lh-lg fs-13px fw-bold m-0 pe-2">Port :
                                                        </h4>
                                                        <span> {{ detailData.port }}</span>
                                                    </div>
                                                </div>

                                                <div class="mb-5" v-if="detailData.type != null && detailData.type != ''">
                                                    <div class="d-flex align-items-end ">
                                                        <h4 class="text-gray-800 fs-13px lh-lg fs-13px fw-bold m-0 pe-2">Service :
                                                        </h4>
                                                        <span> {{ detailData.type }}</span>
                                                    </div>
                                                </div>

                                                <div class="mb-5" v-if="detailData.url != null && detailData.url != ''">
                                                    <div class="d-flex align-items-end ">
                                                        <h4 class="text-gray-800 fs-13px lh-lg fs-13px fw-bold m-0 pe-2">URL :
                                                        </h4>
                                                        <span> {{ detailData.url }}</span>
                                                    </div>
                                                </div>

                                                <div class="mb-5"
                                                    v-if="detailData.references != null && detailData.references != ''">
                                                    <h4 class="text-gray-800 fs-13px fw-bold cursor-pointer mb-0">References
                                                    </h4>
                                                    <div class="lh-base">
                                                        <template v-for="(tag, index) in detailData.references"
                                                            :key="index">
                                                            <li class="d-flex align-items-center py-2 text-primary">
                                                                <span class="bullet bullet-vertical bg-primary me-5"></span>
                                                                {{ tag }}
                                                            </li>
                                                        </template>
                                                    </div>
                                                </div>

                                                <div class="mb-5"
                                                    v-if="detailData.classification != null && detailData.classification != ''">
                                                    <h4 class="text-gray-800 fs-13px fw-bold cursor-pointer mb-0">
                                                        Classification</h4>
                                                    <div class="lh-base">
                                                        <template v-for="(items, index) in detailData.classification"
                                                            :key="index">
                                                            <li class="d-flex align-items-center py-2">
                                                                <template v-if="items != null">
                                                                    <template v-if="Array.isArray(items)">
                                                                        <template v-for="(item, key) in items" :key="key">
                                                                            <span
                                                                                class="bullet bullet-vertical bg-primary me-5"></span>
                                                                            {{ index }} : {{ item }}<br>
                                                                        </template>
                                                                    </template>
                                                                    <template v-else>
                                                                        <span
                                                                            class="bullet bullet-vertical bg-primary me-5"></span>
                                                                        {{ index }} : {{ items }}<br>
                                                                    </template>
                                                                </template>
                                                            </li>
                                                        </template>
                                                    </div>
                                                </div>

                                                <div class="mb-5"
                                                    v-if="detailData.description != null && detailData.description != ''">
                                                    <h4 class="text-gray-800 fs-13px fw-bold cursor-pointer mb-0">Description
                                                    </h4>
                                                    <div>
                                                        <div class="ps-1" v-html="detailData.description"></div>
                                                    </div>
                                                </div>

                                            </div>

                                            <div class="">
                                                <div id="kt_detail_collapsible_scan">
                                                    <div class="py-1"
                                                        v-if="detailData.request != null && detailData.request != ''">
                                                        <div class="py-3 d-flex flex-stack flex-wrap">
                                                            <div class="d-flex align-items-center collapsible toggle collapsed"
                                                                data-bs-toggle="collapse"
                                                                data-bs-target="#kt_detail_collapsible_scan_1"
                                                                aria-expanded="false">
                                                                <div
                                                                    class="btn btn-sm btn-icon btn-active-color-primary ms-n3 me-2">
                                                                    <KTIcon icon-name="minus-square"
                                                                        icon-class="toggle-on text-primary fs-2" />
                                                                    <KTIcon icon-name="plus-square"
                                                                        icon-class="toggle-off fs-2" />
                                                                </div>

                                                                <div class="me-3">
                                                                    <h4 class="text-gray-800 fw-bold cursor-pointer mb-0">
                                                                        Request</h4>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div id="kt_detail_collapsible_scan_1" class="fs-13px px-2 collapse"
                                                            style="">
                                                            <div>
                                                                <CodeHighlighter lang="json">{{ detailData.request }}
                                                                </CodeHighlighter>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="separator separator-dashed"
                                                        v-if="detailData.request != null && detailData.request != ''"></div>

                                                    <div class="py-1"
                                                        v-if="detailData.http_response != null && detailData.http_response != ''">
                                                        <div class="py-3 d-flex flex-stack flex-wrap">
                                                            <div class="d-flex align-items-center collapsible toggle collapsed"
                                                                data-bs-toggle="collapse"
                                                                data-bs-target="#kt_detail_collapsible_scan_2">
                                                                <div
                                                                    class="btn btn-sm btn-icon btn-active-color-primary ms-n3 me-2">
                                                                    <KTIcon icon-name="minus-square"
                                                                        icon-class="toggle-on text-primary fs-2" />

                                                                    <KTIcon icon-name="plus-square"
                                                                        icon-class="toggle-off fs-2" />
                                                                </div>

                                                                <div class="me-3">
                                                                    <h4 class="text-gray-800 fw-bold cursor-pointer mb-0">
                                                                        Response</h4>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div id="kt_detail_collapsible_scan_2" class="collapse fs-13px px-2">
                                                            <div>
                                                                <CodeHighlighter lang="html">{{ detailData.http_response }}
                                                                </CodeHighlighter>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div class="separator separator-dashed"
                                                        v-if="detailData.http_response != null && detailData.http_response != ''">
                                                    </div>

                                                    <div class="py-1"
                                                        v-if="detailData.recommendation != null && detailData.recommendation != ''">
                                                        <div class="py-3 d-flex flex-stack flex-wrap">
                                                            <div class="d-flex align-items-center collapsible toggle collapsed"
                                                                data-bs-toggle="collapse"
                                                                data-bs-target="#kt_detail_collapsible_scan_3">
                                                                <div
                                                                    class="btn btn-sm btn-icon btn-active-color-primary ms-n3 me-2">
                                                                    <KTIcon icon-name="minus-square"
                                                                        icon-class="toggle-on text-primary fs-2" />
                                                                    <KTIcon icon-name="plus-square"
                                                                        icon-class="toggle-off fs-2" />
                                                                </div>

                                                                <div class="me-3">
                                                                    <h4 class="text-gray-800 fw-bold cursor-pointer mb-0">
                                                                        Resolution</h4>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div id="kt_detail_collapsible_scan_3" class="collapse fs-13px px-2">
                                                            <div>
                                                                {{ detailData.recommendation }}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <!--end::Card2 body-->
                                    <!--end::Card body-->
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--end:::Tab pane-->

                </div>
                <!--end:::Tab content-->
            </div>
        </div>
    </el-scrollbar>
    <!--end::Card-->
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive, watch, onUnmounted } from "vue";
import ApiService from "@/core/services/ApiService";
import { vue3Debounce } from 'vue-debounce';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { useRoute } from 'vue-router';
import KTToolbar from "@/views/apps/targets/reconWidgets/KTToolbar2.vue";
import TargetReconTabList from "@/views/apps/targets/TargetReconTabList.vue";
import { ElTable, ElTableColumn, ElPagination } from 'element-plus';
import { debounce } from 'vue-debounce'
import CodeHighlighter from "@/components/highlighters/CodeHighlighter.vue";

interface TargetData {
    name: string;
    ip: string;
    domain: string;
    group: string;
}

export default defineComponent({
    name: "kt-target-list",

    components: {
        ElTable,
        ElTableColumn,
        KTToolbar,
        TargetReconTabList,
        ElPagination,
        CodeHighlighter,
    },
    directives: {
        debounce: vue3Debounce({ lock: true })
    },
    setup() {
        const route = useRoute();
        const ID = ref<any>(route.params.id ?? '');
        const list = ref<object | any>([])
        const totalPage = ref<number>(0);
        const currentPage = ref<number>(1);
        const itemsPerPage = ref<number>(20);
        const loading = ref<boolean>(false)

        const targetData = reactive<TargetData>({
            name: '',
            group: '',
            ip: '',
            domain: '',
        });

        const scansData = ref<any>([])

        const reconId = reactive({ data: 0 });

        const getData = async () => {
            loading.value = true;
            return ApiService.get(`targets/${ID.value}/info`)
                .then(({ data }) => {
                    // target
                    targetData.name = data.target.name
                    targetData.domain = data.target.domain
                    targetData.group = data.target.group.title
                    targetData.ip = data.target.ip

                    // recon
                    reconId.data = data.recon.id

                    // scan
                    scansData.value = data.scans
                    fetchDataScans(currentPage.value, itemsPerPage.value)
                    // scansData.severity = data.scans.severity
                    // scansData.vt_name = data.scans.vt_name
                    // scansData.vuln_id = data.scans.vuln_id
                    // scansData.status = data.scans.status
                    // scansData.tags = data.scans.tags
                    // scansData.port_scan = data.scans.port_scan
                    // scansData.affects_url = data.scans.affects_url

                    console.log(data)
                })
                .catch(({ response }) => {
                    notification(response.data.detail, 'error', 'Có lỗi xảy ra')
                })
                .finally(() => {
                    loading.value = false
                })
        }

        // filter - phân trang - tìm kiếm
        const search = ref<string>('');
        const getScansData = ref<any>([]);
        const fetchDataScans = (currentPages: number, pageSizes: number) => {
            const start = (currentPages - 1) * pageSizes;
            const end = start + pageSizes;
            const filterTableData = (search.value === null || search.value === '') 
                ? scansData.value 
                : scansData.value.filter((data: any) => {
                    const vt_name = data.vt_name ?? (data.port_scan ? data.port_scan.vt_name : null);
                    const affects_url = data.affects_url ?? (data.port_scan ? data.port_scan.affects_url : null);
                    return !search.value ||
                        (vt_name && vt_name.toLowerCase().includes(search.value.toLowerCase())) ||
                        (affects_url && affects_url.toLowerCase().includes(search.value.toLowerCase()));
                });
            getScansData.value = filterTableData.slice(start, end)
            totalPage.value = Object.keys(filterTableData).length;
        };

        // Lắng nghe sự thay đổi của currentPage và pageSize
        watch([currentPage, itemsPerPage], ([newCurrentPage, newPageSize]) => {
            fetchDataScans(newCurrentPage, newPageSize);
        });

        // search search
        watch(search, debounce(() => {
            loading.value = true
            setTimeout(() => loading.value = false, 500)
            fetchDataScans(1, itemsPerPage.value)
        }, 500));

        const disabled = ref<boolean>(false);
        const notification = (values: string, icon: string, more: string) => {
            Swal.fire({
                text: values ?? more,
                icon: icon,
                buttonsStyling: false,
                confirmButtonText: "Đồng ý!",
                heightAuto: false,
                customClass: {
                    confirmButton: "btn btn-primary",
                },
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

        // check trạng thái
        const getStatus = (status: string) => {
            if (status === 'open') {
                return { id: 3, title: 'Open', color: 'success' };
            } else if (status === 're-open') {
                return { id: 5, title: 'Reopen', color: 'primary' };
            } else if (status === 'closed') {
                return { id: 6, title: 'Close', color: 'danger' };
            } else if (status === 'rick-accepted') {
                return { id: 7, title: 'Accepted', color: 'info' };
            }
            return { id: 8, title: 'undefined', color: 'light' };
        };

        const getSeverity = (severity: number | string) => {
            if (severity == 0) {
                return { id: 0, title: 'Info', color: 'success', class: 'severityInfo' };
            } else if (severity == 1) {
                return { id: 1, title: 'Low', color: 'primary', class: 'severityLow' };
            } else if (severity == 2) {
                return { id: 2, title: 'Medium', color: 'warning', class: 'severityMedium' };
            } else if (severity == 3) {
                return { id: 3, title: 'High', color: 'danger', class: 'severityHigh' };
            }
            return { id: 4, title: 'undefined', color: 'light', class: 'severityundefined' };
        };

        // chi tiết all
        const detailData = reactive({
            id: '',
            vt_name: '',
            severity: '',
            ip: '',
            hostname: '',
            schema: '',
            created_at: '',
            status: '',
            url: '',
            parameter: '',
            tags: '',
            cvss_score: '',
            details: '',
            description: '',
            request: '',
            http_response: '',
            recommendation: '',
            in_cpe: '',
            protocol: '',
            references: '',
            type: '',
            classification: '',
            port: '',
            service: '',
        });


        // handleCurrentChange
        const handleCurrentChange = (detail: any) => {
            // console.log(detail)
            if (detail) {
                closeOnRow.value = true;
                classDetail.value = true;
                for (const key in detailData) {
                    // Kiểm tra xem dữ liệu truyền vào có tồn tại và tương ứng với thuộc tính trong detailData hay không
                    if (detail.hasOwnProperty(key) || detail.port_scan) {
                    // Nếu có, gán giá trị vào obj detailData
                        // console.log(true)
                        detailData[key] = detail[key] ?? detail.port_scan[key];
                    } else {
                        // console.log(false)

                    // Nếu không, gán giá trị rỗng vào obj detailData
                    detailData[key] = '';
                    }
                }


                // detailData.vt_name = detail.vt_name ?? detail.port_scan.name;
                // detailData.status = detail.status;
                // detailData.severity = String(detail.severity);
                // detailData.created_at = detail.created_at;
                // detailData.hostname = (detail.hostname != null || detail.port_scan.hostname != null) ? (detail.hostname ?? detail.port_scan.hostname) : '';
                // detailData.ip = (detail.ip != null || detail.port_scan.in_cpe != null) ? detail.ip ?? detail.port_scan.in_cpe : '';
                // detailData.schema = (detail.schema != null || detail.port_scan.schema != null) ? (detail.schema ?? detail.port_scan.schema) : '';
                // detailData.url = detail.affects_url ?? '';
                // detailData.parameter = (detail.affects_detail != null || detail.port_scan.affects_detail != null) ? (detail.affects_detail ?? detail.port_scan.affects_detail) : '';
                // detailData.tags = (detail.tags != null || detail.port_scan.tags != null) ? (detail.tags ?? detail.port_scan.tags) : '' ;
                // detailData.cvss_score = (detail.cvss_score != null || detail.port_scan.cvss_score != null) ? (detail.cvss_score ?? detail.port_scan.cvss_score) : '';
                // detailData.details = (detail.details != null || detail.port_scan.details != null) ? (detail.details ?? detail.port_scan.details) : '';
                // detailData.description = (detail.description != null || detail.port_scan.description != null) ? (detail.description ?? detail.port_scan.description) : '';
                // detailData.request = (detail.request != null || detail.port_scan.request != null) ? (detail.request ?? detail.port_scan.request) : '';
                // detailData.http_response = (detail.http_response != null || detail.port_scan.http_response != null) ? (detail.http_response ?? detail.port_scan.http_response) : '';
                // detailData.recommendation = (detail.recommendation != null || detail.port_scan.recommendation != null) ? (detail.recommendation ?? detail.port_scan.recommendation) : '';

                // detailData.in_cpe = (detail.port_scan.in_cpe != null) ? detail.port_scan.in_cpe : '';
                // detailData.protocol = (detail.port_scan.protocol != null) ? detail.port_scan.protocol : '';
                // detailData.service = (detail.port_scan.service != null) ? detail.port_scan.service : '';
                // detailData.port = (detail.port_scan.port != null) ? detail.port_scan.port : '';
                // detailData.classification = (detail.port_scan.classification != null) ? detail.port_scan.classification : '';
                // detailData.type = (detail.port_scan.type != null) ? detail.port_scan.type : '';
                // detailData.references = (detail.port_scan.references != null) ? detail.port_scan.references : '';

            }
            // console.log(detailData)
            return;
        }

        const classDetail = ref<boolean>(false);
        const closeOnRow = ref(true);

        const handleCloseDetail = () => {
            classDetail.value = false;
            closeOnRow.value = false;
        };
        // chia màn hình
        const leftWidth = ref(window.innerWidth / 2);
        const rightWidth = ref(window.innerWidth / 2);
        let startX = ref<null | any>(null);

        const startDragging = (event: any) => {
            startX = event.clientX;
            const handleDragging = (e: any) => {
                const deltaX = e.clientX - startX;

                leftWidth.value += deltaX;
                rightWidth.value -= deltaX;

                startX = e.clientX;
            };

            const stopDragging = () => {
                window.removeEventListener("mousemove", handleDragging);
                window.removeEventListener("mouseup", stopDragging);
            };

            window.addEventListener("mousemove", handleDragging);
            window.addEventListener("mouseup", stopDragging);
        };

        // keos thar
        const containerscans = ref<any>(null);
        const CustomWidth = ref<boolean>(false);
        const state = reactive({
            isDragging: false,
            startX: 0,
            startScrollLeft: 0,
        });

        const handleMouseDown = (event: any) => {
            state.isDragging = true;
            state.startX = event.clientX;
            state.startScrollLeft = containerscans.value.scrollLeft;
            // console.log(state)
            // console.log(containerscans)

            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        };

        const handleMouseMove = (event: any) => {
            if (!state.isDragging) return;
            console.log(state , 'state')

            const deltaX = event.clientX - state.startX;
            containerscans.value.scrollLeft = state.startScrollLeft - deltaX;
        };

        const handleMouseUp = () => {
            state.isDragging = false;

            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };

        // Tính toán chiều rộng nội dung
        const contentWidth = ref(0);
        onMounted(() => {
            console.log(contentWidth.value, 'contentWidth')

            contentWidth.value = containerscans.value.scrollWidth;
        });

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
            list,

            // page 
            itemsPerPage,
            totalPage,
            currentPage,
            loading,
            disabled,
            handleResize,
            heightTable,
            handleCurrentChange,

            //
            targetData,
            reconId,
            getScansData,
            search,

            // check
            getStatus,
            getSeverity,

            // Dragging kéo lề
            startDragging,
            leftWidth,
            rightWidth,
            CustomWidth,

            // mouse down di chuột xuống
            handleMouseDown,
            contentWidth,
            containerscans,

            // detail
            handleCloseDetail,
            detailData,
            classDetail,
        };
    },
});
</script>
<style >
.my-custom-table td.el-table__cell {
    border-bottom-style: dashed !important;
}

.card.card-custom {
    box-shadow: 0px 0px 30px 0px rgba(82, 63, 105, 0.05) !important;
    -webkit-box-shadow: 0px 0px 30px 0px rgba(82, 63, 105, 0.05);
    border: 0;
}

/* cursor: col-resize; */
.drag-handle {
    flex-basis: 5px;
    background-color: unset;
    cursor: col-resize;
    position: relative;
}

.drag-handle:hover,
.drag-handle:active {
    background-color: rgba(211, 211, 211, 0.822);
}

.drag-handle::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 0px;
    background-color: black;
}
</style>