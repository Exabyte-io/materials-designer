import assert from "assert";

import {retry} from "../utils";
import {Widget} from "../widget";
import {SELECTORS} from "../selectors";

export class ThreeJSEditorWidget extends Widget {
    constructor(selector) {
        super(selector);
        this._selectors = SELECTORS.threeJSEditorWidget;
    }

    clickOnMenuItem(menuTitle, menuItemTitle) {
        exabrowser.scrollAndClick(this._selectors.menuByTitle(menuTitle));
        exabrowser.scrollAndClick(this._selectors.menuItemByTitle(menuItemTitle));
    }

    clickOnToolbarButton(title) {
        const toolbarBtnSelector = this._selectors.toolbarBtnByTitle(title);
        exabrowser.scrollAndClick(toolbarBtnSelector);
    }

    makeMultipleSelection({ x1, y1, x2, y2 }) {
        const viewportRect = exabrowser.execute((viewportSelector) => {
            const viewport = document.querySelector(viewportSelector);
            const rect = viewport.getBoundingClientRect();

            return rect;
        }, this._selectors.viewport).value;

        const clientX1 = ((x1 + 1) / 2) * viewportRect.width + viewportRect.x;
        const clientX2 = ((x2 + 1) / 2) * viewportRect.width + viewportRect.x;
        const clientY1 = -((y1 - 1) / 2) * viewportRect.height + viewportRect.y;
        const clientY2 = -((y2 - 1) / 2) * viewportRect.height + viewportRect.y;
        const coordinates = { x1: clientX1, y1: clientY1, x2: clientX2, y2: clientY2 };

        exabrowser.execute(
            (selector, clientCoordinates) => {
                const viewport = document.querySelector(selector);

                viewport.dispatchEvent(
                    new PointerEvent("pointerdown", {
                        clientX: clientCoordinates.x1,
                        clientY: clientCoordinates.y1,
                    }),
                );
                viewport.dispatchEvent(
                    new PointerEvent("pointermove", {
                        clientX: clientCoordinates.x2,
                        clientY: clientCoordinates.y2,
                    }),
                );
                viewport.dispatchEvent(
                    new PointerEvent("pointerup", {
                        clientX: clientCoordinates.x2,
                        clientY: clientCoordinates.y2,
                    }),
                );
            },
            this._selectors.viewport,
            coordinates,
        ).value;
    }

    selectSceneObjectByName(name) {
        exabrowser.scrollAndClick(this._selectors.sceneObjectByName(name));
    }

    toggleSceneObjectOpener(sceneObjectName) {
        exabrowser.scrollAndClick(this._selectors.sceneObjectOpenerByName(sceneObjectName));
    }

    openSidebarTabByTitle(title) {
        exabrowser.scrollAndClick(this._selectors.sidebarTabByTitle(title));
    }

    openSceneObjectTabByTitle(title) {
        exabrowser.scrollAndClick(this._selectors.sceneObjectTabByTitle(title));
    }

    setSceneObjectPosition(position) {
        position.forEach((value, index) => {
            const selector = this._selectors.sceneObjectPositionByIndex(index + 1);
            retry(
                () => {
                    exabrowser.scrollAndClick(selector);
                    exabrowser.keys(value);
                    exabrowser.keys("Enter");
                    assert(exabrowser.getValue(selector), value);
                },
                { retries: 5 },
            );
        });
    }

    getSceneObjectPosition() {
        const position = [];

        for (let i = 1; i <= 3; i++) {
            const value = exabrowser.getValue(this._selectors.sceneObjectPositionByIndex(i));
            position.push(parseFloat(value));
        }

        return position;
    }
}
