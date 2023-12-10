/**
 * Fetches files from a GitHub repository.
 *
 * The GitHub API returns an array of file objects in the repository. Each file object includes
 * details such as the file name and download URL. This function returns an array of these file objects.
 *
 * @param {string} url The URL of the GitHub API endpoint to fetch the files from.
 * @returns {Promise<Array<{ name: string, download_url: string }>>} A promise that resolves to an array of file objects.
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
