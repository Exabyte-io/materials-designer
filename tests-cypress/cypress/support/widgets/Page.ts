import browser from "../browser";
import Widget from "./Widget";

export default class Page extends Widget {
    open(path: string) {
        this.go(path);
        this.waitForVisible();
        this.waitForLoaderToDisappear();
    }

    go(path: string) {
        return cy.visit(path);
    }
}
