<template> 
    <KTToolbar :check-search="true" @handle-search="handleFilter" @on-header-height="onheaderHeight"></KTToolbar>
    <div class="app-container container-fluid h-100 " :style="{marginTop: headerHeight + 'px'}">
        <div class="mb-3 position-relative position-repository bg-white rounded-3 border card card-custom px-2">
            <!--begin::Card header-->
            <!--end::Card header-->
            <div class="d-md-none d-block py-3">
                <div class="row">
                    <div class="col-6">
                        <div>
                            <span class="w-70px">Mục Tiêu: </span>
                            <span class="fw-bold"
                                :class="(checkNameTarget(targetData.name, targetData.domain) == '--') ? 'badge badge-light-danger' : ''">
                                {{ checkNameTarget(targetData.name, targetData.domain) }}
                            </span>
                        </div>
                    </div>
                    <div class="col-6">
                        <div>
                            <span class="w-70px">IP Mục Tiêu: </span>
                            <span class="fw-bold" :class="(targetData.ip == '') ? 'badge badge-light-danger' : ''">
                                {{ (targetData.ip != '') ? targetData.ip : '--' }}
                            </span>
                        </div>
                    </div>
                    <div class="col-12 d-flex justify-content-sm-start justify-content-between mt-2">
                        <div class="">
                            <el-tooltip class="box-item" effect="dark" hide-after="0" content="Thông tin tiến trình"
                                placement="top">
                                <button type="button"
                                    class="btn btn-sm fw-bold bg-secondary btn-color-gray-700 w-70px px-1 btn-active-color-primary"
                                    data-kt-menu-trigger="click" data-kt-menu-placement="bottom-start"
                                    data-kt-menu-flip="top-start">
                                    <KTIcon icon-name="information-3" icon-class="fs-2" />
                                    Info
                                </button>
                                <!-- </div> -->
                            </el-tooltip>
                            <filtersTabScan @filterData="handleFilter" :targetData="targetData" :diffTime="diffTime"
                                :countRequest="countRequest" :averageResponseTime="averageResponseTime"
                                :locations="locations" :progress="progress" :scanStatus="scanStatus">
                            </filtersTabScan>
                        </div>
                        <el-popconfirm confirm-button-text="Đồng ý" width="250" cancel-button-text="Không" icon="InfoFilled"
                            icon-color="#626AEF" title="Bạn có chắc muốn hủy chương trình quét này?" @confirm="confirmEvent"
                            @cancel="cancelEvent">
                            <template #reference>
                                <button type="button" :disabled="checkDisabled"
                                    class="btn btn-sm fw-bold bg-danger btn-color-gray-700 btn-active-color-primary w-70px px-1 ms-1 ms-sm-2 text-white">
                                    <KTIcon icon-name="cross-square" icon-class="fs-2 text-white" />Hủy Bỏ
                                </button>
                            </template>
                        </el-popconfirm>
                        <button v-if="scanStatus == 5" type="button" @click="handlePauser"
                            :disabled="(checkDisabled || checkStatus)"
                            class="btn btn-sm btn-outline btn-outline-dashed btn-outline-primary  fw-bold bg-body btn-color-gray-700 btn-active-color-primary w-70px px-1 ms-sm-2 ms-1">
                            <KTIcon icon-name="bi bi-play-fill text-primary" icon-class="fs-2 " />
                            <span class="text-primary"> Tiếp</span>
                        </button>
                        <button v-else type="button" @click="handlePauser" :disabled="(checkDisabled || checkStatus)"
                            class="btn btn-sm btn-outline btn-outline-dashed  btn-outline-danger fw-bold bg-body btn-color-gray-700 btn-active-color-danger ms-sm-2 ms-1">
                            <KTIcon icon-name="bi bi-pause-fill text-danger" icon-class="fs-2 " />
                            <span class="text-danger">Dừng</span>
                        </button>
                        <button type="button" :disabled="checkDisabled" @click="fileDownVisible = true"
                            class="btn btn-sm fw-bold bg-primary btn-color-gray-700 btn-active-color-primary ms-sm-2 ms-1 text-white">
                            <KTIcon icon-name="file-down" icon-class="fs-2 text-white" />
                            Xuất Kết Quả
                        </button>
                    </div>
                </div>
            </div>
            <div class="d-md-block d-none">
                <div class="row align-items-center">
                    <div class="col-sm-12 col-md-6 py-2 ">
                        <div class="row ps-4">
                            <div class="col-6">
                                <div>
                                    <span class="w-70px">Mục Tiêu: </span>
                                    <span class="fw-bold"
                                        :class="(checkNameTarget(targetData.name, targetData.domain) == '--') ? 'badge badge-light-danger' : ''">
                                        {{ checkNameTarget(targetData.name, targetData.domain) }}
                                    </span>
                                </div>
                            </div>
                            <div class="col-6">
                                <div>
                                    <span class="w-70px">IP Mục Tiêu: </span>
                                    <span class="fw-bold" :class="(targetData.ip == '') ? 'badge badge-light-danger' : ''">
                                        {{ (targetData.ip != '') ? targetData.ip : '--' }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-12 col-md-6 py-2 pe-6">
                        <div class="d-flex justify-content-end">
                            <el-popconfirm confirm-button-text="Đồng ý" width="250" cancel-button-text="Không"
                                icon="InfoFilled" icon-color="#626AEF" title="Bạn có chắc muốn hủy chương trình quét này?"
                                @confirm="confirmEvent" @cancel="cancelEvent">
                                <template #reference>
                                    <button type="button" :disabled="checkDisabled"
                                        class="btn btn-sm fw-bold bg-danger btn-color-gray-700 btn-active-color-primary text-white">
                                        <KTIcon icon-name="cross-square" icon-class="fs-2 text-white" />Hủy Bỏ
                                    </button>
                                </template>
                            </el-popconfirm>
                            <button v-if="scanStatus == 5" type="button" @click="handlePauser"
                                :disabled="(checkDisabled || checkStatus)"
                                class="btn btn-sm btn-outline btn-outline-dashed btn-outline-primary  fw-bold bg-body btn-color-gray-700 btn-active-color-primary  ms-2">
                                <KTIcon icon-name="bi bi-play-fill text-primary" icon-class="fs-2 " />
                                <span class="text-primary"> Tiếp Tục</span>
                            </button>
                            <button v-else type="button" @click="handlePauser" :disabled="(checkDisabled || checkStatus)"
                                class="btn btn-sm btn-outline btn-outline-dashed  btn-outline-danger fw-bold bg-body btn-color-gray-700 btn-active-color-danger  ms-2">
                                <KTIcon icon-name="bi bi-pause-fill text-danger" icon-class="fs-2 " />
                                <span class="text-danger">Tạm Dừng</span>
                            </button>
                            <button type="button" :disabled="checkDisabled" @click="fileDownVisible = true"
                                class="btn btn-sm fw-bold bg-primary btn-color-gray-700 btn-active-color-primary ms-2 text-white">
                                <KTIcon icon-name="file-down" icon-class="fs-2 text-white" />
                                Xuất Kết Quả
                            </button>
                        </div>
                    </div>
                    <div class="row col-12 ps-5 pe-1">
                        <div class=" col-3 p-2">
                            <div class="border border-gray-300 border-dashed rounded py-3 px-4 ms-2">
                                <!--begin::Number-->
                                <div class="d-flex align-items-center">
                                    <KTIcon icon-name="timer" icon-class="fs-3 text-success me-2" />
                                    <div class="fs-2 fw-bold">{{ diffTime }}</div>
                                </div>
                                <!--end::Number-->

                                <!--begin::Label-->
                                <div class="fw-semobold text-gray-400 fs-13px">Thời Gian</div>
                                <!--end::Label-->
                            </div>
                            <!--end::Stat-->
                        </div>
                        <div class="col-3 p-2">
                            <div class="border border-gray-300 border-dashed rounded py-3 px-4 ">
                                <!--begin::Number-->
                                <div class="d-flex align-items-center">
                                    <KTIcon icon-name="arrow-up-down" icon-class="fs-3 text-success me-2" />
                                    <div class="fs-2 fw-bold">{{ countRequest }}</div>
                                </div>
                                <!--end::Number-->

                                <!--begin::Label-->
                                <div class="fw-semobold text-gray-400 fs-13px">Yêu cầu</div>
                                <!--end::Label-->
                            </div>

                        </div>
                        <div class="col-3 p-2">
                            <div class="border border-gray-300 border-dashed rounded py-3 px-4 ">
                                <!--begin::Number-->
                                <div class="d-flex align-items-center">
                                    <KTIcon icon-name="watch" icon-class="fs-3 text-success me-2" />
                                    <div class="fs-2 fw-bold">{{ averageResponseTime }}</div>
                                </div>
                                <!--end::Number-->

                                <!--begin::Label-->
                                <div class="fw-semobold text-gray-400 fs-13px">Average Response Time</div>
                                <!--end::Label-->
                            </div>
                            <!--end::Stat-->

                        </div>
                        <div class="col-3 p-2">
                            <div class="border border-gray-300 border-dashed rounded py-3 px-4 ">
                                <!--begin::Number-->
                                <div class="d-flex align-items-center">
                                    <KTIcon icon-name="pointers" icon-class="fs-3 text-success me-2" />
                                    <div class="fs-2 fw-bold">{{ locations }}</div>
                                </div>
                                <!--end::Number-->

                                <!--begin::Label-->
                                <div class="fw-semobold text-gray-400 fs-13px">Đường dẫn</div>
                                <!--end::Label-->
                            </div>
                            <!--end::Stat-->

                        </div>
                        <div class="col-12 my-3 w-100  ms-2">
                            <span class="fw-semobold text-muted fs-13px">Tiến trình</span>
                            <el-progress :percentage="progress" status="success" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="h-100 d-block card card-custom ">
            <div class="d-flex px-5">
                <!--begin::Card body-->
                <div class="overflow-y-auto overflow-x-auto h-100 m-0 p-0" ref="container"
                    @mousedown="handleMouseDown" :style="classDetail ? { width: leftWidth + 'px' } : { width: '100%' }">
                    <div class="w-100  py-2">
                        <el-table :data="getScansData" style="width: 100%;z-index: 1;"
                            class-name=" my-custom-table rounded-top cursor-pointer mt-2" table-layout="fixed"
                            v-loading="loading" highlight-current-row @row-click="customRowTable">
                            <template #empty>
                                <div class="flex items-center justify-center h-100%">
                                    <el-empty description="Không có dữ liệu scans nào" />
                                </div>
                            </template>

                            <el-table-column width="80" label-class-name="fs-13px fw-bold text-dark" prop="severity"
                                align="center" label="MỨC ĐỘ">
                                <template #default="scope">
                                    <div class="text-center">
                                        <KTIcon icon-name="severity"
                                            :icon-class="`bi bi-bug-fill fs-2 text-${getSeverity(scope.row.severity).color}`" />
                                        <br>
                                        <p :class="`fst-normal my-0 fs-7 text-${getSeverity(scope.row.severity).color}`">
                                            {{ getSeverity(scope.row.severity).title }}</p>
                                    </div>
                                </template>
                            </el-table-column>

                            <el-table-column label-class-name="fs-13px fw-bold text-dark" min-width="150" prop="vt_name"
                                label="TÊN">
                                <template #default="scope">
                                    <span v-if="scope.row.vt_name != '' || scope.row.port_scan.name != ''"
                                        class="fs-13px text-gray-700 text-hover-primary">
                                        {{ scope.row.vt_name ?? scope.row.port_scan?.name }}
                                    </span>
                                    <span v-else class="badge badge-light-danger">--</span>
                                </template>
                            </el-table-column>
                            <el-table-column min-width="150" label-class-name="fs-13px text-dark fw-bold" prop="affects_url"
                                label="HOST NAME">
                                <template #default="scope">
                                    <span v-if="scope.row.affects_url || scope.row.port_scan.host"
                                        class="fs-13px text-gray-700 text-hover-primary">
                                        <i class="fa-solid fa-link fs-8"></i>
                                        {{ scope.row.port_scan?.host ?? scope.row.affects_url }}
                                    </span>
                                    <span v-else class="badge badge-light-danger">--</span>
                                </template>
                            </el-table-column>
                            <el-table-column min-width="120" label-class-name="fs-13px text-dark fw-bold" align="left"
                                prop="status" label="TRẠNG THÁI">
                                <template #default="scope">
                                    <span v-if="scope.row.status != ''" class="badge fs-13px"
                                        :class="`px-4 py-3 badge-light-${getStatus(scope.row.status).color}`">
                                        {{ scope.row.status }}
                                    </span>
                                    <span v-else class="badge badge-light-danger">--</span>
                                </template>
                            </el-table-column>

                            <el-table-column min-width="120" label-class-name="fs-13px text-dark fw-bold" align="left"
                                prop="last_seen" label="NGÀY TẠO">
                                <template #default="scope">
                                    <span v-if="scope.row.last_seen != ''"
                                        class="fs-13px d-flex justify-content-end align-items-center">
                                        <KTIcon class="me-1" icon-name="calendar" icon-class="fs-3" />
                                        {{ scope.row.last_seen }}
                                    </span>
                                    <span v-else class="badge badge-light-danger">--</span>
                                </template>
                            </el-table-column>

                        </el-table>
                        <div
                            class="d-flex justify-content-between align-items-center mx-auto w-100 py-5 bg-white rounded-bottom">
                            <div v-if="totalPage > 0">
                                <span class="text-capitalize fs-13px ">Tổng Số Scans: {{ totalPage }}</span>
                            </div>
                            <el-pagination background v-model:current-page="currentPage" :hide-on-single-page="true"
                                v-model:page-size="itemsPerPage" :total="totalPage"
                                layout="prev, pager, next"></el-pagination>
                            <div></div>
                        </div>
                    </div>
                </div>
                <!--end::Card body-->
                <div v-if="classDetail" @mousedown="startDragging"
                                        class="drag-handle position-relative border-start">
                                        <div class="position-absolute top-0 start-50 translate-middle-x mt-1">
                                        </div>
                                    </div>
                <!--begin::Card2 body-->
                <div class="overflow-auto h-100 " :style="classDetail ? { width: rightWidth + 'px' } : { width: '0px' }"
                    :class="classDetail ? ' d-block' : 'd-none'">
                    <div class="ms-3 pb-10 affix-containe">
                        <div class="card-title py-3 position-relative">
                            <h2 class="fw-bold pe-15 mt-5 fs-2">{{ detailVuln.vt_name }}</h2>
                            <div  class="">
                                <span 
                                    :class="`px-4 me-2 py-3 badge fs-13px badge-light-${getSeverityName(detailVuln.severity).color}`">
                                    {{  getSeverityName(detailVuln.severity).title }}
                                </span>
                                <span 
                                    :class="`px-4 py-3 badge fs-13px badge-light-${getStatus(detailVuln.status).color}`">
                                    {{ getStatus(detailVuln.status).title }}
                                </span>
                            </div>
                            <div class="position-absolute end-0 translate-middle-y" style="top:35px">
                                <button @click="handleCloseDetail" type="button" class="btn btn-icon btn-bg-body ">
                                    <i class="fa-solid fa-xmark fs-1"></i>
                                </button>
                                
                            </div>
                        </div>
                        
                        <div class="lh-lg">
                            <div class="mb-5"
                                v-if="(detailVuln.affects_url != null && detailVuln.affects_url != '') || (detailVuln.affects_detail != null && detailVuln.affects_detail != '')">
                                <h4 class="text-gray-800 fs-13px fw-bold cursor-pointer mb-0">Vulnerable URL</h4>
                                <div v-if="detailVuln.affects_url != null && detailVuln.affects_url != ''">
                                    <span class="w-100">URL : </span>
                                    <span class="ps-1">
                                        <a target="_blank" :href="`${detailVuln.affects_url}`" class="text-primary">
                                            <KTIcon icon-name="link" icon-class="bi bi-link-45deg"
                                                :style="{ fontSize: '16px' }" />
                                            {{ detailVuln.affects_url }}
                                        </a>
                                    </span>
                                </div>
                                <div v-if="detailVuln.affects_detail != null && detailVuln.affects_detail != ''">
                                    <span class="w-100">Parameter : </span>
                                    <span class="ps-1"> {{ detailVuln.affects_detail }}</span>
                                </div>
                            </div>

                            <div class="mb-5" v-if="detailVuln.tags != null && detailVuln.tags != ''">
                                <h4 class="text-gray-800 fs-13px fw-bold cursor-pointer mb-0">CVE/CWE</h4>
                                <div class="lh-base">
                                    <template v-for="(tag, index) in detailVuln.tags" :key="index">
                                        <li class="d-flex align-items-center py-2">
                                            <span class="bullet bullet-vertical bg-success me-5"></span> {{ tag }}
                                        </li>
                                    </template>
                                </div>
                            </div>

                            <div class="mb-5" v-if="detailVuln.cvss_score != null && detailVuln.cvss_score != ''">
                                <h4 class="text-gray-800 fs-13px fw-bold cursor-pointer mb-0">CVSS Score</h4>
                                <div>
                                    <li class="d-flex align-items-center py-2">
                                        <span class="bullet bg-warning me-5"></span>
                                        <span>Base Score:<strong class="ps-2"> {{ detailVuln.cvss_score }}</strong></span>
                                    </li>
                                </div>
                            </div>

                            <div class="mb-5" v-if="detailVuln.details != null && detailVuln.details != ''">
                                <h4 class="text-gray-800 fs-13px fw-bold cursor-pointer mb-0">Attack Details</h4>
                                <div>
                                    <div class="ps-1" v-html="detailVuln.details.replace(/<br\s*\/?>/g, '')"></div>
                                </div>
                            </div>

                            <div class="mb-5" v-if="detailVuln.in_cpe != null && detailVuln.in_cpe != ''">
                                <div class="d-flex align-items-end ">
                                    <h4 class="text-gray-800 fs-13px lh-lg fs-13px fw-bold m-0 pe-2">In CPE : </h4>
                                    <span> {{ detailVuln.in_cpe }}</span>
                                </div>
                            </div>

                            <div class="mb-5" v-if="detailVuln.protocol != null && detailVuln.protocol != ''">
                                <div class="d-flex align-items-end ">
                                    <h4 class="text-gray-800 fs-13px lh-lg fs-13px fw-bold m-0 pe-2">Protocol : </h4>
                                    <span> {{ detailVuln.protocol }}</span>
                                </div>
                            </div>

                            <div class="mb-5" v-if="detailVuln.service != null && detailVuln.service != ''">
                                <div class="d-flex align-items-end ">
                                    <h4 class="text-gray-800 fs-13px lh-lg fs-13px fw-bold m-0 pe-2">Service : </h4>
                                    <span> {{ detailVuln.service }}</span>
                                </div>
                            </div>

                            <div class="mb-5" v-if="detailVuln.port != null && detailVuln.port != ''">
                                <div class="d-flex align-items-end">
                                    <h4 class="text-gray-800 fs-13px lh-lg fs-13px fw-bold m-0 pe-2">Port : </h4>
                                    <span> {{ detailVuln.port }}</span>
                                </div>
                            </div>

                            <div class="mb-5" v-if="detailVuln.type != null && detailVuln.type != ''">
                                <div class="d-flex align-items-end ">
                                    <h4 class="text-gray-800 fs-13px lh-lg fs-13px fw-bold m-0 pe-2">Service : </h4>
                                    <span> {{ detailVuln.type }}</span>
                                </div>
                            </div>

                            <div class="mb-5" v-if="detailVuln.url != null && detailVuln.url != ''">
                                <div class="d-flex align-items-end ">
                                    <h4 class="text-gray-800 fs-13px lh-lg fs-13px fw-bold m-0 pe-2">URL : </h4>
                                    <span> {{ detailVuln.url }}</span>
                                </div>
                            </div>

                            <div class="mb-5" v-if="detailVuln.references != null && detailVuln.references != ''">
                                <h4 class="text-gray-800 fs-13px fw-bold cursor-pointer mb-0">References</h4>
                                <div class="lh-base">
                                    <template v-for="(tag, index) in detailVuln.references" :key="index">
                                        <li class="d-flex align-items-center py-2 text-primary">
                                            <span class="bullet bullet-vertical bg-primary me-5"></span> {{ tag }}
                                        </li>
                                    </template>
                                </div>
                            </div>

                            <div class="mb-5" v-if="detailVuln.classification != null && detailVuln.classification != ''">
                                <h4 class="text-gray-800 fs-13px fw-bold cursor-pointer mb-0">Classification</h4>
                                <div class="lh-base">
                                    <template v-for="(items, index) in detailVuln.classification" :key="index">
                                        <li class="d-flex align-items-center py-2">
                                            <template v-if="items != null">
                                                <template v-if="Array.isArray(items)">
                                                    <template v-for="(item, key) in items" :key="key">
                                                        <span class="bullet bullet-vertical bg-primary me-5"></span> {{
                                                            index }} : {{ item }}<br>
                                                    </template>
                                                </template>
                                                <template v-else>
                                                    <span class="bullet bullet-vertical bg-primary me-5"></span> {{ index }}
                                                    : {{ items }}<br>
                                                </template>
                                            </template>
                                        </li>
                                    </template>
                                </div>
                            </div>

                            <div class="mb-5" v-if="detailVuln.description != null && detailVuln.description != ''">
                                <h4 class="text-gray-800 fs-13px fw-bold cursor-pointer mb-0">Description</h4>
                                <div>
                                    <div class="ps-1" v-html="detailVuln.description"></div>
                                </div>
                            </div>

                        </div>

                        <div class="">
                            <div id="kt_detail_collapsible_scan">
                                <div class="py-1" v-if="detailVuln.request != null && detailVuln.request != ''">
                                    <div class="py-3 d-flex flex-stack flex-wrap">
                                        <div class="d-flex align-items-center collapsible toggle collapsed"
                                            data-bs-toggle="collapse" data-bs-target="#kt_detail_collapsible_scan_1"
                                            aria-expanded="false">
                                            <div class="btn btn-sm btn-icon btn-active-color-primary ms-n3 me-2">
                                                <KTIcon icon-name="minus-square" icon-class="toggle-on text-primary fs-2" />
                                                <KTIcon icon-name="plus-square" icon-class="toggle-off fs-2" />
                                            </div>

                                            <div class="me-3">
                                                <h4 class="text-gray-800 fw-bold cursor-pointer mb-0">Request</h4>
                                            </div>
                                        </div>
                                    </div>

                                    <div id="kt_detail_collapsible_scan_1" class="fs-13px px-2 collapse" style="">
                                        <div>
                                            <CodeHighlighter lang="json">{{ detailVuln.request }}</CodeHighlighter>
                                        </div>
                                    </div>
                                </div>

                                <div class="separator separator-dashed"
                                    v-if="detailVuln.request != null && detailVuln.request != ''">
                                </div>

                                <div class="py-1" v-if="detailVuln.http_response != null && detailVuln.http_response != ''">
                                    <div class="py-3 d-flex flex-stack flex-wrap">
                                        <div class="d-flex align-items-center collapsible toggle collapsed"
                                            data-bs-toggle="collapse" data-bs-target="#kt_detail_collapsible_scan_2">
                                            <div class="btn btn-sm btn-icon btn-active-color-primary ms-n3 me-2">
                                                <KTIcon icon-name="minus-square" icon-class="toggle-on text-primary fs-2" />

                                                <KTIcon icon-name="plus-square" icon-class="toggle-off fs-2" />
                                            </div>

                                            <div class="me-3">
                                                <h4 class="text-gray-800 fw-bold cursor-pointer mb-0">Response</h4>
                                            </div>
                                        </div>
                                    </div>

                                    <div id="kt_detail_collapsible_scan_2" class="collapse fs-13px px-2">
                                        <div>
                                            <CodeHighlighter lang="html">{{ detailVuln.http_response }}</CodeHighlighter>
                                        </div>
                                    </div>
                                </div>

                                <div class="separator separator-dashed"
                                    v-if="detailVuln.http_response != null && detailVuln.http_response != ''"></div>

                                <div class="py-1"
                                    v-if="detailVuln.recommendation != null && detailVuln.recommendation != ''">
                                    <div class="py-3 d-flex flex-stack flex-wrap">
                                        <div class="d-flex align-items-center collapsible toggle collapsed"
                                            data-bs-toggle="collapse" data-bs-target="#kt_detail_collapsible_scan_3">
                                            <div class="btn btn-sm btn-icon btn-active-color-primary ms-n3 me-2">
                                                <KTIcon icon-name="minus-square" icon-class="toggle-on text-primary fs-2" />
                                                <KTIcon icon-name="plus-square" icon-class="toggle-off fs-2" />
                                            </div>

                                            <div class="me-3">
                                                <h4 class="text-gray-800 fw-bold cursor-pointer mb-0">Resolution</h4>
                                            </div>
                                        </div>
                                    </div>

                                    <div id="kt_detail_collapsible_scan_3" class="collapse fs-13px px-2">
                                        <div>
                                            {{ detailVuln.recommendation }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!--end::Card2 body-->
            </div>

        </div>
    </div>

    <!-- // modoal  -->
    <el-dialog v-model="fileDownVisible" title="Xác nhận xuất file" width="500">
        <div class="card h-100 bg-secondary">
            <!--begin::Card body-->
            <div class="card-body d-flex justify-content-center text-center flex-column p-8">
                <!--begin::Name-->
                <div class="symbol symbol-60px mb-5">
                    <i class="fa-solid fa-file-excel fs-4x text-success"></i>
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
import { defineComponent, ref, onMounted, reactive, watch, nextTick, onUnmounted } from "vue";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import ApiService from "@/core/services/ApiService";
import Swal from "sweetalert2/dist/sweetalert2.js";
import filtersTabScan from "@/views/apps/targets/filtersTabScan.vue";
import CodeHighlighter from "@/components/highlighters/CodeHighlighter.vue";
import { useRoute } from 'vue-router';
import { debounce } from 'vue-debounce'
import { ElMessage } from 'element-plus'
import KTToolbar from "@/views/apps/targets/reconWidgets/KTToolbar2.vue";

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
        KTToolbar,
    },
    setup() {
        const route = useRoute();
        const scanID = ref<null | number | any>(route.params.id ?? '');
        const list = ref<getData | any>()
        const loading = ref<boolean>(false)
        const totalPage = ref<number>(0);
        const currentPage = ref<number>(1);
        const itemsPerPage = ref<number>(20);
        const query = ref<string | null | any>('');
        const typeModal = ref<String>('');
        const nameType = ref<string>('');
        const classDetail = ref<boolean>(false);
        const checkitemsPerPage = ref<boolean>(false);
        const countRequest = ref<number | any>(0);
        const averageResponseTime = ref<number | any>(0);
        const locations = ref<number | any>(0);
        const maxResponseTime = ref<number | string>(0);
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
        const currentCheckPage = ref<boolean>(false)
        const severityLow = ref<number>(0)
        const severityMedium = ref<number>(0)
        const severityHigh = ref<number>(0)
        const scanStatus = ref<number>(0)
        const filterSeverity = ref<number | null>(null)
        const timeEnd = ref<number | any>(null)
        const timeStart = ref<number | any>(null)
        const closeOnRow = ref(true);

        const getData = async () => {
            loading.value = true;

            return ApiService.get(`/scan/detail/${scanID.value}`)
                .then(({ data }) => {

                    // if (filterSeverity.value != null && query.value != null) {
                    //     list.value = data.vulnerabilities.filter((vulnerability: detailData) => (vulnerability.vt_name.toLowerCase().indexOf(query.value.toLowerCase()) > -1 && vulnerability.severity == filterSeverity.value))
                    // } else if (filterSeverity.value != null) {
                    //     list.value = data.vulnerabilities.filter((vulnerability: detailData) => (vulnerability.severity == filterSeverity.value))
                    // } else if (query.value != null) {
                    //     list.value = data.vulnerabilities.filter((vulnerability: detailData) => (vulnerability.vt_name.toLowerCase().indexOf(query.value.toLowerCase()) > -1))
                    // } else {
                    //     list.value = data.vulnerabilities;
                    // }

                    list.value = data.vulnerabilities;


                    targetData.value.id = data.target.id
                    targetData.value.domain = data.target.domain
                    targetData.value.ip = data.target.ip
                    targetData.value.name = data.target.name
                    totalPage.value = Object.keys(list.value).length

                    // time'..
                    countRequest.value = new Intl.NumberFormat("en-US").format(data.web_scan_status.request_count ?? 0);
                    averageResponseTime.value = data.web_scan_status.avg_response_time != undefined ? data.web_scan_status.avg_response_time + 'ms' : '0ms';
                    locations.value = new Intl.NumberFormat("en-US").format(data.web_scan_status.locations ?? 0);
                    maxResponseTime.value = data.web_scan_status.max_response_time

                    // severity
                    severityInfo.value = data.severity_counts.info
                    severityLow.value = data.severity_counts.low
                    severityHigh.value = data.severity_counts.high
                    severityMedium.value = data.severity_counts.medium

                    // check
                    progress.value = data.progress
                    timeStart.value = data.scan_started_at
                    timeEnd.value = data.scan_finished_at
                    checkStatus.value = (data.scan_status == 3 || data.scan_status == 0 || data.scan_status == 4 || data.scan_status == 1) ? true : false
                    // checkStatusDisabled.value = (data.scan_status == 3) ? true : false
                    scanStatus.value = data.scan_status
                    fetchDataScans(currentPage.value, itemsPerPage.value)

                    humanDiffTime()
                    // console.log(countRequest.value)
                    // console.log(averageResponseTime.value)
                    // console.log(locations.value)
                    // console.log(maxResponseTime.value)
                })
                .catch(({ response }) => {
                    notification(response.data.detail, 'error', 'Có lỗi xảy ra')
                })
                .finally(() => {
                    loading.value = false
                });
        }

        const getScansData = ref<any>([]);
        const fetchDataScans = (currentPages: number, pageSizes: number) => {
            const start = (currentPages - 1) * pageSizes;
            const end = start + pageSizes;
            const filterTableData = (query.value === null || query.value === '')
                ? list.value
                : list.value.filter((data: any) => {
                    const vt_name = data.vt_name ?? (data.port_scan ? data.port_scan.vt_name : null);
                    const affects_url = data.affects_url ?? (data.port_scan ? data.port_scan.affects_url : null);
                    return !query.value ||
                        (vt_name && vt_name.toLowerCase().includes(query.value.toLowerCase())) ||
                        (affects_url && affects_url.toLowerCase().includes(query.value.toLowerCase()));
                });
            getScansData.value = filterTableData.slice(start, end)
            totalPage.value = Object.keys(filterTableData).length;
        };

        // Lắng nghe sự thay đổi của currentPage và pageSize
        watch([currentPage, itemsPerPage], ([newCurrentPage, newPageSize]) => {
            fetchDataScans(newCurrentPage, newPageSize);
        });

        // tìm kiếm 
        const handleFilter = (data: any) => {
            query.value = data;
            currentPage.value = 1;
            fetchDataScans(1, itemsPerPage.value)
        };

        const debounceSearch = debounce(getData, 1000);
        watch(query, debounceSearch);
        const detailVuln = reactive({
            id: '',
            vt_name: '',
            affects_detail: '',
            affects_url: '',
            severity: '',
            ip: '',
            hostname: '',
            schema: '',
            created_at: '',
            status: '',
            last_seen: '',
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
        const checkDetailVuln = ref<boolean>(false)
        const getDetailVuln = async (vuln_id: number) => {
            return ApiService.get(`/scan/vulnerabilities/${scanID.value}?vul_id=${vuln_id}`)
                .then(({ data }) => {
                    for (const key in detailVuln) {
                        // Kiểm tra xem dữ liệu truyền vào có tồn tại và tương ứng với thuộc tính trong detailData hay không
                        if (data.hasOwnProperty(key) || data.port_scan) {
                            // Nếu có, gán giá trị vào obj detailData
                            detailVuln[key] = data[key] ?? data.port_scan[key];
                        } else {
                            // Nếu không, gán giá trị rỗng vào obj detailData
                            detailVuln[key] = '';
                        }
                    }
                    // console.log(detailVuln)
                    // console.log(data)
                })
                .catch(({ response }) => {
                    notification(response.data.detail, 'error', 'Có lỗi xảy ra')
                });
        };

        const customRowTable = (detail: any) => {
            console.log(detail)

            classDetail.value = true;
            closeOnRow.value = true;
            checkitemsPerPage.value = true;
            if (detail.vuln_id) {
                checkDetailVuln.value = true;
                getDetailVuln(detail.vuln_id)
            } else {
                closeOnRow.value = true;
                classDetail.value = true;
                for (const key in detailVuln) {
                    // Kiểm tra xem dữ liệu truyền vào có tồn tại và tương ứng với thuộc tính trong detailData hay không
                    if (detail.hasOwnProperty(key) || detail.port_scan) {
                        // Nếu có, gán giá trị vào obj detailData
                        detailVuln[key] = detail[key] ?? detail.port_scan[key];
                    } else {
                        // Nếu không, gán giá trị rỗng vào obj detailData
                        detailVuln[key] = '';
                    }
                }
            }
        };

        const handleCloseDetail = () => {
            classDetail.value = false;
            closeOnRow.value = false;
            checkitemsPerPage.value = false;
        };

        const notification = (values: string, icon: string, more: string) => {
            Swal.fire({
                text: values ?? more,
                icon: icon,
                buttonsStyling: false,
                confirmButtonText: (icon == 'error') ? "Thử Lại" : "Đồng Ý",
                heightAuto: false,
                customClass: {
                    confirmButton: (icon == 'error') ? "btn btn-light-danger" : "btn btn-light-primary",
                },
            }).then(() => {
            });
        };

        const getSeverityName = (severity: number | string) => {
            if (severity == 'Info') {
                return { id: 0, title: 'Info', color: 'success', class: 'severityInfo' };
            } else if (severity == 'Low') {
                return { id: 1, title: 'Low', color: 'primary', class: 'severityLow' };
            } else if (severity == 'Medium') {
                return { id: 2, title: 'Medium', color: 'warning', class: 'severityMedium' };
            } else if (severity == 'High') {
                return { id: 3, title: 'High', color: 'danger', class: 'severityHigh' };
            }
            return { id: 4, title: 'undefined', color: 'light', class: 'severityundefined' };
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
        const container = ref<null | any>(null);
        const container2 = ref<number>(0);
        const state = reactive({
            isDragging: false,
            startX: 0,
            startScrollLeft: 0,
        });

        const handleMouseDown = (event: any) => {
            state.isDragging = true;
            state.startX = event.clientX;
            state.startScrollLeft = container.value.scrollLeft;

            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        };

        const handleMouseMove = (event: any) => {
            if (!state.isDragging) return;

            const deltaX = event.clientX - state.startX;
            container2.value = deltaX
            container.value.scrollLeft = state.startScrollLeft - deltaX;
        };

        const handleMouseUp = () => {
            state.isDragging = false;

            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };

        // tạm dừng
        // false - tạm dừng
        // true - tiếp tục

        const checkDisabled = ref<boolean>(false);
        const handlePauser = async () => {
            checkDisabled.value = true
            setTimeout(() => {
                checkDisabled.value = false;
            }, 500);
            if (scanStatus.value == 3) {
                notification('Danh dách đã được quét thành công không thể tạm dừng', 'error', 'Có lỗi xảy ra')
            } else if (scanStatus.value == 5) {
                // console.log('tiếp tục')
                getResume()
            } else if (scanStatus.value == 2) {
                // console.log('tạm dừng')
                getPauser()
            } else {
                notification('', 'error', 'Có lỗi xảy ra')
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
                    notification(data.detail, 'success', 'Tiếp tục thành công')
                })
                .catch(({ response }) => {
                    notification(response.data.detail, 'error', 'Có lỗi xảy ra')
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
                    notification(data.detail, 'success', 'Tạm dừng thành công')
                })
                .catch(({ response }) => {
                    notification(response.data.detail, 'error', 'Có lỗi xảy ra')
                });
        };



        // tải về files
        const fileDownVisible = ref(false)
        const downloadAcunetix = async () => {
            checkDisabled.value = true
            setTimeout(() => {
                checkDisabled.value = false;
            }, 500);
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
                notification(reponse_message, 'success', 'Có lỗi xảy ra')
                fileDownVisible.value = false;
            })
        };

        // hủy
        const confirmEvent = () => {
        }

        const cancelEvent = () => {
        }

        // tính thời gian
        const diffTime = ref<string | any>(0);
        const eventTime = ref<number | any>('30000');
        let intervalId: any;

        const humanDiff = async () => {
            let date1: any = (scanStatus.value == 2) ? new Date() : new Date(timeEnd.value);
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
        watch((eventTime), () => {
            humanDiffTime();
        })

        const humanDiffTime = () => {
            clearInterval(intervalId);
            humanDiff();
            if (scanStatus.value == 2 || scanStatus.value == 1) {
                intervalId = setInterval(() => {
                    getData();
                }, eventTime.value);
            } else {
                return;
            }
        };

        onMounted(() => {
            getData();
        });

        // check
        const checkNameTarget = (name: string, domain: string) => {
            if (name != '' && domain != '') {
                return name + ' - ' + domain;
            } else if (name != '' || domain != '') {
                if (name != '') {
                    return name
                } else {
                    return domain
                }
            }
            return '--'
        };

        // Tính toán chiều rộng nội dung
        const contentWidth = ref(0);
        onMounted(() => {
            // contentWidth.value = container.value.scrollWidth;
            contentWidth.value = container.value.scrollWidth;
        });

        onUnmounted(() => {
            clearInterval(intervalId);
        });

        // thay đổi kích thước header
        const headerHeight = ref<number>(0);
        const onheaderHeight = (height: number) => {
            headerHeight.value = height
            console.log(height)
        }

        return {
            headerHeight,
            onheaderHeight,
            getScansData,
            checkNameTarget,
            scanID,
            getData,
            list,
            getAssetPath,
            handleCloseDetail,
            targetData,
            maxResponseTime,
            locations,
            averageResponseTime,
            countRequest,
            severityMedium,
            severityHigh,
            severityLow,
            severityInfo,
            filterSeverity,
            activeName,
            closeOnRow,
            checkitemsPerPage,
            getSeverityName,

            // tải về
            fileDownVisible,
            downloadAcunetix,


            // crud
            apiData,

            // detials
            customRowTable,
            getDetailVuln,
            checkDetailVuln,

            // page 
            itemsPerPage,
            totalPage,
            currentPage,
            currentCheckPage,
            // search query 
            query,

            // edit 
            nameType,

            // sử lý dữ liệu
            getSeverity,
            getStatus,

            // filter
            loading,
            handleFilter,

            // detail
            classDetail,
            detailVuln,

            // Dragging kéo lề
            startDragging,
            leftWidth,
            rightWidth,

            // mouse down di chuột xuống
            handleMouseDown,
            contentWidth,
            container,

            // reloadData
            progress,
            checkStatus,
            diffTime,
            eventTime,

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
  
<style scoped>
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
  