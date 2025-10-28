describe('Main Page Component', () => {
  beforeEach(() => {
    // Visit the main page before each test
    cy.visit('http://localhost:3000/');
  });

  describe('Content Rendering', () => {
    it('should render the Hello World message', () => {
      cy.get('div').should('contain', 'Hello World');
    });

    it('should have exactly one div element', () => {
      cy.get('div').should('have.length', 1);
    });

    it('should display the correct text content', () => {
      cy.get('div').should('have.text', 'Hello World');
    });
  });

  describe('Page Structure', () => {
    it('should have a valid HTML structure', () => {
      cy.get('html').should('exist');
      cy.get('body').should('exist');
    });

    it('should have proper document structure', () => {
      cy.document().should('have.property', 'body');
    });
  });

  describe('Performance', () => {
    it('should load quickly', () => {
      cy.visit('http://localhost:3000/', {
        onBeforeLoad: (win) => {
          win.performance.mark('start-loading');
        },
        onLoad: (win) => {
          win.performance.mark('end-loading');
          win.performance.measure('page-load', 'start-loading', 'end-loading');
        }
      });

      cy.window().then((win) => {
        const measure = win.performance.getEntriesByName('page-load')[0];
        expect(measure.duration).to.be.lessThan(3000); // Should load in less than 3 seconds
      });
    });
  });

  describe('Responsive Design', () => {
    it('should be visible on mobile viewport', () => {
      cy.viewport('iphone-x');
      cy.get('div').should('be.visible');
    });

    it('should be visible on tablet viewport', () => {
      cy.viewport('ipad-2');
      cy.get('div').should('be.visible');
    });

    it('should be visible on desktop viewport', () => {
      cy.viewport(1920, 1080);
      cy.get('div').should('be.visible');
    });
  });
});
