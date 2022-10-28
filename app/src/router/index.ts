import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    alias: "/home",
    name: "home",
    component: () => import("@/components/index.vue"),
  },
  {
    path: "/papers/list",
    alias: "/papers",
    name: "papers",
    component: () => import("@/components/paper/PaperList.vue"),
  },
  {
    path: "/papers/new",
    name: "papers-new",
    component: () => import("@/components/paper/PaperForm.vue"),
  },
  {
    path: "/papers/:id",
    name: "papers-details",
    component: () => import("@/components/paper/PaperDetail.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

export default router;
