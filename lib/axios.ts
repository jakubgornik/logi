import axios, { AxiosError } from "axios";
import { paramsSerializer } from "./utils/params-serializer";

const SIGN_IN_ROUTE = "/signin";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  timeout: 10000,
  paramsSerializer: (params) => paramsSerializer(params),
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== SIGN_IN_ROUTE
      ) {
        window.location.href = SIGN_IN_ROUTE;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
