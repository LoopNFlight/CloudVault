import axios from "axios";

/**
 * Central Axios instance for talking to API Gateway.
 * Base URL is injected at build time via Vite env vars -- never hardcode
 * AWS endpoints or credentials in source.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong talking to the API.";
    return Promise.reject(new Error(message));
  }
);

/** Converts a File object into a base64 string (without the data: prefix). */
function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(",")[1]);
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsDataURL(file);
  });
}

export const filesApi = {
  async list({ limit = 100, continuationToken } = {}) {
    const { data } = await apiClient.get("/files", {
      params: { limit, continuationToken },
    });
    return data;
  },

  async upload(file, { onProgress } = {}) {
    const fileContent = await fileToBase64(file);
    // onProgress here is simulated during the base64 encode/network phase
    // by the caller (see UploadPage), since axios can't report progress on
    // a small JSON payload the way it can for multipart streams.
    const { data } = await apiClient.post(
      "/upload",
      { fileName: file.name, contentType: file.type || "application/octet-stream", fileContent },
      {
        onUploadProgress: (evt) => {
          if (onProgress && evt.total) {
            onProgress(Math.round((evt.loaded * 100) / evt.total));
          }
        },
      }
    );
    return data;
  },

  async getDownloadUrl(key) {
    const { data } = await apiClient.get(`/download/${encodeURIComponent(key)}`);
    return data;
  },

  async remove(key) {
    const { data } = await apiClient.delete(`/files/${encodeURIComponent(key)}`);
    return data;
  },

  async search(query) {
    const { data } = await apiClient.get("/search", { params: { q: query } });
    return data;
  },

  async getStatistics() {
    const { data } = await apiClient.get("/stats");
    return data;
  },
};

export default apiClient;
