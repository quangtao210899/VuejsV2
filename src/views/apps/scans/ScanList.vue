<template>
  <KTToolbar :check-search="true" @handle-search="handleFilter" @filert-authen="handleFilterAuthen"
    @filert-severity="handleFilterSeverity" v-model:idsDelete="selectedIds" :check-status="true"
    @filert-status="handleFilterStatus" @handle-delete-selectd="deleteSubscription" :disabled="disabled"
    @on-header-height="onheaderHeight" :selected-name="selectedName" title="lỗ hổng"></KTToolbar>

  <!--begin::Card-->
  <div class="app-container container-fluid" :style="{ marginTop: headerHeight + 'px' }">
    <div class="card h-10 d-block">
      <div class="d-flex px-5">
        <!--begin::Card body-->
        <div class="overflow-auto h-100 pt-1" ref="container" @mousedown="handleMouseDown"
          :style="classDetail ? { width: leftWidth + 'px' } : { width: '100%' }">
          <div class="w-100">
            <el-table ref="multipleTableRef" :data="list" style="width: 100%;z-index: 1;"
              class-name=" my-custom-table rounded-top cursor-pointer" table-layout="fixed" v-loading="loading"
              element-loading-text="Đang Tải..." element-loading-background="rgb(255 255 255 / 25%)"
              @selection-change="handleSelectionChange" highlight-current-row :row-key="getRowKey"
              @row-click="customRowTable">
              <template #empty>
                <div class="flex items-center justify-center h-100%">
                  <el-empty description="Không có dữ liệu nào" />
                </div>
              </template>
              <el-table-column label-class-name=" fs-13px fw-bold " type="selection" width="30"
                :reserve-selection="true" />

              <el-table-column width="80" label-class-name="fs-13px fw-bold text-dark" prop="severity" align="center"
                label="MỨC ĐỘ">
                <template #default="scope">
                  <div class="text-center lh-sm">
                    <KTIcon icon-name="severity"
                      :icon-class="`bi bi-bug-fill fs-2 text-${getSeverity(scope.row.severity).color}`" />
                    <br>
                    <p :class="`fst-normal my-0 fs-7 text-${getSeverity(scope.row.severity).color}`">
                      {{ getSeverity(scope.row.severity).title }}</p>
                  </div>
                </template>
              </el-table-column>

              <el-table-column width="90" label-class-name="fs-13px fw-bold text-dark" prop="flag" align="center"
                label="CONFIRM">
                <template #default="scope">
                  <i class=" fs-2 fa-flag" :class="(scope.row.flag == true) ? 'fa-solid text-warning' : 'fa-regular'"></i>
                </template>
              </el-table-column>

              <el-table-column label-class-name="fs-13px fw-bold text-dark" min-width="190" prop="vt_name" label="TÊN">
                <template #default="scope">
                  <span v-if="scope.row.vt_name != '' || scope.row.port_scan.vt_name != ''"
                    class="fs-13px text-gray-700 text-hover-primary">
                    {{ scope.row.vt_name ?? scope.row.port_scan.vt_name }}</span>
                  <span v-else class="badge badge-light-danger">--</span>
                </template>
              </el-table-column>
              <el-table-column min-width="150" label-class-name="fs-13px text-dark fw-bold" prop="hostname"
                label="HOST NAME">
                <template #default="scope">
                  <span v-if="scope.row.hostname != '' || scope.row.port_scan.hostname != ''"
                    class="fs-13px text-gray-700 text-hover-primary">
                    <i class="fa-solid fa-link fs-8"></i>
                    {{ scope.row.hostname }}</span>
                  <span v-else class="badge badge-light-danger">--</span>
                </template>
              </el-table-column>
              <el-table-column min-width="130" label-class-name="fs-13px text-dark fw-bold" prop="ip" label="IP">
                <template #default="scope">
                  <span v-if="scope.row.ip != ''" class="fs-13px text-gray-700 text-hover-primary d-block">
                    {{ scope.row.ip }}</span>
                  <span v-else class="badge badge-light-danger">--</span>
                </template>
              </el-table-column>
              <el-table-column min-width="80" label-class-name="fs-13px text-dark fw-bold" prop="schema" label="SERVICE">
                <template #default="scope">
                  <span v-if="scope.row.schema != '' || scope.row.port_scan['type'] != ''"
                    class="fs-13px px-4 py-3 badge badge-light-primary">
                    {{ scope.row.schema ?? (scope.row.nmap_scan ?
                      scope.row.port_scan["service"] : scope.row.port_scan['type']) }}</span>
                  <span v-else class="badge badge-light-danger">--</span>
                </template>
              </el-table-column>
              <el-table-column min-width="180" label-class-name="fs-13px text-dark fw-bold" prop="last_seen"
                label="NGÀY TẠO">
                <template #default="scope">
                  <template v-if="scope.row.last_seen != ''">
                    <span
                      class="fs-13px text-gray-700 text-hover-primary d-flex justify-content-start align-items-center">
                      <KTIcon class="me-1" icon-name="calendar" icon-class="fs-3" />
                      {{ scope.row.last_seen }}
                    </span>
                  </template>
                  <template v-else>
                    <span class="badge badge-light-danger">--</span>
                  </template>
                </template>
              </el-table-column>
              <el-table-column min-width="120" label-class-name="fs-13px text-dark fw-bold" prop="status"
                label="TRẠNG THÁI">
                <template #default="scope">
                  <span v-if="scope.row.status != ''" class="badge fs-13px"
                    :class="`px-4 py-3 badge-light-${getStatus(scope.row.status).color}`">
                    {{ getStatus(scope.row.status).title }}
                  </span>
                  <span v-else class="badge badge-light-danger">--</span>
                </template>
              </el-table-column>

            </el-table>
            <div class="d-flex justify-content-between align-items-center mx-auto w-100 py-5 bg-white rounded-bottom">
              <div v-if="totalPage > 0">
                <span class="text-capitalize fs-13px">Tổng Số Lỗ Hổng: {{ totalPage }}</span>
              </div>
              <el-pagination background v-model:current-page="currentPage" :hide-on-single-page="true"
                v-model:page-size="itemsPerPage" :total="totalPage" layout="prev, pager, next"
                :disabled="disabled"></el-pagination>
              <div></div>
            </div>
          </div>
        </div>
        <!--end::Card body-->
        <div v-if="classDetail" @mousedown="startDragging" class="drag-handle position-relative border-start">
          <div class="position-absolute top-0 start-50 translate-middle-x mt-1">
          </div>
        </div>
        <!--begin::Card2 body-->
        <div class="overflow-auto  h-100 " :style="classDetail ? { width: rightWidth + 'px' } : { width: '0px' }"
          :class="classDetail ? ' d-block' : 'd-none'">
          <div class="ms-3 pb-10 affix-container">
            <div class="card-title pb-0">
              <h2 class="fw-bold pe-15 mt-5 fs-13px text-uppercase">{{ detailData.vt_name }}</h2>
              <div class="position-absolute translate-middle-y" :style="{ top: '-145px', right: '10px' }">
                <el-affix target=".affix-container" :offset="170">
                  <button @click="handleCloseDetail" type="button" class="btn zindex-fixed btn-icon "
                    :disabled="disabled">
                    <i class="fa-solid fa-xmark fs-1"></i>
                  </button>
                </el-affix>
              </div>
            </div>
            <div class="d-flex flex-wrap">
              <div class="me-2 my-1" style="width: 130px;">
                <el-select name="severity" as="select" v-model="detailData.severity"
                  :class="getSeverity(detailData.severity).class" @change="updateData()">
                  <el-option label="Info" :value="0" key="0">Info</el-option>
                  <el-option label="Low" :value="1" key="1">Low</el-option>
                  <el-option label="Medium" :value="2" key="2">Medium</el-option>
                  <el-option label="High" :value="3" key="3">High</el-option>
                </el-select>
              </div>

              <div class="me-2 my-1">
                <!-- <button class="btn btn-icon btn-sm btn-success" style="height: 32px; width: 32px;" @click="ChangeFlag(detailData.flag)" >
                  <i class="fa-solid fa-flag"></i>
                </button> -->
                <button class="btn btn-sm "
                  :class="(detailData.flag == true) ? 'btn-light-warning' : 'btn-active-light-dark'" style="height: 32px;"
                  @click="ChangeFlag(detailData.flag)">
                  <i class="fa-flag" :class="((detailData.flag == true) ? 'fa-solid' : 'fa-regular')"></i>
                  {{ (detailData.flag == true) ? 'Đã Xác Nhận' : 'Chưa Xác Nhận' }}
                </button>
              </div>

              <div class="me-2 my-1" style="width: 130px;">
                <button class="btn btn-sm btn-light-dark w-100" style="height: 32px" @click="getUplaodFile">
                  <i class="fa-solid fa-notes-medical"></i>
                  Ghi Chú
                </button>
              </div>

              <div class="my-1" style="width: 130px;">
                <el-select class="my-select-status" name="status" as="select" v-model="detailData.status"
                  :class="getStatus(detailData.status).class" @change="updateData()">
                  <el-option label="Open" value="open" key="open">Open</el-option>
                  <el-option label="Re-Open" value="re-open" key="re-open">Re-Open</el-option>
                  <el-option label="Close" value="closed" key="closed">Close</el-option>
                  <el-option label="Accepted" value="rick-accepted" key="rick-accepted">Accepted</el-option>
                </el-select>
              </div>
            </div>
            <!-- <div class="bg-light my-5 py-2 px-4 lh-lg rounded-2 me-2 fs-13px">
              <div class="row">
                <div class="col-12 col-xl-6 my-1">
                  <span class="text-black-50">IP: </span>
                  <span class="ps-1"> {{ detailData.ip }}</span>
                </div>
                <div class="col-12 col-xl-6 my-1">
                  <span class="text-black-50">Host name: </span>
                  <span class="ps-1"> {{ detailData.hostname }}</span>
                </div>
              </div>
            </div> -->
            <div class="lh-lg mt-3">
              <div class="mb-5"
                v-if="(detailData.affects_url != null && detailData.affects_url != '') || (detailData.affects_detail != null && detailData.affects_detail != '')">
                <h4 class="text-gray-800 fs-13px fw-bold cursor-pointer mb-0">Vulnerable URL</h4>
                <div v-if="detailData.affects_url != null && detailData.affects_url != ''">
                  <span class="w-100">URL: </span>
                  <span class="ps-1">
                    <a target="_blank" :href="`${detailData.affects_url}`" class="text-primary">
                      <KTIcon icon-name="link" icon-class="bi bi-link-45deg" :style="{ fontSize: '16px' }" />
                      {{ detailData.affects_url }}
                    </a>
                  </span>
                </div>
                <div v-if="detailData.affects_detail != null && detailData.affects_detail != ''">
                  <span class="w-100">Parameter: </span>
                  <span class="ps-1"> {{ detailData.affects_detail }}</span>
                </div>
              </div>

              <div class="mb-5" v-if="detailData.tags != null && detailData.tags != ''">
                <h4 class="text-gray-800 fs-13px fw-bold cursor-pointer mb-0">CVE/CWE</h4>
                <div class="lh-base">
                  <template v-for="(tag, index) in detailData.tags" :key="index">
                    <li class="d-flex align-items-center py-2">
                      <span class="bullet bullet-vertical bg-success me-3"></span> {{ tag }}
                    </li>
                  </template>
                </div>
              </div>

              <div class="mb-5" v-if="detailData.cvss_score != null && detailData.cvss_score != ''">
                <h4 class="text-gray-800 fs-13px fw-bold cursor-pointer mb-0">CVSS Score</h4>
                <div>
                  <li class="d-flex align-items-center py-2">
                    <span class="bullet bg-warning me-5"></span>
                    <span>Base Score:<strong class="ps-2"> {{ detailData.cvss_score }}</strong></span>
                  </li>
                </div>
              </div>

              <div class="mb-5" v-if="detailData.details != null && detailData.details != ''">
                <h4 class="text-gray-800 fs-13px fw-bold cursor-pointer mb-0">Attack Details</h4>
                <div>
                  <div class="ps-1" v-html="detailData.details.replace(/<br\s*\/?>/g, '')"></div>
                </div>
              </div>

              <div class="mb-5" v-if="detailData.in_cpe != null && detailData.in_cpe != ''">
                <div class="d-flex align-items-end ">
                  <h4 class="text-gray-800 fs-13px lh-lg fs-13px fw-bold m-0 pe-2">In CPE: </h4>
                  <span> {{ detailData.in_cpe }}</span>
                </div>
              </div>

              <div class="mb-5" v-if="detailData.protocol != null && detailData.protocol != ''">
                <div class="d-flex align-items-end ">
                  <h4 class="text-gray-800 fs-13px lh-lg fs-13px fw-bold m-0 pe-2">Protocol: </h4>
                  <span> {{ detailData.protocol }}</span>
                </div>
              </div>

              <div class="mb-5" v-if="detailData.service != null && detailData.service != ''">
                <div class="d-flex align-items-end ">
                  <h4 class="text-gray-800 fs-13px lh-lg fs-13px fw-bold m-0 pe-2">Service: </h4>
                  <span> {{ detailData.service }}</span>
                </div>
              </div>

              <div class="mb-5" v-if="detailData.port != null && detailData.port != ''">
                <div class="d-flex align-items-end">
                  <h4 class="text-gray-800 fs-13px lh-lg fs-13px fw-bold m-0 pe-2">Port: </h4>
                  <span> {{ detailData.port }}</span>
                </div>
              </div>

              <div class="mb-5" v-if="detailData.type != null && detailData.type != ''">
                <div class="d-flex align-items-end ">
                  <h4 class="text-gray-800 fs-13px lh-lg fs-13px fw-bold m-0 pe-2">Service: </h4>
                  <span> {{ detailData.type }}</span>
                </div>
              </div>

              <div class="mb-5" v-if="detailData.url != null && detailData.url != ''">
                <div class="d-flex align-items-end ">
                  <h4 class="text-gray-800 fs-13px lh-lg fs-13px fw-bold m-0 pe-2">URL: </h4>
                  <span> {{ detailData.url }}</span>
                </div>
              </div>

              <div class="mb-5" v-if="detailData.reference != null && detailData.reference != ''">
                <h4 class="text-gray-800 fs-13px fw-bold cursor-pointer mb-0">References</h4>
                <div class="lh-base">
                  <template v-for="(tag, index) in detailData.reference" :key="index">
                    <li class="d-flex align-items-center py-2 text-primary">
                      <span class="bullet bullet-vertical bg-primary me-5"></span> {{ tag }}
                    </li>
                  </template>
                </div>
              </div>

              <div class="mb-5" v-if="detailData.classification != null && detailData.classification != ''">
                <h4 class="text-gray-800 fs-13px fw-bold cursor-pointer mb-0">Classification</h4>
                <div class="lh-base">
                  <template v-for="(items, index) in detailData.classification" :key="index">
                    <li class="d-flex align-items-center py-2">
                      <template v-if="items != null">
                        <template v-if="Array.isArray(items)">
                          <template v-for="(item, key) in items" :key="key">
                            <span class="bullet bullet-vertical bg-primary me-5"></span> {{ index }} : {{ item }}<br>
                          </template>
                        </template>
                        <template v-else>
                          <span class="bullet bullet-vertical bg-primary me-5"></span> {{ index }} : {{ items }}<br>
                        </template>
                      </template>
                    </li>
                  </template>
                </div>
              </div>

              <div class="mb-5" v-if="detailData.description != null && detailData.description != ''">
                <h4 class="text-gray-800 fs-13px fw-bold cursor-pointer mb-0">Description</h4>
                <div>
                  <div class="ps-1" v-html="detailData.description"></div>
                </div>
              </div>

            </div>

            <div class="">
              <div id="kt_detail_collapsible_scan">
                <div class="py-1" v-if="detailData.request != null && detailData.request != ''">
                  <div class="py-3 d-flex flex-stack flex-wrap">
                    <div class="d-flex align-items-center collapsible toggle collapsed" data-bs-toggle="collapse"
                      data-bs-target="#kt_detail_collapsible_scan_1" aria-expanded="false">
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
                      <CodeHighlighter lang="json" :data="detailData.request"></CodeHighlighter>
                    </div>
                  </div>
                </div>

                <div class="separator separator-dashed" v-if="detailData.request != null && detailData.request != ''">
                </div>

                <div class="py-1" v-if="detailData.http_response != null && detailData.http_response != ''">
                  <div class="py-3 d-flex flex-stack flex-wrap">
                    <div class="d-flex align-items-center collapsible toggle collapsed" data-bs-toggle="collapse"
                      data-bs-target="#kt_detail_collapsible_scan_2">
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
                      <CodeHighlighter lang="html" :data="detailData.http_response"></CodeHighlighter>
                    </div>
                  </div>
                </div>

                <div class="separator separator-dashed"
                  v-if="detailData.http_response != null && detailData.http_response != ''"></div>

                <div class="py-1" v-if="detailData.recommendation != null && detailData.recommendation != ''">
                  <div class="py-3 d-flex flex-stack flex-wrap">
                    <div class="d-flex align-items-center collapsible toggle collapsed" data-bs-toggle="collapse"
                      data-bs-target="#kt_detail_collapsible_scan_3">
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
                      {{ detailData.recommendation }}
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
  <!--end::Card-->

  <el-dialog v-model="notesVisible" title="Ghi Chú" width="75%" top="7vh" id="modal-detail"
    :before-close="closeNotesVisible">
    <div>
      <QuillEditor class="h-550px" theme="snow" toolbar="#my-toolbar" v-model:content="contentNote" contentType="html"
        placeholder="Thêm Ghi Chú...">
        <template #toolbar>
          <div id="my-toolbar">
            <!-- Add buttons as you would before -->
            <button type="button" class="ql-bold"></button>
            <button type="button" class="ql-italic"></button>
            <button type="button" class="ql-underline"></button>
            <button type="button" class="ql-strike"></button>
            <button type="button" class="ql-blockquote"></button>
            <button type="button" class="ql-code-block"></button>
            <button type="button" class="ql-header" value="1"></button>
            <button type="button" class="ql-header" value="2"></button>
            <button type="button" class="ql-list" value="ordered"></button>
            <button type="button" class="ql-list" value="bullet"></button>
            <button type="button" class="ql-script" value="sub"></button>
            <button type="button" class="ql-script" value="super"></button>
            <button type="button" class="ql-indent" value="-1"></button>
            <button type="button" class="ql-indent" value="+1"></button>
            <button type="button" class="ql-direction" value="rtl"></button>
            <select class="ql-size ql-picker" style="width: 120px;" name="size">
              <option value="small">Small</option>
              <option value="" selected>Normal</option>
              <option value="large">Large</option>
              <option value="huge">Huge</option>
            </select>
            <select class="ql-header ql-picker" style="width: 120px;" name="header">
              <option value="1">Heading 1</option>
              <option value="2">Heading 2</option>
              <option value="3">Heading 3</option>
              <option value="4">Heading 4</option>
              <option value="5">Heading 5</option>
              <option value="6">Heading 6</option>
              <option value="" selected>Normal</option>
            </select>
            <select class="ql-color ql-picker ql-color-picker ql-expanded" name="color">
              <option value="#000000"></option>
              <option value="#e60000"></option>
              <option value="#ff9900"></option>
              <option value="#ffff00"></option>
              <option value="#008a00"></option>
              <option value="#0066cc"></option>
              <option value="#9933ff"></option>
              <option value=""></option>
              <option value="#facccc"></option>
              <option value="#ffebcc6"></option>
              <option value="#cce8cc"></option>
              <option value="#cce0f5"></option>
              <option value="#ebd6ff"></option>
              <option value="#bbbbbb"></option>
              <option value="#f06666"></option>
              <option value="#ffc266"></option>
              <option value="#ffff66"></option>
              <option value="#66b966"></option>
              <option value="#66a3e0"></option>
              <option value="#c285ff"></option>
              <option value="#888888"></option>
              <option value="#a10000"></option>
              <option value="#b26b00"></option>
              <option value="#b2b200"></option>
              <option value="#006100"></option>
              <option value="#0047b2"></option>
              <option value="#6b24b2"></option>
              <option value="#444444"></option>
              <option value="#5c0000"></option>
              <option value="#663d00"></option>
              <option value="#666600"></option>
              <option value="#003700"></option>
              <option value="#002966"></option>
              <option value="#3d1466"></option>
            </select>
            <select class="ql-background ql-picker ql-color-picker" name="background">
              <option value="#000000"></option>
              <option value="#e60000"></option>
              <option value="#ff9900"></option>
              <option value="#ffff00"></option>
              <option value="#008a00"></option>
              <option value="#0066cc"></option>
              <option value="#9933ff"></option>
              <option value=""></option>
              <option value="#facccc"></option>
              <option value="#ffebcc6"></option>
              <option value="#cce8cc"></option>
              <option value="#cce0f5"></option>
              <option value="#ebd6ff"></option>
              <option value="#bbbbbb"></option>
              <option value="#f06666"></option>
              <option value="#ffc266"></option>
              <option value="#ffff66"></option>
              <option value="#66b966"></option>
              <option value="#66a3e0"></option>
              <option value="#c285ff"></option>
              <option value="#888888"></option>
              <option value="#a10000"></option>
              <option value="#b26b00"></option>
              <option value="#b2b200"></option>
              <option value="#006100"></option>
              <option value="#0047b2"></option>
              <option value="#6b24b2"></option>
              <option value="#444444"></option>
              <option value="#5c0000"></option>
              <option value="#663d00"></option>
              <option value="#666600"></option>
              <option value="#003700"></option>
              <option value="#002966"></option>
              <option value="#3d1466"></option>
            </select>
            <select class="ql-font ql-picker" style="width: 110px;" name="size">
              <option value="" selected>Sans Serif</option>
              <option value="serif">Serif</option>
              <option value="monospace">Monospace</option>
            </select>
            <select class="ql-align ql-picker ql-icon-picker ql-expanded">
              <option value="" selected></option>
              <option value="center"></option>
              <option value="right"></option>
              <option value="justify"></option>
            </select>
            <el-tooltip class="box-item" effect="dark" :hide-after="0" content="Gắn Link" placement="top-start">
              <button class="ql-link"></button>
            </el-tooltip>
            <el-tooltip class="box-item" effect="dark" :hide-after="0" content="Tải Ảnh" placement="top-start">
              <button class="ql-image"></button>
            </el-tooltip>
            <el-tooltip class="box-item" effect="dark" :hide-after="0" content="Tải file Lên" placement="top-start">
              <button class="ql-upload-file m-0 p-0 ">
                <el-upload ref="upload" class="ql-upload-file d-flex my-upload-dialog h-100 w-100 d-flex justify-content-center align-items-center" 
                  list-type="text" :limit="1" :on-exceed="handleExceed" :show-file-list="false" :auto-upload="false" 
                  v-model:file-list="fileDocument" :on-change="onPreviewFile">
                  <template #trigger>
                    <i class="fa-solid fa-upload p-2"></i>
                  </template>
                </el-upload>
              </button>
            </el-tooltip>
          </div>

          <!-- <span v-if="errorUploadFile[0].file.length != 0" class="text-danger fs-13px">{{ errorUploadFile[0]?.file[0] }}</span> -->
        </template>
      </QuillEditor>
      <div class="mb-2 mt-4 h-30px" >
        <div class="d-flex" v-if="fileDocument.length > 0">
          <span class="badge badge-light-success h-30px px-10 rounded-start fs-13px"
            :class="(isHovering && !isCheckDowload) ? 'cursor-pointer' : ''" @click="(isHovering && !isCheckDowload) ? downloadFile(fileDocument[0]) : ''"
            @mouseover="isHovering = true" @mouseleave="isHovering = false">
            <i v-if="isHovering && !isCheckDowload" class="fa-solid fa-download fs-13px text-success me-2 w-20px"></i>
            <i v-else class="fa-regular fa-file-lines text-success me-2 fs-13px w-20px"></i>
            {{ (fileDocument[0].name.length > 30)
              ? fileDocument[0].name.substring(0, 23) + " .... "
              + fileDocument[0].name.substring(fileDocument[0].name.length - 7)
              + "( " + formatBytes(fileDocument[0].size) + " )"
              : fileDocument[0].name }}
          </span>
          <div class="position-relative w-5px">
            <span
              class="position-absolute top-0 translate-middle badge badge-circle badge-danger h-15px w-15px cursor-pointer">
              <i class="fa-solid fa-xmark text-white p-0 m-0" @click="removeFile"></i>
            </span>
          </div>
        </div>
      </div>
      <!-- <span v-if="errorUploadFile[0].document.length != 0" class="text-danger fs-13px">{{ errorUploadFile[0].document[0] }}</span> -->
      <span v-if="errorUploadFileDetail != ''" class="text-danger fs-13px">{{ errorUploadFileDetail }}</span>
    </div>
    <template #footer center>
      <span class="d-flex justify-content-center">
        <el-button class="border-0" plain type="info" @click="notesVisible = false">Quay lại</el-button>
        <el-button class="border-0" plain type="primary" :disabled="disabled" @click="putUplaodFile" :loading=loadingFile>
          Đồng ý
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref, onMounted, reactive, onBeforeUnmount, watch } from "vue";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import ApiService from "@/core/services/ApiService";

