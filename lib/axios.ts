import axios, { AxiosError } from "axios";
import { paramsSerializer } from "./utils/params-serializer";
import { ROUTES } from "./routes";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  timeout: 15000,
  paramsSerializer: (params) => paramsSerializer(params),
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== ROUTES.SIGN_IN
      ) {
        window.location.href = ROUTES.SIGN_IN;
      }
    }
    return Promise.reject(error);
  },
);

export default api;
