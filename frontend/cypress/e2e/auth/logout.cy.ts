describe("User Logout", () => {
  const TEST_USERNAME = "TestUser";
  const TEST_PASSWORD = "TestUserPassword";

  beforeEach(() => {
    cy.request<{ access: string; refresh: string }>({
      method: "POST",
      url: "http://localhost:8000/api/token/",
      body: {
        username: TEST_USERNAME,
        password: TEST_PASSWORD,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      localStorage.setItem("authTokens", JSON.stringify(response.body));
      cy.visit("http://localhost:5173");
    });

    cy.get("[data-testid='login-nav-link']").should("not.exist");
    cy.get("[data-testid='logout-nav-link']").should("be.visible");
  });

  it("successfully logs out the user and navigates to the login page", () => {
    cy.get("[data-testid='logout-nav-link']").click();
    cy.url().should("include", "/login");
    cy.get("[data-sonner-toast]")
      .should("be.visible")
      .and("contain", "Logged out successfully");
    cy.get("[data-testid='login-nav-link']").should("be.visible");
    cy.get("[data-testid='logout-nav-link']").should("not.exist");
  });
});
