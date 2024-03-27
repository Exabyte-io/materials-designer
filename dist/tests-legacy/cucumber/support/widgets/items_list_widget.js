"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ItemsListWidget = void 0;
var _selectors = require("../selectors");
var _widget = require("../widget");
class ItemsListWidget extends _widget.Widget {
  constructor(selector) {
    super(selector);
    this._selectors = _selectors.SELECTORS.itemsList;
  }
  setItemName(itemIndex, name) {
    const selector = this.getSelectorPerItem(itemIndex, this._selectors.nameInput);
    exabrowser.waitForValue(selector);
    this.selectItemByIndex(itemIndex);
    exabrowser.setValueWithBackspaceClear(selector, name);
  }
  getSelectorPerItem(itemIndex, selectorName) {
    return this.getWrappedSelector("".concat(this._selectors.itemByIndex(itemIndex), " ").concat(selectorName));
  }
  selectItemByIndex(index) {
    exabrowser.scrollAndClick(this.getSelectorPerItem(index, ""));
  }
  deleteMaterialByIndex(index) {
    // TODO: add check for modal dialog disappear instead of pause below
    exabrowser.pause(1000);
    exabrowser.scrollAndClick(this.getSelectorPerItem(index, this._selectors.iconButtonDelete));
    // TODO: add check for disappear instead of pause below
    exabrowser.pause(1000);
  }
}
exports.ItemsListWidget = ItemsListWidget;