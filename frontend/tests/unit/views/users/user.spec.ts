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
const rooms = [
  { id: 1, name: 'First room', category: 'プログラミング', created_at: '2021-09-17T09:46:02.431+09:00', comment_count: 100 },
  { id: 2, name: 'Second room', category: 'プログラミング', created_at: '2021-09-17T09:46:02.431+09:00', comment_count: 100 },
  { id: 3, name: 'Third room', category: 'プログラミング', created_at: '2021-09-17T09:46:02.431+09:00', comment_count: 100 },
]
const noAvatarUser = { id: 2, name: 'Noabatar', email: 'no@avatar.com' }
const resp_200 = { data: { data: { user: mockUser, rooms } }, status: 200 }
const resp_no_avatar = { data: { data: { user: noAvatarUser, rooms } }, status: 200 }
const resp_404 = { response: { data: { message: '404' }, status: 404 } }
const resp_500 = { response: { data: null }, status: 500 }

describe('User.vue', () => {
  describe('Data', () => {
    it('sets user', async () => {
      axios.get.mockResolvedValueOnce(resp_200)
      const wrapper = shallowMount(User, { router, store, localVue })
      setTimeout(() => {
        expect(wrapper.vm.$data.user).toEqual(mockUser)
      }, 1)
    })

    it('sets rooms', () => {
      axios.get.mockResolvedValueOnce(resp_200)
      const wrapper = shallowMount(User, { router, store, localVue })
      setTimeout(() => {
        expect(wrapper.vm.$data.rooms).toEqual(rooms)
      }, 1)
    })
  })

  describe('Computed', () => {
    describe('isCurrentUser', () => {
      it('returns false unless currentUser', () => {
        axios.get.mockResolvedValueOnce(resp_200)
        const wrapper = shallowMount(User, { router, store, localVue })
        setTimeout(() => {
          expect(wrapper.vm.isCurrentUser).toBeFalse()
        }, 1);
      })
      it('returns true when currentUser', () => {
        axios.get.mockResolvedValueOnce(resp_200)
        store.dispatch('setCurrentUser', mockUser)
        const wrapper = shallowMount(User, { router, store, localVue })
        setTimeout(() => {
          expect(wrapper.vm.isCurrentUser).toBeTruthy()
        }, 1)
      })
    })

    describe('avatarUrl', () => {
      it('returns url when avatar url', () => {
        axios.get.mockResolvedValueOnce(resp_200)
        const wrapper = shallowMount(User, { router, store, localVue })
        setTimeout(() => {
          expect(wrapper.vm.avatarUrl).toBe(mockUser.avatar.url)
        }, 1);
      })

      it('returns null unless avatar url', () => {
        axios.get.mockResolvedValueOnce(resp_no_avatar)
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
          axios.get.mockRejectedValue(resp_404)
          const wrapper = shallowMount(User, { router, store, localVue })
          setTimeout(() => {
            expect(wrapper.vm.$store.state.flash).toEqual({ msg: 'ユーザーが見つかりませんでした', type: 'warning'})
          }, 1);
        })

        it('push home page', () => {
          axios.get.mockRejectedValue(resp_404)
          const wrapper = shallowMount(User, { router, store, localVue })
          setTimeout(() => {
            expect(wrapper.vm.$route.path).toBe('/')
          }, 1);
        })
      })

      describe('when status is 500', () => {
        it('sets flash', () => {
          axios.get.mockRejectedValue(resp_500)
          const wrapper = shallowMount(User, { store, router, localVue })
          setTimeout(() => {
            expect(wrapper.vm.$store.state.flash).toEqual({ msg: '未知のエラー', type: 'error'})
          }, 1);
        })

        it('push home page', () => {
          axios.get.mockRejectedValue(resp_500)
          const wrapper = shallowMount(User, { router, store, localVue })
          setTimeout(() => {
            expect(wrapper.vm.$route.path).toBe('/')
          }, 1);
        })
      })
    })
  })
})