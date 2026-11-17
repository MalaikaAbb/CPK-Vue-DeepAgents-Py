import { createApp } from "vue";
// Components and surfaces › Try it, step 3 (Vue tab): the Chart and Map plugins of the standard catalog.
import { GenerativeUIChart } from "@copilotkit/vue/v2/generative-ui/chart";
import { GenerativeUIMap } from "@copilotkit/vue/v2/generative-ui/map";
import App from "./HarnessShell.vue"; // [harness] Quickstart: `import App from "./App.vue"` — each doc App.vue lives under src/routes/
import "@copilotkit/vue/styles.css";

import "./harness.css"; // [harness] Tailwind for the harness chrome
import router from "./router"; // [harness] one route per doc page

// Quickstart: createApp(App).mount("#app");
// Components and surfaces: createApp(App).use(GenerativeUIChart).use(GenerativeUIMap).mount("#app");
createApp(App).use(GenerativeUIChart).use(GenerativeUIMap).use(router).mount("#app");
