<template>
    <KTToolbar @on-header-height="onheaderHeight"></KTToolbar>
    <!--begin::Card--> 
        <div class="app-container container-fluid" :style="{marginTop: headerHeight + 'px'}">
            <div class="card h-100 d-block bg-transparent">
                <div class="card px-5 mb-3 card-custom">
                    <div class="card-body p-0">
                        <!--begin::Details-->
                        <div class="w-100 mb-3">
                            <div class="row pt-3 lh-lg fs-13px">
                                <div class="col-sm-6 col-md-3 col-lg-3 col-12">
                                    <span class="w-70px text-capitalize">Mục tiêu: </span>
                                    <span class="fw-bold" :class="(targetData.name != '') ? '' : 'badge badge-light-danger'">{{ (targetData.name != '') ? targetData.name : '--' }}</span>
                                </div>
                                <div class="col-sm-6 col-md-3 col-lg-3 col-12">
                                    <span class="w-70px text-capitalize">Nhóm mục tiêu: </span>
                                    <span class="fw-bold" :class="(targetData.group != '') ? '' : 'badge badge-light-danger'">{{ (targetData.group != '') ? targetData.group : '--' }}</span>
                                </div>
                                <div  class="col-sm-6 col-md-3 col-lg-3 col-12">
                                    <span class="w-70px text-capitalize">Ip: </span>
                                    <span class="fw-bold" :class="(targetData.ip != '') ? '' : 'badge badge-light-danger'">{{ (targetData.ip != '') ? targetData.ip : '--' }}</span>

                                </div>
                                <div  class="col-sm-6 col-md-3 col-lg-3 col-12">
                                    <span class="w-70px text-capitalize">Domain: </span>
                                    <span class="fw-bold" :class="(targetData.domain != '') ? '' : 'badge badge-light-danger'">{{ (targetData.domain != '') ? targetData.domain : '--' }}</span>
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
                                        href="#kt_recon_tab">Recon</a>
                                </li>
                                <!--end:::Tab item-->

                                <!--begin:::Tab item-->
                                <li class="nav-item">
                                    <a class="nav-link text-active-primary me-6" data-bs-toggle="tab"
                                        href="#kt_scans_tab">Scans</a>
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
                    <div class="tab-pane fade show active" id="kt_recon_tab" role="tabpanel">
                        <div>
                            <div class="card rounded-0 rounded-bottom ">
                                <template v-if="checkRecon == true" >
                                    <div class="px-5 py-3">
                                        <el-empty class="fs-13px" :description="checkReconMessage" />
                                    </div>
                                </template>
                                <template v-else>
                                    <div class="px-5 py-3">
                                    <el-row :gutter="10">
                                        <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8" class="mb-3 mx-0">
                                            <el-card shadow="hover" class="box-card rounded-3 h-100" :body-style="{ padding: '5px' }">
                                                <reconActivity :activitieLine="activities" :activity="activity" chartHeight="300"
                                                    :process="process"></reconActivity>
                                            </el-card>
                                        </el-col>
                                        <el-col :xs="24" :sm="16" :md="16" :lg="16" :xl="16" class="d-grid">
                                            <el-row :gutter="10">
                                                <el-col :span="6" class="mb-3 mx-0">
                                                    <el-card shadow="hover" class="box-card rounded-3 h-100" :body-style="{ padding: '20px 20px' }">
                                                        <!--begin::Label-->
                                                        <div class="fs-5 text-muted fw-semobold">Subdomains</div>
                                                        <!--end::Label-->
                                                        <!--begin::Stat-->
                                                        <div class="d-flex align-items-start flex-wrap">
                                                            <div class="fs-2x fw-bold me-2 text-dark">{{ subdomain.total_subdomain }}</div>
                                                        </div>
                                                        <div class="pt-5 flex-wrap align-items-end">
                                                            <div class="row">
                                                                <div class="col-12 d-flex fw-semibold align-items-center">
                                                                <div class="text-gray-500 me-4"><span class="text-success">{{ subdomain.total_subdomain_live }}</span> Alive</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </el-card>
                                                </el-col>
                                                <el-col :span="6" class="mb-3 mx-0">
                                                    <el-card shadow="hover" class="box-card h-100 rounded-3" :body-style="{ padding: '20px 20px' }">
                                                        <!--begin::Label-->
                                                        <div class="fs-5 text-muted fw-semobold">Endpoints</div>
                                                        <!--end::Label-->
                                                        <!--begin::Stat-->
                                                        <div class="d-flex align-items-start flex-wrap">
                                                            <div class="fs-2x fw-bold me-2 text-dark">{{ endpoint.message.total_endpoint }}</div>
                                                        </div>
                                                        <div class="pt-5 flex-wrap align-items-end">
                                                            <div class="row">
                                                                <div class="col-12 d-flex fw-semibold align-items-center">
                                                                <div class="text-gray-500 me-4"><span class="text-success">{{ endpoint.message.total_endpoint_live }}</span> Alive</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </el-card>
                                                </el-col>
                                                <el-col :span="6" class="mb-3 mx-0">
                                                    <el-card shadow="hover" class="box-card h-100 rounded-3" :body-style="{ padding: '20px 20px' }">
                                                        <!--begin::Label-->
                                                        <div class="fs-5 text-muted fw-semobold">Dịch Vụ</div>
                                                        <!--end::Label-->
                                                        <!--begin::Stat-->
                                                        <div class="">
                                                            <div class="fs-2x fw-bold me-2 text-dark">{{ services.total }}</div>
                                                        </div>
                                                        <div class="pt-5 flex-wrap align-items-end">
                                                            <div class="row">
                                                                <div class="col-12 d-flex fw-semibold align-items-center">
                                                                <div class="text-gray-500 me-4"><span class="text-primary">{{ services.total_open }}</span> Open, <span class="text-danger">{{ services.total_close }}</span> Closed</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </el-card>
                                                </el-col>
                                                <el-col :span="6" class="mb-3 mx-0">
                                                    <el-card shadow="hover" class="box-card h-100 rounded-3" :body-style="{ padding: '20px 20px' }">
                                                        <!--begin::Label-->
                                                        <div class="fs-5 text-muted fw-semobold mb-2" >Tài Khoản</div>
                                                        <!--end::Label-->
                                                        <!--begin::Stat-->

                                                        <!--begin::Stats-->
                                                        <div class="d-flex flex-wrap mt-1 row">
                                                            <!--begin::Stat-->
                                                            <div
                                                                class=" col-12 min-w-80px py-1 px-2 me-2 mb-1 ">
                                                                <div class="fw-semobold fs-13px text-dark text-gray-500">
                                                                    <span class="text-primary " style="font-weight: 500;">
                                                                        {{ account.email }} </span> Địa Chỉ Email</div>
                                                            </div>
                                                            <!--end::Stat-->

                                                            <!--begin::Stat-->
                                                            <div
                                                                class="col-12 min-w-80px py-1 px-2 me-2 mb-1">
                                                                <div class="fw-semobold fs-13px text-dark text-gray-500">
                                                                    <span class="text-primary" style="font-weight: 500;">{{
                                                                    account.credentials }} </span> Credentials</div>
                                                            </div>
                                                            <!--end::Stat-->
                                                        </div>
                                                        <!--end::Stats-->
                                                    </el-card>
                                                </el-col>
                                            </el-row>
                                            <el-row :gutter="10">
                                                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb-3 mx-0">
                                                    <el-card shadow="hover" class="box-card rounded-3 h-100 "
                                                        :body-style="{ padding: '0', height: 'calc(100% - 56px)' }">
                                                        <template #header>
                                                            <div>
                                                                <span class="card-label fw-bold text-dark fs-5">Thông Tin Về Domain</span>
                                                            </div>
                                                        </template>
                                                        <div class="h-500px">
                                                            <template v-if="domain_info_status == 3">
                                                                <template v-if="domain_info == '' || Object.keys(domain_info).length == 0">
                                                                    <div
                                                                        class="px-5 w-100 h-100 d-flex flex-column justify-content-center text-center">
                                                                        <div class="text-center mb-5">
                                                                            <i class="fa-solid fa-circle-info fa-bounce fs-3x text-primary"></i>
                                                                        </div>
                                                                        <span>Không Tìm Thấy Dữ Liệu Nào!</span>
                                                                    </div>
                                                                </template>
                                                                <template v-else>
                                                                    <el-tabs tab-position="left" type="border-card" :stretch="true"
                                                                        class="demo-tabs2 padding-tabs border border-0 h-100" :lazy="true">
                                                                        <el-tab-pane v-for="(items, index) in domain_info" :key="index" class="h-100">
                                                                            <template #label>
                                                                                <span class="custom-tabs-label text-capitalize">
                                                                                    <span class="text-muted">{{ convertToString(index) }}</span>
                                                                                </span>
                                                                            </template>
                                                                            <div class="">
                                                                                <template v-if="items == '' || items == null">
                                                                                    <div
                                                                                        class="px-5 w-100 h-100 d-flex flex-column justify-content-center text-center">
                                                                                        <div class="text-center mb-5">
                                                                                            <i
                                                                                                class="fa-solid fa-circle-info fa-bounce fs-3x text-primary"></i>
                                                                                        </div>
                                                                                        <span>Không Tìm Thấy Dữ Liệu Nào!</span>
                                                                                    </div>
                                                                                </template>
                                                                                <template v-else>
                                                                                    <!--begin::Table container-->
                                                                                    <div class="table-responsive w-100 h-500px">
                                                                                        <!--begin::Table-->
                                                                                        <table class="table table-row-dashed table-row-gray-300 ">
                                                                                            <!--begin::Table head-->
                                                                                            <!--begin::Table body-->
                                                                                            <tbody class="overflow-y-auto w-100">
                                                                                                <tr v-for="(item, key) in items" :key="key">
                                                                                                    <td class="text-start"><span>{{ key }}</span>
                                                                                                    </td>
                                                                                                    <td class="text-start">
                                                                                                        <template v-if="checkArray(item) == true">
                                                                                                            <template v-for="el in item">
                                                                                                                <span
                                                                                                                    class="badge badge-light-primary me-2 my-1">{{
                                                                                                                        el }}</span>
                                                                                                            </template>
                                                                                                        </template>
                                                                                                        <template v-else>
                                                                                                            <span>{{ item }}</span>
                                                                                                        </template>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                            <!--end::Table body-->
                                                                                        </table>
                                                                                        <!--end::Table-->
                                                                                    </div>
                                                                                    <!--end::Table container-->
                                                                                </template>

                                                                            </div>
                                                                        </el-tab-pane>
                                                                    </el-tabs>
                                                                </template>
                                                            </template>
                                                            <template v-else-if="domain_info_status == 4">
                                                                <div class="p-5 w-100 h-100 d-flex flex-column justify-content-center">
                                                                    <div class="text-center mb-5">
                                                                        <i class="fa-regular fa-circle-question fa-bounce fs-3x text-warning"></i>
                                                                    </div>
                                                                    <div class="" v-html="linkCheck"></div>
                                                                </div>
                                                            </template>
                                                            <template v-else-if="domain_info_status == 0">
                                                                <div class="p-5 w-100 h-100 d-flex flex-column justify-content-center">
                                                                    <div class="text-center mb-5">
                                                                        <i class="fa-regular fa-circle-xmark fa-bounce fs-3x text-warning"></i>
                                                                    </div>
                                                                    <div class="text-center">{{ domain_info }}</div>
                                                                </div>
                                                            </template>
                                                            <template v-else>
                                                                <div class="mt-5 m-3">
                                                                    <el-skeleton :rows="7" animated />
                                                                </div>
                                                            </template>
                                                        </div>
                                                    </el-card>
                                                </el-col>
                                                <el-col :xs="24" :sm="12" :md="12" :lg="12" :xl="12" class="mb-3 mx-0">
                                                    <el-card shadow="hover" class="box-card rounded-3 h-100 "
                                                        :body-style="{ padding: '0', height: 'calc(100% - 56px)' }">
                                                        <template #header>
                                                            <div>
                                                                <span class="card-label fw-bold text-dark fs-5">Thông Tin Về IP</span>
                                                            </div>
                                                        </template>
                                                        <div class="h-500px">
                                                            <template v-if="ip_info_status == 3">
                                                                <template v-if="ip_info == '' || Object.keys(ip_info).length == 0">
                                                                    <div
                                                                        class="px-5 w-100 h-100 d-flex flex-column justify-content-center text-center">
                                                                        <div class="text-center mb-5">
                                                                            <i class="fa-solid fa-circle-info fa-bounce fs-3x text-primary"></i>
                                                                        </div>
                                                                        <span>Không Tìm Thấy Dữ Liệu Nào!</span>
                                                                    </div>
                                                                </template>
                                                                <template v-else>
                                                                    <el-tabs tab-position="left" type="border-card" :stretch="true"
                                                                        class="demo-tabs padding-tabs border border-0 h-100" :lazy="true">
                                                                        <el-tab-pane v-for="(items, index) in ip_info" :key="index" class="h-100">
                                                                            <template #label>
                                                                                <span class="custom-tabs-label text-capitalize">
                                                                                    <span class="text-muted">{{ convertToString(index) }}</span><br>
                                                                                </span>
                                                                            </template>
                                                                            <div class="">
                                                                                <template v-if="items == '' || items == null">
                                                                                    <div
                                                                                        class="px-5 w-100 h-100 d-flex flex-column justify-content-center text-center">
                                                                                        <div class="text-center mb-5">
                                                                                            <i
                                                                                                class="fa-solid fa-circle-info fa-bounce fs-3x text-primary"></i>
                                                                                        </div>
                                                                                        <span>Không Tìm Thấy Dữ Liệu Nào!</span>
                                                                                    </div>
                                                                                </template>
                                                                                <template v-else>
                                                                                    <!--begin::Table container-->
                                                                                    <div class="table-responsive w-100 h-500px">
                                                                                        <!--begin::Table-->
                                                                                        <table class="table table-row-dashed table-row-gray-300 ">
                                                                                            <!--begin::Table body-->
                                                                                            <tbody class="overflow-y-auto w-100">
                                                                                                <tr v-for="(item, key) in items" :key="key">
                                                                                                    <td class="text-start"><span>{{ checkString(key)
                                                                                                    }}</span>
                                                                                                    </td>
                                                                                                    <td v-if="checkArray(item) == true"
                                                                                                        class="text-start">
                                                                                                        <div class="d-flex flex-column">
                                                                                                            <template v-for="(el, i) in item"
                                                                                                                :key="i">
                                                                                                                <template
                                                                                                                    v-if="checkArray(el) == true">
                                                                                                                    <li v-for="(e, j) in el"
                                                                                                                        :key="j"
                                                                                                                        class="d-flex align-items-center py-2">
                                                                                                                        <template
                                                                                                                            v-if="checkArray(e) == true">
                                                                                                                            <span
                                                                                                                                class="bullet bullet-dot bg-primary me-5"></span>
                                                                                                                            <div
                                                                                                                                class="d-flex align-items-start">
                                                                                                                                <span>{{ j }} :
                                                                                                                                </span>
                                                                                                                                <div>
                                                                                                                                    <span
                                                                                                                                        v-for="q in e"
                                                                                                                                        :key="q"
                                                                                                                                        :class="(q == '' || q == null) ? 'text-danger' : ''"
                                                                                                                                        class="badge badge-light-primary ms-2">
                                                                                                                                        {{ (q == ''
                                                                                                                                            || q
                                                                                                                                            ==
                                                                                                                                            null) ?
                                                                                                                                            ' --' :
                                                                                                                                            q }}
                                                                                                                                    </span>
                                                                                                                                </div>
                                                                                                                            </div>
                                                                                                                        </template>
                                                                                                                        <template v-else>
                                                                                                                            <div>
                                                                                                                                <span
                                                                                                                                    class="bullet bullet-dot bg-primary me-5"></span>
                                                                                                                                {{ j }} :
                                                                                                                                <span
                                                                                                                                    :class="(e == '' || e == null) ? 'text-danger' : ''">
                                                                                                                                    {{ (e == '' || e
                                                                                                                                        == null) ?
                                                                                                                                        '--' : e }}
                                                                                                                                </span>
                                                                                                                            </div>

                                                                                                                        </template>
                                                                                                                    </li>
                                                                                                                </template>
                                                                                                                <template v-else>
                                                                                                                    <li
                                                                                                                        class="d-flex align-items-center py-2">
                                                                                                                        <span
                                                                                                                            :class="(el == '' || el == null) ? 'text-danger' : ''"
                                                                                                                            class="bullet bullet-dot bg-primary me-5">
                                                                                                                        </span>
                                                                                                                        {{ i }} :
                                                                                                                        <span class="ms-1"
                                                                                                                            :class="(el == '' || el == null) ? 'text-danger' : ''">
                                                                                                                            {{ (el == '' || el ==
                                                                                                                                null) ? '--' : el
                                                                                                                            }}
                                                                                                                        </span>
                                                                                                                    </li>
                                                                                                                </template>
                                                                                                            </template>
                                                                                                        </div>
                                                                                                    </td>
                                                                                                    <td v-else class="text-start">
                                                                                                        <span
                                                                                                            :class="(item == '' || item == null) ? 'text-danger' : ''">
                                                                                                            {{ (item == '' || item == null) ?
                                                                                                                '--' :
                                                                                                                item
                                                                                                            }}</span>
                                                                                                    </td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                            <!--end::Table body-->
                                                                                        </table>
                                                                                        <!--end::Table-->
                                                                                    </div>
                                                                                    <!--end::Table container-->
                                                                                </template>
                                                                            </div>
                                                                        </el-tab-pane>
                                                                    </el-tabs>
                                                                </template>
                                                            </template>
                                                            <template v-else-if="ip_info_status == 4">
                                                                <div class="p-5 w-100 h-100 d-flex flex-column justify-content-center">
                                                                    <div class="text-center mb-5">
                                                                        <KTIcon icon-name="information-3" icon-class="fs-3x text-warning" />
                                                                    </div>
                                                                    <div class="" v-html="linkCheckIP"></div>
                                                                </div>
                                                            </template>
                                                            <template v-else-if="ip_info_status == 0">
                                                                <div class="p-5 w-100 h-100 d-flex flex-column justify-content-center">
                                                                    <div class="text-center mb-5">
                                                                        <i class="fa-regular fa-circle-xmark fa-bounce fs-3x text-warning"></i>
                                                                    </div>
                                                                    <div class="text-center">{{ ip_info }}</div>
                                                                </div>
                                                            </template>
                                                            <template v-else>
                                                                <div class="mt-5 m-3">
                                                                    <el-skeleton :rows="7" animated />
                                                                </div>
                                                            </template>

                                                        </div>
                                                    </el-card>
                                                </el-col>
                                            </el-row>
                                        </el-col>
                                    </el-row>
                                    <el-row :gutter="10">
                                        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8" class="mb-3 mx-0">
                                            <el-card shadow="hover" class="box-card rounded-3 h-100" :body-style="{ padding: '0px' }">
                                                <template #header>
                                                    <div class="d-flex align-items-center">
                                                        <span class="badge badge-circle badge-primary me-2">
                                                            {{ (port_service_status == 3 && checkArray(port_service) == true) ?
                                                                Object.keys(port_service).length : 0 }}</span>
                                                        <span class="card-label fw-bold text-dark fs-5">Cổng Dịch Vụ</span>
                                                    </div>
                                                </template>
                                                <div class="h-500px">
                                                    <template v-if="port_service_status == 3">
                                                        <template v-if="port_service == '' || Object.keys(port_service).length == 0">
                                                            <div class="px-5 w-100 h-100 d-flex flex-column justify-content-center text-center">
                                                                <div class="text-center pb-5">
                                                                    <i class="fa-solid fa-circle-info fa-bounce fs-3x text-primary"></i>
                                                                </div>
                                                                <span>Không Tìm Thấy Dữ Liệu Nào!</span>
                                                            </div>
                                                        </template>
                                                        <template v-else>
                                                            <div class="p-5">
                                                                <!-- <el-popover v-for="(item, key) in port_service" :key="key" 
                                                                :placement="(key == 0) ? 'bottom-start' : 'bottom'" :width="300" trigger="click">
                                                                    <template #reference>
                                                                        <span  class="badge badge-primary fs-7 me-2 my-1 cursor-pointer">{{ item }}</span>
                                                                    </template>
                                                                    <div>123</div>
                                                                </el-popover>
                                                                <br> -->
                                                                <span v-for="(item, key) in port_service">
                                                                    <span @click="drawerPorts(item, key)" 
                                                                        :class="`badge badge-light-${(item.status == false) ? 'danger' : 'primary'} fs-7 me-2 my-1 cursor-pointer`">
                                                                        {{ key }}
                                                                    </span>
                                                                    <div class="modal fade" tabindex="-1" ref="ModalDetail" aria-hidden="true" id="port_detail">
                                                                        <div class="modal-dialog modal-dialog-centered mw-550px">
                                                                            <div class="modal-content">
                                                                                <div class="modal-body" style="padding: 26px 0px 0px 0px;">
                                                                                    <div class="card card-flush">
                                                                                        <div class="card-body py-0">
                                                                                            <div class="pb-2 mt-2">
                                                                                                <h4 class="fs-4">Chi Tiết Của Cổng {{ detailPortTitle }}
                                                                                                </h4>
                                                                                                <span class="fs-7 text-dark">Có
                                                                                                    <span class="fw-bold text-dark">{{ portCount
                                                                                                    }}</span>
                                                                                                    địa chỉ IP có cổng
                                                                                                    <span class="fw-bold text-dark">{{ detailPortTitle
                                                                                                    }}</span></span>
                                                                                            </div>
                                                                                            <div class="d-flex flex-column my-3 ms-2">
                                                                                                <li v-for="(i, key) in  detailPort" :key="key"
                                                                                                    class="d-flex align-items-center py-2">
                                                                                                    <span
                                                                                                        :class="`bg-${i ? 'primary' : 'danger'} bullet bullet-dot me-5 h-7px w-7px`"></span>
                                                                                                    <span class="text-dark">{{ key }}</span>
                                                                                                </li>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div class="modal-footer" style="border-top: 0px; justify-content: center;">
                                                                                    <button type="button" class="btn btn-sm btn-light-primary" data-bs-dismiss="modal">
                                                                                        Đóng
                                                                                    </button>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </span>
                                                            </div>
                                                        </template>
                                                    </template>
                                                    <template v-else-if="port_service_status == 4">
                                                        <div class="p-5 w-100 h-100 d-flex flex-column justify-content-center text-center">
                                                            <div class="text-center mb-5">
                                                                <i class="fa-regular fa-circle-question fa-bounce fs-3x text-warning"></i>
                                                            </div>
                                                            <div class="" v-html="port_service"></div>
                                                        </div>
                                                    </template>
                                                    <template v-else-if="port_service_status == 0">
                                                        <div class="p-5 w-100 h-100 d-flex flex-column justify-content-center text-center">
                                                            <div class="text-center mb-5">
                                                                <i class="fa-regular fa-circle-xmark fa-bounce fs-3x text-warning"></i>
                                                            </div>
                                                            <div class="text-center">{{ port_service }}</div>
                                                        </div>
                                                    </template>
                                                    <template v-else>
                                                        <div class="mt-5 m-3">
                                                            <el-skeleton :rows="7" animated />
                                                        </div>
                                                    </template>
                                                </div>
                                            </el-card>
                                        </el-col>

                                        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8" class="mb-3 mx-0">
                                            <el-card shadow="hover" class="box-card rounded-3 h-100" :body-style="{ padding: '0px' }">
                                                <template #header>
                                                    <div class="d-flex align-items-center">
                                                        <span class="badge badge-circle badge-primary me-2">
                                                            {{ (related_email_status == 3 && checkArray(related_email) == true) ?
                                                                Object.keys(related_email).length : 0 }}
                                                        </span>
                                                        <span class="card-label fw-bold text-dark fs-5">Email Liên Quan</span>
                                                    </div>
                                                </template>
                                                <div class="h-500px">
                                                    <template v-if="related_email_status == 3">
                                                        <template v-if="related_email == '' || Object.keys(related_email).length == 0">
                                                            <div class="px-5 w-100 h-100 d-flex flex-column justify-content-center text-center">
                                                                <div class="text-center pb-5">
                                                                    <i class="fa-solid fa-circle-info fa-bounce fs-3x text-primary"></i>
                                                                </div>
                                                                <span>Không Tìm Thấy Dữ Liệu Nào!</span>
                                                            </div>
                                                        </template>
                                                        <template v-else-if="!Array.isArray(related_email)">
                                                            <div class="p-5 w-100 h-100 d-flex flex-column justify-content-center text-center">
                                                                <div class="text-center mb-5">
                                                                    <i class="fa-regular fa-circle-question fa-bounce fs-3x text-warning"></i>
                                                                </div>
                                                                <span>{{ related_email }}</span>
                                                            </div>
                                                        </template>
                                                        <template v-else>
                                                            <!--begin::Table container-->
                                                            <div class="table-responsive w-100 h-100 p-3">
                                                                <!--begin::Table-->
                                                                <table class="table table-row-dashed table-row-gray-300">
                                                                    <!--begin::Table head-->
                                                                    <thead>
                                                                        <tr class="border-0  fw-bold text-gray-600 align-middle py-2 px-0">
                                                                            <th class="py-2 px-0 text-muted text-start">Email</th>
                                                                            <th class="py-2 px-3 text-muted text-center">Password</th>
                                                                            <th class="py-2 px-3 text-muted text-end">Password Crack</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <!--end::Table head-->

                                                                    <!--begin::Table body-->
                                                                    <tbody class="overflow-y-auto w-100 ">
                                                                        <tr v-for="(item, key) in related_email" :key="key">
                                                                            <td class="text-start"><span>
                                                                                    <span>{{ (item.email == '') ? '--' : item.email }}</span>
                                                                                </span></td>
                                                                            <td class="text-center ">
                                                                                <template
                                                                                    v-if="checkArray(item.password_crack) || item.password_crack != ''">
                                                                                    <template v-if="checkArray(item.password_crack)">
                                                                                        <span class="badge badge-light text-dark ms-1 mb-1"
                                                                                            v-for="i in item.password_crack">
                                                                                            {{ (i == '') ? '--' : i }}</span>
                                                                                    </template>
                                                                                    <template v-else>
                                                                                        <span class="badge badge-light text-dark">
                                                                                            {{ item.password_crack }}
                                                                                        </span>
                                                                                    </template>
                                                                                </template>
                                                                                <template v-else>
                                                                                    <span class="badge badge-light-danger ">--</span>
                                                                                </template>
                                                                            </td>
                                                                            <td class="text-end">
                                                                                <template
                                                                                    v-if="checkArray(item.password_hash) || item.password_hash != ''">
                                                                                    <template v-if="checkArray(item.password_hash)">
                                                                                        <span class="badge badge-light text-dark ms-1 mb-1"
                                                                                            v-for="i in item.password_hash">
                                                                                            {{ (i == '') ? '--' : i }}</span>
                                                                                    </template>
                                                                                    <template v-else>
                                                                                        <span class="badge badge-light text-dark">
                                                                                            {{ item.password_hash }}
                                                                                        </span>
                                                                                    </template>
                                                                                </template>
                                                                                <template v-else>
                                                                                    <span class="badge badge-light-danger ">--</span>
                                                                                </template>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                    <!--end::Table body-->
                                                                </table>
                                                                <!--end::Table-->
                                                            </div>
                                                            <!--end::Table container-->
                                                        </template>

                                                    </template>
                                                    <template v-else-if="related_email_status == 4">
                                                        <div class="p-5 w-100 h-100 d-flex flex-column justify-content-center text-center">
                                                            <div class="text-center mb-5">
                                                                <KTIcon icon-name="information-3" icon-class="fs-3x text-warning" />
                                                            </div>
                                                            <div class="" v-html="related_email"></div>
                                                        </div>
                                                    </template>
                                                    <template v-else-if="related_email_status == 0">
                                                        <div class="p-5 w-100 h-100 d-flex flex-column justify-content-center text-center">
                                                            <div class="text-center mb-5">
                                                                <i class="fa-regular fa-circle-xmark fa-bounce fs-3x text-warning"></i>
                                                            </div>
                                                            <div class="text-center">{{ related_email }}</div>
                                                        </div>
                                                    </template>
                                                    <template v-else>
                                                        <div class="mt-5 m-3">
                                                            <el-skeleton :rows="7" animated />
                                                        </div>
                                                    </template>
                                                </div>
                                            </el-card>
                                        </el-col>

                                        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8" class="mb-3 mx-0">
                                            <el-card shadow="hover" class="box-card rounded-3 h-100" :body-style="{ padding: '0px' }">
                                                <template #header>
                                                    <div class="d-flex align-items-center">
                                                        <span class="badge badge-circle badge-primary me-2">
                                                            {{ (related_domain_status == 3 && checkArray(related_domain) == true) ?
                                                                Object.keys(related_domain).length : 0 }}
                                                        </span>
                                                        <span class="card-label fw-bold text-dark fs-5">Tên Miền Liên Quan Đến Mục Tiêu</span>
                                                    </div>
                                                </template>
                                                <div class="h-500px">
                                                    <template v-if="related_domain_status == 3">
                                                        <template v-if="related_domain == '' || Object.keys(related_domain).length == 0">
                                                            <div class="px-5 w-100 h-100 d-flex flex-column justify-content-center text-center">
                                                                <div class="text-center pb-5">
                                                                    <i class="fa-solid fa-circle-info fa-bounce fs-3x text-primary"></i>

                                                                </div>
                                                                <span>Không Tìm Thấy Dữ Liệu Nào!</span>
                                                            </div>
                                                        </template>
                                                        <template v-else>
                                                            <!--begin::Table container-->
                                                            <div class="table-responsive w-100 h-100 p-3">
                                                                <!--begin::Table-->
                                                                <table class="table table-row-dashed table-row-gray-300">
                                                                    <!--begin::Table head-->
                                                                    <thead>
                                                                        <tr class="border-0  fw-bold text-gray-600 align-middle py-2 px-0">
                                                                            <th class="text-muted py-2 px-0 text-start">Tên Miền</th>
                                                                            <th class="text-muted py-2 px-3 text-start">Giao Thức</th>
                                                                            <th class="text-muted py-2 px-3 text-end">Cùng Dải Mạng?</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <!--end::Table head-->

                                                                    <!--begin::Table body-->
                                                                    <tbody class="overflow-y-auto w-100 ">
                                                                        <tr v-for="(item, key) in related_domain" :key="key">
                                                                            <td class="text-start"><span>{{ key }}</span></td>
                                                                            <td class="text-start">
                                                                                <span :class="`text-${(item.type == '') ? 'danger' : 'dark'}`">
                                                                                    {{ (item.type == '') ? '--' : item.type }}
                                                                                </span>
                                                                            </td>
                                                                            <td class="text-end">
                                                                                <span class="badge"
                                                                                    :class="`badge-light-${(item.status == true) ? 'primary' : 'danger'}`">
                                                                                    {{ item.status }}
                                                                                </span>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>
                                                                    <!--end::Table body-->
                                                                </table>
                                                                <!--end::Table-->
                                                            </div>
                                                            <!--end::Table container-->
                                                        </template>

                                                    </template>
                                                    <template v-else-if="related_domain_status == 4">
                                                        <div class="p-5 w-100 h-100 d-flex flex-column justify-content-center text-center">
                                                            <div class="text-center mb-5">
                                                                <KTIcon icon-name="information-3" icon-class="fs-3x text-warning" />
                                                            </div>
                                                            <div class="" v-html="related_domain"></div>
                                                        </div>
                                                    </template>
                                                    <template v-else-if="related_domain_status == 0">
                                                        <div class="p-5 w-100 h-100 d-flex flex-column justify-content-center text-center">
                                                            <div class="text-center mb-5">
                                                                <i class="fa-regular fa-circle-xmark fa-bounce fs-3x text-warning"></i>
                                                            </div>
                                                            <div class="text-center">{{ related_domain }}</div>
                                                        </div>
                                                    </template>
                                                    <template v-else>
                                                        <div class="mt-5 m-3">
                                                            <el-skeleton :rows="7" animated />
                                                        </div>
                                                    </template>
                                                </div>
                                            </el-card>
                                        </el-col>

                                        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8" class="mb-3 mx-0">
                                            <el-card shadow="hover" class="box-card rounded-3 h-100" :body-style="{ padding: '0px' }">
                                                <template #header>
                                                    <div class="d-flex align-items-center">
                                                        <span class="badge badge-circle badge-primary me-2">
                                                            {{ (technology_status == 3 && checkArray(technology) == true) ?
                                                                Object.keys(technology).length : 0 }}
                                                        </span>
                                                        <span class="card-label fw-bold text-dark fs-5">Công Nghệ Sử Dụng</span>
                                                    </div>
                                                </template>
                                                <div class="h-500px">
                                                    <template v-if="technology_status == 3">
                                                        <template v-if="technology == '' || Object.keys(technology).length == 0">
                                                            <div class="px-5 w-100 h-100 d-flex flex-column justify-content-center text-center">
                                                                <div class="text-center mb-5">
                                                                    <i class="fa-solid fa-circle-info fa-bounce fs-3x text-primary"></i>
                                                                </div>
                                                                <span>Không Tìm Thấy Dữ Liệu Nào!</span>
                                                            </div>
                                                        </template>
                                                        <template v-else>
                                                            <div class="p-5">
                                                                <span v-for="(item, key) in technology" :key="key">
                                                                    <span @click="drawerTechnologys(item, key)"
                                                                        class="badge badge-light-primary fs-7 me-2 my-1 cursor-pointer">{{ key
                                                                        }}</span>
                                                                </span>
                                                                <div class="modal fade" tabindex="-1" ref="ModalDetail" aria-hidden="true" id="technology_detail">
                                                                    <div class="modal-dialog modal-dialog-centered mw-550px">
                                                                        <div class="modal-content">
                                                                            <div class="modal-body" style="padding: 26px 0px 0px 0px;">
                                                                                <div class="card card-flush">
                                                                                    <div class="card-body py-0">
                                                                                        <h4>{{ detailTechnologyTitle }}</h4>
                                                                                        <span class="fs-7 mb-5 text-dark">Tổng cộng có
                                                                                            <span class="fw-bold text-dark ">{{ Object.keys(detailTechnology).length
                                                                                            }}</span>
                                                                                            Công nghệ được sử dụng
                                                                                        </span>
                                                                                        <div class="d-flex flex-column ms-2 my-5">
                                                                                            <li class="d-flex align-items-center py-2" v-for="el in detailTechnology"
                                                                                                :key="el">
                                                                                                <span class="bullet bullet-dot bg-primary me-5 h-7px w-7px"></span>
                                                                                                <span class="text-dark">{{ el }}</span>
                                                                                            </li>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div class="modal-footer" style="border-top: 0px; justify-content: center;">
                                                                                <button type="button" class="btn btn-sm btn-light-primary" data-bs-dismiss="modal">
                                                                                    Đóng
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </template>
                                                    </template>
                                                    <template v-else-if="technology_status == 4">
                                                        <div class="p-5 w-100 h-100 d-flex flex-column justify-content-center text-center">
                                                            <div class="text-center mb-5">
                                                                <KTIcon icon-name="information-3" icon-class="fs-3x text-warning" />
                                                            </div>
                                                            <div class="" v-html="technology"></div>
                                                        </div>
                                                    </template>
                                                    <template v-else-if="technology_status == 0">
                                                        <div class="p-5 w-100 h-100 d-flex flex-column justify-content-center text-center">
                                                            <div class="text-center mb-5">
                                                                <i class="fa-regular fa-circle-xmark fa-bounce fs-3x text-warning"></i>
                                                            </div>
                                                            <div class="text-center">{{ technology }}</div>
                                                        </div>
                                                    </template>
                                                    <template v-else>
                                                        <div class="mt-5 m-3">
                                                            <el-skeleton :rows="7" animated />
                                                        </div>
                                                    </template>
                                                </div>
                                            </el-card>
                                        </el-col>

                                        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8" class="mb-3 mx-0">
                                            <el-card shadow="hover" class="box-card rounded-3 h-100 "
                                                :body-style="{ padding: '0', height: 'calc(100% - 56px)' }">
                                                <template #header>
                                                    <div>
                                                        <span class="card-label fw-bold text-dark fs-5">Metadata</span>
                                                    </div>
                                                </template>
                                                <div class="h-500px">
                                                    <template v-if="metadata_status == 3 || metadata_status == '3'">
                                                        <template
                                                            v-if="metadata == '' || Object.values(metadata.authors).length == 0 && Object.values(metadata.software).length == 0">
                                                            <div class="px-5 w-100 h-100 d-flex flex-column justify-content-center text-center">
                                                                <div class="text-center mb-5">
                                                                    <i class="fa-solid fa-circle-info fa-bounce fs-3x text-primary"></i>
                                                                </div>
                                                                <span>Không Tìm Thấy Dữ Liệu Nào!</span>
                                                            </div>
                                                        </template>
                                                        <template v-else>
                                                            <el-tabs tab-position="left" type="border-card" :stretch="true"
                                                                class="demo-tabs3 padding-tabs border border-0 h-100" :lazy="true">
                                                                <el-tab-pane v-for="(items, index) in metadata" :key="index" class="h-100">
                                                                    <template #label>
                                                                        <span class="custom-tabs-label">
                                                                            <span class="text-muted">{{ index }}</span>
                                                                        </span>
                                                                    </template>
                                                                    <div class="h-100">
                                                                        <template v-if="items == '' || items == null">
                                                                            <div
                                                                                class="px-5 w-100 h-100 d-flex flex-column justify-content-center text-center">
                                                                                <div class="text-center mb-5">
                                                                                    <i
                                                                                        class="fa-solid fa-circle-info fa-bounce fs-3x text-primary"></i>
                                                                                </div>
                                                                                <span>Không Tìm Thấy Dữ Liệu Nào!</span>
                                                                            </div>
                                                                        </template>
                                                                        <template v-else>
                                                                            <!--begin::Table container-->
                                                                            <div class="table-responsive w-100 ">
                                                                                <!--begin::Table-->
                                                                                <table class="table table-row-dashed table-row-gray-300 ">
                                                                                    <!--begin::Table body-->
                                                                                    <tbody class="overflow-y-auto w-100">
                                                                                        <tr v-for="(item, key) in items" :key="key">
                                                                                            <td class="text-start">
                                                                                                <span>{{ item }}</span>
                                                                                            </td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                    <!--end::Table body-->
                                                                                </table>
                                                                                <!--end::Table-->
                                                                            </div>
                                                                            <!--end::Table container-->
                                                                        </template>

                                                                    </div>
                                                                </el-tab-pane>
                                                            </el-tabs>
                                                        </template>
                                                    </template>
                                                    <template v-else-if="metadata_status == 4">
                                                        <div class="p-5 w-100 h-100 d-flex flex-column justify-content-center text-center">
                                                            <div class="text-center mb-5">
                                                                <KTIcon icon-name="information-3" icon-class="fs-3x text-warning" />
                                                            </div>
                                                            <div class="" v-html="metadata"></div>
                                                        </div>
                                                    </template>
                                                    <template v-else-if="metadata_status == 0">
                                                        <div class="p-5 w-100 h-100 d-flex flex-column justify-content-center text-center">
                                                            <div class="text-center mb-5">
                                                                <i class="fa-regular fa-circle-xmark fa-bounce fs-3x text-warning"></i>
                                                            </div>
                                                            <div class="text-center">{{ metadata }}</div>
                                                        </div>
                                                    </template>
                                                    <template v-else>
                                                        <div class="mt-5 m-3">
                                                            <el-skeleton :rows="7" animated />
                                                        </div>
                                                    </template>
                                                </div>
                                            </el-card>
                                        </el-col>

                                        <el-col :xs="24" :sm="12" :md="12" :lg="8" :xl="8" class="mb-3 mx-0">
                                            <el-card shadow="hover" class="box-card rounded-3 h-100 "
                                                :body-style="{ padding: '0', height: 'calc(100% - 56px)' }">
                                                <template #header>
                                                    <div>
                                                        <span class="card-label fw-bold text-dark fs-5">Web Data</span>
                                                    </div>
                                                </template>
                                                <div class="h-500px">
                                                    <template v-if="webdata_status == 1 || webdata_status == '1'">
                                                        <el-tabs tab-position="left" type="border-card" :stretch="true"
                                                            class="demo-tabs2 padding-tabs border border-0 h-100" :lazy="true">
                                                            <el-tab-pane class="h-100" v-for="(items, index) in webdata_result" :key="index">
                                                                <template #label>
                                                                    <span class="custom-tabs-label w-90px" style="white-space:pre-wrap">
                                                                        <span class="text-muted">{{ convertToString(index) }}</span>
                                                                    </span>
                                                                </template>
                                                                <div class="h-100">
                                                                    <template
                                                                        v-if="(items.message == '' || items.message == null) && items.status == 3">
                                                                        <div
                                                                            class="px-5 w-100 h-100 d-flex flex-column justify-content-center text-center">
                                                                            <div class="text-center mb-5">
                                                                                <i class="fa-solid fa-circle-info fa-bounce fs-3x text-primary"></i>
                                                                            </div>
                                                                            <span>Không Tìm Thấy Dữ Liệu Nào!</span>
                                                                        </div>
                                                                    </template>
                                                                    <template v-else>
                                                                        <template v-if="checkArray(items.message) && items.status == 3">
                                                                            <!--begin::Table container-->
                                                                            <div class="table-responsive w-100 h-100 p-3">
                                                                                <!--begin::Table-->
                                                                                <table class="table table-row-dashed table-row-gray-300">
                                                                                    <template v-if="index.toString() == 'js_analysis'">
                                                                                        <thead>
                                                                                            <tr
                                                                                                class="border-0  fw-bold text-gray-600 align-middle py-2 px-0">
                                                                                                <th class="py-2 px-0 text-start">Thông tin</th>
                                                                                                <th class="py-2 px-3 text-start ">Dữ liệu
                                                                                                </th>
                                                                                            </tr>
                                                                                        </thead>
                                                                                        <!--begin::Table body-->
                                                                                        <tbody class="overflow-y-auto">
                                                                                            <tr v-for="(item, key) in items.message" :key="key">
                                                                                                <td class="text-start">
                                                                                                    <span>{{ item[0] }}</span>
                                                                                                </td>
                                                                                                <td class="text-start">
                                                                                                    <div
                                                                                                        class="flex justify-space-between mb-4 flex-wrap gap-4 w-200px">
                                                                                                        <el-button :disabled="disabled"
                                                                                                            class="m-0 me-2 border-0" circle>
                                                                                                            <i :disabled="disabled"
                                                                                                                class="fa-clipboard  fs-4 cursor-pointer"
                                                                                                                :class="(clipboard.includes(item[1]) ? 'fa-solid text-success' : ' fa-regular text-muted')"
                                                                                                                @click="copyContent(item[1])"></i>
                                                                                                        </el-button>
                                                                                                        <span>{{ truncateText(item[1], 20) }}</span>
                                                                                                    </div>
                                                                                                </td>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                        <!--end::Table body-->
                                                                                    </template>
                                                                                    <template v-else>
                                                                                        <!--begin::Table body-->
                                                                                        <tbody class="overflow-y-auto">
                                                                                            <tr v-for="(item, key) in items.message" :key="key">
                                                                                                <template v-if="checkArray(item)">
                                                                                                    <td v-for="el in item" class="text-start">{{
                                                                                                        el
                                                                                                    }}</td>
                                                                                                </template>
                                                                                                <template v-else>
                                                                                                    <td class="text-start">
                                                                                                        <span>{{ item }}</span>
                                                                                                    </td>
                                                                                                </template>
                                                                                            </tr>
                                                                                        </tbody>
                                                                                        <!--end::Table body-->
                                                                                    </template>
                                                                                </table>
                                                                                <!--end::Table-->
                                                                            </div>
                                                                            <!--end::Table container-->
                                                                        </template>
                                                                        <template v-else>
                                                                            <div
                                                                                class="p-5 pt-0 w-100 h-100 d-flex flex-column justify-content-center text-center">
                                                                                <div class="mb-5">
                                                                                    <i
                                                                                        class="fa-regular fa-circle-question fa-bounce fs-3x text-warning"></i>
                                                                                </div>
                                                                                <span>{{ items.message }}</span>
                                                                            </div>
                                                                        </template>
                                                                    </template>
                                                                </div>
                                                            </el-tab-pane>
                                                        </el-tabs>
                                                    </template>
                                                    <template v-else>
                                                        <div class="px-5 w-100 h-100 d-flex flex-column justify-content-center text-center">
                                                            <div class="text-center mb-5">
                                                                <i class="fa-regular fa-circle-xmark fa-bounce fs-3x text-warning"></i>
                                                            </div>
                                                            <span>{{ webdata_result ?? 'Thông tin không được chọn' }}</span>
                                                        </div>
                                                    </template>
                                                </div>
                                            </el-card>
                                        </el-col>

                                        <el-col :span="24" class="mb-3 mx-0">
                                            <el-card shadow="hover" class="box-card rounded-3 h-100" :body-style="{ padding: '0px' }">
                                                <template #header>
                                                    <div class="d-flex justify-content-between align-items-center">
                                                        <span class="card-label fw-bold text-dark fs-5">Subdomains</span>
                                                        <router-link class="btn btn-sm btn-light-primary"
                                                            :to="`/target-recon-detail/${ID}/${reconId}/subdomains`" active-class="active">Xem Thêm</router-link>
                                                    </div>
                                                </template>
                                                <div class="h-500px"> 
                                                    <template v-if="subdomain_result.length > 0">
                                                        <el-table :data="subdomain_result" height="500" style="width: 100%;z-index: 1;"
                                                            class-name="my-custom-table">
                                                            <el-table-column min-width="120" label-class-name="text-uppercase fs-13px fw-bold text-dark" prop="name"
                                                                label="Subdomains">
                                                                <template #default="scope">
                                                                    <span class="fst-normal text-dark" style="font-size: 13px;">
                                                                        {{ (scope.row.name == '') ? '--' : scope.row.name }}</span> 
                                                                    </template>
                                                            </el-table-column>
                                                            <el-table-column label-class-name="text-uppercase fs-13px fw-bold text-dark" prop="enpoint" align="left"
                                                                label="Endpoints" min-width="100">
                                                                <template #default="scope">
                                                                    <span class="fs-7 fst-normal badge cursor-pointer"
                                                                        @click="modelEndpoints(scope.row.enpoint_data)"
                                                                        :class="`badge-light-${(scope.row.enpoint == 0 || scope.row.directory == undefined) ? 'danger' : 'primary'}`">
                                                                        {{ scope.row.enpoint ?? '0' }}</span>
                                                                </template>
                                                            </el-table-column>
                                                            <el-table-column label-class-name="text-uppercase fs-13px fw-bold text-dark" prop="directory"
                                                                label="Thư Mục" align="left" min-width="90">
                                                                <template #default="scope">
                                                                    <span class="fs-7 fst-normal badge cursor-pointer"
                                                                        @click="modelDirectory(scope.row.directory_data)"
                                                                        :class="`badge-light-${(scope.row.directory == 0 || scope.row.directory == undefined) ? 'danger' : 'primary'}`">
                                                                        {{ scope.row.directory ?? '0' }}</span>
                                                                </template>
                                                            </el-table-column>
                                                            <el-table-column label-class-name="text-uppercase fs-13px fw-bold text-dark" prop="url_checked" min-width="150"
                                                                align="left" label="URL Checked">
                                                                <template #default="scope">
                                                                    <template v-if="scope.row.url_checked == ''">
                                                                        <span class="badge badge-light-danger">--</span>
                                                                    </template>
                                                                    <template v-else>
                                                                        <span class="fst-normal text-dark" style="font-size: 13px;">{{ scope.row.url_checked }}</span>
                                                                    </template>
                                                                </template>
                                                            </el-table-column>
                                                            <el-table-column label-class-name="text-uppercase fs-13px fw-bold text-dark" prop="status" label="Trạng Thái" min-width="110"
                                                                align="left">
                                                                <template #default="scope">
                                                                    <span class="fst-normal text-dark" style="font-size: 13px;">
                                                                        {{ (scope.row.status == '') ? '--' : scope.row.status }}</span>
                                                                </template>
                                                            </el-table-column>
                                                            <el-table-column label-class-name="text-uppercase fs-13px fw-bold text-dark" prop="title" label="Tiêu Đề" min-width="140"
                                                                align="left">
                                                                <template #default="scope">
                                                                    <template v-if="scope.row.title == ''">
                                                                            <span class="badge badge-light-danger">--</span>
                                                                    </template>
                                                                    <template v-else>
                                                                        <span class="fst-normal text-dark" style="font-size: 13px;">{{ scope.row.title }}</span>
                                                                    </template>
                                                                </template>
                                                            </el-table-column>
                                                            <el-table-column label-class-name="text-uppercase fs-13px fw-bold text-dark" prop="ip" label="IP" min-width="100"
                                                                align="left">
                                                                <template #default="scope">
                                                                    <template v-if="scope.row.ip == ''">
                                                                            <span class="badge badge-light-danger">--</span>
                                                                    </template>
                                                                    <template v-else>
                                                                        <span class="fst-normal text-dark" style="font-size: 13px;">{{ scope.row.ip }}</span>
                                                                    </template>
                                                                </template>
                                                            </el-table-column>
                                                            <el-table-column label-class-name="text-uppercase fs-13px fw-bold text-dark" prop="portservice"
                                                                label="Cổng Dịch Vụ" align="left" min-width="150">
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
                                                                                <template
                                                                                    v-if="isRowExpandedPortservice(scope.$index)">Ẩn</template>
                                                                                <template v-else>
                                                                                    <el-popover placement="right" width="200" trigger="hover"
                                                                                        hide-after="100">
                                                                                        <template #reference>
                                                                                            <span>Thêm</span>
                                                                                        </template>
                                                                                        <div>
                                                                                            <span
                                                                                                v-for="(el, elIndex) in scope.row.portservice.slice(3)"
                                                                                                :key="elIndex"
                                                                                                class="badge badge-light-primary ms-1 mb-1">{{ el
                                                                                                }}</span>
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
                                                                                <span
                                                                                    v-if="key < 3 || expandedRowsTeachnology.includes(scope.$index)"
                                                                                    class="badge badge-light-primary ms-1">{{ items }}</span>
                                                                            </template>
                                                                            <span v-if="Object.keys(scope.row.technology).length > 3"
                                                                                @click="handleTechnologyMore(scope.$index)"
                                                                                class="badge badge-light ms-1 cursor-pointer">
                                                                                <template v-if="isRowExpandedTechnology(scope.$index)">Ẩn</template>
                                                                                <template v-else>
                                                                                    <el-popover placement="right" width="280" trigger="hover"
                                                                                        hide-after="100">
                                                                                        <template #reference>
                                                                                            <span>Thêm</span>
                                                                                        </template>
                                                                                        <div>
                                                                                            <span
                                                                                                v-for="(el, elIndex) in scope.row.technology.slice(3)"
                                                                                                :key="elIndex"
                                                                                                class="badge badge-light-primary ms-1 mb-1">
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
                                                            <el-table-column label-class-name="text-uppercase fs-13px fw-bold text-dark" prop="dns_record" align="left"
                                                                label="Bản Ghi DNS" min-width="250">
                                                                <template #default="scope">
                                                                    <template v-if="Object.values(scope.row.dns_record).length == 0">
                                                                        <span class="badge badge-light-danger">--</span>
                                                                    </template>
                                                                    <template v-else>
                                                                        <template  v-for="(value, key) in scope.row.dns_record" :key="key">
                                                                            <li class="d-flex align-items-start mb-1">
                                                                                <span class="fw-bold text-capitalize text-dark fs-13px"
                                                                                style="white-space: nowrap; ">
                                                                                    {{ key }}: 
                                                                                </span>
                                                                                <span class="fst-normal text-dark ms-1" style="font-size: 13px;">
                                                                                     {{ scope.row.dns_record[key].join(', ') }}
                                                                                </span>
                                                                            </li>
                                                                        </template>
                                                                    </template>
                                                                    
                                                                </template>
                                                            </el-table-column>
                                                        </el-table>
                                                    </template>
                                                    <template v-else-if="reconStatus == 3 || reconStatus == 4">
                                                        <div class="p-5 pt-0 w-100 h-100 d-flex flex-column justify-content-center text-center">
                                                            <div class="mb-5">
                                                                <i class="fa-solid fa-circle-info fa-bounce fs-3x text-primary"></i>
                                                            </div>
                                                            <span>Không Tìm Thấy Dữ Liệu Nào!</span>
                                                        </div>
                                                    </template>
                                                    <template v-else>
                                                        <div class="mt-5 m-3">
                                                            <el-skeleton :rows="12" animated />
                                                        </div>
                                                    </template>
                                                </div>
                                            </el-card>
                                        </el-col>

                                    </el-row>
                                </div>
                                </template>
                                <!--begin::Card header-->
                                
                                <!--end::Card body-->
                            </div>
                        </div>
                    </div>
                    <!--end:::Tab pane-->

                    <!--begin:::Tab pane-->
                    <div class="tab-pane fade" id="kt_scans_tab" role="tabpanel">
                        <div>
                            <div class=" position-relative">
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
                                        <div class="w-100">
                                        <el-table :data="getScansData" style="width: 100%"
                                            class-name=" my-custom-table rounded-top cursor-pointer mt-2" table-layout="fixed"
                                            v-loading="loading" highlight-current-row @row-click="handleCurrentChange">
                                            <template #empty>
                                                <div class="flex items-center justify-center h-100%">
                                                    <el-empty description="Không có dữ liệu nào" />
                                                </div>
                                            </template>

                                            <el-table-column width="80" label-class-name="fs-13px fw-bold text-dark"
                                                prop="severity" align="center" label="MỨC ĐỘ">
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
                                                    <span v-if="scope.row.vt_name != '' || scope.row.port_scan.vt_name != ''"
                                                        class="fs-13px text-gray-700 text-hover-primary">
                                                        {{scope.row.vt_name ?? scope.row.port_scan.vt_name }}</span>
                                                    <span v-else class="badge badge-light-danger">--</span>
                                                </template>
                                            </el-table-column>
                                            <el-table-column min-width="150" label-class-name="fs-13px text-dark fw-bold"
                                                prop="hostname" label="URL">
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
                                            <el-table-column min-width="110" label-class-name="fs-13px text-dark fw-bold"
                                                align="left" prop="status" label="TRẠNG THÁI">
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
                                                <span class="text-capitalize fs-13px">Tổng Số Scans: {{ totalPage }}</span>
                                            </div>
                                            <el-pagination background v-model:current-page="currentPage"
                                                :hide-on-single-page="true" v-model:page-size="itemsPerPage"
                                                :total="totalPage" layout="prev, pager, next"
                                                :disabled="disabled"></el-pagination>
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
                                    <div class="h-100 overflow-auto d-block"
                                        :style="classDetail ? { width: rightWidth + 'px' } : { width: '0px' }"
                                        :class="classDetail ? ' d-block' : 'd-none'">
                                        <div class="ms-3 pb-10 affix-container">
                                            <div class="card-title pb-5 ">
                                                <h2 class="fw-bold pe-15 mt-5 fs-2">{{ detailData.vt_name }}</h2>
                                                <div  class="">
                                                    <span 
                                                        :class="`px-4 me-2 py-3 badge fs-13px badge-light-${getSeverity(detailData.severity).color}`">
                                                        {{  getSeverity(detailData.severity).title }}
                                                    </span>
                                                    <span 
                                                        :class="`px-4 py-3 badge fs-13px badge-light-${getStatus(detailData.status).color}`">
                                                        {{ getStatus(detailData.status).title }}
                                                    </span>
                                                </div>
                                                <div class="position-absolute translate-middle-y"
                                                    :style="{ top: '-140px', right: '10px' }">
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
                                                    v-if="(detailData.affects_url != null && detailData.affects_url != '') || (detailData.affects_detail != null && detailData.affects_detail != '')">
                                                    <h4 class="text-gray-800 fs-6 fw-bold cursor-pointer mb-0">Vulnerable
                                                        URL</h4>
                                                    <div v-if="detailData.affects_url != null && detailData.affects_url != ''">
                                                        <span class="w-100">URL : </span>
                                                        <span class="ps-1">
                                                            <a target="_blank" :href="`${detailData.affects_url}`"
                                                                class="text-primary">
                                                                <KTIcon icon-name="link" icon-class="bi bi-link-45deg"
                                                                    :style="{ fontSize: '16px' }" />
                                                                {{ detailData.affects_url }}
                                                            </a>
                                                        </span>
                                                    </div>
                                                    <div v-if="detailData.affects_detail != null && detailData.affects_detail != ''">
                                                        <span class="w-100">Parameter : </span>
                                                        <span class="ps-1"> {{ detailData.affects_detail }}</span>
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
                                                        <li class="d-flex align-items-center py-2 text-gray-700">
                                                            <span class="bullet bg-warning me-5"></span>
                                                            <span>Base Score:<strong class="ps-2 text-gray-800"> {{ detailData.cvss_score
                                                            }}</strong></span>
                                                        </li>
                                                    </div>
                                                </div>

                                                <div class="mb-5"
                                                    v-if="detailData.details != null && detailData.details != ''">
                                                    <h4 class="text-gray-700 fs-13px fw-bold cursor-pointer mb-0">Attack
                                                        Details</h4>
                                                    <div>
                                                        <div class="ps-1 " v-html="detailData.details"></div>
                                                    </div>
                                                </div>

                                                <div class="mb-5"
                                                    v-if="detailData.in_cpe != null && detailData.in_cpe != ''">
                                                    <div class="d-flex align-items-end ">
                                                        <h4 class="text-gray-800 fs-13px lh-lg fs-13px fw-bold m-0 pe-2">In CPE:
                                                        </h4>
                                                        <span> {{ detailData.in_cpe }}</span>
                                                    </div>
                                                </div>

                                                <div class="mb-5"
                                                    v-if="detailData.protocol != null && detailData.protocol != ''">
                                                    <div class="d-flex align-items-end ">
                                                        <h4 class="text-gray-800 fs-13px lh-lg fs-13px fw-bold m-0 pe-2">
                                                            Protocol: </h4>
                                                        <span> {{ detailData.protocol }}</span>
                                                    </div>
                                                </div>

                                                <div class="mb-5"
                                                    v-if="detailData.service != null && detailData.service != ''">
                                                    <div class="d-flex align-items-end ">
                                                        <h4 class="text-gray-800 fs-13px lh-lg fs-13px fw-bold m-0 pe-2">Service:
                                                        </h4>
                                                        <span> {{ detailData.service }}</span>
                                                    </div>
                                                </div>

                                                <div class="mb-5" v-if="detailData.port != null && detailData.port != ''">
                                                    <div class="d-flex align-items-end">
                                                        <h4 class="text-gray-800 fs-13px lh-lg fs-13px fw-bold m-0 pe-2">Port:
                                                        </h4>
                                                        <span> {{ detailData.port }}</span>
                                                    </div>
                                                </div>

                                                <div class="mb-5" v-if="detailData.type != null && detailData.type != ''">
                                                    <div class="d-flex align-items-end ">
                                                        <h4 class="text-gray-800 fs-13px lh-lg fs-13px fw-bold m-0 pe-2">Service:
                                                        </h4>
                                                        <span> {{ detailData.type }}</span>
                                                    </div>
                                                </div>

                                                <div class="mb-5" v-if="detailData.url != null && detailData.url != ''">
                                                    <div class="d-flex align-items-end ">
                                                        <h4 class="text-gray-800 fs-13px lh-lg fs-13px fw-bold m-0 pe-2">URL:
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
                                                                            {{ index }}: {{ item }}<br>
                                                                        </template>
                                                                    </template>
                                                                    <template v-else>
                                                                        <span
                                                                            class="bullet bullet-vertical bg-primary me-5"></span>
                                                                        {{ index }}: {{ items }}<br>
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

        <!-- modoal  -->
        <el-dialog v-model="dialogDirectoryVisible" title="Chi Tiết Thư Mục" width="1000" modal-class="custom-dialog">
        <div>
            <el-input v-model="searchDirectory" size="large" placeholder="Type to search" :prefix-icon="SearchIcon" />
            <div class="my-3 text-primary">
                <span class="fs-13px text-gray-600">Tổng Thư Mục: </span>
                <span class="fw-bold">{{ totalRecordsDirectory }}</span>
            </div>
        </div>
        <el-table :data="directory_data" style="width: 100%" height="400" class-name="my-custom-table">
            <template #empty>
                <div class="flex items-center justify-center h-100%">
                    <el-empty description="Không có dữ liệu nào"/>
                </div>
            </template>
            <el-table-column min-width="40" label-class-name="text-uppercase fs-13px fw-bold text-dark" label="STT">
                <template #default="scope">
                    <span class=" fst-normal" >
                        {{ scope.row.index }}</span> </template>
            </el-table-column>
            <el-table-column min-width="90" label-class-name="text-uppercase fs-13px fw-bold text-dark" prop="name" label="Thư mục">
                <template #default="scope">
                    <span class=" fst-normal" :class="(scope.row.name == '') ? 'badge badge-light-danger' : '' ">
                        {{ (scope.row.name == '') ? '--' : scope.row.name }}</span> </template>
            </el-table-column>
            <el-table-column min-width="90" label-class-name="text-uppercase fs-13px fw-bold text-dark" prop="content_type" label="Content Type"
                align="left">
                <template #default="scope">
                    <span class=" fst-normal" :class="(scope.row.content_type == '') ? 'badge badge-light-danger' : '' ">
                        {{ (scope.row.content_type == '') ? '--' : scope.row.content_type }}</span> </template>
            </el-table-column>
            <el-table-column min-width="90" label-class-name="text-uppercase fs-13px fw-bold text-dark" prop="status" label="Trạng Thái"
                align="right">
                <template #default="scope">
                    <span class="badge fst-normal"
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
    <el-dialog v-model="dialogEndpointsVisible" title="Chi Tiết Enpoint" width="1000" modal-class="custom-dialog">
        <div>
            <el-input v-model="searchEnpoint" size="large" placeholder="Tìm kiếm" :prefix-icon="SearchIcon" />
            <div class="my-3 text-primary">
                <span class="fs-13px text-gray-600">Tổng Enpoint: </span>
                <span class="fw-bold">{{ totalRecords }}</span>
            </div>
        </div>
        <el-table :data="enpoint_data" style="width: 100%" height="400" class-name="my-custom-table" v-loading="loading">
            <template #empty>
                <div class="flex items-center justify-center h-100%">
                    <el-empty description="Không có dữ liệu nào"/>
                </div>
            </template>
            <el-table-column min-width="40" label-class-name="text-uppercase fs-13px fw-bold text-dark" label="STT">
                <template #default="scope">
                    <span class="fst-normal">
                        {{ scope.row.index }}</span> </template>
            </el-table-column>
            <el-table-column min-width="90" label-class-name="text-uppercase fs-13px fw-bold text-dark" prop="url" label="URL">
                <template #default="scope">
                    <span class="fst-normal" v-if="scope.row.url != '' || scope.row.url != null">
                        <el-link class="" :underline="false" :href="scope.row.url" target="_blank">{{ scope.row.url
                        }}</el-link>
                    </span>
                    <span v-else class="badge badge-light-danger">--</span>

                </template>
            </el-table-column>
            <el-table-column min-width="60" label-class-name="text-uppercase fs-13px fw-bold text-dark" prop="params" label="Parameter"
                align="left">
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
                    <span class="badge fst-normal"
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
    <!--end::Card-->
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive, watch, onBeforeUnmount } from "vue";
import ApiService from "@/core/services/ApiService";
import { vue3Debounce } from 'vue-debounce';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { useRoute } from 'vue-router';
import KTToolbar from "@/views/apps/targets/reconWidgets/KTToolbar2.vue";
import TargetReconTabList from "@/views/apps/targets/TargetReconTabList.vue";
import { ElTable, ElTableColumn, ElPagination } from 'element-plus';
import { debounce } from 'vue-debounce'
import CodeHighlighter from "@/components/highlighters/CodeHighlighter.vue";
import { Modal } from "bootstrap";
import reconActivity from "@/views/apps/targets/reconWidgets/reconActivity.vue";
import { Search } from '@element-plus/icons-vue'

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
        reconActivity,
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
        const reconId = ref<number>(0);

        // recon data
        const account = ref<any>({
            credentials: 0,
            email: 0,
        })
        const services = ref<any>({
            total: 0,
            total_close: 0,
            total_open: 0,
        })
        const subdomain = ref<any>({
            total_subdomain: 0,
            total_subdomain_live: 0,
        })
        const endpoint = ref<any>({
            message: {
                total_endpoint: 0,
                total_endpoint_live: 0,
            },
            status: 0,
        })
        const activity = ref<any>({
            total_finish: 0,
            total_not_done: 0,
        })
        const drawerTechnology = ref(false)
        const drawerPort = ref(false)
        const process = ref<any>(0);
        const activities = ref<any>({});
        const domain_info = ref<any>({});
        const ip_info = ref<any>({});
        const domain_info_status = ref<number | any>(null);
        const ip_info_status = ref<number | any>(null);
        const port_service = ref<any>({});
        const port_service_status = ref<number | any>(null);
        const related_email = ref<any>({});
        const related_email_status = ref<number | any>(null);
        const related_domain = ref<any>({});
        const related_domain_status = ref<number | any>(null);
        const SearchIcon = ref(Search)

        const technology = ref<any>({});
        const subdomain_result = ref<any>({});
        const technology_status = ref<number | any>(null);
        const metadata = ref<any>({});
        const metadata_status = ref<number | any>(null);
        const webdata_result = ref<any>({});
        const webdata_status = ref<number | any>(null);
        const linkCheck = ref<string>('')
        const linkCheckIP = ref<string>('')
        const reconStatus = ref<number>(0)
        const checkRecon = ref<boolean>(true)
        const checkReconMessage = ref<string>('')

        const getData = async () => {
            loading.value = true;
            return ApiService.get(`targets/${ID.value}/info`)
                .then(({ data }) => {
                    // target
                    targetData.name = data.target.name
                    targetData.domain = data.target.domain
                    targetData.group = data.target.group.title
                    targetData.ip = data.target.ip

                    if(data.recon.status == 0 || !data.recon.recon.recon){
                        checkRecon.value = true
                        checkReconMessage.value = data.recon.message
                    }else{
                        checkRecon.value = false
                        reconId.value = data.recon.recon.id

                        // recon
                        account.value = data.recon.recon.recon[0].account
                        services.value = data.recon.recon.recon[0].services
                        subdomain.value = data.recon.recon.recon[0].subdomain
                        endpoint.value = data.recon.recon.recon[0].endpoint

                        // tiến trình
                        activity.value = data.recon.recon.recon[0].activity
                        const totalCount = (activity.value.total_finish / (activity.value.total_finish + activity.value.total_not_done)) * 100;
                        process.value = [parseFloat(totalCount.toFixed(1))]
                        activities.value = (data.recon.recon.recon[0].activity !== undefined) ? data.recon.recon.recon[0].activity.task_done : {}

                        // domain
                        domain_info.value = ( data.recon.recon.recon[0].domain_info !== undefined) ?  data.recon.recon.recon[0].domain_info.message : {};
                        domain_info_status.value = ( data.recon.recon.recon[0].domain_info !== undefined) ?  data.recon.recon.recon[0].domain_info.status : {};
                        linkCheck.value = (domain_info_status.value == 4) ? checkLink(domain_info.value) : ''

                        // IP
                        ip_info.value = ( data.recon.recon.recon[0].ip_info !== undefined) ?  data.recon.recon.recon[0].ip_info.message : {};
                        ip_info_status.value = ( data.recon.recon.recon[0].ip_info !== undefined) ?  data.recon.recon.recon[0].ip_info.status : {};
                        linkCheckIP.value = (ip_info_status.value == 4) ? checkLink(ip_info.value) : ''

                        // port_service
                        port_service.value = ( data.recon.recon.recon[0].port_service !== undefined) ?  data.recon.recon.recon[0].port_service.message : {};
                        port_service_status.value = ( data.recon.recon.recon[0].port_service !== undefined) ?  data.recon.recon.recon[0].port_service.status : {};

                        // related_email
                        related_email.value = ( data.recon.recon.recon[0].related_email !== undefined) ?  data.recon.recon.recon[0].related_email.message : {};
                        related_email_status.value = ( data.recon.recon.recon[0].related_email !== undefined) ?  data.recon.recon.recon[0].related_email.status : {};

                        // related_domain
                        related_domain.value = ( data.recon.recon.recon[0].related_domain !== undefined) ?  data.recon.recon.recon[0].related_domain.message : {};
                        related_domain_status.value = ( data.recon.recon.recon[0].related_domain !== undefined) ?  data.recon.recon.recon[0].related_domain.status : {};

                        // metadata
                        metadata.value = ( data.recon.recon.recon[0].metadata !== undefined) ?  data.recon.recon.recon[0].metadata.message : {};
                        metadata_status.value = ( data.recon.recon.recon[0].metadata !== undefined) ?  data.recon.recon.recon[0].metadata.status : {};

                        // technology
                        technology.value = ( data.recon.recon.recon[0].technology !== undefined) ?  data.recon.recon.recon[0].technology.message : {};
                        technology_status.value = ( data.recon.recon.recon[0].technology !== undefined) ?  data.recon.recon.recon[0].technology.status : {};

                        // subdomain_result
                        subdomain_result.value =  data.recon.recon.recon[0].subdomain_result.slice(0,10)

                        // Web Data
                        webdata_result.value = ( data.recon.recon.recon[0].webdata !== undefined) ?  data.recon.recon.recon[0].webdata.message : {};
                        webdata_status.value = ( data.recon.recon.recon[0].webdata !== undefined) ?  data.recon.recon.recon[0].webdata.status : {};

                        // check
                        reconStatus.value = data.recon.recon.status
                    }

                    // scan
                    scansData.value = data.scans
                    fetchDataScans(currentPage.value, itemsPerPage.value)
                })
                .catch(({ response }) => {
                    notification(response.data.detail ?? 'Có lỗi xảy ra', 'error', 'Có lỗi xảy ra')
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
                confirmButtonText: (icon == 'error') ? "Thử Lại" : "Đồng Ý",
                heightAuto: false,
                customClass: {
                    confirmButton: (icon == 'error') ? "btn btn-light-danger" : "btn btn-light-primary",
                },
            });
        }


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


        // handleCurrentChange
        const handleCurrentChange = (detail: any) => {
            console.log(detail)
            if (detail) {
                closeOnRow.value = true;
                classDetail.value = true;
                for (const key in detailData) {
                    // Kiểm tra xem dữ liệu truyền vào có tồn tại và tương ứng với thuộc tính trong detailData hay không
                    if (detail.hasOwnProperty(key) || detail.port_scan) {
                    // Nếu có, gán giá trị vào obj detailData
                        detailData[key] = detail[key] ?? detail.port_scan[key];
                    } else {
                    // Nếu không, gán giá trị rỗng vào obj detailData
                    detailData[key] = '';
                    }
                }
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

        // sử lý data recon
                // modoal subdomains
        // detail subdmains

        const dialogDirectoryVisible = ref(false)
        const dialogEndpointsVisible = ref(false)
        const enpoint_data_full = ref<any>([])
        const enpoint_data = ref<any>([])
        const currentPageEndpoints = ref(1); // Trang hiện tại
        const pageSizeEndpoints = ref(5); // Số lượng hàng mỗi trang
        const pageSizeDirectory = ref(10); // Số lượng hàng mỗi trang
        const totalRecords = ref(0); // Tổng số bản ghi
        const searchEnpoint = ref('')

        // sử lý enpoint
        const modelEndpoints = (data: any) => {
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
            loading.value = true
            setTimeout(() => loading.value = false, 500)
            fetchDataEndpoints(1, pageSizeEndpoints.value)
        }, 500));

        // chayj khi ddongs moadld
        watch([dialogEndpointsVisible, dialogDirectoryVisible], () => {
            searchDirectory.value = '';
            searchEnpoint.value = '';
            currentPageEndpoints.value = 1;
            currentPageDirectory.value = 1
        });

        const fetchDataEndpoints = (currentPages: number, pageSizes: number) => {
            const start = (currentPages - 1) * pageSizes;
            const end = start + pageSizes;
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
        const searchDirectory = ref('')

        const modelDirectory = (data: any) => {
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
            loading.value = true
            setTimeout(() => loading.value = false, 500)
            fetchDataDirectory(1, pageSizeDirectory.value)
        }, 500));

        const fetchDataDirectory = (currentPages: number, pageSizes: number) => {
            const start = (currentPages - 1) * pageSizes;
            const end = start + pageSizes;
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
        };

        // Xử lý sự kiện thay đổi trang
        const handleCurrentChangeDirectory = () => {
            loading.value = true;
            setTimeout(() => loading.value = false, 500)
        }

        const detailPort = ref([])
        const detailPortTitle = ref('')
        const portCount = ref<number | any>(null)
        const drawerPorts = (data: any, title: any) => {
            if (data || title) {
                drawerPort.value = true
                detailPort.value = data.ips
                portCount.value = Object.keys(data.ips).length
                detailPortTitle.value = title.toString().split("/")[0]
                const modal = new Modal(
                    document.getElementById("port_detail") as Element
                );
                modal.show();
            }
        };

        const detailTechnology = ref([])
        const detailTechnologyTitle = ref('')
        const drawerTechnologys = (data: any, title: any) => {
            if (data || title) {
                drawerTechnology.value = true
                detailTechnology.value = data
                detailTechnologyTitle.value = title
                const modal = new Modal(
                    document.getElementById("technology_detail") as Element
                );
                modal.show();
            }
        };

        //  Cắt chuỗi 
        const truncateText = (text: string, maxLength: number) => {
            if (text.length > maxLength) {
                return text.substring(0, maxLength) + ' ...';
            }
            return text;
        };

        // copy
        const copyArray = ref(new Set());
        const clipboard = ref<any>([]);

        const copyContent = (content: any) => {
            disabled.value = true
            setTimeout(() => {
                disabled.value = false
            }, 1000);
            if (content) {
                navigator.clipboard
                    .writeText(content)
                    .then(() => {
                        clipboard.value = Array.from(copyArray.value.add(content))
                    })
                    .catch((error) => {
                    })
            }
        };

        // sử lý data

        const checkArray = (data: any) => {
            if (data instanceof Object || Array.isArray(data)) {
                return true
            } else {
                return false
            }
        };

        const checkString = (data: any) => {
            if (typeof data === 'string') {
                data = data.replace(/([A-Z])/g, ' $1').trim();
            }
            return data.charAt(0).toUpperCase() + data.slice(1);
        };

        const convertToString = (data: any) => {
            if (data) {
                return data.split('_').join(' ').toString();
            }
            return data
        };

        const checkLink = (data: any) => {
            if (Object.values(data).length > 0) {
                return data.replace(/(http:\/\/\S+)/, '<a href="$1" target="_blank">$1</a>');
            }
            return data
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
        });

        // thay đổi kích thước header
        const headerHeight = ref<number>(0);
        const onheaderHeight = (height: number) => {
            headerHeight.value = height
            console.log(height)
        }

        // tính thời gian
        const eventTime = ref<number | any>('30000');
        let intervalId: any;
        const startTimer = () => {
        intervalId = setInterval(() => {
            getData();
        }, eventTime.value);
        };

        const stopTimer = () => {
        clearInterval(intervalId);
        };

        onMounted(() => {
        startTimer();
        });

        onBeforeUnmount(() => {
        stopTimer();
        });

        return {
            headerHeight,
            onheaderHeight,
            getData,
            list,

            // page 
            itemsPerPage,
            totalPage,
            currentPage,
            loading,
            disabled,
            handleCurrentChange,

            //
            targetData,
            reconId,
            ID,
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

            // recon data
            checkReconMessage,
            process,
            activities, 
            domain_info, 
            ip_info, 
            domain_info_status, 
            ip_info_status, 
            port_service, 
            port_service_status, 
            related_email, 
            related_email_status, 
            related_domain, 
            related_domain_status, 
            technology, 
            subdomain_result, 
            technology_status, 
            metadata, 
            metadata_status, 
            webdata_result, 
            webdata_status, 
            linkCheck, 
            linkCheckIP,
            subdomain,
            drawerPort,
            drawerTechnology,
            activity,
            services,
            endpoint,
            account,
            reconStatus,
            expandedPortservice,
            checkRecon,
            expandedRowsTeachnology,
            detailTechnologyTitle,
            detailTechnology,
            detailPortTitle,
            detailPort,
            portCount,
            searchDirectory,
            searchEnpoint,
            totalRecordsDirectory,
            currentPageDirectory,
            pageSizeDirectory,
            SearchIcon,
            checkLink,
            convertToString,
            checkString,
            checkArray,
            drawerPorts,
            drawerTechnologys,
            handleTechnologyMore,
            handlePortserviceMore,
            isRowExpandedTechnology,
            isRowExpandedPortservice,
            truncateText,
            copyContent,
            clipboard,

            // modoal
            dialogDirectoryVisible,
            dialogEndpointsVisible,
            modelDirectory,
            modelEndpoints,
            directory_data,
            enpoint_data,
            handleCurrentChangeEndpoint,
            handleCurrentChangeDirectory,
            pageSizeEndpoints,
            totalRecords,
            currentPageEndpoints,
        };
    },
});
</script>
<style >
.custom-dialog .el-dialog__body{
    padding: 10px 20px;
}

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