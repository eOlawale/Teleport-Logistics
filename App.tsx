import React, { useState, useMemo } from 'react';
import { 
  Menu, X, MapPin, Truck, Car, Briefcase, 
  User as UserIcon, ChevronRight, Search, 
  AlertCircle, Filter, Clock, Leaf, DollarSign,
  MessageSquare, Zap, LogOut, Settings, History,
  Bike, Train, Package
} from 'lucide-react';
import { MOCK_QUOTES } from './constants';
import { Quote, ServiceType, Location, SortOption, VehicleFilter, User } from './types';
import { ComparisonCard } from './components/ComparisonCard';
import { BusinessDashboard } from './components/BusinessDashboard';
import { ChatAssistant } from './components/ChatAssistant';
import { LeafletMap } from './components/LeafletMap';
import { AuthModal } from './components/AuthModal';
import { PaymentModal } from './components/PaymentModal';
import { DriverChat } from './components/DriverChat';
import { IntegrationsModal } from './components/IntegrationsModal';
import { TripHistoryModal } from './components/TripHistoryModal';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ServiceType>(ServiceType.RIDE);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Location State
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
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

  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Payment & Active Trip State
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [activeTrip, setActiveTrip] = useState<{ quote: Quote, status: string } | null>(null);

  // Chat & Integration & History State
  const [isDriverChatOpen, setIsDriverChatOpen] = useState(false);
  const [isIntegrationsOpen, setIsIntegrationsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (pickup.length < 3) return setError('Please enter a valid pickup location.');
    if (dropoff.length < 3) return setError('Please enter a valid dropoff location.');

    setIsSearching(true);
    setShowResults(false);
    setActiveTrip(null);

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

  const handlePaymentSuccess = () => {
    setIsPaymentOpen(false);
    if (selectedQuote) {
      setActiveTrip({ quote: selectedQuote, status: 'Driver en route' });
      // Simulate driver message arriving after a bit
      setTimeout(() => setIsDriverChatOpen(true), 3000);
    }
  };

  const processedQuotes = useMemo(() => {
    let quotes = [...MOCK_QUOTES];
    if (vehicleFilter !== 'all') {
      quotes = quotes.filter(q => q.category === vehicleFilter);
    }
    quotes = quotes.map(q => ({
      ...q,
      eta: Math.round(q.eta * trafficSurge)
    }));
    quotes.sort((a, b) => {
      switch (sortBy) {
        case 'price': return a.price - b.price;
        case 'eta': return a.eta - b.eta;
        case 'eco': return b.ecoScore - a.ecoScore;
        default: return 0;
      }
    });
    return quotes;
  }, [sortBy, vehicleFilter, trafficSurge]);

  const renderContent = () => {
    if (activeTab === ServiceType.BUSINESS_FREIGHT) {
      return (
        <div className="p-6 max-w-6xl mx-auto animate-in fade-in duration-500">
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

    return (
      <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden animate-in fade-in duration-300">
        <div className="w-full lg:w-[450px] bg-white border-r border-gray-200 flex flex-col h-full z-10 shadow-xl lg:shadow-none relative">
          <div className="p-6 flex-shrink-0">
            <h2 className="text-2xl font-bold mb-6 text-slate-900">
              {activeTab === ServiceType.RIDE ? 'Where to?' : 'What are we delivering?'}
            </h2>
            
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-4">
                <div className="relative">
                  <div className="absolute top-3 left-3 text-gray-400">
                     <div className="w-2 h-2 rounded-full bg-slate-900 ring-2 ring-slate-200"></div>
                  </div>
                  <input
                    type="text"
                    placeholder="Pickup location"
                    value={pickup}
                    onChange={(e) => { setPickup(e.target.value); if(e.target.value === '') setPickupCoords(null); }}
                    className={`w-full bg-gray-50 border rounded-lg py-3 pl-10 pr-4 focus:ring-2 focus:ring-slate-900 focus:outline-none transition-all ${error && pickup.length < 3 ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute top-3 left-3 text-gray-400">
                    <div className="w-2 h-2 rounded-none bg-slate-900 ring-2 ring-slate-200"></div>
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
          </div>

          <div className="flex-1 overflow-y-auto p-6 pt-0">
            {activeTrip ? (
               <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center space-y-4 animate-in zoom-in-95">
                 <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
                   <Car size={32} />
                 </div>
                 <div>
                   <h3 className="text-xl font-bold text-slate-900">{activeTrip.status}</h3>
                   <p className="text-slate-600 text-sm mt-1">{activeTrip.quote.vehicleType} • 4 min away</p>
                 </div>
                 <div className="pt-4 border-t border-blue-100 flex justify-center gap-3">
                    <button 
                      onClick={() => setIsDriverChatOpen(!isDriverChatOpen)}
                      className="bg-white border border-blue-200 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-50"
                    >
                      <MessageSquare size={16} /> Chat Driver
                    </button>
                    <button 
                      onClick={() => setActiveTrip(null)} 
                      className="bg-red-50 border border-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-100"
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

                   <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                     {(['all', 'standard', 'luxury', 'delivery', 'eco', 'transit', 'scooter'] as VehicleFilter[]).map(filter => (
                        <button
                          key={filter}
                          onClick={() => setVehicleFilter(filter)}
                          className={`px-3 py-1 rounded-md text-xs font-medium capitalize whitespace-nowrap transition-colors ${vehicleFilter === filter ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                          {filter}
                        </button>
                     ))}
                   </div>
                </div>

                {processedQuotes.length > 0 ? (
                  processedQuotes.map((quote) => (
                    <ComparisonCard 
                      key={quote.id} 
                      quote={quote} 
                      selected={selectedQuote?.id === quote.id}
                      onSelect={setSelectedQuote}
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

        <div className="hidden lg:block flex-1 bg-gray-100 relative h-full">
          <LeafletMap 
             onLocationSelect={handleLocationSelect}
             pickupLocation={pickupCoords}
             dropoffLocation={dropoffCoords}
          />
          
          {showResults && !activeTrip && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-lg flex items-center gap-4 text-sm font-medium animate-in zoom-in-95 z-[400] border border-gray-100">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${trafficSurge > 1.2 ? 'bg-red-500' : trafficSurge > 1.1 ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                Traffic: {trafficSurge > 1.2 ? 'Heavy' : trafficSurge > 1.1 ? 'Moderate' : 'Light'}
              </div>
              <div className="w-[1px] h-4 bg-gray-200"></div>
              <div>Est. Travel: {Math.round(14 * trafficSurge)} min</div>
            </div>
          )}
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
          </nav>
        </div>

        <div className="flex items-center gap-4">
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
                  <span>Business Login</span>
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
