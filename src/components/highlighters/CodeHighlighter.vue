<template>
  <div class="py-2">
    <div class="highlight">
      <button
        class="highlight-copy btn"
        data-bs-toggle="tooltip"
        title="Sao chép"
        data-bs-original-title="Sao chép"
      >
      Sao chép
      </button>
      <div class="highlight-code" >
        <pre class="w-100"
          :class="`language-${lang}`"
          :style="{ height: getHeightInPixesls }" 
        ><code :class="`language-${lang}`" :style="styleName" class="w-100" style="white-space: pre-line;">
          {{ data }}
        </code></pre>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, onUpdated } from "vue";
import { useCopyClipboard } from "@/core/helpers/documentation";
import Prism from "prismjs";

export default defineComponent({
  name: "CodeHighlighter",
  props: {
    lang: String,
    fieldHeight: Number,
    styleName: { type: Object, required: false, default: {} },
    data: { required: false }
  },
  setup(props) {
    const height = ref(props.fieldHeight);

    const { init } = useCopyClipboard();

    const getHeightInPixesls = computed(() => {
      return height.value + "px";
    });

    onUpdated(() => {
      Prism.highlightAll();
    });

    onMounted(() => {
      Prism.highlightAll();
      init();
    });

    return {
      getHeightInPixesls,
      // data
    };
  },
  components: {},
});
</script>
