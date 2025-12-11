import React from 'react';
import { Quote, ServiceProvider } from '../types';
import { Car, Package, Leaf, Zap, Train, Bike } from 'lucide-react';

interface ComparisonCardProps {
  quote: Quote;
  onSelect: (quote: Quote) => void;
  selected: boolean;
}

export const ComparisonCard: React.FC<ComparisonCardProps> = ({ quote, onSelect, selected }) => {
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
    if (category === 'transit') return <Train size={16} />;
    if (category === 'scooter') return <Bike size={16} />;
    if (category === 'delivery') return <Package size={16} />;
    return <Car size={16} />;
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
        <div className="absolute -top-3 right-4 bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
          <Zap size={10} />
          High Demand
        </div>
      )}
      
      <div className="flex justify-between items-center mb-2">
        <div className={`font-bold text-lg ${getLogoColor(quote.provider)}`}>
          {quote.provider}
        </div>
        <div className="text-xl font-bold text-slate-900">
          ${quote.price.toFixed(2)}
        </div>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-600">
        <div className="flex items-center gap-2">
          {getIcon(quote.vehicleType, quote.category)}
          <span>{quote.vehicleType}</span>
        </div>
        <div className="font-medium text-slate-700">
          {quote.eta} min away
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full ${quote.ecoScore > 7 ? 'bg-green-500' : quote.ecoScore > 4 ? 'bg-yellow-500' : 'bg-red-400'}`}
            style={{ width: `${quote.ecoScore * 10}%` }}
          />
        </div>
        <div className="text-xs text-gray-400 flex items-center gap-1">
          <Leaf size={10} /> Eco
        </div>
      </div>
    </div>
  );
};
