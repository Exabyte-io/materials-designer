import { BrowserSettings } from "@mat3ra/tede/src/js/cypress/Browser";

// Times are all in milliseconds
const SETTINGS: BrowserSettings = {
    timeouts: {
        xxs: 1 * 1000,
        xs: 3 * 1000,
        sm: 10 * 1000,
        md: 30 * 1000,
        lg: 60 * 1000,
        xl: 180 * 1000,
        xxl: 600 * 1000,
        xxxl: 1800 * 1000,
    },
};

export default SETTINGS;
