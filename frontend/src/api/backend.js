// In frontend/src/api/backend.js
import axios from "axios";

// This logic automatically sets the correct API host.
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
    return null;
  }
}

/**
 * Uploads a file to the backend API.
 */
async function uploadFile(formData) {
  // The error is thrown here because HOST is not defined when this is called from App.js
  // By moving the logic here, we ensure it uses the correct HOST.
  return axios.post(`${HOST}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export { search, uploadFile };