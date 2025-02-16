import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth';
import { SignupRequest } from '../models/user-info-request.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:7097/api/auth';
  constructor(private http: HttpClient) { }

  signup(user: SignupRequest): Observable<number> {
    return this.http.post<number>(`${this.apiUrl}/signup`, user,{
      headers: { 'Content-Type': 'application/json' }
    }).pipe(
      catchError(error => {
        console.error("Error from API:", error); // Log the error for debugging
        return throwError(() => new Error(error.message)); // Return error observable
      })
    );
  }

  googleSignIn(): Promise<void> {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    return signInWithPopup(auth, provider)
      .then((result) => {
        console.log('User signed in with Google', result.user);
      })
      .catch((error) => {
        console.error('Google sign-in error', error);
      });
  }
}
