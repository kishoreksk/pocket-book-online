
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Users, TrendingUp, TrendingDown, IndianRupee, Eye, Edit, Trash2 } from 'lucide-react';
import CustomerForm from '@/components/CustomerForm';
import TransactionForm from '@/components/TransactionForm';
import DashboardStats from '@/components/DashboardStats';
import TransactionChart from '@/components/TransactionChart';

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

const Index = () => {
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: '1',
      name: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      balance: 2500,
      lastTransaction: '2024-06-01'
    },
    {
      id: '2',
      name: 'Priya Sharma',
      phone: '+91 87654 32109',
      balance: -1200,
      lastTransaction: '2024-06-02'
    },
    {
      id: '3',
      name: 'Mohammed Ali',
      phone: '+91 76543 21098',
      balance: 3400,
      lastTransaction: '2024-05-30'
    }
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      customerId: '1',
      customerName: 'Rajesh Kumar',
      type: 'credit',
      amount: 2500,
      description: 'Payment received',
      date: '2024-06-01'
    },
    {
      id: '2',
      customerId: '2',
      customerName: 'Priya Sharma',
      type: 'debit',
      amount: 1200,
      description: 'Goods sold',
      date: '2024-06-02'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const totalCredit = customers.reduce((sum, customer) => 
    sum + (customer.balance > 0 ? customer.balance : 0), 0
  );

  const totalDebit = customers.reduce((sum, customer) => 
    sum + (customer.balance < 0 ? Math.abs(customer.balance) : 0), 0
  );

  const netBalance = totalCredit - totalDebit;

  const addCustomer = (customerData: Omit<Customer, 'id' | 'balance' | 'lastTransaction'>) => {
    const newCustomer: Customer = {
      ...customerData,
      id: Date.now().toString(),
      balance: 0,
      lastTransaction: new Date().toISOString().split('T')[0]
    };
    setCustomers([...customers, newCustomer]);
    setShowCustomerForm(false);
  };

  const addTransaction = (transactionData: Omit<Transaction, 'id' | 'customerName'>) => {
    const customer = customers.find(c => c.id === transactionData.customerId);
    if (!customer) return;

    const newTransaction: Transaction = {
      ...transactionData,
      id: Date.now().toString(),
      customerName: customer.name
    };

    setTransactions([...transactions, newTransaction]);
    
    // Update customer balance
    const balanceChange = transactionData.type === 'credit' 
      ? transactionData.amount 
      : -transactionData.amount;
    
    setCustomers(customers.map(c => 
      c.id === transactionData.customerId 
        ? { 
            ...c, 
            balance: c.balance + balanceChange,
            lastTransaction: transactionData.date
          }
        : c
    ));
    
    setShowTransactionForm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <IndianRupee className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">KhataBook</h1>
                <p className="text-sm text-gray-500">Digital Ledger</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={() => setShowCustomerForm(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Customer
              </Button>
              <Button
                onClick={() => setShowTransactionForm(true)}
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <DashboardStats 
              totalCredit={totalCredit}
              totalDebit={totalDebit}
              netBalance={netBalance}
              totalCustomers={customers.length}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TransactionChart transactions={transactions} />
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Recent Customers</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {customers.slice(0, 5).map((customer) => (
                      <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{customer.name}</p>
                          <p className="text-sm text-gray-500">{customer.phone}</p>
                        </div>
                        <Badge 
                          variant={customer.balance >= 0 ? "default" : "destructive"}
                          className="font-semibold"
                        >
                          ₹{Math.abs(customer.balance).toLocaleString()}
                          {customer.balance >= 0 ? ' To Give' : ' To Get'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Customer Management</CardTitle>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search customers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredCustomers.map((customer) => (
                    <Card key={customer.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-lg">{customer.name}</h3>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{customer.phone}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Balance:</span>
                          <Badge 
                            variant={customer.balance >= 0 ? "default" : "destructive"}
                            className="font-semibold"
                          >
                            {customer.balance >= 0 ? (
                              <TrendingUp className="h-3 w-3 mr-1" />
                            ) : (
                              <TrendingDown className="h-3 w-3 mr-1" />
                            )}
                            ₹{Math.abs(customer.balance).toLocaleString()}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-400 mt-2">
                          Last transaction: {customer.lastTransaction}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'}`}>
                          {transaction.type === 'credit' ? (
                            <TrendingUp className={`h-4 w-4 text-green-600`} />
                          ) : (
                            <TrendingDown className={`h-4 w-4 text-red-600`} />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{transaction.customerName}</p>
                          <p className="text-sm text-gray-500">{transaction.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">{transaction.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Customers (By Balance)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {customers
                      .sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance))
                      .slice(0, 5)
                      .map((customer, index) => (
                        <div key={customer.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                            <span className="font-medium">{customer.name}</span>
                          </div>
                          <Badge variant={customer.balance >= 0 ? "default" : "destructive"}>
                            ₹{Math.abs(customer.balance).toLocaleString()}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Monthly Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-green-700 font-medium">Total Credit</span>
                      <span className="text-green-700 font-bold">₹{totalCredit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <span className="text-red-700 font-medium">Total Debit</span>
                      <span className="text-red-700 font-bold">₹{totalDebit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-blue-700 font-medium">Net Balance</span>
                      <span className={`font-bold ${netBalance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                        ₹{Math.abs(netBalance).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      {showCustomerForm && (
        <CustomerForm
          onSubmit={addCustomer}
          onClose={() => setShowCustomerForm(false)}
        />
      )}

      {showTransactionForm && (
        <TransactionForm
          customers={customers}
          onSubmit={addTransaction}
          onClose={() => setShowTransactionForm(false)}
        />
      )}
    </div>
  );
};

export default Index;
