import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    // ✅ Safe to use `this.fb` here — it's initialized by Angular DI
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });}

  onSubmit() {
    if (this.loginForm.valid) {
      
      
      // this.authService.login(this.loginForm.value).subscribe({
      //   next: (res) => {
      //     console.log('Login Success:', res);
      //     // Store token or navigate
      //   },
      //   error: (err) => {
      //     console.error('Login Failed:', err);
      //   }
      // });
    }
  }
}
