<template> 
    <KTToolbar :check-search="true" @handle-search="handleFilter" @on-header-height="onheaderHeight"></KTToolbar>
    <div class="app-container container-fluid h-100 " :style="{marginTop: headerHeight + 'px'}">
        <div class="card mb-3">
            <div class="card-body pb-0 px-5 pt-5">
                <div class="d-flex flex-wrap flex-sm-nowrap">
                    <div class="m-0">
                        <div class="symbol symbol-100px symbol-lg-160px symbol-fixed position-relative">
                            <apexchart v-if="process && chart" ref="chartRef" class="mixed-widget-4-chart" :options="chart" :series="[progress]"
                                :height="chartHeight" type="radialBar">
                            </apexchart>
                        </div>
                        <p class="text-center fs-13px">
                            <span class="badge badge-light-danger fs-8">Notes:</span>&nbsp;
                            Tiến Trình Scan
                        </p>
                    </div>
                    <div class="flex-grow-1">
                        <div
                            class="d-flex justify-content-between align-items-start flex-wrap mb-2">
                            <div class="d-flex flex-column">
                                <div class="d-flex align-items-center mb-2">
                                    <a
                                        href="#"
                                        class="text-gray-800 text-hover-primary fs-2 fw-bold me-1"
                                    ><span :class="(!targetData.name) ? 'badge badge-light text-danger' : ''">{{ targetData.name ? targetData.name : '--' }}</span></a>
                                </div>
                                <div class="d-flex flex-wrap fw-semobold fs-6 mb-4 pe-2">
                                    <a
                                        href="#"
                                        class="d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2"
                                    >
                                        <KTIcon icon-name="profile-circle" icon-class="fs-4 me-1" />
                                        <span :class="(!targetData.domain) ? 'badge badge-light text-danger' : ''">{{ targetData.domain ? targetData.domain : '--' }}</span>
                                    </a>
                                    <a
                                        href="#"
                                        class="d-flex align-items-center text-gray-400 text-hover-primary me-5 mb-2"
                                    >
                                        <KTIcon icon-name="geolocation" icon-class="fs-4 me-1" />
                                        <span :class="(!targetData.ip) ? 'badge badge-light text-danger' : ''">{{ targetData.ip ? targetData.ip : '--' }}</span>
                                    </a>
                                    <a
                                        href="#"
                                        class="d-flex align-items-center text-gray-400 text-hover-primary mb-2"
                                    >
                                        <KTIcon icon-name="sms" icon-class="fs-4 me-1" />
                                        <span :class="(!targetData.group) ? 'badge badge-light text-danger' : ''">{{ targetData.group ? targetData.group : '--' }}</span>
                                    </a>
                                </div>
                            </div>
                            <div class="d-flex">
                                <div class="d-flex justify-content-sm-start justify-content-md-end">
                                    <div class="card-toolbar">
                                        <div class="d-flex justify-content-end">
                                            <el-popconfirm confirm-button-text="Đồng Ý" width="250" cancel-button-text="Không"
                                                icon="InfoFilled" icon-color="#626AEF"
                                                title="Bạn có chắc chắn muốn hủy lần Recon này không?" @confirm="handleCanceled"
                                                @cancel="cancelEvent">
                                                <template #reference>
                                                    <button type="button" :disabled="[1,2,3,4,6].includes(scanStatus)"
                                                        class="btn btn-sm btn-light-danger custom-button">
                                                        <KTIcon icon-name="cross-square" icon-class="fs-2 " />Hủy Bỏ
                                                    </button>
                                                </template>
                                            </el-popconfirm>
                                            <el-popconfirm v-if="scanStatus == 5" confirm-button-text="Đồng Ý" width="250" cancel-button-text="Không"
                                                icon="InfoFilled" icon-color="#626AEF"
                                                title="Bạn có muốn tiếp tục chạy Recon này không?" @confirm="handlePauser"
                                                @cancel="cancelEvent">
                                                <template #reference>
                                                    <button type="button"
                                                    :disabled="[6].includes(scanStatus)"
                                                        class="btn btn-sm btn-light-success ms-2 custom-button">
                                                        <KTIcon icon-name="bi bi-play-fill" icon-class="fs-2 " />
                                                        <span>Tiếp Tục</span>
                                                    </button>
                                                </template>
                                            </el-popconfirm>

                                            <el-popconfirm v-else confirm-button-text="Đồng Ý" width="250" cancel-button-text="Không"
                                                icon="InfoFilled" icon-color="#626AEF"
                                                title="Bạn có muốn tạm dừng Recon này không?" @confirm="handlePauser"
                                                @cancel="cancelEvent">
                                                <template #reference>
                                                    <button type="button"
                                                        :disabled="[1,3,4].includes(scanStatus)"
                                                        class="btn btn-sm btn-light-warning ms-2 custom-button">
                                                        <KTIcon icon-name="bi bi-pause-fill" icon-class="fs-2 " />
                                                        <span>Tạm Dừng</span>
                                                    </button>
                                                </template>
                                            </el-popconfirm>
                                            <button type="button" :disabled="[1,2].includes(scanStatus)"
                                                @click="fileDownVisible = true"
                                                class="btn btn-sm btn-light-primary ms-2 custom-button">
                                                <KTIcon icon-name="file-down" icon-class="fs-2" />
                                                Xuất Kết Quả
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="d-flex flex-wrap flex-stack">
                            <div class="d-flex flex-column flex-grow-1 pe-8">
                                <div class="d-flex flex-wrap row">
                                    <div class="col-xxl-3 col-xl-6 col-lg-6 col-md-6 col-6 p-2">
                                        <div class="border border-gray-300 border-dashed rounded py-3 px-4">
                                            <div class="d-flex align-items-center">
                                                <KTIcon icon-name="timer" icon-class="fs-3 text-success me-2" />
                                                <div class="fs-2 fw-bold">{{ diffTime }}</div>
                                            </div>
                                            <div class="fw-semobold text-gray-400 fs-13px">Thời Gian</div>
                                        </div>
                                    </div>
                                    <div class="col-xxl-3 col-xl-6 col-lg-6 col-md-6 col-6 p-2">
                                        <div class="border border-gray-300 border-dashed rounded py-3 px-4 ">
                                            <div class="d-flex align-items-center">
                                                <KTIcon icon-name="arrow-up-down" icon-class="fs-3 text-success me-2" />
                                                <div class="fs-2 fw-bold">{{ countRequest }}</div>
                                            </div>
                                            <div class="fw-semobold text-gray-400 fs-13px">Yêu cầu</div>
                                        </div>
                                    </div>
                                    <div class="col-xxl-3 col-xl-6 col-lg-6 col-md-6 col-6 p-2">
                                        <div class="border border-gray-300 border-dashed rounded py-3 px-4 ">
                                            <div class="d-flex align-items-center">
                                                <KTIcon icon-name="watch" icon-class="fs-3 text-success me-2" />
                                                <div class="fs-2 fw-bold">{{ averageResponseTime }}</div>
                                            </div>
                                            <div class="fw-semobold text-gray-400 fs-13px">Average Response Time</div>
                                        </div>
                                    </div>
                                    <div class="col-xxl-3 col-xl-6 col-lg-6 col-md-6 col-6 p-2">
                                        <div class="border border-gray-300 border-dashed rounded py-3 px-4 ">
                                            <div class="d-flex align-items-center">
                                                <KTIcon icon-name="pointers" icon-class="fs-3 text-success me-2" />
                                                <div class="fs-2 fw-bold">{{ locations }}</div>
                                            </div>
                                            <div class="fw-semobold text-gray-400 fs-13px">Đường dẫn</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- <div class="d-flex align-items-center w-200px w-sm-300px flex-column mt-3">
                                <div class="col-12 w-100">
                                    <span class="fw-semobold text-muted fs-13px">Tiến trình</span>
                                    <el-progress :percentage="progress" status="success" />
                                </div>
                            </div> -->
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
                                label="URL">
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
                                prop="last_seen" label="NGÀY TẠO">
                                <template #default="scope">
                                    <span v-if="scope.row.last_seen != ''"
                                        class="fs-13px d-flex justify-content-start align-items-center">
                                        <KTIcon class="me-1" icon-name="calendar" icon-class="fs-3" />
                                        {{ scope.row.last_seen }}
                                    </span>
                                    <span v-else class="badge badge-light-danger">--</span>
                                </template>
                            </el-table-column>

                            <el-table-column min-width="110" label-class-name="fs-13px text-dark fw-bold"
                                prop="status" label="TRẠNG THÁI">
                                <template #default="scope">
                                    <span v-if="scope.row.status != ''" class="badge fs-13px"
                                        :class="`px-4 py-3 badge-light-${getStatus(scope.row.status).color}`">
                                        {{ scope.row.status }}
                                    </span>
                                    <span v-else class="badge badge-light-danger">--</span>
                                </template>
                            </el-table-column>

                        </el-table>
                        <div
                            class="d-flex justify-content-between align-items-center mx-auto w-100 py-5 bg-white rounded-bottom">
                            <div v-if="totalPage > 0">
                                <span class="text-capitalize fs-13px ">Tổng Số Lỗ Hổng: {{ totalPage }}</span>
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
                            <h2 class="fw-bold pe-15 mt-5 fs-13px text-uppercase">{{ detailVuln.vt_name }}</h2>
                            <div  class="pt-1">
                                <span 
                                    :class="`px-4 me-2 py-3 badge fs-13px badge-light-${getSeverity(detailVuln.severity).color}`">
                                    {{  getSeverity(detailVuln.severity).title }}
                                </span>
                                <span 
                                    :class="`px-4 py-3 badge fs-13px badge-light-${getStatus(detailVuln.status).color}`">
                                    {{ getStatus(detailVuln.status).title }}
                                </span>
                            </div>
                            <div class="position-absolute end-0 translate-middle-y" style="top:30px">
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
                                    <span class="w-100">URL: </span>
                                    <span class="ps-1">
                                        <a target="_blank" :href="`${detailVuln.affects_url}`" class="text-primary">
                                            <KTIcon icon-name="link" icon-class="bi bi-link-45deg"
                                                :style="{ fontSize: '16px' }" />
                                            {{ detailVuln.affects_url }}
                                        </a>
                                    </span>
                                </div>
                                <div v-if="detailVuln.affects_detail != null && detailVuln.affects_detail != ''">
                                    <span class="w-100">Parameter: </span>
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
                                    <h4 class="text-gray-800 fs-13px lh-lg fs-13px fw-bold m-0 pe-2">In CPE: </h4>
                                    <span> {{ detailVuln.in_cpe }}</span>
                                </div>
                            </div>

                            <div class="mb-5" v-if="detailVuln.protocol != null && detailVuln.protocol != ''">
                                <div class="d-flex align-items-end ">
                                    <h4 class="text-gray-800 fs-13px lh-lg fs-13px fw-bold m-0 pe-2">Protocol: </h4>
                                    <span> {{ detailVuln.protocol }}</span>
                                </div>
                            </div>

                            <div class="mb-5" v-if="detailVuln.service != null && detailVuln.service != ''">
                                <div class="d-flex align-items-end ">
                                    <h4 class="text-gray-800 fs-13px lh-lg fs-13px fw-bold m-0 pe-2">Service: </h4>
                                    <span> {{ detailVuln.service }}</span>
                                </div>
                            </div>

                            <div class="mb-5" v-if="detailVuln.port != null && detailVuln.port != ''">
                                <div class="d-flex align-items-end">
                                    <h4 class="text-gray-800 fs-13px lh-lg fs-13px fw-bold m-0 pe-2">Port: </h4>
                                    <span> {{ detailVuln.port }}</span>
                                </div>
                            </div>

                            <div class="mb-5" v-if="detailVuln.type != null && detailVuln.type != ''">
                                <div class="d-flex align-items-end ">
                                    <h4 class="text-gray-800 fs-13px lh-lg fs-13px fw-bold m-0 pe-2">Service: </h4>
                                    <span> {{ detailVuln.type }}</span>
                                </div>
                            </div>

                            <div class="mb-5" v-if="detailVuln.url != null && detailVuln.url != ''">
                                <div class="d-flex align-items-end ">
                                    <h4 class="text-gray-800 fs-13px lh-lg fs-13px fw-bold m-0 pe-2">URL: </h4>
                                    <span> {{ detailVuln.url }}</span>
                                </div>
                            </div>

                            <div class="mb-5" v-if="detailVuln.reference != null && detailVuln.reference != ''">
                                <h4 class="text-gray-800 fs-13px fw-bold cursor-pointer mb-0">References</h4>
                                <div class="lh-base">
                                    <template v-for="(tag, index) in detailVuln.reference" :key="index">
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
import { defineComponent, ref, onMounted, reactive, watch, nextTick, onUnmounted, computed, onBeforeMount } from "vue";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import ApiService from "@/core/services/ApiService";
import Swal from "sweetalert2/dist/sweetalert2.js";
import filtersTabScan from "@/views/apps/targets/filtersTabScan.vue";
import CodeHighlighter from "@/components/highlighters/CodeHighlighter.vue";
import { useRoute } from 'vue-router';
import { debounce } from 'vue-debounce'
import type VueApexCharts from "vue3-apexcharts";
import type { ApexOptions } from "apexcharts";
import { useThemeStore } from "@/stores/theme";
import { getCSSVariableValue } from "@/assets/ts/_utils";
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
        const chartColor = ref<any>('');
        const chartHeight = ref<any>('');
        const chartRef = ref<typeof VueApexCharts | null>(null);
        const process = ref<Array<any>>([0]);
        let chart: ApexOptions = {};
        const store = useThemeStore();
        const series = ref([23]);
        const themeMode = computed(() => {
            return store.mode;
        });
        onBeforeMount(() => {
            Object.assign(chart, chartOptions(chartColor, chartHeight));
        });

        const refreshChart = () => {
            if (!chartRef.value) {
                return;
            }

            Object.assign(chart, chartOptions(chartColor, chartHeight));

            chartRef.value.refresh();
        };

        watch(themeMode, () => {
            refreshChart();
        });
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
                    targetData.value.group = data.target.group.title
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
                    console.log(progress.value);
                    
                    timeStart.value = data.scan_started_at
                    timeEnd.value = data.scan_finished_at
                    checkStatus.value = (data.scan_status == 3 || data.scan_status == 0 || data.scan_status == 4 || data.scan_status == 1) ? true : false
                    // checkStatusDisabled.value = (data.scan_status == 3) ? true : false
                    scanStatus.value = parseInt(data.scan_status)
                    fetchDataScans(currentPage.value, itemsPerPage.value)

                    humanDiffTime();
                    showLocaleTime();
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
            reference: '',
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
                })
                .catch(({ response }) => {
                    notification(response.data.detail, 'error', 'Có lỗi xảy ra')
                });
        };

        const customRowTable = (detail: any) => {

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
                getResume()
            } else if (scanStatus.value == 2) {
                getPauser()
            } else {
                notification('', 'error', 'Có lỗi xảy ra')
            }

        };

        const handleCanceled = async () => {
            // if (scanStatus.value == 3) {
            //     notification('Danh dách đã được quét thành công không thể tạm dừng', 'error', 'Có lỗi xảy ra')
            // } else if (scanStatus.value == 5) {                
            //     getCanceled()
            // } else {
            //     notification('Có lỗi xảy ra', 'error', 'Có lỗi xảy ra')
            // }
            console.log('vao cancel');
            
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

        const getCanceled = async () => {
            const formData = {
                control_param: {
                    "action": 'canceled'
                }
            }
            return ApiService.post(`scans/${scanID.value}/abort`, formData)
                .then(({ data }) => {
                    notification(data.detail, 'success', 'Tạm dừng thành công')
                    getData()
                })
                .catch(({ response }) => {
                    notification(response.data.detail , 'error', 'Có lỗi xảy ra')
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

        // thời gian tự động chạy
        let intervalIdAuto: any;

        const showLocaleTime = async () => {
            clearInterval(intervalIdAuto);
            if (scanStatus.value == 2) {
                intervalIdAuto = setInterval(() => { humanDiff(); }, 1000);
            } else {
                return;
            }
        };

        onUnmounted(() => {
            clearInterval(intervalIdAuto);
            clearInterval(intervalId);
        });

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

            handleCanceled,

            series,
            chartHeight,
            chartColor,
            chart,
            process
        };
    },
});

