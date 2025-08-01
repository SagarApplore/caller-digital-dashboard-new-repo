"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Coins } from 'lucide-react';
import apiRequest from '@/utils/api';
import { io, Socket } from 'socket.io-client';

interface CreditInfo {
  totalCredits: number;
  usedCredits: number;
  remainingCredits: number;
  usagePercentage: number;
}

export const CreditDisplay: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [credits, setCredits] = useState<CreditInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null);

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

  // Listen for real-time credit updates
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // Fetch initial credits
    fetchCredits();

    console.log('🔌 Attempting to connect to Socket.IO server...');
    console.log('👤 User ID:', user.id);

    // Set up Socket.IO connection for real-time updates
    const socketInstance = io('http://localhost:8000', {
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
      <div className="flex flex-col items-center space-y-2">
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
      </div>
    </div>
  );
}; 