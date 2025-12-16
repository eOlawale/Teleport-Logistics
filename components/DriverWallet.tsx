import React from 'react';
import { Wallet, ArrowUpRight, ArrowDownLeft, DollarSign, Calendar, TrendingUp, Utensils, Car } from 'lucide-react';
import { WalletTransaction } from '../types';

const MOCK_TRANSACTIONS: WalletTransaction[] = [
  { id: '1', date: 'Today, 2:30 PM', amount: 45.50, type: 'earning', status: 'completed', source: 'ride' },
  { id: '2', date: 'Today, 1:15 PM', amount: 12.50, type: 'earning', status: 'completed', source: 'eats' },
  { id: '3', date: 'Today, 11:15 AM', amount: 22.00, type: 'earning', status: 'completed', source: 'ride' },
  { id: '4', date: 'Yesterday', amount: -150.00, type: 'withdrawal', status: 'completed' },
  { id: '5', date: 'Oct 23', amount: 8.00, type: 'tip', status: 'completed', source: 'eats' },
  { id: '6', date: 'Oct 23', amount: 50.00, type: 'bonus', status: 'completed' },
];

export const DriverWallet: React.FC = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto animate-in fade-in space-y-6">
       <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Driver Wallet</h1>
            <p className="text-slate-500 dark:text-slate-400">Manage your earnings for Rides & Eats.</p>
          </div>
          <button className="bg-slate-900 dark:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg">
             <ArrowUpRight size={18} /> Cash Out
          </button>
       </div>

       {/* Balance Cards */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-600 dark:bg-blue-700 text-white p-6 rounded-2xl shadow-lg relative overflow-hidden">
             <div className="relative z-10">
                <p className="text-blue-100 font-medium mb-1">Available Balance</p>
                <h2 className="text-4xl font-bold">$288.00</h2>
                <div className="mt-4 flex items-center gap-2 text-sm bg-blue-500/30 w-fit px-2 py-1 rounded-lg">
                   <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                   Ready to withdraw
                </div>
             </div>
             <Wallet className="absolute -bottom-4 -right-4 text-blue-500 opacity-50" size={100} />
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm">
             <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 mb-2">
                <Calendar size={20} />
                <span className="font-medium">This Week</span>
             </div>
             <p className="text-3xl font-bold text-slate-900 dark:text-white">$882.50</p>
             <p className="text-green-600 dark:text-green-400 text-sm mt-1 flex items-center gap-1">
                <TrendingUp size={14} /> +18% vs last week
             </p>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm">
             <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 mb-2">
                <Utensils size={20} />
                <span className="font-medium">Eats Earnings</span>
             </div>
             <p className="text-3xl font-bold text-slate-900 dark:text-white">$320.00</p>
             <p className="text-gray-400 text-sm mt-1">36% of total</p>
          </div>
       </div>

       {/* Transactions List */}
       <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-slate-700">
             <h3 className="font-bold text-lg text-slate-900 dark:text-white">Recent Activity</h3>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-slate-700">
             {MOCK_TRANSACTIONS.map((tx) => (
                <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                   <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          tx.type === 'withdrawal' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : 
                          tx.source === 'eats' ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' :
                          'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                        }`}>
                         {tx.type === 'withdrawal' ? <ArrowUpRight size={20} /> : tx.source === 'eats' ? <Utensils size={18} /> : <Car size={18} />}
                      </div>
                      <div>
                         <p className="font-semibold text-slate-900 dark:text-white capitalize">
                           {tx.type === 'bonus' ? 'Weekly Bonus' : tx.type === 'tip' ? 'Customer Tip' : tx.source === 'eats' ? 'Eats Delivery' : 'Ride Payment'}
                         </p>
                         <p className="text-xs text-gray-500 dark:text-gray-400">{tx.date}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className={`font-bold ${tx.type === 'withdrawal' ? 'text-slate-900 dark:text-white' : 'text-green-600 dark:text-green-400'}`}>
                         {tx.type === 'withdrawal' ? '-' : '+'}${tx.amount.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-400 capitalize">{tx.status}</p>
                   </div>
                </div>
             ))}
          </div>
          <div className="p-4 text-center border-t border-gray-100 dark:border-slate-700">
             <button className="text-blue-600 dark:text-blue-400 font-medium hover:underline text-sm">View All Transactions</button>
          </div>
       </div>
    </div>
  );
};