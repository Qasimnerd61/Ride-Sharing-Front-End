import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { environment } from '../../../../environments/environmet';
declare var google: any;

@Component({
  selector: 'app-map',
  imports: [CommonModule, GoogleMapsModule
  ],
  providers: [
    {
      provide: 'AIzaSyD4Btq1LijokB-BaIjsRAnpPbPdGVnw6yE',  // Provide API key to the module
      useValue: environment.googleMapsApiKey  // Use the key from environment.ts
    }
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
  pickupCoordinates: google.maps.LatLng | undefined;
  dropoffCoordinates: google.maps.LatLng | undefined;

  ngOnInit(): void {
    this.loadGoogleMapsScript().then(() => {
      this.initializeMap();
      this.initializeAutocomplete('pickup', (place) => {
        this.pickupCoordinates = place.geometry?.location;
      });
      this.initializeAutocomplete('dropoff', (place) => {
        this.dropoffCoordinates = place.geometry?.location;
      });
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
  
    // Create a new Google Map instance
    this.map = new google.maps.Map(mapElement, mapOptions);
  
    // Initialize directionsRenderer and directionsService
    if (this.map) {
      this.directionsRenderer = new google.maps.DirectionsRenderer();
      this.directionsRenderer?.setMap(this.map);
      this.directionsService = new google.maps.DirectionsService();
      this.mapInitialized = true;  // Flag to indicate initialization
    } else {
      console.error('Map instance is undefined.');
    }
  }
  

  initializeAutocomplete(inputId: string, callback: (place: google.maps.places.PlaceResult) => void) {
    const input = document.getElementById(inputId) as HTMLInputElement;
    const autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.geometry?.location) {
        callback(place);
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
      } else {
        alert('Could not display directions. Please try again.');
      }
    });
  }
}
