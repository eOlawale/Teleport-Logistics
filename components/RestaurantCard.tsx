import React from 'react';
import { Restaurant } from '../types';
import { Star, Clock, Bike, Ticket } from 'lucide-react';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: (restaurant: Restaurant) => void;
  currencySymbol?: string;
  deliveryFee: number;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ 
  restaurant, 
  onClick, 
  currencySymbol = '$',
  deliveryFee
}) => {
  return (
    <div 
      onClick={() => onClick(restaurant)}
      className="group flex gap-4 p-3 border border-gray-100 dark:border-slate-800 rounded-xl hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800 transition-all cursor-pointer bg-white dark:bg-slate-900"
    >
      <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden">
        <img 
          src={restaurant.image} 
          alt={restaurant.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {restaurant.promo && (
          <div className="absolute top-0 left-0 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-br-lg shadow-sm">
            {restaurant.promo}
          </div>
        )}
      </div>
      
      <div className="flex-1 flex flex-col justify-between py-0.5">
        <div>
          <div className="flex justify-between items-start">
             <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">{restaurant.name}</h3>
             <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-full">
               <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{restaurant.rating}</span>
               <Star size={10} className="text-yellow-500" fill="currentColor" />
             </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{restaurant.cuisine} • {restaurant.priceLevel}</p>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400 mt-2">
           <div className="flex items-center gap-1">
             <Clock size={12} />
             <span>{restaurant.deliveryTimeRange} min</span>
           </div>
           <div className="flex items-center gap-1">
             <Bike size={12} />
             <span>{currencySymbol}{deliveryFee.toFixed(2)} Fee</span>
           </div>
        </div>
      </div>
    </div>
  );
};