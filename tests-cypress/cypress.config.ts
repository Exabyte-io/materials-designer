/* eslint-disable import/no-extraneous-dependencies */
import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import createEsbuildPlugin from "@badeball/cypress-cucumber-preprocessor/esbuild";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { defineConfig } from "cypress";

export default defineConfig({
    e2e: {
        specPattern: "cypress/**/*.feature",
        // Due to https://github.com/cypress-io/cypress/issues/22040 in GitHub Actions
        supportFile: false,
        async setupNodeEvents(
            on: Cypress.PluginEvents,
            config: Cypress.PluginConfigOptions,
        ): Promise<Cypress.PluginConfigOptions> {
            await addCucumberPreprocessorPlugin(on, config);
            on(
                "file:preprocessor",
                createBundler({
                    plugins: [createEsbuildPlugin(config)],
                }),
            );
            return config;
        },
        viewportHeight: 800,
    },
});
