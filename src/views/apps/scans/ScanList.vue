<template>
  <KTToolbar :check-search="true" @handle-search="handleFilter" v-model:idsDelete="selectedIds"
    @handle-delete-selectd="deleteSubscription" :disabled="disabled"></KTToolbar>
  <!--begin::Card-->
  <div class="app-container container-fluid mt-5">
    <div class="card h-100 d-block">
      <div class="d-flex ">
        <!--begin::Card body-->
        <div class="overflow-auto h-100 m-0 p-5" ref="container" @mousedown="handleMouseDown"
          :style="classDetail ? { width: leftWidth + 'px' } : { width: '100%' }">
          <div class="w-100">
            <el-table :data="list" style="width: 100%" class-name=" my-custom-table rounded-top cursor-pointer"
              table-layout="fixed" v-loading="loading" @selection-change="handleSelectionChange" highlight-current-row :row-key="getRowKey" @row-click="customRowTable">
              <template #empty>
                <div class="flex items-center justify-center h-100%">
                  <el-empty description="Không có dữ liệu nào" />
                </div>
              </template>
              <el-table-column label-class-name=" fs-13px fw-bold " type="selection" width="35"
                        :reserve-selection="true" />

              <el-table-column width="80" label-class-name="fs-13px fw-bold text-dark" prop="severity" align="center"
                label="SEV">
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

              <el-table-column label-class-name="fs-13px fw-bold text-dark" min-width="150" prop="vt_name" label="TÊN">
                <template #default="scope">
                  <span v-if="scope.row.vt_name != '' || scope.row.port_scan != ''"
                    class="fs-13px text-gray-700 text-hover-primary">
                    {{ scope.row.vt_name ?? scope.row.port_scan["vt_name"] }}</span>
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
              <el-table-column min-width="100" label-class-name="fs-13px text-dark fw-bold" prop="ip" label="IP">
                <template #default="scope">
                  <span v-if="scope.row.ip != ''" class="fs-13px text-gray-700 text-hover-primary">
                    {{ scope.row.ip }}</span>
                  <span v-else class="badge badge-light-danger">--</span>
                </template>
              </el-table-column>
              <el-table-column min-width="100" label-class-name="fs-13px text-dark fw-bold" prop="schema" label="SERVICE">
                <template #default="scope">
                  <span v-if="scope.row.schema != '' || scope.row.port_scan['type'] != ''"
                    class="fs-13px px-4 py-3 badge badge-light-primary">
                    {{ scope.row.schema ?? (scope.row.nmap_scan ?
                      scope.row.port_scan["service"] : scope.row.port_scan['type']) }}</span>
                  <span v-else class="badge badge-light-danger">--</span>
                </template>
              </el-table-column>
              <el-table-column min-width="160" label-class-name="fs-13px text-dark fw-bold" prop="last_seen"
                label="NGÀY TẠO">
                <template #default="scope">
                  <template v-if="scope.row.last_seen != ''">
                    <span class="fs-13px text-gray-700 text-hover-primary d-flex justify-content-start align-items-center">
                      <KTIcon class="me-1" icon-name="calendar" icon-class="fs-3" />
                      {{ scope.row.last_seen }}
                    </span>
                  </template>
                  <template v-else>
                    <span class="badge badge-light-danger">--</span>
                  </template>
                </template>
              </el-table-column>
              <el-table-column min-width="120" label-class-name="fs-13px text-dark fw-bold" align="left" prop="status"
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
                <span class="text-capitalize fs-13px">Tổng Số Lỗ hổng bảo mật: {{ totalPage }}</span>
              </div>
              <el-pagination background v-model:current-page="currentPage" :hide-on-single-page="true"
                v-model:page-size="itemsPerPage" :total="totalPage" layout="prev, pager, next"
                :disabled="disabled"></el-pagination>
              <div></div>
            </div>
          </div>
        </div>
        <!--end::Card body-->
        <div v-if="classDetail" @mousedown="startDragging" class="drag-handle position-relative border-end">
          <div class="position-absolute top-0 start-50 translate-middle-x mt-1">
          </div>
        </div>
        <!--begin::Card2 body-->
        <div class="overflow-scroll  h-100 " :style="classDetail ? { width: rightWidth + 'px' } : { width: '0px' }"
          :class="classDetail ? ' d-block' : 'd-none'">
          <div class="ms-3 pb-10 affix-container">
            <div class="card-title py-5 ">
              <h2 class="fw-bold pe-15 mt-5 fs-1">{{ detailData.vt_name }}</h2>
              <div class="position-absolute translate-middle-y" :style="{ top: '-130px', right: '10px' }">
                <el-affix target=".affix-container" :offset="170">
                  <button @click="handleCloseDetail" type="button" class="btn zindex-fixed btn-icon "
                    :disabled="disabled">
                    <KTIcon icon-name="abstract-11" icon-class="text-dark" :style="{ fontSize: '22px' }" />
                  </button>
                </el-affix>
              </div>
            </div>
            <div class="d-flex flex-wrap">
              <div class="w-200px me-2 my-1">
                <el-select name="severity" as="select" v-model="detailData.severity" class=""
                  :class="getSeverity(detailData.severity).class" @change="handleChangeUpdate('Mức độ')">
                  <el-option label="Info" value="0" key="0">Info</el-option>
                  <el-option label="Low" value="1" key="1">Low</el-option>
                  <el-option label="Medium" value="2" key="2">Medium</el-option>
                  <el-option label="High" value="3" key="3">High</el-option>
                </el-select>
              </div>
              <div class="w-200px my-1">
                <el-select name="status" as="select" v-model="detailData.status"
                  @change="handleChangeUpdate('Trạng Thái')">
                  <el-option label="open" value="open" key="open">open</el-option>
                  <el-option label="re-open" value="re-open" key="re-open">re-open</el-option>
                  <el-option label="Close" value="closed" key="closed">Close</el-option>
                  <el-option label="Accepted" value="rick-accepted" key="rick-accepted">Accepted</el-option>
                </el-select>
              </div>
            </div>
            <div class="bg-light my-5 py-2 px-4 lh-lg rounded-2 me-2 fs-13px">
              <div class="row">
                <div class="col-12 col-xl-6 col-xxl-4 my-1">
                  <span class="text-black-50">IP : </span>
                  <span class="ps-1"> {{ detailData.ip }}</span>
                </div>
                <div class="col-12 col-xl-6 col-xxl-4 my-1">
                  <span class="text-black-50">Host name : </span>
                  <span class="ps-1"> {{ detailData.hostname }}</span>
                </div>
                <div class="col-12 col-xl-6 col-xxl-4 my-1">
                  <span class="text-black-50">Date : </span>
                  <span class="ps-1"> {{ detailData.last_seen }}</span>
                </div>
              </div>
            </div>
            <div class="lh-lg">

              <div class="mb-5"
                v-if="(detailData.url != null && detailData.url != '') || (detailData.parameter != null && detailData.parameter != '')">
                <h4 class="text-gray-800 fs-13px fw-bold cursor-pointer mb-0">Vulnerable URL</h4>
                <div v-if="detailData.url != null && detailData.url != ''">
                  <span class="w-100">URL : </span>
                  <span class="ps-1">
                    <a target="_blank" :href="`${detailData.url}`" class="text-primary">
                      <KTIcon icon-name="link" icon-class="bi bi-link-45deg" :style="{ fontSize: '16px' }" />
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
                      <span class="bullet bullet-vertical bg-success me-5"></span> {{ tag }}
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
                  <div class="ps-1" v-html="detailData.details"></div>
                </div>
              </div>

              <div class="mb-5" v-if="detailData.in_cpe != null && detailData.in_cpe != ''">
                <div class="d-flex align-items-end ">
                  <h4 class="text-gray-800 fs-13px lh-lg fs-13px fw-bold m-0 pe-2">In CPE : </h4>
                  <span> {{ detailData.in_cpe }}</span>
                </div>
              </div>

              <div class="mb-5" v-if="detailData.protocol != null && detailData.protocol != ''">
                <div class="d-flex align-items-end ">
                  <h4 class="text-gray-800 fs-13px lh-lg fs-13px fw-bold m-0 pe-2">Protocol : </h4>
                  <span> {{ detailData.protocol }}</span>
                </div>
              </div>

              <div class="mb-5" v-if="detailData.service != null && detailData.service != ''">
                <div class="d-flex align-items-end ">
                  <h4 class="text-gray-800 fs-13px lh-lg fs-13px fw-bold m-0 pe-2">Service : </h4>
                  <span> {{ detailData.service }}</span>
                </div>
              </div>

              <div class="mb-5" v-if="detailData.port != null && detailData.port != ''">
                <div class="d-flex align-items-end">
                  <h4 class="text-gray-800 fs-13px lh-lg fs-13px fw-bold m-0 pe-2">Port : </h4>
                  <span> {{ detailData.port }}</span>
                </div>
              </div>

              <div class="mb-5" v-if="detailData.type != null && detailData.type != ''">
                <div class="d-flex align-items-end ">
                  <h4 class="text-gray-800 fs-13px lh-lg fs-13px fw-bold m-0 pe-2">Service : </h4>
                  <span> {{ detailData.type }}</span>
                </div>
              </div>

              <div class="mb-5" v-if="detailData.url != null && detailData.url != ''">
                <div class="d-flex align-items-end ">
                  <h4 class="text-gray-800 fs-13px lh-lg fs-13px fw-bold m-0 pe-2">URL : </h4>
                  <span> {{ detailData.url }}</span>
                </div>
              </div>

              <div class="mb-5" v-if="detailData.references != null && detailData.references != ''">
                <h4 class="text-gray-800 fs-13px fw-bold cursor-pointer mb-0">References</h4>
                <div class="lh-base">
                  <template v-for="(tag, index) in detailData.references" :key="index">
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
                      <CodeHighlighter lang="json">{{ detailData.request }}</CodeHighlighter>
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
                      <CodeHighlighter lang="html">{{ detailData.http_response }}</CodeHighlighter>
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
import Fillter from "@/views/apps/scans/filters.vue";
import CodeHighlighter from "@/components/highlighters/CodeHighlighter.vue";
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'
import { markRaw } from 'vue'
import KTToolbar from "@/views/apps/targets/reconWidgets/KTToolbar2.vue";

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
    Fillter,
    CodeHighlighter,
    KTToolbar,
  },
  directives: {
    debounce: vue3Debounce({ lock: true })
  },
  setup() {
    const list = ref<object | any>([])
    const loading = ref<boolean>(false)
    const totalPage = ref<number>(0);
    const currentPage = ref<number>(1);
    const itemsPerPage = ref<number>(20);
    const query = ref<String>('');
    const status = ref<String | null>('');
    const severity = ref<String | null>('');
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
    const dataConfirm = reactive({
      severity: '',
      status: ''
    });
    const detailData = reactive({
      id: '',
      vt_name: '',
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
    const headerConfig = ref([
      {
        columnName: "Sev",
        columnLabel: "severity",
        columnWidth: 90,
        textAlign: "center",
      },
      {
        columnName: "Tên",
        columnLabel: "vt_name",
      },
      {
        columnName: "Host name",
        columnLabel: "hostname",
      },
      {
        columnName: "IP",
        columnLabel: "ip",
      },
      {
        columnName: "Service",
        columnLabel: "schema",
      },
      {
        columnName: "Ngày Tạo",
        columnLabel: "created_at",
      },
      {
        columnName: "Trạng thái",
        columnLabel: "status",
        columnWidth: 90,
      },
    ]);

    const handleClick = (data: object | any, type: String) => {
      typeModal.value = type
      apiData.value.description = data.description;
    };

    const getData = async () => {
      loading.value = true;
      return ApiService.get(`vuls/index?page=${currentPage.value}&page_size=${itemsPerPage.value}&search=${query.value}&status=${status.value}&severity=${severity.value}&ip=${ip.value}&search_ip_type=${typeIp.value}&domain=${domain.value}&search_domain_type=${typeDomain.value}`)
        .then(({ data }) => {
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
        const handleSelectionChange = (val: any) => {
            if (val) {
                selectedIds.value = val.map((item: { id: number }) => item.id);
            }
            return;
        }

        const getRowKey = (row: any) => {
            return row.id
        }

    // selectedIds
    const selectedIds = ref<Array<number>>([]);
    const deleteSelectd = () => {
      ElMessageBox.confirm(
        'Tập tin sẽ được xóa vĩnh viễn. Tiếp tục?',
        'Xác Nhận Xóa',
        {
          confirmButtonText: 'Đồng Ý',
          cancelButtonText: 'Hủy Bỏ',
          type: 'warning',
          icon: markRaw(Delete)
        }
      )
        .then(() => {
          deleteSubscription(selectedIds.value);
        })
        .catch(() => {

        })
    };
    const disabled = ref<boolean>(false);

    const deleteSubscription = (ids: Array<number>) => {
      if (ids) {
        let formData = { id: ids }
        disabled.value = true
        setTimeout(() => {
          disabled.value = false
        }, 1000);
        return ApiService.post('vuls/multi_delete', formData)
          .then(({ data }) => {
            notification(data.detail, 'success', 'Xóa thành công')
            selectedIds.value.length = 0;
            getData();
          })
          .catch(({ response }) => {
            notification(response.data.detail, 'error', 'Có lỗi xảy ra')
          });
      }
    };

    const customRowTable = (detail: any) => {
      closeOnRow.value = true;
      classDetail.value = true;
      checkitemsPerPage.value = true;
      detailData.id = detail.id ?? detail.port_scan.id
      detailData.vt_name = detail.vt_name ?? detail.port_scan.name
      detailData.status = detail.status
      detailData.severity = String(detail.severity)
      detailData.created_at = detail.created_at
      detailData.hostname = detail.hostname ?? detail.port_scan.hostname
      detailData.ip = detail.ip ?? detail.port_scan.in_cpe
      detailData.schema = detail.schema ?? detail.port_scan.schema
      detailData.last_seen = detail.last_seen ?? detail.port_scan.last_seen
      detailData.url = detail.affects_url //
      detailData.parameter = detail.affects_detail ?? detail.port_scan.affects_detail
      detailData.tags = detail.tags ?? detail.port_scan.tags
      detailData.cvss_score = detail.cvss_score ?? detail.port_scan.cvss_score
      detailData.details = detail.details ?? detail.port_scan.details
      detailData.description = detail.description ?? detail.port_scan.description
      detailData.request = detail.request ?? detail.port_scan.request
      detailData.http_response = detail.http_response ?? detail.port_scan.http_response
      detailData.recommendation = detail.recommendation ?? detail.port_scan.recommendation
      // post scan
      detailData.in_cpe = detail.port_scan.in_cpe
      detailData.protocol = detail.port_scan.protocol
      detailData.service = detail.port_scan.service
      detailData.port = detail.port_scan.port
      detailData.classification = detail.port_scan.classification
      detailData.type = detail.port_scan.type
      detailData.references = detail.port_scan.references

      dataConfirm.severity = detailData.severity
      dataConfirm.status = detailData.status
    };

    const handleCloseDetail = () => {
      classDetail.value = false;
      closeOnRow.value = false;
      checkitemsPerPage.value = false;
    };

    const handleChangeUpdate = (type: string) => {
      if (detailData.status && detailData.severity && type) {
        updateData()
      } else {
        notification('', 'error', 'Có lỗi xảy ra')
      }
    };

    const updateData = async () => {
      disabled.value = true
      setTimeout(() => {
        disabled.value = false
      }, 1000);
      let form_data = {
        severity: detailData.severity,
        status: detailData.status
      }
      return ApiService.put(`/vuls/${detailData.id}/update`, form_data)
        .then(({ data }) => {
          notification(data.detail, 'success', 'Update thành công')
          getData();
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

    const handleFilter = (data: any) => {
      query.value = data
        // status.value = data.status;
        // severity.value = data.severity;
        // ip.value = data.ip;
        // domain.value = data.domain;
        // typeIp.value = data.typeIp;
        // typeDomain.value = data.typeDomain;
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

    // const handleCustomSize = () => {
    //   CustomWidth.value = !CustomWidth.value
    //   if(CustomWidth.value){
    //     leftWidth.value = 200;
    //   }else{
    //     contentWidth.value = container.value.scrollWidth;
    //   }
    //   console.log(CustomWidth.value)
    //   console.log(contentWidth.value)
    // };

    const handleMouseDown = (event: any) => {
      state.isDragging = true;
      state.startX = event.clientX;
      state.startScrollLeft = container.value.scrollLeft;


      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    };

    const handleMouseMove = (event: any) => {
      if (!state.isDragging) return;
      console.log(state, 'state')

      const deltaX = event.clientX - state.startX;
      container.value.scrollLeft = state.startScrollLeft - deltaX;
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
      contentWidth.value = container.value.scrollWidth;
    });

    onMounted(() => {
      getData();
    });

    return {
      getData,
      list,
      headerConfig,
      onItemSelect,
      selectedIds,
      deleteSelectd,

      getAssetPath,
      closeOnRow,
      checkitemsPerPage,

      // validate
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
      handleChangeUpdate,
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
    };
  },
});
</script>

<style scoped>
.shadow-hvover {
  box-shadow: 5px 6px 10px -9px rgba(0, 0, 0, .3);
}

.severityInfo .el-input__wrapper {
  background-color: #28a745;
}

.severityLow .el-input__wrapper {
  background-color: #23b7e5;
}

.severityMedium .el-input__wrapper {
  background-color: #fcba32;
  color: #fff;
}

.severityHigh .el-input__wrapper {
  background-color: #e11f26;
}

.severityundefined .el-input__wrapper {
  background-color: #7e8299;
}

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

.el-select .el-input__wrapper {
  height: 40px !important;
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
