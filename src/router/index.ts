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
  }]
}]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
