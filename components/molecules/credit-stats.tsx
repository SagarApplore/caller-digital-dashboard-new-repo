"use client";

import React, { useEffect, useState } from 'react';
import { CreditCard, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../organisms/card';
import { useAuth } from '../providers/auth-provider';
import apiRequest from '@/utils/api';

interface CreditInfo {
  totalCredits: number;
  usedCredits: number;
  remainingCredits: number;
}

const CreditStats: React.FC = () => {
  const { user } = useAuth();
  const [creditInfo, setCreditInfo] = useState<CreditInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreditInfo = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Use the dedicated credit endpoint
        const response = await apiRequest('/credit/current-user', 'GET');
        console.log('Credit stats response:', response.data); // Debug log
        
        if (response.data?.success && response.data?.data) {
          setCreditInfo(response.data.data);
        } else {
          console.log('No credit info found in response for credit stats');
        }
      } catch (error) {
        console.error('Error fetching credit info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreditInfo();
  }, [user]);

  if (loading || !creditInfo) {
    return (
      <Card className="bg-white border border-gray-200 rounded-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-gray-400" />
            Credit Usage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const usagePercentage = creditInfo.totalCredits > 0 
    ? (creditInfo.usedCredits / creditInfo.totalCredits) * 100 
    : 0;

  const isLow = usagePercentage >= 90;
  const isExhausted = creditInfo.remainingCredits <= 0;
  const isHealthy = usagePercentage < 70;

  const getStatusColor = () => {
    if (isExhausted) return 'text-red-600';
    if (isLow) return 'text-yellow-600';
    if (isHealthy) return 'text-green-600';
    return 'text-gray-600';
  };

  const getStatusIcon = () => {
    if (isExhausted) return <TrendingDown className="w-4 h-4 text-red-600" />;
    if (isLow) return <TrendingDown className="w-4 h-4 text-yellow-600" />;
    if (isHealthy) return <TrendingUp className="w-4 h-4 text-green-600" />;
    return <CreditCard className="w-4 h-4 text-gray-600" />;
  };

  const getStatusText = () => {
    if (isExhausted) return 'Exhausted';
    if (isLow) return 'Low Credits';
    if (isHealthy) return 'Healthy';
    return 'Good';
  };

  return (
    <Card className="bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-gray-600" />
          Credit Usage
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Main Credit Display */}
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {creditInfo.remainingCredits.toLocaleString()}
              <span className="text-lg text-gray-500 font-normal"> / {creditInfo.totalCredits.toLocaleString()}</span>
            </div>
            <div className="text-sm text-gray-600">Credits Remaining</div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Usage</span>
              <span className="font-medium">{usagePercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  isExhausted ? 'bg-red-500' : 
                  isLow ? 'bg-yellow-500' : 
                  'bg-green-500'
                }`}
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              ></div>
            </div>
          </div>

          {/* Status */}
          <div className={`flex items-center justify-center gap-2 p-2 rounded-lg ${
            isExhausted ? 'bg-red-50 border border-red-200' :
            isLow ? 'bg-yellow-50 border border-yellow-200' :
            'bg-green-50 border border-green-200'
          }`}>
            {getStatusIcon()}
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>

          {/* Usage Breakdown */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center">
              <div className="font-semibold text-gray-900">
                {creditInfo.usedCredits.toLocaleString()}
              </div>
              <div className="text-gray-600">Used</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-900">
                {creditInfo.totalCredits.toLocaleString()}
              </div>
              <div className="text-gray-600">Total</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreditStats; 