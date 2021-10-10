const user = { id: 1, name: 'foo', email: 'foo@bar.com' }
const room = { id: 1, name: 'Foo room', category: 'プログラミング' }
const newRoom = { name: 'New room', category: 'ゲーム' }

beforeEach(() => {
  cy.server()
})

describe('Edit room', () => {
  it('edit room', () => {
    cy.route('/api/v1/login_user', { data: user })
    cy.route({
      method: 'GET',
      url: `/api/v1/rooms/${room.id}/info`,
      response: {
        data: room
      }
    })
    cy.visit(`/rooms/${room.id}/edit`)
    cy.contains('部屋編集')
    cy.contains('label', '部屋名').next('input').should('be', room.name)
    cy.contains('label', 'カテゴリー').next('input').should('be', room.category)
    cy.contains('label', '部屋名').next('input').clear().type(newRoom.name)
    cy.get('[data-test=test]').type(`${newRoom.category}{enter}`, { force: true }).blur()
    cy.route({
      method: 'PATCH',
      url: `/api/v1/rooms/${room.id}`,
      response: {},
      status: 200
    })
    cy.contains('button', '編集').should('not.be.disabled').click()
    cy.contains('部屋を編集しました')
    cy.url().should('be', 'http://localhost:8081/rooms/' + room.id)
  })

  it('when status is 400', () => {
    cy.route('/api/v1/login_user', { data: user })
    cy.route({
      method: 'GET',
      url: `/api/v1/rooms/${room.id}/info`,
      response: {
        data: room
      }
    })
    cy.route({
      method: 'PATCH',
      url: `/api/v1/rooms/${room.id}`,
      response: {
        errors: ['名前を入力してください']
      },
      status: 400
    })
    cy.visit(`/rooms/${room.id}/edit`)
    cy.contains('部屋編集')
    cy.contains('label', '部屋名').next('input').should('be', room.name)
    cy.contains('label', 'カテゴリー').next('input').should('be', room.category)
    cy.contains('label', '部屋名').next('input').clear().type(newRoom.name)
    cy.get('[data-test=test]').type(`${newRoom.category}{enter}`, { force: true }).blur()
    cy.contains('button', '編集').should('not.be.disabled').click()
    cy.contains('名前を入力してください')
  })

  it('when status is 403', () => {
    cy.route('/api/v1/login_user', { data: user })
    cy.route({
      method: 'GET',
      url: `/api/v1/rooms/${room.id}/info`,
      response: {
        data: room
      }
    })
    cy.route({
      method: 'PATCH',
      url: `/api/v1/rooms/${room.id}`,
      response: {},
      status: 403
    })
    cy.visit(`/rooms/${room.id}/edit`)
    cy.contains('部屋編集')
    cy.contains('label', '部屋名').next('input').should('be', room.name)
    cy.contains('label', 'カテゴリー').next('input').should('be', room.category)
    cy.contains('label', '部屋名').next('input').clear().type(newRoom.name)
    cy.get('[data-test=test]').type(`${newRoom.category}{enter}`, { force: true }).blur()
    cy.contains('button', '編集').should('not.be.disabled').click()
    cy.contains('この操作は禁止されています')
    cy.url().should('be', 'http://localhost:8081/rooms/' + room.id)
  })

  it('when other status', () => {
    cy.route('/api/v1/login_user', { data: user })
    cy.route({
      method: 'GET',
      url: `/api/v1/rooms/${room.id}/info`,
      response: {
        data: room
      }
    })
    cy.route({
      method: 'PATCH',
      url: `/api/v1/rooms/${room.id}`,
      response: {},
      status: 500
    })
    cy.visit(`/rooms/${room.id}/edit`)
    cy.contains('部屋編集')
    cy.contains('label', '部屋名').next('input').should('be', room.name)
    cy.contains('label', 'カテゴリー').next('input').should('be', room.category)
    cy.contains('label', '部屋名').next('input').clear().type(newRoom.name)
    cy.get('[data-test=test]').type(`${newRoom.category}{enter}`, { force: true }).blur()
    cy.contains('button', '編集').should('not.be.disabled').click()
    cy.contains('未知のエラー')
    cy.url().should('be', 'http://localhost:8081/')
  })

  it('navigation guard', () => {
    cy.route('/api/v1/login_user', { data: null })
    cy.visit(`/rooms/${room.id}/edit`)
    cy.contains('このページにアクセスするにはログインする必要があります')
    cy.url().should('be', 'http://localhost:8081/login')
  })
})