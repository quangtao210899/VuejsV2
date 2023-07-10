import { createApp } from "vue";
import store from './store';
import { createPinia } from "pinia";
import { Tooltip } from "bootstrap";
import App from "./App.vue";
/*
TIP: To get started with clean router change path to @/router/clean.ts.
 */
import router from "./router";
import ElementPlus from "element-plus";
import i18n from "@/core/plugins/i18n";

//imports for app initialization
import ApiService from "@/core/services/ApiService";
import { initApexCharts } from "@/core/plugins/apexcharts";
import { initInlineSvg } from "@/core/plugins/inline-svg";
import { initVeeValidate } from "@/core/plugins/vee-validate";
import { initKtIcon } from "@/core/plugins/keenthemes";
import 'vue-toast-notification/dist/theme-sugar.css';
import "@/core/plugins/prismjs";
// Import the tooltip component and option types
import VueCustomTooltip from '@adamdehaven/vue-custom-tooltip'
const app = createApp(App);
app.use(VueCustomTooltip)
app.use(createPinia());
app.use(router);
app.use(ElementPlus);

app.use(store);

ApiService.init(app);
initApexCharts(app);
initInlineSvg(app);
initKtIcon(app);
initVeeValidate();

app.use(i18n);

app.directive("tooltip", (el) => {
  new Tooltip(el);
});

app.mount("#app");
// axios.defaults.baseURL = 'http://127.0.0.1:8000'


