import {Widget} from "./widget";

/**
 * http://webdriver.io/guide/testrunner/pageobjects.html.
 */
export class Page extends Widget {

    // override upon inheritance for static routes.
    get path() {}

    /**
     * @summary Opens the page.
     */
    open(path = this.path, forceLoad = false) {
        exabrowser.urlForceLoad(path, forceLoad);
        this.waitForVisible();
        this.waitForLoaderToDisappear();
    }

    getUrl() {return exabrowser.getUrl()}

    getEntityId() {return this.getUrl().split("/").slice(-1)[0]}
}
