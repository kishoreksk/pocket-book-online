
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Users, TrendingUp, TrendingDown, IndianRupee, Eye, Edit, Trash2, Truck, Package, AlertTriangle, Download, FileText } from 'lucide-react';
import CustomerForm from '@/components/CustomerForm';
import TransactionForm from '@/components/TransactionForm';
import DashboardStats from '@/components/DashboardStats';
import TransactionChart from '@/components/TransactionChart';
import SupplierForm from '@/components/SupplierForm';
import InventoryForm from '@/components/InventoryForm';
import CustomerTransactionHistory from '@/components/CustomerTransactionHistory';
import jsPDF from 'jspdf';

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

interface Supplier {
  id: string;
  name: string;
  phone: string;
  address: string;
  email: string;
}

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  supplierId: string;
  supplierName: string;
  minStockLevel: number;
  totalValue: number;
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

  const [suppliers, setSuppliers] = useState<Supplier[]>([
    {
      id: '1',
      name: 'Steel Wire Industries',
      phone: '+91 99887 66554',
      address: 'Industrial Area, Mumbai',
      email: 'contact@steelwire.com'
    },
    {
      id: '2',
      name: 'Stone Craft Suppliers',
      phone: '+91 88776 65543',
      address: 'Quarry Road, Rajasthan',
      email: 'sales@stonecraft.com'
    }
  ]);

  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: '1',
      name: 'Galvanized Fence Wire',
      category: 'Fence Wires',
      quantity: 150,
      unit: 'meters',
      pricePerUnit: 25.50,
      supplierId: '1',
      supplierName: 'Steel Wire Industries',
      minStockLevel: 50,
      totalValue: 3825
    },
    {
      id: '2',
      name: 'Concrete Stone Pillars',
      category: 'Stone Pillars',
      quantity: 25,
      unit: 'pieces',
      pricePerUnit: 450,
      supplierId: '2',
      supplierName: 'Stone Craft Suppliers',
      minStockLevel: 10,
      totalValue: 11250
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showSupplierForm, setShowSupplierForm] = useState(false);
  const [showInventoryForm, setShowInventoryForm] = useState(false);
  const [showCustomerHistory, setShowCustomerHistory] = useState(false);
  const [selectedCustomerForHistory, setSelectedCustomerForHistory] = useState<Customer | null>(null);
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

  const totalInventoryValue = inventory.reduce((sum, item) => sum + item.totalValue, 0);
  const lowStockItems = inventory.filter(item => item.quantity <= item.minStockLevel);

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

  const addSupplier = (supplierData: Omit<Supplier, 'id'>) => {
    const newSupplier: Supplier = {
      ...supplierData,
      id: Date.now().toString()
    };
    setSuppliers([...suppliers, newSupplier]);
    setShowSupplierForm(false);
  };

  const addInventoryItem = (itemData: Omit<InventoryItem, 'id' | 'supplierName' | 'totalValue'>) => {
    const supplier = suppliers.find(s => s.id === itemData.supplierId);
    if (!supplier) return;

    const newItem: InventoryItem = {
      ...itemData,
      id: Date.now().toString(),
      supplierName: supplier.name,
      totalValue: itemData.quantity * itemData.pricePerUnit
    };

    setInventory([...inventory, newItem]);
    setShowInventoryForm(false);
  };

  const handleCustomerClick = (customer: Customer) => {
    setSelectedCustomerForHistory(customer);
    setShowCustomerHistory(true);
  };

  const generatePDFReport = (reportType: 'weekly' | 'monthly' | 'annual') => {
    const doc = new jsPDF();
    const currentDate = new Date();
    
    // Header
    doc.setFontSize(20);
    doc.text('BNP Fencing Works', 20, 20);
    doc.setFontSize(16);
    doc.text(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report`, 20, 35);
    doc.setFontSize(12);
    doc.text(`Generated on: ${currentDate.toLocaleDateString()}`, 20, 45);
    
    let yPosition = 60;
    
    // Financial Summary
    doc.setFontSize(14);
    doc.text('Financial Summary', 20, yPosition);
    yPosition += 15;
    
    doc.setFontSize(10);
    doc.text(`Total Credit (To Give): ₹${totalCredit.toLocaleString()}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Total Debit (To Get): ₹${totalDebit.toLocaleString()}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Net Balance: ₹${Math.abs(netBalance).toLocaleString()} ${netBalance >= 0 ? '(In your favor)' : '(Outstanding)'}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Total Inventory Value: ₹${totalInventoryValue.toLocaleString()}`, 20, yPosition);
    yPosition += 20;
    
    // Customer Summary
    doc.setFontSize(14);
    doc.text('Customer Summary', 20, yPosition);
    yPosition += 15;
    
    doc.setFontSize(10);
    doc.text(`Total Customers: ${customers.length}`, 20, yPosition);
    yPosition += 15;
    
    // Top customers by balance
    const topCustomers = customers
      .sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance))
      .slice(0, 5);
    
    doc.text('Top 5 Customers by Balance:', 20, yPosition);
    yPosition += 10;
    
    topCustomers.forEach((customer, index) => {
      doc.text(`${index + 1}. ${customer.name}: ₹${Math.abs(customer.balance).toLocaleString()} ${customer.balance >= 0 ? '(To Give)' : '(To Get)'}`, 25, yPosition);
      yPosition += 8;
    });
    
    yPosition += 10;
    
    // Recent Transactions
    doc.setFontSize(14);
    doc.text('Recent Transactions', 20, yPosition);
    yPosition += 15;
    
    const recentTransactions = transactions
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);
    
    doc.setFontSize(10);
    recentTransactions.forEach((transaction) => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`${transaction.date} - ${transaction.customerName}: ${transaction.type === 'credit' ? '+' : '-'}₹${transaction.amount.toLocaleString()} (${transaction.description})`, 20, yPosition);
      yPosition += 8;
    });
    
    // Inventory Summary (if there's space or on new page)
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 20;
    }
    
    yPosition += 10;
    doc.setFontSize(14);
    doc.text('Inventory Summary', 20, yPosition);
    yPosition += 15;
    
    doc.setFontSize(10);
    doc.text(`Total Items: ${inventory.length}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Low Stock Items: ${lowStockItems.length}`, 20, yPosition);
    yPosition += 15;
    
    if (lowStockItems.length > 0) {
      doc.text('Low Stock Items:', 20, yPosition);
      yPosition += 10;
      lowStockItems.forEach((item) => {
        doc.text(`• ${item.name}: ${item.quantity} ${item.unit} (Min: ${item.minStockLevel})`, 25, yPosition);
        yPosition += 8;
      });
    }
    
    // Save the PDF
    const fileName = `BNP_Fencing_${reportType}_report_${currentDate.toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header - Mobile Optimized */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-1.5 sm:p-2 rounded-xl shadow-lg">
                <IndianRupee className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-900">BNP Fencing Works</h1>
                <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Digital Ledger & Inventory</p>
              </div>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-3">
              <Button
                onClick={() => setShowCustomerForm(true)}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2 shadow-lg hover:shadow-xl transition-all duration-200"
                size="sm"
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Add Customer</span>
                <span className="sm:hidden">Add</span>
              </Button>
              <Button
                onClick={() => setShowTransactionForm(true)}
                variant="outline"
                className="text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2 border-green-200 hover:bg-green-50 hover:border-green-300 transition-all duration-200"
                size="sm"
              >
                <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Add Transaction</span>
                <span className="sm:hidden">Trans</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-6 sm:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 sm:space-y-8">
          <TabsList className="grid w-full grid-cols-5 h-10 sm:h-12 text-xs sm:text-sm lg:w-[500px] bg-white/70 backdrop-blur-sm shadow-lg rounded-xl">
            <TabsTrigger value="dashboard" className="px-1 sm:px-3 rounded-lg">Dashboard</TabsTrigger>
            <TabsTrigger value="customers" className="px-1 sm:px-3 rounded-lg">Customers</TabsTrigger>
            <TabsTrigger value="transactions" className="px-1 sm:px-3 rounded-lg">Trans</TabsTrigger>
            <TabsTrigger value="suppliers" className="px-1 sm:px-3 rounded-lg">Suppliers</TabsTrigger>
            <TabsTrigger value="reports" className="px-1 sm:px-3 rounded-lg">Reports</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6 sm:space-y-8">
            <DashboardStats 
              totalCredit={totalCredit}
              totalDebit={totalDebit}
              netBalance={netBalance}
              totalCustomers={customers.length}
            />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <TransactionChart transactions={transactions} />
              
              <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0 hover:shadow-2xl transition-all duration-300">
                <CardHeader className="pb-4 sm:pb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                  <CardTitle className="flex items-center space-x-3 text-lg sm:text-xl text-gray-800">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <span>Recent Customers</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4 sm:space-y-5">
                    {customers.slice(0, 5).map((customer) => (
                      <div key={customer.id} className="flex items-center justify-between p-4 sm:p-5 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 border border-gray-100 hover:border-blue-200 hover:shadow-md">
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-sm sm:text-base truncate text-gray-800">{customer.name}</p>
                          <p className="text-xs sm:text-sm text-gray-500 truncate mt-1">{customer.phone}</p>
                        </div>
                        <Badge 
                          variant={customer.balance >= 0 ? "default" : "destructive"}
                          className="font-semibold text-xs sm:text-sm ml-3 flex-shrink-0 px-3 py-1.5 rounded-full shadow-sm"
                        >
                          ₹{Math.abs(customer.balance).toLocaleString()}
                          <span className="hidden sm:inline ml-1">
                            {customer.balance >= 0 ? 'To Give' : 'To Get'}
                          </span>
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Customers Tab */}
          <TabsContent value="customers" className="space-y-6 sm:space-y-8">
            <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
              <CardHeader className="pb-4 sm:pb-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
                <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                  <CardTitle className="text-lg sm:text-xl flex items-center space-x-3 text-gray-800">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Users className="h-5 w-5 text-green-600" />
                    </div>
                    <span>Customer Management</span>
                  </CardTitle>
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search customers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 text-sm bg-white/80 border-gray-200 focus:border-green-300 focus:ring-green-200 rounded-lg"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filteredCustomers.map((customer) => (
                    <Card 
                      key={customer.id} 
                      className="hover:shadow-xl transition-all duration-300 cursor-pointer bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:scale-105"
                      onClick={() => handleCustomerClick(customer)}
                    >
                      <CardContent className="p-5 sm:p-6">
                        <div className="flex items-start justify-between mb-3 sm:mb-4">
                          <h3 className="font-semibold text-sm sm:text-lg pr-2 truncate flex-1 text-gray-800">{customer.name}</h3>
                          <div className="flex space-x-1 flex-shrink-0">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-blue-100 rounded-full"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCustomerClick(customer);
                              }}
                            >
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 w-7 sm:h-8 sm:w-8 p-0 hover:bg-green-100 rounded-full"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-red-500 hover:text-red-700 hover:bg-red-100 h-7 w-7 sm:h-8 sm:w-8 p-0 rounded-full"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 truncate">{customer.phone}</p>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs sm:text-sm text-gray-500 font-medium">Balance:</span>
                          <Badge 
                            variant={customer.balance >= 0 ? "default" : "destructive"}
                            className="font-semibold text-xs px-3 py-1.5 rounded-full shadow-sm"
                          >
                            {customer.balance >= 0 ? (
                              <TrendingUp className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                            ) : (
                              <TrendingDown className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                            )}
                            ₹{Math.abs(customer.balance).toLocaleString()}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs text-gray-400">
                            Last transaction: {customer.lastTransaction}
                          </p>
                          <p className="text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full text-center">
                            Tap to view history
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6 sm:space-y-8">
            <Card className="bg-white/90 backdrop-blur-sm shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
                <CardTitle className="text-lg sm:text-xl flex items-center space-x-3 text-gray-800">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                  <span>Transaction History</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4 sm:space-y-5">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 sm:p-5 border-0 rounded-xl hover:shadow-md transition-all duration-200 bg-gradient-to-r from-gray-50 to-purple-50/30 hover:from-purple-50 hover:to-pink-50 border border-gray-100 hover:border-purple-200">
                      <div className="flex items-center space-x-4 sm:space-x-5 min-w-0 flex-1">
                        <div className={`p-2.5 sm:p-3 rounded-full flex-shrink-0 shadow-sm ${transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'}`}>
                          {transaction.type === 'credit' ? (
                            <TrendingUp className={`h-4 w-4 sm:h-5 sm:w-5 text-green-600`} />
                          ) : (
                            <TrendingDown className={`h-4 w-4 sm:h-5 sm:w-5 text-red-600`} />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-sm sm:text-base truncate text-gray-800">{transaction.customerName}</p>
                          <p className="text-xs sm:text-sm text-gray-600 truncate mt-1">{transaction.description}</p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0 ml-3">
                        <p className={`font-bold text-sm sm:text-base ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">{transaction.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Suppliers Tab */}
          <TabsContent value="suppliers" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <h2 className="text-xl sm:text-2xl font-bold">Supplier & Inventory</h2>
              <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
                <Button
                  onClick={() => setShowSupplierForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Supplier
                </Button>
                <Button
                  onClick={() => setShowInventoryForm(true)}
                  variant="outline"
                  className="text-sm"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Add Inventory
                </Button>
              </div>
            </div>

            {/* Inventory Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Inventory Value</CardTitle>
                  <Package className="h-4 w-4 opacity-90" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">₹{totalInventoryValue.toLocaleString()}</div>
                  <p className="text-xs opacity-90 mt-1">All items combined</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Low Stock</CardTitle>
                  <AlertTriangle className="h-4 w-4 opacity-90" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">{lowStockItems.length}</div>
                  <p className="text-xs opacity-90 mt-1">Need restocking</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-teal-500 to-teal-600 text-white sm:col-span-2 lg:col-span-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium opacity-90">Suppliers</CardTitle>
                  <Truck className="h-4 w-4 opacity-90" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">{suppliers.length}</div>
                  <p className="text-xs opacity-90 mt-1">Active suppliers</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
              {/* Suppliers List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                    <Truck className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Suppliers</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    {suppliers.map((supplier) => (
                      <div key={supplier.id} className="p-3 sm:p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-sm sm:text-base truncate flex-1 pr-2">{supplier.name}</h3>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm" className="h-6 w-6 sm:h-8 sm:w-8 p-0">
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 h-6 w-6 sm:h-8 sm:w-8 p-0">
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">{supplier.phone}</p>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">{supplier.email}</p>
                        <p className="text-xs sm:text-sm text-gray-500 truncate">{supplier.address}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Inventory List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                    <Package className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Inventory Items</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    {inventory.map((item) => (
                      <div key={item.id} className={`p-3 sm:p-4 border rounded-lg hover:bg-gray-50 ${item.quantity <= item.minStockLevel ? 'border-orange-200 bg-orange-50' : ''}`}>
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-sm sm:text-base truncate flex-1 pr-2">{item.name}</h3>
                          {item.quantity <= item.minStockLevel && (
                            <Badge variant="destructive" className="text-xs flex-shrink-0">
                              <AlertTriangle className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                              Low Stock
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600 mb-2">
                          <p className="truncate">Category: {item.category}</p>
                          <p className="truncate">Supplier: {item.supplierName}</p>
                          <p>Stock: {item.quantity} {item.unit}</p>
                          <p>Price: ₹{item.pricePerUnit}/{item.unit}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm font-medium">Value: ₹{item.totalValue.toLocaleString()}</span>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="sm" className="h-6 w-6 sm:h-8 sm:w-8 p-0">
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 h-6 w-6 sm:h-8 sm:w-8 p-0">
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <h2 className="text-xl sm:text-2xl font-bold">Reports & Analytics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                <Button
                  onClick={() => generatePDFReport('weekly')}
                  className="bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm"
                  size="sm"
                >
                  <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Weekly PDF
                </Button>
                <Button
                  onClick={() => generatePDFReport('monthly')}
                  className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm"
                  size="sm"
                >
                  <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Monthly PDF
                </Button>
                <Button
                  onClick={() => generatePDFReport('annual')}
                  className="bg-purple-600 hover:bg-purple-700 text-xs sm:text-sm"
                  size="sm"
                >
                  <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Annual PDF
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Top Customers (By Balance)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 sm:space-y-3">
                    {customers
                      .sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance))
                      .slice(0, 5)
                      .map((customer, index) => (
                        <div key={customer.id} className="flex items-center justify-between py-2">
                          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                            <span className="text-xs sm:text-sm font-medium text-gray-500 flex-shrink-0">#{index + 1}</span>
                            <span className="font-medium text-sm sm:text-base truncate">{customer.name}</span>
                          </div>
                          <Badge variant={customer.balance >= 0 ? "default" : "destructive"} className="text-xs flex-shrink-0 ml-2">
                            ₹{Math.abs(customer.balance).toLocaleString()}
                          </Badge>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Monthly Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex justify-between items-center p-2 sm:p-3 bg-green-50 rounded-lg">
                      <span className="text-green-700 font-medium text-sm sm:text-base">Total Credit</span>
                      <span className="text-green-700 font-bold text-sm sm:text-base">₹{totalCredit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 sm:p-3 bg-red-50 rounded-lg">
                      <span className="text-red-700 font-medium text-sm sm:text-base">Total Debit</span>
                      <span className="text-red-700 font-bold text-sm sm:text-base">₹{totalDebit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 sm:p-3 bg-blue-50 rounded-lg">
                      <span className="text-blue-700 font-medium text-sm sm:text-base">Net Balance</span>
                      <span className={`font-bold text-sm sm:text-base ${netBalance >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                        ₹{Math.abs(netBalance).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 sm:p-3 bg-purple-50 rounded-lg">
                      <span className="text-purple-700 font-medium text-sm sm:text-base">Inventory Value</span>
                      <span className="text-purple-700 font-bold text-sm sm:text-base">₹{totalInventoryValue.toLocaleString()}</span>
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

      {showSupplierForm && (
        <SupplierForm
          onSubmit={addSupplier}
          onClose={() => setShowSupplierForm(false)}
        />
      )}

      {showInventoryForm && (
        <InventoryForm
          suppliers={suppliers}
          onSubmit={addInventoryItem}
          onClose={() => setShowInventoryForm(false)}
        />
      )}

      {showCustomerHistory && selectedCustomerForHistory && (
        <CustomerTransactionHistory
          customer={selectedCustomerForHistory}
          transactions={transactions}
          onClose={() => {
            setShowCustomerHistory(false);
            setSelectedCustomerForHistory(null);
          }}
        />
      )}
    </div>
  );
};

export default Index;
