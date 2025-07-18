// src/types/api.d.ts
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface CallLog {
  _id?: string;
  transcript_uri?: string;
  summary_uri?: string;
  recording_uri?: string;
  call_duration?: number;
  call_start_time?: Date;
  call_end_time?: Date;
  clientId?: {
    _id: string;
    name: string;
  };
  agentId?: {
    _id: string;
    agentName: string;
  };
  customer_phone_number?: string;
  agent_phone_number?: string;
  hand_off?: boolean;
  sentiment?: string;
  intent?: string;
  ai_analysis?: string;
  tags?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
