'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/organisms/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/atoms/input';
import { Plus, Building2, Users, Activity, Search, X } from 'lucide-react';
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

// Interface for backend response when creating a brand
interface BrandCreateResponse {
  brand: Brand;
  brandUser: {
    _id: string;
    name: string;
    email: string;
  };
  copiedAgentsCount: number;
  agentsCopied: boolean;
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
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchBrands = useCallback(async (search?: string) => {
    try {
      setIsLoading(true);
      const url = search ? `/brands?search=${encodeURIComponent(search)}` : '/brands';
      const response = await apiRequest(url, 'GET');

      if (response.data?.success) {
        console.log('Raw brands data:', response.data.data);
        
        // Ensure all required fields are present and properly formatted
        const formattedBrands = response.data.data.map((brand: any) => {
          console.log('Processing brand:', brand);
          
          return {
            _id: brand._id || '',
            name: brand.name || 'Unnamed Brand',
            billingEmail: brand.billingEmail || 'No email',
            description: brand.description || '',
            status: brand.status || 'inactive',
            brandUser: {
              _id: brand.brandUser?._id || '',
              name: brand.brandUser?.name || 'Unknown User',
              email: brand.brandUser?.email || 'No email',
              role: brand.brandUser?.role || 'Unknown'
            },
            agentCount: brand.agentCount || 0,
            createdAt: brand.createdAt || new Date().toISOString(),
            updatedAt: brand.updatedAt || new Date().toISOString()
          };
        });
        
        console.log('Formatted brands:', formattedBrands);
        setBrands(formattedBrands);
      } else {
        throw new Error(response.data?.message || 'Failed to fetch brands');
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
      toast({
        title: 'Error',
        description: 'Failed to load brands',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const fetchStats = useCallback(async () => {
    try {
      setIsStatsLoading(true);
      const response = await apiRequest('/brands/stats', 'GET');

      if (response.data?.success) {
        setStats(response.data.data);
      } else {
        // If stats API fails, calculate from brands data
        const calculatedStats = {
          totalBrands: brands.length,
          activeBrands: brands.filter(b => b.status === 'active').length,
          inactiveBrands: brands.filter(b => b.status === 'inactive').length,
          suspendedBrands: brands.filter(b => b.status === 'suspended').length
        };
        setStats(calculatedStats);
      }
    } catch (error) {
      console.error('Failed to fetch brand stats:', error);
      // Calculate stats from brands data as fallback
      const calculatedStats = {
        totalBrands: brands.length,
        activeBrands: brands.filter(b => b.status === 'active').length,
        inactiveBrands: brands.filter(b => b.status === 'inactive').length,
        suspendedBrands: brands.filter(b => b.status === 'suspended').length
      };
      setStats(calculatedStats);
    } finally {
      setIsStatsLoading(false);
    }
  }, [brands]);

  // Fetch brands first, then stats
  useEffect(() => {
    const loadData = async () => {
      await fetchBrands();
    };
    loadData();
  }, []);

  // Refresh data when user changes
  useEffect(() => {
    if (user) {
      fetchBrands();
    }
  }, [user, fetchBrands]);

  // Fetch stats after brands are loaded
  useEffect(() => {
    if (!isLoading && brands.length > 0) {
      fetchStats();
    } else if (!isLoading) {
      // If no brands, still fetch stats
      fetchStats();
    }
  }, [isLoading, brands, fetchStats]);

  const handleSearch = useCallback(async () => {
    if (!searchTerm.trim()) {
      // If search is empty, load all data
      await fetchBrands();
      return;
    }

    setIsSearching(true);
    try {
      await fetchBrands(searchTerm.trim());
    } catch (error) {
      console.error('Error searching:', error);
      toast({
        title: 'Error',
        description: 'Failed to search brands',
        variant: 'destructive',
      });
    } finally {
      setIsSearching(false);
    }
  }, [searchTerm, fetchBrands, toast]);

  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
    fetchBrands();
  }, [fetchBrands]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== '') {
        handleSearch();
      } else if (searchTerm === '') {
        // If search is cleared, refresh data
        fetchBrands();
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [searchTerm, fetchBrands, handleSearch]);

  const handleBrandSuccess = (brandData: Brand | BrandCreateResponse) => {
    // Check if it's a BrandCreateResponse (new brand) or Brand (updated brand)
    if ('brand' in brandData && 'copiedAgentsCount' in brandData) {
      // This is a BrandCreateResponse (new brand)
      const newBrand = brandData as BrandCreateResponse;
      const formattedBrand: Brand = {
        _id: newBrand.brand._id || '',
        name: newBrand.brand.name || 'Unnamed Brand',
        billingEmail: newBrand.brand.billingEmail || 'No email',
        description: newBrand.brand.description || '',
        status: newBrand.brand.status || 'inactive',
        brandUser: {
          _id: newBrand.brand.brandUser?._id || newBrand.brandUser?._id || '',
          name: newBrand.brand.brandUser?.name || newBrand.brandUser?.name || 'Unknown User',
          email: newBrand.brand.brandUser?.email || newBrand.brandUser?.email || 'No email',
          role: newBrand.brand.brandUser?.role || 'Unknown'
        },
        agentCount: newBrand.brand.agentCount || 0,
        createdAt: newBrand.brand.createdAt || new Date().toISOString(),
        updatedAt: newBrand.brand.updatedAt || new Date().toISOString()
      };
      
      console.log('Adding new brand with agent count:', formattedBrand.agentCount);
      setBrands(prev => [formattedBrand, ...prev]);
      setShowForm(false);
      
      // Refresh stats after a short delay
      setTimeout(() => {
        fetchStats();
      }, 500);
      
      toast({
        title: 'Success',
        description: 'Brand created successfully!',
      });
    } else {
      // This is a Brand (updated brand)
      const updatedBrand = brandData as Brand;
      setBrands(prev => prev.map(brand => 
        brand._id === updatedBrand._id ? updatedBrand : brand
      ));
      setEditingBrand(null);
      setShowForm(false);
      // Refresh stats after a short delay
      setTimeout(() => {
        fetchStats();
      }, 500);
      toast({
        title: 'Success',
        description: 'Brand updated successfully!',
      });
    }
  };

  const handleBrandCreated = (newBrand: BrandCreateResponse) => {
    // This function is now handled by handleBrandSuccess
    handleBrandSuccess(newBrand);
  };

  const handleBrandUpdated = (updatedBrand: Brand) => {
    // This function is now handled by handleBrandSuccess
    handleBrandSuccess(updatedBrand);
  };

  const handleBrandDeleted = (brandId: string) => {
    setBrands(prev => prev.filter(brand => brand._id !== brandId));
    // Refresh stats after a short delay
    setTimeout(() => {
      fetchStats();
    }, 500);
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
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Brand
            </Button>
          ),
        }}
      >
        <div className="p-6 bg-gray-50">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Stats Cards */}
            {isStatsLoading ? (
              <div className="flex items-center justify-center min-h-[200px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : stats ? (
              <BrandStats stats={stats} />
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No stats available.</p>
              </div>
            )}

            {/* Main Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    Your Brands
                  </h2>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                  <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                    <div className="flex flex-col sm:flex-row gap-4 flex-1">
                      <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Search brands by name..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                          className="pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-11 rounded-lg"
                          disabled={isSearching}
                        />
                        {searchTerm && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearSearch}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-gray-100 rounded-full"
                            disabled={isSearching}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                      
                      {/* <Button
                        onClick={handleSearch}
                        disabled={isSearching || !searchTerm.trim()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 h-11 rounded-lg font-medium"
                      >
                        {isSearching ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Searching...
                          </>
                        ) : (
                          <>
                            <Search className="h-4 w-4 mr-2" />
                            Search
                          </>
                        )}
                      </Button> */}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 font-medium">
                        {searchTerm ? (
                          <>
                            Found {brands.length} result{brands.length !== 1 ? 's' : ''} for "{searchTerm}"
                          </>
                        ) : (
                          <>
                            {brands.length} brand{brands.length !== 1 ? 's' : ''} total
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                
                <BrandsList
                  brands={brands}
                  onEdit={handleEditBrand}
                  onDelete={handleBrandDeleted}
                  onCreateBrand={() => setShowForm(true)}
                  isLoading={isLoading}
                />
              </div>
            </div>

            {/* Brand Form Modal */}
            {showForm && (
              <BrandForm
                brand={editingBrand}
                onSuccess={handleBrandSuccess}
                onCancel={() => {
                  setShowForm(false);
                  setEditingBrand(null);
                }}
              />
            )}
          </div>
        </div>
      </Dashboard>
    </ProtectedRoute>
  );
} 