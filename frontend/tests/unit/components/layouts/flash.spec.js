import { shallowMount,createLocalVue } from '@vue/test-utils'
import Vuex from 'vuex'
import store from '@/store/index'
import Flash from '@/components/layouts/Flash.vue'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Flash.vue', () => {
  describe('Data', () => {
    it('defines flag', () => {
      const wrapper = shallowMount(Flash, { store, localVue })
      expect(wrapper.vm.$data.flag).toBe(false)
    })
  })

  describe('Computed', () => {
    describe('flash', () => {
      it('returns flash', () => {
        store.dispatch('setFlash', { msg: 'set flash!', type: 'success' })
        const wrapper = shallowMount(Flash, { store, localVue })
        expect(wrapper.vm.flash).toEqual({ msg: 'set flash!', type: 'success' })
      })
    })
  })
})
