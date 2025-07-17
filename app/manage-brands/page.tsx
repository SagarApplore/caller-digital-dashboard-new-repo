'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/organisms/card';
import { Button } from '@/components/ui/button';
import { Plus, Building2, Users, Activity } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { ProtectedRoute } from '@/components/protected-route';
import Dashboard from '@/components/templates/dashboard';
import BrandForm from '@/components/molecules/manage-brands/brand-form';
import BrandsList from '@/components/molecules/manage-brands/brands-list';
import BrandStats from '@/components/molecules/manage-brands/brand-stats';
import apiRequest from '@/utils/api';

interface Brand {
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

interface BrandStats {
  totalBrands: number;
  activeBrands: number;
  inactiveBrands: number;
  suspendedBrands: number;
}

export default function ManageBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [stats, setStats] = useState<BrandStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchBrands = async () => {
    try {
      const response = await apiRequest('/brands', 'GET');

      if (response.data?.success) {
        setBrands(response.data.data);
      } else {
        throw new Error('Failed to fetch brands');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load brands',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await apiRequest('/brands/stats', 'GET');

      if (response.data?.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch brand stats:', error);
    }
  };

  useEffect(() => {
    fetchBrands();
    fetchStats();
  }, []);

  const handleBrandCreated = (newBrand: any) => {
    console.log('handleBrandCreated received:', newBrand);
    
    // The API returns the brand in response.data.data.brand
    // We need to extract and format it properly
    const brandData = newBrand.brand || newBrand;
    console.log('brandData extracted:', brandData);
    
    // Helper function to ensure proper date formatting
    const formatDate = (dateString: string | Date | undefined) => {
      if (!dateString) return new Date().toISOString();
      try {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
      } catch {
        return new Date().toISOString();
      }
    };
    
    // Ensure the brand has all required fields with proper formatting
    const formattedBrand: Brand = {
      _id: brandData._id,
      name: brandData.name,
      billingEmail: brandData.billingEmail,
      description: brandData.description || '',
      status: brandData.status || 'active',
      brandUser: {
        _id: brandData.brandUser?._id || brandData.brandUser?._id,
        name: brandData.brandUser?.name || 'Brand User',
        email: brandData.brandUser?.email || brandData.billingEmail,
        role: brandData.brandUser?.role || 'BRAND_USER'
      },
      agentCount: newBrand.copiedAgentsCount || 0,
      createdAt: formatDate(brandData.createdAt),
      updatedAt: formatDate(brandData.updatedAt)
    };

    console.log('formattedBrand:', formattedBrand);

    setBrands(prev => [formattedBrand, ...prev]);
    setShowForm(false);
    fetchStats(); // Refresh stats
    
    const message = newBrand.agentsCopied 
      ? `Brand created successfully with ${newBrand.copiedAgentsCount} agents copied!`
      : 'Brand created successfully!';
      
    toast({
      title: 'Success',
      description: message,
    });
  };

  const handleBrandUpdated = (updatedBrand: any) => {
    // The API returns the brand in response.data.data
    // We need to extract and format it properly
    const brandData = updatedBrand.brand || updatedBrand;
    
    // Helper function to ensure proper date formatting
    const formatDate = (dateString: string | Date | undefined) => {
      if (!dateString) return new Date().toISOString();
      try {
        const date = new Date(dateString);
        return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
      } catch {
        return new Date().toISOString();
      }
    };
    
    // Ensure the brand has all required fields with proper formatting
    const formattedBrand: Brand = {
      _id: brandData._id,
      name: brandData.name,
      billingEmail: brandData.billingEmail,
      description: brandData.description || '',
      status: brandData.status || 'active',
      brandUser: {
        _id: brandData.brandUser?._id || brandData.brandUser?._id,
        name: brandData.brandUser?.name || 'Brand User',
        email: brandData.brandUser?.email || brandData.billingEmail,
        role: brandData.brandUser?.role || 'BRAND_USER'
      },
      agentCount: brandData.agentCount || 0,
      createdAt: formatDate(brandData.createdAt),
      updatedAt: formatDate(brandData.updatedAt)
    };

    setBrands(prev => prev.map(brand => 
      brand._id === formattedBrand._id ? formattedBrand : brand
    ));
    setEditingBrand(null);
    setShowForm(false);
    toast({
      title: 'Success',
      description: 'Brand updated successfully!',
    });
  };

  const handleBrandDeleted = (brandId: string) => {
    setBrands(prev => prev.filter(brand => brand._id !== brandId));
    fetchStats(); // Refresh stats
    toast({
      title: 'Success',
      description: 'Brand deleted successfully!',
    });
  };

  const handleEditBrand = (brand: Brand) => {
    setEditingBrand(brand);
    setShowForm(true);
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <Dashboard
          header={{
            title: "Manage Brands",
            subtitle: {
              text: "Create and manage your brand organizations",
            },
          }}
        >
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          </div>
        </Dashboard>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Dashboard
        header={{
          title: "Manage Brands",
          subtitle: {
            text: "Create and manage your brand organizations",
          },
          children: (
            <Button 
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Brand
            </Button>
          ),
        }}
      >
        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          {stats && <BrandStats stats={stats} />}

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Brands List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Your Brands
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BrandsList
                    brands={brands}
                    onEdit={handleEditBrand}
                    onDelete={handleBrandDeleted}
                    onCreateBrand={() => setShowForm(true)}
                    isLoading={isLoading}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              {/* <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setShowForm(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Brand
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.location.href = '/agents'}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Manage Agents
                  </Button>
                </CardContent>
              </Card> */}

              {/* Info Card */}
              {/* <Card>
                <CardHeader>
                  <CardTitle>About Brands</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <p>
                    Brands are separate organizations that contain their own agents, 
                    phone numbers, and documents.
                  </p>
                  <p>
                    When you create a new brand, all your current agents will be 
                    copied to the new brand with their configurations.
                  </p>
                </CardContent>
              </Card> */}
            </div>
          </div>

          {/* Brand Form Modal */}
          {showForm && (
            <BrandForm
              brand={editingBrand}
              onSuccess={editingBrand ? handleBrandUpdated : handleBrandCreated}
              onCancel={() => {
                setShowForm(false);
                setEditingBrand(null);
              }}
            />
          )}
        </div>
      </Dashboard>
    </ProtectedRoute>
  );
} 