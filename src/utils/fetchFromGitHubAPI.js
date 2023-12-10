/**
 * Fetches file metadata from a GitHub repository using the GitHub API.
 *
 * The GitHub API returns an array of file objects in the repository. Each file object includes details such as
 * the file name, download URL, Git data URL, HTML URL, file path, SHA hash, size, type, and metadata URL.
 *
 * @param {string} url - The URL of the GitHub API endpoint to fetch the files from.
 * @returns {Promise<Array<{name: string, download_url: string, git_url: string, html_url: string, path: string, sha: string, size: number, type: string, url: string}>>}
 * - A promise that resolves to an array of objects. Each object contains the properties `name`, `download_url`,
 * `git_url`, `html_url`, `path`, `sha`, `size`, `type`, and `url`.
 * @throws {Error} - Rethrows any error encountered during the fetch operation or data processing,
 * allowing the caller of the function to handle it as needed.
 *
 * @example
 * // Example URL for GitHub API
 * const url = "https://api.github.com/repos/username/repo/contents/path/to/directory";
 * fetchFiles(url).then(files => {
 *   files.forEach(file => {
 *     console.log(`File Name: ${file.name}, Download URL: ${file.download_url}`);
 *     // Other properties can also be accessed here
 *   });
 * }).catch(error => {
 *   console.error("Error fetching files:", error);
 * });
 */
async function fetchFiles(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.map((file) => ({
            name: file.name,
            download_url: file.download_url,
        }));
    } catch (error) {
        console.error("Error fetching files:", error);
        throw error; // Rethrow the error for the caller to handle
    }
}

export default fetchFiles;
