const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export interface Brand {
  _id: string;
  name: string;
  billingEmail: string;
  description?: string;
  status: 'active' | 'inactive' | 'suspended';
  brandUser: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
  agentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBrandData {
  name: string;
  billingEmail: string;
  description?: string;
  contactInfo?: {
    phone?: string;
    address?: string;
    website?: string;
  };
  settings?: {
    timezone?: string;
    currency?: string;
    language?: string;
  };
}

export interface UpdateBrandData extends Partial<CreateBrandData> {
  status?: 'active' | 'inactive' | 'suspended';
}

export interface BrandStats {
  totalBrands: number;
  activeBrands: number;
  inactiveBrands: number;
  suspendedBrands: number;
}

class BrandAPI {
  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  }

  async getBrands(): Promise<Brand[]> {
    const response = await fetch(`${API_BASE_URL}/brands`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch brands');
    }

    const data = await response.json();
    return data.data;
  }

  async getBrandById(id: string): Promise<Brand> {
    const response = await fetch(`${API_BASE_URL}/brands/${id}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch brand');
    }

    const data = await response.json();
    return data.data;
  }

  async createBrand(brandData: CreateBrandData): Promise<{ brand: Brand; brandUser: any; copiedAgentsCount: number }> {
    const response = await fetch(`${API_BASE_URL}/brands`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(brandData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create brand');
    }

    const data = await response.json();
    return data.data;
  }

  async updateBrand(id: string, brandData: UpdateBrandData): Promise<Brand> {
    const response = await fetch(`${API_BASE_URL}/brands/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(brandData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update brand');
    }

    const data = await response.json();
    return data.data;
  }

  async deleteBrand(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/brands/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete brand');
    }
  }

  async getBrandStats(): Promise<BrandStats> {
    const response = await fetch(`${API_BASE_URL}/brands/stats`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch brand stats');
    }

    const data = await response.json();
    return data.data;
  }
}

export const brandAPI = new BrandAPI(); 