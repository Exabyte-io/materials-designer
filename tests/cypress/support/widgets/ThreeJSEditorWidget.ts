import Widget from "./Widget";

const threeJSEditorWidget = {
    wrapper: "#threejs-editor",
    viewport: "#threejs-editor #viewport",
    opener: "#outliner .opener.closed",
    sceneObjectByName: (name: string) =>
        `//div[@class="Outliner"] //div[@class="option" and starts-with(text()," ${name}")]`,
    sceneObjectOpenerByName: (name: string) =>
        `//div[@id="outliner"] //div[contains(@class,"option") and text() = " ${name}"] //span[contains(@class,"opener")]`,
    sidebarTabByTitle: (title: string) =>
        `//div[@id="sidebar"] //div[@id="tabs"] //span[starts-with(text(),"${title}")]`,
    sceneObjectTabByTitle: (title: string) =>
        `//div[@id="sidebar"] //span //div[@id="tabs"] //span[starts-with(text(),"${title}")]`,
    sceneObjectPositionByIndex: (index: number) =>
        `//div[@id="sidebar"] //div[@class="Panel"] //div[@class="Row"] //span[starts-with(text(), "Position")]/following-sibling::input[${index}]`,
    toolbarBtnByTitle: (title: string) =>
        `//div[@id="toolbar"] //button //img[contains(@title,"${title}")]`,
};

// 2D coordinates of the selection box
export interface Coordinates {
    x1: number; // x coordinate of starting point of the selection box
    y1: number; // y coordinate of starting point of the selection box
    x2: number; // x coordinate of ending point of the selection box
    y2: number; // y coordinate of ending point of the selection box
}

export class ThreeJSEditorWidget extends Widget {
    selectors: typeof threeJSEditorWidget;

    constructor() {
        super(threeJSEditorWidget.wrapper);
        this.selectors = threeJSEditorWidget;
    }

    clickOnMenuItem(menuTitle: string, menuItemTitle: string) {
        return cy
            .get(".menu")
            .contains(menuTitle)
            .get(".options")
            .contains(menuItemTitle)
            .click({ force: true });
    }

    clickOnToolbarButton(title: string) {
        const toolbarBtnSelector = this.selectors.toolbarBtnByTitle(title);
        return this.browser.clickByXpath(toolbarBtnSelector);
    }

    /**
     * Creates a selection box above the scene object based on 2D coordinates.
     * Each coordinate must have value from [-1, 1] range.
     * [0, 0] coordinate is the center of the scene, [-1, 1] is the top left corner, [1, -1] is the bottom right corner accordingly.
     * @param coordinates - 2D coordinates of the selection box
     */
    makeMultipleSelection({ x1, y1, x2, y2 }: Coordinates) {
        return cy.get(threeJSEditorWidget.viewport).then((el) => {
            const viewport = el[0];
            const viewportRect = viewport.getBoundingClientRect();

            const clientX1 = ((x1 + 1) / 2) * viewportRect.width + viewportRect.x;
            const clientX2 = ((x2 + 1) / 2) * viewportRect.width + viewportRect.x;
            const clientY1 = -((y1 - 1) / 2) * viewportRect.height + viewportRect.y;
            const clientY2 = -((y2 - 1) / 2) * viewportRect.height + viewportRect.y;
            const coordinates = {
                x1: clientX1,
                y1: clientY1,
                x2: clientX2,
                y2: clientY2,
            };

            cy.get(threeJSEditorWidget.viewport).trigger("pointerdown", {
                pointerId: 1,
                clientX: coordinates.x1,
                clientY: coordinates.y1,
            });

            cy.get(threeJSEditorWidget.viewport).trigger("pointermove", {
                pointerId: 1,
                clientX: coordinates.x2,
                clientY: coordinates.y2,
            });

            cy.get(threeJSEditorWidget.viewport).trigger("pointerup", {
                pointerId: 1,
                clientX: coordinates.x2,
                clientY: coordinates.y2,
            });
        });
    }

    selectSceneObjectByName(name: string) {
        this.browser.clickIfExists(this.selectors.opener);
        return this.browser.clickByXpath(this.selectors.sceneObjectByName(name));
    }

    toggleSceneObjectOpener(sceneObjectName: string) {
        return this.browser.clickByXpath(this.selectors.sceneObjectOpenerByName(sceneObjectName));
    }

    openSidebarTabByTitle(title: string) {
        return this.browser.clickByXpath(this.selectors.sidebarTabByTitle(title));
    }

    openSceneObjectTabByTitle(title: string) {
        return this.browser.clickByXpath(this.selectors.sceneObjectTabByTitle(title));
    }

    setSceneObjectPosition(position: string[]) {
        position.forEach((value, index) => {
            const xpath = this.selectors.sceneObjectPositionByIndex(index + 1);
            this.browser.clickByXpath(xpath);
            this.browser.setInputValueByXpath(xpath, value);
        });
    }

    validateSceneObjectPosition(expectedPosition: number[]) {
        for (let i = 1; i <= 3; i++) {
            this.browser
                .getInputValueByXpath(this.selectors.sceneObjectPositionByIndex(i))
                // eslint-disable-next-line no-loop-func
                .should((value) => {
                    expect(Number(value)).to.equal(expectedPosition[i - 1]);
                });
        }
    }
}
