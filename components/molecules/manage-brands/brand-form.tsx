'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/atoms/input';
import { Label } from '@/components/atoms/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from "react-toastify";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Building2, FileText, Eye, EyeOff } from 'lucide-react';
import apiRequest from '@/utils/api';


// Validation schema
const createBrandFormSchema = (isEdit: boolean) => z.object({
  name: z.string().min(1, 'Brand name is required').min(2, 'Brand name must be at least 2 characters'),
  billingEmail: z.string().email('Please enter a valid email address'),
  description: isEdit ? z.string().optional() : z.string().optional(),
  status: z.enum(['active', 'inactive', 'suspended']),
  password: isEdit ? z.string().optional() : z.string().min(6, 'Password must be at least 6 characters'),
  copyAgents: isEdit ? z.boolean().optional() : z.boolean().default(false)
});

type BrandFormData = z.infer<typeof brandFormSchema>;

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

interface BrandFormProps {
  brand?: Brand | null;
  onSuccess: (brand: Brand | BrandCreateResponse) => void;
  onCancel: () => void;
}

export default function BrandForm({ brand, onSuccess, onCancel }: BrandFormProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<BrandFormData>({
    resolver: zodResolver(createBrandFormSchema(!!brand)),
    defaultValues: {
      name: '',
      billingEmail: '',
      description: '',
      status: 'active',
      password: '',
      copyAgents: false
    }
  });

  useEffect(() => {
    if (brand) {
      reset({
        name: brand.name,
        billingEmail: brand.billingEmail,
        description: brand.description || '',
        status: brand.status,
        password: '',
        copyAgents: false // Default to false for existing brands
      });
    }
  }, [brand, reset]);

  const onSubmit = async (data: BrandFormData) => {
    setIsLoading(true);

    try {
      const url = brand 
        ? `/brands/${brand._id}`
        : '/brands';
      
      const method = brand ? 'PUT' : 'POST';

      // For edit mode, send name, email, and status
      const submitData = brand 
        ? { name: data.name, billingEmail: data.billingEmail, status: data.status }
        : data;

      console.log('Submitting brand form with data:', submitData);
      const response = await apiRequest(url, method, submitData);
      console.log('Brand API response:', response.data);

      if (response.data?.success) {
        console.log('Calling onSuccess with:', response.data.data);
        onSuccess(response.data.data);
        setIsOpen(false);
        toast.success(response.data.message)
          
      } else {
        throw new Error(response.data?.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error in brand form submission:', error);
      // const errorMessage = error?.response?.data?.message || "Failed to create team member";
            toast.error(error.message);
      // toast({
      //   title: 'Error',
      //   description: error instanceof Error ? error.message : 'Something went wrong',
      //   variant: 'destructive',
      // });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = handleSubmit(onSubmit, (errors) => {
    console.log('Form validation errors:', errors);
    // toast({
    //   title: 'Validation Error',
    //   description: 'Please fix the form errors before submitting.',
    //   variant: 'destructive',
    // });
  });

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
            {brand ? 'Edit Brand Details' : 'New Brand'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleFormSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {brand ? 'Edit Brand Information' : 'Basic Information'}
            </h3>
            {brand && (
              <p className="text-sm text-gray-600">
                You can edit the brand name, billing email address, and status.
              </p>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Brand Name *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Enter brand name"
                  className={errors.name ? "border-red-500" : ""}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="billingEmail">Billing Email *</Label>
                <Input
                  id="billingEmail"
                  type="email"
                  {...register("billingEmail")}
                  placeholder="billing@company.com"
                  className={errors.billingEmail ? "border-red-500" : ""}
                />
                {errors.billingEmail && (
                  <p className="text-red-500 text-xs mt-1">{errors.billingEmail.message}</p>
                )}
              </div>

              {!brand && (
                <div className="space-y-2">
                  <Label htmlFor="password">Brand User Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      placeholder="Enter password for brand user"
                      className={errors.password ? "border-red-500" : ""}
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
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                  )}
                  <p className="text-xs text-gray-500">
                    This password will be used for the brand user account
                  </p>
                </div>
              )}

              {/* Status field - available for both new and edit */}
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={watch("status")}
                  onValueChange={(value: 'active' | 'inactive' | 'suspended') => 
                    setValue("status", value)
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

              {/* Description and Copy Agents - only for new brands */}
              {!brand && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      {...register("description")}
                      placeholder="Describe your brand..."
                      rows={3}
                    />
                  </div>

                  {/* Copy Agents Checkbox */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="copyAgents"
                      checked={watch("copyAgents")}
                      onCheckedChange={(checked) => setValue("copyAgents", checked as boolean)}
                    />
                    <Label htmlFor="copyAgents" className="text-sm">
                      Copy all current agents and their configurations to the new brand.
                    </Label>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Info Message - Only for new brands */}
          {!brand && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">
                    Agent Configuration
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                    You can choose whether to copy all your current agents and their configurations 
                    to the new brand. If enabled, the new brand will have its own workspace with 
                    copies of your agents. You can always add agents later.
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
                brand ? 'Update Details' : 'Create Brand'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 