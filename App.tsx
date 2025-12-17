import React, { useState, useMemo, useEffect } from 'react';
import { 
  Menu, X, MapPin, Truck, Car, Briefcase, 
  User as UserIcon, ChevronRight, Search, 
  AlertCircle, Filter, Clock, Leaf, DollarSign,
  MessageSquare, Zap, LogOut, Settings, History,
  Bike, Train, Package, Globe, Plus, Trash2, Calendar, Users, Map as MapIcon, Shield, HelpCircle,
  Locate, Utensils, Key, Bell, Ticket, CheckCircle
} from 'lucide-react';
import { MOCK_QUOTES, MOCK_RESTAURANTS, MOCK_RIDERS } from './constants';
import { Quote, ServiceType, Location, SortOption, VehicleFilter, User, ServiceProvider, Restaurant, Notification } from './types';
import { ComparisonCard } from './components/ComparisonCard';
import { RestaurantCard } from './components/RestaurantCard';
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
import { AdminDashboard } from './components/AdminDashboard';
import { SupportModal } from './components/SupportModal';
import { ProfileModal } from './components/ProfileModal';
import { LandingPage } from './components/LandingPage';
import { EatLanding } from './components/EatLanding';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ServiceType>(ServiceType.RIDE);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Landing Page State
  const [showLanding, setShowLanding] = useState(true);

  // Notifications State
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Apply Dark Mode Class to HTML/Body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Driver & Admin State
  const [driverTab, setDriverTab] = useState<'jobs' | 'wallet'>('jobs');
  const [showAdminDashboard, setShowAdminDashboard] = useState(false);

  // Location State
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [stops, setStops] = useState<{id: string, value: string, coords: Location | null}[]>([]);
  const [pickupCoords, setPickupCoords] = useState<Location | null>(null);
  const [dropoffCoords, setDropoffCoords] = useState<Location | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  
  // Search & Result State
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trafficSurge, setTrafficSurge] = useState(1.0);

  // Filtering, Sorting & Discounts
  const [sortBy, setSortBy] = useState<SortOption>('price');
  const [vehicleFilter, setVehicleFilter] = useState<VehicleFilter | 'private' | 'micro' | 'transit' | 'tricycle'>('all');
  const [isSharedRide, setIsSharedRide] = useState(false);
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP' | 'NGN'>('USD');
  const [promoCode, setPromoCode] = useState('');
  const [activeDiscount, setActiveDiscount] = useState(0); // percentage (e.g. 0.20 for 20%)
  const [isFlexibleDelivery, setIsFlexibleDelivery] = useState(false); // Comparative advantage for delivery

  // Auth & Profile State
  const [user, setUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Payment, Schedule & Active Trip State
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [scheduledTime, setScheduledTime] = useState<{date: string, time: string} | null>(null);
  const [activeTrip, setActiveTrip] = useState<{ quote: Quote, status: string } | null>(null);
  const [driverLocation, setDriverLocation] = useState<Location | null>(null);
  const [tripPhase, setTripPhase] = useState<'pickup' | 'dropoff'>('pickup'); // To track delivery legs

  // Chat & Integration & History & Support State
  const [isDriverChatOpen, setIsDriverChatOpen] = useState(false);
  const [isIntegrationsOpen, setIsIntegrationsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);

  // Currency Multipliers (Mock)
  const currencyData = {
    USD: { symbol: '$', rate: 1 },
    EUR: { symbol: '€', rate: 0.92 },
    GBP: { symbol: '£', rate: 0.79 },
    NGN: { symbol: '₦', rate: 1500 }
  };

  // --- Location Caching & Permission Logic ---
  useEffect(() => {
    // 1. Check Cache on Mount
    const cachedLocation = localStorage.getItem('teleport_user_location');
    if (cachedLocation) {
      try {
        const loc = JSON.parse(cachedLocation);
        setDropoffCoords(loc);
        setDropoff(loc.address);
      } catch (e) {
        console.error("Failed to parse cached location");
      }
    }
  }, []);

  // Request location when switching to EAT if not set
  useEffect(() => {
    if (activeTab === ServiceType.EAT && !dropoffCoords && !showLanding) {
       handleGetCurrentLocation('dropoff'); // Use dropoff as "My Location" for Eats
    }
  }, [activeTab, showLanding]);

  // --- Real-time Driver Simulation with Phases ---
  // Improved logic: 
  // RIDE: Driver moves to Pickup (Phase: pickup)
  // EATS: Driver (simulated) -> Restaurant (Phase: pickup) -> Customer (Phase: dropoff)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (activeTrip && pickupCoords) {
      
      let startLat = 0;
      let startLng = 0;
      let targetLat = 0;
      let targetLng = 0;

      // Determine Start/End points based on Trip Phase
      if (tripPhase === 'pickup') {
         // Driver coming to Pickup/Restaurant
         startLat = pickupCoords.lat! - 0.008; // Simulate driver starting nearby
         startLng = pickupCoords.lng! - 0.008;
         targetLat = pickupCoords.lat!;
         targetLng = pickupCoords.lng!;
      } else if (tripPhase === 'dropoff' && dropoffCoords) {
         // Driver going from Pickup/Restaurant to Dropoff/Customer
         startLat = pickupCoords.lat!;
         startLng = pickupCoords.lng!;
         targetLat = dropoffCoords.lat!;
         targetLng = dropoffCoords.lng!;
      } else {
         // Fallback if missing dropoff coords in RIDE mode
         startLat = pickupCoords.lat! - 0.008;
         startLng = pickupCoords.lng! - 0.008;
         targetLat = pickupCoords.lat!;
         targetLng = pickupCoords.lng!;
      }
      
      let progress = 0;
      // Increased Refresh Rate: 200ms instead of 1000ms for smoother animation
      interval = setInterval(() => {
        progress += 0.002; // Slower movement for realism across map
        if (progress > 1) progress = 1; 
        
        const curLat = startLat + (targetLat - startLat) * progress;
        const curLng = startLng + (targetLng - startLng) * progress;
        
        setDriverLocation({ 
          lat: curLat, 
          lng: curLng, 
          address: 'Driver Location' 
        });
      }, 200); 
    } else {
      setDriverLocation(null);
    }
    return () => clearInterval(interval);
  }, [activeTrip, pickupCoords, dropoffCoords, tripPhase]);

  const addNotification = (title: string, message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const newNote: Notification = {
      id: Date.now().toString(),
      title,
      message,
      type,
      read: false,
      time: 'Just now'
    };
    setNotifications(prev => [newNote, ...prev]);
  };

  // --- Smart Rider Assignment Logic ---
  const findBestRider = (restaurant: Restaurant): any => {
     // Scoring algorithm:
     // Score = (Rating * 10) - (Distance * 2) - (CurrentLoad * 5)
     // Higher is better.
     
     let bestRider = null;
     let highestScore = -Infinity;

     MOCK_RIDERS.forEach(rider => {
        const dist = Math.sqrt(Math.pow(rider.lat - restaurant.lat, 2) + Math.pow(rider.lng - restaurant.lng, 2)) * 100; // Approx distance
        const score = (rider.rating * 10) - (dist * 2) - (rider.load * 5);
        
        if (score > highestScore) {
           highestScore = score;
           bestRider = rider;
        }
     });

     return bestRider || MOCK_RIDERS[0]; // Fallback
  };

  const handleUserLogin = (u: User) => {
    // Simulate Premium User check for Bargain Price logic
    const enhancedUser = { ...u, isPremium: u.role === 'business' || Math.random() > 0.5 };
    setUser(enhancedUser);
    setShowLanding(false); // Move to app
    if (enhancedUser.isPremium) {
      addNotification("Premium Member", "You have access to exclusive bargain prices today!", 'success');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setShowLanding(true); // Back to landing
  };

  const handleLocationSelect = (type: 'pickup' | 'dropoff', location: Location) => {
    if (type === 'pickup') {
      setPickupCoords(location);
      setPickup(location.address);
      if (dropoffCoords && pickupCoords) {
        // Only clear if switching context completely, otherwise keeping dropoff is useful
        if (activeTab === ServiceType.RIDE) {
           setDropoff('');
           setDropoffCoords(null);
           setShowResults(false);
           setActiveTrip(null);
        }
      }
    } else {
      setDropoffCoords(location);
      setDropoff(location.address);
      // Cache user location (Dropoff is usually "Home" for Eats)
      if (activeTab === ServiceType.EAT) {
         localStorage.setItem('teleport_user_location', JSON.stringify(location));
      }
    }
    setError(null);
  };

  const handleEatSearch = (address: string) => {
    // For Eat mode, the entered address is the "Dropoff" (User location)
    // We set it to simulate the user entering their location to find restaurants
    const mockLoc = { address, lat: 37.7749, lng: -122.4194 };
    setDropoff(address);
    setDropoffCoords(mockLoc); 
    localStorage.setItem('teleport_user_location', JSON.stringify(mockLoc));
    setShowResults(true); // Show restaurants immediately
  };

  const handleGetCurrentLocation = (target: 'pickup' | 'dropoff' = 'pickup') => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const location: Location = {
          lat: latitude,
          lng: longitude,
          address: "Current Location"
        };
        
        if (target === 'pickup') {
           setPickupCoords(location);
           setPickup("Current Location");
        } else {
           setDropoffCoords(location);
           setDropoff("Current Location");
           localStorage.setItem('teleport_user_location', JSON.stringify(location));
        }

        setIsLocating(false);
        setError(null);
      },
      (err) => {
        console.error(err);
        // Don't show error if it was an automatic background request
        if (activeTab === ServiceType.EAT && !dropoffCoords) {
           // silent fail or small toast
        } else {
           setError("Unable to retrieve your location. Please check permissions.");
        }
        setIsLocating(false);
      }
    );
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
    if (value === '') {
       setStops(stops.map(s => s.id === id ? { ...s, value, coords: null } : s));
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (activeTab !== ServiceType.EAT) {
        if (pickup.length < 3) return setError('Please enter a valid pickup location.');
        if (dropoff.length < 3) return setError('Please enter a valid dropoff location.');
    } else {
        // For EAT, we just need a dropoff (User location)
        if (dropoff.length < 3) return setError('Please enter your delivery address.');
    }

    setIsSearching(true);
    setShowResults(false);
    setActiveTrip(null);
    setScheduledTime(null); 

    setTimeout(() => {
      setIsSearching(false);
      setShowResults(true);
      setTrafficSurge(1 + Math.random() * 0.3);
    }, 1000);
  };

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'TELEPORT20') {
      setActiveDiscount(0.20);
      alert("Promo code applied! 20% Discount.");
    } else if (promoCode.toUpperCase() === 'WELCOME50') {
      setActiveDiscount(0.50);
      alert("Welcome Bonus! 50% Discount applied.");
    } else {
      setActiveDiscount(0);
      alert("Invalid Promo Code");
    }
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

  const handleRestaurantClick = (restaurant: Restaurant) => {
     // 1. Assign best rider logic
     const assignedRider = findBestRider(restaurant);
     
     // 2. Set Pickup to Restaurant Location (Important for map tracking)
     const restaurantLocation = { 
       lat: restaurant.lat, 
       lng: restaurant.lng, 
       address: restaurant.name 
     };
     setPickupCoords(restaurantLocation);
     setPickup(restaurant.name);

     // 3. Create Quote with Rider info
     const mockQuote: Quote = {
        id: restaurant.id,
        provider: ServiceProvider.TELEPORT,
        price: 25.00 + restaurant.baseDeliveryFee, 
        currency: 'USD',
        eta: 30,
        vehicleType: `${assignedRider.vehicle} • ${assignedRider.name}`,
        ecoScore: 10,
        surged: false,
        category: 'delivery'
     };
     
     setSelectedQuote(mockQuote);
     setIsPaymentOpen(true);
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
         alert(`Trip Scheduled successfully for ${scheduledTime.date} at ${scheduledTime.time}!`);
         setScheduledTime(null);
         setActiveTrip(null); 
         setShowResults(false);
      } else {
         // Start Order Lifecycle Simulation
         
         // 1. Order Confirmed (Immediate)
         setActiveTrip({ quote: selectedQuote, status: activeTab === ServiceType.EAT ? 'Order Confirmed' : 'Driver en route' });
         addNotification("Order Confirmed", `Your order with ${selectedQuote.id.startsWith('r') ? 'Restaurant' : 'provider'} is confirmed.`, 'success');
         setTripPhase('pickup');

         if (activeTab === ServiceType.EAT) {
            // EATS Specific Lifecycle
            
            // 2. Preparing (2s)
            setTimeout(() => {
               setActiveTrip(prev => prev ? { ...prev, status: 'Preparing Food' } : null);
            }, 2000);

            // 3. Rider Assigned (5s)
            setTimeout(() => {
               setActiveTrip(prev => prev ? { ...prev, status: `Rider Assigned: ${selectedQuote.vehicleType.split('•')[1] || 'David'}` } : null);
               addNotification("Rider Assigned", `${selectedQuote.vehicleType.split('•')[1] || 'David'} is heading to the restaurant.`, 'info');
            }, 5000);

            // 4. Out for Delivery (10s) - SWITCH MAP PHASE
            setTimeout(() => {
               setActiveTrip(prev => prev ? { ...prev, status: 'Out for Delivery' } : null);
               setTripPhase('dropoff'); // Triggers map to draw line from Restaurant to User
               addNotification("Out for Delivery", `Your order is on the way! ETA: ${selectedQuote.eta} mins.`, 'success');
            }, 10000);

            // 5. Delivered (25s)
            setTimeout(() => {
               setActiveTrip(prev => prev ? { ...prev, status: 'Delivered' } : null);
               addNotification("Delivered", "Enjoy your meal!", 'success');
               setTimeout(() => setIsDriverChatOpen(false), 5000); // Close chat if open
            }, 25000);

         } else {
            // Standard Ride Lifecycle
            setTimeout(() => setIsDriverChatOpen(true), 3000);
         }
      }
    }
  };

  // Pricing Logic with 5% Margin and Distance Calculation
  const processedQuotes = useMemo(() => {
    let quotes = [...MOCK_QUOTES];
    
    // Filtering Logic
    if (vehicleFilter !== 'all') {
      if (vehicleFilter === 'private') {
         quotes = quotes.filter(q => ['standard', 'luxury', 'eco', 'van'].includes(q.category));
      } else if (vehicleFilter === 'micro') {
         quotes = quotes.filter(q => ['scooter', 'bicycle'].includes(q.category));
      } else if (vehicleFilter === 'transit') {
         quotes = quotes.filter(q => ['transit', 'water'].includes(q.category));
      } else if (vehicleFilter === 'tricycle') {
         quotes = quotes.filter(q => ['tricycle'].includes(q.category));
      } else {
         quotes = quotes.filter(q => q.category === vehicleFilter);
      }
    }

    if (isSharedRide) {
      quotes = quotes.filter(q => q.canShare);
    }

    // Dynamic Pricing Constants
    const PLATFORM_MARGIN = 1.05; // 5% Margin Increase
    // Base Rate, Cost per KM, Cost per Minute, Average Speed (km/h)
    const RATES: Record<string, { base: number, perKm: number, perMin: number, speed: number }> = {
      standard: { base: 2.00, perKm: 1.05, perMin: 0.20, speed: 30 },
      luxury: { base: 5.00, perKm: 2.20, perMin: 0.50, speed: 35 },
      delivery: { base: 3.50, perKm: 0.90, perMin: 0.15, speed: 25 },
      eco: { base: 2.50, perKm: 1.00, perMin: 0.18, speed: 30 },
      transit: { base: 2.50, perKm: 0.00, perMin: 0.00, speed: 25 }, // Flat rate usually
      scooter: { base: 1.00, perKm: 0.35, perMin: 0.25, speed: 15 },
      bicycle: { base: 1.00, perKm: 0.50, perMin: 0.15, speed: 12 },
      water: { base: 12.00, perKm: 3.00, perMin: 0.00, speed: 40 },
      van: { base: 10.00, perKm: 1.80, perMin: 0.40, speed: 25 },
      tricycle: { base: 1.50, perKm: 0.60, perMin: 0.15, speed: 15 }, // Tricycle Community Rate
    };

    // Calculate Distance (Simulated Haversine)
    let distanceKm = 4.5; // Default fallback distance
    if (pickupCoords?.lat && dropoffCoords?.lat) {
       const R = 6371; // km
       const dLat = (dropoffCoords.lat - pickupCoords.lat) * Math.PI / 180;
       const dLon = (dropoffCoords.lng - pickupCoords.lng) * Math.PI / 180;
       const a = 
         Math.sin(dLat/2) * Math.sin(dLat/2) +
         Math.cos(pickupCoords.lat * Math.PI / 180) * Math.cos(dropoffCoords.lat * Math.PI / 180) * 
         Math.sin(dLon/2) * Math.sin(dLon/2);
       const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
       distanceKm = R * c;
    }
    // Enforce minimum distance for realistic pricing
    distanceKm = Math.max(1.5, distanceKm);

    // Modifiers
    const stopMultiplier = 1 + (stops.length * 0.15);
    const shareDiscount = isSharedRide ? 0.8 : 1;
    const deliveryFlexDiscount = (activeTab === ServiceType.DELIVERY && isFlexibleDelivery) ? 0.85 : 1;
    const totalDiscountMultiplier = (1 - activeDiscount) * shareDiscount * deliveryFlexDiscount;

    quotes = quotes.map(q => {
      // 1. Calculate Base Cost based on Category Rates and Distance
      const rate = RATES[q.category] || RATES.standard;
      
      const rawEta = (distanceKm / rate.speed) * 60; // minutes
      const estimatedDurationMin = rawEta + 3; // +3 min buffer for pickup/dropoff
      
      // Base Price Formula: Base + (Dist * Rate) + (Time * Rate)
      let dynamicPrice = rate.base + (rate.perKm * distanceKm) + (rate.perMin * estimatedDurationMin);

      // 2. Provider Variance (Simulation)
      // Uber/Lyft/Teleport might have slightly different algos. 
      // Teleport is cheaper (Competitive Advantage)
      if (q.provider === ServiceProvider.UBER) dynamicPrice *= 1.12; 
      if (q.provider === ServiceProvider.LYFT) dynamicPrice *= 1.09; 
      if (q.provider === ServiceProvider.TELEPORT) dynamicPrice *= 0.95; 

      // 3. Apply Traffic Surge
      let etaMultiplier = trafficSurge * (isSharedRide ? 1.2 : 1);
      if (activeTab === ServiceType.DELIVERY && isFlexibleDelivery) etaMultiplier *= 2; 

      let finalSurge = trafficSurge;
      if (q.surged) {
         finalSurge = Math.max(trafficSurge, 1.4); // Force higher surge for surged items
      }
      dynamicPrice = dynamicPrice * finalSurge;

      // 4. Apply Platform Margin (5% increase)
      dynamicPrice = dynamicPrice * PLATFORM_MARGIN;

      // 5. Apply User Discounts / Modifiers
      const originalPrice = dynamicPrice * stopMultiplier;
      const finalPrice = originalPrice * totalDiscountMultiplier;

      // 6. Bargain Price Calculation (Premium Customers)
      let bargainPrice = undefined;
      if (user?.isPremium && (q.provider === ServiceProvider.TELEPORT || q.category === 'luxury')) {
         bargainPrice = finalPrice * 0.90; // 10% off for premium
      }

      return {
        ...q,
        eta: Math.round(rawEta * etaMultiplier), 
        price: finalPrice,
        originalPrice: finalPrice < originalPrice ? originalPrice : undefined,
        vehicleType: isSharedRide ? `${q.vehicleType} (Shared)` : q.vehicleType,
        bargainPrice
      };
    });

    // Identify Competitive Advantages
    if (quotes.length > 0) {
      const minPrice = Math.min(...quotes.map(q => q.price));
      const minEta = Math.min(...quotes.map(q => q.eta));
      
      quotes = quotes.map(q => ({
        ...q,
        badges: [
          ...(q.price === minPrice ? ['Cheapest'] : []),
          ...(q.eta === minEta ? ['Fastest'] : []),
        ]
      }));
    }

    // Sort - OPTIMIZED FOR TELEPORT
    quotes.sort((a, b) => {
      // 1. Prioritize Teleport Fleet (Optimization)
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
  }, [sortBy, vehicleFilter, trafficSurge, stops.length, isSharedRide, activeDiscount, isFlexibleDelivery, activeTab, pickupCoords, dropoffCoords, user]);

  // Eats Pricing Logic
  const getDeliveryFee = (restaurant: Restaurant) => {
     // Dynamic Delivery Fee based on distance (simulated) + margin
     // Assume baseFee includes base distance, add surcharge for current location logic
     let distFactor = 1;
     if (dropoffCoords && restaurant.lat && restaurant.lng) {
        const R = 6371; 
        const dLat = (dropoffCoords.lat! - restaurant.lat) * Math.PI / 180;
        const dLon = (dropoffCoords.lng! - restaurant.lng) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(restaurant.lat * Math.PI / 180) * Math.cos(dropoffCoords.lat! * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const d = R * c; 
        distFactor = Math.max(1, d * 0.5); // Increase fee if far
     }
     
     // 5% Platform Margin Logic + Rider Payout Adjustment
     return (restaurant.baseDeliveryFee * distFactor * 1.05);
  };

  const renderContent = () => {
    // Admin View
    if (showAdminDashboard && user?.role === 'admin') {
       return <AdminDashboard />;
    }

    // Driver View
    if (user?.role === 'driver') {
      if (driverTab === 'wallet') {
        return (
          <div className="flex-1 bg-gray-50 dark:bg-slate-950 h-[calc(100vh-64px)] overflow-auto animate-in fade-in">
            <DriverWallet />
          </div>
        );
      }
      
      // Driver Jobs View
      return (
        <div className="flex-1 h-[calc(100vh-64px)] relative animate-in fade-in bg-gray-100 dark:bg-slate-900">
           <div className={isDarkMode ? 'dark-map-tiles h-full' : 'h-full'}>
             <LeafletMap 
               onLocationSelect={() => {}} 
               pickupLocation={null}
               dropoffLocation={null}
               stops={[]}
               driverLocation={{ lat: 37.7749, lng: -122.4194, address: 'Current Location' }} 
            />
           </div>
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 z-[400]">
             <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                   <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">You are Online</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Finding nearby trips...</p>
                   </div>
                </div>
                <button className="bg-slate-900 dark:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors">
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
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Business Command Center</h1>
              <p className="text-slate-500 dark:text-slate-400 mt-2">Manage fleet, analyze spend, and optimize routes.</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setIsIntegrationsOpen(true)}
                className="bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2"
              >
                <Settings size={16} /> Integrations
              </button>
              <button className="bg-slate-900 dark:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
                Export Report
              </button>
            </div>
          </div>
          <BusinessDashboard />
        </div>
      );
    }

    // EAT LANDING VIEW
    if (activeTab === ServiceType.EAT && !dropoffCoords) {
      return (
        <EatLanding 
          onSearch={handleEatSearch}
          onSignIn={() => setIsAuthOpen(true)}
        />
      );
    }

    // Rider/Delivery/Eat/Freight/Rent Main Map View
    return (
      <div className="flex flex-col lg:flex-row h-[calc(100vh-64px)] overflow-hidden animate-in fade-in duration-300 relative">
        
        {/* Map Layer */}
        <div className={`
             bg-gray-100 dark:bg-slate-900 relative transition-all duration-500 ease-in-out
             ${activeTrip 
                ? 'absolute inset-0 z-0 lg:static lg:flex-1 lg:order-2' 
                : 'hidden lg:block flex-1 order-2'} 
        `}>
          <div className={isDarkMode ? 'dark-map-tiles h-full' : 'h-full'}>
             <LeafletMap 
                onLocationSelect={handleLocationSelect}
                pickupLocation={pickupCoords}
                dropoffLocation={dropoffCoords}
                stops={stops.filter(s => s.coords).map(s => s.coords!)}
                driverLocation={driverLocation}
             />
          </div>
          
          {showResults && !activeTrip && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-slate-900 px-6 py-3 rounded-full shadow-lg flex items-center gap-4 text-sm font-medium animate-in zoom-in-95 z-[400] border border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${trafficSurge > 1.2 ? 'bg-red-500' : trafficSurge > 1.1 ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                <span className="dark:text-white">Traffic: {trafficSurge > 1.2 ? 'Heavy' : trafficSurge > 1.1 ? 'Moderate' : 'Light'}</span>
              </div>
              <div className="w-[1px] h-4 bg-gray-200 dark:bg-slate-700"></div>
              <div className="dark:text-white">Est. Travel: {Math.round(14 * trafficSurge * (1 + stops.length * 0.2))} min</div>
            </div>
          )}
        </div>

        {/* Sidebar / Overlay Layer */}
        <div className={`
            flex flex-col transition-all duration-500 ease-in-out shadow-xl lg:shadow-none z-10
            ${activeTrip 
                ? 'absolute bottom-0 left-0 right-0 max-h-[45vh] bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-t-3xl border-t border-gray-200 dark:border-slate-800 lg:static lg:h-full lg:w-[450px] lg:max-h-none lg:bg-white dark:lg:bg-slate-900 lg:rounded-none lg:border-r lg:order-1' 
                : 'w-full h-full bg-white dark:bg-slate-900 lg:w-[450px] lg:border-r dark:lg:border-slate-800 relative order-1'}
        `}>
          <div className="p-6 flex-shrink-0">
            {!activeTrip && (
              <>
                <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">
                  {activeTab === ServiceType.RIDE ? 'Where to?' : 
                   activeTab === ServiceType.DELIVERY ? 'What are we delivering?' :
                   activeTab === ServiceType.EAT ? 'Hungry? Find food nearby.' :
                   activeTab === ServiceType.FREIGHT ? 'Heavy cargo destination?' :
                   activeTab === ServiceType.RENT ? 'Where do you need a car?' :
                   'Where to?'}
                </h2>
                
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="space-y-3">
                    
                    {/* Only show Pickup if NOT in EAT mode. In EAT, Pickup is implicitly the Restaurant */}
                    {activeTab !== ServiceType.EAT && (
                      <div className="relative group">
                        <div className="absolute top-3 left-3 text-gray-400 group-focus-within:text-slate-900 dark:group-focus-within:text-white transition-colors">
                           <div className="w-2 h-2 rounded-full bg-current ring-2 ring-slate-200 dark:ring-slate-700"></div>
                        </div>
                        <input
                          type="text"
                          placeholder="Pickup location"
                          value={pickup}
                          onChange={(e) => { setPickup(e.target.value); if(e.target.value === '') setPickupCoords(null); }}
                          className={`w-full bg-gray-50 dark:bg-slate-800 dark:text-white border rounded-lg py-3 pl-10 pr-10 focus:ring-2 focus:ring-slate-900 dark:focus:ring-blue-500 focus:outline-none transition-all ${error && pickup.length < 3 ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-slate-700'}`}
                        />
                        <button 
                          type="button" 
                          onClick={() => handleGetCurrentLocation('pickup')}
                          className="absolute right-3 top-2.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"
                          title="Use Current Location"
                        >
                          {isLocating ? <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div> : <Locate size={18} />}
                        </button>
                        <div className="absolute left-[15px] top-8 w-[2px] h-8 bg-gray-200 dark:bg-slate-700 -z-10 group-focus-within:bg-slate-300"></div>
                      </div>
                    )}

                    {stops.map((stop, index) => (
                      <div key={stop.id} className="relative group animate-in slide-in-from-right-10">
                        <div className="absolute top-3 left-3 text-gray-400 group-focus-within:text-orange-500 transition-colors">
                           <div className="w-2 h-2 rounded-sm bg-current ring-2 ring-slate-200 dark:ring-slate-700"></div>
                        </div>
                        <input
                          type="text"
                          placeholder={`Stop ${index + 1}`}
                          value={stop.value}
                          onChange={(e) => handleStopChange(stop.id, e.target.value)}
                          className="w-full bg-gray-50 dark:bg-slate-800 dark:text-white border border-gray-200 dark:border-slate-700 rounded-lg py-3 pl-10 pr-10 focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
                        />
                        <button 
                          type="button"
                          onClick={() => handleRemoveStop(stop.id)}
                          className="absolute right-2 top-2 p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-full transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                        <div className="absolute left-[15px] top-8 w-[2px] h-8 bg-gray-200 dark:bg-slate-700 -z-10"></div>
                      </div>
                    ))}

                    <div className="relative group">
                      <div className="absolute top-3 left-3 text-gray-400 group-focus-within:text-slate-900 dark:group-focus-within:text-white transition-colors">
                        <div className="w-2 h-2 rounded-none bg-current ring-2 ring-slate-200 dark:ring-slate-700"></div>
                      </div>
                      <input
                        type="text"
                        placeholder={activeTab === ServiceType.EAT ? "Your Delivery Address" : "Dropoff location"}
                        value={dropoff}
                        onChange={(e) => { setDropoff(e.target.value); if(e.target.value === '') setDropoffCoords(null); }}
                        className={`w-full bg-gray-50 dark:bg-slate-800 dark:text-white border rounded-lg py-3 pl-10 pr-10 focus:ring-2 focus:ring-slate-900 dark:focus:ring-blue-500 focus:outline-none transition-all ${error && dropoff.length < 3 ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-slate-700'}`}
                      />
                       <button 
                          type="button" 
                          onClick={() => handleGetCurrentLocation('dropoff')}
                          className="absolute right-3 top-2.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700"
                          title="Use Current Location"
                        >
                          {isLocating ? <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div> : <Locate size={18} />}
                        </button>
                    </div>
                  </div>

                  {stops.length < 3 && !showResults && activeTab !== ServiceType.EAT && (
                    <button 
                      type="button"
                      onClick={handleAddStop}
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 flex items-center gap-1 pl-1"
                    >
                      <Plus size={14} /> Add Stop
                    </button>
                  )}

                  {error && (
                    <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg animate-pulse">
                      <AlertCircle size={16} />
                      {error}
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={isSearching}
                    className="w-full bg-slate-900 dark:bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 dark:hover:bg-blue-700 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                  >
                    {isSearching ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        {activeTab === ServiceType.EAT ? 'Finding Food...' : 'Routing...'}
                      </>
                    ) : (
                      <>
                        <Search size={18} />
                        {activeTab === ServiceType.RIDE ? 'Find Teleports' : 
                         activeTab === ServiceType.DELIVERY ? 'Find Couriers' :
                         activeTab === ServiceType.EAT ? 'Search Restaurants' :
                         activeTab === ServiceType.FREIGHT ? 'Find Trucks' :
                         activeTab === ServiceType.RENT ? 'Find Vehicles' :
                         'Search'}
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-6 pt-0">
            {activeTrip ? (
               <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 text-center space-y-4 animate-in slide-in-from-bottom-5">
                 <div className="flex justify-center items-center gap-4">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-200 rounded-full flex items-center justify-center animate-pulse">
                        <Car size={32} />
                    </div>
                    <div className="text-left">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{activeTrip.status}</h3>
                        <p className="text-slate-600 dark:text-slate-300 text-sm">{activeTrip.quote.vehicleType}</p>
                        <p className="text-blue-600 dark:text-blue-400 text-xs font-bold mt-1">
                           {activeTab === ServiceType.EAT ? 'Tracking Order...' : '4 min away'}
                        </p>
                    </div>
                 </div>
                 
                 <div className="pt-4 border-t border-blue-100 dark:border-blue-800 flex justify-center gap-3">
                    <button 
                      onClick={() => setIsDriverChatOpen(!isDriverChatOpen)}
                      className="bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 px-4 py-3 rounded-xl text-sm font-bold flex-1 flex items-center justify-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/30"
                    >
                      <MessageSquare size={18} /> Chat
                    </button>
                    <button 
                      onClick={() => setActiveTrip(null)} 
                      className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-xl text-sm font-bold flex-1 hover:bg-red-100 dark:hover:bg-red-900/30"
                    >
                      Cancel
                    </button>
                 </div>
                 {/* Order Status Steps for EATS */}
                 {activeTab === ServiceType.EAT && (
                    <div className="flex justify-between items-center px-2 pt-2 text-[10px] text-gray-500">
                       <div className={`flex flex-col items-center gap-1 ${['Order Confirmed', 'Preparing Food', 'Rider Assigned', 'Out for Delivery', 'Delivered'].includes(activeTrip.status) ? 'text-green-600 font-bold' : ''}`}>
                          <div className="w-2 h-2 rounded-full bg-current"></div>
                          Confirmed
                       </div>
                       <div className="h-[1px] flex-1 bg-gray-300 mx-1"></div>
                       <div className={`flex flex-col items-center gap-1 ${['Rider Assigned', 'Out for Delivery', 'Delivered'].includes(activeTrip.status) ? 'text-green-600 font-bold' : ''}`}>
                          <div className="w-2 h-2 rounded-full bg-current"></div>
                          Assigned
                       </div>
                       <div className="h-[1px] flex-1 bg-gray-300 mx-1"></div>
                       <div className={`flex flex-col items-center gap-1 ${['Out for Delivery', 'Delivered'].includes(activeTrip.status) ? 'text-green-600 font-bold' : ''}`}>
                          <div className="w-2 h-2 rounded-full bg-current"></div>
                          On Way
                       </div>
                       <div className="h-[1px] flex-1 bg-gray-300 mx-1"></div>
                        <div className={`flex flex-col items-center gap-1 ${['Delivered'].includes(activeTrip.status) ? 'text-green-600 font-bold' : ''}`}>
                          <div className="w-2 h-2 rounded-full bg-current"></div>
                          Delivered
                       </div>
                    </div>
                 )}
               </div>
            ) : showResults ? (
              <div className="space-y-4">
                
                {activeTab !== ServiceType.EAT && (
                  <div className="space-y-3 mb-4 pb-4 border-b border-gray-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10 pt-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                         <Filter size={14} /> Filter & Sort
                      </h3>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{processedQuotes.length} options</span>
                    </div>
                    
                    {/* Simplified Multimodal Filters */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                       <button onClick={() => setVehicleFilter('all')} className={`px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-colors ${vehicleFilter === 'all' ? 'bg-slate-900 text-white dark:bg-blue-600' : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300'}`}>All Modes</button>
                       <button onClick={() => setVehicleFilter('private')} className={`px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-colors ${vehicleFilter === 'private' ? 'bg-slate-900 text-white dark:bg-blue-600' : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300'}`}>Private Ride</button>
                       <button onClick={() => setVehicleFilter('tricycle')} className={`px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-colors ${vehicleFilter === 'tricycle' ? 'bg-slate-900 text-white dark:bg-blue-600' : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300'}`}>Tricycle (New)</button>
                       <button onClick={() => setVehicleFilter('micro')} className={`px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-colors ${vehicleFilter === 'micro' ? 'bg-slate-900 text-white dark:bg-blue-600' : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300'}`}>Micro-Mobility</button>
                       <button onClick={() => setVehicleFilter('transit')} className={`px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-colors ${vehicleFilter === 'transit' ? 'bg-slate-900 text-white dark:bg-blue-600' : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300'}`}>Public Transit</button>
                    </div>
                     
                     {/* Promo Code Input */}
                     <div className="flex gap-2">
                        <input 
                           type="text" 
                           placeholder="Promo Code" 
                           value={promoCode}
                           onChange={(e) => setPromoCode(e.target.value)}
                           className="flex-1 bg-gray-50 dark:bg-slate-800 dark:text-white border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        />
                        <button onClick={handleApplyPromo} className="px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-bold hover:bg-blue-200 dark:hover:bg-blue-900/50">Apply</button>
                     </div>

                     <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide mt-2">
                       {/* Share Ride Toggle (Rides) */}
                       {activeTab === ServiceType.RIDE && (
                          <button 
                            onClick={() => setIsSharedRide(!isSharedRide)}
                            className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1 whitespace-nowrap transition-colors ${isSharedRide ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800' : 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                          >
                            <Users size={12} /> Share & Save
                          </button>
                       )}
                       
                       {/* Flexible Delivery Toggle (Delivery) - Comparative Advantage */}
                       {activeTab === ServiceType.DELIVERY && (
                          <button 
                            onClick={() => setIsFlexibleDelivery(!isFlexibleDelivery)}
                            className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1 whitespace-nowrap transition-colors ${isFlexibleDelivery ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800' : 'bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700'}`}
                          >
                            <Clock size={12} /> Flexible (Save 15%)
                          </button>
                       )}
                     </div>
                  </div>
                )}

                {activeTab === ServiceType.EAT ? (
                   <div className="space-y-3">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">Nearby Restaurants</h3>
                      {MOCK_RESTAURANTS.map(restaurant => (
                        <RestaurantCard 
                           key={restaurant.id}
                           restaurant={restaurant}
                           onClick={handleRestaurantClick}
                           currencySymbol={currencyData[currency].symbol}
                           deliveryFee={getDeliveryFee(restaurant)}
                        />
                      ))}
                   </div>
                ) : (
                  processedQuotes.length > 0 ? (
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
                  )
                )}

                {activeTab !== ServiceType.EAT && (
                  <div className="pt-2 pb-6">
                     <button 
                       disabled={!selectedQuote}
                       onClick={handleBook}
                       className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-blue-200/50"
                     >
                       {selectedQuote ? `Book ${selectedQuote.provider}` : 'Select an Option'}
                     </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-slate-600 text-center opacity-60">
                <MapPin size={48} className="mb-4 text-gray-300 dark:text-slate-700" />
                <p>Click on the map to select<br/>Pickup & Dropoff points.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  if (showLanding && !user) {
    return (
      <>
        <LandingPage 
          onLoginClick={() => setIsAuthOpen(true)}
          onRegisterClick={() => setIsAuthOpen(true)}
          onGuestAccess={() => setShowLanding(false)}
        />
        <AuthModal 
          isOpen={isAuthOpen} 
          onClose={() => setIsAuthOpen(false)} 
          onLogin={handleUserLogin} 
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex flex-col font-sans text-slate-900 dark:text-white transition-colors duration-300">
      <header className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 h-16 flex items-center justify-between px-4 lg:px-8 z-50 relative shadow-sm">
        <div className="flex items-center gap-2 lg:gap-8">
          <div className="flex items-center gap-2 font-black text-xl tracking-tight text-blue-600 dark:text-blue-500">
             <div className="bg-blue-600 dark:bg-blue-500 text-white p-1.5 rounded-lg transform -rotate-12">
               <Zap size={20} fill="currentColor" />
             </div>
             <span className="text-slate-900 dark:text-white">Teleport</span>
          </div>

          <nav className="hidden md:flex items-center gap-1 bg-gray-100 dark:bg-slate-800 p-1 rounded-lg">
            {user?.role !== 'driver' && user?.role !== 'admin' && (
              <>
                <button 
                  onClick={() => setActiveTab(ServiceType.RIDE)}
                  className={`px-3 lg:px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${activeTab === ServiceType.RIDE ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white'}`}
                >
                  <Car size={14} /> Ride
                </button>
                <button 
                  onClick={() => setActiveTab(ServiceType.DELIVERY)}
                  className={`px-3 lg:px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${activeTab === ServiceType.DELIVERY ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white'}`}
                >
                  <Package size={14} /> Delivery
                </button>
                <button 
                  onClick={() => setActiveTab(ServiceType.EAT)}
                  className={`px-3 lg:px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${activeTab === ServiceType.EAT ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white'}`}
                >
                  <Utensils size={14} /> Eat
                </button>
                <button 
                  onClick={() => setActiveTab(ServiceType.FREIGHT)}
                  className={`px-3 lg:px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${activeTab === ServiceType.FREIGHT ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white'}`}
                >
                  <Truck size={14} /> Freight
                </button>
                <button 
                  onClick={() => setActiveTab(ServiceType.RENT)}
                  className={`px-3 lg:px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${activeTab === ServiceType.RENT ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white'}`}
                >
                  <Key size={14} /> Rent
                </button>
                <button 
                  onClick={() => setActiveTab(ServiceType.BUSINESS_FREIGHT)}
                  className={`px-3 lg:px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${activeTab === ServiceType.BUSINESS_FREIGHT ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white'}`}
                >
                  <Briefcase size={14} /> Business
                </button>
              </>
            )}
            {user?.role === 'driver' && (
              <>
               <button 
                  onClick={() => setDriverTab('jobs')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${driverTab === 'jobs' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white'}`}
                >
                  Jobs
                </button>
                <button 
                  onClick={() => setDriverTab('wallet')}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${driverTab === 'wallet' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white'}`}
                >
                  Wallet
                </button>
              </>
            )}
            {user?.role === 'admin' && (
               <span className="px-4 py-1.5 text-sm font-bold text-slate-900 dark:text-white bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg">Admin Mode</span>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
           {/* Currency Selector */}
           <div className="hidden lg:flex items-center bg-gray-100 dark:bg-slate-800 rounded-lg p-1">
              <button onClick={() => setCurrency('USD')} className={`px-2 py-1 text-xs rounded font-bold ${currency === 'USD' ? 'bg-white dark:bg-slate-700 shadow dark:text-white' : 'text-gray-500 dark:text-slate-400'}`}>USD</button>
              <button onClick={() => setCurrency('EUR')} className={`px-2 py-1 text-xs rounded font-bold ${currency === 'EUR' ? 'bg-white dark:bg-slate-700 shadow dark:text-white' : 'text-gray-500 dark:text-slate-400'}`}>EUR</button>
              <button onClick={() => setCurrency('NGN')} className={`px-2 py-1 text-xs rounded font-bold ${currency === 'NGN' ? 'bg-white dark:bg-slate-700 shadow dark:text-white' : 'text-gray-500 dark:text-slate-400'}`}>NGN</button>
           </div>

           {/* Notifications Button */}
           <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-gray-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                title="Notifications"
              >
                <Bell size={20} />
                {notifications.some(n => !n.read) && (
                   <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden z-[100] animate-in slide-in-from-top-2">
                   <div className="p-3 border-b border-gray-100 dark:border-slate-800 font-bold text-sm flex justify-between">
                      <span>Notifications</span>
                      <button onClick={() => setNotifications([])} className="text-xs text-blue-600">Clear All</button>
                   </div>
                   <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-gray-400 text-xs">No new notifications</div>
                      ) : (
                        notifications.map(note => (
                           <div key={note.id} className="p-3 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors border-b border-gray-100 dark:border-slate-800 last:border-0">
                              <div className="flex items-start gap-2">
                                 <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${note.type === 'success' ? 'bg-green-500' : note.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                                 <div>
                                    <h4 className="text-sm font-semibold">{note.title}</h4>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{note.message}</p>
                                    <p className="text-[10px] text-gray-400 mt-1">{note.time}</p>
                                 </div>
                              </div>
                           </div>
                        ))
                      )}
                   </div>
                </div>
              )}
           </div>

           {/* Support Button */}
           <button 
             onClick={() => setIsSupportOpen(true)}
             className="text-gray-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hidden md:block"
             title="Help & Support"
           >
             <HelpCircle size={20} />
           </button>

           {user ? (
             <div className="flex items-center gap-3">
               <div 
                 onClick={() => setIsProfileOpen(true)}
                 className="hidden md:block text-right cursor-pointer hover:opacity-80 transition-opacity"
               >
                 <p className="text-sm font-bold leading-none">{user.name}</p>
                 <p className="text-xs text-gray-500 dark:text-slate-400 capitalize">{user.role}</p>
               </div>
               
               <button 
                 onClick={() => setIsHistoryOpen(true)}
                 className="bg-gray-100 dark:bg-slate-800 p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                 title="Trip History"
               >
                 <History size={18} />
               </button>

               <button onClick={handleLogout} className="bg-gray-100 dark:bg-slate-800 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                 <LogOut size={18} />
               </button>
             </div>
           ) : (
             <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsAuthOpen(true)}
                  className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                >
                  <Briefcase size={18} />
                  <span>Login</span>
                </button>
                <button 
                  onClick={() => setIsAuthOpen(true)}
                  className="bg-slate-900 dark:bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-slate-800 dark:hover:bg-blue-700 transition-colors"
                >
                  Sign In
                </button>
             </div>
           )}
           <button className="md:hidden text-slate-900 dark:text-white" onClick={() => setMenuOpen(!menuOpen)}>
             {menuOpen ? <X size={24} /> : <Menu size={24} />}
           </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 p-4 absolute top-16 left-0 right-0 z-40 shadow-lg animate-in slide-in-from-top-5 text-slate-900 dark:text-white">
           <div className="space-y-2">
            <button onClick={() => { setActiveTab(ServiceType.RIDE); setMenuOpen(false); }} className={`w-full text-left p-3 rounded-lg flex items-center justify-between ${activeTab === ServiceType.RIDE ? 'bg-gray-50 dark:bg-slate-800 font-semibold' : ''}`}><span className="flex items-center gap-3"><Car size={18} /> Ride</span></button>
            <button onClick={() => { setActiveTab(ServiceType.DELIVERY); setMenuOpen(false); }} className={`w-full text-left p-3 rounded-lg flex items-center justify-between ${activeTab === ServiceType.DELIVERY ? 'bg-gray-50 dark:bg-slate-800 font-semibold' : ''}`}><span className="flex items-center gap-3"><Package size={18} /> Delivery</span></button>
            <button onClick={() => { setActiveTab(ServiceType.EAT); setMenuOpen(false); }} className={`w-full text-left p-3 rounded-lg flex items-center justify-between ${activeTab === ServiceType.EAT ? 'bg-gray-50 dark:bg-slate-800 font-semibold' : ''}`}><span className="flex items-center gap-3"><Utensils size={18} /> Eat</span></button>
            <button onClick={() => { setActiveTab(ServiceType.FREIGHT); setMenuOpen(false); }} className={`w-full text-left p-3 rounded-lg flex items-center justify-between ${activeTab === ServiceType.FREIGHT ? 'bg-gray-50 dark:bg-slate-800 font-semibold' : ''}`}><span className="flex items-center gap-3"><Truck size={18} /> Freight</span></button>
            <button onClick={() => { setActiveTab(ServiceType.RENT); setMenuOpen(false); }} className={`w-full text-left p-3 rounded-lg flex items-center justify-between ${activeTab === ServiceType.RENT ? 'bg-gray-50 dark:bg-slate-800 font-semibold' : ''}`}><span className="flex items-center gap-3"><Key size={18} /> Rent</span></button>
            <button onClick={() => { setActiveTab(ServiceType.BUSINESS_FREIGHT); setMenuOpen(false); }} className={`w-full text-left p-3 rounded-lg flex items-center justify-between ${activeTab === ServiceType.BUSINESS_FREIGHT ? 'bg-gray-50 dark:bg-slate-800 font-semibold' : ''}`}><span className="flex items-center gap-3"><Briefcase size={18} /> Business</span></button>
            <hr className="my-2 border-gray-200 dark:border-slate-800"/>
            {user?.role === 'driver' && (
               <>
                 <button onClick={() => { setDriverTab('jobs'); setMenuOpen(false); }} className={`w-full text-left p-3 rounded-lg flex items-center justify-between ${driverTab === 'jobs' ? 'bg-gray-50 dark:bg-slate-800 font-semibold' : ''}`}><span className="flex items-center gap-3"><MapIcon size={18} /> Jobs</span></button>
                 <button onClick={() => { setDriverTab('wallet'); setMenuOpen(false); }} className={`w-full text-left p-3 rounded-lg flex items-center justify-between ${driverTab === 'wallet' ? 'bg-gray-50 dark:bg-slate-800 font-semibold' : ''}`}><span className="flex items-center gap-3"><DollarSign size={18} /> Wallet</span></button>
                 <hr className="my-2 border-gray-200 dark:border-slate-800"/>
               </>
            )}
             {user?.role === 'admin' && (
               <>
                 <button onClick={() => { setShowAdminDashboard(true); setMenuOpen(false); }} className={`w-full text-left p-3 rounded-lg flex items-center justify-between bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-semibold`}><span className="flex items-center gap-3"><Shield size={18} /> Admin Dashboard</span></button>
                 <hr className="my-2 border-gray-200 dark:border-slate-800"/>
               </>
            )}
            <button onClick={() => { setIsIntegrationsOpen(true); setMenuOpen(false); }} className="w-full text-left p-3 rounded-lg flex items-center justify-between"><span className="flex items-center gap-3"><Settings size={18} /> Integrations</span></button>
            <button onClick={() => { setIsSupportOpen(true); setMenuOpen(false); }} className="w-full text-left p-3 rounded-lg flex items-center justify-between"><span className="flex items-center gap-3"><HelpCircle size={18} /> Help & Support</span></button>
            {user && (
               <>
                <button onClick={() => { setIsProfileOpen(true); setMenuOpen(false); }} className="w-full text-left p-3 rounded-lg flex items-center justify-between"><span className="flex items-center gap-3"><UserIcon size={18} /> My Profile</span></button>
                <button onClick={() => { setIsHistoryOpen(true); setMenuOpen(false); }} className="w-full text-left p-3 rounded-lg flex items-center justify-between"><span className="flex items-center gap-3"><History size={18} /> Trip History</span></button>
               </>
            )}
           </div>
        </div>
      )}

      {user?.role === 'admin' && (
        <div className="bg-red-50 dark:bg-red-900/20 px-4 py-2 flex justify-center lg:justify-end gap-4 border-b border-red-100 dark:border-red-900/30">
           <button onClick={() => setShowAdminDashboard(false)} className={`text-xs font-bold px-3 py-1 rounded-full ${!showAdminDashboard ? 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-100' : 'text-red-500 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-800/50'}`}>User View</button>
           <button onClick={() => setShowAdminDashboard(true)} className={`text-xs font-bold px-3 py-1 rounded-full ${showAdminDashboard ? 'bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-100' : 'text-red-500 dark:text-red-300 hover:bg-red-100 dark:hover:bg-red-800/50'}`}>Admin Dashboard</button>
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
        onLogin={handleUserLogin} 
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
      <SupportModal 
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
      />
      {user && (
        <ProfileModal 
          isOpen={isProfileOpen} 
          onClose={() => setIsProfileOpen(false)}
          user={user}
          onUpdateUser={setUser}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
        />
      )}
    </div>
  );
};

export default App;