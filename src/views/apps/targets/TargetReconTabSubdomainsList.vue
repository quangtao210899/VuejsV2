<template>
        <!-- <div class="app-container container-fluid" :style="{marginTop: headerHeight + 'px'}"> -->
    <div class="card rounded-0 rounded-bottom ">
        <div class="position-absolute" style="top: -50px; right: 15px;">
            <div class="d-flex align-items-center">
                <div class="input-group input-group-sm input-group-solid" style="max-width: 175px">
                    <input type="text" class="form-control" placeholder="Tìm kiếm..."
                        v-model="searchSubdomain">
                    <div class="input-group-append">
                        <span class="input-group-text">
                            <i class="fa-solid fa-magnifying-glass"></i>
                        </span>
                    </div>
                </div>
            </div>
        </div>
        <div class="bg-body rounded-3 pt-3" >
            <!--begin::Card-->
            <div class="px-5">
                <el-table :data="subdomain_result" style="width: 100%;z-index: 1;" class-name="my-custom-table" table-layout="fixed"
                    v-loading="loadingSubdomain" element-loading-text="Đang Tải..." element-loading-background="rgb(255 255 255 / 25%)">
                    <template #empty>
                        <div class="flex items-center justify-center h-100%">
                            <el-empty description="Không có dữ liệu nào"/>
                        </div>
                    </template>
                    <el-table-column min-width="120" label-class-name="text-uppercase fs-13px fw-bold text-dark" prop="name" align="left"
                        label="Subdomains">
                        <template #default="scope">
                            <span class="fst-normal">
                                {{ (scope.row.name == '') ? '--' : scope.row.name }}</span> </template>
                    </el-table-column>
                    <el-table-column label-class-name="text-uppercase fs-13px fw-bold text-dark" prop="enpoint" align="left" label="Endpoints"
                        min-width="100">
                        <template #default="scope">
                            <span class="fs-13px fst-normal badge cursor-pointer"
                                @click="modelEndpoints(scope.row.enpoint_data, scope.row.name)"
                                :class="`badge-light-${(scope.row.enpoint == 0 || scope.row.directory == undefined) ? 'danger' : 'primary'}`">
                                {{ scope.row.enpoint ?? '0' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label-class-name="text-uppercase fs-13px fw-bold text-dark" prop="directory" label="Thư Mục" align="left"
                        min-width="100">
                        <template #default="scope">
                            <span class="fs-13px fst-normal badge cursor-pointer"
                                @click="modelDirectory(scope.row.directory_data, scope.row.name)"
                                :class="`badge-light-${(scope.row.directory == 0 || scope.row.directory == undefined) ? 'danger' : 'primary'}`">
                                {{ scope.row.directory ?? '0' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label-class-name="text-uppercase fs-13px fw-bold text-dark" prop="url_checked" align="left" label="URL Checked"
                        min-width="130">
                        <template #default="scope">
                            <template v-if="scope.row.url_checked == ''">
                                <span class="badge badge-light-danger">--</span>
                            </template>
                            <template v-else>
                                <span class="fst-normal" style="font-size: 13px;">{{ scope.row.url_checked
                                }}</span>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column label-class-name="text-uppercase fs-13px fw-bold text-dark" prop="status" label="Trạng Thái" align="left"
                        min-width="120">
                        <template #default="scope">
                            <span class="fst-normal" style="font-size: 13px;">
                                {{ (scope.row.status == '') ? '--' : scope.row.status }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label-class-name="text-uppercase fs-13px fw-bold text-dark" prop="title" label="Tiêu Đề" align="left"
                        min-width="130">
                        <template #default="scope">
                            <template v-if="scope.row.title == ''">
                                <span class="badge badge-light-danger">--</span>
                            </template>
                            <template v-else>
                                <span class="fst-normal" style="font-size: 13px;">{{ scope.row.title }}</span>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column label-class-name="text-uppercase fs-13px fw-bold text-dark" prop="ip" label="IP" align="left" min-width="100">
                        <template #default="scope">
                            <template v-if="scope.row.ip == ''">
                                <span class="badge badge-light-danger">--</span>
                            </template>
                            <template v-else>
                                <span class="fst-normal" style="font-size: 13px;">{{ scope.row.ip }}</span>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column label-class-name="text-uppercase fs-13px fw-bold text-dark" prop="portservice" label="Cổng Dịch Vụ" align="left"
                        min-width="150">
                        <template #default="scope">
                            <div>
                                <template
                                    v-if="scope.row.portservice == undefined || Object.keys(scope.row.portservice).length === 0">
                                    <span class="badge badge-light-danger">--</span>
                                </template>
                                <template v-else>
                                    <template v-for="(items, key) in scope.row.portservice" :key="key">
                                        <span v-if="key < 3 || expandedPortservice.includes(scope.$index)"
                                            class="badge badge-light-primary ms-1">{{ items }}</span>
                                    </template>
                                    <span v-if="Object.keys(scope.row.portservice).length > 3"
                                        @click="handlePortserviceMore(scope.$index)"
                                        class="badge badge-light ms-1 cursor-pointer">
                                        <template v-if="isRowExpandedPortservice(scope.$index)">Ẩn</template>
                                        <template v-else>
                                            <el-popover placement="right" width="280" trigger="hover" :hide-after="100">
                                                <template #reference>
                                                    <span>Thêm</span>
                                                </template>
                                                <div>
                                                    <span v-for="(el, elIndex) in scope.row.portservice.slice(3)"
                                                        :key="elIndex" class="badge badge-light-primary ms-1 mb-1">
                                                        {{ el }}
                                                    </span>
                                                </div>
                                            </el-popover>
                                        </template>
                                    </span>
                                </template>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label-class-name="text-uppercase fs-13px fw-bold text-dark" prop="technology" align="left"
                        label="Công Nghệ Sử Dụng" min-width="170">
                        <template #default="scope">
                            <div>
                                <template
                                    v-if="scope.row.technology == undefined || Object.keys(scope.row.technology).length === 0">
                                    <span class="badge badge-light-danger">--</span>
                                </template>
                                <template v-else>
                                    <template v-for="(items, key) in scope.row.technology" :key="key">
                                        <span v-if="key < 3 || expandedRowsTeachnology.includes(scope.$index)"
                                            class="badge badge-light-primary ms-1">{{ items }}</span>
                                    </template>
                                    <span v-if="Object.keys(scope.row.technology).length > 3"
                                        @click="handleTechnologyMore(scope.$index)"
                                        class="badge badge-light ms-1 cursor-pointer">
                                        <template v-if="isRowExpandedTechnology(scope.$index)">Ẩn</template>
                                        <template v-else>
                                            <el-popover placement="right" width="280" trigger="hover" :hide-after="100">
                                                <template #reference>
                                                    <span>Thêm</span>
                                                </template>
                                                <div>
                                                    <span v-for="(el, elIndex) in scope.row.technology.slice(3)"
                                                        :key="elIndex" class="badge badge-light-primary ms-1 mb-1">
                                                        {{ el }}
                                                    </span>
                                                </div>
                                            </el-popover>
                                        </template>
                                    </span>
                                </template>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label-class-name="text-uppercase fs-13px fw-bold text-dark" prop="dns_record" align="left" label="Bản Ghi DNS"
                        min-width="250">
                        <template #default="scope">
                            <template v-if="Object.values(scope.row.dns_record).length == 0">
                                <span class="badge badge-light-danger">--</span>
                            </template>
                            <template v-else>
                                <template v-for="(value, key) in scope.row.dns_record" :key="key">
                                    <li class="d-flex align-items-start mb-1">
                                        <span class="fw-bold text-capitalize fs-13px"
                                            style="white-space: nowrap; ">
                                            {{ key }}:
                                        </span>
                                        <span class="fst-normal ms-1" style="font-size: 13px;">
                                            {{ scope.row.dns_record[key].join(', ') }}
                                        </span>
                                    </li>
                                </template>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column label-class-name="text-uppercase fs-13px fw-bold text-dark" label="Cloud" align="left">
                        <template #default="scope">
                            <span class="badge badge-light-danger">--</span>
                        </template>
                    </el-table-column>
                    <el-table-column label-class-name="text-uppercase fs-13px fw-bold text-dark" label="CMS" align="left">
                        <template #default="scope">
                            <span class="badge badge-light-danger">--</span>
                        </template>
                    </el-table-column>
                    <el-table-column label-class-name="text-uppercase fs-13px fw-bold text-dark" prop="waf" label="WAF" align="left" min-width="100">
                        <template #default="scope">
                            <div class="flex-column">
                                <template v-if="scope.row.waf.length != 0">
                                    <span class="fst-normal fs-13px" style="font-size: 13px;">
                                        {{ scope.row.waf.join('; ') }}
                                    </span>
                                </template>
                                <template v-else>
                                    <span class="badge badge-light-danger">--</span>
                                </template>
                            </div>

                        </template>
                    </el-table-column>
                    <el-table-column label-class-name="text-uppercase fs-13px fw-bold text-dark" prop="cdn" label="CDN" align="left" min-width="100">
                        <template #default="scope">
                            <div class="flex-column">
                                <template v-if="scope.row.cdn.length">
                                        <span class="fst-normal fs-13px" style="font-size: 13px;">
                                            {{ scope.row.cdn.join('; ') }}
                                        </span>
                                </template>
                                <template v-else>
                                    <span class="badge badge-light-danger">--</span>
                                </template>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <div
                    class="d-flex justify-content-between align-items-center mx-auto w-100 py-5 bg-body rounded-bottom ">
                    <div v-if="totalSubdomain > 0">
                        <span class="text-capitalize fs-13px">Tổng Số Subdomains: {{ totalSubdomain }}</span>
                    </div>
                    <el-pagination background v-model:current-page="currentPageSubdomain" :hide-on-single-page="true"
                        :total="totalSubdomain" layout="'prev, pager, next'" :disabled="disabled"></el-pagination>
                        <div></div>
                </div>
            </div>
        </div>
        <div class="col-sm-12 col-md-4 text-end ms-auto py-2">
            <div class="d-flex justify-content-sm-start justify-content-md-end">
            </div>
        </div>
    </div>
    <el-dialog v-model="dialogDirectoryVisible"  :title="`${totalRecordsDirectoryTitle} Thự Mục Được Phát Hiện Với ${titleDirectory}`" width="1000" modal-class="custom-dialog">
        <div>
            <el-input v-model="searchDirectory" size="large" placeholder="Tìm kiếm" :prefix-icon="SearchIcon" />
            
        </div>
        <el-table :data="directory_data" style="width: 100%" height="443" class-name="my-custom-table" v-loading="loading" element-loading-text="Đang Tải..." element-loading-background="rgb(255 255 255 / 25%)">
            <template #empty>
                <div class="flex items-center justify-center h-100%">
                    <el-empty description="Không có dữ liệu nào"/>
                </div>
            </template>
            <el-table-column min-width="40" label-class-name="text-uppercase fs-13px fw-bold text-dark" label="STT">
                <template #default="scope">
                    <span class=" fst-normal">
                        {{ scope.row.index }}</span> </template>
            </el-table-column>
            <el-table-column min-width="90" label-class-name="text-uppercase fs-13px fw-bold text-dark" prop="name" label="Thư mục">
                <template #default="scope">
                    <span class=" fst-normal" :class="(scope.row.name == '') ? 'badge badge-light-danger' : '' ">
                        {{ (scope.row.name == '') ? '--' : scope.row.name }}</span> </template>
            </el-table-column>
            <el-table-column min-width="90" label-class-name="text-uppercase fs-13px fw-bold text-dark" prop="content_type" label="Content Type"
                align="center">
                <template #default="scope">
                    <span class=" fst-normal" :class="(scope.row.content_type == '') ? 'badge badge-light-danger' : '' ">
                        {{ (scope.row.content_type == '') ? '--' : scope.row.content_type }}</span> </template>
            </el-table-column>
            <el-table-column min-width="90" label-class-name="text-uppercase fs-13px fw-bold text-dark" prop="status" label="Trạng Thái"
                align="right">
                <template #default="scope">
                    <span class="badge  fst-normal"
                        :class="(scope.row.status == '200') ? 'badge-light-success' : 'badge-light-danger'">
                        {{ (scope.row.status == '') ? '--' : scope.row.status }}
                    </span>
                </template>
            </el-table-column>
        </el-table>
        <div class="d-flex justify-content-center mx-auto w-100 my-5">
            <el-pagination @current-change="handleCurrentChangeDirectory" background :hide-on-single-page="true"
                v-model:current-page="currentPageDirectory" v-model:page-size="pageSizeDirectory"
                :total="totalRecordsDirectory" layout="prev, pager, next"></el-pagination>
        </div>
    </el-dialog>

    <!-- modoal  -->
    <el-dialog v-model="dialogEndpointsVisible" :title="`${totalRecordsTitle} Endpoint Được Phát Hiện Với Subdomain ${titleEndpoints}`" width="1000" modal-class="custom-dialog">
        <div>
            <el-input v-model="searchEnpoint" size="large" placeholder="Tìm kiếm" :prefix-icon="SearchIcon" />
        </div>
        <el-table :data="enpoint_data" style="width: 100%" height="443" class-name="my-custom-table" v-loading="loading" element-loading-text="Đang Tải..." element-loading-background="rgb(255 255 255 / 25%)">
            <template #empty>
                <div class="flex items-center justify-center h-100%">
                    <el-empty description="Không có dữ liệu nào"/>
                </div>
            </template>
            <el-table-column min-width="40" label-class-name="text-uppercase fs-13px fw-bold text-dark" label="STT">
                <template #default="scope">
                    <span class=" fst-normal">
                        {{ scope.row.index }}</span> </template>
            </el-table-column>
            <el-table-column min-width="90" label-class-name="text-uppercase fs-13px fw-bold text-dark" prop="url" label="URL">
                <template #default="scope">
                    <span class=" fst-normal" v-if="scope.row.url != '' || scope.row.url != null">
                        <el-link class="" :underline="false" :href="scope.row.url" target="_blank">{{ scope.row.url
                        }}</el-link>
                    </span>
                    <span v-else class="badge badge-light-danger">--</span>

                </template>
            </el-table-column>
            <el-table-column min-width="60" label-class-name="text-uppercase fs-13px fw-bold text-dark" prop="params" label="Parameter"
                align="center">
                <template #default="scope">

                    <template v-if="Object.keys(scope.row.params).length == 0">
                        <span class="badge badge-light-danger ">--</span>
                    </template>
                    <template v-else>
                        <span v-for="(value, index) in scope.row.params" :index="index"
                            class="badge badge-light-primary  my-1 ms-1">{{ value }}</span>
                    </template>
                </template>
            </el-table-column>
            <el-table-column min-width="90" label-class-name="text-uppercase fs-13px fw-bold text-dark" prop="title" label="Tiêu Đề">
                <template #default="scope">
                    <template v-if="scope.row.title == ''">
                        <span class="badge badge-light-danger ">--</span>
                    </template>
                    <template v-else>
                        <span class=" fst-normal">
                        {{ scope.row.title }}</span>
                    </template>
                </template>
            </el-table-column>
            <el-table-column min-width="60" label-class-name="text-uppercase fs-13px fw-bold text-dark" prop="status_code" label="Trạng Thái"
                align="right">
                <template #default="scope">
                    <span class="badge  fst-normal"
                        :class="(scope.row.status_code == '200') ? 'badge-light-success' : 'badge-light-danger'">
                        {{ (scope.row.status == '') ? '--' : scope.row.status_code }}
                    </span>
                </template>
            </el-table-column>
        </el-table>
        <div class="d-flex justify-content-center mx-auto w-100 my-5">
            <el-pagination @current-change="handleCurrentChangeEndpoint" background :hide-on-single-page="true"
                v-model:current-page="currentPageEndpoints" v-model:page-size="pageSizeEndpoints" :total="totalRecords"
                layout="prev, pager, next"></el-pagination>
        </div>
    </el-dialog>
</template>
  
<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref, onMounted, onBeforeUnmount, watch , onUnmounted } from "vue";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import CodeHighlighter from "@/components/highlighters/CodeHighlighter.vue";
import { useRoute } from 'vue-router';
import { debounce } from 'vue-debounce'
import { Refresh, Search } from '@element-plus/icons-vue'
import KTToolbar from "@/views/apps/targets/reconWidgets/KTToolbar2.vue";

interface Targets {
    name: string;
    domain: string;
    group: {
        title: string;
    };
}

export default defineComponent({
    name: "kt-scanstabs-list",

    components: {
        KTDatatable,
        CodeHighlighter,
        KTToolbar,
    },
    props: {
        id: { type: Number, required: false, default: 0 },
        status: { type: Number, required: false, default: 0 },
        sudomains: { type: Object, required: false, default: {} },
    },
    setup(props) {
        const route = useRoute();
        const scanID = ref<null | number | any>(route.params.id ?? '');
        const list = ref<any>()
        const RefreshIcon = ref(Refresh)
        const SearchIcon = ref(Search)
        const loading = ref<boolean>(false)
        const loadingSubdomain = ref<boolean>(false)
        const reconStatus = ref<number>(0)
        const subdomain_result_full = ref<any>([])
        const subdomain_result = ref<any>([]);
        const disabled = ref<boolean>(false);
       
        const getData = () => {
            subdomain_result_full.value = Object.values(props.sudomains)
            reconStatus.value = props.status
            fetchDataSubdomain(currentPageSubdomain.value, pageSizeSubdomain.value)
        };

        // tính thời gian
        let intervalId : any;
        const checkDisabled = ref<boolean>(false);

        const stopTimer = () => {
            clearInterval(intervalId);
        };

        onBeforeUnmount(() => {
            stopTimer();
        });

        // xem thêm Teachnology
        const expandedRowsTeachnology = ref<any>([]);
        const handleTechnologyMore = (rowIndex: any) => {
            if (isRowExpandedTechnology(rowIndex)) {
                expandedRowsTeachnology.value = expandedRowsTeachnology.value.filter(
                    (row: any) => row !== rowIndex
                );
            } else {
                expandedRowsTeachnology.value.push(rowIndex);
            }
        };

        const isRowExpandedTechnology = (rowIndex: any) => {
            return expandedRowsTeachnology.value.includes(rowIndex);
        };

        // Portservice
        const expandedPortservice = ref<any>([]);
        const handlePortserviceMore = (rowIndex: any) => {
            if (isRowExpandedPortservice(rowIndex)) {
                expandedPortservice.value = expandedPortservice.value.filter(
                    (row: any) => row !== rowIndex
                );
            } else {
                expandedPortservice.value.push(rowIndex);
            }
        };

        const isRowExpandedPortservice = (rowIndex: any) => {
            return expandedPortservice.value.includes(rowIndex);
        };

        // sử lý phân trang subdomains
        const currentPageSubdomain = ref(1); // Trang hiện tại
        const pageSizeSubdomain = ref(10); // Số lượng hàng mỗi trang
        const totalSubdomain = ref(0); // Tổng số bản ghi
        const searchSubdomain = ref('')

        // Lắng nghe sự thay đổi của currentPage và pageSize
        watch([currentPageSubdomain, pageSizeSubdomain], ([newCurrentPage, newPageSize]) => {
            fetchDataSubdomain(newCurrentPage, newPageSize);
        });

        // search search
        watch(searchSubdomain, debounce(() => fetchDataSubdomain(1, pageSizeSubdomain.value), 500));

        const fetchDataSubdomain = (currentPages: number, pageSizes: number) => {
            loadingSubdomain.value = true
            const start = (currentPages - 1) * pageSizes;
            const end = start + pageSizes;
            const filterTableData = (searchSubdomain.value != null || searchSubdomain.value != '') ? subdomain_result_full.value.filter(
                (data: any) =>
                    !searchSubdomain.value ||
                    data.name.toLowerCase().includes(searchSubdomain.value.toLowerCase()) ||
                    data.title.toLowerCase().includes(searchSubdomain.value.toLowerCase()) ||
                    data.ip.toLowerCase().includes(searchSubdomain.value.toLowerCase())
            ) : subdomain_result_full.value
            subdomain_result.value = filterTableData.slice(start, end)
            totalSubdomain.value = Object.keys(filterTableData).length;
            loadingSubdomain.value = false
        };

        // modoal subdomains
        // detail subdmains

        const dialogDirectoryVisible = ref(false)
        const dialogEndpointsVisible = ref(false)
        const enpoint_data_full = ref<any>([])
        const enpoint_data = ref<any>([])
        const currentPageEndpoints = ref(1); // Trang hiện tại
        const pageSizeEndpoints = ref(10); // Số lượng hàng mỗi trang
        const pageSizeDirectory = ref(10); // Số lượng hàng mỗi trang
        const totalRecords = ref(0); // Tổng số bản ghi
        const totalRecordsTitle = ref(0); 
        const searchEnpoint = ref('')
        const titleEndpoints = ref('')

        // sử lý enpoint
        const modelEndpoints = (data: any, name) => {
            titleEndpoints.value = name
            dialogEndpointsVisible.value = true
            enpoint_data_full.value = (data == undefined || data == '') ? [] : data
            fetchDataEndpoints(currentPageEndpoints.value, pageSizeEndpoints.value)
        };

        // Lắng nghe sự thay đổi của currentPage và pageSize
        watch([currentPageEndpoints, pageSizeEndpoints], ([newCurrentPage, newPageSize]) => {
            fetchDataEndpoints(newCurrentPage, newPageSize);
        });

        // search searchEnpoint
        watch(searchEnpoint, debounce(() => {
            fetchDataEndpoints(1, pageSizeEndpoints.value)
        }, 500));
        watch([dialogEndpointsVisible, dialogDirectoryVisible], () => {
            searchDirectory.value = '';
            searchEnpoint.value = '';
            currentPageEndpoints.value = 1;
            currentPageDirectory.value = 1
        });

        const fetchDataEndpoints = (currentPages: number, pageSizes: number) => {
            loading.value = true
            const start = (currentPages - 1) * pageSizes;
            const end = start + pageSizes;
            totalRecordsTitle.value = enpoint_data_full.value.length
            const filterTableData = (searchEnpoint != null || searchEnpoint != '') ? enpoint_data_full.value.filter(
                (data: any) =>
                    !searchEnpoint.value ||
                    data.url.toLowerCase().includes(searchEnpoint.value.toLowerCase()) ||
                    data.status_code.toLowerCase().includes(searchEnpoint.value.toLowerCase()) ||
                    data.title.toLowerCase().includes(searchEnpoint.value.toLowerCase())
            ) : enpoint_data_full.value
            enpoint_data.value = filterTableData.slice(start, end).map((item: any, index: number) => {
                return {
                    ...item,
                    index: ((currentPages * pageSizes) - pageSizes) + (index + 1)
                };
            });
            totalRecords.value = Object.keys(filterTableData).length;
            loading.value = false
        };

        // Xử lý sự kiện thay đổi trang
        const handleCurrentChangeEndpoint = () => {
            loading.value = true;
            setTimeout(() => loading.value = false, 500)
        };

        // sử lý directory
        const directory_data = ref<any>([])
        const directory_data_full = ref<any>([])
        const currentPageDirectory = ref(1); // Trang hiện tại
        const totalRecordsDirectory = ref(0); // Tổng số bản ghi
        const totalRecordsDirectoryTitle = ref(0); // Tổng số bản ghi
        const searchDirectory = ref('')
        const titleDirectory = ref('')

        const modelDirectory = (data: any, name) => {
            titleDirectory.value = name
            dialogDirectoryVisible.value = true
            directory_data_full.value = (data == undefined || data == '') ? [] : data
            fetchDataDirectory(currentPageDirectory.value, pageSizeDirectory.value)
        };

        // Lắng nghe sự thay đổi của currentPage và pageSize
        watch([currentPageDirectory, pageSizeDirectory], ([newCurrentPage, newPageSize]) => {
            fetchDataDirectory(newCurrentPage, newPageSize);
        });

        // search searchEnpoint
        watch(searchDirectory, debounce(() => {
            fetchDataDirectory(1, pageSizeEndpoints.value)
        }, 500));

        const fetchDataDirectory = (currentPages: number, pageSizes: number) => {
            loading.value = true
            const start = (currentPages - 1) * pageSizes;
            const end = start + pageSizes;
            totalRecordsDirectoryTitle.value = directory_data_full.value.length
            const filterTableData = (searchDirectory != null || searchDirectory != '') ? Object.values(directory_data_full.value).filter(
                (data: any) =>
                    !searchDirectory.value ||
                    data.name.toLowerCase().includes(searchDirectory.value.toLowerCase()) ||
                    data.content_type.toLowerCase().includes(searchDirectory.value.toLowerCase()) ||
                    data.status.toLowerCase().includes(searchDirectory.value.toLowerCase())
            ) : Object.values(directory_data_full.value);
            directory_data.value = filterTableData.slice(start, end).map((item: any, index: number) => {
                return {
                    ...item,
                    index: ((currentPages * pageSizes) - pageSizes) + (index + 1)
                };
            });
            totalRecordsDirectory.value = Object.keys(filterTableData).length;
            loading.value = false
        };

        // Xử lý sự kiện thay đổi trang
        const handleCurrentChangeDirectory = () => {
            loading.value = true;
            setTimeout(() => loading.value = false, 500)
        }

        // tính toán chiều cao table
        const heightTable = ref(0)
        const checkPaginationTable = ref(false)
        const handleResize = () => {
            const windowWidth = window.innerWidth;

            if (windowWidth >= 1400) {
                heightTable.value = window.innerHeight - 357;
                checkPaginationTable.value = false
            } else if (windowWidth >= 1200) {
                heightTable.value = window.innerHeight - 357;
                checkPaginationTable.value = false
            } else if (windowWidth >= 992) {
                heightTable.value = window.innerHeight - 357;
                checkPaginationTable.value = false
            } else if (windowWidth >= 768) {
                heightTable.value = window.innerHeight - 327;
                checkPaginationTable.value = false
            } else if (windowWidth >= 576) {
                heightTable.value = window.innerHeight - 347;
                checkPaginationTable.value = false
            } else {
                // Kích thước cửa sổ nhỏ hơn 576px, đặt giá trị mặc định
                heightTable.value = window.innerHeight - 347;
                checkPaginationTable.value = true
            }
        };

        // check
        const checkNameTarget = (name: string, domain: string) => {
            if (name != '' && domain != '') {
                return name + ' - ' + domain;
            } else if(name != '' || domain != '') {
                if(name != ''){
                    return name
                }else{
                    return domain
                }
            }
            return '--'
        };

        // thay đổi kích thước header
        const headerHeight = ref<number>(0);
        const onheaderHeight = (height: number) => {
            headerHeight.value = height
        }

        onMounted(() => {
            setTimeout(() => {
                getData()
            }, 1000);
            handleResize();
            window.addEventListener('resize', handleResize);
        });

        onUnmounted(() => {
            window.removeEventListener('resize', handleResize);
        });

        return {
            headerHeight,
            onheaderHeight,
            checkNameTarget,
            scanID,
            list,
            getAssetPath,
            loading,

            // tạm dừng
            checkDisabled,
            reconStatus,
            subdomain_result,
            disabled,
            RefreshIcon,
            SearchIcon,
            handleTechnologyMore,
            isRowExpandedTechnology,
            expandedRowsTeachnology,
            handlePortserviceMore,
            isRowExpandedPortservice,
            expandedPortservice,

            // modoal
            dialogDirectoryVisible,
            dialogEndpointsVisible,
            modelDirectory,
            modelEndpoints,
            directory_data,
            enpoint_data,
            handleCurrentChangeEndpoint,
            handleCurrentChangeDirectory,
            currentPageEndpoints,
            totalRecords,
            pageSizeEndpoints,

            // Directory
            directory_data_full,
            currentPageDirectory,
            totalRecordsDirectory,
            pageSizeDirectory,

            // search
            searchEnpoint,
            searchDirectory,

            //subdomain
            searchSubdomain,
            totalSubdomain,
            pageSizeSubdomain,
            currentPageSubdomain,
            loadingSubdomain,
            heightTable,
            checkPaginationTable,
            titleDirectory,
            titleEndpoints,
            totalRecordsTitle,
            totalRecordsDirectoryTitle
        };
    },
});
</script>
