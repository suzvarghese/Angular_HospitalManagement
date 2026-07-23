import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LoginResponse } from '../models/auth';

const TOKEN_KEY = 'auth_token';
const USER_ID_KEY = 'auth_userId';
const ROLE_ID_KEY = 'auth_roleId';
const DOCTOR_ID_KEY = 'auth_doctorId';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Signals so components can react to login/logout without manual refresh
  token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  userId = signal<number | null>(this.readNumber(USER_ID_KEY));
  roleId = signal<number | null>(this.readNumber(ROLE_ID_KEY));
  doctorId = signal<number | null>(this.readNumber(DOCTOR_ID_KEY));

  constructor(private httpClient: HttpClient) {}

  private readNumber(key: string): number | null {
    const value = localStorage.getItem(key);
    return value ? Number(value) : null;
  }

  // Calls GET /api/Logins/{username}/{password}
  // NOTE: credentials go in the URL because that's how LoginsController is
  // currently built (GET with route params, plaintext password compare on
  // the backend). Flagging as a security concern -- fine for now, but a
  // POST + hashed password would be the standard approach.
  login(username: string, password: string): Observable<LoginResponse> {
    return this.httpClient.get<LoginResponse>(
      environment.apiUrl + 'Logins/' + encodeURIComponent(username) + '/' + encodeURIComponent(password)
    );
  }

  // Called after a successful login response
  setSession(response: LoginResponse): void {
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_ID_KEY, response.userId.toString());
    localStorage.setItem(ROLE_ID_KEY, response.roleId.toString());
    this.token.set(response.token);
    this.userId.set(response.userId);
    this.roleId.set(response.roleId);
  }

  // Called after resolving UserId -> DoctorId via GET /doctor/by-user/{userId}
  setDoctorId(doctorId: number): void {
    localStorage.setItem(DOCTOR_ID_KEY, doctorId.toString());
    this.doctorId.set(doctorId);
  }

  isLoggedIn(): boolean {
    return !!this.token();
  }

  isDoctor(): boolean {
   return this.doctorId() !== null;
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
    localStorage.removeItem(ROLE_ID_KEY);
    localStorage.removeItem(DOCTOR_ID_KEY);
    this.token.set(null);
    this.userId.set(null);
    this.roleId.set(null);
    this.doctorId.set(null);
  }
}