// validate
import { ErrorMessage, Field, Form as VForm } from "vee-validate";
import { vue3Debounce } from 'vue-debounce';
import Swal from "sweetalert2/dist/sweetalert2.js";
import CodeHighlighter from "@/components/highlighters/CodeHighlighter.vue";
import KTToolbar from "@/views/apps/targets/reconWidgets/KTToolbar2.vue";
import { ElTable, ElTableColumn, ElPagination } from 'element-plus';

// ckediter
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { genFileId } from 'element-plus'
import type { UploadInstance, UploadProps, UploadRawFile, UploadUserFile } from 'element-plus'

interface APIData {
  title: string;
  description: string;
}

export default defineComponent({
  name: "kt-scans-list",

  components: {
    KTDatatable,
    ErrorMessage,
    Field,
    VForm,
    CodeHighlighter,
    KTToolbar,
    ElTable,
    ElTableColumn,
    ElPagination,
    QuillEditor,
  },
  directives: {
    debounce: vue3Debounce({ lock: true })
  },
  setup() {
    // ckediter
    const list = ref<object | any>([])
    const loading = ref<boolean>(false)
    const totalPage = ref<number>(0);
    const currentPage = ref<number>(1);
    const itemsPerPage = ref<number>(20);
    const query = ref<String>('');
    const status = ref<String | null>('');
    const severity = ref<number | any>('');
    const authen = ref<number | any>('');
    const ip = ref<String | null>('');
    const domain = ref<String | null>('');
    const typeIp = ref<String | null>('');
    const typeDomain = ref<String | null>('');
    const typeModal = ref<String>('');
    const nameType = ref<string>('');
    const classDetail = ref<boolean>(false);
    const closeOnRow = ref(true);
    const checkitemsPerPage = ref<boolean>(false);
    const apiData = ref<APIData>({
      title: '',
      description: '',
    });
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
      tags: {},
      cvss_score: '',
      details: '',
      description: '',
      request: '',
      http_response: '',
      recommendation: '',
      in_cpe: '',
      protocol: '',
      reference: {},
      type: '',
      classification: '',
      port: '',
      service: '',
      flag: false,
    });

    const handleClick = (data: object | any, type: String) => {
      typeModal.value = type
      apiData.value.description = data.description;
    };

    const getData = async () => {
      loading.value = true;
      return ApiService.get(`vuls/index?page=${currentPage.value}&page_size=${itemsPerPage.value}&search=${query.value}&status=${status.value}&severity=${severity.value}&ip=${ip.value}&search_ip_type=${typeIp.value}&domain=${domain.value}&search_domain_type=${typeDomain.value}&flag=${authen.value}`)
        .then(({ data }) => {
          // console.log(data)
          list.value = data.results
          totalPage.value = data.count
        })
        .catch(({ response }) => {

          notification(response.data.detail, 'error', 'Có lỗi xảy ra')
        })
        .finally(() => {
          loading.value = false
        });
    }

    // Lắng nghe sự thay đổi của currentPage và pageSize
    watch(currentPage, (newCurrentPage) => {
      currentPage.value = newCurrentPage ?? 1;
      getData();
    });

    watch(itemsPerPage, (newPageSize) => {
      itemsPerPage.value = newPageSize ?? 20;
      getData();
    });

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

    // table
    const selectedName = ref<Array<any>>([]);
    const handleSelectionChange = (val: any) => {
      if (val) {
        selectedName.value = val.map((item: any) => item.name || item.title || item.vt_name);
        selectedIds.value = val.map((item: { id: number }) => item.id);
      }
      return;
    }

    const getRowKey = (row: any) => {
      return row.id
    }

    // selectedIds
    const selectedIds = ref<Array<number>>([]);
    const disabled = ref<boolean>(false);
    const multipleTableRef = ref<InstanceType<typeof ElTable>>()
    const deleteSubscription = (ids: Array<number>) => {
      if (ids) {
        let formData = { id: ids }
        disabled.value = true
        setTimeout(() => {
          disabled.value = false
        }, 1000);
        return ApiService.post('vuls/multi_delete', formData)
          .then(({ data }) => {
            getData();
            notification(data.detail, 'success', 'Xóa thành công')
            currentPage.value = 1;
            selectedIds.value = [];
            multipleTableRef.value!.clearSelection()
          })
          .catch(({ response }) => {
            notification(response.data.detail, 'error', 'Có lỗi xảy ra')
          });
      }
    };

    const customRowTable = (detail: any) => {
      // console.log(detail)
      checkitemsPerPage.value = true;
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
      // return;

    };

    const handleCloseDetail = () => {
      classDetail.value = false;
      closeOnRow.value = false;
      checkitemsPerPage.value = false;
    };

    const ChangeFlag = (flag: boolean) => {
      detailData.flag = !flag;
      updateData();
    };

    const updateData = async () => {
      disabled.value = true
      setTimeout(() => {
        disabled.value = false
      }, 1000);
      let form_data = {
        severity: detailData.severity,
        status: detailData.status,
        flag: detailData.flag
      }
      return ApiService.put(`/vuls/${detailData.id}/update`, form_data)
        .then(({ data }) => {
          getData();
          notification(data?.detail, 'success', 'Chỉnh sửa thành công')
        })
        .catch(({ response }) => {
          notification(response.data.detail, 'error', 'Có lỗi xảy ra')
        });
    };

    const onItemSelect = (selectedItems: Array<number>) => {
      selectedIds.value = selectedItems;

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
        return { id: 3, title: 'Open', color: 'info', class: 'stautsOpen' };
      } else if (status == 're-open') {
        return { id: 5, title: 'Reopen', color: 'primary', class: 'stautsReopen' };
      } else if (status == 'closed') {
        return { id: 6, title: 'Close', color: 'danger', class: 'stautsClose' };
      } else if (status == 'rick-accepted') {
        return { id: 7, title: 'Accepted', color: 'success', class: 'stautsAccepted' };
      }
      return { id: 8, title: 'undefined', color: 'light', class: 'stautsundefined' };
    };

    const handleFilter = (data: any) => {
      console.log(data);

      query.value = data
      currentPage.value = 1;
      getData();

    };

    const handleFilterStatus = (data: any) => {
      status.value = data
      currentPage.value = 1;
      getData();
    };

    const handleFilterSeverity = (data: any) => {
      severity.value = data
      currentPage.value = 1;
      getData();
    };

    const handleFilterAuthen = (data: any) => {
      authen.value = data
      currentPage.value = 1;
      getData();
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
    const CustomWidth = ref<boolean>(false);
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
      // console.log(state, 'state')

      const deltaX = event.clientX - state.startX;
      container.value.scrollLeft = state.startScrollLeft - deltaX;
    };

    const handleMouseUp = () => {
      state.isDragging = false;

      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    // thay đổi kích thước header
    const headerHeight = ref<number>(0);
    const onheaderHeight = (height: number) => {
      headerHeight.value = height

    }

    // notesVisible
    const notesVisible = ref<boolean>(false);
    const fileDocument = ref<UploadUserFile[]>([]);
    const fileDocumentData = ref<UploadUserFile[]>([
      {
        name: '',
        url: '',
        size: 0,
      }
    ]);

    const errorUploadFile = ref<any>('');
    const errorUploadFileDetail = ref<any>('');
    const contentNote = ref<any>('')
    const fileData = ref<any>('')
    const has_delete_file = ref<any>(false)
    const loadingFile = ref<boolean>(false)
    const putUplaodFile = async () => {
      loadingFile.value = true
      disabled.value = true
      setTimeout(() => {
        disabled.value = false
      }, 1000);
      fileData.value = fileDocument.value?.[0]?.raw || fileDocument.value;
      const formData = new FormData();
      formData.append('files', fileData.value);
      formData.append('document', contentNote.value);
      formData.append('has_delete_file', has_delete_file.value);

      // return;
      return ApiService.put(`/vuls/${detailData.id}/update_document`, formData)
        .then(({ data }) => {
          notesVisible.value = false
          notification(data?.detail, 'success', 'Chỉnh sửa thành công')
        })
        .catch(({ response }) => {
          // console.log(response)
          // errorUploadFileDetail.value = response.data?.detail 
          if (response.data?.Errors) {
            // let errors = response.data.Errors
            errorUploadFileDetail.value = response.data.Errors[0]?.file[0] ?? response.data.Errors?.document[0] ?? "Có lỗi xảy ra"
          }
          if (response.data?.detail) {
            errorUploadFileDetail.value = response.data?.detail
          }
          // errorUploadFile.value = response.data.Errors ?? 'Đã có lỗi xảy ra'
        })
        .finally(() => {
          loadingFile.value = false
        });
    }

    const checkUpdateFile = ref<boolean>(false)
    const getUplaodFile = async () => {
      notesVisible.value = true
      errorUploadFileDetail.value = null
      has_delete_file.value = false
      return ApiService.get(`/vuls/${detailData.id}/get_document`)
        .then(({ data }) => {
          // console.log(data)
          contentNote.value = (data.document == null) ? '<p><br></p>' : data.document;
          if (data.files.length != 0) {
            isCheckDowload.value = false
            fileDocumentData.value[0].name = data.files[0]?.file_name
            fileDocumentData.value[0].url = data.files[0]?.file
            fileDocumentData.value[0].size = data.files[0]?.size
            fileDocument.value[0] = fileDocumentData.value[0]
          } else {
            fileDocument.value = [];
          }
        })
        .catch(({ response }) => {
          notification(response.data?.detail, 'error', 'Có lỗi xảy ra')
        });
    }

    const closeNotesVisible = () => {
      notesVisible.value = false
      contentNote.value = ''
      errorUploadFile.value = ''
      errorUploadFileDetail.value = ''
      fileDocument.value = []
      has_delete_file.value = false
    }

    const upload = ref<UploadInstance>()
    const handleExceed: UploadProps['onExceed'] = (files) => {
      console.log(files)
      upload.value!.clearFiles()
      const file = files[0] as UploadRawFile
      file.uid = genFileId()
      upload.value!.handleStart(file)
    }

    const removeFile = () => {
      upload.value!.clearFiles()
      fileDocument.value = []
      has_delete_file.value = true
    }

    // Tạo một biến tham chiếu để theo dõi tiến trình tải
    const isDownloading = ref(false);

    // Hàm để thực hiện việc tải tệp từ đường dẫn
    const downloadFile = async (url: any) => {
      try {
        // Đánh dấu tiến trình tải bắt đầu
        isDownloading.value = true;
        const fileUrl = import.meta.env.VITE_APP_API_URL + url.url;
        const fileName = url.name;
        // Yêu cầu tải tệp từ đường dẫn
        const response = await fetch(fileUrl);

        // Kiểm tra xem yêu cầu có thành công không (status 200-299 là thành công)
        if (!response.ok) {
          notification('Có lỗi xảy ra', 'error', 'Có lỗi xảy ra')
        }

        // Chuyển đổi phản hồi sang một luồng dữ liệu tệp
        const fileBlob = await response.blob();

        // Tạo một đối tượng URL để tạo tệp đóng gói trong Blob
        const fileObjectUrl = URL.createObjectURL(fileBlob);

        // Tạo một thẻ 'a' ẩn và nhấp vào nó để tải xuống
        const link = document.createElement('a');
        link.href = fileObjectUrl;
        link.download = fileName; // Thay thế 'tai_ve.pdf' bằng tên bạn muốn gán cho tệp khi tải về
        document.body.appendChild(link);
        link.click();

        // Giải phóng URL và xóa thẻ 'a'
        URL.revokeObjectURL(fileObjectUrl);
        document.body.removeChild(link);

        // Đánh dấu tiến trình tải hoàn thành
        isDownloading.value = false;
      } catch (error) {
        notification('Có lỗi xảy ra', 'error', 'Có lỗi xảy ra')
        isDownloading.value = false;
      }
    };
    const isHovering = ref(false);
    const isCheckDowload = ref(false);

    const onPreviewFile: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
      isCheckDowload.value = true
      console.log(uploadFile)
      console.log(uploadFiles)
      console.log(123)
    }

    const formatBytes = (input: any) => {
      if (typeof input === 'number') {
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (input === 0) return '0 Byte';
        const i = Math.floor(Math.log(input) / Math.log(1024));
        const roundedValue = (input / Math.pow(1024, i)).toFixed(2);
        return `${roundedValue} ${sizes[i]}`;
      } else if (typeof input === 'string') {
        return input; // Trả về luôn nếu input là chuỗi
      } else {
        return 'Invalid input'; // Trả về thông báo nếu input không phải là số hoặc chuỗi
      }
    };

    // Tính toán chiều rộng nội dung
    const contentWidth = ref(0);
    onMounted(() => {
      // console.log(contentWidth.value, 'contentWidth')
      contentWidth.value = container.value.scrollWidth;
    });

    onMounted(() => {
      getData();
    });

    return {
      handleFilterStatus,
      handleFilterSeverity,
      handleFilterAuthen,
      headerHeight,
      onheaderHeight,
      getData,
      list,
      onItemSelect,
      selectedIds,
      getAssetPath,
      closeOnRow,
      checkitemsPerPage,
      // crud
      apiData,
      handleClick,
      deleteSubscription,
      // detials
      customRowTable,
      // page 
      itemsPerPage,
      totalPage,
      currentPage,
      handleSelectionChange,
      selectedName,
      getRowKey,

      // search query 
      query,

      // edit 
      nameType,

      // sử lý dữ liệu
      getSeverity,
      getStatus,

      // filter
      handleFilter,
      loading,

      // detail
      classDetail,
      detailData,
      handleCloseDetail,
      updateData,

      // Dragging kéo lề
      startDragging,
      leftWidth,
      rightWidth,
      CustomWidth,

      // mouse down di chuột xuống
      handleMouseDown,
      contentWidth,
      container,
      disabled,
      multipleTableRef,


      // thêm
      notesVisible,
      ChangeFlag,


      // ckediter
      contentNote,
      putUplaodFile,
      getUplaodFile,
      fileDocument,
      handleExceed,
      upload,
      closeNotesVisible,
      errorUploadFile,
      removeFile,
      downloadFile,
      errorUploadFileDetail,
      isHovering,
      isCheckDowload,
      loadingFile,
      formatBytes,
      checkUpdateFile,
      onPreviewFile,
    };
  },
});
</script>

