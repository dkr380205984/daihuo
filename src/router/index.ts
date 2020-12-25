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
    name: 'productList',
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
    name: 'orderList',
    component: () => import('../views/order/list.vue')
  }, {
    path: '/store/logList/:params',
    name: 'storeLogList',
    component: () => import('../views/store/logList.vue')
  }, {
    path: '/store/list/:params',
    name: 'storeList',
    component: () => import('../views/store/list.vue')
  }, {
    path: '/setting/category/:params',
    name: 'settingCategory',
    component: () => import('../views/setting/category.vue')
  }, {
    path: '/setting/main/:params',
    name: 'settingMain',
    component: () => import('../views/setting/main.vue')
  }]
}, {
  path: '/print/printSku/:id/:date',
  name: 'printSku',
  component: () => import('../views/print/printSku.vue')
}, {
  path: '/print/printStoreLog/:id/:type',
  name: 'printStoreLog',
  component: () => import('../views/print/printStoreLog.vue')
}]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
