import Widget from "./Widget";

const wrapper = ".materials-designer-items-list";

export class ItemsListWidget extends Widget {
    selectors = {
        outside: "header",
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
        this.browser.waitForValue(selector);
        this.selectItemByIndex(itemIndex);
        this.browser.setInputValue(selector, name);
        // Click outside of the input field to save the value
        this.browser.click(this.getWrappedSelector(this.selectors.outside));
    }

    getSelectorPerItem(itemIndex: number, selectorName: string) {
        return this.getWrappedSelector(`${this.selectors.itemByIndex(itemIndex)} ${selectorName}`);
    }

    selectItemByIndex(index: number) {
        return this.browser.click(this.getSelectorPerItem(index, ""));
    }

    deleteMaterialByIndex(index: number) {
        this.browser.click(this.getSelectorPerItem(index, this.selectors.iconButtonDelete));
    }
}
