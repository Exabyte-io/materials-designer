import {Widget} from "./widget";

/**
 * http://webdriver.io/guide/testrunner/pageobjects.html.
 */
export class Page extends Widget {

    /**
     * @summary Opens the page.
     */
    open(path, forceLoad = false) {
        exabrowser.urlForceLoad(path, forceLoad);
        this.waitForVisible();
        this.waitForLoaderToDisappear();
    }

    getUrl() {return exabrowser.getUrl()}

}
