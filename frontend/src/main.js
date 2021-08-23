import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import './plugins/element'
import axiosUtil from './plugins/axios'

Vue.config.productionTip = false

Vue.use(axiosUtil, { axios })

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
