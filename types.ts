export type Category = 'flight' | 'train' | 'bus' | 'food' | 'activity' | 'hotel' | 'shopping';

export interface Location {
  name: string;
  address?: string;
  lat?: number;
  lng?: number;
}

export interface ItineraryItem {
  id: string;
  time: string;
  endTime?: string;
  title: string;
  description?: string;
  category: Category;
  location?: Location;
  tags?: string[]; // e.g., "Must Eat", "Booking: 12345"
  price?: string;
  highlight?: boolean;
  participants?: string[]; // e.g. ['Rina', 'Ally'] or undefined for Everyone
}

export interface DaySchedule {
  date: string; // YYYY-MM-DD
  dayLabel: string; // "Day 1", "2/5 (Thu)"
  locationLabel: string; // "Takasaki"
  weatherForecast?: {
    temp: string;
    condition: 'sunny' | 'cloudy' | 'snow' | 'rain';
  };
  items: ItineraryItem[];
}

export interface Expense {
  id: string;
  item: string;
  amount: number;
  currency: 'JPY' | 'TWD';
  payer: string;
  date: string;
}

export interface HotelInfo {
  name: string;
  checkIn: string;
  checkOut: string;
  address: string;
  bookingRef?: string;
  notes?: string[];
}

export interface FlightInfo {
  flight: string;
  route: string;
  time: string;
  bookingRef?: string;
  passenger: string;
}