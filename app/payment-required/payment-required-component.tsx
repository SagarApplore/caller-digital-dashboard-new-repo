"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CreditCard, AlertTriangle, Clock, Plus, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/organisms/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/atoms/input';
import { Label } from '@/components/atoms/label';
import { toast } from 'react-toastify';
import apiRequest from '@/utils/api';

interface PaymentHistory {
  _id: string;
  amount: number;
  creditsPurchased: number;
  status: string;
  createdAt: string;
  paymentId: string;
}

export default function PaymentRequiredComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [creditInfo, setCreditInfo] = useState<any>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);

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

  // Fetch payment history
  const fetchPaymentHistory = async () => {
    try {
      const response = await apiRequest('/credits-payment/payment-history', 'GET');
      if (response.data?.success) {
        setPaymentHistory(response.data.data.payments);
      }
    } catch (error) {
      console.error('Error fetching payment history:', error);
    }
  };

  // Handle credit purchase
  const handleCreditPurchase = async () => {
    if (!purchaseAmount || parseFloat(purchaseAmount) < 1) {
      toast.error('Please enter a valid amount (minimum ₹1)');
      return;
    }

    setIsProcessing(true);
    try {
      // Create order
      const orderResponse = await apiRequest('/credits-payment/create-order', 'POST', {
        amount: parseFloat(purchaseAmount)
      });

      if (orderResponse.data?.success) {
        const { orderId, amount, creditsToPurchase } = orderResponse.data.data;
        
        // Initialize Razorpay
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: amount,
          currency: 'INR',
          name: 'Caller Digital',
          description: `Purchase ${creditsToPurchase} credits`,
          order_id: orderId,
          handler: async function (response: any) {
            try {
              // Verify payment
              const verifyResponse = await apiRequest('/credits-payment/verify-payment', 'POST', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              });

              if (verifyResponse.data?.success) {
                toast.success(`Successfully purchased ${creditsToPurchase} credits!`);
                setShowPurchaseModal(false);
                setPurchaseAmount('');
                // Redirect back to dashboard after successful purchase
                router.push('/dashboard');
              } else {
                toast.error('Payment verification failed');
              }
            } catch (error) {
              console.error('Payment verification error:', error);
              toast.error('Payment verification failed');
            }
          },
          prefill: {
            name: 'User',
            email: 'user@example.com'
          },
          theme: {
            color: '#8B5CF6'
          }
        };

        const razorpay = new (window as any).Razorpay(options);
        razorpay.open();
      } else {
        toast.error('Failed to create order');
      }
    } catch (error) {
      console.error('Credit purchase error:', error);
      toast.error('Failed to process purchase');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpgrade = () => {
    // Navigate to upgrade page or billing page
    router.push('/billing');
  };

  const handleLogout = () => {
    // Simple logout - clear localStorage and redirect to login
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      router.push('/login');
    }
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
            Your account has no remaining credits. Please add credits to continue.
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
                You have reached your credit limit. To continue using our services, please add credits.
              </div>
            </div>
          )}

          <div className="space-y-3">
            {/* Add Credits Button */}
            <Dialog open={showPurchaseModal} onOpenChange={setShowPurchaseModal}>
              <DialogTrigger asChild>
                <Button 
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Credits
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5 text-purple-600" />
                    <span>Purchase Credits</span>
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="amount">Amount (₹)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount in rupees"
                      value={purchaseAmount}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPurchaseAmount(e.target.value)}
                      min="1"
                      step="1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      1 Rupee = 100 credits
                    </p>
                  </div>
                  {purchaseAmount && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">
                        You will receive: <span className="font-semibold text-purple-600">
                          {(parseFloat(purchaseAmount) * 100).toLocaleString()} credits
                        </span>
                      </p>
                    </div>
                  )}
                  <Button 
                    onClick={handleCreditPurchase}
                    disabled={isProcessing || !purchaseAmount || parseFloat(purchaseAmount) < 1}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    {isProcessing ? 'Processing...' : 'Proceed to Payment'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Payment History Button */}
            {/* <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={fetchPaymentHistory}
                >
                  <History className="w-4 h-4 mr-2" />
                  Payment History
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <History className="w-5 h-5 text-purple-600" />
                    <span>Payment History</span>
                  </DialogTitle>
                </DialogHeader>
                <div className="max-h-60 overflow-y-auto">
                  {paymentHistory.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No payment history found</p>
                  ) : (
                    <div className="space-y-3">
                      {paymentHistory.map((payment) => (
                        <div key={payment._id} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{payment.creditsPurchased.toLocaleString()} credits</p>
                              <p className="text-sm text-gray-500">₹{payment.amount}</p>
                            </div>
                            <div className="text-right">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                                payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {payment.status}
                              </span>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(payment.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog> */}

            {/* <Button 
              onClick={handleUpgrade} 
              variant="outline"
              className="w-full"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Upgrade Plan
            </Button> */}
            
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