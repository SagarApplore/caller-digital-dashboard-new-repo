interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  withCredentials?: boolean;
}

interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

interface ApiError {
  message: string;
  status: number;
  statusText: string;
  data?: any;
}

class NetworkService {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private defaultTimeout: number;
  private authToken: string | null = null;

  constructor(
    baseUrl: string,
    config?: {
      defaultHeaders?: Record<string, string>;
      defaultTimeout?: number;
    }
  ) {
    this.baseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...config?.defaultHeaders,
    };
    this.defaultTimeout = config?.defaultTimeout || 10000; // 10 seconds
  }

  // Set authentication token
  setAuthToken(token: string | null): void {
    this.authToken = token;
  }

  // Get authentication headers
  private getAuthHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};
    if (this.authToken) {
      headers["Authorization"] = `Bearer ${this.authToken}`;
    }
    return headers;
  }

  // Create request configuration
  private createRequestConfig(config?: RequestConfig): RequestConfig {
    return {
      headers: {
        ...this.defaultHeaders,
        ...this.getAuthHeaders(),
        ...config?.headers,
      },
      timeout: config?.timeout || this.defaultTimeout,
      withCredentials: config?.withCredentials || false,
    };
  }

  // Handle response
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    if (!response.ok) {
      const errorData = await this.parseResponse(response);
      throw {
        message:
          (errorData as any)?.message ||
          `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
        statusText: response.statusText,
        data: errorData,
      } as ApiError;
    }

    const data = await this.parseResponse<T>(response);
    return {
      data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    };
  }

  // Parse response based on content type
  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      return response.json();
    }

    if (contentType?.includes("text/")) {
      const text = await response.text();
      return text as T;
    }

    return response.blob() as T;
  }

  // Create timeout promise
  private createTimeoutPromise(timeout: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(`Request timeout after ${timeout}ms`));
      }, timeout);
    });
  }

  // Generic request method
  private async request<T>(
    endpoint: string,
    options: RequestInit & { timeout?: number } = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${
      endpoint.startsWith("/") ? endpoint : `/${endpoint}`
    }`;
    const config = this.createRequestConfig({ timeout: options.timeout });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...config.headers,
          ...options.headers,
        },
        signal: controller.signal,
        credentials: config.withCredentials ? "include" : "same-origin",
      });

      clearTimeout(timeoutId);
      return this.handleResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === "AbortError") {
          throw {
            message: `Request timeout after ${config.timeout}ms`,
            status: 408,
          } as ApiError;
        }
        throw { message: error.message, status: 0 } as ApiError;
      }

      throw error;
    }
  }

  // GET request
  async get<T = any>(
    endpoint: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "GET",
      timeout: config?.timeout,
    });
  }

  // POST request
  async post<T = any>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      timeout: config?.timeout,
    });
  }

  // PUT request
  async put<T = any>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
      timeout: config?.timeout,
    });
  }

  // PATCH request
  async patch<T = any>(
    endpoint: string,
    data?: any,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
      timeout: config?.timeout,
    });
  }

  // DELETE request
  async delete<T = any>(
    endpoint: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "DELETE",
      timeout: config?.timeout,
    });
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

    const url = `${this.baseUrl}${
      endpoint.startsWith("/") ? endpoint : `/${endpoint}`
    }`;
    const requestConfig = this.createRequestConfig(config);

    // Remove Content-Type header for FormData
    if (requestConfig.headers) {
      delete requestConfig.headers["Content-Type"];
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      requestConfig.timeout
    );

    try {
      const xhr = new XMLHttpRequest();

      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener("progress", (event) => {
          if (event.lengthComputable && onProgress) {
            const progress = (event.loaded / event.total) * 100;
            onProgress(progress);
          }
        });

        xhr.addEventListener("load", () => {
          clearTimeout(timeoutId);

          if (xhr.status >= 200 && xhr.status < 300) {
            const data = xhr.responseText ? JSON.parse(xhr.responseText) : null;
            resolve({
              data,
              status: xhr.status,
              statusText: xhr.statusText,
              headers: new Headers(),
            });
          } else {
            reject({
              message: `HTTP ${xhr.status}: ${xhr.statusText}`,
              status: xhr.status,
              statusText: xhr.statusText,
            } as ApiError);
          }
        });

        xhr.addEventListener("error", () => {
          clearTimeout(timeoutId);
          reject({ message: "Network error", status: 0 } as ApiError);
        });

        xhr.addEventListener("abort", () => {
          clearTimeout(timeoutId);
          reject({ message: "Request aborted", status: 0 } as ApiError);
        });

        xhr.open("POST", url);

        // Set headers
        if (requestConfig.headers) {
          Object.entries(requestConfig.headers).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value);
          });
        }

        xhr.send(formData);
      });
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  // Download file
  async download(
    endpoint: string,
    filename?: string,
    config?: RequestConfig
  ): Promise<void> {
    const response = await this.request<Blob>(endpoint, {
      method: "GET",
      timeout: config?.timeout,
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

  // Create a new instance with different base URL
  createInstance(
    baseUrl: string,
    config?: {
      defaultHeaders?: Record<string, string>;
      defaultTimeout?: number;
    }
  ): NetworkService {
    return new NetworkService(baseUrl, config);
  }

  // Get current base URL
  getBaseUrl(): string {
    return this.baseUrl;
  }

  // Update base URL
  setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  }
}

export default NetworkService;
export type { RequestConfig, ApiResponse, ApiError };
