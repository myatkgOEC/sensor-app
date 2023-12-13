import Vue from "vue";
import VueRouter from "vue-router";
import DashboardView from "../views/DashboardView.vue";
// import { dynamicImport } from "../utility/util";
// import { loadView } from "../utility/util";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Dashboard",
    component: DashboardView,
  },
  {
    path: "/settings",
    name: "Settings",
    component: () =>
      import(/* webpackChunkName: "settings" */ "../views/SettingsView.vue"),
  },
  {
    path: "/about",
    name: "About",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
