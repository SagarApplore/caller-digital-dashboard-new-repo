"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CreditCard, AlertTriangle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/organisms/card';
import { useAuth } from '@/components/providers/auth-provider';

export default function PaymentRequiredPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [creditInfo, setCreditInfo] = useState<any>(null);

  useEffect(() => {
    // Try to get credit info from URL parameters if available
    if (searchParams) {
      const totalCredits = searchParams.get('totalCredits');
      const usedCredits = searchParams.get('usedCredits');
      const remainingCredits = searchParams.get('remainingCredits');

      if (totalCredits && usedCredits && remainingCredits) {
        setCreditInfo({
          totalCredits: parseInt(totalCredits),
          usedCredits: parseInt(usedCredits),
          remainingCredits: parseInt(remainingCredits)
        });
      }
    }
  }, [searchParams]);

  const handleUpgrade = () => {
    // Navigate to upgrade page or billing page
    router.push('/billing');
  };

  const handleLogout = () => {
    // Use the auth provider's logout function
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Credits Exhausted
          </CardTitle>
          <CardDescription className="text-gray-600">
            Your account has no remaining credits. Please upgrade your plan to continue.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {creditInfo ? (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Credits:</span>
                <span className="font-medium">{creditInfo.totalCredits}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Used Credits:</span>
                <span className="font-medium text-red-600">{creditInfo.usedCredits}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Remaining Credits:</span>
                <span className="font-medium text-red-600">{creditInfo.remainingCredits}</span>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="text-center text-sm text-gray-600 mb-4">
                You have reached your credit limit. To continue using our services, please upgrade your plan.
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Button 
              onClick={handleUpgrade} 
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Upgrade Plan
            </Button>
            
            <Button 
              onClick={handleLogout} 
              variant="outline" 
              className="w-full"
            >
              Logout
            </Button>
          </div>

          <div className="text-center text-sm text-gray-500">
            <Clock className="w-4 h-4 inline mr-1" />
            Need help? Contact support for assistance.
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 