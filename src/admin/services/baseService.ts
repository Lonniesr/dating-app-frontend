import axios from "axios";
import type { AxiosInstance } from "axios";

class BaseService {
  protected http: AxiosInstance;
  protected baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/+$/, "");

    this.http = axios.create({
      baseURL: "/",
      withCredentials: true,
    });

    // ⭐ Attach token to every axios request
    this.http.interceptors.request.use((config) => {
      const token = localStorage.getItem("admin_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  private build(path?: string) {
    if (!path) return this.baseUrl;
    return `${this.baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
  }

  get(path?: string) {
    return this.http.get(this.build(path));
  }

  post(path?: string, data?: any) {
    return this.http.post(this.build(path), data);
  }

  put(path?: string, data?: any) {
    return this.http.put(this.build(path), data);
  }

  deleteReq(path?: string) {
    return this.http.delete(this.build(path));
  }
}

export default BaseService;
