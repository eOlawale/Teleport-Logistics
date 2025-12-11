import React, { useState, useMemo, useEffect } from 'react';
import { 
  Menu, X, MapPin, Truck, Car, Briefcase, 
  User as UserIcon, ChevronRight, Search, 
  AlertCircle, Filter, Clock, Leaf, DollarSign,
  MessageSquare, Zap, LogOut, Settings, History,
  Bike, Train, Package, Globe, Plus, Trash2, Calendar, Users, Map as MapIcon
} from 'lucide-react';
import { MOCK_QUOTES } from './constants';
import { Quote, ServiceType, Location, SortOption, VehicleFilter, User, ServiceProvider } from './types';
import { ComparisonCard } from './components/ComparisonCard';
import { BusinessDashboard } from './components/BusinessDashboard';
import { ChatAssistant } from './components/ChatAssistant';
import { LeafletMap } from './components/LeafletMap';
import { AuthModal } from './components/AuthModal';
import { PaymentModal } from './components/PaymentModal';
import { DriverChat } from './components/DriverChat';
import { IntegrationsModal } from './components/IntegrationsModal';
import { TripHistoryModal } from './components/TripHistoryModal';
import { DriverWallet } from './components/DriverWallet';
import { ScheduleModal } from './components/ScheduleModal';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ServiceType>(ServiceType.RIDE);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Driver State
  const [driverTab, setDriverTab] = useState<'jobs' | 'wallet'>('jobs');

  // Location State
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [stops, setStops] = useState<{id: string, value: string, coords: Location | null}[]>([]);
  const [pickupCoords, setPickupCoords] = useState<Location | null>(null);
  const [dropoffCoords, setDropoffCoords] = useState<Location | null>(null);
  
  // Search & Result State
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trafficSurge, setTrafficSurge] = useState(1.0);

  // Filtering & Sorting
  const [sortBy, setSortBy] = useState<SortOption>('price');
  const [vehicleFilter, setVehicleFilter] = useState<VehicleFilter>('all');
  const [isSharedRide, setIsSharedRide] = useState(false);
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP' | 'NGN'>('USD');

  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Payment, Schedule & Active Trip State
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [scheduledTime, setScheduledTime] = useState<{date: string, time: string} | null>(null);
  const [activeTrip, setActiveTrip] = useState<{ quote: Quote, status: string } | null>(null);
  const [driverLocation, setDriverLocation] = useState<Location | null>(null);

  // Chat & Integration & History State
  const [isDriverChatOpen, setIsDriverChatOpen] = useState(false);
  const [isIntegrationsOpen, setIsIntegrationsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Currency Multipliers (Mock)
  const currencyData = {
    USD: { symbol: '$', rate: 1 },
    EUR: { symbol: '€', rate: 0.92 },
    GBP: { symbol: '£', rate: 0.79 },
    NGN: { symbol: '₦', rate: 1500 }
  };

  // Simulate Driver Movement
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (activeTrip && pickupCoords) {
      // Start driver slightly away (approx 1km)
      const startLat = pickupCoords.lat! - 0.008;
      const startLng = pickupCoords.lng! - 0.008;
      
      let progress = 0;
      interval = setInterval(() => {
        progress += 0.02; // Move 2% closer every second
        if (progress > 1) progress = 1; // Stop at pickup (or could loop)
        
        const curLat = startLat + (pickupCoords.lat! - startLat) * progress;
        const curLng = startLng + (pickupCoords.lng! - startLng) * progress;
        
        setDriverLocation({ 
          lat: curLat, 
          lng: curLng, 
          address: 'Driver Location' 
        });
      }, 1000);
    } else {
      setDriverLocation(null);
    }
    return () => clearInterval(interval);
  }, [activeTrip, pickupCoords]);

  const handleLocationSelect = (type: 'pickup' | 'dropoff', location: Location) => {
    if (type === 'pickup') {
      setPickupCoords(location);
      setPickup(location.address);
      if (dropoffCoords && pickupCoords) {
        setDropoff('');
        setDropoffCoords(null);
        setShowResults(false);
        setActiveTrip(null);
      }
    } else {
      setDropoffCoords(location);
      setDropoff(location.address);
    }
    setError(null);
  };

  const handleAddStop = () => {
    if (stops.length < 3) {
      setStops([...stops, { id: Date.now().toString(), value: '', coords: null }]);
    }
  };

  const handleRemoveStop = (id: string) => {
    setStops(stops.filter(s => s.id !== id));
  };

  const handleStopChange = (id: string, value: string) => {
    setStops(stops.map(s => s.id === id ? { ...s, value } : s));
    // Simulate simple coord finding for stops if needed, or just clear coords on type
    if (value === '') {
       setStops(stops.map(s => s.id === id ? { ...s, value, coords: null } : s));
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (pickup.length < 3) return setError('Please enter a valid pickup location.');
    if (dropoff.length < 3) return setError('Please enter a valid dropoff location.');

    setIsSearching(true);
    setShowResults(false);
    setActiveTrip(null);
    setScheduledTime(null); // Reset schedule on new search

    setTimeout(() => {
      setIsSearching(false);
      setShowResults(true);
      setTrafficSurge(1 + Math.random() * 0.3);
    }, 1500);
  };

  const handleBook = () => {
    if (!user) {
      setIsAuthOpen(true);
    } else {
      setIsPaymentOpen(true);
    }
  };

  const handleQuickBook = (quote: Quote) => {
    setSelectedQuote(quote);
    if (!user) {
      setIsAuthOpen(true);
    } else {
      setIsPaymentOpen(true);
    }
  };

  const handleScheduleClick = (quote: Quote) => {
    setSelectedQuote(quote);
    if (!user) {
       setIsAuthOpen(true);
    } else {
       setIsScheduleOpen(true);
    }
  };

  const handleScheduleConfirm = (date: string, time: string) => {
    setScheduledTime({ date, time });
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = () => {
    setIsPaymentOpen(false);
    if (selectedQuote) {
      if (scheduledTime) {
         // It's a scheduled trip
         alert(`Trip Scheduled successfully for ${scheduledTime.date} at ${scheduledTime.time}!`);
         setScheduledTime(null);
         setActiveTrip(null); 
         setShowResults(false);
      } else {
         // It's an immediate trip
         setActiveTrip({ quote: selectedQuote, status: 'Driver en route' });
         setTimeout(() => setIsDriverChatOpen(true), 3000);
      }
    }
  };

  const processedQuotes = useMemo(() => {
    let quotes = [...MOCK_QUOTES];
    
    // Filter by Vehicle Type
    if (vehicleFilter !== 'all') {
      quotes = quotes.filter(q => q.category === vehicleFilter);
    }

    // Filter by Sharing
    if (isSharedRide) {
      quotes = quotes.filter(q => q.canShare);
    }
    
    // Apply Modifications (Surge, Stops, Share discount)
    const stopMultiplier = 1 + (stops.length * 0.15);
    const shareDiscount = isSharedRide ? 0.8 : 1;

    quotes = quotes.map(q => ({
      ...q,
      eta: Math.round(q.eta * trafficSurge * (isSharedRide ? 1.2 : 1)), // Shared rides take longer
      price: q.price * stopMultiplier * shareDiscount,
      vehicleType: isSharedRide ? `${q.vehicleType} (Shared)` : q.vehicleType
    }));

    // Sort: Custom logic to prioritize Teleport, then apply user sort
    quotes.sort((a, b) => {
      // 1. Prioritize Teleport Fleet
      const aIsTeleport = a.provider === ServiceProvider.TELEPORT;
      const bIsTeleport = b.provider === ServiceProvider.TELEPORT;
      
      if (aIsTeleport && !bIsTeleport) return -1;
      if (!aIsTeleport && bIsTeleport) return 1;

      // 2. Apply secondary sort
      switch (sortBy) {
        case 'price': return a.price - b.price;
        case 'eta': return a.eta - b.eta;
        case 'eco': return b.ecoScore - a.ecoScore;
        default: return 0;
      }
    });
    return quotes;
  }, [sortBy, vehicleFilter, trafficSurge, stops.length, isSharedRide]);

  const renderContent = () => {
    // Driver View
    if (user?.role === 'driver') {
      if (driverTab === 'wallet') {
        return (
          <div className="flex-1 bg-gray-50 h-[calc(100vh-64px)] overflow-auto animate-in fade-in">
            <DriverWallet />
          </div>
        );
      }
      
      // Driver Jobs View
      return (
        <div className="flex-1 h-[calc(100vh-64px)] relative animate-in fade-in bg-gray-100">
           <LeafletMap 
             onLocationSelect={() => {}} 
             pickupLocation={null}
             dropoffLocation={null}
             stops={[]}
             driverLocation={{ lat: 37.7749, lng: -122.4194, address: 'Current Location' }} 
          />
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 z-[400]">
             <div className="bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                   <div>
                      <h3 className="font-bold text-slate-900">You are Online</h3>
                      <p className="text-xs text-slate-500">Finding nearby trips...</p>
                   </div>
                </div>
                <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors">
                   Go Offline
                </button>
             </div>
          </div>
        </div>
      );
    }

    // Business View
    if (activeTab === ServiceType.BUSINESS_FREIGHT) {
      return (
        <div className="p-6 max-w-6xl mx-auto animate-in fade-in duration-500">
           {/* Business Dashboard Content */}
           <div className="mb-8 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Business Command Center</h1>
              <p className="text-slate-500 mt-2">Manage fleet, analyze spend, and optimize routes.</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsIntegrationsOpen(true)}
                className="bg-white border border-gray-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <Settings size={16} /> Integrations
              </button>
              <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
                Export Report
              </button>
            </div>
          </div>
          <BusinessDashboard />
        </div>
      );
    }

    // Rider/Delivery View
    return (
      <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden animate-in fade-in duration-300 relative">
        
        {/* Map Layer */}
        <div className={`
             bg-gray-100 relative transition-all duration-500 ease-in-out
             ${activeTrip 
                ? 'absolute inset-0 z-0 lg:static lg:flex-1 lg:order-2' 
                : 'hidden lg:block flex-1 order-2'} 
        `}>
          <LeafletMap 
             onLocationSelect={handleLocationSelect}
             pickupLocation={pickupCoords}
             dropoffLocation={dropoffCoords}
             stops={stops.filter(s => s.coords).map(s => s.coords!)}
             driverLocation={driverLocation}
          />
          
          {showResults && !activeTrip && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-lg flex items-center gap-4 text-sm font-medium animate-in zoom-in-95 z-[400] border border-gray-100">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${trafficSurge > 1.2 ? 'bg-red-500' : trafficSurge > 1.1 ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                Traffic: {trafficSurge > 1.2 ? 'Heavy' : trafficSurge > 1.1 ? 'Moderate' : 'Light'}
              </div>
              <div className="w-[1px] h-4 bg-gray-200"></div>
              <div>Est. Travel: {Math.round(14 * trafficSurge * (1 + stops.length * 0.2))} min</div>
            </div>
          )}
        </div>

        {/* Sidebar / Overlay Layer */}
        <div className={`
            flex flex-col transition-all duration-500 ease-in-out shadow-xl lg:shadow-none z-10
            ${activeTrip 
                ? 'absolute bottom-0 left-0 right-0 max-h-[45vh] bg-white/95 backdrop-blur-md rounded-t-3xl border-t border-gray-200 lg:static lg:h-full lg:w-[450px] lg:max-h-none lg:bg-white lg:rounded-none lg:border-r lg:order-1' 
                : 'w-full h-full bg-white lg:w-[450px] lg:border-r relative order-1'}
        `}>
          <div className="p-6 flex-shrink-0">
            {!activeTrip && (
              <>
                <h2 className="text-2xl font-bold mb-6 text-slate-900">
                  {activeTab === ServiceType.RIDE ? 'Where to?' : 'What are we delivering?'}
                </h2>
                
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="space-y-3">
                    <div className="relative group">
                      <div className="absolute top-3 left-3 text-gray-400 group-focus-within:text-slate-900 transition-colors">
                         <div className="w-2 h-2 rounded-full bg-current ring-2 ring-slate-200"></div>
                      </div>
                      <input
                        type="text"
                        placeholder="Pickup location"
                        value={pickup}
                        onChange={(e) => { setPickup(e.target.value); if(e.target.value === '') setPickupCoords(null); }}
                        className={`w-full bg-gray-50 border rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-slate-900 focus:outline-none transition-all ${error && pickup.length < 3 ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                      />
                      <div className="absolute left-[15px] top-8 w-[2px] h-8 bg-gray-200 -z-10 group-focus-within:bg-slate-300"></div>
                    </div>

                    {stops.map((stop, index) => (
                      <div key={stop.id} className="relative group animate-in slide-in-from-right-10">
                        <div className="absolute top-3 left-3 text-gray-400 group-focus-within:text-orange-500 transition-colors">
                           <div className="w-2 h-2 rounded-sm bg-current ring-2 ring-slate-200"></div>
                        </div>
                        <input
                          type="text"
                          placeholder={`Stop ${index + 1}`}
                          value={stop.value}
                          onChange={(e) => handleStopChange(stop.id, e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg py-3 pl-10 pr-10 focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
                        />
                        <button 
                          type="button"
                          onClick={() => handleRemoveStop(stop.id)}
                          className="absolute right-2 top-2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="absolute left-[15px] top-8 w-[2px] h-8 bg-gray-200 -z-10"></div>
                      </div>
                    ))}

                    <div className="relative group">
                      <div className="absolute top-3 left-3 text-gray-400 group-focus-within:text-slate-900 transition-colors">
                        <div className="w-2 h-2 rounded-none bg-current ring-2 ring-slate-200"></div>
                      </div>
                      <input
                        type="text"
                        placeholder="Dropoff location"
                        value={dropoff}
                        onChange={(e) => { setDropoff(e.target.value); if(e.target.value === '') setDropoffCoords(null); }}
                        className={`w-full bg-gray-50 border rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-slate-900 focus:outline-none transition-all ${error && dropoff.length < 3 ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                      />
                    </div>
                  </div>

                  {stops.length < 3 && !showResults && (
                    <button 
                      type="button"
                      onClick={handleAddStop}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 pl-1"
                    >
                      <Plus size={14} /> Add Stop
                    </button>
                  )}

                  {error && (
                    <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg animate-pulse">
                      <AlertCircle size={16} />
                      {error}
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={isSearching}
                    className="w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                  >
                    {isSearching ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Routing...
                      </>
                    ) : (
                      <>
                        <Search size={18} />
                        {activeTab === ServiceType.RIDE ? 'Find Teleports' : 'Find Couriers'}
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6 pt-0">
            {activeTrip ? (
               <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center space-y-4 animate-in slide-in-from-bottom-5">
                 <div className="flex justify-center items-center gap-4">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center animate-pulse">
                        <Car size={32} />
                    </div>
                    <div className="text-left">
                        <h3 className="text-xl font-bold text-slate-900">{activeTrip.status}</h3>
                        <p className="text-slate-600 text-sm">{activeTrip.quote.vehicleType}</p>
                        <p className="text-blue-600 text-xs font-bold mt-1">4 min away</p>
                    </div>
                 </div>
                 
                 <div className="pt-4 border-t border-blue-100 flex justify-center gap-3">
                    <button 
                      onClick={() => setIsDriverChatOpen(!isDriverChatOpen)}
                      className="bg-white border border-blue-200 text-blue-700 px-4 py-3 rounded-xl text-sm font-bold flex-1 flex items-center justify-center gap-2 hover:bg-blue-50"
                    >
                      <MessageSquare size={18} /> Chat
                    </button>
                    <button 
                      onClick={() => setActiveTrip(null)} 
                      className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-bold flex-1 hover:bg-red-100"
                    >
                      Cancel
                    </button>
                 </div>
               </div>
            ) : showResults ? (
              <div className="space-y-4">
                <div className="space-y-3 mb-4 pb-4 border-b border-gray-100 sticky top-0 bg-white z-10 pt-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                       <Filter size={14} /> Filter & Sort
                    </h3>
                    <span className="text-xs text-gray-500">{processedQuotes.length} options</span>
                  </div>
                  
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                     {(['price', 'eta', 'eco'] as SortOption[]).map(option => (
                        <button key={option} onClick={() => setSortBy(option)} className={`px-3 py-1.5 rounded-full text-xs font-medium border flex items-center gap-1 transition-colors ${sortBy === option ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-gray-600 border-gray-200'}`}>
                           {option === 'price' && <DollarSign size={12} />}
                           {option === 'eta' && <Clock size={12} />}
                           {option === 'eco' && <Leaf size={12} />}
                           {option.charAt(0).toUpperCase() + option.slice(1)}
                        </button>
                     ))}
                  </div>

                   <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                     {(['all', 'standard', 'luxury', 'delivery', 'eco', 'transit', 'scooter', 'bicycle', 'water', 'van'] as VehicleFilter[]).map(filter => (
                        <button
                          key={filter}
                          onClick={() => setVehicleFilter(filter)}
                          className={`px-3 py-1 rounded-md text-xs font-medium capitalize whitespace-nowrap transition-colors ${vehicleFilter === filter ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                          {filter}
                        </button>
                     ))}
                     
                     {/* Share Ride Toggle */}
                     <div className="border-l border-gray-200 pl-2 ml-1">
                        <button 
                          onClick={() => setIsSharedRide(!isSharedRide)}
                          className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1 whitespace-nowrap transition-colors ${isSharedRide ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                        >
                          <Users size={12} /> Share & Save
                        </button>
                     </div>
                   </div>
                </div>

                {processedQuotes.length > 0 ? (
                  processedQuotes.map((quote) => (
                    <ComparisonCard 
                      key={quote.id} 
                      quote={quote} 
                      selected={selectedQuote?.id === quote.id}
                      onSelect={setSelectedQuote}
                      onBook={() => handleQuickBook(quote)}
                      onSchedule={() => handleScheduleClick(quote)}
                      currencySymbol={currencyData[currency].symbol}
                      currencyMultiplier={currencyData[currency].rate}
                    />
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 text-sm">No options match your filters.</div>
                )}

                <div className="pt-2 pb-6">
                   <button 
                     disabled={!selectedQuote}
                     onClick={handleBook}
                     className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-blue-200/50"
                   >
                     {selectedQuote ? `Book ${selectedQuote.provider}` : 'Select an Option'}
                   </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center opacity-60">
                <MapPin size={48} className="mb-4 text-gray-300" />
                <p>Click on the map to select<br/>Pickup & Dropoff points.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-slate-900">
      <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 lg:px-8 z-50 relative shadow-sm">
        <div className="flex items-center gap-2 lg:gap-8">
          <div className="flex items-center gap-2 font-black text-xl tracking-tight text-blue-600">
             <div className="bg-blue-600 text-white p-1.5 rounded-lg transform -rotate-12">
               <Zap size={20} fill="currentColor" />
             </div>
             <span className="text-slate-900">Teleport</span>
          </div>

          <nav className="hidden md:flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
            {user?.role !== 'driver' && (
              <>
                <button 
                  onClick={() => setActiveTab(ServiceType.RIDE)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === ServiceType.RIDE ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Ride
                </button>
                <button 
                  onClick={() => setActiveTab(ServiceType.DELIVERY)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === ServiceType.DELIVERY ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Delivery
                </button>
                <button 
                  onClick={() => setActiveTab(ServiceType.BUSINESS_FREIGHT)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === ServiceType.BUSINESS_FREIGHT ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Business
                </button>
              </>
            )}
            {user?.role === 'driver' && (
              <>
               <button 
                  onClick={() => setDriverTab('jobs')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${driverTab === 'jobs' ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Jobs
                </button>
                <button 
                  onClick={() => setDriverTab('wallet')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${driverTab === 'wallet' ? 'bg-white text-slate-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Wallet
                </button>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
           {/* Currency Selector */}
           <div className="hidden lg:flex items-center bg-gray-100 rounded-lg p-1">
              <button onClick={() => setCurrency('USD')} className={`px-2 py-1 text-xs rounded font-bold ${currency === 'USD' ? 'bg-white shadow' : 'text-gray-500'}`}>USD</button>
              <button onClick={() => setCurrency('EUR')} className={`px-2 py-1 text-xs rounded font-bold ${currency === 'EUR' ? 'bg-white shadow' : 'text-gray-500'}`}>EUR</button>
              <button onClick={() => setCurrency('NGN')} className={`px-2 py-1 text-xs rounded font-bold ${currency === 'NGN' ? 'bg-white shadow' : 'text-gray-500'}`}>NGN</button>
           </div>

           {user ? (
             <div className="flex items-center gap-3">
               <div className="hidden md:block text-right">
                 <p className="text-sm font-bold leading-none">{user.name}</p>
                 <p className="text-xs text-gray-500 capitalize">{user.role}</p>
               </div>
               
               <button 
                 onClick={() => setIsHistoryOpen(true)}
                 className="bg-gray-100 p-2 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors"
                 title="Trip History"
               >
                 <History size={18} />
               </button>

               <button onClick={() => setUser(null)} className="bg-gray-100 p-2 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors">
                 <LogOut size={18} />
               </button>
             </div>
           ) : (
             <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsAuthOpen(true)}
                  className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                  <Briefcase size={18} />
                  <span>Login</span>
                </button>
                <button 
                  onClick={() => setIsAuthOpen(true)}
                  className="bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-slate-800 transition-colors"
                >
                  Sign In
                </button>
             </div>
           )}
           <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
             {menuOpen ? <X size={24} /> : <Menu size={24} />}
           </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 p-4 absolute top-16 left-0 right-0 z-40 shadow-lg animate-in slide-in-from-top-5">
           <div className="space-y-2">
            <button onClick={() => { setActiveTab(ServiceType.RIDE); setMenuOpen(false); }} className={`w-full text-left p-3 rounded-lg flex items-center justify-between ${activeTab === ServiceType.RIDE ? 'bg-gray-50 font-semibold' : ''}`}><span className="flex items-center gap-3"><Car size={18} /> Ride</span></button>
            <button onClick={() => { setActiveTab(ServiceType.DELIVERY); setMenuOpen(false); }} className={`w-full text-left p-3 rounded-lg flex items-center justify-between ${activeTab === ServiceType.DELIVERY ? 'bg-gray-50 font-semibold' : ''}`}><span className="flex items-center gap-3"><Truck size={18} /> Delivery</span></button>
            <button onClick={() => { setActiveTab(ServiceType.BUSINESS_FREIGHT); setMenuOpen(false); }} className={`w-full text-left p-3 rounded-lg flex items-center justify-between ${activeTab === ServiceType.BUSINESS_FREIGHT ? 'bg-gray-50 font-semibold' : ''}`}><span className="flex items-center gap-3"><Briefcase size={18} /> Business</span></button>
            <hr className="my-2"/>
            {user?.role === 'driver' && (
               <>
                 <button onClick={() => { setDriverTab('jobs'); setMenuOpen(false); }} className={`w-full text-left p-3 rounded-lg flex items-center justify-between ${driverTab === 'jobs' ? 'bg-gray-50 font-semibold' : ''}`}><span className="flex items-center gap-3"><MapIcon size={18} /> Jobs</span></button>
                 <button onClick={() => { setDriverTab('wallet'); setMenuOpen(false); }} className={`w-full text-left p-3 rounded-lg flex items-center justify-between ${driverTab === 'wallet' ? 'bg-gray-50 font-semibold' : ''}`}><span className="flex items-center gap-3"><DollarSign size={18} /> Wallet</span></button>
                 <hr className="my-2"/>
               </>
            )}
            <button onClick={() => { setIsIntegrationsOpen(true); setMenuOpen(false); }} className="w-full text-left p-3 rounded-lg flex items-center justify-between"><span className="flex items-center gap-3"><Settings size={18} /> Integrations</span></button>
            {user && (
               <button onClick={() => { setIsHistoryOpen(true); setMenuOpen(false); }} className="w-full text-left p-3 rounded-lg flex items-center justify-between"><span className="flex items-center gap-3"><History size={18} /> Trip History</span></button>
            )}
           </div>
        </div>
      )}

      <main className="flex-1 overflow-auto relative">
        {renderContent()}
        <ChatAssistant />
        <DriverChat 
           isOpen={isDriverChatOpen} 
           onClose={() => setIsDriverChatOpen(false)} 
           driverName="Michael D."
        />
      </main>

      {/* Modals */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        onLogin={setUser} 
      />
      <PaymentModal 
        isOpen={isPaymentOpen} 
        onClose={() => setIsPaymentOpen(false)} 
        quote={selectedQuote}
        onSuccess={handlePaymentSuccess}
        currencySymbol={currencyData[currency].symbol}
        currencyMultiplier={currencyData[currency].rate}
      />
      <ScheduleModal 
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        onConfirm={handleScheduleConfirm}
      />
      <IntegrationsModal 
        isOpen={isIntegrationsOpen}
        onClose={() => setIsIntegrationsOpen(false)}
      />
      <TripHistoryModal 
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
      />
    </div>
  );
};

export default App;
