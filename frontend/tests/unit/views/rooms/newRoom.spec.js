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

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(Vuex)
localVue.use(axiosUtils, { axios })

jest.mock('axios')

describe('NewRoom.vue', () => {
  // データオブジェクト
  describe('Data', () => {
    // room.theme
    it('sets room theme', () => {
      const wrapper = shallowMount(NewRoom, { localVue })
      expect(wrapper.vm.$data.room.theme).toBe('')
    })

    // room.description
    it('sets room description', () => {
      const wrapper = shallowMount(NewRoom, { localVue })
      expect(wrapper.vm.$data.room.description).toBe('')
    })

    // room.opinion_1
    it('sets room opinion_1', () => {
      const wrapper = shallowMount(NewRoom, { localVue })
      expect(wrapper.vm.$data.room.opinion_1).toBe('')
    })

    // room.opinion_2
    it('sets room opinion_2', () => {
      const wrapper = shallowMount(NewRoom, { localVue })
      expect(wrapper.vm.$data.room.opinion_2).toBe('')
    })

    // errors
    it('sets errors', () => {
      const wrapper = shallowMount(NewRoom, { localVue })
      expect(wrapper.vm.$data.errors).toEqual([])
    })
  })

  describe('Methods', () => {
    describe('createRoom', () => {
      // ステータス200の時
      describe('when status is 200', () => {
        // 成功時のレスポンスのモックを作成
        const mockRoom = {
          id: 1,
          theme: 'about something',
          description: 'This room is ....',
          opinion_1: 'opinonA',
          opinion_2: 'opinionB'
        }
        const resp_200 = { data: { data: mockRoom }, status: 200 }

        // フラッシュは表示されているか？
        it('sets flash', async () => {
          axios.post.mockResolvedValueOnce(resp_200)
          const wrapper = shallowMount(NewRoom, { router, store, localVue })
          await wrapper.vm.createRoom()
          expect(wrapper.vm.$store.state.flash).toEqual({ msg: '部屋を作成しました', type: 'success' })
        })

        // トップページに遷移しているか？
        it('push home page', async () => {
          axios.post.mockResolvedValueOnce(resp_200)
          const wrapper = shallowMount(NewRoom, { router, store, localVue })
          wrapper.vm.createRoom()
          await nextTick()
          expect(wrapper.vm.$route.path).toBe('/rooms/1')
        })
      })

      // 値が不正な時
      describe('when status is 400', () => {
        // ステータス400のレスポンスのモック
        const resp_400 = { response: { data: { errors: ['エラー'] }, status: 400 }}

        // errorsデータが更新されているか？
        it('sets errors', async () => {
          axios.post.mockRejectedValueOnce(resp_400)
          const wrapper = shallowMount(NewRoom, { router, store, localVue })
          await wrapper.vm.createRoom()
          expect(wrapper.vm.$data.errors).toEqual(['エラー'])
        })
      })

      // ログインしていない時
      describe('when status is 402', () => {
        // ステータス402のときのモックレスポンス
        const resp_402 = { response: { data: { message: '402' }, status: 402 }}

        // フラッシュが更新されているか？
        it('sets flash', async () => {
          axios.post.mockRejectedValueOnce(resp_402)
          const wrapper = shallowMount(NewRoom, { router, store, localVue })
          await wrapper.vm.createRoom()
          expect(wrapper.vm.$store.state.flash).toEqual({ msg: 'ログインしてください', type: 'warning' })
        })

        // ログインページに遷移しているか？
        it('push login page', async () => {
          axios.post.mockRejectedValueOnce(resp_402)
          const wrapper = shallowMount(NewRoom, { router, store, localVue })
          wrapper.vm.createRoom()
          await nextTick()
          expect(wrapper.vm.$route.path).toBe('/login')
        })
      })

      // ステータス500の時
      describe('when other status', () => {
        // ステータス500の時のレスポンスモック
        const resp_500 = { response: { data: '500', status: 500 }}

        // フラッシュが更新されているか？
        it('sets flash', async () => {
          axios.post.mockRejectedValueOnce(resp_500)
          const wrapper = shallowMount(NewRoom, { router, store, localVue })
          await wrapper.vm.createRoom()
          expect(wrapper.vm.$store.state.flash).toEqual({ msg: '未知のエラー', type: 'error'})
        })

        // トップページに遷移しているか？
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

  // フォームのバリデーション
  describe('Validation', () => {
    // テーマフィールド
    describe('theme', () => {
      // 入力されているか？
      it('validates theme presence', async () => {
        const wrapper = mount(NewRoom, { vuetify, localVue })
        const input = wrapper.find('#theme')
        input.setValue('')
        const observer = wrapper.vm.$refs.observer
        await observer.validate()
        expect(wrapper.text()).toMatch('テーマを入力してください')
      })

      // 長さは適切か？
      it('validates theme length', async () => {
        const wrapper = mount(NewRoom, { vuetify, localVue })
        const input = wrapper.find('#theme')
        input.setValue('a'.repeat(301))
        const observer = wrapper.vm.$refs.observer
        await observer.validate()
        expect(wrapper.text()).toMatch('テーマは300文字以内で入力してください')
      })
    })

    // 部屋の説明フィールド
    describe('description', () => {
      // 長さは適切か？
      it('validates description length', async () => {
        const wrapper = mount(NewRoom, { vuetify, localVue })
        const input = wrapper.find('#description')
        input.setValue('a'.repeat(1001))
        const observer = wrapper.vm.$refs.observer
        await observer.validate()
        expect(wrapper.text()).toMatch('部屋の説明は1000文字以内で入力してください')
      })
    })

    // 意見Aフィールド
    describe('opinion_1', () => {
      // 空ではないか？
      it('validates opinion_1 presence', async () => {
        const wrapper = mount(NewRoom, { vuetify, localVue })
        const input = wrapper.find('#opinion_1')
        input.setValue('')
        const observer = wrapper.vm.$refs.observer
        await observer.validate()
        expect(wrapper.text()).toMatch('意見Aを入力してください')
      })

      // 長さは適切か？
      it('validates opinion_1 length', async () => {
        const wrapper = mount(NewRoom, { vuetify, localVue })
        const input = wrapper.find('#opinion_1')
        input.setValue('a'.repeat(101))
        const observer = wrapper.vm.$refs.observer
        await observer.validate()
        expect(wrapper.text()).toMatch('意見Aは100文字以内で入力してください')
      })
    })

    // 意見Bフィールド
    describe('opinion_2', () => {
      // 空ではないか？
      it('validates opinion_2 presence', async () => {
        const wrapper = mount(NewRoom, { vuetify, localVue })
        const input = wrapper.find('#opinion_2')
        input.setValue('')
        const observer = wrapper.vm.$refs.observer
        await observer.validate()
        expect(wrapper.text()).toMatch('意見Bを入力してください')
      })

      // 長さは適切か？
      it('validates opinion_2 length', async () => {
        const wrapper = mount(NewRoom, { vuetify, localVue })
        const input = wrapper.find('#opinion_2')
        input.setValue('a'.repeat(101))
        const observer = wrapper.vm.$refs.observer
        await observer.validate()
        expect(wrapper.text()).toMatch('意見Bは100文字以内で入力してください')
      })
    })
  })
})