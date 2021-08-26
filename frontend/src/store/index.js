import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: true,
  state: {
    flash: {
      msg: '', // flashのメッセージ
      type: '' // flashのタイプ（success, warning, error)
    },
    currentUser: null
  },
  getters: {
    isLoggedIn(state) {
      return state.currentUser !== null ? true : false
    }
  },
  mutations: {
    setFlash(state, flash) {
      state.flash = flash
    },
    setCurrentUser(state, user) {
      state.currentUser = user
    }
  },
  actions: {
    setFlash(context, flash) {
      context.commit('setFlash', flash)
    },
    setCurrentUser(context, user) {
      context.commit('setCurrentUser', user)
    }
  }
})
