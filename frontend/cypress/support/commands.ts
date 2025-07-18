/// <reference types="cypress" />

import { AuthTokens } from "../../src/types/auth";

declare global {
  /* eslint-disable @typescript-eslint/no-namespace */
  namespace Cypress {
    interface Chainable {
      /**
       * Logs in a user and sets authentication tokens in local storage.
       * @example cy.loginUser();
       */
      loginUser(): Chainable<Element>;
    }
  }
}

Cypress.Commands.add("loginUser", () => {
  const TEST_USERNAME = "TestUser";
  const TEST_PASSWORD = "TestUserPassword";
  const LOGIN_API_URL = "http://127.0.0.1:8000/api/token/";

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

      cy.window().then((win) => {
        win.localStorage.setItem("authTokens", JSON.stringify(response.body));
      });
    });
  });

  // cy.visit(APP_BASE_URL);

  // cy.get("[data-testid='login-nav-link']").should("not.exist");
  // cy.get("[data-testid='logout-nav-link']").should("be.visible");
});

export {};
