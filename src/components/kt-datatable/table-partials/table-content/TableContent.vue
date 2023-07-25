<template>
  <div class="table-responsive" 
  :style="{overflow: 'unset'}"
  :class="[loading && 'overlay overlay-block']"
      >
    <table
    class="table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer"
    >
      <TableHeadRow
        @onSort="onSort"
        @onSelect="selectAll"
        :checkboxEnabledValue="check"
        :checkboxEnabled="checkboxEnabled"
        :sort-label="sortLabel"
        :sort-order="sortOrder"
        :header="header"
      />
      <TableBodyRow
        v-if="data.length !== 0"
        @onSelect="itemsSelect"
        @customRow="customRowTable"
        :currentlySelectedItems="selectedItems"
        :data="data"
        :header="header"
        :checkbox-enabled="checkboxEnabled"
        :checkbox-label="checkboxLabel"
        :clickOnRow="clickOnRow"
        :closeOnRow="closeOnRow"
      >
        <template v-for="(_, name) in $slots" v-slot:[name]="{ row: item }">
          <slot :name="name" :row="item" />
        </template>
      </TableBodyRow>
      <template v-else>
        <tr class="odd">
          <td colspan="12" class="dataTables_empty">
            <el-empty :image-size="150" description="Không có dữ liệu nào"/>
          </td>
        </tr>
      </template>
      <Loading v-if="loading" />
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue";
import TableHeadRow from "@/components/kt-datatable/table-partials/table-content/table-head/TableHeadRow.vue";
import TableBodyRow from "@/components/kt-datatable/table-partials/table-content/table-body/TableBodyRow.vue";
import Loading from "@/components/kt-datatable/table-partials/Loading.vue";
import type { Sort } from "@/components/kt-datatable/table-partials/models";

export default defineComponent({
  name: "table-body",
  props: {
    header: { type: Array, required: true },
    data: { type: Array, required: true },
    emptyTableText: { type: String, default: "No data found" },
    sortLabel: { type: String, required: false, default: null },
    sortOrder: {
      type: String as () => "asc" | "desc",
      required: false,
      default: "asc",
    },
    checkboxEnabled: { type: Boolean, required: false, default: false },
    checkboxLabel: { type: String, required: false, default: "id" },
    loading: { type: Boolean, required: false, default: false },
    clickOnRow: { type: Boolean, required: false, default: false },
    closeOnRow: { type: Boolean, required: false, default: false },
    currentPage: { type: Number, required: false, default: 1 },

  },
  emits: ["on-sort", "on-items-select", "custom-row"],
  components: {
    TableHeadRow,
    TableBodyRow,
    Loading,
  },
  setup(props, { emit }) {
    const selectedItems = ref<Array<unknown>>([]);
    const allSelectedItems = ref<Array<unknown>>([]);
    const check = ref<boolean>(false);
    const selectRow = ref<object>();
    const selectPerPage = {};
    let page = props.currentPage

    watch(
      () => props.data,
      () => {
        // selectedItems.value = [];
        allSelectedItems.value = [];
        check.value = false;
        // eslint-disable-next-line
        props.data.forEach((item: any) => {
          if (item[props.checkboxLabel]) {
            allSelectedItems.value.push(item[props.checkboxLabel]);
          }
        });
      }
    );

    // eslint-disable-next-line
    const selectAll = (checked: any) => {

      check.value = checked;
      console.log(check.value);
      
      if (checked) {
        selectedItems.value = [
          ...new Set([...selectedItems.value, ...allSelectedItems.value]),
        ];
      } else {
        selectedItems.value = [];
      }
    };

    //eslint-disable-next-line
    const itemsSelect = (value: any) => {
      selectedItems.value = [];
      let currentPage = 0;
      console.log(currentPage);
      
      if (currentPage != props.currentPage) {
        currentPage = props.currentPage
      }
      let lastPage = 1;
      console.log(currentPage);

      
      value.forEach((item: any) => {
        if (!selectedItems.value.includes(item)) {
          selectedItems.value.push(item);
        }

        if (selectPerPage[currentPage] && !selectPerPage[currentPage].includes(item)) {
          selectPerPage[currentPage].push(item);
        } else {
          selectPerPage[currentPage] = [item];
        }

        lastPage = currentPage;
      });

      console.log("Last page:", lastPage);
      console.log("Current page:", currentPage);
      console.log(selectPerPage);
      

      if (selectedItems.value.length < allSelectedItems.value.length) {
        check.value = false
      } else {
        check.value = true
      }
    };

    const onSort = (sort: Sort) => {
      emit("on-sort", sort);
    };

    watch(
      () => [...selectedItems.value],
      (currentValue) => {
        if (currentValue) {
          emit("on-items-select", currentValue);
        }
      }
    );

    const customRowTable = (data) => {
      selectRow.value = data
      emit("custom-row", selectRow.value);
    };

    onMounted(() => {
      // selectedItems.value = [];
      allSelectedItems.value = [];
      // check.value = false;
      // eslint-disable-next-line
      props.data.forEach((item: any) => {
        if (item[props.checkboxLabel]) {
          allSelectedItems.value.push(item[props.checkboxLabel]);
        }
      });
    });

    return {
      onSort,
      selectedItems,
      selectAll,
      itemsSelect,
      check,
      selectRow,
      customRowTable,
    };
  },
});
</script>
