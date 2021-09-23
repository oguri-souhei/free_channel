import { shallowMount, createLocalVue } from '@vue/test-utils'
import { dateTime } from '@/modules/date'
import Room from '@/components/rooms/Room.vue'

const localVue = createLocalVue()
const propsData = {
  name: 'foo',
  commentCount: 100,
  createdAt: '2021-09-17T09:46:02.431+09:00'
}

describe('Room.vue', () => {
  describe('Props data', () => {
    it('sets props data', () => {
      const wrapper = shallowMount(Room, { propsData, localVue })
      expect(wrapper.vm.$props.name).toBe(propsData.name)
      expect(wrapper.vm.$props.commentCount).toBe(propsData.commentCount)
      expect(wrapper.vm.$props.createdAt).toBe(propsData.createdAt)
    })
  })

  describe('UI', () => {
    it('renders props data', () => {
      const wrapper = shallowMount(Room, { propsData, localVue })
      expect(wrapper.text()).toMatch(propsData.name)
      expect(wrapper.text()).toMatch(propsData.commentCount.toString())
      expect(wrapper.text()).toMatch(dateTime(propsData.createdAt))
    })
  })
})