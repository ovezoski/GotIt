import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://api.localhost";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
  withCredentials: true,
});

const getCookie = (name: string) => {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

apiClient.interceptors.request.use(
  (config) => {
    const csrftoken = getCookie("csrftoken");
    if (
      csrftoken &&
      ["POST", "PUT", "DELETE", "PATCH"].includes(
        config.method?.toUpperCase() ?? ""
      )
    ) {
      config.headers["X-CSRFToken"] = csrftoken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
export default apiClient;
