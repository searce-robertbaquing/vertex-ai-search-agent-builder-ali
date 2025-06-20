import axios from "axios";

const HOST = process.env.NODE_ENV === 'production'
  ? ''
  : process.env.REACT_APP_API_HOST;

/**
 * Sends a search request to the backend API.
 */
async function search(payload) {
  try {
    const response = await axios.post(`${HOST}/search`, {
      query: payload.query,
      pageSize: payload.page_size,
      summary_result_count: payload.summary_result_count,
      max_snippet_count: payload.max_snippet_count,
      max_extractive_segment_count: payload.max_extractive_segment_count,
      max_extractive_answer_count: payload.max_extractive_answer_count,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching search results:", error);
    throw error;
  }
}

/**
 * Uploads one or more files to the backend API.
 */
async function uploadFile(formData) {
  return axios.post(`${HOST}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

/**
 * Fetches the list of existing documents from the backend.
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

// Architect's Note: getIndexingStatus has been removed from the exports.
export { search, uploadFile, listDocuments };