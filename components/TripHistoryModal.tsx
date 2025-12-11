import React, { useState } from 'react';
import { X, Clock, MapPin, ArrowRight, CheckCircle, XCircle, Star } from 'lucide-react';
import { TripHistoryItem, ServiceProvider } from '../types';

interface TripHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_HISTORY: TripHistoryItem[] = [
  { 
    id: '101', 
    date: 'Oct 24, 2023 • 2:30 PM', 
    provider: ServiceProvider.UBER, 
    type: 'Ride', 
    price: 24.50, 
    status: 'Completed', 
    from: '123 Main St, San Francisco', 
    to: '456 Market St, San Francisco',
    rating: 0
  },
  { 
    id: '102', 
    date: 'Oct 22, 2023 • 10:15 AM', 
    provider: ServiceProvider.TELEPORT, 
    type: 'Delivery', 
    price: 15.00, 
    status: 'Completed', 
    from: 'Warehouse A', 
    to: 'Client B HQ',
    rating: 5
  },
  { 
    id: '103', 
    date: 'Oct 20, 2023 • 6:45 PM', 
    provider: ServiceProvider.LIME, 
    type: 'Scooter', 
    price: 4.20, 
    status: 'Completed', 
    from: 'Golden Gate Park', 
    to: 'Sunset Blvd',
    rating: 4
  },
  { 
    id: '104', 
    date: 'Oct 18, 2023 • 9:00 AM', 
    provider: ServiceProvider.LYFT, 
    type: 'Ride', 
    price: 0.00, 
    status: 'Cancelled', 
    from: 'SFO Airport', 
    to: 'Downtown' 
  },
];

export const TripHistoryModal: React.FC<TripHistoryModalProps> = ({ isOpen, onClose }) => {
  const [history, setHistory] = useState(INITIAL_HISTORY);

  if (!isOpen) return null;

  const handleRate = (id: string, rating: number) => {
    setHistory(prev => prev.map(item => item.id === id ? { ...item, rating } : item));
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
             <h2 className="text-xl font-bold text-slate-900">Trip History</h2>
             <p className="text-sm text-gray-500">Your recent rides and deliveries.</p>
          </div>
          <button onClick={onClose} className="hover:bg-gray-100 p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-4">
          {history.map((trip) => (
            <div key={trip.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow bg-white">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold ${trip.provider === ServiceProvider.TELEPORT ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-700'}`}>
                    {trip.provider === ServiceProvider.UBER ? 'UB' : trip.provider === ServiceProvider.LYFT ? 'LY' : trip.provider === ServiceProvider.TELEPORT ? 'TP' : 'SC'}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{trip.provider} {trip.type}</h3>
                    <p className="text-xs text-gray-500">{trip.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">${trip.price.toFixed(2)}</p>
                  <div className={`text-xs font-medium flex items-center justify-end gap-1 ${trip.status === 'Completed' ? 'text-green-600' : 'text-red-500'}`}>
                    {trip.status === 'Completed' ? <CheckCircle size={12} /> : <XCircle size={12} />}
                    {trip.status}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg mb-3">
                <div className="flex items-center gap-2 truncate flex-1">
                  <MapPin size={14} className="text-gray-400" />
                  <span className="truncate">{trip.from}</span>
                </div>
                <ArrowRight size={14} className="text-gray-300" />
                <div className="flex items-center gap-2 truncate flex-1">
                  <MapPin size={14} className="text-gray-400" />
                  <span className="truncate">{trip.to}</span>
                </div>
              </div>

              {/* Rating Section */}
              {trip.status === 'Completed' && (
                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <span className="text-xs text-gray-500 font-medium">Rate Service:</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star}
                        onClick={() => handleRate(trip.id, star)}
                        className={`transition-colors hover:scale-110 ${trip.rating && trip.rating >= star ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-200'}`}
                      >
                        <Star size={18} fill="currentColor" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-gray-100 bg-gray-50 text-center">
            <button className="text-sm text-blue-600 font-medium hover:underline">
                View All Activity
            </button>
        </div>
      </div>
    </div>
  );
};