<style>
span.el-dialog__title {
  color: #181C32 !important;
  font-size: 23px;
  font-weight: 600;
  line-height: 27px;
}

#modal-detail .el-dialog__body {
  padding-top: 0px !important;
  padding-bottom: 0px !important;
}

.stautsOpen .el-input .el-select__caret,
.stautsOpen .el-input__inner {
  color: #7239ea !important;
}

.stautsReopen .el-input .el-select__caret,
.stautsReopen .el-input__inner {
  color: #009ef7 !important;
}

.stautsClose .el-input .el-select__caret,
.stautsClose .el-input__inner {
  color: #f1416c !important;
}

.stautsAccepted .el-input .el-select__caret,
.stautsAccepted .el-input__inner {
  color: #50cd89 !important;
}

.stautsundefined .el-input .el-select__caret,
.stautsundefined .el-input__inner {
  color: #7e8299 !important;
}

.stautsundefined .el-input__wrapper,
.stautsAccepted .el-input__wrapper,
.stautsClose .el-input__wrapper,
.stautsReopen .el-input__wrapper,
.stautsOpen .el-input__wrapper {
  background-color: #f4f4f4 !important;
  box-shadow: unset !important;
}

.severityInfo .el-input__wrapper {
  background-color: #50cd89 !important;
  box-shadow: unset !important;
}

.severityLow .el-input__wrapper {
  background-color: #009ef7 !important;
  box-shadow: unset !important;
}

.severityMedium .el-input__wrapper {
  background-color: #ffc700 !important;
  box-shadow: unset !important;
}

.severityHigh .el-input__wrapper {
  background-color: #f1416c !important;
  box-shadow: unset !important;
}

.severityundefined .el-input__wrapper {
  background-color: #7e8299 !important;
  box-shadow: unset !important;
}

.stautsInfo .el-input__inner,
.stautsInfo .el-input .el-select__caret,
.severityInfo .el-input__inner,
.severityInfo .el-input .el-select__caret,
.severityMedium .el-input__inner,
.severityMedium .el-input .el-select__caret,
.severityHigh .el-input__inner,
.severityHigh .el-input .el-select__caret,
.severityundefined .el-input__inner,
.severityundefined .el-input .el-select__caret,
.severityLow .el-input .el-select__caret,
.severityLow .el-input__inner {
  color: #fff !important;
}

.my-upload-dialog .el-upload-list {
  margin: 0 !important;
}

.ql-custom .ql-picker-item:before {
  content: attr(data-label);
}

.ql-select .el-input {
  height: 25px !important;
}</style>
