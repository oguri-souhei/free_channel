import { mount, shallowMount, createLocalVue } from '@vue/test-utils'
import SignUp from '@/views/auth/SignUp.vue'
import vuetify  from '@/plugins/vuetify'
import axios from 'axios'
import axiosUtils from '@/plugins/axios'
import Vuex from 'vuex'
import store from '@/store/index'
import VueRouter from 'vue-router'
import router from '@/router/index'
import { nextTick } from 'vue'

const localVue = createLocalVue()
localVue.use(axiosUtils, { axios })
localVue.use(Vuex)
localVue.use(VueRouter)

jest.mock('axios')

describe('SignUp.vue', () => {
  describe('Data', () => {
    it('define user', () => {
      const wrapper = shallowMount(SignUp, { localVue })
      expect(wrapper.vm.$data.user.name).toBe('')
      expect(wrapper.vm.$data.user.email).toBe('')
      expect(wrapper.vm.$data.user.password).toBe('')
      expect(wrapper.vm.$data.user.password_confirmation).toBe('')
    })

    it('define errors', () => {
      const wrapper = shallowMount(SignUp, { localVue })
      expect(wrapper.vm.$data.errors).toEqual([])
    })
  })

  describe('Methos', () => {
    describe('signUp', () => {
      const mockUser = { id: 1, name: 'foo', email: 'foo@bar.com' }
      const resp_200 = { data: { data: mockUser }, status: 200 }
      const resp_400 = { response: { data: { errors: ['400'] }, status: 400 } }
      const resp_403 = { response: { data: { errors: ['403'] }, status: 403 } }
      const resp_500 = { response: { data: null, status: 500 } }

      describe('when status is 200', () => {
        it('sets currentUser', async () => {
          axios.post.mockResolvedValueOnce(resp_200)
          const wrapper = shallowMount(SignUp, { store, router ,localVue})
          await wrapper.vm.signUp()
          expect(wrapper.vm.$store.state.currentUser).toEqual(mockUser)
        })

        it('sets flush', async () => {
          axios.post.mockResolvedValueOnce(resp_200)
          const wrapper = shallowMount(SignUp, { store, router ,localVue})
          await wrapper.vm.signUp()
          expect(wrapper.vm.$store.state.flash).toEqual({ msg: '????????????????????????????????????', type: 'success' })
        })

        it('push home page', async () => {
          axios.post.mockResolvedValueOnce(resp_200)
          const wrapper = shallowMount(SignUp, { store, router, localVue })
          wrapper.vm.signUp()
          await nextTick()
          expect(wrapper.vm.$route.path).toBe('/')
        })
      })

      describe('when status is 400', () => {
        it('sets errors', async () => {
          axios.post.mockRejectedValueOnce(resp_400)
          const wrapper = shallowMount(SignUp, { store, router, localVue })
          await wrapper.vm.signUp()
          expect(wrapper.vm.$data.errors).toEqual(['400'])
        })
      })

      describe('when status is 403', () => {
        it('sets flash', async () => {
          axios.post.mockRejectedValueOnce(resp_403)
          const wrapper = shallowMount(SignUp, { store, router, localVue })
          await wrapper.vm.signUp()
          expect(wrapper.vm.$store.state.flash).toEqual({ msg: '?????????????????????????????????', type: 'error' })
        })

        it('push home page', async () => {
          axios.post.mockRejectedValueOnce(resp_403)
          const wrapper = shallowMount(SignUp, { store, router, localVue })
          wrapper.vm.signUp()
          await nextTick()
          expect(wrapper.vm.$route.path).toBe('/')
        })
      })

      describe('when status is 500', () => {
        it('sets flash', async () => {
          axios.post.mockRejectedValueOnce(resp_500)
          const wrapper = shallowMount(SignUp, { store, router, localVue })
          await wrapper.vm.signUp()
          expect(wrapper.vm.$store.state.flash).toEqual({ msg: '??????????????????', type: 'error'})
        })
      })
    })
  })

  describe('Validations', () => {
    it('validates name presence', async () => {
      const wrapper = mount(SignUp, { vuetify, localVue })
      const input = wrapper.find('#name')

      input.setValue('')
      const observer = wrapper.vm.$refs.observer
      await observer.validate()

      expect(wrapper.text()).toMatch('?????????????????????????????????')
    })

    it('validates email presence', async () => {
      const wrapper = mount(SignUp, { vuetify, localVue })
      const input = wrapper.find('#name')

      input.setValue('a'.repeat(51))
      const observer = wrapper.vm.$refs.observer
      await observer.validate()

      expect(wrapper.text()).toMatch('?????????50???????????????????????????????????????')
    })

    it('validates email presence', async () => {
      const wrapper = mount(SignUp, { vuetify, localVue })
      const input = wrapper.find('#email')

      input.setValue('')
      const observer = wrapper.vm.$refs.observer
      await observer.validate()

      expect(wrapper.text()).toMatch('????????????????????????????????????????????????')
    })

    it('validates email length', async () => {
      const wrapper = mount(SignUp, { vuetify, localVue })
      const input = wrapper.find('#email')

      input.setValue('a'.repeat(240) + '@example.com')
      const observer = wrapper.vm.$refs.observer
      await observer.validate()

      expect(wrapper.text()).toMatch('????????????????????????250???????????????????????????????????????')
    })

    it('validates email format', async () => {
      const wrapper = mount(SignUp, { vuetify, localVue })
      const input = wrapper.find('#email')

      input.setValue('wrong@bar,com')
      const observer = wrapper.vm.$refs.observer
      await observer.validate()

      expect(wrapper.text()).toMatch('??????????????????????????????????????????????????????????????????')
    })

    it('validates password presence', async () => {
      const wrapper = mount(SignUp, { vuetify, localVue })
      const input = wrapper.find('#password')

      input.setValue('')
      const observer = wrapper.vm.$refs.observer
      await observer.validate()

      expect(wrapper.text()).toMatch('??????????????????????????????????????????')
    })

    it('validates password length', async () => {
      const wrapper = mount(SignUp, { vuetify, localVue })
      const input = wrapper.find('#password')

      input.setValue('foo')
      const observer = wrapper.vm.$refs.observer
      await observer.validate()

      expect(wrapper.text()).toMatch('??????????????????6???????????????????????????????????????')
    })
    
    it('validates password_confirmation presence', async () => {
      const wrapper = mount(SignUp, { vuetify, localVue })
      const input = wrapper.find('#password_confirmation')

      input.setValue('')
      const observer = wrapper.vm.$refs.observer
      await observer.validate()

      expect(wrapper.text()).toMatch('?????????????????????????????????????????????????????????')
    })

    it('validates password confirmed', async () => {
      const wrapper = mount(SignUp, { vuetify, localVue })
      wrapper.find('#password').setValue('password')
      wrapper.find('#password_confirmation').setValue('foobar')

      const observer = wrapper.vm.$refs.observer
      await observer.validate()

      expect(wrapper.text()).toMatch('??????????????????????????????????????????????????????????????????????????????')
    })
  })
})