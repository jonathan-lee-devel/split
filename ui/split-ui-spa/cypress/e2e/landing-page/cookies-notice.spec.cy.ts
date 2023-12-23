describe('Cookies Notice E2E Tests', () => {
  it('When click on accept Then cookies dialog disappears', () => {
    cy.visit('https://staging.split.direct');
    cy.wait(2000);
    const cookiesDialog = cy.get('mat-dialog-container').should('be.visible');
    cy.get('button').click({force: true});
    cookiesDialog.should('not.exist');
  });
});
