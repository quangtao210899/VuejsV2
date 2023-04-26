<template>
  <!--begin::Card-->
  <div class="card">
    <!--begin::Card header-->
    <div class="card-header border-0 pt-6">
      <!--begin::Card title-->
      <div class="card-title">
        <!--begin::Search-->
        <div class="d-flex align-items-center position-relative my-1">
          <KTIcon
            icon-name="magnifier"
            icon-class="fs-1 position-absolute ms-6"
          />
          <input
            type="text"
            data-kt-subscription-table-filter="search"
            class="form-control form-control-solid w-250px ps-14"
            placeholder="Search Subscriptions"
          />
        </div>
        <!--end::Search-->
      </div>
      <!--begin::Card title-->

      <!--begin::Card toolbar-->
      <div class="card-toolbar">
        <!--begin::Toolbar-->
        <div
          v-if="selectedIds.length === 0"
          class="d-flex justify-content-end"
          data-kt-subscription-table-toolbar="base"
        >
          <!--begin::Export-->
          <button
            type="button"
            class="btn btn-light-primary me-3"
            data-bs-toggle="modal"
            data-bs-target="#kt_subscriptions_export_modal"
          >
            <KTIcon icon-name="exit-up" icon-class="fs-2" />
            Export
          </button>

          <button
            type="button"
            class="btn btn-sm fw-bold btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#kt_modal_new_target_group"
          >
            <KTIcon icon-name="plus" icon-class="fs-2" />
            Add New
          </button>

        </div>



        <!--begin::Group actions-->
        <div v-else class="d-flex justify-content-end align-items-center">
          <div class="fw-bold me-5">
            <span class="me-2">{{ selectedIds.length }}</span
            >Selected
          </div>
          <button
            type="button"
            class="btn btn-danger"
            @click.passive="deleteFewSubscriptions()"
          >
            Delete Selected
          </button>
        </div>
        <!--end::Group actions-->
      </div>
      <!--end::Card toolbar-->
    </div>
    <!--end::Card header-->

    <!--begin::Card body-->
    <div class="card-body pt-0">
      <KTDatatable
        @on-sort.passive="sort"
        @on-items-select.passive="onItemSelect"
        :data="data"
        :header="headerConfig"
        :checkbox-enabled="true"
      >
        <template v-slot:customer="{ row: customer }">
          <router-link
            to="/apps/subscriptions/view-subscription"
            class="text-gray-800 text-hover-primary mb-1"
          >
            {{ customer.customer }}
          </router-link>
        </template>
        <template v-slot:status="{ row: customer }">
          <a href="#" class="text-gray-600 text-hover-primary mb-1">
            <div :class="`badge badge-light-${customer.color}`">
              {{ customer.status }}
            </div>
          </a>
        </template>
        <template v-slot:billing="{ row: customer }">
          <div class="badge badge-light">{{ customer.billing }}</div>
        </template>
        <template v-slot:name="{ row: customer }">
          {{ customer.name }}
        </template>
        <template v-slot:createdDate="{ row: customer }">
          {{ customer.createdDate }}
        </template>
        <template v-slot:actions="{ row: customer }">
          <a
            href="#"
            class="btn btn-sm btn-light btn-active-light-primary"
            data-kt-menu-trigger="click"
            data-kt-menu-placement="bottom-end"
            data-kt-menu-flip="top-end"
            >Actions
            <KTIcon icon-name="down" icon-class="fs-5 m-0" />
          </a>
          <!--begin::Menu-->
          <div
            class="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-semobold fs-7 w-125px py-4"
            data-kt-menu="true"
          >
            <!--begin::Menu item-->
            <div class="menu-item px-3">
              <router-link
                to="/apps/customers/customer-details"
                class="menu-link px-3"
                >View</router-link
              >
            </div>
            <!--end::Menu item-->
            <!--begin::Menu item-->
            <div class="menu-item px-3">
              <a @click.passive="deleteSubscription(customer.id)" class="menu-link px-3"
                >Delete</a
              >
            </div>
            <!--end::Menu item-->
          </div>
          <!--end::Menu-->
        </template>
      </KTDatatable>
    </div>
    <!--end::Card body-->
  </div>
  <!--end::Card-->
</template>

<script lang="ts">
import { getAssetPath } from "@/core/helpers/assets";
import { defineComponent, ref, onMounted, reactive} from "vue";
import KTDatatable from "@/components/kt-datatable/KTDataTable.vue";
import type { Sort } from "@/components/kt-datatable/table-partials/models";
import arraySort from "array-sort";
import axios from 'axios';

export default defineComponent({
  name: "target-group-list",
  components: {
    KTDatatable,
  },
  setup() {
    const data = ref([])
    // const headerConfig = ref([
    //   {
    //     columnName: "ID",
    //     columnLabel: "id",
    //     sortEnabled: true,
    //   },
    //   {
    //     columnName: "Nhóm mục tiêu",
    //     columnLabel: "title",
    //     sortEnabled: true,
    //   },
    //   {
    //     columnName: "Mục tiêu",
    //     columnLabel: "target_count",
    //     sortEnabled: true,
    //   },
    //   {
    //     columnName: "Lỗ hổng",
    //     columnLabel: "flaw_count",
    //     sortEnabled: true,
    //   },
    //   {
    //     columnName: "Dịch vụ",
    //     columnLabel: "service_count",
    //     sortEnabled: true,
    //   },
    //   {
    //     columnName: "Actions",
    //     columnLabel: "actions",
    //   },
    // ]);
    const headerConfig = ref([
      {
        columnName: "Nhóm mục tiêu",
        columnLabel: "name",
        sortEnabled: true,
      },
      {
        columnName: "Mục tiêu",
        columnLabel: "url",
        sortEnabled: true,
      },
      {
        columnName: "Actions",
        columnLabel: "actions",
      },
    ]);

    const getData = () => {
      axios
        .get("http://127.0.0.1:8000/targetgroup/index")
        .then((response) => {
          data.value = response.data.results; // 👈 get just results
          data.value.map((e, index) => { e.id = ++index });
          console.log(data.value);

        })
        .catch(error => {
          console.log(error);
        })
    };
    getData();

    const selectedIds = ref<Array<number>>([]);
    const deleteFewSubscriptions = () => {
      selectedIds.value.forEach((item) => {
        deleteSubscription(item);
      });
      selectedIds.value.length = 0;
    };
    const deleteSubscription = (id: number) => {
      for (let i = 0; i < data.value.length; i++) {
        if (data.value[i].id === id) {
          data.value.splice(i, 1);
        }
      }
    };
    const sort = (sort: Sort) => {
      const reverse: boolean = sort.order === "asc";
      if (sort.label) {
        arraySort( data.value, sort.label, { reverse });
      }
    };
    const onItemSelect = (selectedItems: Array<number>) => {
      selectedIds.value = selectedItems;
    };


    return {
      data,
      headerConfig,
      sort,
      onItemSelect,
      selectedIds,
      deleteFewSubscriptions,
      deleteSubscription,
      getAssetPath,
    };
  },
});
</script>
