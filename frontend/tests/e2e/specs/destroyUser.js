const user = { id: 1, name: 'foo', email: 'foo@bar.com' }

beforeEach(() => {
  cy.server()
})

describe('Update user', () => {
  it('updates user', () => {
    cy.route('/api/v1/login_user', { data: user })
    cy.visit('/users/edit')
    cy.contains('アカウント編集')
    cy.route({
      method: 'DELETE',
      url: '/api/v1/auth/registrations',
      response: {},
      status: 200
    })
    cy.contains('退会する').click()
    cy.contains('退会しました')
    cy.url().should('be', 'http://localhost:8081/')
    cy.contains('ログイン')
    cy.contains('アカウント登録')
  })

  it('fail to update user', () => {
    cy.route('/api/v1/login_user', { data: user })
    cy.visit('/users/edit')
    cy.route({
      method: 'DELETE',
      url: '/api/v1/auth/registrations',
      response: {},
      status: 500
    })
    cy.contains('退会する').click()
    cy.contains('未知のエラー')
  })
})