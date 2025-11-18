"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { useToast } from "@/hooks/use-toast";
import apiRequest from "@/utils/api";
import { CreditCard, DollarSign } from "lucide-react";

interface AddCreditsModalProps {
  clientId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

interface ClientData {
  remainingCredits: number;
  totalCredits: number;
  costPerMin: number;
}

export const AddCreditsModal: React.FC<AddCreditsModalProps> = ({
  clientId,
  onSuccess,
  onCancel,
}) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [creditsToPurchase, setCreditsToPurchase] = useState<number>(0);
  const [clientData, setClientData] = useState<ClientData>({
    remainingCredits: 0,
    totalCredits: 0,
    costPerMin: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch client data
  useEffect(() => {
    const fetchClient = async () => {
      try {
        setFetching(true);
        console.log("Fetching client with ID:", clientId);

        const response = await apiRequest(`/our-clients/user/${clientId}`, "GET");
        console.log("Client fetch response:", response);

        if (response.data?.success) {
          const client = response.data.data;
          console.log("Client data:", client);

          setClientData({
            remainingCredits: client.remainingCredits || 0,
            totalCredits: client.totalCredits || 0,
            costPerMin: client.costPerMin || 0,
          });
        } else {
          console.error("Client fetch failed:", response.data);
          setErrors({ fetch: "Failed to fetch client data" });
        }
      } catch (error: any) {
        console.error("Error fetching client:", error);
        setErrors({ fetch: error.message || "Failed to fetch client data" });
      } finally {
        setFetching(false);
      }
    };

    fetchClient();
  }, [clientId]);

  const handleInputChange = (value: string) => {
    // Clear any existing errors
    setErrors({});
    
    // Convert to number and validate
    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue <= 0) {
      setCreditsToPurchase(0);
      if (value !== "") {
        setErrors({ creditsToPurchase: "Please enter a valid positive number" });
      }
    } else {
      setCreditsToPurchase(numValue);
    }
  };

  const handleCostPerMinChange = (value: string) => {
    // Clear any existing errors
    const newErrors = { ...errors };
    delete newErrors.costPerMin;
    setErrors(newErrors);
    
    // Convert to number and validate
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0) {
      if (value !== "") {
        setErrors({ ...newErrors, costPerMin: "Please enter a valid non-negative number" });
      }
      setClientData({ ...clientData, costPerMin: 0 });
    } else {
      setClientData({ ...clientData, costPerMin: numValue });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (creditsToPurchase <= 0) {
      newErrors.creditsToPurchase = "Please enter a valid number of credits to add";
    }
    
    if (clientData.costPerMin < 0) {
      newErrors.costPerMin = "Cost per minute cannot be negative";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    try {
      setLoading(true);
      
      // Prepare the data for the API request
      const updateData = {
        creditsToPurchase,
        costPerMin: clientData.costPerMin
      };
      
      // Make the API request to add credits
      const response = await apiRequest(`/our-clients/add-credits/${clientId}`, "PUT", updateData);
      
      if (response.data?.success) {
        toast({
          title: "Success",
          description: `Added ${creditsToPurchase} credits to the client account.`,
        });
        
        if (onSuccess) {
          onSuccess();
        }
      } else {
        setErrors({ submit: response.data?.message || "Failed to add credits" });
      }
    } catch (error: any) {
      console.error("Error adding credits:", error);
      setErrors({ submit: error.message || "Failed to add credits" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {fetching ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {/* Current Credits */}
            <div>
              <Label htmlFor="remainingCredits">Current Credits</Label>
              <Input
                id="remainingCredits"
                value={clientData.remainingCredits.toString()}
                disabled
                className="bg-gray-100"
              />
            </div>
            
            {/* Total Credits */}
            <div>
              <Label htmlFor="totalCredits">Total Credits</Label>
              <Input
                id="totalCredits"
                value={clientData.totalCredits.toString()}
                disabled
                className="bg-gray-100"
              />
            </div>
            
            {/* Cost Per Minute */}
            <div>
              <Label htmlFor="costPerMin">Cost Per Minute ($)</Label>
              <Input
                id="costPerMin"
                type="number"
                step="0.01"
                min="0"
                value={clientData.costPerMin.toString()}
                onChange={(e) => handleCostPerMinChange(e.target.value)}
                className={errors.costPerMin ? "border-red-500" : ""}
              />
              {errors.costPerMin && (
                <p className="text-red-500 text-sm mt-1">{errors.costPerMin}</p>
              )}
            </div>
            
            {/* Credits to Purchase */}
            <div>
              <Label htmlFor="creditsToPurchase">
                <div className="flex items-center gap-1">
                  <CreditCard className="w-4 h-4" />
                  <span>Credits to Add</span>
                </div>
              </Label>
              <Input
                id="creditsToPurchase"
                type="number"
                min="1"
                value={creditsToPurchase.toString()}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Enter number of credits to add"
                className={errors.creditsToPurchase ? "border-red-500" : ""}
              />
              {errors.creditsToPurchase && (
                <p className="text-red-500 text-sm mt-1">{errors.creditsToPurchase}</p>
              )}
            </div>
          </div>

          {/* Error Messages */}
          {errors.fetch && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-600 text-sm">{errors.fetch}</p>
            </div>
          )}
          
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700"
              disabled={loading}
            >
              {loading ? "Adding Credits..." : "Add Credits"}
            </Button>
          </div>
        </>
      )}
    </form>
  );
};