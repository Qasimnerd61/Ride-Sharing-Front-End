import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  title = 'Welcome to the Ride Sharing App';
  constructor(private router: Router) {}

  // Function to navigate to different routes programmatically
  navigateTo(route: string) {
    this.router.navigate([route]);
  }
}
