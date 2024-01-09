import BrowserFactory from "@exabyte-io/code.js/dist/cypress/BrowserFactory";
import BaseWidget from "@exabyte-io/code.js/dist/cypress/Widget";

import SETTINGS from "../settings";

BrowserFactory.setBrowserSettings(SETTINGS);

export default class Widget extends BaseWidget {
    // Put custom actions here
}
