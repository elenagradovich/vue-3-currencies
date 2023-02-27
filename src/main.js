import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import App from "./App.vue";
import VueCurrencies from "./pages/VueCurrencies.vue";
import VueExamples from "./pages/VueExamples.vue";
import "./assets/tailwind.css";

const routes = [
  { path: "/", component: VueCurrencies },
  { path: "/examples", component: VueExamples },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
const app = createApp(App);
app.use(router);
app.mount("#app");
