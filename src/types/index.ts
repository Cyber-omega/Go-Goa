export type UserRole = 'customer' | 'driver';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  isFemale: boolean;
  emergencyContact?: {
    name: string;
    phone: string;
  };
  rating?: number;
  ratingCount?: number;
}

export type BookingStatus = 'pending' | 'accepted' | 'ongoing' | 'completed' | 'cancelled';
export type BookingType = 'full' | 'shuttle';

export interface Booking {
  id: string;
  customerId: string;
  customerName?: string;
  driverId?: string;
  driverName?: string;
  type: BookingType;
  status: BookingStatus;
  origin: string;
  destination: string;
  timestamp: any; // Firestore Timestamp
  isFemaleOnly: boolean;
  groupMembers: string[];
  price: number;
  maxSeats: number;
  occupiedSeats: number;
}

export interface UserLocation {
  userId: string;
  latitude: number;
  longitude: number;
  timestamp: any;
}
