import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Patient as PatientModel } from '../models/patient';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Patient {

  // Signal to store the currently searched patient
  patient = signal<PatientModel | null>(null);

  constructor(private httpClient: HttpClient) { }

  // 1 - Get all patients
  getAllPatients(): Observable<PatientModel[]> {
    return this.httpClient.get<PatientModel[]>(environment.apiUrl + 'receptionists/patients');
  }

  // 2 - Search patient by MMR ID or Phone
  searchPatient(searchValue: string): Observable<PatientModel> {
    return this.httpClient.get<PatientModel>(environment.apiUrl + 'receptionists/patients/' + searchValue);
  }

  // 3 - Register a new patient (ReceptionistController.AddPatient -> POST receptionists/patients)
  addPatient(patient: PatientModel): Observable<PatientModel> {
    return this.httpClient.post<PatientModel>(environment.apiUrl + 'receptionists/patients', patient);
  }
}