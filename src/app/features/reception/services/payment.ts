import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

import { Payment } from '../models/payment';

@Injectable({
  providedIn: 'root'
})
export class PaymentApiService {   // Chnanged Name PaymentService

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}receptionists/payments`;

  constructor() { }

  getAllPayments(): Observable<Payment[]> {
    return this.http.get<Payment[]>(this.apiUrl);
  }

  getPaymentById(id: number): Observable<Payment> {
    return this.http.get<Payment>(`${this.apiUrl}/${id}`);
  }

  addPayment(payment: Payment): Observable<Payment> {
    return this.http.post<Payment>(this.apiUrl, payment);
  }
}



