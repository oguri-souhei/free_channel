const rooms = [
  { id: 1, name: 'Foo room', category: 'プログラミング', created_at: '2021-09-17T09:46:02.431+09:00', comment_count: 1 },
  { id: 2, name: 'Foo bar', category: 'プログラミング', created_at: '2021-09-17T09:46:02.431+09:00', comment_count: 1 },
  { id: 3, name: 'Foo bazz', category: 'プログラミング', created_at: '2021-09-17T09:46:02.431+09:00', comment_count: 1 },
]

beforeEach(() => {
  cy.server()
})

describe('index rooms', () => {
  it('show index rooms', () => {
    cy.route('/api/v1/login_user', { data: null })
    cy.route({
      method: 'GET',
      url: '/api/v1/rooms?page=1',
      response: {
        data: {
          rooms,
          length: 1
        }
      }
    })
    cy.visit('/rooms')
    cy.contains(rooms[0].name)
    cy.contains(rooms[1].name)
    cy.contains(rooms[2].name)
  })

  it('when error', () => {
    cy.route('/api/v1/login_user', { data: null })
    cy.route({
      method: 'GET',
      url: '/api/v1/rooms?page=1',
      response: {},
      status: 500
    })
    cy.visit('/rooms')
    cy.contains('未知のエラー')
  })
})
