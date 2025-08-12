export interface RideRequest {
  userId: number;
  userType: 'Driver' | 'Passenger';
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  encodedPolyline?: string;   // Optional, mainly for Drivers
  departureTime: string;           // ISO string or Date string
  availableSeats?: number;         // Nullable, mainly for Drivers
  status?: string;               // e.g. "Active"
  pickupLocationName?: string;
  dropoffLocationName?: string;
}