const chartOptions = (
  color: string = "primary",
  height: string = "auto"
): ApexOptions => {
  const baseColor = getCSSVariableValue(`--bs-primary`);
  const lightColor = getCSSVariableValue(`--bs-${color}-light`);

  return {
    chart: {
      fontFamily: "inherit",
      height: height,
      type: "radialBar",
    },
    plotOptions: {
      radialBar: {
        hollow: {
          margin: 0,
          size: "65%",
        },
        dataLabels: {
          show: true,
          name: {
            show: false,
          },
          value: {
            fontSize: "30px",
            fontWeight: "700",
            offsetY: 12,
            show: true,
            formatter: function (val) {
              return val + "%";
            },
          },
        },
        track: {
          background: lightColor,
          strokeWidth: "100%",
        },
      },
    },
    colors: [baseColor],
    stroke: {
      lineCap: "round",
    },
    labels: ["Progress"],
  };
};
</script>
  
<style scoped>
.card.card-custom {
    box-shadow: 0px 0px 30px 0px rgba(82, 63, 105, 0.05) !important;
    -webkit-box-shadow: 0px 0px 30px 0px rgba(82, 63, 105, 0.05);
    border: 0;
}

@media (min-width: 1399px) {
    .custom-button {
        width: 175px;
    }
}

/* Media query cho màn hình >= 768px và < 992px (md) */
@media (min-width: 992px) and (max-width: 1399px) {
    .custom-button {
        width: 145px;
    }
}

@media (max-width: 992px) {
    .custom-button {
        width: 139px;
    }
}
</style>
  