describe("Simple Site Visit", () => {
  it("passes", () => {
    cy.visit("http://localhost:5173");
  });
});
