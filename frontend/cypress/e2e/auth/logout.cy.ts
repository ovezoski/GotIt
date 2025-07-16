import { AuthTokens } from "../../../src/types/auth";

describe("User Logout", () => {
  const TEST_USERNAME = "TestUser";
  const TEST_PASSWORD = "TestUserPassword";
  const LOGIN_API_URL = "http://127.0.0.1:8000/api/token/";
  const APP_BASE_URL = "http://localhost:5173";

  before(() => {
    Cypress.session.clearAllSavedSessions();
  });

  beforeEach(() => {
    cy.session("user", () => {
      cy.request<AuthTokens>({
        method: "POST",
        url: LOGIN_API_URL,
        body: {
          username: TEST_USERNAME,
          password: TEST_PASSWORD,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);

        const accessToken = response.body.access;

        console.log(accessToken);
        cy.window().then((win) => {
          win.localStorage.setItem("authTokens", JSON.stringify(response.body));
        });
      });

      cy.visit(APP_BASE_URL);
      cy.get("[data-testid='login-nav-link']").should("not.exist");
      cy.get("[data-testid='logout-nav-link']").should("be.visible");
    });
  });

  it("successfully logs out the user and navigates to the login page", () => {
    cy.visit(APP_BASE_URL);

    cy.get("[data-testid='logout-nav-link']").click();

    cy.get("[data-sonner-toast]")
      .should("be.visible")
      .and("contain", "Logged out.");
    cy.get("[data-testid='login-nav-link']").should("be.visible");
    cy.get("[data-testid='logout-nav-link']").should("not.exist");
  });
});
