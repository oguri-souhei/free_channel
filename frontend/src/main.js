import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import './plugins/element'
import axiosUtils from './plugins/axios'
import { getCurrentUser } from './modules/users'

Vue.config.productionTip = false

Vue.use(axiosUtils, { axios });

(async () => {
  const currentUser = await getCurrentUser()
  store.dispatch('setCurrentUser', currentUser)
  console.log(store.state.currentUser)
})()

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
