import React, { useState } from 'react';
import { Users, DollarSign, Activity, AlertTriangle, CheckCircle, Car, MapPin, Megaphone, Send, LayoutTemplate, HelpCircle, Mail, RotateCcw, Bold, Italic, Underline, List, Link } from 'lucide-react';
import { SupportTicket, Campaign } from '../types';

const MOCK_TICKETS: SupportTicket[] = [
  { id: '9941', user: 'Alice M.', type: 'complaint', subject: 'Driver arrived late', status: 'open', date: '2 hrs ago' },
  { id: '9940', user: 'Bob K.', type: 'refund', subject: 'Double charge on Ride #103', status: 'pending', date: '5 hrs ago' },
  { id: '9939', user: 'Charlie D.', type: 'claim', subject: 'Package damaged during transit', status: 'open', date: '1 day ago' },
];

const MOCK_CAMPAIGNS: Campaign[] = [
  { id: 'C1', name: 'Weekend Surge Bonus', target: 'drivers', type: 'bonus', status: 'active', reach: 1250 },
  { id: 'C2', name: 'New Rider Discount 20%', target: 'riders', type: 'discount', status: 'active', reach: 5400 },
  { id: 'C3', name: 'Delivery Safety Tips', target: 'all', type: 'communication', status: 'scheduled', reach: 8000 },
];

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'trips' | 'marketing' | 'support'>('overview');

  const handleRefund = (id: string) => {
    alert(`Refund processed for Trip #${id}. Notification sent to user.`);
  };

  const handleDiscount = (id: string) => {
    alert(`15% Discount coupon sent to user for Trip #${id} as apology.`);
  };

  const handleCreateCampaign = () => {
    alert("Campaign Wizard started. (Simulated)");
  };

  return (
    <div className="p-6 max-w-7xl mx-auto animate-in fade-in space-y-8 bg-gray-50 min-h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Platform Administration</h1>
          <p className="text-slate-500">System overview and user management.</p>
        </div>
        <div className="flex gap-2">
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-bold flex items-center gap-1">
                <Activity size={16} /> Systems Operational
            </span>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex gap-1 bg-white p-1 rounded-xl border border-gray-200 w-fit shadow-sm">
        <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'overview' ? 'bg-slate-900 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
          <Activity size={16} /> Overview
        </button>
        <button onClick={() => setActiveTab('trips')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'trips' ? 'bg-slate-900 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
          <Car size={16} /> Trips & Refunds
        </button>
        <button onClick={() => setActiveTab('marketing')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'marketing' ? 'bg-slate-900 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
          <Megaphone size={16} /> Marketing
        </button>
        <button onClick={() => setActiveTab('support')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'support' ? 'bg-slate-900 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
          <HelpCircle size={16} /> Support Tickets
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-in slide-in-from-bottom-5">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
             <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><DollarSign size={24} /></div>
                <span className="text-xs font-bold text-green-600">+12.5%</span>
             </div>
             <h3 className="text-slate-500 text-sm font-medium">Total Revenue</h3>
             <p className="text-2xl font-bold text-slate-900">$124,592</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
             <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-purple-100 rounded-lg text-purple-600"><Users size={24} /></div>
                <span className="text-xs font-bold text-green-600">+5.2%</span>
             </div>
             <h3 className="text-slate-500 text-sm font-medium">Active Users</h3>
             <p className="text-2xl font-bold text-slate-900">8,540</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
             <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-orange-100 rounded-lg text-orange-600"><Car size={24} /></div>
                <span className="text-xs font-bold text-slate-400">Stable</span>
             </div>
             <h3 className="text-slate-500 text-sm font-medium">Online Drivers</h3>
             <p className="text-2xl font-bold text-slate-900">1,245</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
             <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-red-100 rounded-lg text-red-600"><AlertTriangle size={24} /></div>
                <span className="text-xs font-bold text-red-600">3 Pending</span>
             </div>
             <h3 className="text-slate-500 text-sm font-medium">Critical Issues</h3>
             <p className="text-2xl font-bold text-slate-900">3</p>
          </div>
        </div>
      )}

      {activeTab === 'trips' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom-5">
           <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-900">Trip Management & Refunds</h3>
           </div>
           <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                 <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                    <tr>
                       <th className="px-6 py-3">Trip ID</th>
                       <th className="px-6 py-3">User</th>
                       <th className="px-6 py-3">Status</th>
                       <th className="px-6 py-3">Fare</th>
                       <th className="px-6 py-3">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100">
                    <tr className="hover:bg-gray-50 transition-colors">
                       <td className="px-6 py-4 font-mono text-xs">#TR-8832</td>
                       <td className="px-6 py-4">Alice M.</td>
                       <td className="px-6 py-4"><span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Completed</span></td>
                       <td className="px-6 py-4 font-medium">$45.20</td>
                       <td className="px-6 py-4 flex gap-2">
                          <button onClick={() => handleRefund('8832')} className="text-red-600 hover:underline font-medium text-xs flex items-center gap-1"><RotateCcw size={12}/> Refund</button>
                          <button onClick={() => handleDiscount('8832')} className="text-blue-600 hover:underline font-medium text-xs flex items-center gap-1"><DollarSign size={12}/> Issue Credit</button>
                       </td>
                    </tr>
                    <tr className="hover:bg-gray-50 transition-colors">
                       <td className="px-6 py-4 font-mono text-xs">#TR-8830</td>
                       <td className="px-6 py-4">David K.</td>
                       <td className="px-6 py-4"><span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">Disputed</span></td>
                       <td className="px-6 py-4 font-medium">$28.90</td>
                       <td className="px-6 py-4 flex gap-2">
                          <button onClick={() => handleRefund('8830')} className="bg-red-50 text-red-700 px-2 py-1 rounded border border-red-200 font-medium text-xs hover:bg-red-100">Full Refund</button>
                          <button className="text-gray-500 hover:text-gray-800 text-xs">Details</button>
                       </td>
                    </tr>
                 </tbody>
              </table>
           </div>
        </div>
      )}

      {activeTab === 'marketing' && (
        <div className="space-y-6 animate-in slide-in-from-bottom-5">
          <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-gray-200">
             <div>
               <h3 className="text-lg font-bold text-slate-900">Campaigns & Communications</h3>
               <p className="text-sm text-gray-500">Manage promotions for Riders, Drivers, and Clients.</p>
             </div>
             <button onClick={handleCreateCampaign} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-blue-700">
               <PlusIcon /> Create Campaign
             </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50 font-bold text-gray-700">Active Campaigns</div>
                {MOCK_CAMPAIGNS.map(camp => (
                  <div key={camp.id} className="p-4 border-b border-gray-100 last:border-0 flex justify-between items-center">
                    <div>
                      <h4 className="font-bold text-slate-800">{camp.name}</h4>
                      <div className="flex gap-2 text-xs mt-1">
                        <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded capitalize">{camp.target}</span>
                        <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded capitalize">{camp.type}</span>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-bold">{camp.reach.toLocaleString()}</p>
                       <p className="text-xs text-gray-500">Reach</p>
                    </div>
                  </div>
                ))}
             </div>

             <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h4 className="font-bold text-gray-700 mb-4 flex items-center gap-2"><Mail size={18} /> Quick Communication</h4>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500">Target Audience</label>
                    <select className="w-full border border-gray-200 rounded-lg p-2 mt-1 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none">
                      <option>All Users</option>
                      <option>Drivers Only</option>
                      <option>Riders Only</option>
                      <option>Delivery Clients</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500">Message Body</label>
                    <div className="border border-gray-200 rounded-lg mt-1 overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 transition-shadow">
                      <div className="bg-gray-50 border-b border-gray-200 p-2 flex gap-2">
                        <button className="p-1 hover:bg-gray-200 rounded text-gray-600" title="Bold"><Bold size={14}/></button>
                        <button className="p-1 hover:bg-gray-200 rounded text-gray-600" title="Italic"><Italic size={14}/></button>
                        <button className="p-1 hover:bg-gray-200 rounded text-gray-600" title="Underline"><Underline size={14}/></button>
                        <div className="w-px h-4 bg-gray-300 mx-1"></div>
                        <button className="p-1 hover:bg-gray-200 rounded text-gray-600" title="List"><List size={14}/></button>
                        <button className="p-1 hover:bg-gray-200 rounded text-gray-600" title="Insert Link"><Link size={14}/></button>
                      </div>
                      <textarea className="w-full p-3 text-sm h-32 focus:outline-none resize-none" placeholder="Type your announcement here..."></textarea>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">Supports Markdown and HTML formatting.</p>
                  </div>
                  <button className="w-full bg-slate-900 text-white py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors">
                    <Send size={14} /> Send Broadcast
                  </button>
                </div>
             </div>
          </div>
        </div>
      )}

      {activeTab === 'support' && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom-5">
           <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-900">Support Tickets</h3>
              <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold">3 Open</span>
           </div>
           <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                 <tr>
                    <th className="px-6 py-3">Ticket ID</th>
                    <th className="px-6 py-3">User</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Subject</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Date</th>
                    <th className="px-6 py-3">Action</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                 {MOCK_TICKETS.map(ticket => (
                   <tr key={ticket.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono text-xs">#{ticket.id}</td>
                      <td className="px-6 py-4">{ticket.user}</td>
                      <td className="px-6 py-4 capitalize"><span className={`px-2 py-1 rounded text-xs font-bold ${ticket.type === 'refund' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{ticket.type}</span></td>
                      <td className="px-6 py-4">{ticket.subject}</td>
                      <td className="px-6 py-4 capitalize">{ticket.status}</td>
                      <td className="px-6 py-4 text-gray-500">{ticket.date}</td>
                      <td className="px-6 py-4">
                        <button className="text-blue-600 font-medium hover:underline">View</button>
                      </td>
                   </tr>
                 ))}
              </tbody>
           </table>
        </div>
      )}
    </div>
  );
};

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);