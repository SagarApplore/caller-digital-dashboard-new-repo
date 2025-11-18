'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/organisms/card';
import { Building2, CheckCircle, XCircle, Pause, TrendingUp ,CircleOff} from 'lucide-react';

interface BrandStats {
  totalBrands: number;
  activeBrands: number;
  inactiveBrands: number;
  suspendedBrands: number;
}

interface BrandStatsProps {
  stats: BrandStats;
}

export default function BrandStats({ stats }: BrandStatsProps) {
  const statCards = [
    {
      title: 'Total Brands',
      value: stats.totalBrands,
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      gradient: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Active Brands',
      value: stats.activeBrands,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      gradient: 'from-green-500 to-green-600'
    },
    {
      title: 'Inactive Brands',
      value: stats.inactiveBrands,
      icon: Pause,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      gradient: 'from-gray-500 to-gray-600'
    },

     {
      title: 'Suspended Brands',
      value: stats.suspendedBrands,
      icon: CircleOff,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-gray-200',
      gradient: 'from-red-500 to-red-600'
    },
    
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statCards.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card 
            key={index} 
            className={`border ${stat.borderColor} hover:shadow-lg transition-all duration-200 bg-white rounded-xl overflow-hidden`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`h-10 w-10 bg-gradient-to-br ${stat.gradient} rounded-lg flex items-center justify-center shadow-sm`}>
                  <IconComponent className="h-5 w-5 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {stat.value}
              </div>
              <p className="text-sm text-gray-500 font-medium">
                {stat.title.toLowerCase()}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
} 