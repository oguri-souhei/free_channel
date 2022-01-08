import { shallowMount, createLocalVue } from '@vue/test-utils'
import axios from 'axios'
import axiosUtils from '@/plugins/axios'
import VueRouter from 'vue-router'
import router from '@/router/index'
import Vuex from 'vuex'
import store from '@/store/index'
import { nextTick } from 'vue'

import ShowRoom from '@/views/rooms/ShowRoom.vue'

const localVue = createLocalVue()
localVue.use(axiosUtils, { axios })
localVue.use(VueRouter)
localVue.use(Vuex)

jest.mock('axios')
const $cable = {
  subscriptions: {
    create: jest.fn()
  }
}

const mockUser = { id: 1, name: 'mock user', email: 'foo@bar.com' }
const mockRoom = { id: 1, name: 'Sample Room', category: 'プログラミング', user_id: mockUser.id }
const comments = [
  { id: 1, sentence: 'first comment', user_name: 'foo', user_id: 1, created_at: '2021-09-10 13:18:57' },
  { id: 2, sentence: 'second comment', user_name: 'bar', user_id: 2, created_at: '2021-09-10 13:18:57' },
  { id: 3, sentence: 'third comment', user_name: 'foo', user_id: 1, created_at: '2021-09-10 13:18:57' }
]
const resp_200 = { data: { data: { room: mockRoom, comments: comments } },status: 200 }
const resp_403 = { response: { data: { error: '403' }, status: 403 }}
const resp_404 = { response: { data: { error: '404' }, status: 404 }}
const resp_500 = { response: { data: { msg: '500' }, status: 500 } }

