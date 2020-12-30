import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const routes: RouteConfig[] = [{
  path: '/',
  redirect: '/login'
}, {
  path: '/login',
  name: 'login',
  component: () => import('../views/login.vue')
}, {
  path: '/index',
  name: 'index',
  component: () => import('../views/index.vue'),
  children: [{
    path: '/index/main',
    name: '首页',
    component: () => import('../views/index/main.vue')
  }, {
    path: '/css/list',
    name: 'cssList',
    component: () => import('../views/css/list.vue')
  }, {
    path: '/css/detail',
    name: 'cssDetail',
    component: () => import('../views/css/detail.vue')
  }, {
    path: '/css/create',
    name: 'cssCreate',
    component: () => import('../views/css/create.vue')
  }, {
    path: '/product/list/:params',
    name: '产品管理',
    component: () => import('../views/product/list.vue')
  }, {
    path: '/product/create',
    name: 'productCreate',
    component: () => import('../views/product/create.vue')
  }, {
    path: '/product/update/:id',
    name: 'productUpdate',
    component: () => import('../views/product/update.vue')
  }, {
    path: '/product/detail/:id',
    name: 'productDetail',
    component: () => import('../views/product/detail.vue')
  }, {
    path: '/order/list/:params',
    name: '订单管理',
    component: () => import('../views/order/list.vue')
  }, {
    path: '/store/logList/:params',
    name: '出入库日志',
    component: () => import('../views/store/logList.vue')
  }, {
    path: '/store/list/:params',
    name: '库存管理',
    component: () => import('../views/store/list.vue')
  }, {
    path: '/setting/category/:params',
    name: '品类设置',
    component: () => import('../views/setting/category.vue')
  }, {
    path: '/setting/main/:params',
    name: '系统设置',
    component: () => import('../views/setting/main.vue')
  }, {
    path: '/setting/sendMsg',
    name: '发布公告',
    component: () => import('../views/setting/sendMsg.vue')
  }]
}, {
  path: '/print/printSku/:id/:date',
  name: 'printSku',
  component: () => import('../views/print/printSku.vue')
}, {
  path: '/print/printStoreLog/:id/:type',
  name: 'printStoreLog',
  component: () => import('../views/print/printStoreLog.vue')
}, {
  path: '/print/printStoreLog/:id/:type',
  name: 'printStoreLog',
  component: () => import('../views/print/printStoreLog.vue')
}, {
  path: '/print/printSkuByPro/:id/:number/:proId',
  name: 'printSkuByPro',
  component: () => import('../views/print/printSkuByPro.vue')
}]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
