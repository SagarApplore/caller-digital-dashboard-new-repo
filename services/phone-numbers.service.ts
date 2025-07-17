import axios from 'axios';

// Backend API base URL
const BACKEND_API_BASE_URL = process.env.NEXT_PUBLIC_REACT_APP_BASE_URL || 'http://localhost:8000/api/v1';
const BACKEND_PYTHON_API_BASE_URL = process.env.NEXT_PUBLIC_PYTHON_BACKEND_API_BASE_URL || 'http://localhost:8000/api/v1';

// Get auth token from localStorage
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    const authToken = localStorage.getItem('auth_token');
    if (authToken) {
      try {
        const parsedToken = JSON.parse(authToken);
        return parsedToken.accessToken;
      } catch (error) {
        console.error('Error parsing auth token:', error);
        return null;
      }
    }
    return null;
  }
  return null;
};

// Create axios instance with default config
const backendPythonApiClient = axios.create({
  baseURL: BACKEND_PYTHON_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const backendApiClient = axios.create({
  baseURL: BACKEND_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
backendApiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
backendPythonApiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export interface PhoneNumber {
  id: string;
  number: string;
  area: string;
  alias: string;
  type: string;
  capabilities: string[];
  configuration: string;
  additionalInfo: string;
  status: 'active' | 'inactive';
}

export interface PhoneNumberResponse {
  success: boolean;
  data: PhoneNumber[];
  message?: string;
}

export interface BuyNumberRequest {
  country: string;
  areaCode?: string;
  capabilities?: string[];
}

export interface SearchAvailableNumbersRequest {
  country: string;
  type?: string;
  capabilities?: string[];
  prefix?: string;
}

export interface SearchResult {
  monthly_rental_rate: string;
  number: string;
  region: string;
  voice_enabled: boolean;
}

export interface SearchResponse {
  api_id: string;
  numbers: SearchResult[];
}

export interface AssignApplicationRequest {
  phoneNumberId: string;
  applicationId: string;
}

class PhoneNumbersService {
  // Get all phone numbers
  async getPhoneNumbers(): Promise<PhoneNumber[]> {
    try {
      const response = await backendApiClient.get<PhoneNumberResponse>('/get-numbers');
      // https://4htc5131-5000.inc1.devtunnels.ms/get-numbers
      return response.data.data;
    } catch (error) {
      console.error('Error fetching phone numbers:', error);
      // Return sample data for development
      return [
        {
          id: '1',
          number: '+91 80 3573 5489',
          area: 'Bangalore, India',
          alias: 'Main Office',
          type: 'local',
          capabilities: ['Voice'],
          configuration: 'Zentrunk - poc_test',
          additionalInfo: 'Active since 2024',
          status: 'active'
        },
        {
          id: '2',
          number: '+91 80 3573 5518',
          area: 'Bangalore, India',
          alias: 'Support Line',
          type: 'local',
          capabilities: ['Voice', 'SMS'],
          configuration: 'Zentrunk - indoorwaala',
          additionalInfo: 'Active since 2024',
          status: 'active'
        }
      ];
    }
  }

  // Search for available phone numbers
  async searchAvailableNumbers(request: SearchAvailableNumbersRequest): Promise<SearchResult[]> {
    try {
      // Convert request to query parameters for GET request
      const params = new URLSearchParams();
      if (request.country) params.append('country', request.country);
      if (request.type) params.append('type', request.type);
      if (request.capabilities) {
        request.capabilities.forEach(cap => params.append('capabilities', cap));
      }
      if (request.prefix) params.append('prefix', request.prefix);

      const response = await backendPythonApiClient.get<SearchResponse>(`/get-numbers?${params.toString()}`);
      return response.data.numbers;
    } catch (error) {
      console.error('Error searching for available numbers:', error);
      // Return sample data for development
      return [
        {
          monthly_rental_rate: '400 Rs',
          number: '918035735489',
          region: 'Bangalore',
          voice_enabled: true
        },
        {
          monthly_rental_rate: '400 Rs',
          number: '918035735518',
          region: 'Bangalore',
          voice_enabled: true
        },
        {
          monthly_rental_rate: '400 Rs',
          number: '918035735949',
          region: 'Bangalore',
          voice_enabled: true
        },
        {
          monthly_rental_rate: '400 Rs',
          number: '918035735960',
          region: 'Bangalore',
          voice_enabled: true
        }
      ];
    }
  }

  // Create Razorpay order for phone number purchase
  async createPhoneNumberOrder(phoneNumberData: {
    phoneNumber: string;
    region: string;
    monthly_rental_rate: string;
    voice_enabled: boolean;
    country: string;
  }): Promise<any> {
    try {
      const response = await backendApiClient.post('/phone-number-payment/create-order', phoneNumberData);
      return response.data;
    } catch (error) {
      console.error('Error creating phone number order:', error);
      throw new Error('Failed to create order');
    }
  }

  // Verify Razorpay payment
  async verifyPhoneNumberPayment(paymentData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }): Promise<any> {
    try {
      const response = await backendApiClient.post('/phone-number-payment/verify-payment', paymentData);
      return response.data;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw new Error('Failed to verify payment');
    }
  }

  // Get phone number payment history
  async getPhoneNumberPaymentHistory(): Promise<any> {
    try {
      const response = await backendApiClient.get('/phone-number-payment/history');
      return response.data;
    } catch (error) {
      console.error('Error fetching payment history:', error);
      throw new Error('Failed to fetch payment history');
    }
  }

  // Buy a new phone number (legacy method - now uses Razorpay)
  async buyNumber(request: BuyNumberRequest): Promise<PhoneNumber> {
    try {
      const response = await backendApiClient.post<PhoneNumberResponse>('/phone-numbers/buy', request);
      return response.data.data[0];
    } catch (error) {
      console.error('Error buying phone number:', error);
      throw new Error('Failed to buy phone number');
    }
  }

  // Assign application to phone number
  async assignApplication(request: AssignApplicationRequest): Promise<void> {
    try {
      await backendApiClient.post('/phone-numbers/assign-application', request);
    } catch (error) {
      console.error('Error assigning application:', error);
      throw new Error('Failed to assign application');
    }
  }

  // Unassign application from phone number
  async unassignApplication(phoneNumberId: string): Promise<void> {
    try {
      await backendApiClient.post(`/phone-numbers/${phoneNumberId}/unassign-application`);
    } catch (error) {
      console.error('Error unassigning application:', error);
      console.log('Unassigning application from phone number:', phoneNumberId);
    }
  }

  // Delete phone number
  async deletePhoneNumber(phoneNumberId: string): Promise<void> {
    try {
      await backendApiClient.delete(`/phone-numbers/${phoneNumberId}`);
    } catch (error) {
      console.error('Error deleting phone number:', error);
      console.log('Deleting phone number:', phoneNumberId);
    }
  }

  // Suspend phone number
  async suspendPhoneNumber(phoneNumberId: string): Promise<void> {
    try {
      await backendApiClient.post(`/phone-numbers/${phoneNumberId}/suspend`);
    } catch (error) {
      console.error('Error suspending phone number:', error);
      console.log('Suspending phone number:', phoneNumberId);
    }
  }

  // Reactivate phone number
  async reactivatePhoneNumber(phoneNumberId: string): Promise<void> {
    try {
      await backendApiClient.post(`/phone-numbers/${phoneNumberId}/reactivate`);
    } catch (error) {
      console.error('Error reactivating phone number:', error);
      throw new Error('Failed to reactivate phone number');
    }
  }

  // Get available applications for assignment
  async getAvailableApplications(): Promise<any[]> {
    try {
      const response = await backendApiClient.get('/applications');
      return response.data.data || [];
    } catch (error) {
      console.error('Error fetching applications:', error);
      // Return sample applications for development
      return [
        { id: '1', name: 'Zentrunk - poc_test' },
        { id: '2', name: 'Zentrunk - indoorwaala' },
        { id: '3', name: 'Zentrunk - for_jk_poc' },
      ];
    }
  }

  // Bulk actions
  async bulkAssignApplication(phoneNumberIds: string[], applicationId: string): Promise<void> {
    try {
      await backendApiClient.post('/phone-numbers/bulk-assign', {
        phoneNumberIds,
        applicationId,
      });
    } catch (error) {
      console.error('Error bulk assigning applications:', error);
      console.log('Bulk assigning application:', applicationId, 'to numbers:', phoneNumberIds);
    }
  }

  async bulkUnassignApplication(phoneNumberIds: string[]): Promise<void> {
    try {
      await backendApiClient.post('/phone-numbers/bulk-unassign', {
        phoneNumberIds,
      });
    } catch (error) {
      console.error('Error bulk unassigning applications:', error);
      console.log('Bulk unassigning applications from numbers:', phoneNumberIds);
    }
  }

  async bulkDelete(phoneNumberIds: string[]): Promise<void> {
    try {
      await backendApiClient.post('/phone-numbers/bulk-delete', {
        phoneNumberIds,
      });
    } catch (error) {
      console.error('Error bulk deleting phone numbers:', error);
      console.log('Bulk deleting phone numbers:', phoneNumberIds);
    }
  }

  async bulkSuspend(phoneNumberIds: string[]): Promise<void> {
    try {
      await backendApiClient.post('/phone-numbers/bulk-suspend', {
        phoneNumberIds,
      });
    } catch (error) {
      console.error('Error bulk suspending phone numbers:', error);
      console.log('Bulk suspending phone numbers:', phoneNumberIds);
    }
  }
}

export const phoneNumbersService = new PhoneNumbersService();
export default phoneNumbersService; 