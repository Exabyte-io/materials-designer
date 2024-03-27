"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _settings = require("./settings");
var _exabrowser = require("./utils/exabrowser");
let isFeatureStarted = false;

/**
 * @summary Sets browser size to minimal resolution.
 */
function setViewportSizeHook() {
  exabrowser.setViewportSize(_settings.SETTINGS.VIEWPORT_SIZE);
}

/*
 * Hooks are run Before/After each scenario
 */
function _default() {
  this.Before(() => {
    if (!isFeatureStarted) {
      (0, _exabrowser.initializeExaBrowserHook)(); // KEEP THIS FIRST!
      setViewportSizeHook();
    }
    isFeatureStarted = true;
  });
  this.After(() => {});
}