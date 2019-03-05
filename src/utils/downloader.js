import JSZip from "jszip";
import s from 'underscore.string';
import * as JSZipUtils from "jszip-utils";

/**
 * Downloads the specified storage file.
 * @param url {String} URL to download.
 */
export const downloadURL = function (url) {
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.download = true;
    var event = new MouseEvent("click");
    a.dispatchEvent(event);
};

/**
 * Creates and downloads zip file.
 * @param zipName {String} Zip file name (without extension).
 * @param files {Object[]} Job files to add to created zip.
 * @param onFileComplete {Function} Function to track progress.
 * Called each time when one file downloading completed. Downloaded file is passed.
 * @param onError {Function} Callback called when file downloading fails. Error is passed as arg.
 * @param onComplete {Function} Complete callback. Called when zip file saving completed.
 * @param prefix {String}
 */
export const downloadZip = function (zipName, files, onFileComplete, onError, onComplete, prefix) {
    const zip = new JSZip();
    var counter = 0;
    files.forEach(file => {
        JSZipUtils.getBinaryContent(file.signedUrl, function (err, data) {
            if (err) {
                onError(file, err);
            }
            zip.file(file.key.replace(prefix, ''), data, {binary: true});
            onFileComplete(file);
            counter++;
            if (counter === files.length) {
                zip.generateAsync({type: "blob"}).then(function (blob) {
                    saveAs(blob, `${zipName}.zip`);
                    onComplete();
                });
            }
        });
    });
};
/**
 * Exports and downloads the content.
 * @param content {String} Content to be saved in downloaded file
 * @param name {String} File name to be written on disk.
 * @param extension {String} File extension.
 */
export const exportToDisk = function (content, name = 'file', extension = 'txt') {
    const pom = document.createElement('a');
    pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    pom.setAttribute('download', s.sprintf(`%s.${extension}`, name));
    pom.click();
};
