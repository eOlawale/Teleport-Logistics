import React, { useState } from 'react';
import { MapPin, ArrowRight } from 'lucide-react';

interface EatLandingProps {
  onSearch: (address: string) => void;
  onSignIn: () => void;
}

export const EatLanding: React.FC<EatLandingProps> = ({ onSearch, onSignIn }) => {
  const [address, setAddress] = useState('');

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (address.trim()) {
      onSearch(address);
    }
  };

  return (
    <div className="relative h-full flex-1 flex flex-col items-center justify-center bg-slate-900 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format&fit=crop" 
          alt="Food Background" 
          className="w-full h-full object-cover opacity-60 animate-in fade-in duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-700 delay-150">
        <h1 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight drop-shadow-lg leading-tight">
          Find Great Food and Products<br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">In Nearby Spots</span>
        </h1>

        <div className="w-full max-w-xl bg-white p-2 rounded-full shadow-2xl flex items-center transform transition-transform focus-within:scale-105 duration-300">
          <div className="pl-4 text-orange-500">
            <MapPin size={24} fill="currentColor" className="text-orange-100" />
          </div>
          <input 
            type="text" 
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            placeholder="Enter delivery address"
            className="flex-1 bg-transparent border-none focus:ring-0 text-slate-900 placeholder-slate-400 px-4 py-3 text-lg h-full outline-none font-medium rounded-full"
          />
          <button 
            onClick={() => handleSubmit()}
            className="bg-orange-600 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-orange-700 transition-colors shadow-lg flex items-center gap-2"
          >
            GO
          </button>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 text-white/90">
          <p className="font-medium text-lg text-white">Order delivery near you</p>
          <div className="flex gap-6 text-sm font-semibold tracking-wide">
             <button onClick={() => onSearch('Current Location')} className="hover:text-orange-400 transition-colors border-b border-transparent hover:border-orange-400 pb-0.5">Deliver now</button>
             <button onClick={() => onSearch('Current Location')} className="hover:text-orange-400 transition-colors border-b border-transparent hover:border-orange-400 pb-0.5">Find here</button>
          </div>
          
          <div className="mt-4 flex items-center gap-3">
             <span className="h-px w-12 bg-white/20"></span>
             <span className="text-sm uppercase tracking-widest text-white/60 font-bold">Or</span>
             <span className="h-px w-12 bg-white/20"></span>
          </div>

          <button 
            onClick={onSignIn}
            className="text-white hover:text-orange-400 font-bold transition-colors flex items-center gap-2 mt-1"
          >
            Sign In <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};