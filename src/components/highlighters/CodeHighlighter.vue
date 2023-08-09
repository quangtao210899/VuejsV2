<template>
  <div class="py-5">
    <div class="highlight">
      <button
        class="highlight-copy btn"
        data-bs-toggle="tooltip"
        title=""
        data-bs-original-title="Copy code"
      >
        copy
      </button>
      <div class="highlight-code" >
        <pre  id="codeBlock"  ref="codeBlock"
          :class="`language-${lang}`"
          :style="{ height: getHeightInPixesls }"
        ><code :class="`language-${lang}`">
          {{ data }}
        </code></pre>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from "vue";
import { useCopyClipboard } from "@/core/helpers/documentation";
import Prism from "prismjs";

export default defineComponent({
  name: "CodeHighlighter",
  props: {
    lang: String,
    fieldHeight: Number,
    code: String
  },
  setup(props) {
    const height = ref(props.fieldHeight);
    const data = ref<any>(props.code)

    const { init } = useCopyClipboard();
    const codeBlock = ref<any>(null);

    const getHeightInPixesls = computed(() => {
      return height.value + "px";
    });

    watch(() => props.code, () => {
      data.value = null
      data.value = props.code
      window.Prism.manual = true;
      Prism.highlightElement( codeBlock.value, true, undefined );
    })

    onMounted(() => {
      Prism.highlightAll(codeBlock.value);
      init();
    });

    return {
      getHeightInPixesls,
      data,
      codeBlock,
    };
  },
  components: {},
});
</script>
