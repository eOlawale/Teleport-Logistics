import { ServiceProvider, Quote, BusinessMetric, Restaurant } from './types';

export const MOCK_QUOTES: Quote[] = [
  {
    id: '1',
    provider: ServiceProvider.UBER,
    price: 24.50,
    currency: 'USD',
    eta: 4,
    vehicleType: 'UberX',
    ecoScore: 4,
    surged: true,
    category: 'standard',
    canShare: true
  },
  {
    id: '2',
    provider: ServiceProvider.LYFT,
    price: 22.10,
    currency: 'USD',
    eta: 7,
    vehicleType: 'Standard',
    ecoScore: 5,
    surged: false,
    category: 'standard',
    canShare: true
  },
  {
    id: '3',
    provider: ServiceProvider.TELEPORT,
    price: 18.50,
    currency: 'USD',
    eta: 10,
    vehicleType: 'Teleport Eco Van',
    ecoScore: 9,
    surged: false,
    category: 'eco',
    canShare: true
  },
  {
    id: '10',
    provider: ServiceProvider.TELEPORT,
    price: 35.00,
    currency: 'USD',
    eta: 15,
    vehicleType: 'Teleport Water Taxi',
    ecoScore: 8,
    surged: false,
    category: 'water',
    canShare: true
  },
  {
    id: '11',
    provider: ServiceProvider.TELEPORT,
    price: 12.00,
    currency: 'USD',
    eta: 20,
    vehicleType: 'Cargo Bike',
    ecoScore: 10,
    surged: false,
    category: 'bicycle',
    canShare: false
  },
  {
    id: '12',
    provider: ServiceProvider.TELEPORT,
    price: 45.00,
    currency: 'USD',
    eta: 25,
    vehicleType: 'Heavy Logistics Van',
    ecoScore: 6,
    surged: false,
    category: 'van',
    canShare: false
  },
  {
    id: '4',
    provider: ServiceProvider.UBER,
    price: 45.00,
    currency: 'USD',
    eta: 3,
    vehicleType: 'Uber Black',
    ecoScore: 3,
    surged: true,
    category: 'luxury',
    canShare: false
  },
  {
    id: '5',
    provider: ServiceProvider.LYFT,
    price: 42.50,
    currency: 'USD',
    eta: 5,
    vehicleType: 'Lyft Lux',
    ecoScore: 4,
    surged: false,
    category: 'luxury',
    canShare: false
  },
  {
    id: '6',
    provider: ServiceProvider.TELEPORT,
    price: 14.00,
    currency: 'USD',
    eta: 15,
    vehicleType: 'Bike Courier',
    ecoScore: 10,
    surged: false,
    category: 'delivery',
    canShare: false
  },
  {
    id: '7',
    provider: ServiceProvider.UBER,
    price: 28.00,
    currency: 'USD',
    eta: 6,
    vehicleType: 'Uber Green',
    ecoScore: 8,
    surged: false,
    category: 'eco',
    canShare: true
  },
  {
    id: '8',
    provider: ServiceProvider.LIME,
    price: 8.50,
    currency: 'USD',
    eta: 1,
    vehicleType: 'Electric Scooter',
    ecoScore: 10,
    surged: false,
    category: 'scooter',
    canShare: false
  },
  {
    id: '9',
    provider: ServiceProvider.METRO,
    price: 2.50,
    currency: 'USD',
    eta: 18,
    vehicleType: 'Bus 42',
    ecoScore: 9,
    surged: false,
    category: 'transit',
    canShare: false
  }
];

export const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: 'r1',
    name: 'Burger & Co.',
    cuisine: 'American • Burgers',
    rating: 4.8,
    deliveryTimeRange: '15-25',
    baseDeliveryFee: 1.49,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=500&auto=format&fit=crop',
    address: '123 Mission St',
    lat: 37.7760,
    lng: -122.4180,
    promo: 'Free Delivery',
    priceLevel: '$$'
  },
  {
    id: 'r2',
    name: 'Sushi Zen',
    cuisine: 'Japanese • Sushi',
    rating: 4.9,
    deliveryTimeRange: '30-45',
    baseDeliveryFee: 3.99,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=500&auto=format&fit=crop',
    address: '456 Market St',
    lat: 37.7800,
    lng: -122.4200,
    priceLevel: '$$$'
  },
  {
    id: 'r3',
    name: 'La Taqueria Express',
    cuisine: 'Mexican • Tacos',
    rating: 4.5,
    deliveryTimeRange: '20-35',
    baseDeliveryFee: 0.99,
    image: 'https://images.unsplash.com/photo-1613514785940-daed07799d9b?q=80&w=500&auto=format&fit=crop',
    address: '789 Valencia St',
    lat: 37.7730,
    lng: -122.4220,
    promo: 'Buy 1 Get 1 Free',
    priceLevel: '$'
  },
  {
    id: 'r4',
    name: 'Green Leaf Salad',
    cuisine: 'Healthy • Vegan',
    rating: 4.7,
    deliveryTimeRange: '10-20',
    baseDeliveryFee: 2.49,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=500&auto=format&fit=crop',
    address: '321 Hayes St',
    lat: 37.7780,
    lng: -122.4150,
    priceLevel: '$$'
  },
  {
    id: 'r5',
    name: 'Napoli Pizza',
    cuisine: 'Italian • Pizza',
    rating: 4.6,
    deliveryTimeRange: '35-50',
    baseDeliveryFee: 1.99,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=500&auto=format&fit=crop',
    address: '555 Italy Ave',
    lat: 37.7790,
    lng: -122.4100,
    priceLevel: '$$'
  },
  {
    id: 'r6',
    name: 'Dragon Wok',
    cuisine: 'Chinese • Noodles',
    rating: 4.4,
    deliveryTimeRange: '25-40',
    baseDeliveryFee: 1.49,
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?q=80&w=500&auto=format&fit=crop',
    address: '888 China Ln',
    lat: 37.7710,
    lng: -122.4130,
    promo: '$5 off orders over $30',
    priceLevel: '$$'
  }
];

export const MOCK_BUSINESS_DATA: BusinessMetric[] = [
  { date: 'Mon', spend: 450, deliveries: 12, savings: 45 },
  { date: 'Tue', spend: 620, deliveries: 18, savings: 80 },
  { date: 'Wed', spend: 380, deliveries: 10, savings: 25 },
  { date: 'Thu', spend: 890, deliveries: 25, savings: 120 },
  { date: 'Fri', spend: 1200, deliveries: 35, savings: 210 },
  { date: 'Sat', spend: 300, deliveries: 5, savings: 10 },
  { date: 'Sun', spend: 150, deliveries: 3, savings: 5 },
];

export const MAP_PLACEHOLDER_URL = "https://picsum.photos/800/400?grayscale&blur=2";