describe('Organization Page', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/organizations/d8236bb831b3cf845d688612459952ee');
  });

  it('Displays not found', () => {
    cy.url().should('eq', 'http://localhost:4200/error/not-found');
  });
});
