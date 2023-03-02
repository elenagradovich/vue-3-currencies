import { createApp } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import App from "./App.vue";
import CurrenciesPage from "./pages/CurrenciesPage.vue";
import ExamplesPage from "./pages/ExamplesPage.vue";
import NewsPage from "./pages/NewsPage.vue";
import "./assets/tailwind.css";

const routes = [
  { path: "/", component: CurrenciesPage },
  { path: "/examples", component: ExamplesPage },
  { path: "/news", component: NewsPage },
];
const router = createRouter({
  history: createWebHistory(),
  routes,
});
const app = createApp(App);
app.use(router);
app.mount("#app");
