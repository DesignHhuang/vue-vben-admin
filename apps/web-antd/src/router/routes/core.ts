import type { RouteRecordRaw } from 'vue-router';

/** 基本路由，这些路由是必须存在的 */
const coreRoutes: RouteRecordRaw[] = [
  {
    name: 'Root',
    path: '/',
    component: () => import('#/views/index.vue'),
    meta: {
      hideInBreadcrumb: true,
      title: '电池均衡',
    },
  },
];

export { coreRoutes };
