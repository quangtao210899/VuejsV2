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
        :data="data"
        :checkbox-label="checkboxLabel"
        :current-page="currentPage"
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
            <el-empty :image-size="150" />
          </td>
        </tr>
      </template>
      <Loading v-if="loading" />
    </table>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch, computed } from "vue";
import TableHeadRow from "@/components/kt-datatable/table-partials/table-content/table-head/TableHeadRow.vue";
import TableBodyRow from "@/components/kt-datatable/table-partials/table-content/table-body/TableBodyRow.vue";
import Loading from "@/components/kt-datatable/table-partials/Loading.vue";
import type { Sort } from "@/components/kt-datatable/table-partials/models";
import { useStore } from 'vuex';

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
    currentPage: {
      type: Number,
      required: true,
    },
    checkboxEnabled: { type: Boolean, required: false, default: false },
    checkboxLabel: { type: String, required: false, default: "id" },
    loading: { type: Boolean, required: false, default: false },
    clickOnRow: { type: Boolean, required: false, default: false },
    closeOnRow: { type: Boolean, required: false, default: false },

  },
  emits: ["on-sort", "on-items-select", "custom-row"],
  components: {
    TableHeadRow,
    TableBodyRow,
    Loading,
  },
  setup(props, { emit }) {
    const store = useStore();
    const selectedItems = ref<Array<unknown>>([]);
    const allSelectedItems = ref<Array<unknown>>([]);
    const check = ref<boolean>(false);
    const selectRow = ref<object>();

    watch(
      () => props.data,
      () => {
        selectedItems.value = [];
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
      if (checked) {
        if (store.state.selectedItems.length == 0) {
          store.commit('setSelectedItems', [
            ...new Set([...selectedItems.value, ...allSelectedItems.value]),
          ]);
        } else {
          store.commit('removeSelectedItem', [
            ...new Set([...selectedItems.value, ...allSelectedItems.value]),
          ]);
          
          store.commit('addSelectedItem', [
            ...new Set([...selectedItems.value, ...allSelectedItems.value]),
          ]);
        }
      } else {
        store.commit('removeSelectedItem', [
            ...new Set([...selectedItems.value, ...allSelectedItems.value]),
          ]);
      }
      selectedItems.value = store.state.selectedItems
      console.log(store.state.selectedItems, selectedItems.value);
    };

    const checkselectedItemsOfPage = ref<boolean>(false);

    // watch(
    //   () => props.currentPage,
    //   () => {
    //     console.log(234234234234);
        
    //     checkselectedItemsOfPage.value = true
    //   }
    // );

    //eslint-disable-next-line
    const itemsSelect = (value: any) => {
      console.log(1231231233453456, value);
      
      selectedItems.value = [];
      let selectedItemsOfPage = []
      //eslint-disable-next-line
      value.forEach((item:any) => {
        console.log(item, 345345);
        
        if (!selectedItems.value.includes(item)) {
          selectedItems.value.push(item);
        }
        if (checkselectedItemsOfPage.value) {
          selectedItemsOfPage = []
        }
        // if (!selectedItemsOfPage.value.includes(item)) {
          // selectedItemsOfPage.push(item)
        // }
      });
      console.log(selectedItemsOfPage, 234234234);
      if (selectedItems.value.length < allSelectedItems.value.length) {
        check.value = false
      } else {
        check.value = true
      }

      store.commit('setSelectedItems', selectedItems.value);
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
      // console.log(data, 'data')
    };

    onMounted(() => {
      selectedItems.value = [];
      allSelectedItems.value = [];
      check.value = false;
      // eslint-disable-next-line
      props.data.forEach((item: any) => {
        if (item[props.checkboxLabel]) {
          allSelectedItems.value.push(item[props.checkboxLabel]);
        }
      });
    });

    return {
      selectedItems: computed(() => store.state.selectedItems),
      onSort,
      selectAll,
      itemsSelect,
      check,
      selectRow,
      customRowTable,
    };
  },
});
</script>
