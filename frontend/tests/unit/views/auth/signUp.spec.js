import { mount } from '@vue/test-utils'
import SignUp from '@/views/auth/SignUp.vue'

describe('SignUp.vue', () => {
  it('is Vue instance', () => {
    const wrapper = mount(SignUp)
    expect(wrapper.vm).toBeTruthy()
  })

  // バリデーション

  it('validates name presence', async () => {
    const wrapper = mount(SignUp)
    const input = wrapper.find('#name')

    input.setValue('')
    const observer = wrapper.vm.$refs.observer
    await observer.validate()

    expect(wrapper.text()).toMatch('名前を入力してください')
  })

  it('validates email presence', async () => {
    const wrapper = mount(SignUp)
    const input = wrapper.find('#name')

    input.setValue('a'.repeat(51))
    const observer = wrapper.vm.$refs.observer
    await observer.validate()

    expect(wrapper.text()).toMatch('名前は50文字以内で入力してください')
  })

  it('validates email presence', async () => {
    const wrapper = mount(SignUp)
    const input = wrapper.find('#email')

    input.setValue('')
    const observer = wrapper.vm.$refs.observer
    await observer.validate()

    expect(wrapper.text()).toMatch('メールアドレスを入力してください')
  })

  it('validates email length', async () => {
    const wrapper = mount(SignUp)
    const input = wrapper.find('#email')

    input.setValue('a'.repeat(240) + '@example.com')
    const observer = wrapper.vm.$refs.observer
    await observer.validate()

    expect(wrapper.text()).toMatch('メールアドレスは250文字以内で入力してください')
  })

  it('validates email format', async () => {
    const wrapper = mount(SignUp)
    const input = wrapper.find('#email')

    input.setValue('wrong@bar,com')
    const observer = wrapper.vm.$refs.observer
    await observer.validate()

    expect(wrapper.text()).toMatch('メールアドレスは正しい形式で入力してください')
  })

  it('validates password presence', async () => {
    const wrapper = mount(SignUp)
    const input = wrapper.find('#password')

    input.setValue('')
    const observer = wrapper.vm.$refs.observer
    await observer.validate()

    expect(wrapper.text()).toMatch('パスワードを入力してください')
  })

  it('validates password length', async () => {
    const wrapper = mount(SignUp)
    const input = wrapper.find('#password')

    input.setValue('foo')
    const observer = wrapper.vm.$refs.observer
    await observer.validate()

    expect(wrapper.text()).toMatch('パスワードは6文字以上で入力してください')
  })
  
  it('validates password_confirmation presence', async () => {
    const wrapper = mount(SignUp)
    const input = wrapper.find('#password_confirmation')

    input.setValue('')
    const observer = wrapper.vm.$refs.observer
    await observer.validate()

    expect(wrapper.text()).toMatch('パスワード（確認用）を入力してください')
  })

  it('validates password confirmed', async () => {
    const wrapper = mount(SignUp)
    wrapper.find('#password').setValue('password')
    wrapper.find('#password_confirmation').setValue('foobar')

    const observer = wrapper.vm.$refs.observer
    await observer.validate()

    expect(wrapper.text()).toMatch('パスワード（確認用）とパスワードの入力が一致しません')
  })

  // SignUpメソッドのテストも書きたい。。。
})