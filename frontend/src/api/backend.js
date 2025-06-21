import axios from "axios";

// This HOST logic correctly switches between development and production.
const HOST = process.env.NODE_ENV === 'production'
  ? ''
  : process.env.REACT_APP_API_HOST;

/**
 * Sends a search request to the backend API.
 * @param {object} payload - The search payload from SearchContext.
 * @returns {Promise<object>} A promise that resolves with the search results.
 */
async function search(payload) {
  try {
    /*
     * ARCHITECT'S NOTE: The original implementation created a new object with inconsistently cased keys
     * (e.g., `pageSize` vs. `summary_result_count`). This was the source of the error.
     *
     * The `payload` object from SearchContext already has the correct snake_case keys that our
     * backend Pydantic model expects (e.g., `page_size`, `summary_result_count`).
     * By passing the payload directly to axios, we ensure the keys match the backend model exactly,
     * making the call simpler and fixing the bug.
     */
    const response = await axios.post(`${HOST}/search`, payload);
    return response.data;
  } catch (error) {
    console.error("Error fetching search results:", error);
    // Re-throwing the error allows the calling component to handle it, which is a good practice.
    throw error;
  }
}

/**
 * Uploads one or more files to the backend API.
 * @param {FormData} formData - The FormData object containing the file(s).
 * @returns {Promise<object>}
 */
async function uploadFile(formData) {
  // Architect's Note: It's good practice to centralize all API calls.
  // The file upload logic in App.js should use this function.
  return axios.post(`${HOST}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

/**
 * Fetches the list of existing documents from the backend.
 * @returns {Promise<object>}
 */
async function listDocuments() {
    try {
        const response = await axios.get(`${HOST}/documents`);
        return response.data;
    } catch (error) {
        console.error("Error fetching document list:", error);
        throw error;
    }
}


export { search, uploadFile, listDocuments };