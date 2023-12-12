import browser from "../browser";
import Widget from "./Widget";

const wrapper = ".materials-designer-items-list";

export class ItemsListWidget extends Widget {
    selectors = {
        wrapper,
        nameInput: "input",
        itemByIndex: (index: number) => `ul>div:nth-of-type(${index}) li`,
        iconButtonDelete: ".icon-button-delete",
    };

    constructor() {
        super(wrapper);
    }

    setItemName(itemIndex: number, name: string) {
        const selector = this.getSelectorPerItem(itemIndex, this.selectors.nameInput);
        browser.waitForValue(selector);
        this.selectItemByIndex(itemIndex);
        browser.setInputValue(selector, name);
        // Click outside of the input field to save the value
        browser.click(this.selectors.wrapper);
    }

    getSelectorPerItem(itemIndex: number, selectorName: string) {
        return this.getWrappedSelector(`${this.selectors.itemByIndex(itemIndex)} ${selectorName}`);
    }

    selectItemByIndex(index: number) {
        return browser.click(this.getSelectorPerItem(index, ""));
    }

    deleteMaterialByIndex(index: number) {
        browser.click(this.getSelectorPerItem(index, this.selectors.iconButtonDelete));
        // browser.pause(1000);
    }
}