describe('ShowRoom.vue', () => {
  describe('UI', () => {
    it('renders room name', () => {
      axios.get.mockResolvedValueOnce(resp_200)
      const wrapper = shallowMount(ShowRoom, { router, store, localVue })
      setTimeout(() => {
        expect(wrapper.text()).toMatch(mockRoom.name)
      }, 1)
    })

    it('renders room category', () => {
      axios.get.mockResolvedValueOnce(resp_200)
      const wrapper = shallowMount(ShowRoom, { router, store, localVue })
      setTimeout(() => {
        expect(wrapper.text()).toMatch(mockRoom.name)
      }, 1)
    })

    it('renders comments', () => {
      axios.get.mockResolvedValueOnce(resp_200)
      const wrapper = shallowMount(ShowRoom, { router, store, localVue })
      setTimeout(() => {
        comments.forEach(comment => {
          expect(wrapper.text()).toMatch(comment.sentence)
        })
      }, 1)
    })
  })

  describe('Computed', () => {
    describe('isOwner', () => {
      it('returns true when current user is room owner', () => {
        store.dispatch('setCurrentUser', mockUser)
        axios.get.mockResolvedValueOnce(resp_200)
        const wrapper = shallowMount(ShowRoom, { router, store, localVue, mocks: { $cable }})
        setTimeout(() => {
          expect(wrapper.vm.isOwner).toBeTruthy()
        }, 1)
      })

      it('returns false when current user is not room owner', () => {
        store.dispatch('setCurrentUser', null)
        axios.get.mockResolvedValueOnce(resp_200)
        const wrapper = shallowMount(ShowRoom, { router, store, localVue })
        setTimeout(() => {
          expect(wrapper.vm.isOwner).toBeFalsy()
        }, 1)
      })
    })
  })

  describe('Methods', () => {
    describe('setRoom', () => {
      describe('when status is 200', () => {
        it('sets room', () => {
          axios.get.mockResolvedValueOnce(resp_200)
          const wrapper = shallowMount(ShowRoom, { router, store, localVue })
          setTimeout(() => {
            expect(wrapper.vm.$data.room).toEqual(mockRoom)
          }, 1)
        })
      })

      describe('when status is 404', () => {
        it('sets flash', () => {
          axios.get.mockRejectedValueOnce(resp_404)
          const wrapper = shallowMount(ShowRoom, { router, store, localVue })
          setTimeout(() => {
            expect(wrapper.vm.$store.flash).toEqual({ msg: '部屋が見つかりませんでした', type: 'error'})
          }, 1)
        })

        it('push home page', () => {
          axios.get.mockRejectedValueOnce(resp_404)
          const wrapper = shallowMount(ShowRoom, { router, store, localVue })
          setTimeout(() => {
            expect(wrapper.vm.$route.path).toBe('/')
          }, 1)
        })
      })

      describe('when other status', () => {
        it('sets flash', () => {
          axios.mockRejectedValueOnce(resp_500)
          const wrapper = shallowMount(ShowRoom, { router, store, localVue })
          setTimeout(() => {
            expect(wrapper.vm.$store.flash).toEqual({ msg: '未知のエラー', type: 'error' })
          }, 1)
        })

        it('push home page', () => {
          axios.get.mockRejectedValueOnce(resp_500)
          const wrapper = shallowMount(ShowRoom, { router, store, localVue })
          setTimeout(() => {
            expect(wrapper.vm.$route.path).toBe('/')
          }, 1)
        })
      })
    })

    describe('destroyRoom', () => {
      beforeEach(() => {
        global.confirm = jest.fn(() => true)
      })

      describe('when status is 200', () => {
        it('sets flash', async () => {
          axios.delete.mockResolvedValueOnce(resp_200)
          const wrapper = shallowMount(ShowRoom, { router, store, localVue })
          await wrapper.vm.destroyRoom()
          expect(wrapper.vm.$store.state.flash).toEqual({ msg: '部屋を削除しました', type: 'success' })
        })

        it('push home page', async () => {
          axios.delete.mockResolvedValueOnce(resp_200)
          const wrapper = shallowMount(ShowRoom, { router, store, localVue })
          wrapper.vm.destroyRoom()
          await nextTick()
          expect(wrapper.vm.$route.path).toBe('/')
        })
      })

      describe('when status is 403', () => {
        it('sets flash', async () => {
          axios.delete.mockRejectedValueOnce(resp_403)
          const wrapper = shallowMount(ShowRoom, { router, store, localVue })
          await wrapper.vm.destroyRoom()
          expect(wrapper.vm.$store.state.flash).toEqual({ msg: 'この操作は禁止されています', type: 'error' })
        })
      })

      describe('when status is 404', () => {
        it('sets flash', async () => {
          axios.delete.mockRejectedValueOnce(resp_404)
          const wrapper = shallowMount(ShowRoom, { router, store, localVue })
          await wrapper.vm.destroyRoom()
          expect(wrapper.vm.$store.state.flash).toEqual({ msg: '部屋を見つけることができませんでした', type: 'error' })
        })
      })

      describe('when status is 500', () => {
        it('sets flash', async () => {
          axios.delete.mockRejectedValueOnce(resp_500)
          const wrapper = shallowMount(ShowRoom, { router, store, localVue })
          await wrapper.vm.destroyRoom()
          expect(wrapper.vm.$store.state.flash).toEqual({ msg: '未知のエラー', type: 'error' })
        })
      })
    })

    describe('keyDownEnter', () => {
      it('sets keyCode', async () => {
        const wrapper = shallowMount(ShowRoom, { router, store, localVue })
        wrapper.vm.keyDownEnter(new Event('keydown', { key: 'enter' }))
        setTimeout(() => {
          expect(wrapper.vm.$data.keyDownCode).toBe(13)
        }, 1)
      })
    })

    describe('createComment', () => {
      describe('when user is not logged in', () => {
        it('sets flash', async () => {
          await store.dispatch('setCurrentUser', null)
          const wrapper = shallowMount(ShowRoom, { router, store, localVue })
          wrapper.setData({ comment: 'comment' })
          wrapper.vm.createComment()
          setTimeout(() => {
            expect(wrapper.vm.$store.flash).toEqual({ msg: 'コメントするにはログインしてください', type: 'warning' })
          }, 1)
        })

        it('push home page', async () => {
          const wrapper = shallowMount(ShowRoom, { router, store, localVue })
          wrapper.setData({ comment: 'comment' })
          wrapper.vm.createComment()
          await nextTick()
          expect(wrapper.vm.$route.path).toBe('/login')
        })
      })
    })
  })
})
