const user = { id: 1, name: 'foo', email: 'foo@bar.com', password: 'foobar' }

beforeEach(() => {
  cy.server()
})

describe('Login', () => {
  it('user log in', () => {
    cy.route('/api/v1/login_user', { data: null })
    cy.visit('/login')
    cy.contains('ログイン')
    cy.contains('label', 'メールアドレス').next('input').type(user.email)
    cy.contains('label', 'パスワード').next('input').type(user.password).blur()
    // ログイン用APIのモック
    cy.route({
      method: 'POST',
      url: '/api/v1/auth/login',
      response: {
        data: user
      },
      status: 200
    })
    cy.contains('button', 'ログイン').should('not.be.disabled').click()
    cy.contains('div', 'ログインしました')
  })

  // 違うパスワードでログインしようとした場合
  it('when wrong password', () => {
    cy.route('/api/v1/login_user', { data: null })
    cy.visit('/login')
    cy.contains('label', 'メールアドレス').next('input').clear().type(user.email)
    cy.contains('label', 'パスワード').next('input').clear().type('wrongpassword').blur()
    // 401の時のモック
    cy.route({
      method: 'POST',
      url: '/api/v1/auth/login',
      response: {
        errors: { message: 'アドレスまたはパスワードが違います' }
      },
      status: 401
    })
    cy.contains('button', 'ログイン').should('be.disabled').click()
    cy.contains('アドレスまたはパスワードが違います')
  })

  // 既にログインしている
  it('when user is logged in', () => {
    cy.route('/api/v1/login_user', { data: null })
    cy.visit('/login')
    cy.contains('label', 'メールアドレス').next('input').clear().type(user.email)
    cy.contains('label', 'パスワード').next('input').clear().type(user.password).blur()
    cy.route({
      method: 'POST',
      url: '/api/v1/auth/login',
      response: {
        message: 'User has already logged in.'
      },
      status: 403
    })
    cy.contains('button', 'ログイン').should('not.be.disabled').click()
    cy.contains('既にログインしています')
    cy.url().should('eq', 'http://localhost:8080/')
  })

  // ナビゲーションガードのテスト
  it('navigation guard', () => {
    cy.route('/api/v1/login_user', { data: user })
    cy.visit('/login')
    cy.contains('このページにはアクセスできません')
  })

  // アカウントが見つからなかった
  it('when user is not found', () => {
    cy.route('/api/v1/login_user', { data: null })
    cy.visit('/login')
    cy.contains('label', 'メールアドレス').next('input').clear().type(user.email)
    cy.contains('label', 'パスワード').next('input').clear().type(user.password).blur()
    cy.route({
      method: 'POST',
      url: '/api/v1/auth/login',
      response: {
        errors: { message: 'アカウントが見つかりませんでした' }
      },
      status: 404
    })
    cy.contains('button', 'ログイン').click()
    cy.contains('アカウントが見つかりませんでした')
  })

  // その他のエラー
  it('other errors', () => {
    cy.route('/api/v1/login_user', { data: null })
    cy.visit('/login')
    cy.contains('label', 'メールアドレス').next('input').clear().type(user.email)
    cy.contains('label', 'パスワード').next('input').clear().type(user.password).blur()
    cy.route({
      method: 'POST',
      url: '/api/v1/auth/login',
      response: {},
      status: 500
    })
    cy.contains('button', 'ログイン').click()
    cy.contains('未知のエラー')
  })

  // バリデーション
  it('validates attributes', () => {
    cy.route('/api/v1/login_user', { data: null })
    cy.visit('/login')
    cy.contains('button', 'ログイン').should('be.disabled')
    // メールアドレス
    cy.contains('label', 'メールアドレス').next('input').type('   ').blur()
    cy.contains('メールアドレスを入力してください')
    cy.contains('label', 'メールアドレス').next('input').clear().type('hoge').blur()
    cy.contains('メールアドレスは正しい形式で入力してください')
    cy.contains('label', 'メールアドレス').next('input').clear().type('a'.repeat(242) + '@test.com').blur()
    cy.contains('メールアドレスは250文字以内で入力してください')
    // パスワード
    cy.contains('label', 'パスワード').next('input').clear().type('  ').blur()
    cy.contains('パスワードを入力してください')
    cy.contains('label', 'パスワード').next('input').clear().type('aaa')
    cy.contains('パスワードは6文字以上で入力してください')
    cy.contains('button', 'ログイン').should('be.disabled')
  })
})