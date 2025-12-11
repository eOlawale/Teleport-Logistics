import { ServiceProvider, Quote, BusinessMetric } from './types';

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
    category: 'standard'
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
    category: 'standard'
  },
  {
    id: '3',
    provider: ServiceProvider.TELEPORT,
    price: 19.99,
    currency: 'USD',
    eta: 12,
    vehicleType: 'Eco Van',
    ecoScore: 9,
    surged: false,
    category: 'eco'
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
    category: 'luxury'
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
    category: 'luxury'
  },
  {
    id: '6',
    provider: ServiceProvider.TELEPORT,
    price: 15.00,
    currency: 'USD',
    eta: 15,
    vehicleType: 'Bike Courier',
    ecoScore: 10,
    surged: false,
    category: 'delivery'
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
    category: 'eco'
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
    category: 'scooter'
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
    category: 'transit'
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
