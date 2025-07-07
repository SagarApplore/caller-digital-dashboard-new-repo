import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  withCredentials?: boolean;
}

interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
}

interface ApiError {
  message: string;
  status: number;
  statusText: string;
  data?: any;
}

class NetworkService {
  private static instance: NetworkService | null = null;
  private axiosInstance: AxiosInstance;
  private authToken: string | null = null;

  private constructor(
    baseUrl: string,
    config?: {
      defaultHeaders?: Record<string, string>;
      defaultTimeout?: number;
    }
  ) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl,
      timeout: config?.defaultTimeout || 10000, // 10 seconds
      headers: {
        "Content-Type": "application/json",
        ...config?.defaultHeaders,
      },
      withCredentials: false,
    });

    // Add request interceptor for auth token
    this.axiosInstance.interceptors.request.use(
      (config: any) => {
        if (this.authToken) {
          config.headers.Authorization = `Bearer ${this.authToken}`;
        }
        return config;
      },
      (error: any) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response: any) => response,
      (error: AxiosError) => {
        const apiError: ApiError = {
          message:
            (error.response?.data as any)?.message ||
            error.message ||
            "Network error",
          status: error.response?.status || 0,
          statusText: error.response?.statusText || "",
          data: error.response?.data,
        };
        return Promise.reject(apiError);
      }
    );
  }

  // Set authentication token
  setAuthToken(token: string | null): void {
    this.authToken = token;
  }

  // Create axios config from RequestConfig
  private createAxiosConfig(config?: RequestConfig): AxiosRequestConfig {
    return {
      headers: config?.headers,
      timeout: config?.timeout,
      withCredentials: config?.withCredentials,
    };
  }

  // Transform axios response to ApiResponse
  private transformResponse<T>(response: AxiosResponse<T>): ApiResponse<T> {
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    };
  }

  // GET request
  async get<T = any>(
    endpoint: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.get<T>(
      endpoint,
      this.createAxiosConfig(config)
    );
    return this.transformResponse(response);
  }

  // POST request
  async post<T = any>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.post<T>(
      endpoint,
      data,
      this.createAxiosConfig(config)
    );
    return this.transformResponse(response);
  }

  // PUT request
  async put<T = any>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.put<T>(
      endpoint,
      data,
      this.createAxiosConfig(config)
    );
    return this.transformResponse(response);
  }

  // PATCH request
  async patch<T = any>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.patch<T>(
      endpoint,
      data,
      this.createAxiosConfig(config)
    );
    return this.transformResponse(response);
  }

  // DELETE request
  async delete<T = any>(
    endpoint: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.delete<T>(
      endpoint,
      this.createAxiosConfig(config)
    );
    return this.transformResponse(response);
  }

  // Upload file
  async upload<T = any>(
    endpoint: string,
    file: File,
    onProgress?: (progress: number) => void,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append("file", file);

    const axiosConfig: AxiosRequestConfig = {
      ...this.createAxiosConfig(config),
      headers: {
        ...this.createAxiosConfig(config).headers,
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent: any) => {
        if (progressEvent.total && onProgress) {
          const progress = (progressEvent.loaded / progressEvent.total) * 100;
          onProgress(progress);
        }
      },
    };

    const response = await this.axiosInstance.post<T>(
      endpoint,
      formData,
      axiosConfig
    );
    return this.transformResponse(response);
  }

  // Download file
  async download(
    endpoint: string,
    filename?: string,
    config?: RequestConfig
  ): Promise<void> {
    const response = await this.axiosInstance.get(endpoint, {
      ...this.createAxiosConfig(config),
      responseType: "blob",
    });

    const blob = response.data;
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  // Get singleton instance
  static getInstance(
    baseUrl?: string,
    config?: {
      defaultHeaders?: Record<string, string>;
      defaultTimeout?: number;
    }
  ): NetworkService {
    if (!NetworkService.instance) {
      if (!baseUrl) {
        throw new Error("Base URL is required for first instance creation");
      }
      NetworkService.instance = new NetworkService(baseUrl, config);
    }
    return NetworkService.instance;
  }

  // Reset singleton instance (useful for testing or reconfiguration)
  static resetInstance(): void {
    NetworkService.instance = null;
  }

  // Get current base URL
  getBaseUrl(): string {
    return this.axiosInstance.defaults.baseURL || "";
  }

  // Update base URL
  setBaseUrl(baseUrl: string): void {
    this.axiosInstance.defaults.baseURL = baseUrl.endsWith("/")
      ? baseUrl.slice(0, -1)
      : baseUrl;
  }

  // Get the underlying axios instance
  getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

// Create default instance with base URL from environment
const getBaseUrl = (): string => {
  // Check for different environment variables
  const envBaseUrl =
    process.env.NEXT_PUBLIC_API_URL ||
    process.env.REACT_APP_API_URL ||
    process.env.VITE_API_URL ||
    process.env.API_URL;

  if (!envBaseUrl) {
    console.warn(
      "No API base URL found in environment variables. Using fallback URL."
    );
    return "http://localhost:3000/api";
  }

  return envBaseUrl;
};

// Create and export default singleton instance
const networkService = NetworkService.getInstance(getBaseUrl());

export default networkService;
export { NetworkService };
export type { RequestConfig, ApiResponse, ApiError };
