import { shallowMount } from '@vue/test-utils'
import Avatar from '@/components/users/Avatar.vue'

describe('Avatar.vue', () => {
  describe('Props', () => {
    it('receives url', () => {
      const wrapper = shallowMount(Avatar, {
        propsData: { url: '/foobar.jpg' }
      })
      expect(wrapper.props().url).toBe('/foobar.jpg')
    })

    it('receives size', () => {
      const wrapper = shallowMount(Avatar, {
        propsData: { size: 50 }
      })
      expect(wrapper.props().size).toBe(50)
    })

    it('define default size', () => {
      const defaultSize = 70
      const wrapper = shallowMount(Avatar)
      expect(wrapper.props().size).toBe(defaultSize)
    })
  })

  describe('Computed', () => {
    describe('avatarUrl', () => {
      const apiHost = 'http://localhost:80'
      beforeEach(() => {
        process.env.VUE_APP_API_HOST = apiHost
      })

      it('returns fullpath', () => {
        const wrapper = shallowMount(Avatar, {
          propsData: { url: '/foo.jpg'}
        })
        expect(wrapper.vm.avatarUrl).toBe(apiHost + '/foo.jpg')
      })
    })
  })
})