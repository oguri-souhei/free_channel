import { shallowMount, createLocalVue } from '@vue/test-utils'
import axios from 'axios'
import axiosUtils from '@/plugins/axios'
import VueRouter from 'vue-router'
import router from '@/router/index'
import Vuex from 'vuex'
import store from '@/store/index'

import ShowRoom from '@/views/rooms/ShowRoom.vue'

const localVue = createLocalVue()
localVue.use(axiosUtils, { axios })
localVue.use(VueRouter)
localVue.use(Vuex)

jest.mock('axios')

const mockRoom = { id: 1, name: 'Sample Room', category: 'プログラミング' }
const resp_200 = { data: { data: mockRoom }, status: 200 }
const resp_404 = { response: { data: { error: '404' }, status: 404 }}
const resp_500 = { response: { data: { msg: '500' }, status: 500 } }

describe('ShowRoom.vue', () => {
  describe('UI', () => {
    it('renders room name', () => {
      axios.get.mockResolvedValueOnce(resp_200)
      const wrapper = shallowMount(ShowRoom, { router, store, localVue })
      setTimeout(() => {
        expect(wrapper.text()).toMatch(mockRoom.name)
      }, 1)
    })

    it('renders room category', () => {
      axios.get.mockResolvedValueOnce(resp_200)
      const wrapper = shallowMount(ShowRoom, { router, store, localVue })
      setTimeout(() => {
        expect(wrapper.text()).toMatch(mockRoom.name)
      }, 1)
    })
  })

  describe('Methods', () => {
    describe('setRoom', () => {
      describe('when status is 200', () => {
        it('sets room', () => {
          axios.get.mockResolvedValueOnce(resp_200)
          const wrapper = shallowMount(ShowRoom, { router, store, localVue })
          setTimeout(() => {
            expect(wrapper.vm.$data.room).toEqual(mockRoom)
          }, 1)
        })
      })

      describe('when status is 404', () => {
        it('sets flash', () => {
          axios.get.mockRejectedValueOnce(resp_404)
          const wrapper = shallowMount(ShowRoom, { router, store, localVue })
          setTimeout(() => {
            expect(wrapper.vm.$store.flash).toEqual({ msg: 'ルームが見つかりませんでした', type: 'error'})
          }, 1)
        })

        it('push home page', () => {
          axios.get.mockRejectedValueOnce(resp_404)
          const wrapper = shallowMount(ShowRoom, { router, store, localVue })
          setTimeout(() => {
            expect(wrapper.vm.$route.path).toBe('/')
          }, 1);
        })
      })

      describe('when other status', () => {
        it('sets flash', () => {
          axios.mockRejectedValueOnce(resp_500)
          const wrapper = shallowMount(ShowRoom, { router, store, localVue })
          setTimeout(() => {
            expect(wrapper.vm.$store.flash).toEqual({ msg: '未知のエラー', type: 'error' })
          }, 1)
        })

        it('push home page', () => {
          axios.get.mockRejectedValueOnce(resp_500)
          const wrapper = shallowMount(ShowRoom, { router, store, localVue })
          setTimeout(() => {
            expect(wrapper.vm.$route.path).toBe('/')
          }, 1)
        })
      })
    })
  })
})
