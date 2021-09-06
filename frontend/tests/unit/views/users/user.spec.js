import { shallowMount,createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import store from '@/store/index'
import VueRouter from 'vue-router'
import router from '@/router/index'
import axios from 'axios'
import axiosUtils from '@/plugins/axios'

import User from '@/views/users/User.vue'

const localVue = createLocalVue()
localVue.use(Vuex)
localVue.use(VueRouter)
localVue.use(axiosUtils, { axios })

jest.mock('axios')

const mockUser = {
  id: 1,
  name: 'mock user',
  email: 'test@example.com',
  avatar: {
    url: 'http://localhost:3000/foo/bar.jpg'
  }
}
const noAvatarUser = { id: 2, name: 'Noabatar', email: 'no@avatar.com' }
const resp_200 = { data: { data: mockUser }, status: 200 }
const resp_no_avatar = { data: { data: noAvatarUser }, status: 200 }
const resp_404 = { response: { data: { message: '404' }, status: 404 } }
const resp_500 = { response: { data: null }, status: 500 }

axios.get
  .mockResolvedValueOnce(resp_200)
  .mockResolvedValueOnce(resp_200)
  .mockResolvedValueOnce(resp_200)
  .mockResolvedValueOnce(resp_200)
  .mockResolvedValueOnce(resp_no_avatar)
  .mockRejectedValueOnce(resp_404)
  .mockRejectedValueOnce(resp_500)
  .mockRejectedValueOnce(resp_500)

describe('User.vue', () => {
  describe('Data', () => {
    it('sets user', async () => {
      const wrapper = shallowMount(User, { router, store, localVue })
      // created hookが実行される前にexpectが実行されてしまう。。。
      setTimeout(() => {
        expect(wrapper.vm.$data.user).toEqual(mockUser)
      }, 1)
    })
  })

  describe('Computed', () => {
    describe('isCurrentUser', () => {
      it('returns false unless currentUser', () => {
        const wrapper = shallowMount(User, { router, store, localVue })
        setTimeout(() => {
          expect(wrapper.vm.isCurrentUser).toBeFalse()
        }, 1);
      })
      it('returns true when currentUser', () => {
        store.dispatch('setCurrentUser', mockUser)
        const wrapper = shallowMount(User, { router, store, localVue })
        setTimeout(() => {
          expect(wrapper.vm.isCurrentUser).toBeTruthy()
        }, 1)
      })
    })

    describe('avatarUrl', () => {
      it('returns url when avatar url', () => {
        const wrapper = shallowMount(User, { router, store, localVue })
        setTimeout(() => {
          expect(wrapper.vm.avatarUrl).toBe(mockUser.avatar.url)
        }, 1);
      })

      it('returns null unless avatar url', () => {
        const wrapper = shallowMount(User, { router, store, localVue })
        setTimeout(() => {
          expect(wrapper.vm.avatarUrl).toBeNull()
        }, 1);
      })
    })
  })

  describe('Methods', () => {
    describe('setUser', () => {
      describe('when status is 404', () => {
        it('sets flash', async () => {
          const wrapper = shallowMount(User, { router, store, localVue })
          setTimeout(() => {
            expect(wrapper.vm.$store.state.flash).toEqual({ msg: 'ユーザーが見つかりませんでした', type: 'warning'})
          }, 1);
        })

        it('push home page', () => {
          const wrapper = shallowMount(User, { router, store, localVue })
          setTimeout(() => {
            expect(wrapper.vm.$route.path).toBe('/')
          }, 1);
        })
      })

      describe('when status is 500', () => {
        it('sets flash', () => {
          const wrapper = shallowMount(User, { store, router, localVue })
          setTimeout(() => {
            expect(wrapper.vm.$store.state.flash).toEqual({ msg: '未知のエラー', type: 'error'})
          }, 1);
        })

        it('push home page', () => {
          const wrapper = shallowMount(User, { router, store, localVue })
          setTimeout(() => {
            expect(wrapper.vm.$route.path).toBe('/')
          }, 1);
        })
      })
    })
  })
})