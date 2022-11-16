import { SETTINGS } from "./settings";
import { initializeExaBrowserHook } from "./utils/exabrowser";

let isFeatureStarted = false;

/**
 * @summary Sets browser size to minimal resolution.
 */
function setViewportSizeHook() { exabrowser.setViewportSize(SETTINGS.VIEWPORT_SIZE); }

/*
 * Hooks are run Before/After each scenario
 */
export default function () {
    this.Before(() => {
        if (!isFeatureStarted) {
            initializeExaBrowserHook(); // KEEP THIS FIRST!
            setViewportSizeHook();
        }
        isFeatureStarted = true;
    });

    this.After(() => {
    });
}
