describe("Create and Edit Property", () => {
  before(() => {
    Cypress.session.clearAllSavedSessions();
  });

  beforeEach(() => {
    cy.loginUser();
  });

  it("should create a new property", () => {
    cy.visit(`${Cypress.env("BASE_URL")}/property/add`);

    cy.get("[data-cy='property-name-input']").type("Test Property");
    cy.get("[data-cy='property-address-input']").type("123 Test St");
    cy.get("[data-cy='property-city-input']").type("Test City");
    cy.get("[data-cy='property-state-input']").type("TS");
    cy.get("[data-cy='property-country-input']").type("USA");
    cy.get("[data-cy='property-zip-code-input']").type("12345");

    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/property/").and("include", "/details");

    cy.get("[data-sonner-toast]")
      .should("be.visible")
      .and("contain", "Property created successfully.");

    cy.contains("Test Property").should("be.visible");
  });

  it("should edit an existing property", () => {
    cy.visit(`${Cypress.env("BASE_URL")}/property/add`);
    cy.get("[data-cy='property-name-input']").type("Property to Edit");
    cy.get("[data-cy='property-address-input']").type("456 Edit Ave");
    cy.get("[data-cy='property-city-input']").type("Edit City");
    cy.get("[data-cy='property-state-input']").type("ED");
    cy.get("[data-cy='property-country-input']").type("USA");
    cy.get("[data-cy='property-zip-code-input']").type("54321");
    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/property/").and("include", "/details");
    cy.contains("Property to Edit").should("be.visible");

    let propertyId;
    cy.url().then((url) => {
      const parts = url.split("/");
      propertyId = parts[parts.length - 2];

      cy.visit(`${Cypress.env("BASE_URL")}/property/${propertyId}/edit`);
    });

    cy.get("[data-cy='property-name-input']")
      .clear()
      .type("Edited Property Name");
    cy.get("[data-cy='property-address-input']")
      .clear()
      .type("789 Edited Street");

    cy.get('button[type="submit"]').click();

    cy.url().should("include", "/property/").and("include", "/details");
    cy.get("[data-sonner-toast]")
      .should("be.visible")
      .and("contain", "Property updated successfully.");

    cy.contains("Edited Property Name").should("be.visible");
    cy.contains("789 Edited Street").should("be.visible");
    cy.contains("Property to Edit").should("not.exist");
  });
});
