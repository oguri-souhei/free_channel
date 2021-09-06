import { shallowMount, createLocalVue } from "@vue/test-utils"
import VueRouter from "vue-router"
import router from '@/router/index'
import Vuex from 'vuex'
import store from '@/store/index'
import axios from 'axios'
import axiosUtils from '@/plugins/axios'
import LoggedIn from '@/components/layouts/headers/LoggedIn.vue'
import { nextTick } from "vue"

const mockUser = { id: 1, name: 'foo', email: 'foo@bar.com' }

jest.mock('axios')

const resp_200 = { data: { data: { message: 'ログアウトしました' } }, status: 200 }
const err_resp = { response: { data: null, status: 500 }}
axios.delete
  .mockResolvedValueOnce(resp_200)
  .mockResolvedValueOnce(resp_200)
  .mockResolvedValueOnce(resp_200)
  .mockRejectedValueOnce(err_resp)
  .mockRejectedValueOnce(err_resp)

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(Vuex)
localVue.use(axiosUtils, { axios })

describe('LoggedIn.vue', () => {
  describe('methods', () => {
    describe('logout', () => {
      describe('when status is 200', () => {
        it('sets flash', async () => {
          store.dispatch('setCurrentUser', mockUser)
          const wrapper = shallowMount(LoggedIn, { store, router, localVue })
          await wrapper.vm.logout()
          expect(wrapper.vm.$store.state.flash).toEqual({ msg: 'ログアウトしました', type: 'success' })
        })

        it('removes currentUser', async () => {
          store.dispatch('setCurrentUser', mockUser)
          const wrapper = shallowMount(LoggedIn, { store, router, localVue })
          await wrapper.vm.logout()
          expect(wrapper.vm.$store.state.currentUser).toBeNull()
        })

        it('push /', async () => {
          store.dispatch('setCurrentUser', mockUser)
          const wrapper = shallowMount(LoggedIn, { store, router, localVue })
          wrapper.vm.logout()
          await nextTick()
          expect(wrapper.vm.$route.path).toBe('/')
        })
      })

      describe('when other status', () => {
        it('sets flash', async () => {
          store.dispatch('setCurrentUser', mockUser)
          const wrapper = shallowMount(LoggedIn, { store, router, localVue })
          await wrapper.vm.logout()
          expect(wrapper.vm.$store.state.flash).toEqual({ msg: 'ログアウトに失敗しました', type: 'error' })
        })

        it('push /', async () => {
          store.dispatch('setCurrentUser', mockUser)
          const wrapper = shallowMount(LoggedIn, { store, router, localVue })
          wrapper.vm.logout()
          await nextTick()
          expect(wrapper.vm.$route.path).toBe('/')
        })
      })
    })
  })
})