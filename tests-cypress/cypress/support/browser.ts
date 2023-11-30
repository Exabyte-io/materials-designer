require("cypress-xpath");

class Browser {
    go(path: string) {
        return cy.visit(path);
    }

    waitForVisible(selector: string, timeout = 10000) {
        return cy.get(selector, { timeout }).should("be.visible");
    }

    waitForDisappear(selector: string, timeout = 10000) {
        return cy.get(selector, { timeout }).should("not.exist");
    }

    waitForHide(selector: string, timeout = 10000) {
        return cy.get(selector, { timeout }).should("be.hidden");
    }

    waitForValue(selector: string, timeout = 10000) {
        return cy.get(selector, { timeout }).should("exist");
    }

    /**
     * @summary Clear the field, and then set its value
     * @param selector {String} CSS selector for the field in question
     * @param value {String} The final value to be left in the field
     */
    setInputValue(selector: string, value: string | number, clear = true) {
        const input = cy.get(selector);

        if (clear) {
            return input.clear().type(value.toString());
        }

        return input.type(value.toString());
    }

    setInputValueByXpath(selector: string, value: string | number, clear = true) {
        const input = cy.xpath(selector);

        if (clear) {
            return input.clear().type(value);
        }

        return input.type(value);
    }

    click(selector: string, options?: Partial<Cypress.ClickOptions>) {
        return cy.get(selector).click(options);
    }

    clickIfExists(selector: string) {
        cy.document().then(($document) => {
            const documentResult = $document.querySelectorAll(selector);
            if (documentResult.length) {
                documentResult.forEach((item) => item.click());
            }
        });
    }

    geInputValue(selector: string) {
        return cy.get(selector).invoke("val");
    }

    geInputValueByXpath(path: string) {
        return cy.xpath(path).invoke("val");
    }

    clickByXpath(path: string) {
        return cy.xpath(path).click();
    }

    clickOnText(text: string) {
        return cy.contains(text).click();
    }

    execute(cb: (win: Cypress.AUTWindow) => void) {
        return cy.window().then((win) => cb(win));
    }

    isVisible(selector: string) {
        return cy.get(selector).should("be.visible");
    }

    uploadFileFromFilePath(selector: string, filePath: string) {
        return cy.get(selector).selectFile(filePath, { force: true });
    }
}

const browser = new Browser();

export default browser;
