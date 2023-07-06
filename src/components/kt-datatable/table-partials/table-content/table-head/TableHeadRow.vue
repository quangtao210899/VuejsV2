<template>
  <thead class="w-100 ">
    <tr class="text-start text-gray-400 fw-bold fs-7 text-uppercase gs-0">
      <th v-if="checkboxEnabled" :style="{ width: '30px' }">
        <div
          class="form-check form-check-sm form-check-custom form-check-solid me-3"
        >
          <input
            id="checkbox"
            name="checkbox"
            class="form-check-input ms-2 border border-secondary"
            type="checkbox"
            v-model="checked"
            :checked="isAllSelected"
            @change="selectAll"
          />
        </div>
      </th>
      <template v-for="(column, i) in header" :key="i">
        <th
          :class="{ 'text-end  pe-5': i === header.length - 1,}"
          @click.passive="onSort(column.columnLabel, column.sortEnabled)"
          :style="{
            minWidth: column.columnWidth ? `${column.columnWidth}px` : '0',
            width: 'auto',
            cursor: column.sortEnabled ? 'pointer' : 'auto',
            textAlign: column.textAlign ? column.textAlign : 'left',
          }"
        >
          {{ column.columnName }}
          <span
            v-if="
              columnLabelAndOrder.label === column.columnLabel &&
              column.sortEnabled
            "
            v-html="sortArrow"
          ></span>
        </th>
      </template>
    </tr>
  </thead>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";
import type { Sort } from "@/components/kt-datatable/table-partials/models";
import { useStore } from 'vuex';

export default defineComponent({
  name: "table-head-row",
  props: {
    checkboxEnabledValue: { type: Boolean, required: false, default: false },
    checkboxEnabled: { type: Boolean, required: false, default: false },
    data: { type: Array as () => Array<any>, required: true },
    sortLabel: { type: String, required: false, default: null },
    sortOrder: {
      type: String as () => "asc" | "desc",
      required: false,
      default: "asc",
    },
    checkboxLabel: {
      type: String as () => string,
      required: false,
      default: "id",
    },
    header: { type: Array as () => Array<any>, required: true },
  },
  emits: ["on-select", "on-sort"],
  components: {},
  setup(props, { emit }) {
    const store = useStore();
    const checked = ref<boolean>(false);
    const columnLabelAndOrder = ref<Sort>({
      label: props.sortLabel,
      order: props.sortOrder,
    });
    
    const isAllSelected = computed(() => {
      const selectedInCurrentPage = props.data.filter(item => store.state.selectedItems.includes(item[props.checkboxLabel]));
      // const selectedInCurrentPage = props.data.filter(item => store.state.selectedItems.includes(item[props.checkboxLabel]));
      console.log(props.data.length, 345345, store.state.selectedItems.length, selectedInCurrentPage.length);
      
      // return store.state.selectedItems.length === props.data.length;
      return props.data.every(item => store.state.selectedItems.includes(item[props.checkboxLabel]));
    });

    watch(
      () => props.checkboxEnabledValue,
      (currentValue) => {
        checked.value = currentValue;
      }
    );

    const selectAll = () => {
      if (isAllSelected.value) {
        store.commit('setSelectedItems', []);
      } else {
        // Logic để thêm tất cả các mục vào selectedItems trong Vuex store
      }
      emit("on-select", store.state.selectedItems);
    };

    const onSort = (label: string, sortEnabled: boolean) => {
      if (sortEnabled) {
        if (columnLabelAndOrder.value.label === label) {
          if (columnLabelAndOrder.value.order === "asc") {
            columnLabelAndOrder.value.order = "desc";
          } else {
            if (columnLabelAndOrder.value.order === "desc") {
              columnLabelAndOrder.value.order = "asc";
            }
          }
        } else {
          columnLabelAndOrder.value.order = "asc";
          columnLabelAndOrder.value.label = label;
        }
        emit("on-sort", columnLabelAndOrder.value);
      }
    };

    const sortArrow = computed(() => {
      return columnLabelAndOrder.value.order === "asc"
        ? "&#x2191;"
        : "&#x2193;";
    });

    return {
      onSort,
      selectAll,
      isAllSelected,
      checked,
      sortArrow,
      columnLabelAndOrder,
    };
  },
});
</script>
