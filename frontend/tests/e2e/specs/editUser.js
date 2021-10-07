const user = { id: 1, name: 'foo', email: 'foo@bar.com', password: 'password' }
const newUser = { name: 'hoge', email: 'hoge@bar.com', password: 'hogehoge' }

beforeEach(() => {
  cy.server()
})

describe('Edit user', () => {
  it('user edit attributes', () => {
    cy.route('/api/v1/login_user', { data: user })
    cy.visit('/users/edit')
    cy.contains('アカウント編集')
    cy.contains('button', '送信').should('be.disabled')
    // ユーザーの元の名前とメールアドレスがフォームに入力されているか？
    cy.contains('label', '名前').next('input').should('be', user.name)
    cy.contains('label', 'メールアドレス').next('input').should('be', user.email)
    cy.contains('label', '名前').next('input').clear().type(newUser.name)
    cy.contains('label', 'メールアドレス').next('input').clear().type(newUser.email)
    cy.contains('label', 'パスワード').next('input').clear().type(newUser.password)
    cy.contains('label', 'パスワード（確認用）').next('input').clear().type(newUser.password)
    cy.contains('label', '現在のパスワード').next('input').clear().type(user.password).blur()
    cy.route({
      method: 'PATCH',
      url: '/api/v1/auth/registrations',
      response: {
        data: newUser
      },
      status: 200
    })
    cy.contains('button', '送信').should('not.be.disabled').click()
    cy.contains('アカウントを編集しました')
  })

  // フォームの入力が不正な場合
  it('when response status is 400', () => {
    cy.route('/api/v1/login_user', { data: user })
    cy.visit('/users/edit')
    cy.contains('アカウント編集')
    cy.contains('button', '送信').should('be.disabled')
    // ユーザーの元の名前とメールアドレスがフォームに入力されているか？
    cy.contains('label', '名前').next('input').should('be', user.name)
    cy.contains('label', 'メールアドレス').next('input').should('be', user.email)
    cy.contains('label', '名前').next('input').clear().type(newUser.name)
    cy.contains('label', 'メールアドレス').next('input').clear().type(newUser.email)
    cy.contains('label', 'パスワード').next('input').clear().type(newUser.password)
    cy.contains('label', 'パスワード（確認用）').next('input').clear().type(newUser.password)
    cy.contains('label', '現在のパスワード').next('input').clear().type(user.password).blur()
    cy.route({
      method: 'PATCH',
      url: '/api/v1/auth/registrations',
      response: {
        errors: ['メールアドレスは既に使用されています']
      },
      status: 400
    })
    cy.contains('button', '送信').should('not.be.disabled').click()
    cy.contains('メールアドレスは既に使用されています')
  })

  it('when response status is 500', () => {
    cy.route('/api/v1/login_user', { data: user })
    cy.visit('/users/edit')
    cy.contains('アカウント編集')
    cy.contains('button', '送信').should('be.disabled')
    // ユーザーの元の名前とメールアドレスがフォームに入力されているか？
    cy.contains('label', '名前').next('input').should('be', user.name)
    cy.contains('label', 'メールアドレス').next('input').should('be', user.email)
    cy.contains('label', '名前').next('input').clear().type(newUser.name)
    cy.contains('label', 'メールアドレス').next('input').clear().type(newUser.email)
    cy.contains('label', 'パスワード').next('input').clear().type(newUser.password)
    cy.contains('label', 'パスワード（確認用）').next('input').clear().type(newUser.password)
    cy.contains('label', '現在のパスワード').next('input').clear().type(user.password).blur()
    cy.route({
      method: 'PATCH',
      url: '/api/v1/auth/registrations',
      response: {},
      status: 500
    })
    cy.contains('button', '送信').should('not.be.disabled').click()
    cy.contains('未知のエラー')
  })

  it('validates attributes', () => {
    cy.route('/api/v1/login_user', { data: user })
    cy.visit('/users/edit')
    cy.contains('button', '送信').should('be.disabled') // ボタンは無効になっているか？
    // nameのバリデーション
    cy.contains('label', '名前').next('input').clear().type('   ').blur()
    cy.contains('名前を入力してください')
    cy.contains('label', '名前').next('input').clear().type('a'.repeat(51)).blur()
    cy.contains('名前は50文字以内で入力してください')
    // emailのバリデーション
    cy.contains('label', 'メールアドレス').next('input').clear().type('   ').blur()
    cy.contains('メールアドレスを入力してください')
    cy.contains('label', 'メールアドレス').next('input').clear().type('a'.repeat(242) + '@test.com').blur()
    cy.contains('メールアドレスは250文字以内で入力してください')
    cy.contains('label', 'メールアドレス').next('input').clear().type('hoge').blur()
    cy.contains('メールアドレスは正しい形式で入力してください')
    // passwordのバリデーション
    cy.contains('label', 'パスワード').next('input').clear().type('aaaa').blur()
    cy.contains('パスワードは6文字以上で入力してください')
    // password_confirmationのバリデーション
    cy.contains('label', 'パスワード').next('input').clear().type('password')
    cy.contains('label', 'パスワード（確認用）').next('input').clear().type('password_confirmation').blur()
    cy.contains('パスワード（確認用）とパスワードの入力が一致しません')
    cy.contains('button', '送信').should('be.disabled') // ボタンは無効になっているか？
  })
})