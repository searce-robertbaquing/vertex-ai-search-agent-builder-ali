import axios from "axios";

// This logic automatically sets the correct API host.
// In production (in the container), it's an empty string for relative paths.
// In development, it uses the .env file.
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
 * Uploads a file to the backend API.
 */
async function uploadFile(formData) {
  return axios.post(`${HOST}/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export { search, uploadFile };