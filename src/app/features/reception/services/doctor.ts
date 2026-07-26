import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Doctor as DoctorModel } from '../models/doctor';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Doctor {

  // Signal to store available doctors
  doctors = signal<DoctorModel[]>([]);

  constructor(private httpClient: HttpClient) { }

  // Get all doctors
  getAllDoctors(): Observable<DoctorModel[]> {
    return this.httpClient.get<DoctorModel[]>(environment.apiUrl + 'receptionists/doctors');
  }
}