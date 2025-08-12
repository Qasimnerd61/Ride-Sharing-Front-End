import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { environment } from '../../../../environments/environmet';
import { ActivatedRoute } from '@angular/router';
import { RideService } from '../../../services/ride.service';
import { RideRequest } from '../../../models/ride-request';
import { RideDto } from '../../../models/ride-dto.model';
import { RideMatchDto } from '../../../models/ride-match.model';
declare var google: any;

interface Coordinates {
  lat: number;
  lng: number;
}

@Component({
  selector: 'app-map',
  imports: [CommonModule, GoogleMapsModule
  ],
  standalone: true,
  templateUrl: './map.component.html',
  styleUrl: './map.component.scss'
})
export class MapComponent implements OnInit {
  title = 'ride-sharing-app';
  lat = 37.7749;  // Latitude (San Francisco)
  lng = -122.4194; // Longitude (San Francisco)
  zoom = 12;
  map: google.maps.Map | undefined;
  directionsService: google.maps.DirectionsService | undefined;
  directionsRenderer: google.maps.DirectionsRenderer | undefined;
  pickupLocation: string = '';
  dropoffLocation: string = '';
  mapInitialized = false;
  pickupCoordinates: Coordinates | undefined;
  dropoffCoordinates: Coordinates | undefined;
  role: string | null = null;
  userId: number = 0;
  availableRides: RideDto[] = [];
  pickupLocationName: string = '';
  dropoffLocationName: string = '';
  currentPassengerRideId: number = 0;
  pendingRequests: RideMatchDto[] = [];

  constructor(private route: ActivatedRoute, private rideService: RideService) {}

  ngOnInit(): void {
  this.role = this.route.snapshot.queryParamMap.get('role');
  const user = localStorage.getItem('user');
  if (user) {
    const parsed = JSON.parse(user);
    this.userId = parsed.id;
  }
  if (this.role === 'Driver') {
    this.fetchPendingRideRequests();
  }
  
  

  // 📍 Get current location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        console.log('Current Location:', this.lat, this.lng);
        this.loadGoogleMapsScript().then(() => {
          this.initializeMap();
          this.setupAutocompleteInputs();
        });
      },
      (error) => {
        console.warn('Geolocation failed or denied.', error);
        // Fallback to default location
        this.loadGoogleMapsScript().then(() => {
          this.initializeMap();
          this.setupAutocompleteInputs();
        });
      }
    );
  } else {
    console.warn('Geolocation not supported by this browser.');
    this.loadGoogleMapsScript().then(() => {
      this.initializeMap();
      this.setupAutocompleteInputs();
    });
  }
}

fetchPendingRideRequests() {
  const driverId = this.userId; // from token/localStorage

  this.rideService.getPendingRequestsForDriver(driverId).subscribe({
    next: (response: RideMatchDto[]) => {
      this.pendingRequests = response;
    },
    error: (err) => {
      console.error('Error fetching pending ride requests', err);
    }
  });
}

setupAutocompleteInputs() {
  this.initializeAutocomplete('pickup', (place) => {
    if (place.geometry?.location) {
      this.pickupCoordinates = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      };
    }
  });

  this.initializeAutocomplete('dropoff', (place) => {
    if (place.geometry?.location) {
      this.dropoffCoordinates = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      };
    }
  });
}

  loadGoogleMapsScript(): Promise<void> {
    return new Promise((resolve) => {
      if (typeof google !== 'undefined') {
        resolve();
      } else {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googleMapsApiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        document.head.appendChild(script);
      }
    });
  }

initializeMap() {
  const mapOptions = {
    center: { lat: this.lat, lng: this.lng },
    zoom: this.zoom,
  };
  const mapElement = document.getElementById('map') as HTMLElement;

  this.map = new google.maps.Map(mapElement, mapOptions);

  if (this.map) {
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.directionsRenderer.setMap(this.map);
    this.directionsService = new google.maps.DirectionsService();
    this.mapInitialized = true;

    // 👉 Add click-to-select-points feature
    let clickCount = 0;
    let pickupMarker: google.maps.Marker | null = null;
    let dropoffMarker: google.maps.Marker | null = null;

    this.map.addListener('click', (event: google.maps.MapMouseEvent) => {
      const latLng = event.latLng;
      if (!latLng) return;

      const coords = { lat: latLng.lat(), lng: latLng.lng() };

      if (clickCount === 0) {
        this.pickupCoordinates = coords;
        this.getPlaceNameFromCoords(coords.lat, coords.lng, (address) => {
          this.pickupLocationName = address;
        });
        if (pickupMarker) pickupMarker.setMap(null);
        pickupMarker = new google.maps.Marker({
          position: coords,
          map: this.map,
          label: 'A',
          title: 'Pickup Location'
        });
        clickCount++;
      } else if (clickCount === 1) {
        this.dropoffCoordinates = coords;
         this.getPlaceNameFromCoords(coords.lat, coords.lng, (address) => {
          this.dropoffLocationName = address;
        });
        if (dropoffMarker) dropoffMarker.setMap(null);
        dropoffMarker = new google.maps.Marker({
          position: coords,
          map: this.map,
          label: 'B',
          title: 'Dropoff Location'
        });
        clickCount++;

        // Optional: You can trigger route calculation directly
        // this.calculateRoute();
      } else {
        // Reset if more than 2 clicks
        clickCount = 0;
        this.pickupCoordinates = undefined;
        this.dropoffCoordinates = undefined;
        if (pickupMarker) pickupMarker.setMap(null);
        if (dropoffMarker) dropoffMarker.setMap(null);
      }
    });

  } else {
    console.error('Map instance is undefined.');
  }
}


  addMarker(position: Coordinates, title: string) {
  if (!this.map) return;

  new google.maps.Marker({
    position,
    map: this.map,
    title
  });
}

  initializeAutocomplete(inputId: string, callback: (place: google.maps.places.PlaceResult) => void) {
  const input = document.getElementById(inputId) as HTMLInputElement;
  const autocomplete = new google.maps.places.Autocomplete(input);
  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    console.log(`Place selected for ${inputId}:`, place); // <--- ADD THIS
    if (inputId === 'pickup') {
      this.pickupLocationName = place.formatted_address || place.name || '';
    } else if (inputId === 'dropoff') {
      this.dropoffLocationName = place.formatted_address || place.name || '';
    }

    if (place.geometry?.location) {
      callback(place);
    } else {
      console.warn(`No geometry for ${inputId}:`, place);
    }
  });
}

