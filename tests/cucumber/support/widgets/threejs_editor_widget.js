import assert from "assert";

import {retry} from "../utils";
import {Widget} from "../widget";
import {SELECTORS} from "../selectors";

export class ThreeJSEditorWidget extends Widget {
    constructor(selector) {
        super(selector);
        this._selectros = SELECTORS.threeJSEditorWidget;
    }

    clickOnMenuItem(menuTitle, menuItemTitle) {
        exabrowser.scrollAndClick(this._selectros.menuByTitle(menuTitle));
        exabrowser.scrollAndClick(this._selectros.menuItemByTitle(menuItemTitle));
    }

    selectSceneObjectByName(name) {
        exabrowser.scrollAndClick(this._selectros.sceneObjectByName(name));
    }

    openSidebarTabByTitle(title) {
        exabrowser.scrollAndClick(this._selectros.sidebarTabByTitle(title));
    }

    openSceneObjectTabByTitle(title) {
        exabrowser.scrollAndClick(this._selectros.sceneObjectTabByTitle(title));
    }

    setSceneObjectPosition(position) {
        position.forEach((value, index) => {
            const selector = this._selectros.sceneObjectPositionByIndex(index + 1);
            retry(() => {
                exabrowser.scrollAndClick(selector);
                exabrowser.keys(value);
                exabrowser.keys('Enter');
                assert(exabrowser.getValue(selector), value)
            }, {retries: 5});
        })
    }

}
