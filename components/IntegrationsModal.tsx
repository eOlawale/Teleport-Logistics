import React, { useState } from 'react';
import { X, Link2, Check, RefreshCw } from 'lucide-react';

interface IntegrationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IntegrationsModal: React.FC<IntegrationsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const platforms = [
    { id: 'uber', name: 'Uber Business', icon: 'UB', connected: true },
    { id: 'lyft', name: 'Lyft Enterprise', icon: 'LY', connected: false },
    { id: 'sap', name: 'SAP Concur', icon: 'SC', connected: true },
    { id: 'slack', name: 'Slack Notifications', icon: 'SL', connected: false },
  ];

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
             <h2 className="text-xl font-bold text-slate-900">Platform Integrations</h2>
             <p className="text-sm text-gray-500">Connect your accounts for seamless syncing.</p>
          </div>
          <button onClick={onClose} className="hover:bg-gray-100 p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {platforms.map((platform) => (
            <div key={platform.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold ${platform.connected ? 'bg-slate-900 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {platform.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{platform.name}</h3>
                  <p className="text-xs text-gray-500">{platform.connected ? 'Last synced: 2 mins ago' : 'Not connected'}</p>
                </div>
              </div>
              <button 
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  platform.connected 
                    ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100' 
                    : 'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {platform.connected ? (
                  <span className="flex items-center gap-1"><Check size={14} /> Connected</span>
                ) : (
                  <span className="flex items-center gap-1"><Link2 size={14} /> Connect</span>
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="p-4 bg-gray-50 text-center">
          <button className="text-blue-600 text-sm font-medium hover:underline flex items-center justify-center gap-2">
            <RefreshCw size={14} /> Check for new integrations
          </button>
        </div>
      </div>
    </div>
  );
};
