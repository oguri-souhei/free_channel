beforeEach(() => {
  cy.server()
})

const user = { id: 1, name: 'foo', email: 'foo@bar.com', password: 'password', password_confirmation: 'password' }

describe('Sign up', () => {
  // ユーザー登録一連の流れ
  it('user sign up', () => {
    cy.route('/api/v1/login_user', { data: null })
    cy.visit('/sign_up')
    cy.contains('button', '登録').should('be.enabled')
    cy.contains('label', '名前').next('input').type(user.name)
    cy.contains('label', 'メールアドレス').next('input').type(user.email)
    cy.contains('label', 'パスワード').next('input').type(user.password)
    cy.contains('label', 'パスワード（確認用）').next('input').type(user.password_confirmation).blur()
    // APIをモック化
    cy.route({
      method: 'POST',
      url: '/api/v1/auth/sign_up',
      response: {
        data: {
          data: user
        },
        status: 200
      }
    })
    cy.contains('button', '登録').should('not.be.disabled').click()
    cy.contains('div', 'アカウントを登録しました')
  })

  // 未知のエラー
  it('faled to sign up', () => {
    cy.route('/api/v1/login_user', { data: null })
    cy.visit('/sign_up')
    cy.contains('label', '名前').next('input').type(user.name)
    cy.contains('label', 'メールアドレス').next('input').type(user.email)
    cy.contains('label', 'パスワード').next('input').type(user.password)
    cy.contains('label', 'パスワード（確認用）').next('input').type(user.password_confirmation).blur()
    cy.route({
      method: 'POST',
      url: '/api/v1/sign_up',
      response: {
        data: {},
        status: 500
      }
    })
    cy.contains('button', '登録').click()
    cy.contains('div', '未知のエラー')
  })

  // ナビゲーションガードのテスト（既にログインしている）
  it('fail to sign up when user is logged in', () => {
    cy.route('/api/v1/login_user', { data: { data: user } })
    cy.visit('/sign_up')
    cy.contains('このページにはアクセスできません')
  })

  // フォームのバリデーション
  it('validates attributes', () => {
    cy.route('/api/v1/login_user', { data: null })
    cy.visit('/sign_up')
    cy.contains('h2', 'アカウント登録')
    cy.contains('button', '登録').should('be.disabled') // ボタンは無効になっているか？
    // nameのバリデーション
    cy.contains('label', '名前').next('input').type('   ').blur()
    cy.contains('名前を入力してください')
    cy.contains('label', '名前').next('input').clear().type('a'.repeat(51)).blur()
    cy.contains('名前は50文字以内で入力してください')
    // emailのバリデーション
    cy.contains('label', 'メールアドレス').next('input').type('   ').blur()
    cy.contains('メールアドレスを入力してください')
    cy.contains('label', 'メールアドレス').next('input').clear().type('a'.repeat(242) + '@test.com').blur()
    cy.contains('メールアドレスは250文字以内で入力してください')
    cy.contains('label', 'メールアドレス').next('input').clear().type('hoge').blur()
    cy.contains('メールアドレスは正しい形式で入力してください')
    // passwordのバリデーション
    cy.contains('label', 'パスワード').next('input').type('   ').blur()
    cy.contains('パスワードを入力してください')
    cy.contains('label', 'パスワード').next('input').clear().type('aaaa').blur()
    cy.contains('パスワードは6文字以上で入力してください')
    // password_confirmationのバリデーション
    cy.contains('label', 'パスワード（確認用）').next('input').type('   ').blur()
    cy.contains('パスワード（確認用）を入力してください')
    cy.contains('label', 'パスワード').next('input').clear().type('password')
    cy.contains('label', 'パスワード（確認用）').next('input').clear().type('password_confirmation').blur()
    cy.contains('パスワード（確認用）とパスワードの入力が一致しません')
    cy.contains('button', '登録').should('be.disabled') // ボタンは無効になっているか？
  })
})
