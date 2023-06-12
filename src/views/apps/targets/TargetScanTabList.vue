<template>
    <!--begin::Navbar-->
    <div class="card " :class="classDetail ? '' : 'mb-3 mb-xxl-8'">
        <!--begin::Card header-->
        <div class="card-header border-0 pt-6 position-absolute end-0 pe-1 " style="top: -80px;">
            <!--begin::Card toolbar-->
            <div class="card-toolbar">

                <div class="d-flex justify-content-end ">
                    <el-popconfirm confirm-button-text="Đồng ý" width="250" cancel-button-text="Không" icon="InfoFilled"
                        icon-color="#626AEF" title="Bạn có chắc muốn hủy chương trình quét này?" @confirm="confirmEvent"
                        @cancel="cancelEvent">
                        <template #reference>
                            <button type="button" :disabled="checkDisabled"
                                class="btn btn-sm fw-bold bg-danger btn-color-gray-700 btn-active-color-primary text-white">
                                <KTIcon icon-name="cross-square" icon-class="fs-2 text-white" />Hủy bỏ
                            </button>
                        </template>
                    </el-popconfirm>
                    <button v-if="scanStatus == 5" type="button" @click="handlePauser" :disabled="(checkDisabled || checkStatus)"
                        class="btn btn-sm btn-outline btn-outline-dashed fw-bold bg-body btn-color-gray-700 btn-active-color-primary  ms-2">
                        <KTIcon icon-name="bi bi-play-fill text-primary" icon-class="fs-2 " />
                        <span class="text-primary"> Tiếp tục</span>
                    </button>
                    <button v-else type="button" @click="handlePauser" :disabled="(checkDisabled || checkStatus)"
                        class="btn btn-sm btn-outline btn-outline-dashed fw-bold bg-body btn-color-gray-700 btn-active-color-danger  ms-2">
                        <KTIcon icon-name="bi bi-pause-fill text-danger" icon-class="fs-2 " />
                        <span class="text-danger">Tạm dừng</span>
                    </button>

                    <button type="button" :disabled="checkDisabled" @click="fileDownVisible = true"
                        class="btn btn-sm fw-bold bg-primary btn-color-gray-700 btn-active-color-primary ms-2 text-white">
                        <KTIcon icon-name="file-down" icon-class="fs-2 text-white" />
                        Xuất kết quả
                    </button>
                </div>
            </div>
            <!--end::Card toolbar-->
        </div>
        <!--end::Card header-->
        <div class="card-body pt-2 pb-0 shadow-hvover" :class="!classDetail ? ' d-block' : 'd-none'">
            <!--begin::Details-->
            <div class="d-flex flex-wrap flex-sm-nowrap">
                <!--begin::Info-->
                <div class="flex-grow-1">
                    <!--begin::Title-->
                    <div class="d-flex justify-content-between align-items-start flex-wrap">
                        <!--begin::Card body-->
                        <div class="card-body py-4 px-0">
                            <div class="row w-100">
                                <div class="col-3">
                                    <div class="row">
                                        <!--begin::Label-->
                                        <label class="col-4 fw-semobold text-muted">Tên</label>
                                        <!--end::Label-->

                                        <!--begin::Col-->
                                        <div class="col">
                                            <span class="fw-bold fs-6 text-dark">{{ targetData.name }}</span>
                                        </div>
                                        <!--end::Col-->
                                    </div>
                                </div>
                                <div class="col-3">
                                    <div class="row">
                                        <!--begin::Label-->
                                        <label class="col-4 fw-semobold text-muted">IP</label>
                                        <!--end::Label-->
                                        <!--begin::Col-->
                                        <div class="col">
                                            <span class="fw-bold fs-6 text-dark">{{ targetData.ip }}</span>
                                        </div>
                                        <!--end::Col-->
                                    </div>
                                </div>
                                <div class="col-3">
                                    <div class="row">
                                        <!--begin::Label-->
                                        <label class="col-4 fw-semobold text-muted">Domain</label>
                                        <!--end::Label-->

                                        <!--begin::Col-->
                                        <div class="col">
                                            <span class="fw-bold fs-6 text-dark">{{ targetData.domain }}</span>
                                        </div>
                                        <!--end::Col-->
                                    </div>
                                </div>
                            </div>
                            <!--begin::Row-->
                            <div class="row">
                                <div class=" col-3 p-2">
                                    <div class="border border-gray-300 border-dashed rounded py-3 px-4 ">
                                        <!--begin::Number-->
                                        <div class="d-flex align-items-center">
                                            <KTIcon icon-name="timer" icon-class="fs-3 text-success me-2" />
                                            <div class="fs-2 fw-bold">{{ diffTime }}</div>
                                        </div>
                                        <!--end::Number-->

                                        <!--begin::Label-->
                                        <div class="fw-semobold fs-6 text-gray-400">Thời Gian</div>
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
                                        <div class="fw-semobold fs-6 text-gray-400">Yêu cầu</div>
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
                                        <div class="fw-semobold fs-6 text-gray-400">Average Response Time</div>
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
                                        <div class="fw-semobold fs-6 text-gray-400">Đường dẫn</div>
                                        <!--end::Label-->
                                    </div>
                                    <!--end::Stat-->

                                </div>
                            </div>
                            <!--end::Row-->

                            <div class="mt-5 mb-2 w-100">
                                <span class="fw-semobold text-muted">Tiến trình</span>
                                <el-progress :percentage="progress" status="success" />
                            </div>
                        </div>
                        <!--end::Card body-->
                    </div>
                    <!--end::Title-->
                </div>
                <!--end::Info-->
            </div>
            <!--end::Details-->
        </div>
    </div>
    <!--end::Navbar-->
    <div class="row mb-3 h-50px align-items-center"
        :class="classDetail ? 'shadow-hvover bg-white rounded-3 mx-0 my-2' : ''">
        <div class="col-8 py-2 d-flex justify-content-start ">
            <div class="row">
                <div class="col" :class="classDetail ? ' d-block ' : 'd-none'">
                    <el-tooltip class="box-item" effect="dark" hide-after="0" content="Thông tin tiến trình"
                        placement="top">
                        <button type="button"
                            class="btn btn-sm fw-bold bg-secondary btn-color-gray-700 h-35px w-150px btn-active-color-primary me-2"
                            data-kt-menu-trigger="click" data-kt-menu-placement="bottom-start"
                            data-kt-menu-flip="top-start">
                            <KTIcon icon-name="information-3" icon-class="fs-2" />
                            Information
                        </button>
                        <!-- </div> -->
                    </el-tooltip>
                    <filtersTabScan @filterData="handleFilter" :targetData="targetData" :diffTime="diffTime"
                        :countRequest="countRequest" :averageResponseTime="averageResponseTime" :locations="locations"
                        :progress="progress" :scanStatus="scanStatus">
                    </filtersTabScan>
                </div>
                <div class="col">
                    <div class="d-flex align-items-center position-relative">
                        <KTIcon icon-name="magnifier" icon-class="fs-1 position-absolute ms-5" />
                        <input type="text" data-kt-subscription-table-filter="search" v-model="query"
                            :class="classDetail ? 'w-150px' : 'w-100'"
                            class="form-control h-35px ps-14 btn-active-color-primary" placeholder="Tìm kiếm theo tên" />
                    </div>
                </div>
                <div class="col d-flex flex-row">
                    <button type="button" class="btn btn-icon btn-sm fw-bold bg-success h-35px w-35px text-white"
                        @click.passive="handleSeverity(0)">
                        {{ severityInfo }}
                    </button>
                    <button type="button" class="btn btn-icon btn-sm fw-bold bg-primary h-35px w-35px text-white ms-2"
                        @click.passive="handleSeverity(1)">
                        {{ severityLow }}
                    </button>
                    <button type="button" class="btn btn-icon btn-sm fw-bold bg-warning h-35px w-35px text-white ms-2"
                        @click.passive="handleSeverity(2)">
                        {{ severityMedium }}
                    </button>
                    <button type="button" class="btn btn-icon btn-sm fw-bold bg-danger h-35px w-35px text-white ms-2"
                        @click.passive="handleSeverity(3)">
                        {{ severityHigh }}
                    </button>
                    <button @click.passive="handleSeverity(4)" type="button"
                        class="btn btn-icon btn-sm fw-bold btn-outline btn-outline-dashed btn-outline-info h-35px w-35px text-info ms-2">
                        All
                    </button>
                </div>
            </div>
        </div>
        <div class="col-4 text-end ms-auto py-2">
            <div class="d-flex justify-content-end">
                <!--begin::Tab nav-->
                <!-- <ul class="nav nav-pills me-6 mb-2 mb-sm-0" role="tablist">
                    <li class="nav-item m-0" role="presentation">
                        <a class="btn btn-sm btn-icon btn-light btn-color-muted btn-active-primary me-3 active"
                            data-bs-toggle="tab" href="#kt_project_users_card_pane" aria-selected="true" role="tab">
                            <i class="ki-duotone ki-element-plus fs-2"><span class="path1"></span><span
                                    class="path2"></span><span class="path3"></span><span class="path4"></span><span
                                    class="path5"></span></i> </a>
                    </li>

                    <li class="nav-item m-0" role="presentation">
                        <a class="btn btn-sm btn-icon btn-light btn-color-muted btn-active-primary" data-bs-toggle="tab"
                            href="#kt_project_users_table_pane" aria-selected="false" role="tab" tabindex="-1">
                            <i class="ki-duotone ki-row-horizontal fs-2"><span class="path1"></span><span
                                    class="path2"></span></i> </a>
                    </li>
                </ul> -->
                <!--end::Tab nav-->

                <!--begin::Actions-->
                <div class="d-flex my-0 mx-2">
                    <!--begin::Select-->
                    <button type="button" @click="reloadData" :disabled="checkDisabled"
                        class="btn btn-sm w-100px h-35px fw-bold bg-primary btn-color-gray-700 btn-active-color-primary ms-2 text-white">
                        <KTIcon icon-name="arrows-loop" icon-class="fs-2 text-white" />
                        Tải lại
                    </button>
                    <!--end::Select-->
                </div>
                <!--end::Actions-->

                <!--begin::Actions-->
                <div class="d-flex my-0">
                    <!--begin::Select-->
                    <el-select v-model="eventTime" class="d-block w-150px" height="40px" as="select">
                        <el-option value="300000" key="300000" label="5 phút" />
                        <el-option value="60000" key="60000" label="1 phút" />
                        <el-option value="30000" key="30000" label="30 giây" />
                        <el-option value="15000" key="15000" label="15 giây" />
                        <el-option value="5000" key="5000" label="5 giây" />
                    </el-select>
                    <!--end::Select-->
                </div>
                <!--end::Actions-->
            </div>
        </div>
    </div>

    <!--begin::Card-->
    <div class="card h-100 d-block">
        <div class="d-flex shadow-hvover" :class="classDetail ? 'hand-height-4 pe-1' : 'hand-height-3'">
            <!--begin::Card body-->
            <div class="card-body overflow-y-auto overflow-x-hidden h-100 m-0 p-0" ref="container"
                @mousedown="handleMouseDown" :style="classDetail ? { width: leftWidth + 'px' } : { width: '100%' }"
                :class="classDetail ? 'border-end' : 'col-12'">
                <div class="w-100">
                    <!-- <div :style="classDetail ? { width: contentWidth + 'px' } : { width: '100%' }"> -->
                    <KTDatatable :clickOnRow="true" :closeOnRow="closeOnRow" :data="list" :header="headerConfig"
                        :loading="loading" :itemsPerPage="itemsPerPage" :total="totalPage" :currentPage="currentPage"
                        @page-change="handlePage" :checkitemsPerPage="checkitemsPerPage"
                        @on-items-per-page-change="handlePerPage" @customRow="customRowTable">
                        <template v-slot:severity="{ row: customer }">
                            <div class="text-center">
                                <KTIcon icon-name="severity" icon-class="bi bi-bug-fill"
                                    :style="{ fontSize: '19px', color: getSeverity(customer.severity).color }" /><br>
                                <p class="fst-normal"
                                    :style="{ fontSize: '11px', color: getSeverity(customer.severity).color }">{{
                                        getSeverity(customer.severity).title }}</p>
                            </div>
                        </template>
                        <template v-slot:vt_name="{ row: customer }"><span class="fs-6 fw-bold text-hover-primary">
                                {{ customer.vt_name ?? (customer.port_scan.vt_name ?? (customer.port_scan.name +
                                    (customer.port_scan["matcher-name"] ? ":" + customer.port_scan["matcher-name"] : "")))
                                }}</span></template>
                        <template v-slot:affects_url="{ row: customer }">
                            <div class="badge badge-light">
                                {{ customer.affects_url ?? (customer.port_scan.host ?? "Default Name") }}</div>
                        </template>
                        <template v-slot:status="{ row: customer }">
                            <div> <span :class="`badge badge-${getStatus(customer.status).color}`">{{ customer.status ??
                                '--' }}</span>
                            </div>
                        </template>
                        <template v-slot:last_seen="{ row: customer }">
                            <span class="text-gray-600 w-bold d-flex justify-content-end align-items-center fs-7">
                                <KTIcon class="me-1" icon-name="calendar" icon-class="fs-3" />
                                {{ customer.last_seen }}
                            </span>
                        </template>
                    </KTDatatable>
                </div>
            </div>
            <!--end::Card body-->
            <div v-if="classDetail" @mousedown="startDragging" class="drag-handle"></div>
            <!--begin::Card2 body-->
            <div class="overflow-scroll h-100 " :style="classDetail ? { width: rightWidth + 'px' } : { width: '0px' }"
                :class="classDetail ? ' d-block' : 'd-none'">
                <div class="ms-3 pb-10">
                    <div class="card-title py-2 position-relative">
                        <h2 class="fw-bold pe-15 mt-5 fs-2">{{ detailVuln.vt_name }}</h2>
                        <div class="position-absolute top-50 end-0 translate-middle-y">
                            <button @click="handleCloseDetail" type="button" class="btn btn-icon btn-bg-body ">
                                <KTIcon icon-name="x" icon-class="bi bi-x" :style="{ fontSize: '25px' }" />
                            </button>
                        </div>
                    </div>
                    <div class="lh-lg mt-2">
                        <div class="mb-5" v-if="detailVuln.host != null && detailVuln.host != ''">
                            <h4 class="text-gray-800 fs-6 fw-bold cursor-pointer mb-0">URL : <span>{{ detailVuln.host
                            }}</span></h4>
                        </div>
                        <div class="mb-5" v-if="detailVuln.severity != '' || detailVuln.status != ''">
                            <span class="badge text-white me-2"
                                :style="{ background: getSeverity(detailVuln.severity).color }">Severity: {{
                                    getSeverity(detailVuln.severity).title }}</span>
                            <span :class="`badge badge-${getStatus(detailVuln.status).color}`">Trạng thái: {{
                                detailVuln.status }}</span>
                        </div>

                        <template v-if="checkDetailVuln">
                            <div class="mb-5" v-if="detailVuln.details != null && detailVuln.details != ''">
                                <h4 class="text-gray-800 fs-6 fw-bold cursor-pointer mb-0">Attack Details</h4>
                                <div v-html="detailVuln.details"></div>
                            </div>
                            <div class="mb-5" v-if="detailVuln.classification != null && detailVuln.classification != ''">
                                <h4 class="text-gray-800 fs-6 fw-bold cursor-pointer mb-0">Classification</h4>
                                <div class="lh-base mt-3">
                                    <div class="row">
                                        <div class="w-70px"><span>CWE</span></div>
                                        <div class="col"><span>{{ detailVuln.tags ?? '--' }}</span></div>
                                    </div>
                                    <div class="row">
                                        <div class="w-70px"><span>CVSS</span></div>
                                        <div class="col">
                                            <template v-for="(items, index) in detailVuln.classification" :key="index">
                                                <template v-if="items != null">
                                                    <template v-if="Array.isArray(items)">
                                                        <template v-for="(item, key) in items" :key="key">
                                                            <li class="d-flex align-items-center py-2">
                                                                <span
                                                                    class="bullet bullet-dot h-5px w-5px bg-success me-5"></span>
                                                                {{ index }} : {{ item }}
                                                            </li>
                                                        </template>
                                                    </template>
                                                    <template v-else>
                                                        <li class="d-flex align-items-center py-2">
                                                            <span
                                                                class="bullet bullet-dot h-5px w-5px bg-success me-5"></span>
                                                            {{ index }} : {{ items }}
                                                        </li>
                                                    </template>
                                                </template>
                                            </template>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="mb-5">
                                <div id="kt_detail_collapsible_scan">

                                    <div class="py-1" v-if="detailVuln.description != null && detailVuln.description != ''">
                                        <div class="py-3 d-flex flex-stack flex-wrap">
                                            <div class="d-flex align-items-center collapsible toggle collapsed"
                                                data-bs-toggle="collapse" data-bs-target="#kt_detail_collapsible_scan_5"
                                                aria-expanded="false">
                                                <div class="btn btn-sm btn-icon btn-active-color-primary ms-n3 me-2">
                                                    <KTIcon icon-name="minus-square"
                                                        icon-class="toggle-on text-primary fs-2" />
                                                    <KTIcon icon-name="plus-square" icon-class="toggle-off fs-2" />
                                                </div>

                                                <div class="me-3">
                                                    <h4 class="text-gray-800 fw-bold cursor-pointer mb-0">Vulnerability
                                                        Description</h4>
                                                </div>
                                            </div>
                                        </div>

                                        <div id="kt_detail_collapsible_scan_5" class="fs-6 px-2 collapse" style="">
                                            <div v-html="detailVuln.description">
                                            </div>
                                        </div>
                                    </div>

                                    <div class="separator separator-dashed"
                                        v-if="detailVuln.description != null && detailVuln.description != ''"></div>


                                    <div class="py-1" v-if="detailVuln.impact != null && detailVuln.impact != ''">
                                        <div class="py-3 d-flex flex-stack flex-wrap">
                                            <div class="d-flex align-items-center collapsible toggle collapsed"
                                                data-bs-toggle="collapse" data-bs-target="#kt_detail_collapsible_scan_5"
                                                aria-expanded="false">
                                                <div class="btn btn-sm btn-icon btn-active-color-primary ms-n3 me-2">
                                                    <KTIcon icon-name="minus-square"
                                                        icon-class="toggle-on text-primary fs-2" />
                                                    <KTIcon icon-name="plus-square" icon-class="toggle-off fs-2" />
                                                </div>

                                                <div class="me-3">
                                                    <h4 class="text-gray-800 fw-bold cursor-pointer mb-0">The impact of this
                                                        vulnerability</h4>
                                                </div>
                                            </div>
                                        </div>

                                        <div id="kt_detail_collapsible_scan_5" class="fs-6 px-2 collapse" style="">
                                            <div>
                                                <span>{{ detailVuln.impact }}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="separator separator-dashed"
                                        v-if="detailVuln.impact != null && detailVuln.impact != ''"></div>


                                    <div class="py-1" v-if="detailVuln.request != null && detailVuln.request != ''">
                                        <div class="py-3 d-flex flex-stack flex-wrap">
                                            <div class="d-flex align-items-center collapsible toggle collapsed"
                                                data-bs-toggle="collapse" data-bs-target="#kt_detail_collapsible_scan_1"
                                                aria-expanded="false">
                                                <div class="btn btn-sm btn-icon btn-active-color-primary ms-n3 me-2">
                                                    <KTIcon icon-name="minus-square"
                                                        icon-class="toggle-on text-primary fs-2" />
                                                    <KTIcon icon-name="plus-square" icon-class="toggle-off fs-2" />
                                                </div>

                                                <div class="me-3">
                                                    <h4 class="text-gray-800 fw-bold cursor-pointer mb-0">HTTP Request</h4>
                                                </div>
                                            </div>
                                        </div>

                                        <div id="kt_detail_collapsible_scan_1" class="fs-6 px-2 collapse" style="">
                                            <div>
                                                <CodeHighlighter lang="json">{{ detailVuln.request }}</CodeHighlighter>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="separator separator-dashed"
                                        v-if="detailVuln.request != null && detailVuln.request != ''"></div>

                                    <div class="py-1"
                                        v-if="detailVuln.http_response != null && detailVuln.http_response != ''">
                                        <div class="py-3 d-flex flex-stack flex-wrap">
                                            <div class="d-flex align-items-center collapsible toggle collapsed"
                                                data-bs-toggle="collapse" data-bs-target="#kt_detail_collapsible_scan_2">
                                                <div class="btn btn-sm btn-icon btn-active-color-primary ms-n3 me-2">
                                                    <KTIcon icon-name="minus-square"
                                                        icon-class="toggle-on text-primary fs-2" />

                                                    <KTIcon icon-name="plus-square" icon-class="toggle-off fs-2" />
                                                </div>

                                                <div class="me-3">
                                                    <h4 class="text-gray-800 fw-bold cursor-pointer mb-0">HTTP Response</h4>
                                                </div>
                                            </div>
                                        </div>

                                        <div id="kt_detail_collapsible_scan_2" class="collapse fs-6 px-2">
                                            <div>
                                                <CodeHighlighter lang="html">{{ detailVuln.http_response }}
                                                </CodeHighlighter>
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
                                                    <KTIcon icon-name="minus-square"
                                                        icon-class="toggle-on text-primary fs-2" />
                                                    <KTIcon icon-name="plus-square" icon-class="toggle-off fs-2" />
                                                </div>

                                                <div class="me-3">
                                                    <h4 class="text-gray-800 fw-bold cursor-pointer mb-0">How to fix this
                                                        vulnerability</h4>
                                                </div>
                                            </div>
                                        </div>

                                        <div id="kt_detail_collapsible_scan_3" class="collapse fs-6 px-2">
                                            <div>
                                                {{ detailVuln.recommendation }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <div class="mb-5" v-if="detailVuln.tags != null && detailVuln.tags != ''">
                                <h4 class="text-gray-800 fs-6 fw-bold cursor-pointer mb-0">CVE/CWE</h4>
                                <div class="lh-base ms-5">
                                    <template v-for="(tag, index) in detailVuln.tags" :key="index">
                                        <li class="d-flex align-items-center py-2">
                                            <span class="bullet bullet-dot h-5px w-5px bg-success me-5"></span> {{ tag }}
                                        </li>
                                    </template>
                                </div>
                            </div>
                            <div class="mb-5" v-if="detailVuln.classification != null && detailVuln.classification != ''">
                                <h4 class="text-gray-800 fs-6 fw-bold cursor-pointer mb-0">Classification</h4>
                                <div class="lh-base ms-5">
                                    <template v-for="(items, index) in detailVuln.classification" :key="index">
                                        <template v-if="items != null">
                                            <template v-if="Array.isArray(items)">
                                                <template v-for="(item, key) in items" :key="key">
                                                    <li class="d-flex align-items-center py-2">
                                                        <span class="bullet bullet-dot h-5px w-5px bg-success me-5"></span>
                                                        {{ index }} : {{ item }}
                                                    </li>
                                                </template>
                                            </template>
                                            <template v-else>
                                                <li class="d-flex align-items-center py-2">
                                                    <span class="bullet bullet-dot h-5px w-5px bg-success me-5"></span>
                                                    {{ index }} : {{ items }}
                                                </li>
                                            </template>
                                        </template>
                                    </template>
                                </div>
                            </div>
                            <div class="mb-5" v-if="detailVuln.type != null && detailVuln.type != ''">
                                <p><span class="text-gray-800 fs-6 fw-bold cursor-pointer ">Service : </span><span
                                        class="badge badge-light-primary">{{ detailVuln.type }}</span></p>
                            </div>
                            <div class="mb-5" v-if="detailVuln.reference != null && detailVuln.reference != ''">
                                <h4 class="text-gray-800 fs-6 fw-bold cursor-pointer mb-0">Reference</h4>
                                <div class="lh-base ms-5">
                                    <template v-for="(tag, index) in detailVuln.reference" :key="index">
                                        <li class="d-flex align-items-center py-2">
                                            <span class="bullet bullet-dot h-5px w-5px bg-success me-5"></span>
                                            {{ tag }}
                                            <KTIcon icon-name="copy" class="fs-2 ms-3" data-clipboard-target="123" />
                                        </li>
                                    </template>
                                </div>
                            </div>
                            <div class="mb-5" v-if="detailVuln.matcherName != null && detailVuln.matcherName != ''">
                                <h4 class="text-gray-800 fs-6 fw-bold cursor-pointer mb-0">matcher name</h4>
                                <span> {{ detailVuln.matcherName }}</span>
                            </div>
                            <div class="mb-5" v-if="detailVuln.description != null && detailVuln.description != ''">
                                <h4 class="text-gray-800 fs-6 fw-bold cursor-pointer mb-0">Description</h4>
                                <span> {{ detailVuln.description }}</span>
                            </div>
                        </template>

                    </div>
                </div>
            </div>

            <!--end::Card2 body-->
        </div>

    </div>
    <!--end::Card-->


    <!-- // modoal  -->
    <el-dialog v-model="fileDownVisible" title="Xác nhận xuất file">
        <div class="card h-100 bg-secondary">
            <!--begin::Card body-->
            <div class="card-body d-flex justify-content-center text-center flex-column p-8">
                <!--begin::Name-->
                <div class="symbol symbol-60px mb-5">
                    <i class="fa-solid fa-file-excel fs-4x text-primary"></i>
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
import { defineComponent, ref, onMounted, reactive, watch, onBeforeUnmount } from "vue";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import ApiService from "@/core/services/ApiService";
import Swal from "sweetalert2/dist/sweetalert2.js";
import filtersTabScan from "@/views/apps/targets/filtersTabScan.vue";
import CodeHighlighter from "@/components/highlighters/CodeHighlighter.vue";
import { useRoute } from 'vue-router';
import { debounce } from 'vue-debounce'
import { ElMessage } from 'element-plus'

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
        const checkStatusDisabled = ref<boolean>(false)
        const severityLow = ref<number>(0)
        const severityMedium = ref<number>(0)
        const severityHigh = ref<number>(0)
        const scanStatus = ref<number>(0)
        const filterSeverity = ref<number | null>(null)
        const timeEnd = ref<number | any>(null)
        const timeStart = ref<number | any>(null)
        const closeOnRow = ref(true);

        const headerConfig = ref([
            {
                columnName: "Mức độ",
                columnLabel: "severity",
                columnWidth: 90,
                textAlign: "center",
            },
            {
                columnName: "Lỗ hổng",
                columnLabel: "vt_name",
            },
            {
                columnName: "URL",
                columnLabel: "affects_url",
            },
            {
                columnName: "Trạng thái",
                columnLabel: "status",
                columnWidth: 90,
            },
            {
                columnName: "Ngày tạo",
                columnLabel: "last_seen",
                columnWidth: 100,
            }
        ]);

        const handleClick = (data: object | any, type: String) => {
            typeModal.value = type
            apiData.value.description = data.description;
        };

        const handlePage = (page: number) => {
            currentPage.value = page ?? 1;
            getData();
        };

        const handlePerPage = (itemsPage: number) => {
            itemsPerPage.value = itemsPage ?? 20;
            getData();
        };

        const getData = async () => {
            loading.value = true;
            setTimeout(() => loading.value = false, 500)
            return ApiService.get(`/scan/detail/${scanID.value}`)
                .then(({ data }) => {

                    if (filterSeverity.value != null && query.value != null) {
                        list.value = data.vulnerabilities.filter((vulnerability: detailData) => (vulnerability.vt_name.toLowerCase().indexOf(query.value.toLowerCase()) > -1 && vulnerability.severity == filterSeverity.value))
                    } else if (filterSeverity.value != null) {
                        list.value = data.vulnerabilities.filter((vulnerability: detailData) => (vulnerability.severity == filterSeverity.value))
                    } else if (query.value != null) {
                        list.value = data.vulnerabilities.filter((vulnerability: detailData) => (vulnerability.vt_name.toLowerCase().indexOf(query.value.toLowerCase()) > -1))
                    } else {
                        list.value = data.vulnerabilities;
                    }

                    targetData.value.id = data.target.id
                    targetData.value.domain = data.target.domain
                    targetData.value.ip = data.target.ip
                    targetData.value.name = data.target.name
                    totalPage.value = data.count

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
                    humanDiffTime()
                    showLocaleTime()
                    // console.log(countRequest.value)
                    // console.log(averageResponseTime.value)
                    // console.log(locations.value)
                    // console.log(maxResponseTime.value)
                    console.log(data.scan_status)
                    console.log(new Date(timeEnd.value))
                    console.log(new Date(timeStart.value))
                })
                .catch(({ response }) => {
                    notification(response.data.detail, 'error', 'Có lỗi xảy ra')
                });
        }
        const debounceSearch = debounce(getData, 1000);
        watch(query, debounceSearch);
        const detailVuln = reactive({
            id: '',
            vt_name: '',
            severity: '',
            ip: '',
            host: '',
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
            author: '',
            matcherName: '',
            cvss3: '',
            references: '',
            long_description: '',
            impact: '',
        });
        const checkDetailVuln = ref<boolean>(false)
        const getDetailVuln = async (vuln_id: number) => {
            return ApiService.get(`/scan/vulnerabilities/${scanID.value}?vul_id=${vuln_id}`)
                .then(({ data }) => {
                    detailVuln.vt_name = data.vt_name ?? ''
                    detailVuln.request = data.request ?? ''
                    detailVuln.severity = data.severity ?? ''
                    detailVuln.schema = data.schema ?? ''
                    detailVuln.status = data.status ?? ''
                    detailVuln.host = data.affects_url ?? ''
                    detailVuln.details = data.details ?? ''
                    detailVuln.description = data.description ?? ''
                    detailVuln.http_response = data.http_response ?? ''
                    detailVuln.impact = data.impact ?? ''
                    detailVuln.recommendation = data.recommendation ?? ''
                    detailVuln.long_description = data.long_description ?? ''
                    detailVuln.references = data.references ?? ''
                    detailVuln.classification = data.classification ?? ''
                    detailVuln.cvss3 = data.cvss3 ?? ''
                    detailVuln.tags = data.tags.find((value: String) => value.includes("CWE-")) ?? ''
                    detailVuln.cvss_score = data.cvss_score ?? ''
                    console.log(detailVuln)
                    console.log(data)

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
                checkDetailVuln.value = false;
                detailVuln.vt_name = detail.vt_name ?? detail.port_scan.vt_name
                detailVuln.author = detail.port_scan.author ?? ''
                detailVuln.host = detail.port_scan.host ?? ''
                detailVuln.description = detail.port_scan.description ?? ''
                detailVuln.reference = detail.port_scan.reference ?? ''
                detailVuln.classification = detail.port_scan.classification ?? ''
                detailVuln.tags = detail.port_scan.tags ?? ''
                detailVuln.severity = detail.severity
                detailVuln.status = detail.port_scan.status ?? detail.status
                detailVuln.type = detail.port_scan.type ?? ''
                detailVuln.matcherName = detail.port_scan['matcher-name'] ?? ''
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
                confirmButtonText: "Ok, got it!",
                heightAuto: false,
                customClass: {
                    confirmButton: "btn btn-primary",
                },
            }).then(() => {
                // hideModal(ModalDelete.value);
                // hideModal( ModalConfirm.value);
            });
        };

        const handleSeverity = (data: number) => {
            if (data == 4) {
                filterSeverity.value = null
            } else {
                filterSeverity.value = data
            }
            getData();
        };

        const getSeverity = (severity: number | string) => {
            if (severity == 0 || severity == 'Info') {
                return { id: 0, title: 'Info', color: '#28a745', class: 'severityInfo' };
            } else if (severity == 1 || severity == 'Low') {
                return { id: 1, title: 'Low', color: '#23b7e5', class: 'severityLow' };
            } else if (severity == 2 || severity == 'Medium') {
                return { id: 2, title: 'Medium', color: '#fcba32', class: 'severityMedium' };
            } else if (severity == 3 || severity == 'High') {
                return { id: 3, title: 'High', color: '#e11f26', class: 'severityHigh' };
            }
            return { id: 4, title: 'undefined', color: '#7239ea', class: 'severityundefined' };
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

        // reloadData
        const reloadgetData = () => {
            getData();
            ElMessage({
                message: 'Tải lại thành công',
                type: 'success',
                center: false,
            })
        };
        const reloadData = debounce(reloadgetData, 500);

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
                ElMessage({
                    message: 'Danh dách đã được quét thành công không thể tạm dừng',
                    type: 'success',
                    center: false,
                })
            } else if (scanStatus.value == 5) {
                // console.log('tiếp tục')
                getResume()
            } else if (scanStatus.value == 2) {
                // console.log('tạm dừng')
                getPauser()
            } else {
                ElMessage({
                    message: 'Có lỗi xảy ra',
                    type: 'error',
                    center: false,
                })
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
                    ElMessage({
                        message: data.detail ?? 'Tiếp tục thành công',
                        type: 'success',
                        center: false,
                    })
                })
                .catch(({ response }) => {
                    ElMessage({
                        message: response.data.detail ?? 'Có lỗi xảy ra',
                        type: 'error',
                        center: false,
                    })
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
                    ElMessage({
                        message: data.detail ?? 'Tạm dừng thành công',
                        type: 'success',
                        center: false,
                    })
                })
                .catch(({ response }) => {
                    ElMessage({
                        message: response.data.detail ?? 'Có lỗi xảy ra',
                        type: 'error',
                        center: false,
                    })
                });
        };

        // thời gian tự động chạy
        const timeAuto = ref<any>(null);

        const showLocaleTime = async () => {
            if (scanStatus.value == 5) {
                clearInterval(timeAuto.value);
                humanDiff();
            } else if (scanStatus.value == 2) {
                clearInterval(timeAuto.value);
                timeAuto.value = setInterval(() => { humanDiff(); }, 1000);
            }else {
                return;
            }
        };

        // tải về files
        const fileDownVisible = ref(false)
        const downloadAcunetix = async () => {
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
                ElMessage({
                    message: reponse_message ?? 'Tạm dừng thành công',
                    type: 'success',
                    center: false,
                })
                fileDownVisible.value = false;
            })
        };
        // hủy
        const confirmEvent = () => {
            ElMessage({
                message: 'Test hủy',
                type: 'success',
                center: false,
            })
        }

        const cancelEvent = () => {
            ElMessage({
                message: 'Hủy bỏ lệnh thành công',
                type: 'info',
                center: false,
            })
        }

        // tìm kiếm 
        const handleFilter = (data: any) => {
            if (data) {
                query.value = data.query;
                currentPage.value = 1;
                getData();
            } else {
                notification('Có lỗi với filter', 'error', 'Có lỗi xảy ra')
            }

        };


        // tính thời gian
        const diffTime = ref<string | any>(0);
        const time = ref<any>(null);
        const eventTime = ref<number | any>('30000');

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

        const humanDiffTime = () => {
            checkDisabled.value = true
            setTimeout(() => {
                checkDisabled.value = false;
            }, 500);
            if (scanStatus.value == 5) {
                clearInterval(time.value);
                humanDiff();
            } else if (scanStatus.value == 2){
                clearInterval(time.value);
                humanDiff();
                time.value = setInterval(() => { getData(); humanDiff(); }, eventTime.value);
            } else{
                return
            }
        };
        // watch(eventTime, humanDiffTime);

        // Tính toán chiều rộng nội dung
        const contentWidth = ref(0);
        onMounted(() => {
            // contentWidth.value = container.value.scrollWidth;
            contentWidth.value = container.value.scrollWidth;
        });

        onMounted(() => {
            getData();
            // humanDiffTime();
        });

        onBeforeUnmount(() => {
            clearInterval(timeAuto);
            clearInterval(time);
        });


        return {
            scanID,
            getData,
            list,
            headerConfig,
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
            handleSeverity,
            filterSeverity,
            activeName,
            closeOnRow,
            checkitemsPerPage,

            // tải về
            fileDownVisible,
            downloadAcunetix,


            // crud
            apiData,
            handleClick,

            // detials
            customRowTable,
            getDetailVuln,
            checkDetailVuln,

            // page 
            itemsPerPage,
            totalPage,
            currentPage,
            handlePage,
            handlePerPage,

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
            reloadData,
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
.shadow-hvover {
    box-shadow: 5px 6px 10px -9px rgba(0, 0, 0, .3);
}

.hand-height-3 {
    height: calc(100% - 260px) !important;
}

.hand-height-4 {
    height: calc(100% - 70px) !important;
}

.el-select .el-input__wrapper {
    height: 35px !important;
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
  