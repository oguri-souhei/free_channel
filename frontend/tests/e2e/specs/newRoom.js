const user = {
  id: 1,
  name: 'foo',
  email: 'foo@bar.com'
}
const room = {
  id: 1,
  theme: 'きのこ派？たけのこ派？',
  description: 'This is room description.',
  opinion_1: 'きのこ派',
  opinion_2: 'たけのこ派'
}

beforeEach(() => {
  cy.server()
})

describe('New room', () => {
  it('create room', () => {
    cy.route('/api/v1/login_user', { data: user })
    cy.route({
      method: 'POST',
      url: '/api/v1/rooms',
      response: {
        data: room
      },
      status: 200
    })
    cy.visit('/rooms/new')
    cy.contains('部屋作成')
    cy.contains('button', '作成').should('be.disabled')
    cy.contains('label', 'テーマ').next('input').clear().type(room.theme)
    cy.contains('label', '部屋の説明').next('textarea').clear().type(room.description)
    cy.contains('label', '意見A').next('input').clear().type(room.opinion_1)
    cy.contains('label', '意見B').next('input').clear().type(room.opinion_2).blur()
    cy.contains('button', '作成').should('not.be.disabled').click()
    cy.contains('部屋を作成しました')
    cy.url().should('be', 'http://localhost:8081/rooms/' + room.id)
  })

  it('when status is 400', () => {
    cy.route('/api/v1/login_user', { data: user })
    cy.route({
      method: 'POST',
      url: '/api/v1/rooms',
      response: {
        errors: ['名前を入力してください']
      },
      status: 400
    })
    cy.visit('/rooms/new')
    cy.contains('button', '作成').should('be.disabled')
    cy.contains('label', 'テーマ').next('input').clear().type(room.theme)
    cy.contains('label', '部屋の説明').next('textarea').clear().type(room.description)
    cy.contains('label', '意見A').next('input').clear().type(room.opinion_1)
    cy.contains('label', '意見B').next('input').clear().type(room.opinion_2).blur()
    cy.contains('button', '作成').should('not.be.disabled').click()
    cy.contains('名前を入力してください')
  })

  it('when status is 500', () => {
    cy.route('/api/v1/login_user', { data: user })
    cy.route({
      method: 'POST',
      url: '/api/v1/rooms',
      response: {},
      status: 500
    })
    cy.visit('/rooms/new')
    cy.contains('button', '作成').should('be.disabled')
    cy.contains('label', 'テーマ').next('input').clear().type(room.theme)
    cy.contains('label', '部屋の説明').next('textarea').clear().type(room.description)
    cy.contains('label', '意見A').next('input').clear().type(room.opinion_1)
    cy.contains('label', '意見B').next('input').clear().type(room.opinion_2).blur()
    cy.contains('button', '作成').should('not.be.disabled').click()
    cy.contains('未知のエラー')
  })

  it('navigation guard', () => {
    cy.route('/api/v1/login_user', { data: null })
    cy.visit('/rooms/new')
    cy.contains('このページにアクセスするにはログインする必要があります')
  })
})