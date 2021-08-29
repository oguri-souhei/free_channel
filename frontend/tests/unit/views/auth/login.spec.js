import { mount, flushPromises } from '@vue/test-utils'
import Login from '@/views/auth/Login.vue'

describe('Login.vue', () => {
  it('is Vue instance', () => {
    const wrapper = mount(Login)
    expect(wrapper.vm).toBeTruthy()
  })
})