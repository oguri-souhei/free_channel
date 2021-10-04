import { mount, shallowMount,createLocalVue } from '@vue/test-utils'
import { nextTick } from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import router from '@/router/index'
import axios from 'axios'
import axiosUtils from '@/plugins/axios'
import vuetify from '@/plugins/vuetify'
import EditUser from '@/views/users/EditUser.vue'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)
localVue.use(axiosUtils, { axios })

jest.mock('axios')

const mockUser = { id: 1, name: 'mock user', email: 'test@example.com', password: 'password' }
const store = new Vuex.Store({
  state: {
    currentUser: mockUser,
    flash: { msg: '', type: '' }
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

describe('EditUser.vue', () => {
  describe('Data', () => {
    // データオブジェクトに現在のユーザーの情報が設定されているか？
    it('has current user data', async () => {
      const wrapper = shallowMount(EditUser, { store, localVue })

      expect(wrapper.vm.$data.user.name).toBe(mockUser.name)
      expect(wrapper.vm.$data.user.email).toBe(mockUser.email)
      expect(wrapper.vm.$data.user.password).toBe('')
      expect(wrapper.vm.$data.user.password_confirmation).toBe('')
      expect(wrapper.vm.$data.user.current_password).toBe('')
    })
  })

  describe('Methods', () => {
    describe('#updateUser', () => {

      const updatedUser = { id: 1, name: 'foobazz', email: 'foobazz@exmaple.com' }
      const resp_200 = { data: { data: updatedUser }, status: 200 }
      const resp_400 = { response: { data: { errors: ['エラーメッセージ'] }, status: 400 }}
      const resp_403 = { response: { data: { errors: ['エラーメッセージ'] }, status: 403 }}

      describe('when status is 200', () => {
        it('update currentUser', async () => {
          axios.patch.mockResolvedValueOnce(resp_200)
          const wrapper = shallowMount(EditUser, { store, router, localVue })
          await wrapper.vm.updateUser()
          expect(wrapper.vm.$store.state.currentUser).toEqual(updatedUser)
        })

        it('update flash', async () => {
          axios.patch.mockResolvedValueOnce(resp_200)
          const wrapper = shallowMount(EditUser, { store, router, localVue })
          await wrapper.vm.updateUser()
          expect(wrapper.vm.$store.state.flash).toEqual({ msg: 'アカウントを編集しました', type: 'success'})
        })

        it('push home page', async () => {
          axios.patch.mockResolvedValueOnce(resp_200)
          const wrapper = shallowMount(EditUser, { store, router, localVue })
          wrapper.vm.updateUser()
          await nextTick()
          expect(wrapper.vm.$route.path).toBe('/')
        })
      })

      describe('when status is 400', () => {
        it('update errors', async () => {
          axios.patch.mockRejectedValueOnce(resp_400)
          const wrapper = shallowMount(EditUser, { store, router, localVue })
          await wrapper.vm.updateUser()
          expect(wrapper.vm.$data.errors).toEqual(['エラーメッセージ'])
        })
      })

      describe('when status is 403', () => {
        it('set flash', async () => {
          axios.patch.mockRejectedValueOnce(resp_403)
          const wrapper = shallowMount(EditUser, { store, router, localVue })
          await wrapper.vm.updateUser()
          expect(wrapper.vm.$store.state.flash).toEqual({ msg: 'この操作は禁止されています', type: 'error' })
        })

        it('push login page', async () => {
          axios.patch.mockRejectedValueOnce(resp_403)
          const wrapper = shallowMount(EditUser, { store, router, localVue })
          wrapper.vm.updateUser()
          await nextTick()
          expect(wrapper.vm.$route.path).toBe('/login')
        })
      })
    })
  })

  // バリデーション
  describe('Validation', () => {
    it('validates name presence', async () => {
      const wrapper = mount(EditUser, { store, vuetify, localVue})
      const input = wrapper.find('#name')

      input.setValue('')
      await wrapper.vm.$refs.observer.validate()

      expect(wrapper.text()).toMatch('名前を入力してください')
    })

    it('validates email presence', async () => {
      const wrapper = mount(EditUser, { store, vuetify,localVue})
      const input = wrapper.find('#name')

      input.setValue('a'.repeat(51))
      await wrapper.vm.$refs.observer.validate()

      expect(wrapper.text()).toMatch('名前は50文字以内で入力してください')
    })

    it('validates email presence', async () => {
      const wrapper = mount(EditUser, { store, vuetify, localVue})
      const input = wrapper.find('#email')

      input.setValue('')
      await wrapper.vm.$refs.observer.validate()

      expect(wrapper.text()).toMatch('メールアドレスを入力してください')
    })

    it('validates email length', async () => {
      const wrapper = mount(EditUser, { store, vuetify,localVue})
      const input = wrapper.find('#email')

      input.setValue('a'.repeat(240) + '@example.com')
      await wrapper.vm.$refs.observer.validate()

      expect(wrapper.text()).toMatch('メールアドレスは250文字以内で入力してください')
    })

    it('validates email format', async () => {
      const wrapper = mount(EditUser, { store, vuetify,localVue})
      const input = wrapper.find('#email')

      input.setValue('wrong@bar,com')
      await wrapper.vm.$refs.observer.validate()

      expect(wrapper.text()).toMatch('メールアドレスは正しい形式で入力してください')
    })

    it('validates password length', async () => {
      const wrapper = mount(EditUser, { store, vuetify, localVue})
      const input = wrapper.find('#password')

      input.setValue('foo')
      await wrapper.vm.$refs.observer.validate()

      expect(wrapper.text()).toMatch('パスワードは6文字以上で入力してください')
    })

    it('validates password confirmed', async () => {
      const wrapper = mount(EditUser, { store, vuetify,localVue})

      wrapper.find('#password').setValue('password')
      wrapper.find('#password_confirmation').setValue('foobar')

      await wrapper.vm.$refs.observer.validate()

      expect(wrapper.text()).toMatch('パスワード（確認用）とパスワードの入力が一致しません')
    })
  })
})