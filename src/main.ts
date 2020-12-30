import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueParticles from 'vue-particles';
import plugin from '@/assets/js/plugin'
import mycomponent from './components'
Vue.use(plugin)
Vue.config.productionTip = false;
Vue.use(VueParticles)
Vue.use(ElementUI)
Vue.use(mycomponent)

// 注册公共方法后需要声明
declare module 'vue/types/vue' {
  interface Vue {
    $getHash: any,
    $clone: any,
    $getDataType: any
    $mergeData: any
    $diffDate: any
    $getDate: any
    $downloadExcel: any
  }
}

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app');
