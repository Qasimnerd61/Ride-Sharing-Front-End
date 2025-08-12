import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  title = 'Welcome to the Ride Sharing App';
  roleForm: FormGroup;
  isLoggedIn: boolean = false;
  userName: string | null = null;
  constructor(private router: Router, private fb: FormBuilder) {
    this.roleForm = this.fb.group({
      role: ['Driver']  // default selection
    });
  }

ngOnInit(){
  const user = localStorage.getItem('user');
  if (user) {
    const parsed = JSON.parse(user);
    this.userName = parsed.firstName; // adjust based on stored object
    this.isLoggedIn = true;
  }
}
logout() {
  localStorage.removeItem('user'); // or token
  this.isLoggedIn = false;
  this.userName = null;
  // Optionally redirect
  this.router.navigate(['/login']);
}

  // Function to navigate to different routes programmatically
  navigateTo(route: string) {
    this.router.navigate([route], { queryParams: { role: this.roleForm.get('role')?.value } });
  }
  get selectedRole(): string {
    return this.roleForm.get('role')?.value;
  }
}
