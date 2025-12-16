export enum ServiceProvider {
  UBER = 'Uber',
  LYFT = 'Lyft',
  TELEPORT = 'Teleport Fleet',
  LIME = 'Lime',
  METRO = 'City Metro'
}

export enum ServiceType {
  RIDE = 'RIDE',
  DELIVERY = 'DELIVERY',
  EAT = 'EAT',
  FREIGHT = 'FREIGHT',
  RENT = 'RENT',
  BUSINESS_FREIGHT = 'BUSINESS_FREIGHT'
}

export interface Quote {
  id: string;
  provider: ServiceProvider;
  price: number;
  currency: string;
  eta: number; // minutes
  vehicleType: string;
  ecoScore: number; // 1-10
  surged: boolean;
  category: 'standard' | 'luxury' | 'delivery' | 'eco' | 'transit' | 'scooter' | 'water' | 'bicycle' | 'van';
  canShare?: boolean;
  badges?: string[]; // For competitive advantage (Fastest, Cheapest)
  originalPrice?: number; // To show discounts
}

export interface Location {
  address: string;
  lat?: number;
  lng?: number;
}

export interface BusinessMetric {
  date: string;
  spend: number;
  deliveries: number;
  savings: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model' | 'driver';
  text: string;
  isThinking?: boolean;
  timestamp?: number;
}

export type SortOption = 'price' | 'eta' | 'eco';
export type VehicleFilter = 'all' | 'standard' | 'luxury' | 'delivery' | 'eco' | 'transit' | 'scooter' | 'water' | 'van';

export interface User {
  name: string;
  email: string;
  role: 'rider' | 'business' | 'driver' | 'admin';
  avatar?: string;
  kycStatus: 'pending' | 'verified' | 'unverified';
  currency: string;
  referralCode?: string;
  credits?: number;
}

export interface WalletTransaction {
  id: string;
  date: string;
  amount: number;
  type: 'earning' | 'withdrawal' | 'bonus';
  status: 'completed' | 'pending';
}

export interface TripHistoryItem {
  id: string;
  date: string;
  provider: ServiceProvider;
  type: string;
  price: number;
  status: 'Completed' | 'Cancelled' | 'In Progress';
  from: string;
  to: string;
  rating?: number; // 1-5
}

export interface SupportTicket {
  id: string;
  user: string;
  type: 'complaint' | 'inquiry' | 'claim' | 'refund';
  subject: string;
  status: 'open' | 'resolved' | 'pending';
  date: string;
}

export interface Campaign {
  id: string;
  name: string;
  target: 'riders' | 'drivers' | 'all';
  type: 'discount' | 'bonus' | 'communication';
  status: 'active' | 'scheduled' | 'ended';
  reach: number;
}