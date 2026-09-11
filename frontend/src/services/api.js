import axios from "axios";


const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:8000/api/v1",

  withCredentials: true,

  timeout: 15000,
});


api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (
      error?.response?.status === 401
    ) {
      error.isAuthError = true;
    }

    return Promise.reject(error);
  }
);


export default api;