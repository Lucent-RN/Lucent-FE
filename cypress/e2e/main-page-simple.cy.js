describe('Main Page - Simple Test', () => {
  it('should display Hello World', () => {
    // Visit the main page
    cy.visit('http://localhost:3000/');

    // Check if the div contains "Hello World"
    cy.get('div').should('contain', 'Hello World');

    // Verify the exact text content
    cy.get('div').should('have.text', 'Hello World');
  });
});
