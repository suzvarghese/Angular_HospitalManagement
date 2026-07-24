import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppointmentBill as AppointmentBillModel } from '../models/appointment-bill';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AppointmentBill {

  private apiUrl = environment.apiUrl + 'receptionists/appointmentbills';

  constructor(private httpClient: HttpClient) { }

  // Get all appointment bills
  getAllAppointmentBills(): Observable<AppointmentBillModel[]> {
    return this.httpClient.get<AppointmentBillModel[]>(this.apiUrl);
  }

  // Get a single appointment bill by id.
  // NOTE: GET receptionists/appointmentbills/{id} exists in the backend service/repository
  // but is currently commented out in ReceptionistController, so it isn't exposed over HTTP.
  // Until it's re-enabled, resolve the bill client-side from the "get all" endpoint.
  getAppointmentBillById(id: number): Observable<AppointmentBillModel | undefined> {
    return this.getAllAppointmentBills().pipe(
      map(bills => bills.find(b => b.AppointmentBillId === id))
    );
  }

  // Generate a new appointment bill
  generateBill(bill: AppointmentBillModel): Observable<any> {
    return this.httpClient.post<any>(this.apiUrl, bill);
  }
}