'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/atoms/input';
import { Label } from '@/components/atoms/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Building2, FileText, Eye, EyeOff } from 'lucide-react';
import apiRequest from '@/utils/api';

interface Brand {
  _id: string;
  name: string;
  billingEmail: string;
  description?: string;
  status: 'active' | 'inactive' | 'suspended';
}

interface BrandFormProps {
  brand?: Brand | null;
  onSuccess: (brand: Brand) => void;
  onCancel: () => void;
}

export default function BrandForm({ brand, onSuccess, onCancel }: BrandFormProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    billingEmail: '',
    description: '',
    status: 'active' as 'active' | 'inactive' | 'suspended',
    password: ''
  });

  const { toast } = useToast();

  useEffect(() => {
    if (brand) {
      setFormData({
        name: brand.name,
        billingEmail: brand.billingEmail,
        description: brand.description || '',
        status: brand.status,
        password: ''
      });
    }
  }, [brand]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = brand 
        ? `/brands/${brand._id}`
        : '/brands';
      
      const method = brand ? 'PUT' : 'POST';

      const response = await apiRequest(url, method, formData);

      if (response.data?.success) {
        onSuccess(response.data.data);
        setIsOpen(false);
        toast({
          title: 'Success',
          description: brand ? 'Brand updated successfully!' : 'Brand created successfully!',
        });
      } else {
        throw new Error(response.data?.message || 'Something went wrong');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    onCancel();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {brand ? 'Edit Brand' : 'New Brand'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Brand Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter brand name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="billingEmail">Billing Email *</Label>
                <Input
                  id="billingEmail"
                  type="email"
                  value={formData.billingEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, billingEmail: e.target.value }))}
                  placeholder="billing@company.com"
                  required
                />
              </div>

              {!brand && (
                <div className="space-y-2">
                  <Label htmlFor="password">Brand User Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Enter password for brand user"
                      required={!brand}
                      minLength={6}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    This password will be used for the brand user account
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your brand..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'active' | 'inactive' | 'suspended') => 
                    setFormData(prev => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Info Message */}
          {!brand && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">
                    Agent Copying
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    When you create a new brand, all your current agents will be copied 
                    to the new brand with their configurations. The new brand will have 
                    its own user account and workspace.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="min-w-[100px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {brand ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                brand ? 'Update Brand' : 'Create Brand'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 