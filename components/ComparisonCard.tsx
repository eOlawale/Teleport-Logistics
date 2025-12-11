import React from 'react';
import { Quote, ServiceProvider } from '../types';
import { Car, Package, Leaf, Zap, Train, Bike, Ship, Truck, Star, CalendarClock, Info } from 'lucide-react';

interface ComparisonCardProps {
  quote: Quote;
  onSelect: (quote: Quote) => void;
  selected: boolean;
  onBook: () => void;
  onSchedule?: () => void;
  currencySymbol?: string;
  currencyMultiplier?: number;
}

export const ComparisonCard: React.FC<ComparisonCardProps> = ({ 
  quote, 
  onSelect, 
  selected, 
  onBook,
  onSchedule,
  currencySymbol = '$',
  currencyMultiplier = 1
}) => {
  const isTeleport = quote.provider === ServiceProvider.TELEPORT;
  const displayPrice = (quote.price * currencyMultiplier).toFixed(2);

  const getLogoColor = (provider: ServiceProvider) => {
    switch (provider) {
      case ServiceProvider.UBER: return 'text-black';
      case ServiceProvider.LYFT: return 'text-pink-600';
      case ServiceProvider.TELEPORT: return 'text-blue-600';
      case ServiceProvider.LIME: return 'text-green-600';
      case ServiceProvider.METRO: return 'text-orange-600';
      default: return 'text-gray-700';
    }
  };

  const getIcon = (type: string, category: string) => {
    if (category === 'transit') return <Train size={18} className="text-gray-600" />;
    if (category === 'scooter') return <Zap size={18} className="text-yellow-500" />;
    if (category === 'bicycle') return <Bike size={18} className="text-green-600" />;
    if (category === 'delivery') return <Package size={18} className="text-blue-600" />;
    if (category === 'water') return <Ship size={18} className="text-blue-500" />;
    if (category === 'van') return <Truck size={18} className="text-slate-700" />;
    if (category === 'eco') return <Leaf size={18} className="text-teal-600" />;
    return <Car size={18} className="text-gray-700" />;
  };

  return (
    <div 
      onClick={() => onSelect(quote)}
      className={`
        relative border rounded-xl p-4 cursor-pointer transition-all duration-200 group/card
        ${selected ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'border-gray-200 hover:border-blue-300 hover:shadow-md bg-white'}
        ${isTeleport ? 'border-l-4 border-l-blue-600' : ''}
      `}
    >
      {/* Badges */}
      <div className="absolute -top-2 right-4 flex gap-2 z-10">
        {isTeleport && (
           <div className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
             <Star size={10} fill="currentColor" />
             Preferred
           </div>
        )}
        {quote.surged && (
          <div className="relative group/tooltip">
            <div className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm cursor-help">
              <Zap size={10} />
              High Demand
            </div>
            {/* Surge Tooltip */}
            <div className="absolute top-6 right-0 w-48 bg-slate-900 text-white text-xs p-2 rounded-lg shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 z-50">
              <div className="flex items-start gap-2">
                <Info size={14} className="shrink-0 mt-0.5" />
                <span>Demand is higher than usual in your area. Fares have been adjusted.</span>
              </div>
            </div>
          </div>
        )}
        {quote.category === 'eco' && (
           <div className="bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
             <Leaf size={10} />
             Eco
           </div>
        )}
      </div>
      
      <div className="flex justify-between items-center mb-3 mt-1">
        <div className={`font-bold text-lg ${getLogoColor(quote.provider)}`}>
          {quote.provider}
        </div>
        <div className="text-xl font-bold text-slate-900">
          {currencySymbol}{displayPrice}
        </div>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded-md">
          {getIcon(quote.vehicleType, quote.category)}
          <span className="font-medium text-slate-700">{quote.vehicleType}</span>
        </div>
        <div className="font-medium text-slate-700 bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs">
          {quote.eta} min away
        </div>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex-1 flex flex-col gap-1">
             <div className="flex justify-between text-xs text-gray-400">
               <span className="flex items-center gap-1"><Leaf size={10} /> Eco Score</span>
               <span className="font-bold">{quote.ecoScore}/10</span>
             </div>
             <div className="h-2 bg-gray-100 rounded-full overflow-hidden w-full">
                <div 
                  className={`h-full rounded-full ${quote.ecoScore > 7 ? 'bg-green-500' : quote.ecoScore > 4 ? 'bg-yellow-500' : 'bg-red-400'}`}
                  style={{ width: `${quote.ecoScore * 10}%` }}
                />
            </div>
        </div>
        
        <div className="flex gap-2">
          {onSchedule && (
            <button
              onClick={(e) => { e.stopPropagation(); onSchedule(); }}
              className="px-3 py-2 rounded-lg text-slate-600 bg-gray-100 hover:bg-gray-200 transition-colors shadow-sm active:scale-95"
              title="Book for Later"
            >
              <CalendarClock size={18} />
            </button>
          )}
          <button 
             onClick={(e) => { e.stopPropagation(); onBook(); }}
             className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm active:scale-95 whitespace-nowrap ${isTeleport ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-slate-900 hover:bg-slate-700 text-white'}`}
          >
             Book Now
          </button>
        </div>
      </div>
    </div>
  );
};
