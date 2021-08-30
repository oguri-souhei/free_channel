import { mount } from '@vue/test-utils'
import Login from '@/views/auth/Login.vue'

describe('Login.vue', () => {
  it('is Vue instance', () => {
    const wrapper = mount(Login)
    expect(wrapper.vm).toBeTruthy()
  })

  // バリデーション

  it('validates email presence', async () => {
    const wrapper = mount(Login)
    const input = wrapper.find('#email')

    input.setValue('')
    const observer = wrapper.vm.$refs.observer
    await observer.validate()

    expect(wrapper.text()).toMatch('メールアドレスを入力してください')
  })

  it('validates email length', async () => {
    const wrapper = mount(Login)
    const input = wrapper.find('#email')

    input.setValue('a'.repeat(240) + '@example.com')
    const observer = wrapper.vm.$refs.observer
    await observer.validate()

    expect(wrapper.text()).toMatch('メールアドレスは250文字以内で入力してください')
  })

  it('validates email format', async () => {
    const wrapper = mount(Login)
    const input = wrapper.find('#email')

    input.setValue('wrong@bar,com')
    const observer = wrapper.vm.$refs.observer
    await observer.validate()

    expect(wrapper.text()).toMatch('メールアドレスは正しい形式で入力してください')
  })

  it('validates password presence', async () => {
    const wrapper = mount(Login)
    const input = wrapper.find('#password')

    input.setValue('')
    const observer = wrapper.vm.$refs.observer
    await observer.validate()

    expect(wrapper.text()).toMatch('パスワードを入力してください')
  })

  it('validates password length', async () => {
    const wrapper = mount(Login)
    const input = wrapper.find('#password')

    input.setValue('foo')
    const observer = wrapper.vm.$refs.observer
    await observer.validate()

    expect(wrapper.text()).toMatch('パスワードは6文字以上で入力してください')
  })

  // loginメソッドのテストも書きたい。。。
})