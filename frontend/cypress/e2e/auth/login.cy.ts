describe("User Login", () => {
  it("Is Loging In", () => {
    cy.visit("http://localhost:5173/");
    cy.get("[data-testid='login-nav-link']").click();
    cy.url().should("include", "/login");
    cy.get("[data-testid='username-field']").type("TestUser");
    cy.get("[data-testid='password-field']").type("TestUserPassword");
    cy.get("[data-testid='login-submit']").click();

    cy.url().should("include", "/");
    cy.get('[data-content=""] > div').should("contain", "Logged In");
  });
});
