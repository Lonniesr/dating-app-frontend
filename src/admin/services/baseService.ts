import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosRequestConfig,
} from "axios";

class BaseService {
  protected http: AxiosInstance;
  protected baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/+$/, "");

    this.http = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
      withCredentials: true,
    });

    this.http.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem("admin_token");

        if (token) {
          config.headers.set("Authorization", `Bearer ${token}`);
        }

        return config;
      }
    );
  }

  private build(path?: string) {
    if (!path) return this.baseUrl;
    return `${this.baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  }

  get(path?: string, config?: AxiosRequestConfig) {
    return this.http.get(this.build(path), config);
  }

  post(path?: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.http.post(this.build(path), data, config);
  }

  put(path?: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.http.put(this.build(path), data, config);
  }

  deleteReq(path?: string, config?: AxiosRequestConfig) {
    return this.http.delete(this.build(path), config);
  }
}

export default BaseService;