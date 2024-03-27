"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCacheValue = getCacheValue;
exports.setCacheValue = setCacheValue;
function getCacheValue(context, key) {
  return context[key];
}
function setCacheValue(context, key, value) {
  context[key] = value;
}