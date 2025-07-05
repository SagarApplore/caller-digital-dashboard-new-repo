// src/types/api.d.ts
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
