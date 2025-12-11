import React from 'react';
import { Quote, ServiceProvider } from '../types';
import { Car, Package, Leaf, Zap, Train, Bike } from 'lucide-react';

interface ComparisonCardProps {
  quote: Quote;
  onSelect: (quote: Quote) => void;
  selected: boolean;
  onBook: () => void;
}

export const ComparisonCard: React.FC<ComparisonCardProps> = ({ quote, onSelect, selected, onBook }) => {
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
    if (category === 'scooter') return <Bike size={18} className="text-green-600" />;
    if (category === 'delivery') return <Package size={18} className="text-blue-600" />;
    if (category === 'eco') return <Zap size={18} className="text-teal-600" />;
    return <Car size={18} className="text-gray-700" />;
  };

  return (
    <div 
      onClick={() => onSelect(quote)}
      className={`
        relative border rounded-xl p-4 cursor-pointer transition-all duration-200
        ${selected ? 'border-blue-600 bg-blue-50 ring-1 ring-blue-600' : 'border-gray-200 hover:border-blue-300 hover:shadow-md bg-white'}
      `}
    >
      {quote.surged && (
        <div className="absolute -top-2 right-4 bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
          <Zap size={10} />
          High Demand
        </div>
      )}
      
      {quote.category === 'eco' && (
         <div className="absolute -top-2 right-4 bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
           <Leaf size={10} />
           Eco-Friendly
         </div>
      )}
      
      <div className="flex justify-between items-center mb-3 mt-1">
        <div className={`font-bold text-lg ${getLogoColor(quote.provider)}`}>
          {quote.provider}
        </div>
        <div className="text-xl font-bold text-slate-900">
          ${quote.price.toFixed(2)}
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

      <div className="flex items-center justify-between gap-4">
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
        
        <button 
           onClick={(e) => { e.stopPropagation(); onBook(); }}
           className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-700 transition-colors shadow-sm active:scale-95 whitespace-nowrap"
        >
           Book Now
        </button>
      </div>
    </div>
  );
};
