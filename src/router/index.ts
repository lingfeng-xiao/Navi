import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

// 路由配置
export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard/index.vue'),
    meta: {
      title: '仪表盘',
      requiresAuth: false,
      breadcrumb: ['仪表盘']
    }
  },
  {
    path: '/expense',
    name: 'Expense',
    component: () => import('@/views/Expense/index.vue'),
    meta: {
      title: '支出管理',
      requiresAuth: false,
      breadcrumb: ['支出管理']
    }
  },
  {
    path: '/debt',
    name: 'Debt',
    component: () => import('@/views/Debt/index.vue'),
    meta: {
      title: '债务管理',
      requiresAuth: false,
      breadcrumb: ['债务管理']
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/views/Settings/index.vue'),
    meta: {
      title: '系统设置',
      requiresAuth: false,
      breadcrumb: ['系统设置']
    }
  },
  // 404页面
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound/index.vue'),
    meta: {
      title: '页面未找到',
      requiresAuth: false
    }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes,
  // 滚动行为
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// 全局前置守卫
router.beforeEach((to, _from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 个人财务管理系统` : '个人财务管理系统'
  
  // 处理身份验证（如果需要）
  if (to.meta.requiresAuth) {
    // 这里可以添加实际的身份验证逻辑
    // const isAuthenticated = store.state.auth.isAuthenticated
    // if (!isAuthenticated) {
    //   return next({ name: 'Login' })
    // }
  }
  
  next()
})

export default router