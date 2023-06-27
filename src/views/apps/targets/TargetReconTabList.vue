<template>
    <!--begin::Navbar-->
    <div class="mb-3 me-2 position-relative position-repository bg-white rounded-3">
        <!--begin::Card header-->
        <div class="card-header border-0 p-0 position-absolute end-0 pe-1 position-sm-top">
            <!--begin::Card toolbar-->
            <div class="card-toolbar">
                <div class="d-flex justify-content-end w-100">
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
                    <button v-if="reconStatus == 5" type="button" @click="handlePauser"
                        :disabled="(checkDisabled || checkStatus)"
                        class="btn btn-sm btn-outline btn-outline-dashed btn-outline-primary  fw-bold bg-body btn-color-gray-700 btn-active-color-primary  ms-2">
                        <KTIcon icon-name="bi bi-play-fill text-primary" icon-class="fs-2 " />
                        <span class="text-primary"> Tiếp tục</span>
                    </button>
                    <button v-else type="button" @click="handlePauser" :disabled="(checkDisabled || checkStatus)"
                        class="btn btn-sm btn-outline btn-outline-dashed  btn-outline-danger fw-bold bg-body btn-color-gray-700 btn-active-color-danger  ms-2">
                        <KTIcon icon-name="bi bi-pause-fill text-danger" icon-class="fs-2 " />
                        <span class="text-danger">Tạm dừng</span>
                    </button>
                    <button type="button" :disabled="(reconStatus != 3 || checkDisabled) ? true : false"
                        @click="fileDownVisible = true"
                        class="btn btn-sm fw-bold bg-primary btn-color-gray-700 btn-active-color-primary ms-2 text-white">
                        <KTIcon icon-name="file-down" icon-class="fs-2 text-white" />
                        Xuất kết quả
                    </button>
                </div>
            </div>
            <!--end::Card toolbar-->
        </div>
        <!--end::Card header-->
        <div class="row px-2 h-md-50px align-items-center ">
            <div class="col-sm-12 col-md-8 py-2">
                <div class="row">
                    <div class="col-6">
                        <div>
                            <span class="w-70px">Mục tiêu : </span>
                            <span class="fw-bold">{{ targets.name }} - {{ targets.domain }}</span>
                        </div>
                    </div>
                    <div class="col-6">
                        <div>
                            <span class="w-70px">Nhóm mục tiêu : </span>
                            <span class="fw-bold">{{ targets.group.title }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm-12 col-md-4 text-end ms-auto py-2">
                <div class="d-flex justify-content-sm-start justify-content-md-end">

                    <!--begin::Select-->
                    <el-button class="me-2" type="primary" :icon="RefreshIcon" @click="reloadData" :loading="disabled"
                        :loading-icon="RefreshIcon">Tải lại</el-button>
                    <!--end::Select-->

                    <!--begin::Select-->
                    <el-select v-model="eventTime" class="d-block w-150px" as="select">
                        <el-option value="300000" key="300000" label="5 phút" />
                        <el-option value="60000" key="60000" label="1 phút" />
                        <el-option value="30000" key="30000" label="30 giây" />
                        <el-option value="15000" key="15000" label="15 giây" />
                        <el-option value="5000" key="5000" label="5 giây" />
                    </el-select>
                    <!--end::Select-->
                </div>
            </div>
        </div>
    </div>
    <!--end::Navbar-->

    <!--begin::Card-->
    <div class="">
        <el-scrollbar class="rounded-3 height-repository" :noresize="true" min-size="10" :native="true"
            wrap-class="w-100 overflow-x-hidden pe-1">
            <el-row :gutter="10">
                <el-col :xs="24" :sm="8" :md="8" :lg="8" :xl="8" class="mb-3 mx-0">
                    <el-card shadow="hover" class="box-card rounded-3 h-100" :body-style="{ padding: '20px 5px' }">
                        <reconActivity :activitieLine="activities" :activity="activity" chartHeight="300"
                            :process="process"></reconActivity>
                    </el-card>
                </el-col>
                <el-col :xs="24" :sm="16" :md="16" :lg="16" :xl="16" class="d-grid">
                    <el-row :gutter="10">
                        <el-col :span="6" class="mb-3 mx-0">
                            <el-card shadow="hover" class="box-card rounded-3 h-100" :body-style="{ padding: '20px 10px' }">
                                <!--begin::Label-->
                                <div class="fs-7 text-muted fw-semobold">Subdomains</div>
                                <!--end::Label-->
                                <!--begin::Stat-->
                                <div class="d-flex align-items-start flex-wrap">
                                    <div class="fs-2x fw-bold me-2">{{ subdomain.total_subdomain }}</div>
                                    <!--begin::Badge-->
                                    <span class="badge badge-light-success fs-base">
                                        <KTIcon icon-name="notification-bing" icon-class="fs-5 text-success ms-n1" />
                                        <span class="fs-7 text-success">{{ subdomain.total_subdomain_live }} Alive</span>
                                    </span>
                                    <!--end::Badge-->
                                </div>

                            </el-card>
                        </el-col>
                        <el-col :span="6" class="mb-3 mx-0">
                            <el-card shadow="hover" class="box-card h-100 rounded-3" :body-style="{ padding: '20px 10px' }">
                                <!--begin::Label-->
                                <div class="fs-7 text-muted fw-semobold">Endpoints</div>
                                <!--end::Label-->
                                <!--begin::Stat-->
                                <div class="d-flex align-items-start flex-wrap">
                                    <div class="fs-2x fw-bold me-2">{{ endpoint.message.total_endpoint }}</div>
                                    <!--begin::Badge-->
                                    <span class="badge badge-light-success fs-base">
                                        <KTIcon icon-name="notification-bing" icon-class="fs-5 text-success ms-n1" />
                                        <span class="fs-7 text-success">{{ endpoint.message.total_endpoint_live }}
                                            Alive</span>
                                    </span>
                                    <!--end::Badge-->
                                </div>
                            </el-card>
                        </el-col>
                        <el-col :span="6" class="mb-3 mx-0">
                            <el-card shadow="hover" class="box-card h-100 rounded-3" :body-style="{ padding: '20px 10px' }">
                                <!--begin::Label-->
                                <div class="fs-7 text-muted fw-semobold">Services</div>
                                <!--end::Label-->
                                <!--begin::Stat-->
                                <div class="">
                                    <div class="fs-2x fw-bold me-2">{{ services.total_open }}</div>
                                </div>
                                <div>
                                    <span class="badge badge-light-primary me-1">Open: {{ services.total_open }}</span>
                                    <span class="badge badge-light-danger">Closed: {{ services.total_close }}</span>
                                </div>
                            </el-card>
                        </el-col>
                        <el-col :span="6" class="mb-3 mx-0">
                            <el-card shadow="hover" class="box-card h-100 rounded-3" :body-style="{ padding: '20px 10px' }">
                                <!--begin::Label-->
                                <div class="fs-7 text-muted fw-semobold">Tài khoản</div>
                                <!--end::Label-->
                                <!--begin::Stat-->

                                <!--begin::Stats-->
                                <div class="d-flex flex-wrap">
                                    <!--begin::Stat-->
                                    <div
                                        class="border border-gray-300 border-dashed rounded min-w-80px py-1 px-2 me-2 mb-2 ">
                                        <div class="fw-semobold fs-7 text-gray-800"><span class="text-info fw-bold fs-6">{{
                                            account.email }} </span> Địa chỉ Email</div>
                                    </div>
                                    <!--end::Stat-->

                                    <!--begin::Stat-->
                                    <div
                                        class="border border-gray-300 border-dashed rounded min-w-80px py-1 px-2 me-2 mb-2">
                                        <div class="fw-semobold fs-7 text-gray-800"><span class="text-info fw-bold fs-6">{{
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
                                    <div class="card-header">
                                        <span class="card-label fw-bold text-gray-800 fs-5">Thông tin về Domain</span>
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
                                                <span>Không tìm thấy dữ liệu nào!</span>
                                            </div>
                                        </template>
                                        <template v-else>
                                            <el-tabs tab-position="left" type="border-card" :stretch="true"
                                                class="demo-tabs2 padding-tabs border border-0 h-100" :lazy="true">
                                                <el-tab-pane v-for="(items, index) in domain_info" :key="index" class="">
                                                    <template #label>
                                                        <span class="custom-tabs-label text-capitalize">
                                                            <span>{{ index }}</span>
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
                                                                <span>Không tìm thấy dữ liệu nào!</span>
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
                                    <div class="card-header">
                                        <span class="card-label fw-bold text-gray-800 fs-5">Thông tin về IP</span>
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
                                                <span>Không tìm thấy dữ liệu nào!</span>
                                            </div>
                                        </template>
                                        <template v-else>
                                            <el-tabs tab-position="left" type="border-card" :stretch="true"
                                                class="demo-tabs padding-tabs border border-0 h-100" :lazy="true">
                                                <el-tab-pane v-for="(items, index) in ip_info" :key="index" class="">
                                                    <template #label>
                                                        <span class="custom-tabs-label text-capitalize">
                                                            <span>{{ index }}</span><br>
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
                                                                <span>Không tìm thấy dữ liệu nào!</span>
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
                                                                                                        class="bullet bullet-dot bg-success me-5"></span>
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
                                                                                                                    ' None...' :
                                                                                                                    q }}
                                                                                                            </span>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                </template>
                                                                                                <template v-else>
                                                                                                    <div>
                                                                                                        <span
                                                                                                            class="bullet bullet-dot bg-success me-5"></span>
                                                                                                        {{ j }} :
                                                                                                        <span
                                                                                                            :class="(e == '' || e == null) ? 'text-danger' : ''">
                                                                                                            {{ (e == '' || e
                                                                                                                == null) ?
                                                                                                                'None...' : e }}
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
                                                                                                    class="bullet bullet-dot bg-success me-5">
                                                                                                </span>
                                                                                                {{ i }} :
                                                                                                <span class="ms-1"
                                                                                                    :class="(el == '' || el == null) ? 'text-danger' : ''">
                                                                                                    {{ (el == '' || el ==
                                                                                                        null) ? 'None...' : el
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
                                                                                        'None...' :
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
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <span class="card-label fw-bold text-gray-800 fs-5">Cổng Dịch vụ</span>
                                <span class="badge badge-circle badge-success ms-2">
                                    {{ (port_service_status == 3  && Array.isArray(port_service)) ? Object.keys(port_service).length : 0 }}</span>
                            </div>
                        </template>
                        <div class="h-500px">
                            <template v-if="port_service_status == 3">
                                <template v-if="port_service == '' || Object.keys(port_service).length == 0">
                                    <div class="px-5 w-100 h-100 d-flex flex-column justify-content-center text-center">
                                        <div class="text-center mb-5">
                                            <i class="fa-solid fa-circle-info fa-bounce fs-3x text-primary"></i>
                                        </div>
                                        <span>Không tìm thấy dữ liệu nào!</span>
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
                                        <el-popover v-for="(item, key) in port_service" :key="key" placement="bottom"
                                            :width="250" trigger="click">
                                            <template #reference>
                                                <el-tag :key="key" :type="(item.status == false) ? 'danger' : 'primary'"
                                                    class="mx-1 my-1 cursor-pointer" effect="dark" round>
                                                    {{ key }}
                                                </el-tag>
                                            </template>
                                            <!--begin::Table container-->
                                            <div class="mh-300px overflow-y-auto">
                                                <div class="pb-2 mt-2">
                                                    <h4 class="fs-4">Details for Post: {{ key.toString().split("/")[0] }}
                                                    </h4>
                                                    <span class="fs-7">Total
                                                        <span class="fw-bold text-dark">{{ Object.keys(item.ips).length
                                                        }}</span>
                                                        IP Addresses have Port
                                                        <span class="fw-bold text-dark">{{ key.toString().split("/")[0]
                                                        }}</span></span>
                                                </div>
                                                <div class="d-flex flex-column my-3 ms-2">
                                                    <li v-for="(i, key) in  item.ips" :key="key"
                                                        class="d-flex align-items-center py-2">
                                                        <span :class="`bg-${(i == true) ? 'primary' : 'danger'}`"
                                                            class="bullet bullet-dot me-5 h-7px w-7px"></span>
                                                        <!-- <span :class="`fs-7 badge badge-light-${(item.status == false) ? 'danger' : 'primary'}`">
                                                        {{ i }}</span> -->
                                                        <span class="fs-6">{{ key }}</span>
                                                    </li>
                                                </div>
                                            </div>
                                            <!--end::Table container-->
                                        </el-popover>

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
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <span class="card-label fw-bold text-gray-800 fs-5">Email liên quan</span>
                                <span class="badge badge-circle badge-success ms-2">
                                    {{ (related_email_status == 3 && Array.isArray(related_email)) ? Object.keys(related_email).length : 0 }}
                                </span>
                            </div>
                        </template>
                        <div class="h-500px">
                            <template v-if="related_email_status == 3">
                                <template v-if="related_email == '' || Object.keys(related_email).length == 0">
                                    <div class="px-5 w-100 h-100 d-flex flex-column justify-content-center text-center">
                                        <div class="text-center mb-5">
                                            <i class="fa-solid fa-circle-info fa-bounce fs-3x text-primary"></i>
                                        </div>
                                        <span>Không tìm thấy dữ liệu nào!</span>
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
                                                    <th class="py-2 px-0 text-start">Email</th>
                                                    <th class="py-2 px-3 text-center">Password</th>
                                                    <th class="py-2 px-3 text-end">Password Crack</th>
                                                </tr>
                                            </thead>
                                            <!--end::Table head-->

                                            <!--begin::Table body-->
                                            <tbody class="overflow-y-auto w-100 ">
                                                <tr v-for="(item, key) in related_email" :key="key">
                                                    <td class="text-start"><span>
                                                            <span>{{ (item.email == '') ? 'None...' : item.email }}</span>
                                                        </span></td>
                                                    <td class="text-center ">
                                                        <template
                                                            v-if="checkArray(item.password_crack) || item.password_crack != ''">
                                                            <template v-if="checkArray(item.password_crack)">
                                                                <span class="badge badge-light text-dark ms-1 mb-1"
                                                                    v-for="i in item.password_crack">
                                                                    {{ (i == '') ? 'None...' : i }}</span>
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
                                                                    {{ (i == '') ? 'None...' : i }}</span>
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
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <span class="card-label fw-bold text-gray-800 fs-5">Tên miền liên quan đến mục tiêu</span>
                                <span class="badge badge-circle badge-success ms-2">
                                    {{ (related_domain_status == 3  && Array.isArray(related_domain)) ? Object.keys(related_domain).length : 0 }}
                                </span>
                            </div>
                        </template>
                        <div class="h-500px">
                            <template v-if="related_domain_status == 3">
                                <template v-if="related_domain == '' || Object.keys(related_domain).length == 0">
                                    <div class="px-5 w-100 h-100 d-flex flex-column justify-content-center text-center">
                                        <div class="text-center mb-5">
                                            <i class="fa-solid fa-circle-info fa-bounce fs-3x text-primary"></i>

                                        </div>
                                        <span>Không tìm thấy dữ liệu nào!</span>
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
                                                    <th class="py-2 px-0 text-start">Tên miền</th>
                                                    <th class="py-2 px-3 text-start">Giao thức</th>
                                                    <th class="py-2 px-3 text-end">Cùng dải mạng?</th>
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
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <span class="card-label fw-bold text-gray-800 fs-5">Công nghệ sử dụng</span>
                                <span class="badge badge-circle badge-success ms-2">
                                    {{ (technology_status == 3  && Array.isArray(technology)) ? Object.keys(technology).length : 0 }}
                                </span>
                            </div>
                        </template>
                        <div class="h-500px">
                            <template v-if="technology_status == 3">
                                <template v-if="technology == '' || Object.keys(technology).length == 0">
                                    <div class="px-5 w-100 h-100 d-flex flex-column justify-content-center text-center">
                                        <div class="text-center mb-5">
                                            <i class="fa-solid fa-circle-info fa-bounce fs-3x text-primary"></i>
                                        </div>
                                        <span>Không tìm thấy dữ liệu nào!</span>
                                    </div>
                                </template>
                                <template v-else>
                                    <div class="p-5">
                                        <el-popover v-for="(item, key) in technology" :key="key" placement="top-start"
                                            width="auto" trigger="hover" hide-after="100">
                                            <template #reference>
                                                <span @click="drawerTechnologys(item, key)"
                                                    class="badge badge-light-primary fs-7 me-2 my-1 cursor-pointer">{{ key
                                                    }}</span>
                                            </template>
                                            <div>
                                                <span>Total number of subdomains: <span class="fw-bold fs-6 text-primary">{{
                                                    Object.keys(item).length }}</span></span>
                                            </div>
                                        </el-popover>
                                        <el-drawer v-model="drawerTechnology" title="I am the title" :with-header="false">
                                            <div>
                                                <h4>{{ detailTechnologyTitle }}</h4>
                                                <span class="fs-7 mb-5 ">There Are
                                                    <span class="fw-bold text-dark ">{{ Object.keys(detailTechnology).length
                                                    }}</span>
                                                    Technologies Used In Total
                                                </span>
                                            </div>
                                            <div class="d-flex flex-column ms-2 my-5">
                                                <li class="d-flex align-items-center py-2" v-for="el in detailTechnology"
                                                    :key="el">
                                                    <span class="bullet bullet-dot bg-success me-5 h-7px w-7px"></span> {{
                                                        el }}
                                                </li>
                                            </div>
                                        </el-drawer>
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
                            <div class="card-header">
                                <span class="card-label fw-bold text-gray-800 fs-5">Metadata</span>
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
                                        <span>Không tìm thấy dữ liệu nào!</span>
                                    </div>
                                </template>
                                <template v-else>
                                    <el-tabs tab-position="left" type="border-card" :stretch="true"
                                        class="demo-tabs3 padding-tabs border border-0 h-100" :lazy="true">
                                        <el-tab-pane v-for="(items, index) in metadata" :key="index" class="">
                                            <template #label>
                                                <span class="custom-tabs-label">
                                                    <span>{{ index }}</span>
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
                                                        <span>Không tìm thấy dữ liệu nào!</span>
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
                            <div class="card-header">
                                <span class="card-label fw-bold text-gray-800 fs-5">Web Data</span>
                            </div>
                        </template>
                        <div class="h-100">
                        </div>
                    </el-card>
                </el-col>

                <el-col :span="24" class="mb-3 mx-0">
                    <el-card shadow="hover" class="box-card rounded-3 h-100" :body-style="{ padding: '0px' }">
                        <template #header>
                            <div class="card-header d-flex justify-content-between align-items-center">
                                <span class="card-label fw-bold text-gray-800 fs-5">Subdomains</span>
                                <router-link class="btn btn-sm btn-light text-hover-primary text-primary"
                                    :to="`/target-recon-detail/${idRecon}/${scanID}/subdomains`" active-class="active">View
                                    all</router-link>
                            </div>
                        </template>
                        <div class="h-500px">
                            <template v-if="Object.values(subdomain_result).length > 0">
                                <el-table :data="subdomain_result" height="500" style="width: 100%"
                                    class-name="my-custom-table">
                                    <el-table-column min-width="120" label-class-name="border border-0 fs-7" prop="name"
                                        label="Subdomain">
                                        <template #default="scope">
                                            <span class="fs-7 fst-normal">
                                                {{ (scope.row.name == '') ? '--' : scope.row.name }}</span> </template>
                                    </el-table-column>
                                    <el-table-column label-class-name="border border-0 fs-7" prop="enpoint" align="center"
                                        label="Endpoints" min-width="90">
                                        <template #default="scope">
                                            <span class="fs-7 fst-normal badge cursor-pointer"
                                                @click="modelEndpoints(scope.row.enpoint_data)"
                                                :class="`badge-light-${(scope.row.enpoint == 0 || scope.row.directory == undefined) ? 'danger' : 'primary'}`">
                                                {{ scope.row.enpoint ?? '0' }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label-class-name="border border-0 fs-7" prop="directory"
                                        label="Directory" align="center" min-width="90">
                                        <template #default="scope">
                                            <span class="fs-7 fst-normal badge cursor-pointer"
                                                @click="modelDirectory(scope.row.directory_data)"
                                                :class="`badge-light-${(scope.row.directory == 0 || scope.row.directory == undefined) ? 'danger' : 'primary'}`">
                                                {{ scope.row.directory ?? '0' }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label-class-name="border border-0 fs-7" prop="url_checked"
                                        align="center" label="URL Checked">
                                        <template #default="scope">
                                            <span class="fs-7 fst-normal">
                                                {{ (scope.row.url_checked == '') ? '--' : scope.row.url_checked }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label-class-name="border border-0 fs-7" prop="status" label="Status"
                                        align="center">
                                        <template #default="scope">
                                            <span class="fs-7 fst-normal">
                                                {{ (scope.row.status == '') ? '--' : scope.row.status }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label-class-name="border border-0 fs-7" prop="title" label="Title"
                                        align="center">
                                        <template #default="scope">
                                            <span class="fs-7 fst-normal">
                                                {{ (scope.row.title == '') ? '--' : scope.row.title }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label-class-name="border border-0 fs-7" prop="ip" label="IP"
                                        align="center">
                                        <template #default="scope">
                                            <span class="fs-7 fst-normal">
                                                {{ (scope.row.ip == '') ? '--' : scope.row.ip }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label-class-name="border border-0 fs-7" prop="portservice"
                                        label="Cổng dịch vụ" align="start" min-width="200">
                                        <template #default="scope">
                                            <div>
                                                <template
                                                    v-if="scope.row.portservice == undefined || Object.keys(scope.row.portservice).length === 0">
                                                    <span class="text-danger">--</span>
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
                                    <el-table-column label-class-name="border border-0 fs-7" prop="technology" align="start"
                                        label="Công nghệ sử dụng" min-width="200">
                                        <template #default="scope">
                                            <div>
                                                <template
                                                    v-if="scope.row.technology == undefined || Object.keys(scope.row.technology).length === 0">
                                                    <span class="text-danger">--</span>
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
                                    <el-table-column label-class-name="border border-0 fs-7" prop="dns_record" align="left"
                                        label="Bản ghi DNS" min-width="150">
                                        <template #default="scope">

                                            <li class="d-flex align-items-start mb-1">
                                                <div>
                                                    <span class="fw-bold text-capitalize fs-7">A: </span>
                                                    <span class="fst-normal fs-7">
                                                        {{ (typeof scope.row.dns_record['a'] !== "undefined") ?
                                                            scope.row.dns_record['a'].join(' , ') : '--' }}
                                                    </span>
                                                </div>
                                            </li>
                                            <li class="d-flex align-items-start mb-1">
                                                <div>
                                                    <span class="fw-bold text-capitalize fs-7">Cname: </span>
                                                    <span class="fst-normal fs-7">
                                                        {{ (typeof scope.row.dns_record['cname'] !== "undefined") ?
                                                            scope.row.dns_record['cname'].join(' , ') : '--' }}
                                                    </span>
                                                </div>
                                            </li>
                                            <li class="d-flex align-items-start mb-1">
                                                <div>
                                                    <span class="fw-bold text-capitalize fs-7">MX: </span>
                                                    <span class="fst-normal fs-7">
                                                        {{ (typeof scope.row.dns_record['mx'] !== "undefined") ?
                                                            scope.row.dns_record['mx'].join(' , ') : '--' }}
                                                    </span>
                                                </div>
                                            </li>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </template>
                            <template v-else>
                                <div class="mt-5 m-3">
                                    <el-skeleton :rows="10" animated />
                                </div>
                            </template>
                        </div>
                    </el-card>
                </el-col>

            </el-row>
        </el-scrollbar>
    </div>
    <!--end::Card-->

    <!-- // modoal  -->
    <el-dialog v-model="fileDownVisible" title="Xác nhận xuất file" width="500">
        <div class="card h-100 bg-secondary ">
            <!--begin::Card body-->
            <div class="card-body d-flex justify-content-center text-center flex-column p-8">
                <!--begin::Name-->
                <div class="symbol symbol-60px mb-5">
                    <i class="fa-solid fa-file-zipper fs-4x text-primary"></i>
                </div>
                <!--end::Image-->

                <!--begin::Title-->
                <div class="fs-5 fw-bold mb-2 text-dark"> {{ `Recon_${scanID}_report.zip` }} </div>
                <!--end::Name-->
            </div>
            <!--end::Card body-->
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="fileDownVisible = false" :disabled="disabled">Hủy bỏ</el-button>
                <el-button type="primary" :disabled="disabled" @click="downloadAcunetix">Tải về</el-button>
            </span>
        </template>
    </el-dialog>

    <!-- modoal  -->
    <el-dialog v-model="dialogDirectoryVisible" title="Directory Detail" width="1000">
        <div>
            <el-input v-model="searchDirectory" size="large" placeholder="Type to search" :prefix-icon="SearchIcon" />
            <div class="my-5 text-primary">
                <span class="fs-7 text-gray-600">Tổng Directory: </span>
                <span class="fw-bold">{{ totalRecordsDirectory }}</span>
            </div>
        </div>
        <el-table :data="directory_data" style="width: 100%" height="400" class-name="my-custom-table">
            <el-table-column min-width="40" label-class-name="border border-0 fs-7" label="STT">
                <template #default="scope">
                    <span class="fs-7 fst-normal">
                        {{ scope.row.index }}</span> </template>
            </el-table-column>
            <el-table-column min-width="90" label-class-name="border border-0 fs-7" prop="name" label="Thư mục">
                <template #default="scope">
                    <span class="fs-7 fst-normal">
                        {{ (scope.row.name == '') ? '--' : scope.row.name }}</span> </template>
            </el-table-column>
            <el-table-column min-width="90" label-class-name="border border-0 fs-7" prop="content_type" label="Content Type"
                align="center">
                <template #default="scope">
                    <span class="fs-7 fst-normal">
                        {{ (scope.row.content_type == '') ? '--' : scope.row.content_type }}</span> </template>
            </el-table-column>
            <el-table-column min-width="90" label-class-name="border border-0 fs-7" prop="status" label="Status"
                align="right">
                <template #default="scope">
                    <span class="badge fs-7 fst-normal"
                        :class="(scope.row.status == '200') ? 'badge-light-success' : 'badge-light-danger'">
                        {{ (scope.row.status == '') ? '--' : scope.row.status }}
                    </span>
                </template>
            </el-table-column>
        </el-table>
        <div v-if="totalRecordsDirectory > pageSizeDirectory" class="d-flex justify-content-center mx-auto w-100 my-5">
            <el-pagination @current-change="handleCurrentChangeDirectory" background
                v-model:current-page="currentPageDirectory" v-model:page-size="pageSizeDirectory"
                :total="totalRecordsDirectory" layout="prev, pager, next"></el-pagination>
        </div>
    </el-dialog>

    <!-- modoal  -->
    <el-dialog v-model="dialogEndpointsVisible" title="Enpoint Detail" width="1000">
        <div>
            <el-input v-model="searchEnpoint" size="large" placeholder="Type to search" :prefix-icon="SearchIcon" />
            <div class="my-5 text-primary">
                <span class="fs-7 text-gray-600">Tổng Enpoint: </span>
                <span class="fw-bold">{{ totalRecords }}</span>
            </div>
        </div>
        <el-table :data="enpoint_data" style="width: 100%" height="400" class-name="my-custom-table" v-loading="loading">
            <el-table-column min-width="40" label-class-name="border border-0 fs-7" label="STT">
                <template #default="scope">
                    <span class="fs-7 fst-normal">
                        {{ scope.row.index }}</span> </template>
            </el-table-column>
            <el-table-column min-width="90" label-class-name="border border-0 fs-7" prop="url" label="URL">
                <template #default="scope">
                    <span class="fs-7 fst-normal" v-if="scope.row.url != '' || scope.row.url != null">
                        <el-link class="fs-7" :underline="false" :href="scope.row.url" target="_blank">{{ scope.row.url
                        }}</el-link>
                    </span>
                    <span v-else>--</span>

                </template>
            </el-table-column>
            <el-table-column min-width="60" label-class-name="border border-0 fs-7" prop="params" label="Parameter"
                align="center">
                <template #default="scope">

                    <template v-if="Object.keys(scope.row.params).length == 0">
                        <span class="badge badge-light-danger fs-7">--</span>
                    </template>
                    <template v-else>
                        <span v-for="(value, index) in scope.row.params" :index="index"
                            class="badge badge-light-primary fs-7 my-1 ms-1">{{ value }}</span>
                    </template>
                </template>
            </el-table-column>
            <el-table-column min-width="90" label-class-name="border border-0 fs-7" prop="title" label="Title">
                <template #default="scope">
                    <span class="fs-7 fst-normal">
                        {{ (scope.row.title == '') ? '--' : scope.row.title }}</span> </template>
            </el-table-column>
            <el-table-column min-width="60" label-class-name="border border-0 fs-7" prop="status_code" label="Status"
                align="right">
                <template #default="scope">
                    <span class="badge fs-7 fst-normal"
                        :class="(scope.row.status_code == '200') ? 'badge-light-success' : 'badge-light-danger'">
                        {{ (scope.row.status == '') ? '--' : scope.row.status_code }}
                    </span>
                </template>
            </el-table-column>
        </el-table>
        <div v-if="totalRecords > pageSizeEndpoints" class="d-flex justify-content-center mx-auto w-100 my-5">
            <el-pagination @current-change="handleCurrentChangeEndpoint" background
                v-model:current-page="currentPageEndpoints" v-model:page-size="pageSizeEndpoints" :total="totalRecords"
                layout="prev, pager, next"></el-pagination>
        </div>
    </el-dialog>
</template>
  
<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref, onMounted, onBeforeUnmount, watch } from "vue";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import ApiService from "@/core/services/ApiService";
import filtersTabScan from "@/views/apps/targets/filtersTabScan.vue";
import CodeHighlighter from "@/components/highlighters/CodeHighlighter.vue";
import { useRoute } from 'vue-router';
import { debounce } from 'vue-debounce'
import { ElMessage } from 'element-plus'
import reconActivity from "@/views/apps/targets/reconWidgets/reconActivity.vue";
import Swal from "sweetalert2/dist/sweetalert2.js";
// import data from "@/views/apps/targets/reconData.json";
import { Refresh, Search } from '@element-plus/icons-vue'

// import dayjs from 'dayjs';
import axios from 'axios'

interface APIData {
    title: string;
    description: string;
}

interface Targets {
    name: string;
    domain: string;
    group: {
        title: string;
    };
}

interface getData {
    last_seen: string;
    status: string;
    affects_url: string;
    vt_name: string;
    severity: string;
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
        reconActivity,
    },
    setup() {
        const route = useRoute();
        const scanID = ref<null | number | any>(route.params.id ?? '');
        const idRecon = ref<null | number | any>(route.params.idRecon ?? '');
        const list = ref<getData | any>()
        const RefreshIcon = ref(Refresh)
        const SearchIcon = ref(Search)
        const loading = ref<boolean>(false)
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
        const severityLow = ref<number>(0)
        const severityMedium = ref<number>(0)
        const severityHigh = ref<number>(0)
        const reconStatus = ref<number>(0)
        const filterSeverity = ref<number | null>(null)
        const timeEnd = ref<number | any>(null)
        const timeStart = ref<number | any>(null)
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
        const targets = ref<Targets>({
            name: '',
            domain: '',
            group: {
                title: '',
            }
        });
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

        const technology = ref<any>({});
        const subdomain_result = ref<any>({});
        const technology_status = ref<number | any>(null);
        const metadata = ref<any>({});
        const metadata_status = ref<number | any>(null);
        const linkCheck = ref<string>('')
        const linkCheckIP = ref<string>('')
        const disabled = ref<boolean>(false);

        const handleClick = (data: object | any, type: String) => {
            apiData.value.description = data.description;
        };

        const getData = async () => {
            loading.value = true;

            return await ApiService.get(`recon/detail3/${scanID.value}`)
                .then(({ data }) => {
                    // console.log(data)
                    // console.log(data1)
                    list.value = data
                    targets.value = data.target
                    account.value = data.recon[0].account
                    services.value = data.recon[0].services
                    subdomain.value = data.recon[0].subdomain
                    endpoint.value = data.recon[0].endpoint

                    // tiến trình
                    activity.value = data.recon[0].activity
                    const totalCount = (activity.value.total_finish / (activity.value.total_finish + activity.value.total_not_done)) * 100;
                    process.value = [parseFloat(totalCount.toFixed(1))]
                    activities.value = (data.recon[0].activity !== undefined) ? data.recon[0].activity.task_done : {}

                    // console.log(activity.value, '123')
                    // console.log(process.value)
                    // console.log(activities.value, '321')

                    // if (totalCount == 100) {
                    // } else {
                    //     activities.value = { ...activities.value, load: 'Đang chạy...' }
                    // }

                    // domain
                    domain_info.value = (data.recon[0].domain_info !== undefined) ? data.recon[0].domain_info.message : {};
                    domain_info_status.value = (data.recon[0].domain_info !== undefined) ? data.recon[0].domain_info.status : {};
                    linkCheck.value = (domain_info_status.value == 4) ? checkLink(domain_info.value) : ''

                    // IP
                    ip_info.value = (data.recon[0].ip_info !== undefined) ? data.recon[0].ip_info.message : {};
                    ip_info_status.value = (data.recon[0].ip_info !== undefined) ? data.recon[0].ip_info.status : {};
                    linkCheckIP.value = (ip_info_status.value == 4) ? checkLink(ip_info.value) : ''


                    // port_service
                    port_service.value = (data.recon[0].port_service !== undefined) ? data.recon[0].port_service.message : {};
                    port_service_status.value = (data.recon[0].port_service !== undefined) ? data.recon[0].port_service.status : {};


                    // related_email
                    related_email.value = (data.recon[0].related_email !== undefined) ? data.recon[0].related_email.message : {};
                    related_email_status.value = (data.recon[0].related_email !== undefined) ? data.recon[0].related_email.status : {};

                    // related_domain
                    related_domain.value = (data.recon[0].related_domain !== undefined) ? data.recon[0].related_domain.message : {};
                    related_domain_status.value = (data.recon[0].related_domain !== undefined) ? data.recon[0].related_domain.status : {};

                    // metadata
                    metadata.value = (data.recon[0].metadata !== undefined) ? data.recon[0].metadata.message : {};
                    metadata_status.value = (data.recon[0].metadata !== undefined) ? data.recon[0].metadata.status : {};

                    // technology
                    technology.value = (data.recon[0].technology !== undefined) ? data.recon[0].technology.message : {};
                    technology_status.value = (data.recon[0].technology !== undefined) ? data.recon[0].technology.status : {};

                    // subdomain_result
                    subdomain_result.value = data.recon[0].subdomain_result
                    reconStatus.value = data.status
                    humanDiffTime()
                    console.log(data)

                })
                .catch(({ response }) => {
                    notification(response.data.detail, 'error', 'Có lỗi xảy ra')
                })
                .finally(() => {
                    loading.value = false
                });
        }

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

        // reloadData
        const reloadgetData = () => {
            disabled.value = true
            setTimeout(() => {
                disabled.value = false
            }, 1000);
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
        const checkPauser = ref<boolean>(false);
        const checkDisabled = ref<boolean>(false);
        const handlePauser = async () => {
            checkDisabled.value = true
            setTimeout(() => {
                checkDisabled.value = false;
            }, 500);
            if (reconStatus.value == 3) {
                ElMessage({
                    message: 'Danh dách đã được quét thành công không thể tạm dừng',
                    type: 'success',
                    center: false,
                })
            } else if (reconStatus.value == 5) {
                // console.log('tiếp tục')
                getResume()
            } else if (reconStatus.value == 2) {
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
            return ApiService.post(`recon/${scanID.value}/restart2`, formData)
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
            return ApiService.post(`recon/${scanID.value}/stop2`, formData)
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

        // tải về files
        const fileDownVisible = ref(false)
        const downloadAcunetix = async () => {
            checkDisabled.value = true
            setTimeout(() => {
                checkDisabled.value = false
            }, 1000);
            axios({
                url: `/recon/${scanID.value}/download`, //your url
                method: 'POST',
                responseType: 'blob', // important
            }).then((response) => {
                const href = URL.createObjectURL(response.data);
                const link = document.createElement('a');
                link.href = href;
                link.setAttribute('download', `Recon_${scanID.value}_report.zip`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(href);
                fileDownVisible.value = false;
            }).catch(async error => {
                // xử lý hiển thị lỗi 
                const reponse_message = JSON.parse(await error.response.data.text()).detail ?? "Có lỗi xảy ra"
                ElMessage({
                    message: reponse_message,
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

        // tính thời gian
        const diffTime = ref<string | any>(0);
        const time = ref<any>(null);
        const eventTime = ref<number | any>('30000');
        let intervalId : any;

        const humanDiff = async () => {
            let date1: any = (reconStatus.value == 2) ? new Date() : new Date(timeEnd.value);
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
            if (reconStatus.value == 2 || reconStatus.value == 1) {
                intervalId = setInterval(() => {
                    getData();
                }, eventTime.value);
            } else {
                return;
            }
        };
        const stopTimer = () => {
            clearInterval(intervalId);
        };

        onBeforeUnmount(() => {
            stopTimer();
        });

        onMounted(() => {
            getData();
        });

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

        const checkLink = (data: any) => {
            if (Object.values(data).length > 0) {
                return data.replace(/(http:\/\/\S+)/, '<a href="$1" target="_blank">$1</a>');
            }
            return data
        };

        const detailTechnology = ref([])
        const detailTechnologyTitle = ref('')
        const drawerTechnologys = (data: any, title: any) => {
            if (data || title) {
                drawerTechnology.value = true
                detailTechnology.value = data
                detailTechnologyTitle.value = title
            }
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

        return {
            activities,
            scanID,
            idRecon,
            getData,
            list,
            getAssetPath,
            targetData,
            severityMedium,
            severityHigh,
            severityLow,
            severityInfo,
            handleSeverity,
            filterSeverity,
            activeName,

            // khai báo các kiểu
            account,
            services,
            subdomain,
            endpoint,
            activity,
            process,

            // tải về
            fileDownVisible,
            downloadAcunetix,


            // crud
            apiData,
            handleClick,



            // sử lý dữ liệu
            getSeverity,
            getStatus,

            // filter
            loading,


            // reloadData
            reloadData,
            progress,
            checkStatus,
            diffTime,
            eventTime,
            checkPauser,

            // tạm dừng
            handlePauser,
            checkDisabled,
            reconStatus,

            // hủy 
            confirmEvent,
            cancelEvent,

            // 
            ip_info,
            domain_info,
            ip_info_status,
            domain_info_status,
            checkArray,
            checkString,
            linkCheck,
            related_domain_status,
            related_domain,
            related_email_status,
            related_email,
            port_service_status,
            port_service,
            technology,
            metadata,
            technology_status,
            metadata_status,
            subdomain_result,
            linkCheckIP,
            disabled,
            RefreshIcon,
            SearchIcon,
            drawerTechnology,
            drawerTechnologys,
            detailTechnology,
            detailTechnologyTitle,
            targets,
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
            pageSizeEndpoints,
            totalRecords,
            currentPageEndpoints,
            // Directory
            directory_data_full,
            currentPageDirectory,
            totalRecordsDirectory,
            pageSizeDirectory,

            // search
            searchEnpoint,
            searchDirectory,
        };
    },
});
</script>
  
<style >
.shadow-hvover {
    box-shadow: 5px 6px 10px -9px rgba(0, 0, 0, .3);
}

.demo-tabs .el-tabs__item {
    min-height: 33.60% !important;
}

.demo-tabs2 .el-tabs__item {
    min-height: 25.25% !important;
}

.padding-tabs .el-tabs__item {
    padding: 0 10px !important;
    border-top: 1px solid #ccc !important;
}

.padding-tabs .el-tabs__item.is-active {
    border-bottom-color: #f5f7fa !important;
}

.demo-tabs3 .el-tabs__item {
    min-height: 50.20% !important;
}

.demo-tabs3 .el-tabs__content,
.demo-tabs2 .el-tabs__content,
.demo-tabs .el-tabs__content {
    padding: 0px !important;
}

.demo-tabs2 .el-tabs__nav,
.demo-tabs3 .el-tabs__nav,
.demo-tabs .el-tabs__nav {
    height: 100%;
}

.my-custom-table td.el-table__cell {
    border-bottom-style: dashed !important;
}

/* // Small devices (landscape phones, 576px and up) */
@media (max-width: 576px) {
    .position-sm-top {
        position: unset !important;
        margin-bottom: 5px;
    }

    .position-repository {
        background-color: white;
        padding: 10px 5px;
        display: block;
    }

    .height-repository {
        height: 645px;
    }
}

/* // Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
    .position-sm-top {
        top: -40px;
    }

    .height-repository {
        height: 700px;
    }
}

/* // Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
    .position-sm-top {
        top: -40px;
    }

    .height-repository {
        height: 730px;
    }
}

@media (min-width: 992px) {
    .position-sm-top {
        top: -60px;
    }

    .height-repository {
        height: 700px;
    }
}
</style>
  