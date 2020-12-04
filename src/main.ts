import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueParticles from 'vue-particles';
import plugin from '@/assets/js/plugin'

Vue.use(plugin)
Vue.config.productionTip = false;
Vue.use(VueParticles)
Vue.use(ElementUI)

// 注册公共方法后需要声明
declare module 'vue/types/vue' {
  interface Vue {
    $clone: any,
    $getDataType: any
  }
}

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app');
