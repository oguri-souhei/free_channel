import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import axios from 'axios'
import axiosUtils from './plugins/axios'
import { getCurrentUser } from './modules/users'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

Vue.use(axiosUtils, { axios });

(async () => {
  const currentUser = await getCurrentUser().catch(err => { console.error(err) })
  store.dispatch('setCurrentUser', currentUser)
  console.log({ currentUser: store.state.currentUser})

  new Vue({
    router,
    store,
    vuetify,
    render: h => h(App)
  }).$mount('#app')
})()

