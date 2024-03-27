import lodash from "lodash";
import { sprintf } from "sprintf-js";
import en from "./en/messages";
const messages = {
    en,
};
export function displayMessage(key, ...args) {
    const locale = window.location.search.replace("?locale=", "") || "en";
    return sprintf(lodash.get(messages[locale], key), ...args);
}
