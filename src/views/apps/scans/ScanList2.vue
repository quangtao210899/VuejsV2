<template>
  <!--begin::Card-->
  <div class="app-container container-fluid p-5 mt-10">
  <div class="card h-100 d-block">
    <!--begin::Card header-->
    <div class="card-header border-0 pt-10 pt-sm-10 pt-lg-6 position-absolute end-0 pe-1  " style="top: -70px;">
      <!--begin::Card title-->
      <!-- <h3 class="card-title align-items-start flex-column">
        <span class="card-label fw-bold fs-3 mb-1">Danh sách quản lý lỗ hổng</span>

        <span class="text-muted fw-semobold fs-7">Tổng có {{ totalPage }} lỗ hổng</span>
      </h3> -->
      <!--begin::Card title-->

      <!--begin::Card toolbar-->
      <div class="card-toolbar">
        <!--begin::Toolbar-->
        <div v-show="selectedIds.length === 0">
          <div class="d-flex justify-content-end " data-kt-subscription-table-toolbar="base">
            <!--begin::Export-->
            <!-- <button type="button" class="btn btn-light-primary me-3" data-bs-toggle="modal"
              data-bs-target="#kt_subscriptions_export_modal">
              <KTIcon icon-name="exit-up" icon-class="fs-2" />
              Export
            </button> -->
            <!--end::Export-->
            <!-- <div class="position-absolute end-0" style="top: -60px;">  -->
            <el-tooltip class="box-item" effect="dark" :hide-after="0" content="Tìm kiếm" placement="top">
              <button type="button" class="btn btn-sm fw-bold bg-body btn-color-gray-700 btn-active-color-primary"
                data-kt-menu-trigger="click" data-kt-menu-placement="bottom-end" data-kt-menu-flip="top-end">
                <KTIcon icon-name="filter" icon-class="fs-2" />
                Filter
              </button>
            </el-tooltip>
            <Fillter @filterData="handleFilter"></Fillter>
            <!--begin::Add subscription-->
            <!--end::Add subscription-->
          </div>
        </div>
        <!--end::Toolbar-->

        <!--begin::Group actions-->
        <div v-show="selectedIds.length !== 0">
          <div class="d-flex justify-content-end align-items-center">
            <div class="fw-bold me-5">
              <span class="me-2">{{ selectedIds.length }}</span>Selected
            </div>
            <el-tooltip class="box-item" effect="dark" :hide-after="0" content="Xóa" placement="top">
              <button type="button" @click="deleteSelectd()" :disabled="disabled" class="btn btn-danger  btn-sm">
                <KTIcon icon-name="detele" icon-class="bi bi-trash" :style="{ fontSize: '16px' }" />
                Xóa mục đã chọn
              </button>
            </el-tooltip>
            <!-- <button type="button" class="btn btn-light-danger ms-2">
              Hủy
            </button> -->
          </div>
        </div>
        <!--end::Group actions-->
      </div>
      <!--end::Card toolbar-->
    </div>
    <!--end::Card header-->

    <div class="d-flex hand-height-2 shadow-hvover " :class="classDetail ? 'pe-1' : ''">
      <!--begin::Card body-->
      <div class="card-body overflow-auto h-100 m-0 p-0" ref="container" @mousedown="handleMouseDown"
        :style="classDetail ? { width: leftWidth + 'px' } : { width: '100%' }"
        :class="classDetail ? ' border-end' : 'col-12 '">
        <div class="w-100">
          <KTDatatable @on-items-select="onItemSelect" :clickOnRow="true" :closeOnRow="closeOnRow" :data="list"
            :header="headerConfig" :loading="loading" :checkbox-enabled="true" :itemsPerPage="itemsPerPage"
            :checkitemsPerPage="checkitemsPerPage" :total="totalPage" :currentPage="currentPage" @page-change="handlePage"
            @on-items-per-page-change="handlePerPage" @customRow="customRowTable">
            <template v-slot:severity="{ row: customer }">
              <div class="text-center">
                <KTIcon icon-name="severity" icon-class="bi bi-bug-fill"
                  :style="{ fontSize: '19px', color: getSeverity(customer.severity).color }" /><br>
                <p class="fst-normal" :style="{ fontSize: '11px', color: getSeverity(customer.severity).color }">{{
                  getSeverity(customer.severity).title }}</p>
              </div>
            </template>
            <template v-slot:vt_name="{ row: customer }"><span class="fs-6 fw-bold text-hover-primary">
                {{ customer.vt_name ?? customer.port_scan["vt_name"] }}</span></template>
            <template v-slot:hostname="{ row: customer }">
              <div class="badge badge-light">{{ customer.hostname ?? '--' }}</div>
            </template>
            <template v-slot:ip="{ row: customer }">
              <div class="badge badge-light">{{ (customer.ip == '') ? '--' : customer.ip }}</div>
            </template>
            <template v-slot:schema="{ row: customer }">
              <div><span class="badge badge-light-primary"> {{ customer.schema ?? (customer.nmap_scan ?
                customer.port_scan["service"] : customer.port_scan["type"]) }}</span></div>
            </template>
            <template v-slot:created_at="{ row: customer }">
              <span class="text-gray-600 w-bold d-flex justify-content-end align-items-center fs-7">
                <KTIcon class="me-1" icon-name="calendar" icon-class="fs-3" />
                {{ customer.created_at }}
              </span>
            </template>
            <template v-slot:status="{ row: customer }">
              <div class="text-end"> <span :class="`badge badge-${getStatus(customer.status).color}`">{{ customer.status
                ?? '--' }}</span>
              </div>
            </template>
          </KTDatatable>
        </div>
      </div>
      <!--end::Card body-->
      <div v-if="classDetail" @mousedown="startDragging" class="drag-handle position-relative">
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
                <button @click="handleCloseDetail" type="button" class="btn zindex-fixed btn-icon " :disabled="disabled">
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
              <el-select name="status" as="select" v-model="detailData.status" @change="handleChangeUpdate('Trạng Thái')">
                <el-option label="open" value="open" key="open">open</el-option>
                <el-option label="re-open" value="re-open" key="re-open">re-open</el-option>
                <el-option label="Close" value="closed" key="closed">Close</el-option>
                <el-option label="Accepted" value="rick-accepted" key="rick-accepted">Accepted</el-option>
              </el-select>
            </div>
          </div>
          <div class="bg-light my-5 py-2 px-4 lh-lg rounded-2 me-2 ">
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
              <h4 class="text-gray-800 fs-6 fw-bold cursor-pointer mb-0">Vulnerable URL</h4>
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
              <h4 class="text-gray-800 fs-6 fw-bold cursor-pointer mb-0">CVE/CWE</h4>
              <div class="lh-base">
                <template v-for="(tag, index) in detailData.tags" :key="index">
                  <li class="d-flex align-items-center py-2">
                    <span class="bullet bullet-vertical bg-success me-5"></span> {{ tag }}
                  </li>
                </template>
              </div>
            </div>

            <div class="mb-5" v-if="detailData.cvss_score != null && detailData.cvss_score != ''">
              <h4 class="text-gray-800 fs-6 fw-bold cursor-pointer mb-0">CVSS Score</h4>
              <div>
                <li class="d-flex align-items-center py-2">
                  <span class="bullet bg-warning me-5"></span>
                  <span>Base Score:<strong class="ps-2"> {{ detailData.cvss_score }}</strong></span>
                </li>
              </div>
            </div>

            <div class="mb-5" v-if="detailData.details != null && detailData.details != ''">
              <h4 class="text-gray-800 fs-6 fw-bold cursor-pointer mb-0">Attack Details</h4>
              <div>
                <div class="ps-1" v-html="detailData.details.replace(/<br\s*\/?>/g, '')"></div>
              </div>
            </div>

            <div class="mb-5" v-if="detailData.in_cpe != null && detailData.in_cpe != ''">
              <div class="d-flex align-items-end ">
                <h4 class="text-gray-800 fs-6 lh-lg fs-6 fw-bold m-0 pe-2">In CPE : </h4>
                <span> {{ detailData.in_cpe }}</span>
              </div>
            </div>

            <div class="mb-5" v-if="detailData.protocol != null && detailData.protocol != ''">
              <div class="d-flex align-items-end ">
                <h4 class="text-gray-800 fs-6 lh-lg fs-6 fw-bold m-0 pe-2">Protocol : </h4>
                <span> {{ detailData.protocol }}</span>
              </div>
            </div>

            <div class="mb-5" v-if="detailData.service != null && detailData.service != ''">
              <div class="d-flex align-items-end ">
                <h4 class="text-gray-800 fs-6 lh-lg fs-6 fw-bold m-0 pe-2">Service : </h4>
                <span> {{ detailData.service }}</span>
              </div>
            </div>

            <div class="mb-5" v-if="detailData.port != null && detailData.port != ''">
              <div class="d-flex align-items-end">
                <h4 class="text-gray-800 fs-6 lh-lg fs-6 fw-bold m-0 pe-2">Port : </h4>
                <span> {{ detailData.port }}</span>
              </div>
            </div>

            <div class="mb-5" v-if="detailData.type != null && detailData.type != ''">
              <div class="d-flex align-items-end ">
                <h4 class="text-gray-800 fs-6 lh-lg fs-6 fw-bold m-0 pe-2">Service : </h4>
                <span> {{ detailData.type }}</span>
              </div>
            </div>

            <div class="mb-5" v-if="detailData.url != null && detailData.url != ''">
              <div class="d-flex align-items-end ">
                <h4 class="text-gray-800 fs-6 lh-lg fs-6 fw-bold m-0 pe-2">URL : </h4>
                <span> {{ detailData.url }}</span>
              </div>
            </div>

            <div class="mb-5" v-if="detailData.references != null && detailData.references != ''">
              <h4 class="text-gray-800 fs-6 fw-bold cursor-pointer mb-0">References</h4>
              <div class="lh-base">
                <template v-for="(tag, index) in detailData.references" :key="index">
                  <li class="d-flex align-items-center py-2 text-primary">
                    <span class="bullet bullet-vertical bg-primary me-5"></span> {{ tag }}
                  </li>
                </template>
              </div>
            </div>

            <div class="mb-5" v-if="detailData.classification != null && detailData.classification != ''">
              <h4 class="text-gray-800 fs-6 fw-bold cursor-pointer mb-0">Classification</h4>
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
              <h4 class="text-gray-800 fs-6 fw-bold cursor-pointer mb-0">Description</h4>
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

                <div id="kt_detail_collapsible_scan_1" class="fs-6 px-2 collapse" style="">
                  <div>
                    <CodeHighlighter lang="json">{{ detailData.request }}</CodeHighlighter>
                  </div>
                </div>
              </div>

              <div class="separator separator-dashed" v-if="detailData.request != null && detailData.request != ''"></div>

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

                <div id="kt_detail_collapsible_scan_2" class="collapse fs-6 px-2">
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

                <div id="kt_detail_collapsible_scan_3" class="collapse fs-6 px-2">
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

  </div></div>
  <!--end::Card-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref, onMounted, reactive, onBeforeUnmount } from "vue";
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
      return ApiService.get(`vuls/index?page=${currentPage.value}&page_size=${itemsPerPage.value}&status=${status.value}&severity=${severity.value}&ip=${ip.value}&search_ip_type=${typeIp.value}&domain=${domain.value}&search_domain_type=${typeDomain.value}`)
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
        return { id: 0, title: 'Info', color: '#28a745', class: 'severityInfo' };
      } else if (severity == 1) {
        return { id: 1, title: 'Low', color: '#23b7e5', class: 'severityLow' };
      } else if (severity == 2) {
        return { id: 2, title: 'Medium', color: '#fcba32', class: 'severityMedium' };
      } else if (severity == 3) {
        return { id: 3, title: 'High', color: '#e11f26', class: 'severityHigh' };
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
      if (data) {
        status.value = data.status;
        severity.value = data.severity;
        ip.value = data.ip;
        domain.value = data.domain;
        typeIp.value = data.typeIp;
        typeDomain.value = data.typeDomain;
        currentPage.value = 1;
        getData();
      } else {
        notification('Có lỗi với filter', 'error', 'Có lỗi xảy ra')
      }

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
      console.log(state , 'state')

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


      // detials
      customRowTable,

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
</style>
