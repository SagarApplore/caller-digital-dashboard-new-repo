"use client";

import React, { useEffect, useState } from 'react';
import { CreditCard } from 'lucide-react';
import { useAuth } from '../providers/auth-provider';
import apiRequest from '@/utils/api';

interface CreditInfo {
  totalCredits: number;
  usedCredits: number;
  remainingCredits: number;
}

const CreditDisplay: React.FC = () => {
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
        // Use the correct endpoint path
        const response = await apiRequest('/credits/current-user', 'GET');
        console.log('Header credit response:', response.data); // Debug log
        
        if (response.data?.success && response.data?.data) {
          setCreditInfo(response.data.data);
        } else {
          console.log('No credit info found in response');
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
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border">
        <CreditCard className="w-4 h-4 text-gray-400 animate-pulse" />
        <div className="text-sm text-gray-400">Loading...</div>
      </div>
    );
  }

  const usagePercentage = creditInfo.totalCredits > 0 
    ? (creditInfo.usedCredits / creditInfo.totalCredits) * 100 
    : 0;

  const isLow = usagePercentage >= 90;
  const isExhausted = creditInfo.remainingCredits <= 0;

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
      <CreditCard className={`w-4 h-4 ${isExhausted ? 'text-red-500' : isLow ? 'text-yellow-500' : 'text-green-500'}`} />
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-1">
          <span className={`text-sm font-bold ${isExhausted ? 'text-red-600' : isLow ? 'text-yellow-600' : 'text-green-600'}`}>
            {creditInfo.remainingCredits.toLocaleString()}
          </span>
          <span className="text-sm text-gray-400">/</span>
          <span className="text-sm text-gray-600 font-medium">
            {creditInfo.totalCredits.toLocaleString()}
          </span>
        </div>
        <div className="text-xs text-gray-500">Credits</div>
      </div>
      {isExhausted && (
        <span className="text-xs text-red-600 font-medium bg-red-50 px-2 py-1 rounded">Exhausted</span>
      )}
      {isLow && !isExhausted && (
        <span className="text-xs text-yellow-600 font-medium bg-yellow-50 px-2 py-1 rounded">Low</span>
      )}
    </div>
  );
};

export default CreditDisplay; 