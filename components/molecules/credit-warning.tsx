"use client";

import React from 'react';
import { AlertTriangle, CreditCard } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Button } from '../ui/button';

interface CreditWarningProps {
  totalCredits: number;
  usedCredits: number;
  remainingCredits: number;
  onUpgrade?: () => void;
}

const CreditWarning: React.FC<CreditWarningProps> = ({
  totalCredits,
  usedCredits,
  remainingCredits,
  onUpgrade
}) => {
  const usagePercentage = totalCredits > 0 ? (usedCredits / totalCredits) * 100 : 0;
  const isLow = remainingCredits <= totalCredits * 0.1; // 10% or less remaining
  const isExhausted = remainingCredits <= 0;

  if (isExhausted) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertTitle className="text-red-800">Credits Exhausted</AlertTitle>
        <AlertDescription className="text-red-700">
          You have no remaining credits. Please upgrade your plan to continue using the service.
          <div className="mt-2">
            <Button 
              onClick={onUpgrade} 
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Upgrade Plan
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (isLow) {
    return (
      <Alert className="border-yellow-200 bg-yellow-50">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertTitle className="text-yellow-800">Low Credits Warning</AlertTitle>
        <AlertDescription className="text-yellow-700">
          You have {remainingCredits} credits remaining ({usagePercentage.toFixed(1)}% used). 
          Consider upgrading your plan to avoid service interruption.
          <div className="mt-2">
            <Button 
              onClick={onUpgrade} 
              variant="outline" 
              className="border-yellow-600 text-yellow-700 hover:bg-yellow-100"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Upgrade Plan
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return null;
};

export default CreditWarning; 