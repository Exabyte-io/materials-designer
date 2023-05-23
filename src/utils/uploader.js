/**
 * Reads a file from disk as text and calls a callback with the file content.
 * @param {File} file - The file to read.
 * @param {Function} callback - Function to call with the file content and name.
 */
export function importFromDisk(file, callback) {
    const reader = new FileReader();
    console.log("uploader.js reached");
    reader.onload = (event) => {
        callback(file.name, event.target.result);
    };
    reader.readAsText(file);
}
