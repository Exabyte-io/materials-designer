// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

import data from "@mat3ra/standata/lib/runtime_data/materials";

// Set a before hook to run before all tests
before(() => {
    const materialConfigs = Object.values(data.filesMapByName);
    console.log("before.", materialConfigs);
    Cypress.env("materialConfigs", materialConfigs);
});

// Alternatively you can use CommonJS syntax:
// require('./commands')
