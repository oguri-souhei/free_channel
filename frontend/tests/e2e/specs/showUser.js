const user = { id: 1, name: 'foo', email: 'foo@bar.com', avatar: null }
const rooms = [
  { id: 1, name: 'Foo room', category: 'プログラミング', created_at: '2021-09-17T09:46:02.431+09:00', comment_count: 1 },
  { id: 2, name: 'Foo bar', category: 'プログラミング', created_at: '2021-09-17T09:46:02.431+09:00', comment_count: 1 },
  { id: 3, name: 'Foo bazz', category: 'プログラミング', created_at: '2021-09-17T09:46:02.431+09:00', comment_count: 1 },
]

beforeEach(() => {
  cy.server()
})

describe('User page', () => {
  it('shows user attributes', () => {
    cy.route('/api/v1/login_user', { data: null })
    cy.route({
      method: 'GET',
      url: '/api/v1/users/' + user.id,
      response: {
        data: {
          user,
          rooms
        }
      },
      status: 200
    })
    cy.visit('/users/' + user.id)
    cy.contains(user.name)
    cy.contains(user.email)
    cy.contains(rooms[0].name)
    cy.contains(rooms[1].name)
    cy.contains(rooms[2].name)
  })

  it('shows account update link', () => {
    cy.route('/api/v1/login_user', { data: user })
    cy.route({
      method: 'GET',
      url: '/api/v1/users/' + user.id,
      response: {
        data: {
          user,
          rooms
        }
      },
      status: 200
    })
    cy.visit('/users/' + user.id)
    cy.contains('アカウント編集').click()
    cy.url().should('be', 'http://localhost:8081/users/edit')
  })

  it('when user is not found', () => {
    cy.route('/api/v1/login_user', { data: null })
    cy.route({
      method: 'GET',
      url: '/api/v1/users/' + user.id,
      response: {},
      status: 404
    })
    cy.visit('/users/'+ user.id)
    cy.contains('ユーザーが見つかりませんでした')
    cy.url().should('be', 'http://localhost:8081/')
  })

  it('when other error', () => {
    cy.route('/api/v1/login_user', { data: null })
    cy.route({
      method: 'GET',
      url: '/api/v1/users/' + user.id,
      response: {},
      status: 500
    })
    cy.visit('/users/' + user.id)
    cy.contains('未知のエラー')
    cy.url().should('be', 'http://localhost:8081/')
  })
})