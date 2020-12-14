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
    path: '/product/list',
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
    path: '/order/list',
    name: 'orderList',
    component: () => import('../views/order/list.vue')
  }, {
    path: '/stock/list',
    name: 'stockList',
    component: () => import('../views/stock/list.vue')
  }, {
    path: '/setting/category',
    name: 'settingCategory',
    component: () => import('../views/setting/category.vue')
  }, {
    path: '/setting/main',
    name: 'settingMain',
    component: () => import('../views/setting/main.vue')
  }]
}]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
