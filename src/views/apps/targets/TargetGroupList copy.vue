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
        :data="dataGroup"
        :header="headerConfig"
        :checkbox-enabled="true"
      >
        <template v-slot:id="{ row: customer }">{{ customer.id }}</template>
        <template v-slot:title="{ row: customer }">{{ customer.title }}</template>
        <template v-slot:target_count="{ row: customer }">
          <div class="badge badge-light">{{ customer.target_count ?? 0 }}</div>
        </template>
        <template v-slot:flaw_count="{ row: customer }">
          <div class="badge badge-light">{{ customer.flaw_count ?? 0 }}</div>
        </template>
        <template v-slot:service_count="{ row: customer }">
          <div class="badge badge-light">{{ customer.service_count ?? 0 }}</div>
        </template>
        <template v-slot:actions="{ row: customer }">
          <a href="#"
            class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1">
            <KTIcon icon-name="switch" icon-class="fs-3" /></a>

          <a
            href="#"
            class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1"
          >
            <KTIcon icon-name="pencil" icon-class="fs-3" />
          </a>

          <a
            href="#"
            class="btn btn-icon btn-bg-light btn-active-color-primary btn-sm"
          >
            <KTIcon icon-name="trash" icon-class="fs-3" />
          </a>
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
// import axios from 'axios';
import ApiService from "@/core/services/ApiService";

export default defineComponent({
  name: "target-group-list",
  components: {
    KTDatatable,
  },
  setup() {
    const dataGroup = ref([])
    const headerConfig = ref([
      {
        columnName: "ID",
        columnLabel: "id",
        sortEnabled: true,
      },
      {
        columnName: "Nhóm mục tiêu",
        columnLabel: "title",
        sortEnabled: true,
      },
      {
        columnName: "Mục tiêu",
        columnLabel: "target_count",
        sortEnabled: true,
      },
      {
        columnName: "Lỗ hổng",
        columnLabel: "flaw_count",
        sortEnabled: true,
      },
      {
        columnName: "Dịch vụ",
        columnLabel: "service_count",
        sortEnabled: true,
      },
      {
        columnName: "Actions",
        columnLabel: "actions",
      },
    ]);

    function getData() {
      return ApiService.get("/targetgroup/index")
        .then(({ data }) => {
          dataGroup.value = data.results
          console.log(dataGroup.value)
        })
        .catch(({ response }) => {
          console.log(response)
        });
    }
    getData() 

    const selectedIds = ref<Array<number>>([]);
    const deleteFewSubscriptions = () => {
      selectedIds.value.forEach((item) => {
        deleteSubscription(item);
      });
      selectedIds.value.length = 0;
    };
    const deleteSubscription = (id: number) => {
      for (let i = 0; i < dataGroup.value.length; i++) {
        if (dataGroup.value[i].id === id) {
          dataGroup.value.splice(i, 1);
        }
      }
    };
    const sort = (sort: Sort) => {
      const reverse: boolean = sort.order === "asc";
      if (sort.label) {
        arraySort( dataGroup.value, sort.label, { reverse });
      }
    };
    const onItemSelect = (selectedItems: Array<number>) => {
      selectedIds.value = selectedItems;
    };

    onMounted(() => {
      getData();
    });

    return {
      dataGroup,
      headerConfig,
      sort,
      onItemSelect,
      selectedIds,
      deleteFewSubscriptions,
      deleteSubscription,
      getAssetPath,
      getData,
    };
  },
});
</script>
