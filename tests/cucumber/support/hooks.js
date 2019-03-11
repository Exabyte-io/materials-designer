import {SETTINGS} from "./settings";
import {initializeExaBrowserHook} from "./utils/exabrowser";

var isFeatureStarted = false;

/**
 * @summary Sets browser size to minimal resolution.
 */
function setViewportSizeHook() {exabrowser.setViewportSize(SETTINGS.VIEWPORT_SIZE)}

/**
 * @summary Makes sure user is logged out after test is done.
 */
function logout() {exabrowser.urlForceLoad("logout")}

/*
 * Hooks are run Before/After each scenario
 */
export default function () {
    this.Before(function () {
        if (!isFeatureStarted) {
            initializeExaBrowserHook(); // KEEP THIS FIRST!
            setViewportSizeHook();
            logout();
        }
        isFeatureStarted = true;
    });

    this.After(function () {
    })
};
