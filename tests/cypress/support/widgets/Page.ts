import browser from "../browser";
import Widget from "./Widget";

export default class Page extends Widget {
    open() {
        browser.go("/");
        this.waitForVisible();
        this.waitForLoaderToDisappear();
    }
}
