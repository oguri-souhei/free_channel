import { shallowMount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import router from '@/router/index'
import Vuex from 'vuex'
import store from '@/store/index'
import axios from 'axios'
import axiosUtils from '@/plugins/axios'
import { nextTick } from 'vue'

import EditRoom from '@/views/rooms/EditRoom.vue'
import { CATEGORIES } from '@/const'

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(Vuex)
localVue.use(axiosUtils, { axios })

jest.mock('axios')
const room = { id: 1, name: 'Foo', category: 'プログラミング' }
const errors = ['名前を入力してください', 'カテゴリーは指定された中から選んでください']
const resp_200 = { data: { data: room }, status: 200 }
const resp_400 = { response: { data: { errors }, status: 400 }}
const resp_402 = { response: { data: {}, status: 402 }}
const resp_403 = { response: { data: {}, status: 403 }}
const resp_500 = { response: { data: {}, status: 500 }}

describe('EditRoom.vue', () => {
  describe('Data', () => {
    it('sets rooms', () => {
      axios.get.mockResolvedValueOnce(resp_200)
      const wrapper = shallowMount(EditRoom, { router, store, localVue })
      setTimeout(() => {
        expect(wrapper.vm.$data.room).toEqual(room)
      }, 1)
    })

    it('sets categories', () => {
      axios.get.mockResolvedValueOnce(resp_200)
      const wrapper = shallowMount(EditRoom, { router, store, localVue })
      expect(wrapper.vm.$data.categories).toEqual(CATEGORIES)
    })

    it('sets errors', () => {
      axios.get.mockResolvedValueOnce(resp_200)
      const wrapper = shallowMount(EditRoom, { router, store, localVue })
      expect(wrapper.vm.$data.errors).toEqual([])
    })
  })

  describe('Methods', () => {
    describe('updateRoom', () => {
      describe('when status is 200', () => {
        it('sets flash', async () => {
          axios.get.mockResolvedValueOnce(resp_200)
          const wrapper = shallowMount(EditRoom, { router, store, localVue })
          axios.patch.mockResolvedValueOnce(resp_200)
          await wrapper.vm.updateRoom()
          expect(wrapper.vm.$store.state.flash).toEqual({ msg: '部屋を編集しました', type: 'success' })
        })

        it('push ShowRoom page', async () => {
          axios.get.mockResolvedValueOnce(resp_200)
          const wrapper = shallowMount(EditRoom, { router, store, localVue })
          axios.patch.mockResolvedValueOnce(resp_200)
          wrapper.vm.updateRoom()
          await nextTick()
          expect(wrapper.vm.$route.path).toBe('/rooms/' + room.id)
        })
      })

      describe('when status is 400', () => {
        it('sets errors', async () => {
          axios.get.mockResolvedValueOnce(resp_200)
          const wrapper = shallowMount(EditRoom, { router, store, localVue })
          axios.patch.mockRejectedValueOnce(resp_400)
          await wrapper.vm.updateRoom()
          expect(wrapper.vm.$data.errors).toEqual(errors)
        })
      })

      describe('when status is 402', () => {
        it('sets flash', async () => {
          axios.get.mockResolvedValueOnce(resp_200)
          const wrapper = shallowMount(EditRoom, { router, store, localVue })
          axios.patch.mockRejectedValueOnce(resp_402)
          await wrapper.vm.updateRoom()
          expect(wrapper.vm.$store.state.flash).toEqual({ msg: 'ログインしてください', type: 'warning' })
        })

        it('push login page', async () => {
          axios.get.mockResolvedValueOnce(resp_200)
          const wrapper = shallowMount(EditRoom, { router, store, localVue })
          axios.patch.mockRejectedValueOnce(resp_402)
          wrapper.vm.updateRoom()
          await nextTick()
          expect(wrapper.vm.$route.path).toBe('/login')
        })
      })

      describe('when status is 403', () => {
        it('sets flash', async () => {
          axios.get.mockResolvedValueOnce(resp_200)
          const wrapper = shallowMount(EditRoom, { router, store, localVue })
          axios.patch.mockRejectedValueOnce(resp_403)
          await wrapper.vm.updateRoom()
          expect(wrapper.vm.$store.state.flash).toEqual({ msg: 'この操作は禁止されています', type: 'error' })
        })

        it('push ShowRoom page', async () => {
          axios.get.mockResolvedValueOnce(resp_200)
          const wrapper = shallowMount(EditRoom, { router, store, localVue })
          axios.patch.mockRejectedValueOnce(resp_402)
          wrapper.vm.updateRoom()
          await nextTick()
          expect(wrapper.vm.$route.path).toBe(`/rooms/${room.id}`)
        })
      })

      describe('when other status', () => {
        it('sets flash', async () => {
          axios.get.mockResolvedValueOnce(resp_200)
          const wrapper = shallowMount(EditRoom, { router, store, localVue })
          axios.patch.mockRejectedValueOnce(resp_500)
          await wrapper.vm.updateRoom()
          expect(wrapper.vm.$store.state.flash).toEqual({ msg: '未知のエラー', type: 'error' })
        })

        it('push home page', async () => {
          axios.get.mockResolvedValueOnce(resp_200)
          const wrapper = shallowMount(EditRoom, { router, store, localVue })
          axios.patch.mockRejectedValueOnce(resp_402)
          wrapper.vm.updateRoom()
          await nextTick()
          expect(wrapper.vm.$route.path).toBe('/')
        })
      })
    })

    describe('setRoom', () => {
      describe('when status is 200', () => {
        it('sets data', async () => {
          axios.get.mockResolvedValueOnce(resp_200)
          const wrapper = shallowMount(EditRoom, { router, store, localVue })
          axios.get.mockResolvedValueOnce(resp_200)
          await wrapper.vm.setRoom()
          expect(wrapper.vm.$data.room).toEqual(room)
        })
      })

      describe('when other status', () => {
        it('sets flash', async () => {
          axios.get.mockResolvedValueOnce(resp_200)
          const wrapper = shallowMount(EditRoom, { router, store, localVue })
          axios.get.mockRejectedValueOnce(resp_500)
          await wrapper.vm.setRoom()
          expect(wrapper.vm.$store.state.flash).toEqual({ msg: '未知のエラー', type: 'error' })
        })
      })
    })
  })
})
