"use client";

import React, { Suspense } from 'react';
import dynamicImport from 'next/dynamic';

// Dynamically import the component to prevent SSR issues
const PaymentRequiredComponent = dynamicImport(() => import('./payment-required-component'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
    </div>
  ),
});

// Force dynamic rendering to prevent SSR issues
export const dynamic = 'force-dynamic';

function PaymentRequiredWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    }>
      <PaymentRequiredComponent />
    </Suspense>
  );
}

export default PaymentRequiredWrapper; 