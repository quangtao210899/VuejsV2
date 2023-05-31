<template>
  <tbody class="fw-semibold text-gray-600 ">
    <template v-for="(row, i) in data" :key="i">
      <tr class="bg-hover-light" :class="(clickOnRow && indexTable == i) ? 'bg-secondary' : ''">
        <td v-if="checkboxEnabled">
          <div class="form-check form-check-sm form-check-custom form-check-solid ms-2">
            <input class="form-check-input" type="checkbox" :value="row[checkboxLabel]" v-model="selectedItems"
              @change="onChange" />
          </div>
        </td>
        <!-- <template v-for="(properties, j) in header" :key="j" >
          <td :class="{ 'text-end': j === header.length - 1 }" class="cursor-pointer" @click="customRow(row)">
            <slot :name="`customRow`" :row="row">
              
            </slot>
          </td>
        </template> -->
        <template v-for="(properties, j) in header" :key="j">
          <td v-if="properties.columnLabel == 'actions'" class="text-end">
            <slot :name="`${properties.columnLabel}`" :row="row">
              {{ row }}
            </slot>
          </td>
          <td v-else class="cursor-pointer" @click.passive="customRow(row, i)" data-bs-target="#kt_modal_detail">
            <slot :name="`${properties.columnLabel}`" :row="row">
              {{ row }}
            </slot>
          </td>
        </template>
      </tr>
    </template>
  </tbody>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";

export default defineComponent({
  name: "table-body-row",
  components: {},
  props: {
    clickOnRow: { type: Boolean, required: false, default: false },
    header: { type: Array as () => Array<any>, required: true },
    data: { type: Array as () => Array<any>, required: true },
    currentlySelectedItems: { type: Array, required: false, default: () => [] },
    checkboxEnabled: { type: Boolean, required: false, default: false },
    checkboxLabel: {
      type: String as () => string,
      required: false,
      default: "id",
    },
  },
  emits: ["on-select", "custom-row"],
  setup(props, { emit }) {
    const selectedItems = ref<Array<any>>([]);
    const selectRow = ref<object>();
    const selectRowID = ref<number>(0);
    const indexTable = ref<number>(0);

    watch(
      () => [...props.currentlySelectedItems],
      (currentValue) => {
        if (props.currentlySelectedItems.length !== 0) {
          selectedItems.value = [
            ...new Set([...selectedItems.value, ...currentValue]),
          ];
        } else {
          selectedItems.value = [];
        }
      }
    );

    const onChange = () => {
      emit("on-select", selectedItems.value);
    };

    const customRow = (data: object | any, index: number) => {
      selectRow.value = data
      selectRowID.value = data.id
      indexTable.value = index
      emit("custom-row", selectRow.value);
    };

    return {
      selectedItems,
      onChange,
      customRow,
      selectRow,
      selectRowID,
      indexTable,
    };
  },
});
</script>
<style>
.cursor-pointer {
  cursor: pointer;
}
</style>