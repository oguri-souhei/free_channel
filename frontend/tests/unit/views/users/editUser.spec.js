import { mount, shallowMount,createLocalVue } from '@vue/test-utils'
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
      const wrapper = mount(EditUser, { store, localVue })

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
      const resolvedResponse = { data: { data: updatedUser }, status: 200 }
      const rejectedResponse = { response: { data: { errors: ['エラーメッセージ'] }, status: 400 }}

      axios.patch
        .mockResolvedValueOnce(resolvedResponse)
        .mockResolvedValueOnce(resolvedResponse)
        .mockRejectedValueOnce(rejectedResponse)

      describe('when status is 200', () => {
        it('update currentUser', async () => {
          const wrapper = mount(EditUser, { store, router, localVue })
          await wrapper.vm.updateUser()
          expect(wrapper.vm.$store.state.currentUser).toEqual(updatedUser)
        })

        it('update flash', async () => {
          const wrapper = mount(EditUser, { store, router, localVue })
          await wrapper.vm.updateUser()
          expect(wrapper.vm.$store.state.flash).toEqual({ msg: 'アカウントを編集しました', type: 'success'})
        })
      })

      describe('when status is 400', () => {
        it('update errors', async () => {
          const wrapper = mount(EditUser, { store, router, vuetify, localVue })
          await wrapper.vm.updateUser()
          expect(wrapper.vm.$data.errors).toEqual(['エラーメッセージ'])
        })
      })
    })
  })

  // バリデーション
  describe('Validation', () => {
    it('validates name presence', async () => {
      const wrapper = mount(EditUser, { store, localVue})
      const input = wrapper.find('#name')

      input.setValue('')
      await wrapper.vm.$refs.observer.validate()

      expect(wrapper.text()).toMatch('名前を入力してください')
    })

    it('validates email presence', async () => {
      const wrapper = mount(EditUser, { store, localVue})
      const input = wrapper.find('#name')

      input.setValue('a'.repeat(51))
      await wrapper.vm.$refs.observer.validate()

      expect(wrapper.text()).toMatch('名前は50文字以内で入力してください')
    })

    it('validates email presence', async () => {
      const wrapper = mount(EditUser, { store, localVue})
      const input = wrapper.find('#email')

      input.setValue('')
      await wrapper.vm.$refs.observer.validate()

      expect(wrapper.text()).toMatch('メールアドレスを入力してください')
    })

    it('validates email length', async () => {
      const wrapper = mount(EditUser, { store, localVue})
      const input = wrapper.find('#email')

      input.setValue('a'.repeat(240) + '@example.com')
      await wrapper.vm.$refs.observer.validate()

      expect(wrapper.text()).toMatch('メールアドレスは250文字以内で入力してください')
    })

    it('validates email format', async () => {
      const wrapper = mount(EditUser, { store, localVue})
      const input = wrapper.find('#email')

      input.setValue('wrong@bar,com')
      await wrapper.vm.$refs.observer.validate()

      expect(wrapper.text()).toMatch('メールアドレスは正しい形式で入力してください')
    })

    it('validates password length', async () => {
      const wrapper = mount(EditUser, { store, localVue})
      const input = wrapper.find('#password')

      input.setValue('foo')
      await wrapper.vm.$refs.observer.validate()

      expect(wrapper.text()).toMatch('パスワードは6文字以上で入力してください')
    })

    it('validates password confirmed', async () => {
      const wrapper = mount(EditUser, { store, localVue})

      wrapper.find('#password').setValue('password')
      wrapper.find('#password_confirmation').setValue('foobar')

      await wrapper.vm.$refs.observer.validate()

      expect(wrapper.text()).toMatch('パスワード（確認用）とパスワードの入力が一致しません')
    })
  })
})