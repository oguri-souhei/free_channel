describe('My First Test', () => {
  it('Visits the app root url', () => {
    cy.visit('/')
    cy.contains('h1', 'ふりーちゃんねる')
    cy.get('div.buttons').contains('部屋を探す').should('have.attr', 'href', '/rooms')
    cy.get('div.buttons').contains('部屋を作る').should('have.attr', 'href', '/rooms/new')
  })
})
