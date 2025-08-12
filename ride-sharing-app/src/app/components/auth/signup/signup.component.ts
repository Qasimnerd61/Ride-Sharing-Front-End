import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { SignupRequest } from '../../../models/user-info-request.model';

@Component({
  selector: 'app-signup',
  imports: [CommonModule,NgIf,ReactiveFormsModule],
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
  signupForm: FormGroup;
  isSubmitted = false;
  
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.signupForm = this.fb.group({
      fName: ['', [Validators.required, Validators.minLength(1)]],
      lName: ['', [Validators.required, Validators.minLength(1)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phoneNo: [
    '',
    [
      Validators.required,
      Validators.pattern('^[0-9]{10,15}$'),
      Validators.minLength(10)
    ]
  ]
    });
  }

  // passwordMatchValidator(form: FormGroup) {
  //   return form.get('password')?.value === form.get('confirmPassword')?.value 
  //     ? null 
  //     : { mismatch: true };
  // }

  onSubmit() {
    this.isSubmitted = true;
      const signupData: SignupRequest = this.signupForm.value;
    this.authService.signup( signupData )
      .subscribe(response => {
        alert('Signup successful!');
        this.router.navigate(['/login']);
      }, error => {
        alert('Signup failed!');
      });
  
}

  signInWithGoogle() {
    const auth = getAuth();  // Get the Firebase Auth instance
    const provider = new GoogleAuthProvider();  // Create a GoogleAuthProvider instance

    signInWithPopup(auth, provider)  // Sign in with the popup method
      .then((result) => {
        console.log('User signed in:', result.user);
        this.router.navigate(['/dashboard']);  // Redirect to dashboard after successful sign-in
      })
      .catch((error) => {
        console.error('Error during Google sign-in:', error);  // Handle errors
      });
  }

  get f() {
    return this.signupForm.controls;
  }
}
