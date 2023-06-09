<template>
    <!--begin::Navbar-->
    <div class="card mb-3">
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

                    <button v-if="scanStatus != 5" type="button" @click="handlePauser"
                        :disabled="(checkDisabled || scanStatus == 3)"
                        class="btn btn-sm btn-outline btn-outline-dashed fw-bold bg-body btn-color-gray-700 btn-active-color-danger  ms-2">
                        <KTIcon icon-name="bi bi-pause-fill text-danger" icon-class="fs-2 " />
                        <span class="text-danger">Tạm dừng</span>
                    </button>
                    <button v-else type="button" @click="handlePauser" :disabled="(checkDisabled)"
                        class="btn btn-sm btn-outline btn-outline-dashed fw-bold bg-body btn-color-gray-700 btn-active-color-primary  ms-2">
                        <KTIcon icon-name="bi bi-play-fill text-primary" icon-class="fs-2 " />
                        <span class="text-primary"> Tiếp tục</span>
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
        <div class="row px-2 h-50px align-items-center ">
            <div class="col-8 py-2 d-flex justify-content-start ">
                <div class="row">

                </div>
            </div>
            <div class="col-4 text-end ms-auto py-2">
                <div class="d-flex justify-content-end">

                    <!--begin::Select-->
                    <button type="button" @click="reloadData" :disabled="checkDisabled"
                        class="btn btn-sm w-100px h-35px fw-bold bg-primary btn-color-gray-700 btn-active-color-primary me-2 py-1 text-white">
                        <KTIcon icon-name="arrows-loop" icon-class="fs-2 text-white" />
                        Tải lại
                    </button>
                    <!--end::Select-->

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
            </div>
        </div>
    </div>
    <!--end::Navbar-->


    <!--begin::Card-->
    <div class="">
        <el-scrollbar height="700px" class="w-100">
            <el-row :gutter="10">
                <el-col :span="8" class="mb-3">
                    <el-card shadow="hover" class="box-card rounded-3 h-100" :body-style="{ padding: '20px 5px' }">
                        <reconActivity :activitieLine="activities" :activity="activity" chartHeight="300"
                            :process="process"></reconActivity>
                    </el-card>
                </el-col>
                <el-col :span="16" class="d-grid">
                    <el-row :gutter="10">
                        <el-col :span="6" class="mb-3">
                            <el-card shadow="hover" class="box-card rounded-3 h-100" :body-style="{ padding: '20px 10px' }">
                                <!--begin::Label-->
                                <div class="fs-7 text-muted fw-semobold">Subdomains</div>
                                <!--end::Label-->
                                <!--begin::Stat-->
                                <div class="d-flex align-items-center">
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
                        <el-col :span="6" class="mb-3">
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
                        <el-col :span="6" class="mb-3">
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
                        <el-col :span="6" class="mb-3">
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
                    <el-row :gutter="10" class="">
                        <el-col :span="12" class="mb-3">
                            <el-card shadow="hover" class="box-card rounded-3 h-100 "
                                :body-style="{ padding: '0', height: 'calc(100% - 56px)' }">
                                <template #header>
                                    <div class="card-header">
                                        <span>Thông tin về Domain</span>
                                    </div>
                                </template>
                                <div class="h-100">
                                    <el-tabs model-value tab-position="left" type="border-card" :stretch="true"
                                        class="demo-tabs border border-0 h-100" :lazy="true">
                                        <template v-if="domain_info_status == 3">
                                            <el-tab-pane v-for="(items, index) in domain_info" :key="index" :label="index"
                                                class="">
                                                <template #label>
                                                    <span class="custom-tabs-label">
                                                        <span>{{ index }}</span>
                                                    </span>
                                                </template>
                                                <div class="">
                                                    <!--begin::Table container-->
                                                    <!-- <div class="w-100">
                                                    <el-table :data="items" height="400" style="width: 100%"
                                                        class-name="my-custom-table">
                                                        <el-table-column :show-header="false"
                                                            label-class-name="border border-0 m-0 p-0"
                                                            prop="name" width="80" />
                                                        <el-table-column :show-header="false"
                                                            label-class-name="border border-0 m-0 p-0"
                                                            prop="address" />
                                                    </el-table>
                                                </div> -->
                                                    <!--end::Table container-->

                                                    <!--begin::Table container-->
                                                    <div class="table-responsive w-100 h-500px">
                                                        <!--begin::Table-->
                                                        <table class="table table-row-dashed table-row-gray-300 ">
                                                            <!--begin::Table head-->
                                                            <!-- <thead>
                                                        <tr class="border-0">
                                                            <th class="p-0"></th>
                                                            <th class="p-0 min-w-150px"></th>
                                                            <th class="p-0 min-w-200px"></th>
                                                            <th class="p-0 min-w-150px"></th>
                                                            <th class="p-0 min-w-100px text-end"></th>
                                                        </tr>
                                                        </thead> -->
                                                            <!--end::Table head-->

                                                            <!--begin::Table body-->
                                                            <tbody class="overflow-y-auto w-100">
                                                                <tr v-for="(item, key) in items" :key="key">
                                                                    <td class="text-start"><span>{{ key }}</span></td>
                                                                    <td class="text-start">
                                                                        <template v-if="checkArray(item) == true">
                                                                            <template v-for="el in item">
                                                                                <span
                                                                                    class="badge badge-light-primary me-2">{{
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
                                                </div>
                                            </el-tab-pane>
                                        </template>
                                        <template v-else-if="domain_info_status == 4">
                                            <div class="my-9 mx-5 ">
                                                <div class="text-center mb-3">
                                                    <KTIcon icon-name="information-3" icon-class="fs-3x text-warning" />
                                                </div>
                                                <div class="" v-html="linkCheck"></div>
                                            </div>
                                        </template>
                                        <template v-else>
                                            <div class="mt-5 me-3">
                                                <el-skeleton :rows="7" animated />
                                            </div>
                                        </template>
                                    </el-tabs>
                                </div>
                            </el-card>
                        </el-col>
                        <el-col :span="12" class="mb-3">
                            <el-card shadow="hover" class="box-card rounded-3 h-100 "
                                :body-style="{ padding: '0', height: 'calc(100% - 56px)' }">
                                <template #header>
                                    <div class="card-header">
                                        <span>Thông tin về IP</span>
                                    </div>
                                </template>
                                <div class="h-100">
                                    <el-tabs tab-position="left" type="border-card" :stretch="true"
                                        class="demo-tabs border border-0 h-100" :lazy="true">
                                        <template v-if="ip_info_status == 3">
                                            <el-tab-pane v-for="(items, index) in ip_info" :key="index" :label="index"
                                                class="">
                                                <template #label>
                                                    <span class="custom-tabs-label">
                                                        <span>{{ index }}</span>
                                                    </span>
                                                </template>
                                                <div class="">
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
                                                                    <td v-if="checkArray(item) == true" class="text-start">
                                                                        <div class="d-flex flex-column">
                                                                            <template v-for="(el, i) in item" :key="i">
                                                                                <template v-if="checkArray(el) == true">
                                                                                    <li v-for="(e, j) in el" :key="j"
                                                                                        class="d-flex align-items-center py-2">
                                                                                        <template
                                                                                            v-if="checkArray(e) == true">
                                                                                            <span
                                                                                                class="bullet bullet-dot bg-success me-5"></span>
                                                                                            <div
                                                                                                class="d-flex align-items-start">
                                                                                                <span>{{ j }} : </span>
                                                                                                <div>
                                                                                                    <span v-for="q in e"
                                                                                                        :key="q"
                                                                                                        class="badge badge-light-primary ms-2">
                                                                                                        {{ (q == '' || q ==
                                                                                                            null) ? 'None...' :
                                                                                                            q }}
                                                                                                    </span>
                                                                                                </div>
                                                                                            </div>
                                                                                        </template>
                                                                                        <template v-else>
                                                                                            <span
                                                                                                class="bullet bullet-dot bg-success me-5"></span>
                                                                                            {{ j }} : {{ (e == '' || e ==
                                                                                                null)
                                                                                                ? 'None...' : e }}
                                                                                        </template>
                                                                                    </li>
                                                                                </template>
                                                                                <template v-else>
                                                                                    <li
                                                                                        class="d-flex align-items-center py-2">
                                                                                        <span
                                                                                            class="bullet bullet-dot bg-success me-5"></span>
                                                                                        {{ i }} : {{ (el == '' || el ==
                                                                                            null) ?
                                                                                            'None...' : el }}
                                                                                    </li>
                                                                                </template>
                                                                            </template>
                                                                        </div>
                                                                    </td>
                                                                    <td v-else class="text-start">
                                                                        <span>{{ (item == '' || item == null) ? 'None...' :
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
                                                </div>
                                            </el-tab-pane>
                                        </template>
                                        <template v-else-if="ip_info_status == 4">
                                            <div class="my-9 mx-5 ">
                                                <div class="text-center mb-3">
                                                    <KTIcon icon-name="information-3" icon-class="fs-3x text-warning" />
                                                </div>
                                                <div class="" v-html="linkCheck"></div>
                                            </div>
                                        </template>
                                        <template v-else>
                                            <div class="mt-5 me-3">
                                                <el-skeleton :rows="7" animated />
                                            </div>
                                        </template>
                                    </el-tabs>
                                </div>
                            </el-card>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="8" class="mb-3">
                    <el-card shadow="hover" class="box-card rounded-3 h-100" :body-style="{ padding: '10px' }">
                        <template #header>
                            <div class="card-header">
                                <span>Cổng Dịch vụ</span>
                            </div>
                        </template>
                        <div class="h-450px py-5">
                            <template v-if="port_service_status == 3">
                                <span v-for="item in port_service" :key="item"
                                    class="badge badge-light-primary fs-7 me-2 my-1">{{ item }}</span>
                            </template>
                            <template v-else-if="port_service_status == 4">
                                <div class="my-9 mx-5 ">
                                    <div class="text-center mb-3">
                                        <KTIcon icon-name="information-3" icon-class="fs-3x text-warning" />
                                    </div>
                                    <div class="" v-html="port_service"></div>
                                </div>
                            </template>
                            <template v-else>
                                <div class="mt-5 me-3">
                                    <el-skeleton :rows="7" animated />
                                </div>
                            </template>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="8" class="mb-3 ">
                    <el-card shadow="hover" class="box-card rounded-3 h-100" :body-style="{ padding: '0px' }">
                        <template #header>
                            <div class="card-header">
                                <span>Email liên quan</span>
                            </div>
                        </template>
                        <div class="h-450px">
                            <template v-if="related_email_status == 3">
                                <!--begin::Table container-->
                                <div class="table-responsive w-100 h-450px p-3">
                                    <!--begin::Table-->
                                    <table class="table table-row-dashed table-row-gray-300">
                                        <!--begin::Table head-->
                                        <thead>
                                            <tr class="border-0  fw-bold text-gray-600 align-middle py-2 px-0">
                                                <th class="p-0 text-start">Tên miền</th>
                                                <th class="p-0 text-start">Giao thức</th>
                                                <th class="p-0 text-end">Cùng dải mạng?</th>
                                            </tr>
                                        </thead>
                                        <!--end::Table head-->

                                        <!--begin::Table body-->
                                        <tbody class="overflow-y-auto w-100 ">
                                            <tr v-for="(item, key) in related_email" :key="key">
                                                <td class="text-start"><span>
                                                        <span>{{ (item.email == '') ? '--' : item.email }}</span>
                                                    </span></td>
                                                <td class="text-start">
                                                    <span>{{ (item.password_crack == '') ? '--' : item.password_crack
                                                    }}</span>
                                                </td>
                                                <td class="text-end">
                                                    <span>{{ (item.password_hash == '') ? '--' : item.password_hash
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
                            <template v-else-if="port_service_status == 4">
                                <div class="my-9 mx-5 ">
                                    <div class="text-center mb-3">
                                        <KTIcon icon-name="information-3" icon-class="fs-3x text-warning" />
                                    </div>
                                    <div class="" v-html="related_email"></div>
                                </div>
                            </template>
                            <template v-else>
                                <div class="mt-5 me-3">
                                    <el-skeleton :rows="7" animated />
                                </div>
                            </template>
                        </div>
                    </el-card>
                </el-col>

                <el-col :span="8" class="mb-3 ">
                    <el-card shadow="hover" class="box-card rounded-3 h-100" :body-style="{ padding: '0px' }">
                        <template #header>
                            <div class="card-header">
                                <span>Tên miền liên quan đến mục tiêu</span>
                            </div>
                        </template>
                        <div class="h-450px">
                            <template v-if="related_domain_status == 3">
                                <!--begin::Table container-->
                                <div class="table-responsive w-100 h-450px p-3">
                                    <!--begin::Table-->
                                    <table class="table table-row-dashed table-row-gray-300">
                                        <!--begin::Table head-->
                                        <thead>
                                            <tr class="border-0  fw-bold text-gray-600 align-middle py-2 px-0">
                                                <th class="p-0 text-start">Tên miền</th>
                                                <th class="p-0 text-start">Giao thức</th>
                                                <th class="p-0 text-end">Cùng dải mạng?</th>
                                            </tr>
                                        </thead>
                                        <!--end::Table head-->

                                        <!--begin::Table body-->
                                        <tbody class="overflow-y-auto w-100 ">
                                            <tr v-for="(item, key) in related_domain" :key="key">
                                                <td class="text-start"><span>{{ key }}</span></td>
                                                <td class="text-start">
                                                    <span>{{ (item.type == '') ? '--' : item.type }}</span>
                                                </td>
                                                <td class="text-end">
                                                    <span>{{ (item.status == '') ? '--' : item.status }}</span>
                                                </td>
                                            </tr>
                                        </tbody>
                                        <!--end::Table body-->
                                    </table>
                                    <!--end::Table-->
                                </div>
                                <!--end::Table container-->
                            </template>
                            <template v-else-if="port_service_status == 4">
                                <div class="my-9 mx-5 ">
                                    <div class="text-center mb-3">
                                        <KTIcon icon-name="information-3" icon-class="fs-3x text-warning" />
                                    </div>
                                    <div class="" v-html="related_domain"></div>
                                </div>
                            </template>
                            <template v-else>
                                <div class="mt-5 me-3">
                                    <el-skeleton :rows="7" animated />
                                </div>
                            </template>
                        </div>
                    </el-card>
                </el-col>

                <el-col :span="8" class="mb-3 ">
                    <el-card shadow="hover" class="box-card rounded-3 h-100" :body-style="{ padding: '10px' }">
                        <template #header>
                            <div class="card-header">
                                <span>Công nghệ sử dụng</span>
                            </div>
                        </template>
                        <div class="h-450px">
                            <template v-if="technology_status == 3">
                                <span v-for="item in technology" :key="item"
                                    class="badge badge-light-primary fs-7 me-2 my-1">{{ item }}</span>
                            </template>
                            <template v-else-if="port_service_status == 4">
                                <div class="my-9 mx-5 ">
                                    <div class="text-center mb-3">
                                        <KTIcon icon-name="information-3" icon-class="fs-3x text-warning" />
                                    </div>
                                    <div class="" v-html="technology"></div>
                                </div>
                            </template>
                            <template v-else>
                                <div class="mt-5 me-3">
                                    <el-skeleton :rows="7" animated />
                                </div>
                            </template>
                        </div>
                    </el-card>
                </el-col>

                <el-col :span="8" class="mb-3">
                    <el-card shadow="hover" class="box-card rounded-3 h-100 "
                        :body-style="{ padding: '0', height: 'calc(100% - 56px)' }">
                        <template #header>
                            <div class="card-header">
                                <span>Thông tin về IP</span>
                            </div>
                        </template>
                        <div class="h-100">
                            <el-tabs tab-position="left" type="border-card" :stretch="true"
                                class="demo-tabs border border-0 h-100" :lazy="true">
                                <template v-if="ip_info_status == 3">
                                    <el-tab-pane v-for="(items, index) in ip_info" :key="index" :label="index" class="">
                                        <template #label>
                                            <span class="custom-tabs-label">
                                                <span>{{ index }}</span>
                                            </span>
                                        </template>
                                        <div class="">
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
                                                            <td v-if="checkArray(item) == true" class="text-start">
                                                                <div class="d-flex flex-column">
                                                                    <template v-for="(el, i) in item" :key="i">
                                                                        <template v-if="checkArray(el) == true">
                                                                            <li v-for="(e, j) in el" :key="j"
                                                                                class="d-flex align-items-center py-2">
                                                                                <template v-if="checkArray(e) == true">
                                                                                    <span
                                                                                        class="bullet bullet-dot bg-success me-5"></span>
                                                                                    <div class="d-flex align-items-start">
                                                                                        <span>{{ j }} : </span>
                                                                                        <div>
                                                                                            <span v-for="q in e" :key="q"
                                                                                                class="badge badge-light-primary ms-2">
                                                                                                {{ (q == '' || q ==
                                                                                                    null) ? 'None...' :
                                                                                                    q }}
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                </template>
                                                                                <template v-else>
                                                                                    <span
                                                                                        class="bullet bullet-dot bg-success me-5"></span>
                                                                                    {{ j }} : {{ (e == '' || e ==
                                                                                        null)
                                                                                        ? 'None...' : e }}
                                                                                </template>
                                                                            </li>
                                                                        </template>
                                                                        <template v-else>
                                                                            <li class="d-flex align-items-center py-2">
                                                                                <span
                                                                                    class="bullet bullet-dot bg-success me-5"></span>
                                                                                {{ i }} : {{ (el == '' || el ==
                                                                                    null) ?
                                                                                    'None...' : el }}
                                                                            </li>
                                                                        </template>
                                                                    </template>
                                                                </div>
                                                            </td>
                                                            <td v-else class="text-start">
                                                                <span>{{ (item == '' || item == null) ? 'None...' :
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
                                        </div>
                                    </el-tab-pane>
                                </template>
                                <template v-else-if="ip_info_status == 4">
                                    <div class="my-9 mx-5 ">
                                        <div class="text-center mb-3">
                                            <KTIcon icon-name="information-3" icon-class="fs-3x text-warning" />
                                        </div>
                                        <div class="" v-html="linkCheck"></div>
                                    </div>
                                </template>
                                <template v-else>
                                    <div class="mt-5 me-3">
                                        <el-skeleton :rows="7" animated />
                                    </div>
                                </template>
                            </el-tabs>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="8" class="mb-3">
                    <el-card shadow="hover" class="box-card rounded-3 h-100 "
                        :body-style="{ padding: '0', height: 'calc(100% - 56px)' }">
                        <template #header>
                            <div class="card-header">
                                <span>Thông tin về IP</span>
                            </div>
                        </template>
                        <div class="h-100">
                            <el-tabs tab-position="left" type="border-card" :stretch="true"
                                class="demo-tabs border border-0 h-100" :lazy="true">
                                <template v-if="ip_info_status == 3">
                                    <el-tab-pane v-for="(items, index) in ip_info" :key="index" :label="index" class="">
                                        <template #label>
                                            <span class="custom-tabs-label">
                                                <span>{{ index }}</span>
                                            </span>
                                        </template>
                                        <div class="">
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
                                                            <td v-if="checkArray(item) == true" class="text-start">
                                                                <div class="d-flex flex-column">
                                                                    <template v-for="(el, i) in item" :key="i">
                                                                        <template v-if="checkArray(el) == true">
                                                                            <li v-for="(e, j) in el" :key="j"
                                                                                class="d-flex align-items-center py-2">
                                                                                <template v-if="checkArray(e) == true">
                                                                                    <span
                                                                                        class="bullet bullet-dot bg-success me-5"></span>
                                                                                    <div class="d-flex align-items-start">
                                                                                        <span>{{ j }} : </span>
                                                                                        <div>
                                                                                            <span v-for="q in e" :key="q"
                                                                                                class="badge badge-light-primary ms-2">
                                                                                                {{ (q == '' || q ==
                                                                                                    null) ? 'None...' :
                                                                                                    q }}
                                                                                            </span>
                                                                                        </div>
                                                                                    </div>
                                                                                </template>
                                                                                <template v-else>
                                                                                    <span
                                                                                        class="bullet bullet-dot bg-success me-5"></span>
                                                                                    {{ j }} : {{ (e == '' || e ==
                                                                                        null)
                                                                                        ? 'None...' : e }}
                                                                                </template>
                                                                            </li>
                                                                        </template>
                                                                        <template v-else>
                                                                            <li class="d-flex align-items-center py-2">
                                                                                <span
                                                                                    class="bullet bullet-dot bg-success me-5"></span>
                                                                                {{ i }} : {{ (el == '' || el ==
                                                                                    null) ?
                                                                                    'None...' : el }}
                                                                            </li>
                                                                        </template>
                                                                    </template>
                                                                </div>
                                                            </td>
                                                            <td v-else class="text-start">
                                                                <span>{{ (item == '' || item == null) ? 'None...' :
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
                                        </div>
                                    </el-tab-pane>
                                </template>
                                <template v-else-if="ip_info_status == 4">
                                    <div class="my-9 mx-5 ">
                                        <div class="text-center mb-3">
                                            <KTIcon icon-name="information-3" icon-class="fs-3x text-warning" />
                                        </div>
                                        <div class="" v-html="linkCheck"></div>
                                    </div>
                                </template>
                                <template v-else>
                                    <div class="mt-5 me-3">
                                        <el-skeleton :rows="7" animated />
                                    </div>
                                </template>
                            </el-tabs>
                        </div>
                    </el-card>
                </el-col>
                <el-col :span="24" class="mb-3 ">
                    <el-card shadow="hover" class="box-card rounded-3 h-100" :body-style="{ padding: '0px' }">
                        <template #header>
                            <div class="card-header">
                                <span>Subdomain</span>
                            </div>
                        </template>
                        <div class="h-450px">
                            <template v-if="related_email_status == 3">
                                <el-table :data="subdomain_result" height="450" style="width: 100%"
                                    class-name="my-custom-table">
                                    <el-table-column label-class-name="border border-0 fs-7" prop="name" label="Subdomain">
                                        <template #default="scope">
                                            <span class="fs-7 fst-normal">
                                                {{ (scope.row.name == '') ? '--' : scope.row.name }}</span> </template>
                                    </el-table-column>
                                    <el-table-column label-class-name="border border-0 fs-7" prop="enpoint" align="center"
                                        label="Endpoints">
                                        <template #default="scope">
                                            <span class="fs-7 fst-normal">
                                                {{ (scope.row.enpoint == '') ? '--' : scope.row.enpoint }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label-class-name="border border-0 fs-7" prop="" label="Directory"
                                        align="center">
                                        <template #default="scope">
                                            <span class="fs-7 fst-normal">{{ 'chưa có' }}</span>
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
                                                {{ (scope.row.status == '') ? '--' : scope.row.status }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label-class-name="border border-0 fs-7" prop="ip" label="IP"
                                        align="center">
                                        <template #default="scope">
                                            <span class="fs-7 fst-normal">
                                                {{ (scope.row.ip == '') ? '--' : scope.row.ip }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label-class-name="border border-0 fs-7" prop="" label="Cổng dịch vụ"
                                        align="center">
                                        <template #default="scope">
                                            <span class="fs-7 fst-normal">{{ 'chưa có' }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label-class-name="border border-0 fs-7" prop="" align="center"
                                        label="Công nghệ sử dụng">
                                        <template #default="scope">
                                            <span class="fs-7 fst-normal">{{ 'chưa có' }}</span>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label-class-name="border border-0 fs-7" prop="dns_record" align="left"
                                        label="Bản ghi DNS" min-width="150">
                                        <template #default="scope">
                                            <template v-if="Object.keys(scope.row.dns_record).length === 0">
                                                <span>--</span>
                                            </template>
                                            <template v-else>
                                                <template v-for="(items, index) in scope.row.dns_record" :key="index">
                                                    <li class="d-flex align-items-start">
                                                        <span class="bullet bullet-dot bg-success me-3 mt-3"></span>
                                                        <div> <span class="fw-bold text-capitalize">{{ index }}: </span>
                                                            <span class="fst-normal fs-7">{{ items.join(' , ') }}</span>
                                                        </div>
                                                    </li>
                                                    <!-- <div :class="(index == scope.row.dns_record.length - 1 ) ? '312' : '123'" class="separator separator-dotted border-secondary my-1"></div> -->
                                                </template>
                                            </template>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </template>
                            <template v-else-if="port_service_status == 4">
                                <div class="my-9 mx-5 ">
                                    <div class="text-center mb-3">
                                        <KTIcon icon-name="information-3" icon-class="fs-3x text-warning" />
                                    </div>
                                    <div class="" v-html="related_email"></div>
                                </div>
                            </template>
                            <template v-else>
                                <div class="mt-5 me-3">
                                    <el-skeleton :rows="7" animated />
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
    <el-dialog v-model="fileDownVisible" title="Xác nhận xuất file">
        <div class="card h-100 bg-secondary ">
            <!--begin::Card body-->
            <div class="card-body d-flex justify-content-center text-center flex-column p-8">
                <!--begin::Name-->
                <div class="symbol symbol-60px mb-5">
                    <KTIcon class="me-1" icon-name="document" icon-class="fs-4x text-success" />
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
import { defineComponent, ref, onMounted, watch, onBeforeUnmount } from "vue";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import ApiService from "@/core/services/ApiService";
import filtersTabScan from "@/views/apps/targets/filtersTabScan.vue";
import CodeHighlighter from "@/components/highlighters/CodeHighlighter.vue";
import { useRoute } from 'vue-router';
import { debounce } from 'vue-debounce'
import { ElMessage } from 'element-plus'
import reconActivity from "@/views/apps/targets/reconWidgets/reconActivity.vue";
import dataRecon from "@/views/apps/targets/reconData.json";

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
        const list = ref<getData | any>()
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
        const scanStatus = ref<number>(0)
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

        const handleClick = (data: object | any, type: String) => {
            apiData.value.description = data.description;
        };

        const getData = async () => {
            loading.value = true;
            setTimeout(() => loading.value = false, 500)
            list.value = dataRecon
            account.value = dataRecon.recon[0].account
            services.value = dataRecon.recon[0].services
            subdomain.value = dataRecon.recon[0].subdomain
            endpoint.value = dataRecon.recon[0].endpoint

            // tiến trình
            activity.value = dataRecon.recon[0].activity
            const totalCount = (activity.value.total_finish / (activity.value.total_finish + activity.value.total_not_done)) * 100;
            process.value = [parseFloat(totalCount.toFixed(1))]
            activities.value = (dataRecon.recon[0].activity !== undefined) ? dataRecon.recon[0].activity.task_done : {}
            // if (totalCount == 100) {
            // } else {
            //     activities.value = { ...activities.value, load: 'Đang chạy...' }
            // }

            // domain
            domain_info.value = (dataRecon.recon[0].domain_info !== undefined) ? dataRecon.recon[0].domain_info.message : {};
            domain_info_status.value = (dataRecon.recon[0].domain_info !== undefined) ? dataRecon.recon[0].domain_info.status : {};
            checkLink(domain_info.value)
            // domain
            ip_info.value = (dataRecon.recon[0].ip_info !== undefined) ? dataRecon.recon[0].ip_info.message : {};
            ip_info_status.value = (dataRecon.recon[0].ip_info !== undefined) ? dataRecon.recon[0].ip_info.status : {};

            // port_service
            port_service.value = (dataRecon.recon[0].port_service !== undefined) ? dataRecon.recon[0].port_service.message : {};
            port_service_status.value = (dataRecon.recon[0].port_service !== undefined) ? dataRecon.recon[0].port_service.status : {};

            // related_email
            related_email.value = (dataRecon.recon[0].related_email !== undefined) ? dataRecon.recon[0].related_email.message : {};
            related_email_status.value = (dataRecon.recon[0].related_email !== undefined) ? dataRecon.recon[0].related_email.status : {};

            // related_domain
            related_domain.value = (dataRecon.recon[0].related_domain !== undefined) ? dataRecon.recon[0].related_domain.message : {};
            related_domain_status.value = (dataRecon.recon[0].related_domain !== undefined) ? dataRecon.recon[0].related_domain.status : {};

            // metadata
            metadata.value = (dataRecon.recon[0].metadata !== undefined) ? dataRecon.recon[0].metadata.message : {};
            metadata_status.value = (dataRecon.recon[0].metadata !== undefined) ? dataRecon.recon[0].metadata.status : {};

            // technology
            technology.value = (dataRecon.recon[0].technology !== undefined) ? dataRecon.recon[0].technology.message : {};
            technology_status.value = (dataRecon.recon[0].technology !== undefined) ? dataRecon.recon[0].technology.status : {};

            // subdomain_result
            subdomain_result.value = dataRecon.recon[0].subdomain_result

            console.log(list.value)
            console.log(related_domain.value)

            // return ApiService.get(`/scan/detail/${scanID.value}`)
            //     .then(({ data }) => {
            //         list.value = data.vulnerabilities;
            //         // severity
            //         severityInfo.value = data.severity_counts.info
            //         severityLow.value = data.severity_counts.low
            //         severityHigh.value = data.severity_counts.high
            //         severityMedium.value = data.severity_counts.medium

            //         // check
            //         progress.value = data.progress
            //         timeStart.value = data.scan_started_at
            //         timeEnd.value = data.scan_finished_at
            //         checkStatus.value = (data.scan_status == 3) ? true : false
            //         scanStatus.value = data.scan_status
            //         humanDiffTime()
            //         showLocaleTime()
            //         // console.log(countRequest.value)
            //         // console.log(averageResponseTime.value)
            //         // console.log(locations.value)
            //         // console.log(maxResponseTime.value)
            //         // console.log(data)
            //         // console.log(new Date(timeEnd.value))
            //         // console.log(new Date(timeStart.value))
            //     })
            //     .catch(({ response }) => {
            //         notification(response.data.detail, 'error', 'Có lỗi xảy ra')
            //     });
        }


        // const notification = (values: string, icon: string, more: string) => {
        //     Swal.fire({
        //         text: values ?? more,
        //         icon: icon,
        //         buttonsStyling: false,
        //         confirmButtonText: "Ok, got it!",
        //         heightAuto: false,
        //         customClass: {
        //             confirmButton: "btn btn-primary",
        //         },
        //     }).then(() => {
        //         // hideModal(ModalDelete.value);
        //         // hideModal( ModalConfirm.value);
        //     });
        // };

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
            checkPauser.value = !checkPauser.value
            checkDisabled.value = true
            setTimeout(() => {
                checkDisabled.value = false;
            }, 500);
            if (checkStatus.value) {
                ElMessage({
                    message: 'Danh dách đã được quét thành công không thể tạm dừng',
                    type: 'success',
                    center: false,
                })
            } else if (scanStatus.value == 5) {
                // console.log('tiếp tục')
                getResume()
            } else {
                // console.log('tạm dừng')
                getPauser()
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
            if (checkStatus.value || !checkPauser.value) {
                clearInterval(timeAuto.value);
                humanDiff();
            } else {
                clearInterval(timeAuto.value);
                timeAuto.value = setInterval(() => { humanDiff(); }, 1000);
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

        // tính thời gian
        const diffTime = ref<string | any>(0);
        const time = ref<any>(null);
        const eventTime = ref<number | any>('30000');

        const humanDiff = async () => {
            let date1: any = (checkStatus.value == false) ? new Date() : new Date(timeEnd.value);
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
            if (checkStatus.value || !checkPauser.value) {
                clearInterval(time.value);

                humanDiff();
            } else {
                clearInterval(time.value);
                humanDiff();
                time.value = setInterval(() => { getData(); humanDiff(); }, eventTime.value);
            }
        };
        watch(eventTime, humanDiffTime);

        onMounted(() => {
            getData();
            humanDiffTime();
        });

        onBeforeUnmount(() => {
            clearInterval(timeAuto);
            clearInterval(time);
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
        const linkCheck = ref<string>('')

        const checkLink = (data: any) => {
            linkCheck.value = data.replace(/(http:\/\/\S+)/, '<a href="$1" target="_blank">$1</a>');
        };
        const countSTT = ref(1)
        const info = ref('info')

        return {
            activities,
            scanID,
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
            scanStatus,

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
            checkLink,
            linkCheck,
            countSTT,
            related_domain_status,
            related_domain,
            related_email_status,
            related_email,
            port_service_status,
            port_service,
            info,
            technology,
            metadata,
            technology_status,
            metadata_status,
            subdomain_result,
        };
    },
});
</script>
  
<style>
.shadow-hvover {
    box-shadow: 5px 6px 10px -9px rgba(0, 0, 0, .3);
}

.demo-tabs .el-tabs__item {
    min-height: 100px !important;
    padding: 0 10px !important;
}

.demo-tabs .el-tabs__content {
    padding: 0px !important;
}
.demo-tabs .el-tabs__nav{
    justify-content: space-between;
    height: 100%;
}

/* .my-custom-table .cell {
    padding: 10px !important;
} */

.my-custom-table td.el-table__cell {
    border-bottom-style: dashed !important;
}
</style>
  