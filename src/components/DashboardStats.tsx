
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, IndianRupee } from 'lucide-react';

interface DashboardStatsProps {
  totalCredit: number;
  totalDebit: number;
  netBalance: number;
  totalCustomers: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  totalCredit,
  totalDebit,
  netBalance,
  totalCustomers
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Total Credit</CardTitle>
          <TrendingUp className="h-4 w-4 opacity-90" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{totalCredit.toLocaleString()}</div>
          <p className="text-xs opacity-90 mt-1">Amount to give</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Total Debit</CardTitle>
          <TrendingDown className="h-4 w-4 opacity-90" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{totalDebit.toLocaleString()}</div>
          <p className="text-xs opacity-90 mt-1">Amount to get</p>
        </CardContent>
      </Card>

      <Card className={`bg-gradient-to-r ${netBalance >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'} text-white`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Net Balance</CardTitle>
          <IndianRupee className="h-4 w-4 opacity-90" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{Math.abs(netBalance).toLocaleString()}</div>
          <p className="text-xs opacity-90 mt-1">
            {netBalance >= 0 ? 'In your favor' : 'Outstanding'}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium opacity-90">Total Customers</CardTitle>
          <Users className="h-4 w-4 opacity-90" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCustomers}</div>
          <p className="text-xs opacity-90 mt-1">Active customers</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
