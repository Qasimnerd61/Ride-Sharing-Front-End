import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RideRequest } from '../models/ride-request';
import { RideDto } from '../models/ride-dto.model';
import { RideMatchDto } from '../models/ride-match.model';

@Injectable({
  providedIn: 'root'
})
export class RideService {
  private apiUrl = 'http://localhost:5236/api';  // Change this to your actual backend URL

  constructor(private http: HttpClient) {}

  saveRide(ridePayload: RideRequest): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/Rides`, ridePayload);
  }
  getAvailableRides(requestBody: any): Observable<RideDto[]> {
    return this.http.post<RideDto[]>(`${this.apiUrl}/rides/available`, requestBody);
  }
  saveRideMatch(ridePayload: any): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/rides/ride-match`, ridePayload);
  }
  getPendingRequestsForDriver(driverId: number): Observable<RideMatchDto[]> {
    return this.http.get<RideMatchDto[]>(`${this.apiUrl}/rides/pending/driver/${driverId}`);
  }
  updateRideMatchStatus(matchId: number, status: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/rides/update-status?matchId=${matchId}&newStatus=${status}`, {});
}
}
