import { defineConfig } from "cypress";
import vitePreprocessor from "cypress-vite";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173/",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    setupNodeEvents(on, config) {
      on("file:preprocessor", vitePreprocessor());

      return config;
    },
  },
  env: {
    TEST_USERNAME: "TestUser",
    TEST_PASSWORD: "TestUserPassword",
    BASE_URL: "http://localhost:5173",
  },
});