getPlaceNameFromCoords(lat: number, lng: number, callback: (address: string) => void) {
  const geocoder = new google.maps.Geocoder();
  const latlng = { lat, lng };

  geocoder.geocode({ location: latlng }, (results, status) => {
    if (status === google.maps.GeocoderStatus.OK && results[0]) {
      callback(results[0].formatted_address);
    } else {
      console.warn('Reverse geocoding failed:', status);
      callback('Unknown Location');
    }
  });
}

 calculateRoute() {
  if (!this.mapInitialized) {
    alert('Map is not initialized yet.');
    return;
  }

  if (!this.pickupCoordinates || !this.dropoffCoordinates) {
    alert('Please select both pickup and dropoff locations!');
    return;
  }

  const request: google.maps.DirectionsRequest = {
    origin: this.pickupCoordinates,
    destination: this.dropoffCoordinates,
    travelMode: google.maps.TravelMode.DRIVING
  };

  this.directionsService?.route(request, (result, status) => {
    if (status === google.maps.DirectionsStatus.OK && result) {
      this.directionsRenderer?.setDirections(result);
      const encodedPolyline = result.routes[0].overview_polyline;

      const ridePayload: RideRequest = {
        userId: this.userId,
        userType: this.role === 'Driver' ? 'Driver' : 'Passenger',
        startLat: this.pickupCoordinates.lat,
        startLng: this.pickupCoordinates.lng,
        endLat: this.dropoffCoordinates.lat,
        endLng: this.dropoffCoordinates.lng,
        encodedPolyline: this.role === 'Driver' ? encodedPolyline : null,
        departureTime: new Date().toISOString(),
        availableSeats: this.role === 'Driver' ? 3 : null,
        status: 'Active',
        pickupLocationName: this.pickupLocationName,
        dropoffLocationName: this.dropoffLocationName
      };

      this.rideService.saveRide(ridePayload).subscribe({
        next: (res) => {
          alert(`${this.role} ride saved successfully!`);
          console.log('Save response:', res);

          // If passenger, fetch available rides
          if (this.role === 'Passenger') {
            this.currentPassengerRideId = res; // Save ride ID for requestRide()
            this.fetchAvailableRidesForPassenger(); // 🔁 Reuse!
          }
        },
        error: (err) => {
          alert(`Failed to save ${this.role} ride.`);
          console.error('Save error:', err);
        }
      });
    } else {
      alert('Could not display directions. Please try again.');
    }
  });
}

fetchAvailableRidesForPassenger(): void {
  const matchingRequest = {
    startLat: this.pickupCoordinates.lat,
    startLng: this.pickupCoordinates.lng,
    endLat: this.dropoffCoordinates.lat,
    endLng: this.dropoffCoordinates.lng,
    bufferDistance: 5000,
    departureTime: new Date().toISOString(),
    passengerRideId : this.currentPassengerRideId
  };

  this.rideService.getAvailableRides(matchingRequest).subscribe({
    next: (rides) => {
      console.log('Available rides:', rides);
      this.availableRides = rides;
      if (rides.length === 0) {
        alert('No matching driver rides found.');
      }
    },
    error: (err) => {
      console.error('Error getting available rides', err);
      alert('Failed to get available rides.');
    }
  });
}

requestRide(driverRideId: number) {
  const passengerRideId = this.currentPassengerRideId; // You should store this when the passenger creates/selects their ride

  const rideMatchRequest = {
    driverRideId: driverRideId,
    passengerRideId: passengerRideId,
    fare: null // or calculate if needed
  };

  this.rideService.saveRideMatch(rideMatchRequest).subscribe({
    next: (res: any) => {
      alert('Ride request sent successfully!');
      // Optionally update UI or mark as "Requested"
    },
    error: (err) => {
      console.error('Error sending ride request', err);
      alert('Failed to send ride request.');
    }
  });
}
searchAgain(): void {
  if (this.role === 'Passenger') {
    this.fetchAvailableRidesForPassenger();
  } else if (this.role === 'Driver') {
    this.fetchPendingRideRequests();
  }
}
acceptRequest(matchId: number, phone: string) {
  this.rideService.updateRideMatchStatus(matchId, 'Accepted').subscribe({
    next: () => {
      alert(`Ride accepted.\n📞 Please contact passenger at: ${phone}`);

      this.fetchPendingRideRequests(); // Refresh list
    },
    error: (err) => console.error('Error accepting ride', err)
  });
}
rejectRequest(matchId: number) {
  this.rideService.updateRideMatchStatus(matchId, 'Rejected').subscribe({
    next: () => {
      alert('Ride rejected.');
      this.fetchPendingRideRequests(); // Refresh list
    },
    error: (err) => console.error('Error accepting ride', err)
  });
}



}