'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/organisms/card';
import { Building2, CheckCircle, XCircle, Pause, TrendingUp } from 'lucide-react';

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
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800'
    },
    {
      title: 'Active Brands',
      value: stats.activeBrands,
      icon: CheckCircle,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800'
    },
    {
      title: 'Inactive Brands',
      value: stats.inactiveBrands,
      icon: Pause,
      color: 'text-gray-600 dark:text-gray-400',
      bgColor: 'bg-gray-50 dark:bg-gray-900/20',
      borderColor: 'border-gray-200 dark:border-gray-800'
    },
    {
      title: 'Suspended Brands',
      value: stats.suspendedBrands,
      icon: XCircle,
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card 
            key={index} 
            className={`border ${stat.borderColor} hover:shadow-md transition-shadow`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <IconComponent className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stat.title.toLowerCase()}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
} 