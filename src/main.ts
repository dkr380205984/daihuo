import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import VueParticles from 'vue-particles';
import plugin from '@/assets/js/plugin'

Vue.prototype.$clone = plugin.clone
Vue.config.productionTip = false;
Vue.use(VueParticles)
Vue.use(ElementUI)

declare module 'vue/types/vue' {
  interface Vue {
    $clone: any
  }
}

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app');
