
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Transaction {
  id: string;
  customerId: string;
  customerName: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
}

interface TransactionChartProps {
  transactions: Transaction[];
}

const TransactionChart: React.FC<TransactionChartProps> = ({ transactions }) => {
  // Group transactions by date and calculate daily totals
  const chartData = transactions.reduce((acc, transaction) => {
    const date = transaction.date;
    if (!acc[date]) {
      acc[date] = { date, credit: 0, debit: 0 };
    }
    
    if (transaction.type === 'credit') {
      acc[date].credit += transaction.amount;
    } else {
      acc[date].debit += transaction.amount;
    }
    
    return acc;
  }, {} as Record<string, { date: string; credit: number; debit: number }>);

  const data = Object.values(chartData).sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              formatter={(value: number, name: string) => [
                `₹${value.toLocaleString()}`,
                name === 'credit' ? 'Credit (Received)' : 'Debit (Given)'
              ]}
              labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
            />
            <Bar dataKey="credit" fill="#16a34a" name="credit" />
            <Bar dataKey="debit" fill="#dc2626" name="debit" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default TransactionChart;
