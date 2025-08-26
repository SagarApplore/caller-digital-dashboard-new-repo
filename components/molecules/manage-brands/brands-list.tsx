'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/organisms/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Building2, 
  Users, 
  Calendar,
  Mail,
  Globe,
  Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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

interface BrandsListProps {
  brands: Brand[];
  onEdit: (brand: Brand) => void;
  onDelete: (brandId: string) => void;
  onCreateBrand: () => void;
  isLoading: boolean;
}

export default function BrandsList({ brands, onEdit, onDelete, onCreateBrand, isLoading }: BrandsListProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
  const { toast } = useToast();

  // Debug logging
  console.log('BrandsList received brands:', brands);
  console.log('BrandsList isLoading:', isLoading);

  const handleDeleteClick = (brand: Brand) => {
    setBrandToDelete(brand);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!brandToDelete) return;

    try {
      const response = await apiRequest(`/brands/${brandToDelete._id}`, 'DELETE');

      if (response.data?.success) {
        onDelete(brandToDelete._id);
        toast({
          title: 'Success',
          description: 'Brand deleted successfully!',
        });
      } else {
        throw new Error(response.data?.message || 'Failed to delete brand');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete brand',
        variant: 'destructive',
      });
    } finally {
      setDeleteDialogOpen(false);
      setBrandToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) {
      console.log('No date string provided');
      return 'Invalid Date';
    }
    
    console.log('Formatting date:', dateString);
    
    try {
      // Handle different date formats
      let date: Date;
      
      if (typeof dateString === 'string') {
        // Try parsing as ISO string first
        date = new Date(dateString);
        
        // If that fails, try other formats
        if (isNaN(date.getTime())) {
          // Try parsing as timestamp
          const timestamp = parseInt(dateString);
          if (!isNaN(timestamp)) {
            date = new Date(timestamp);
          } else {
            // Try parsing as date string
            date = new Date(dateString.replace(/(\d{4})-(\d{2})-(\d{2})/, '$1-$2-$3'));
          }
        }
      } else {
        date = new Date(dateString);
      }
      
      if (isNaN(date.getTime())) {
        console.log('Invalid date after parsing:', dateString);
        return 'Invalid Date';
      }
      
      const formatted = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      
      console.log('Formatted date:', formatted);
      return formatted;
    } catch (error) {
      console.error('Error formatting date:', error, 'for date string:', dateString);
      return 'Invalid Date';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'suspended':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    if (!status) return 'Unknown';
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 bg-gray-200 rounded-xl"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="h-16 bg-gray-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (brands.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="h-24 w-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <Building2 className="h-12 w-12 text-blue-600" />
        </div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-3">
          No brands yet
        </h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Create your first brand to start organizing your agents and phone numbers
        </p>
        <Button 
          onClick={onCreateBrand}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Your First Brand
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {brands.map((brand) => {
        console.log('Rendering brand:', {
          id: brand._id,
          name: brand.name,
          billingEmail: brand.billingEmail,
          status: brand.status,
          brandUser: brand.brandUser,
          agentCount: brand.agentCount,
          createdAt: brand.createdAt,
           updatedAt: brand.updatedAt
        });
        
        return (
        <Card key={brand._id} className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm bg-white rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {brand.name || 'Unnamed Brand'}
                    </h3>
                    <div className="flex items-center gap-3">
                      <Badge className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(brand.status)}`}>
                        {getStatusText(brand.status)}
                      </Badge>
                      <span className="text-sm text-gray-600 font-medium">
                        {brand.agentCount || 0} agents
                      </span>
                    </div>
                  </div>
                </div>

                {brand.description && (
                  <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                    {brand.description}
                  </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Mail className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Billing Email</p>
                      <p className="text-sm text-gray-900 font-medium truncate">
                        {brand.billingEmail || 'No email'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Users className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Brand User</p>
                      <p className="text-sm text-gray-900 font-medium truncate">
                        {brand.brandUser?.name || 'Unknown User'}
                      </p>
                    </div>
                  </div>
                  
                  {/* <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Globe className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Role</p>
                      <p className="text-sm text-gray-900 font-medium truncate">
                        {brand.brandUser?.role || 'Unknown'}
                      </p>
                    </div>
                  </div> */}
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">CreatedAt</p>
                      <p className="text-sm text-gray-900 font-medium">
                        {formatDate(brand.createdAt)}
                      </p>
                    </div>
                  </div>

                   <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="h-8 w-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">UpdatedAt</p>
                      <p className="text-sm text-gray-900 font-medium">
                        {formatDate(brand.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-10 w-10 p-0 hover:bg-gray-100 rounded-lg">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => onEdit(brand)} className="cursor-pointer">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Brand
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleDeleteClick(brand)}
                    className="text-red-600 cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Brand
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>
        );
      })}

      {/* Delete Confirmation Dialog */}
              <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Brand</AlertDialogTitle>
            <div className="text-sm text-muted-foreground">
              <p>Are you sure you want to delete "{brandToDelete?.name}"? This action cannot be undone.</p>
              <br />
              <p>This will also delete:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>All agents associated with this brand</li>
                <li>The brand user account</li>
                <li>All brand data and configurations</li>
              </ul>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Brand
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 