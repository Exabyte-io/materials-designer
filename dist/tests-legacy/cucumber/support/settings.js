"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SETTINGS = void 0;
// Times are all in milliseconds
const SETTINGS = exports.SETTINGS = {
  RENDER_TIMEOUT: 30000,
  RENDER_TIMEOUT_SHORT: 10000,
  LONG_STEP_TIMEOUT: 20 * 60 * 1000,
  VIEWPORT_SIZE: {
    width: 1200,
    height: 900
  },
  DOWNLOAD_PATH: "".concat(process.env.HOME, "/Downloads") // chrome default download directory
};