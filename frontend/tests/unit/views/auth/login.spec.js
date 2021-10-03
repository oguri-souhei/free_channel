import { mount, shallowMount, createLocalVue } from '@vue/test-utils'
import Login from '@/views/auth/Login.vue'
import { nextTick } from 'vue'
import Vuex from 'vuex'
import store from '@/store/index'
import VueRouter from 'vue-router'
import router from '@/router/index'
import axios from 'axios'
import axiosUtils from '@/plugins/axios'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)
localVue.use(axiosUtils, { axios })

jest.mock('axios')

describe('Login.vue', () => {
  describe('Data', () => {
    it('sets user', () => {
      const wrapper = shallowMount(Login, { localVue })
      expect(wrapper.vm.$data.user.email).toBe('')
      expect(wrapper.vm.$data.user.password).toBe('')
    })

    it('sets errors', () => {
      const wrapper = shallowMount(Login, { localVue })
      expect(wrapper.vm.$data.errors).toEqual([])
    })
  })

  describe('Methods', () => {
    describe('login', () => {

      const mockUser = { id: 1, name: 'foo', email: 'foo@bar.com' }
      const resp_200 = { data: { data: mockUser }, status: 200 }
      const resp_401 = { response: { data: { errors: { message: 'アドレスまたはパスワードが違います'} }, status: 401 } }
      const resp_403 = { response: { data: { message: '既にログインしています' }, status: 403 } }
      const resp_404 = { response: { data: { errors: { message: 'アカウントが見つかりませんでした' } }, status: 404 }}
      const resp_500 = { response: { data: null, status: 500 } }

      describe('when status is 200', () => {
        it('sets flash', async () => {
          axios.post.mockResolvedValueOnce(resp_200)
          const wrapper = shallowMount(Login, { store, router, localVue })
          await wrapper.vm.login()
          expect(wrapper.vm.$store.state.flash).toEqual({ msg: 'ログインしました', type: 'success' })
        })

        it('sets currentUser', async () => {
          axios.post.mockResolvedValueOnce(resp_200)
          const wrapper = shallowMount(Login, { store, router, localVue })
          await wrapper.vm.login()
          expect(wrapper.vm.$store.state.currentUser).toEqual(mockUser)
        })

        it('push home page', async () => {
          axios.post.mockResolvedValueOnce(resp_200)
          const wrapper = shallowMount(Login, { store, router, localVue })
          wrapper.vm.login()
          await nextTick()
          expect(wrapper.vm.$route.path).toBe('/')
        })
      })

      describe('when status is 401', () => {
        it('sets errors', async () => {
          axios.post.mockRejectedValueOnce(resp_401)
          const wrapper = shallowMount(Login, { store, router, localVue })
          await wrapper.vm.login()
          expect(wrapper.vm.$data.errors).toEqual(['アドレスまたはパスワードが違います'])
        })
      })

      describe('when status is 403', () => {
        it('sets flash', async () => {
          axios.post.mockRejectedValueOnce(resp_403)
          const wrapper = shallowMount(Login, { store, router, localVue })
          await wrapper.vm.login()
          expect(wrapper.vm.$store.state.flash).toEqual({ msg: '既にログインしています', type: 'warning' })
        })

        it('push home page', async () => {
          axios.post.mockRejectedValueOnce(resp_403)
          const wrapper = shallowMount(Login, { store, router, localVue })
          wrapper.vm.login()
          await nextTick()
          expect(wrapper.vm.$route.path).toBe('/')
        })
      })

      describe('when status is 404', () => {
        it('sets errors', async () => {
          axios.post.mockRejectedValueOnce(resp_404)
          const wrapper = shallowMount(Login, { store, router, localVue })
          await wrapper.vm.login()
          expect(wrapper.vm.$data.errors).toEqual(['アカウントが見つかりませんでした'])
        })
      })

      describe('when status is 500', () => {
        it('sets errors', async () => {
          axios.post.mockRejectedValueOnce(resp_500)
          const wrapper = shallowMount(Login, { store, router, localVue })
          await wrapper.vm.login()
          expect(wrapper.vm.$data.errors).toEqual(['未知のエラー'])
        })
      })
    })
  })

  describe('Validations', () => {
    it('validates email presence', async () => {
      const wrapper = mount(Login, { localVue })
      const input = wrapper.find('#email')

      input.setValue('')
      const observer = wrapper.vm.$refs.observer
      await observer.validate()

      expect(wrapper.text()).toMatch('メールアドレスを入力してください')
    })

    it('validates email length', async () => {
      const wrapper = mount(Login, { localVue })
      const input = wrapper.find('#email')

      input.setValue('a'.repeat(240) + '@example.com')
      const observer = wrapper.vm.$refs.observer
      await observer.validate()

      expect(wrapper.text()).toMatch('メールアドレスは250文字以内で入力してください')
    })

    it('validates email format', async () => {
      const wrapper = mount(Login, { localVue })
      const input = wrapper.find('#email')

      input.setValue('wrong@bar,com')
      const observer = wrapper.vm.$refs.observer
      await observer.validate()

      expect(wrapper.text()).toMatch('メールアドレスは正しい形式で入力してください')
    })

    it('validates password presence', async () => {
      const wrapper = mount(Login, { localVue })
      const input = wrapper.find('#password')

      input.setValue('')
      const observer = wrapper.vm.$refs.observer
      await observer.validate()

      expect(wrapper.text()).toMatch('パスワードを入力してください')
    })

    it('validates password length', async () => {
      const wrapper = mount(Login, { localVue })
      const input = wrapper.find('#password')

      input.setValue('foo')
      const observer = wrapper.vm.$refs.observer
      await observer.validate()

      expect(wrapper.text()).toMatch('パスワードは6文字以上で入力してください')
    })
  })
})