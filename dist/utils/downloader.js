import { sprintf } from "sprintf-js";
/**
 * Exports and downloads the content.
 * @param content {String} Content to be saved in downloaded file
 * @param name {String} File name to be written on disk.
 * @param extension {String} File extension.
 */
export function exportToDisk(content, name = "file", extension = "txt") {
    const pom = document.createElement("a");
    pom.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content));
    pom.setAttribute("download", sprintf(`%s.${extension}`, name));
    pom.click();
}
