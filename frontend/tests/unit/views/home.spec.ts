import { shallowMount, createLocalVue } from '@vue/test-utils'

import Home from '@/views/Home.vue'

const localVue = createLocalVue()

describe('Home.vue', () => {
  describe('UI', () => {
    it('has app name', () => {
      const wrapper = shallowMount(Home, { localVue })
      expect(wrapper.text()).toMatch('ふりーちゃんねる')
    })

    it('has buttons', () => {
      const wrapper = shallowMount(Home, { localVue })
      expect(wrapper.find('#search-rooms').exists()).toBeTruthy
      expect(wrapper.find('#new-room').exists()).toBeFalsy
    })
  })
})