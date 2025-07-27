describe('Main Page', () => {
  beforeEach(() => {
    // Visit the main page before each test
    cy.visit('http://localhost:3000/');
  });

  it('should display Hello World message', () => {
    // Check if the page loads successfully
    cy.get('div').should('contain', 'Hello World');
  });

  it('should have correct page title', () => {
    // Check if the page title is set correctly
    cy.title().should('not.be.empty');
  });

  it('should render the main page component', () => {
    // Verify the main div element exists
    cy.get('div').should('exist');

    // Check if the text content is exactly "Hello World"
    cy.get('div').should('have.text', 'Hello World');
  });

  it('should be accessible', () => {
    // Basic accessibility check
    cy.get('div').should('be.visible');
  });
});
