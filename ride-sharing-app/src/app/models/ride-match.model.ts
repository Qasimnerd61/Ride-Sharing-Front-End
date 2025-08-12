export interface RideMatchDto {
  matchId: number;
  passengerRideId: number;
  driverRideId: number;
  fare: number | null;
  status: string;
  requestedAt: Date;
  passengerName: string;
  passengerPickup: string;
  passengerDropoff: string;
  passengerPhone: string;
}