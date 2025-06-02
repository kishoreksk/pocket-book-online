
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, TrendingUp, TrendingDown } from 'lucide-react';

interface Customer {
  id: string;
  name: string;
  phone: string;
  balance: number;
  lastTransaction: string;
}

interface Transaction {
  id: string;
  customerId: string;
  customerName: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
}

interface CustomerTransactionHistoryProps {
  customer: Customer;
  transactions: Transaction[];
  onClose: () => void;
}

const CustomerTransactionHistory: React.FC<CustomerTransactionHistoryProps> = ({ 
  customer, 
  transactions, 
  onClose 
}) => {
  const customerTransactions = transactions.filter(t => t.customerId === customer.id);
  
  const totalCredit = customerTransactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalDebit = customerTransactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-xl">{customer.name} - Transaction History</CardTitle>
            <p className="text-sm text-gray-600 mt-1">{customer.phone}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Customer Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-blue-50">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Current Balance</p>
                  <p className={`text-xl font-bold ${customer.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    ₹{Math.abs(customer.balance).toLocaleString()}
                    <span className="text-sm ml-1">
                      {customer.balance >= 0 ? 'To Give' : 'To Get'}
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total Credit</p>
                  <p className="text-xl font-bold text-green-600">
                    ₹{totalCredit.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-red-50">
              <CardContent className="p-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Total Debit</p>
                  <p className="text-xl font-bold text-red-600">
                    ₹{totalDebit.toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Transaction List */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Transaction History ({customerTransactions.length} transactions)
            </h3>
            
            {customerTransactions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No transactions found for this customer</p>
              </div>
            ) : (
              <div className="space-y-3">
                {customerTransactions
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'}`}>
                          {transaction.type === 'credit' ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(transaction.date).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={transaction.type === 'credit' ? 'default' : 'destructive'}
                          className="font-semibold"
                        >
                          {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {transaction.type === 'credit' ? 'You Received' : 'You Gave'}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerTransactionHistory;
