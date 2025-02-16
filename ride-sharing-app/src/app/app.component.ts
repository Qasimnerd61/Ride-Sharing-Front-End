import { Component, OnInit } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NavigationExtras, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GoogleMapsModule } from '@angular/google-maps'; 
import { environment } from '../environments/environmet';
declare var google: any;

@Component({
  selector: 'app-root',
  imports: [CommonModule,RouterOutlet
  ],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent  {
  title = 'ride-sharing-app'
  constructor(private router: Router) {}

  // Function to navigate to different routes programmatically
  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
