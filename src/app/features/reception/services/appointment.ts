import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Appointment as AppointmentModel } from '../models/appointment';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Appointment {

  private apiUrl = environment.apiUrl + 'receptionists/appointments';

  constructor(private httpClient: HttpClient) { }

  // Get all appointments
  getAllAppointments(): Observable<AppointmentModel[]> {
    return this.httpClient.get<AppointmentModel[]>(this.apiUrl);
  }

  // Get a single appointment by id (used by Bill/Reschedule screens)
  getAppointmentById(id: number): Observable<AppointmentModel> {
    return this.httpClient.get<AppointmentModel>(`${this.apiUrl}/${id}`);
  }

  // Book a new appointment
  bookAppointment(appointment: AppointmentModel): Observable<any> {
    return this.httpClient.post<any>(this.apiUrl, appointment);
  }

  // Update an appointment (used for both Reschedule and Cancel)
  updateAppointment(id: number, appointment: AppointmentModel): Observable<any> {
    return this.httpClient.put<any>(`${this.apiUrl}/${id}`, appointment);
  }
}





