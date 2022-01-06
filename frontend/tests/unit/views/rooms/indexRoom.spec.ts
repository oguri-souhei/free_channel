import { shallowMount, createLocalVue } from '@vue/test-utils'
import axios from 'axios'
import axiosUtils from '@/plugins/axios'
import VueRouter from 'vue-router'
import router from '@/router/index'
import Vuex from 'vuex'
import store from '@/store/index'

import IndexRoom from '@/views/rooms/IndexRoom.vue'

const localVue = createLocalVue()
localVue.use(axiosUtils, { axios })
localVue.use(VueRouter)
localVue.use(Vuex)

jest.mock('axios')
const rooms = [
  { id: 1, name: 'Room1', category: 'プログラミング', created_at: '2021-09-17T09:46:02.431+09:00', comment_count: 10 },
  { id: 10, name: 'Room10', category: 'その他', created_at: '2021-09-17T09:46:02.431+09:00', comment_count: 100 },
  { id: 102, name: 'Room102', category: 'プログラミング', created_at: '2021-09-17T09:46:02.431+09:00', comment_count: 12 }
]
const length = 1
const resp_200 = { data: {
  data: { rooms, length }
}, status: 200 }
const resp_500 = { response: { data: null, status: 500 } }

describe('IndexRoom.vue', () => {
  describe('Data', () => {
    it('sets rooms', () => {
      axios.get.mockResolvedValueOnce(resp_200)
      const wrapper = shallowMount(IndexRoom, { router, store, localVue })
      setTimeout(() => {
        expect(wrapper.vm.$data.rooms).toEqual(rooms)
      }, 1)
    })
  })

  describe('Methods', () => {
    describe('#setRooms', () => {
      describe('when status is 200', () => {
        it('sets rooms', async () => {
          const wrapper = shallowMount(IndexRoom, { router, store, localVue })
          axios.get.mockResolvedValueOnce(resp_200)
          await wrapper.vm.setRooms()
          expect(wrapper.vm.$data.rooms).toEqual(rooms)
        })
      })

      describe('when other status', () => {
        it('sets flash', async () => {
          const wrapper = shallowMount(IndexRoom, { router, store, localVue })
          axios.get.mockRejectedValueOnce(resp_500)
          await wrapper.vm.setRooms()
          expect(wrapper.vm.$store.state.flash).toEqual({ msg: '未知のエラー', type: 'error' })
        })

        it('push home page', async () => {
          const wrapper = shallowMount(IndexRoom, { router, store, localVue })
          axios.get.mockRejectedValueOnce(resp_500)
          await wrapper.vm.setRooms()
          expect(wrapper.vm.$route.path).toBe('/')
        })
      })
    })

    describe('#keyDownEnter', () => {
      it('sets keyDownCode', () => {
        const wrapper = shallowMount(IndexRoom, { router, store, localVue })
        wrapper.vm.keyDownEnter(new Event('keydown', { key: 'enter' }))
        setTimeout(() => {
          expect(wrapper.vm.$data.keyDownCode).toBe(13)
        }, 1)
      })
    })
  })
})
