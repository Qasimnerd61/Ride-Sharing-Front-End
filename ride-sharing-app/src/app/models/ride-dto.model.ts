export interface RideDto {
  rideId: number;
  userId: number;
  userType: string;
  departureTime: string; // or Date if you parse it
  availableSeats: number | null;
  status: string;
  userName: string; // Name of the user who created the ride
  PhoneNumber: string

  // Add any other fields you might include
}