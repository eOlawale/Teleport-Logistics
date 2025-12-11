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
  category: 'standard' | 'luxury' | 'delivery' | 'eco' | 'transit' | 'scooter';
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
export type VehicleFilter = 'all' | 'standard' | 'luxury' | 'delivery' | 'eco' | 'transit' | 'scooter';

export interface User {
  name: string;
  email: string;
  role: 'rider' | 'business';
  avatar?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'apple_pay';
  last4?: string;
  label: string;
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
}
