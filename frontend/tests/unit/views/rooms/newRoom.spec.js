import { shallowMount, mount, createLocalVue } from '@vue/test-utils'
import VueRouter from 'vue-router'
import router from '@/router/index'
import Vuex from 'vuex'
import store from '@/store/index'
import axios from 'axios'
import axiosUtils from '@/plugins/axios'
import vuetify from '@/plugins/vuetify'
import { nextTick } from 'vue'

import NewRoom from '@/views/rooms/NewRoom.vue'
import { CATEGORIES } from '@/const'

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(Vuex)
localVue.use(axiosUtils, { axios })

jest.mock('axios')

describe('NewRoom.vue', () => {
  describe('Data', () => {
    it('sets room data', () => {
      const wrapper = shallowMount(NewRoom, { localVue })
      expect(wrapper.vm.$data.room.name).toBe('')
      expect(wrapper.vm.$data.room.category).toBe('')
    })

    it('sets categories', () => {
      const wrapper = shallowMount(NewRoom, { localVue })
      expect(wrapper.vm.$data.categories).toBe(CATEGORIES)
    })

    it('sets errors', () => {
      const wrapper = shallowMount(NewRoom, { localVue })
      expect(wrapper.vm.$data.errors).toEqual([])
    })
  })

  describe('Methods', () => {
    describe('createRoom', () => {
      describe('when status is 200', () => {
        const mockRoom = { id: 1, name: 'Foo Room', category: 'プログラミング' }
        const resp_200 = { data: { data: mockRoom }, status: 200 }

        it('sets flash', async () => {
          axios.post.mockResolvedValueOnce(resp_200)
          const wrapper = shallowMount(NewRoom, { router, store, localVue })
          await wrapper.vm.createRoom()
          expect(wrapper.vm.$store.state.flash).toEqual({ msg: 'ルームを作成しました', type: 'success' })
        })

        it('push home page', async () => {
          axios.post.mockResolvedValueOnce(resp_200)
          const wrapper = shallowMount(NewRoom, { router, store, localVue })
          wrapper.vm.createRoom()
          await nextTick()
          expect(wrapper.vm.$route.path).toBe('/rooms/1')
        })
      })

      describe('when status is 400', () => {
        const resp_400 = { response: { data: { errors: ['エラー'] }, status: 400 }}

        it('sets errors', async () => {
          axios.post.mockRejectedValueOnce(resp_400)
          const wrapper = shallowMount(NewRoom, { router, store, localVue })
          await wrapper.vm.createRoom()
          expect(wrapper.vm.$data.errors).toEqual(['エラー'])
        })
      })

      describe('when status is 402', () => {
        const resp_402 = { response: { data: { message: '402' }, status: 402 }}

        it('sets flash', async () => {
          axios.post.mockRejectedValueOnce(resp_402)
          const wrapper = shallowMount(NewRoom, { router, store, localVue })
          await wrapper.vm.createRoom()
          expect(wrapper.vm.$store.state.flash).toEqual({ msg: 'ログインしてください', type: 'warning' })
        })

        it('push login page', async () => {
          axios.post.mockRejectedValueOnce(resp_402)
          const wrapper = shallowMount(NewRoom, { router, store, localVue })
          wrapper.vm.createRoom()
          await nextTick()
          expect(wrapper.vm.$route.path).toBe('/login')
        })
      })

      describe('when other status', () => {
        const resp_500 = { response: { data: '500', status: 500 }}

        it('sets flash', async () => {
          axios.post.mockRejectedValueOnce(resp_500)
          const wrapper = shallowMount(NewRoom, { router, store, localVue })
          await wrapper.vm.createRoom()
          expect(wrapper.vm.$store.state.flash).toEqual({ msg: '未知のエラー', type: 'error'})
        })

        it('push home page', async () => {
          axios.post.mockRejectedValueOnce(resp_500)
          const wrapper = shallowMount(NewRoom, { router, store, localVue })
          wrapper.vm.createRoom()
          await nextTick()
          expect(wrapper.vm.$route.path).toBe('/')
        })
      })
    })
  })

  describe('Validation', () => {
    it('validates name presence', async () => {
      const wrapper = mount(NewRoom, { vuetify, localVue })
      const input = wrapper.find('#name')
      input.setValue('')
      const observer = wrapper.vm.$refs.observer
      await observer.validate()
      expect(wrapper.text()).toMatch('ルーム名を入力してください')
    })

    it('validates name length', async () => {
      const wrapper = mount(NewRoom, { vuetify, localVue })
      const input = wrapper.find('#name')
      input.setValue('a'.repeat(301))
      const observer = wrapper.vm.$refs.observer
      await observer.validate()
      expect(wrapper.text()).toMatch('ルーム名は300文字以内で入力してください')
    })

    it('validates category presence', async () => {
      const wrapper = mount(NewRoom, { vuetify, localVue })
      const select = wrapper.find('#category')
      select.setValue('')
      const observer = wrapper.vm.$refs.observer
      await observer.validate()
      expect(wrapper.text()).toMatch('カテゴリーを入力してください')
    })
  })
})