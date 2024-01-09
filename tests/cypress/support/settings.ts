import { BrowserSettings } from "@exabyte-io/code.js/dist/cypress/Browser";

// Times are all in milliseconds
const SETTINGS: BrowserSettings = {
    renderTimeoutShort: 5000,
    renderTimeoutMedium: 10000,
    renderTimeoutLong: 30000,
};

export default SETTINGS;
