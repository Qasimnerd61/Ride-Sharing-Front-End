import { Routes } from '@angular/router';
import { MapComponent } from './components/maps/map/map.component';
import { LoginComponent } from './components/auth/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { SignupComponent } from './components/auth/signup/signup.component';

export const routes: Routes = [
    { path: '', component: HomeComponent }, // Default route
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
  //  { path: 'dashboard', component: DashboardComponent },
    { path: 'map', component: MapComponent }, // Map-specific route
    { path: '**', redirectTo: '' } // Redirect unknown routes to home
  ];