import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';

/** 基本路由，这些路由是必须存在的 */
const coreRoutes: RouteRecordRaw[] = [
  /**
   * 根路由
   * 使用基础布局，作为所有页面的父级容器，子级就不必配置BasicLayout。
   * 此路由必须存在，且不应修改
   */
  {
    component: BasicLayout,
    meta: {
      hideInBreadcrumb: true,
      title: 'Root',
    },
    name: 'Root',
    path: '/',
    redirect: '/balance',
    children: [
      {
        name: 'Balance',
        path: '/balance',
        component: () => import('#/views/index.vue'),
        meta: {
          title: '电池均衡',
        },
      },
    ],
  },
];

export { coreRoutes };
