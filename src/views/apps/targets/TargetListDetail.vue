<template>
    <KTToolbar :search="query" :idsDelete="selectedIds"></KTToolbar>

    <!--begin::Card-->
    <el-scrollbar :height="heightTable">
        <div class="app-container container-fluid mt-10 pt-10">
            <div class="card h-100 d-block bg-transparent">
                <!--begin::Navbar-->
                <div class="card mb-5 mb-xxl-8 px-5">
                    <div class="card-body p-0 pt-3">
                        <!--begin::Details-->
                        <div class="w-100  mb-3">
                            <div class="row px-2">
                                <div v-if="targetData.name" class="col-sm-6 col-md-3 col-lg-3 col-12">
                                    <span class="w-70px">Mục tiêu : </span>
                                    <span class="fw-bold">{{targetData.name}}</span>
                                </div>
                                <div  v-if="targetData.group" class="col-sm-6 col-md-3 col-lg-3 col-12">
                                    <span class="w-70px">Nhóm mục tiêu : </span>
                                    <span class="fw-bold">{{targetData.group}}</span>
                                </div>
                                <div  v-if="targetData.ip" class="col-sm-6 col-md-3 col-lg-3 col-12">
                                    <span class="w-70px">Ip : </span>
                                    <span class="fw-bold">{{targetData.ip}}</span>

                                </div>
                                <div v-if="targetData.domain" class="col-sm-6 col-md-3 col-lg-3 col-12">
                                    <span class="w-70px">Domain : </span>
                                    <span class="fw-bold">{{targetData.domain}}</span>
                                </div>
                            </div>
                        </div>
                        <!--end::Details-->

                        <!--begin::Content-->
                        <div class="d-flex overflow-auto h-55px">
                            <!--begin:::Tabs-->
                            <ul
                                class="nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fs-5 fw-bold flex-nowrap">
                                <!--begin:::Tab item-->
                                <li class="nav-item">
                                    <a class="nav-link text-active-primary pb-4 active" data-bs-toggle="tab"
                                        href="#kt_customer_view_overview_tab">Recon</a>
                                </li>
                                <!--end:::Tab item-->

                                <!--begin:::Tab item-->
                                <li class="nav-item">
                                    <a class="nav-link text-active-primary me-6" data-bs-toggle="tab"
                                        href="#kt_password_tab">Scans</a>
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
                <div class="tab-content" id="myTabContent">
                    <!--begin:::Tab pane-->
                    <div class="tab-pane fade show active" id="kt_customer_view_overview_tab" role="tabpanel">
                        <div>
                            <div class="card pt-4 mb-6 mb-xl-9">
                                <!--begin::Card header-->
                                <div class="card-header border-0">
                                    <!--begin::Card title-->
                                    <div class="card-title">
                                        <h2>Profile</h2>
                                    </div>
                                    <!--end::Card title-->
                                </div>
                                <!--end::Card header-->

                                <!--begin::Card body-->
                                <div class="card-body pt-0 pb-5">
                                    <!--begin::Table wrapper-->
                                    <div class="table-responsive">
                                        <!--begin::Table-->

                                        <!--end::Table-->
                                    </div>
                                    <!--end::Table wrapper-->
                                </div>
                                <!--end::Card body-->
                            </div>
                        </div>
                    </div>
                    <!--end:::Tab pane-->

                    <!--begin:::Tab pane-->
                    <div class="tab-pane fade" id="kt_password_tab" role="tabpanel">
                        <div>
                            <div class="card pt-4 mb-6 mb-xl-9">
                                <!--begin::Card body-->
                                <div class="modal-body scroll-y mx-5 mx-xl-15 my-7">
                                    <!--begin::Form-->

                                    <!--end::Form-->
                                </div>
                                <!--end::Card body-->
                            </div>
                        </div>
                    </div>
                    <!--end:::Tab pane-->

                </div>
                <!--end:::Tab content-->
            </div>
        </div>
    </el-scrollbar>
    <!--end::Card-->
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, reactive, watch, onUnmounted } from "vue";
import ApiService from "@/core/services/ApiService";
import { vue3Debounce } from 'vue-debounce';
import Swal from "sweetalert2/dist/sweetalert2.js";
import { ElTable, ElTableColumn } from 'element-plus';
import { useRoute } from 'vue-router';

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
    },
    directives: {
        debounce: vue3Debounce({ lock: true })
    },
    setup() {
        const route = useRoute();
        const ID = ref<any>(route.params.id ?? '');
        const list = ref<object | any>([])
        const data_group = ref<object | any>([])
        const totalPage = ref<number>(0);
        const currentPage = ref<number>(1);
        const itemsPerPage = ref<number>(20);
        const query = ref<string>('');
        const search_group = ref<string>('');
        const orderingID = ref<string>('id');
        const loading = ref<boolean>(false)

        const targetData = reactive<TargetData>({
            name: '',
            group: '',
            ip: '',
            domain: '',
        });

        const getData = async () => {
            loading.value = true;
            return ApiService.get(`targets/${ID.value}/info`)
                .then(({ data }) => {
                    targetData.name = data.target.name
                    targetData.domain = data.target.domain
                    targetData.group = data.target.group.id
                    targetData.ip = data.target.ip
                    console.log(targetData)
                })
                .catch(({ response }) => {
                    notification(response.data.detail, 'error', 'Có lỗi xảy ra')
                })
                .finally(() => {
                    loading.value = false
                })
        }


        const getDataGroup = async () => {
            loading.value = true;
            return ApiService.get(`targetgroup/list/`)
                .then(({ data }) => {
                    data_group.value = data
                })
                .catch(({ response }) => {
                    notification(response.data.detail, 'error', 'Có lỗi xảy ra')
                })
                .finally(() => {
                    loading.value = false
                });
        }

        const selectedIds = ref<Array<number>>([]);
        const disabled = ref<boolean>(false);
        const deleteSubscription = (ids: Array<number>) => {
            if (ids) {
                disabled.value = true
                setTimeout(() => {
                    disabled.value = false
                }, 1000);
                return ApiService.delete(`targets/multi-delete?id=${ids}`)
                    .then(({ data }) => {
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

        const notification = (values: string, icon: string, more: string) => {
            Swal.fire({
                text: values ?? more,
                icon: icon,
                buttonsStyling: false,
                confirmButtonText: "Đồng ý!",
                heightAuto: false,
                customClass: {
                    confirmButton: "btn btn-primary",
                },
            });
        }

        const handleFilter = (data: any) => {
            query.value = data;
            currentPage.value = 1;
            getData();
        };

        // xóa 
        const multipleTableRef = ref<InstanceType<typeof ElTable>>()
        // const router = useRouter();

        // handleCurrentChange
        const handleCurrentChange = (data: any) => {
            console.log(data.id)
            if (data) {
                // return router.push({ name: 'target-detail', params: { id: data.id } });
            }
            return;
        }

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

        // Lắng nghe sự thay đổi của currentPage và pageSize
        watch(currentPage, (newCurrentPage) => {
            currentPage.value = newCurrentPage ?? 1;
            getData();
        });

        watch(itemsPerPage, (newPageSize) => {
            itemsPerPage.value = newPageSize ?? 20;
            getData();
        });

        // tính toán chiều cao table
        const heightTable = ref(0)
        const handleResize = () => {
            const windowWidth = window.innerWidth;
            if (windowWidth >= 1400) {
                heightTable.value = window.innerHeight - 80;
            } else if (windowWidth >= 1200) {
                heightTable.value = window.innerHeight - 80;
            } else if (windowWidth >= 992) {
                heightTable.value = window.innerHeight - 80;
            } else if (windowWidth >= 768) {
                heightTable.value = window.innerHeight - 75;
            } else if (windowWidth >= 576) {
                heightTable.value = window.innerHeight - 75;
            } else {
                // Kích thước cửa sổ nhỏ hơn 576px, đặt giá trị mặc định
                heightTable.value = window.innerHeight - 70;
            }
        };
        // thêm mới
        const urlAddNew = ref('urlAddNew')

        const handleSortChange = (column: any) => {
            orderingID.value = (column.order == 'ascending' && column.prop == 'id') ? '-id' : 'id'
            getData()
        }

        onMounted(() => {
            getData();
            handleResize();
            window.addEventListener('resize', handleResize);
        });

        onUnmounted(() => {
            window.removeEventListener('resize', handleResize);
        });

        return {
            getData,
            getDataGroup,
            list,
            selectedIds,

            // validate
            data_group,

            // page 
            itemsPerPage,
            totalPage,
            currentPage,

            // search query 
            query,
            search_group,
            handleFilter,

            // edit 
            loading,
            disabled,

            //
            handleResize,
            heightTable,
            handleSelectionChange,
            getRowKey,
            handleCurrentChange,
            multipleTableRef,
            urlAddNew,
            handleSortChange,
            deleteSubscription,


            //
            targetData,
        };
    },
});
</script>
<style >
.my-custom-table td.el-table__cell {
    border-bottom-style: dashed !important;
}
</style>