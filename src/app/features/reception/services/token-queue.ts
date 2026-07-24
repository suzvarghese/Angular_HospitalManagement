import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { TokenQueue } from '../models/token-queue';

@Injectable({
  providedIn: 'root'
})
export class TokenQueueService {

  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}receptionists/tokenqueues`;

  getAllTokenQueues(): Observable<TokenQueue[]> {
    return this.http.get<TokenQueue[]>(this.apiUrl);
  }

  getTokenQueueById(id: number): Observable<TokenQueue> {
    return this.http.get<TokenQueue>(`${this.apiUrl}/${id}`);
  }

}