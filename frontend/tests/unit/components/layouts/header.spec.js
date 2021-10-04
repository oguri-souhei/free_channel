import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import store from '@/store/index'
import VueRouter from 'vue-router'
import Header from '@/components/layouts/Header.vue'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)

const mockUser = { id: 1, name: 'foo', email: 'foo@bar.com' }

describe('Header.vue', () => {
  describe('Computed', () => {
    describe('currentUser', () => {
      it('returns store currentUser', () => {
        store.dispatch('setCurrentUser', mockUser)
        const wrapper = shallowMount(Header, { store, localVue })
        expect(wrapper.vm.currentUser).toEqual(mockUser)
      })
    })

    describe('isLoggedIn', () => {
      it('returns true when currentUser', () => {
        const wrapper = shallowMount(Header, { store, localVue })
        store.dispatch('setCurrentUser', mockUser)
        expect(wrapper.vm.isLoggedIn).toBe(true)
      })

      it('returns false unless currentUser', () => {
        const wrapper = shallowMount(Header, { store, localVue })
        store.dispatch('setCurrentUser', null)
        expect(wrapper.vm.isLoggedIn).toBe(false)
      })
    })
  })
})
