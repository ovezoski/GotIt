describe("User Logout", () => {
  before(() => {
    Cypress.session.clearAllSavedSessions();
  });

  beforeEach(() => {
    cy.loginUser();
  });

  it("logs out the user", () => {
    cy.get("[data-testid='logout-nav-link']").click();

    cy.get("[data-sonner-toast]")
      .should("be.visible")
      .and("contain", "Logged out.");

    cy.get("[data-testid='login-nav-link']").should("be.visible");
    cy.get("@logout-btn").should("not.exist");
  });
});
