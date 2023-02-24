import { createApp } from "vue";
import { createRouter, createWebHashHistory } from "vue-router";
import MainComponent from "./MainComponent.vue";
import App from "./App.vue";
import VueExamples from "./VueExamples.vue";
import "./assets/tailwind.css";

const routes = [
  { path: "/", component: App },
  { path: "/examples", component: VueExamples },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});
const app = createApp(MainComponent);
app.use(router);
app.mount("#app");
