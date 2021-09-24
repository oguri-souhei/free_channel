import { shallowMount, createLocalVue } from '@vue/test-utils'
import axios from 'axios'
import axiosUtils from '@/plugins/axios'
import VueRouter from 'vue-router'
import router from '@/router/index'

import Comment from '@/components/comments/Comment.vue'

const localVue = createLocalVue()
localVue.use(axiosUtils, { axios })
localVue.use(VueRouter)

jest.mock('axios')

const propsData = {
  id: 1,
  sentence: 'this is comment.',
  createdAt: '2021-09-17T09:46:02.431+09:00',
  userName: 'foo',
  avatar: { url: 'http://bar.com' },
  userId: 1,
  isFavorited: false,
  favoriteCount: 100
}

describe('Comment.vue', () => {
  describe('Props data', () => {
    it('sets props data', () => {
      const wrapper = shallowMount(Comment, { propsData, router, localVue })
      expect(wrapper.vm.$props.id).toBe(1)
      expect(wrapper.vm.$props.sentence).toBe('this is comment.')
      expect(wrapper.vm.$props.userName).toBe('foo')
      expect(wrapper.vm.avatar).toEqual({ url: 'http://bar.com' })
      expect(wrapper.vm.$props.userId).toBe(1)
      expect(wrapper.vm.$props.isFavorited).toBeFalsey
      expect(wrapper.vm.$props.favoriteCount).toBe(100)
    })
  })

  describe('Data', () => {
    describe('flag', () => {
      it('sets true when isFavorite is true', () => {
        const wrapper = shallowMount(Comment, { propsData, router, localVue })
        expect(wrapper.vm.$data.flag).toBeTruthy
      })

      it('sets false when isFavorited is false', () => {
        propsData.isFavorited = false
        const wrapper = shallowMount(Comment, { propsData, router, localVue })
        expect(wrapper.vm.$data.flag).toBeFalsey
      })
    })

    describe('count', () => {
      it('sets favoriteCount', () => {
        const wrapper = shallowMount(Comment, { propsData, router, localVue })
        expect(wrapper.vm.$data.count).toBe(100)
      })
    })
  })

  describe('Computed', () => {
    describe('createdDate', () => {
      it('returns date', () => {
        const wrapper = shallowMount(Comment, { propsData, router, localVue })
        expect(wrapper.vm.createdDate).toBe('2021年09月17日')
      })
    })
  })

  describe('Methods', () => {
    describe('favorite', () => {
      it('increments count', () => {
        const wrapper = shallowMount(Comment, { propsData, router, localVue })
        expect(wrapper.vm.$data.count).toBe(100)
        wrapper.vm.favorite()
        expect(wrapper.vm.$data.count).toBe(101)
      })

      it('toggles flag', () => {
        propsData.isFavorited = false
        const wrapper = shallowMount(Comment, { propsData, router, localVue })
        expect(wrapper.vm.$data.flag).toBeFalsey
        wrapper.vm.favorite()
        expect(wrapper.vm.$data.flag).toBeTruthy
      })
    })

    describe('unfavorite', () => {
      it('decrements count', () => {
        const wrapper = shallowMount(Comment, { propsData, router, localVue })
        expect(wrapper.vm.$data.count).toBe(100)
        wrapper.vm.unfavorite()
        expect(wrapper.vm.$data.count).toBe(99)
      })

      it('toggles flag', () => {
        propsData.isFavorited = true
        const wrapper = shallowMount(Comment, { propsData, router, localVue })
        expect(wrapper.vm.$data.flag).toBeTruthy
        wrapper.vm.unfavorite()
        expect(wrapper.vm.$data.flag).toBeFalsey
      })
    })
  })
})