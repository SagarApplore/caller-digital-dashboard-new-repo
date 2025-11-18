"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Coins, Plus, CreditCard, History } from 'lucide-react';
import apiRequest from '@/utils/api';
import { io, Socket } from 'socket.io-client';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/atoms/input';
import { Label } from '@/components/atoms/label';
import { toast } from 'react-toastify';

interface CreditInfo {
  totalCredits: number;
  usedCredits: number;
  remainingCredits: number;
  usagePercentage: number;
}

interface PaymentHistory {
  _id: string;
  amount: number;
  creditsPurchased: number;
  status: string;
  createdAt: string;
  paymentId: string;
}

export const CreditDisplay: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [credits, setCredits] = useState<CreditInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);

  // Fetch initial credits
  const fetchCredits = async () => {
    if (!isAuthenticated || !user) return;

    try {
      setLoading(true);
      const response = await apiRequest('/credits/current-user', 'GET');
      if (response.data?.success) {
        setCredits(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch payment history
  const fetchPaymentHistory = async () => {
    if (!isAuthenticated || !user) return;

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
        const { order } = orderResponse.data;
        const creditsToPurchase = parseFloat(purchaseAmount) * 100; // 1 Rupee = 100 credits
        
        // Initialize Razorpay
        const options = {
          key: order.key, // Use key from backend response
          amount: order.amount,
          currency: order.currency,
          name: 'Caller Digital',
          description: `Purchase ${creditsToPurchase} credits`,
          order_id: order.id,
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
                fetchCredits(); // Refresh credits
              } else {
                toast.error('Payment verification failed');
              }
            } catch (error) {
              console.error('Payment verification error:', error);
              toast.error('Payment verification failed');
            }
          },
          prefill: {
            name: user?.name || '',
            email: user?.email || ''
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

  // Listen for real-time credit updates
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // Fetch initial credits
    fetchCredits();

    console.log('🔌 Attempting to connect to Socket.IO server...');
    console.log('👤 User ID:', user.id);

    // Set up Socket.IO connection for real-time updates
    const socketInstance = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'http://localhost:8000', {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      forceNew: true
    });

    socketInstance.on('connect', () => {
      console.log('✅ Connected to credit updates Socket.IO');
      console.log('🔌 Socket ID:', socketInstance.id);
      // Join user room
      socketInstance.emit('join-user-room', user.id);
      console.log('👤 Emitted join-user-room for user:', user.id);
    });

    socketInstance.on('credits-updated', (data) => {
      console.log('📊 Received credits-updated event:', data);
      setCredits({
        totalCredits: data.totalCredits,
        usedCredits: data.usedCredits,
        remainingCredits: data.remainingCredits,
        usagePercentage: data.totalCredits > 0 ? (data.usedCredits / data.totalCredits) * 100 : 0
      });
      console.log('📊 Credits updated in real-time:', data);
    });

    socketInstance.on('disconnect', (reason) => {
      console.log('🔌 Socket.IO connection disconnected. Reason:', reason);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('❌ Socket.IO connection error:', error);
      console.error('❌ Error details:', {
        message: error.message,
        name: error.name
      });
    });

    socketInstance.on('error', (error) => {
      console.error('❌ Socket.IO general error:', error);
    });

    setSocket(socketInstance);

    return () => {
      console.log('🔌 Disconnecting Socket.IO...');
      socketInstance.disconnect();
    };
  }, [isAuthenticated, user]);

  if (!isAuthenticated || !user) {
    return null;
  }

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center py-4">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!credits) {
    return null;
  }

  const getCreditColor = () => {
    const percentage = credits.usagePercentage;
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="w-full">
      <div className="flex flex-col items-center space-y-3">
        <div className="flex items-center space-x-2">
          <Coins className={`w-4 h-4 ${getCreditColor()}`} />
          <span className="text-sm font-medium text-gray-900">Credits</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className={`text-lg font-bold ${getCreditColor()}`}>
            {credits.remainingCredits.toLocaleString()}
          </span>
          <span className="text-lg text-gray-400">/</span>
          <span className="text-lg text-gray-600 font-medium">
            {credits.totalCredits.toLocaleString()}
          </span>
        </div>
        
        {/* Usage indicator */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-300 ${
              credits.usagePercentage >= 90 ? 'bg-red-500' : 
              credits.usagePercentage >= 75 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(credits.usagePercentage, 100)}%` }}
          ></div>
        </div>
        
        {/* Usage percentage */}
        <div className="text-xs text-gray-500">
          {credits.usagePercentage.toFixed(1)}% used
        </div>

        {/* Action buttons */}
        <div className="flex space-x-2 w-full">
          <Dialog open={showPurchaseModal} onOpenChange={setShowPurchaseModal}>
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Plus className="w-3 h-3 mr-1" />
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

          <Dialog open={showHistoryModal} onOpenChange={setShowHistoryModal}>
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                variant="outline"
                onClick={fetchPaymentHistory}
              >
                <History className="w-3 h-3" />
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
          </Dialog>
        </div>
      </div>
    </div>
  );
}; 