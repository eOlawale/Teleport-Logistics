import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { MOCK_BUSINESS_DATA } from '../constants';
import { analyzeBusinessEfficiency } from '../services/geminiService';
import { BrainCircuit, TrendingUp, Package, DollarSign } from 'lucide-react';

export const BusinessDashboard: React.FC = () => {
  const [insight, setInsight] = useState<string>('Generating AI insights based on your shipping trends...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate AI loading analysis
    const fetchInsight = async () => {
      // In a real app, we would pass dynamic data here
      const dataStr = JSON.stringify(MOCK_BUSINESS_DATA);
      const result = await analyzeBusinessEfficiency(dataStr);
      setInsight(result);
      setLoading(false);
    };

    fetchInsight();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 text-slate-500 mb-2">
            <DollarSign size={20} />
            <h3 className="text-sm font-semibold uppercase tracking-wider">Weekly Spend</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">$2,450.00</p>
          <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
            <TrendingUp size={14} /> +12% from last week
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 text-slate-500 mb-2">
            <Package size={20} />
            <h3 className="text-sm font-semibold uppercase tracking-wider">Total Deliveries</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">142</p>
          <p className="text-sm text-gray-400 mt-1">98% On-Time Rate</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 text-slate-500 mb-2">
            <BrainCircuit size={20} className="text-blue-600" />
            <h3 className="text-sm font-semibold uppercase tracking-wider text-blue-600">AI Savings</h3>
          </div>
          <p className="text-3xl font-bold text-slate-900">$340.50</p>
          <p className="text-sm text-slate-500 mt-1">Saved via Route Optimization</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-[350px]">
          <h3 className="text-lg font-bold mb-4">Spend vs Savings Trends</h3>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_BUSINESS_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
              <defs>
                <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="date" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <Tooltip />
              <Area type="monotone" dataKey="spend" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSpend)" />
              <Area type="monotone" dataKey="savings" stroke="#10b981" fillOpacity={1} fill="url(#colorSavings)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-[350px]">
           <h3 className="text-lg font-bold mb-4">Delivery Volume</h3>
           <ResponsiveContainer width="100%" height="100%">
             <BarChart data={MOCK_BUSINESS_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
               <XAxis dataKey="date" />
               <YAxis />
               <Tooltip cursor={{fill: '#f8fafc'}} />
               <Legend />
               <Bar dataKey="deliveries" fill="#6366f1" radius={[4, 4, 0, 0]} />
             </BarChart>
           </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insight Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-blue-100 p-6 rounded-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <BrainCircuit size={100} />
        </div>
        <h3 className="text-lg font-bold text-indigo-900 mb-2 flex items-center gap-2">
          <BrainCircuit size={20} />
          Gemini Intelligence Report
        </h3>
        {loading ? (
           <div className="animate-pulse flex space-x-4">
             <div className="flex-1 space-y-4 py-1">
               <div className="h-4 bg-blue-200 rounded w-3/4"></div>
               <div className="space-y-2">
                 <div className="h-4 bg-blue-200 rounded"></div>
                 <div className="h-4 bg-blue-200 rounded w-5/6"></div>
               </div>
             </div>
           </div>
        ) : (
          <div className="prose prose-sm text-indigo-800 max-w-none">
             {/* Render markdown-ish text simply */}
             {insight.split('\n').map((line, i) => (
               <p key={i} className="mb-1">{line}</p>
             ))}
          </div>
        )}
      </div>
    </div>
  );
};
