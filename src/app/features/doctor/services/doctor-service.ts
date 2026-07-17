import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AppointmentQueue } from '../models/appointment-queue';
import { ConsultationHistoryItem } from '../models/consultation-history-item';
import { AddConsultationRequest } from '../models/add-consultation-request';
import { AddConsultationResult } from '../models/add-consultation-result';
import { ConsultationDetail } from '../models/consultation-detail';
import { OrderLabTestsRequest } from '../models/order-lab-tests-request';
import { LabTest } from '../models/lab-test';
import { DoctorQualification } from '../models/doctor-qualification';
import { AvailableMedicine } from '../models/available-medicene';

@Injectable({
  providedIn: 'root',
})
export class DoctorService {
  // Signals for list-type state, consumed directly by components
  todayAppointments = signal<AppointmentQueue[]>([]);
  tomorrowAppointments = signal<AppointmentQueue[]>([]);
  patientHistory = signal<ConsultationHistoryItem[]>([]);
  labTests = signal<LabTest[]>([]);
  qualifications = signal<DoctorQualification[]>([]);
  availableMedicines = signal<AvailableMedicine[]>([]);

  constructor(private httpClient: HttpClient) {}

  // 1 -- Today's appointments for a doctor
  getTodayAppointments(doctorId: number): void {
    this.httpClient
      .get<AppointmentQueue[]>(environment.apiUrl + 'doctor/' + doctorId + '/appointments/today')
      .subscribe({
        next: (response) => this.todayAppointments.set(response),
        error: (error) => console.log('Today Appointments Error:', error),
      });
  }

  // 2 -- Tomorrow's appointments for a doctor
  getTomorrowAppointments(doctorId: number): void {
    this.httpClient
      .get<AppointmentQueue[]>(environment.apiUrl + 'doctor/' + doctorId + '/appointments/tomorrow')
      .subscribe({
        next: (response) => this.tomorrowAppointments.set(response),
        error: (error) => console.log('Tomorrow Appointments Error:', error),
      });
  }

  // 3 -- A patient's past consultation history (any doctor)
  getPatientHistory(patientId: number, excludeConsultationId?: number): void {
    let url = environment.apiUrl + 'doctor/patients/' + patientId + '/history';
    if (excludeConsultationId) {
      url += '?excludeConsultationId=' + excludeConsultationId;
    }

    this.httpClient.get<ConsultationHistoryItem[]>(url).subscribe({
      next: (response) => this.patientHistory.set(response),
      error: (error) => console.log('Patient History Error:', error),
    });
  }

  // 4 -- Add a consultation (diagnosis + prescription). Backend also
  // auto-computes the consultation fee and creates the AppointmentBill.
  addConsultation(request: AddConsultationRequest): Observable<AddConsultationResult> {
    return this.httpClient.post<AddConsultationResult>(
      environment.apiUrl + 'doctor/consultations',
      request
    );
  }

  // 5 -- Get full consultation details (+ any lab orders) by id
  getConsultationDetails(consultationId: number): Observable<ConsultationDetail> {
    return this.httpClient.get<ConsultationDetail>(
      environment.apiUrl + 'doctor/consultations/' + consultationId
    );
  }

  // 6 -- Order one or more lab tests against a consultation
  orderLabTests(request: OrderLabTestsRequest): Observable<{ labOrderId: number }> {
    return this.httpClient.post<{ labOrderId: number }>(
      environment.apiUrl + 'doctor/lab-tests/order',
      request
    );
  }

  // 7 -- Lab test catalog, for the test picker
  getLabTestsMaster(): void {
    this.httpClient.get<LabTest[]>(environment.apiUrl + 'doctor/lab-tests').subscribe({
      next: (response) => this.labTests.set(response),
      error: (error) => console.log('Lab Tests Error:', error),
    });
  }

  // 8 -- Doctor's qualifications (drives the consultation fee tier on the backend)
  getDoctorQualifications(doctorId: number): void {
    this.httpClient
      .get<DoctorQualification[]>(environment.apiUrl + 'doctor/' + doctorId + '/qualifications')
      .subscribe({
        next: (response) => this.qualifications.set(response),
        error: (error) => console.log('Qualifications Error:', error),
      });
  }

  // 9 -- Stock-aware medicine list, for the prescribing dropdown
  getAvailableMedicines(): void {
    this.httpClient
      .get<AvailableMedicine[]>(environment.apiUrl + 'doctor/medicines')
      .subscribe({
        next: (response) => this.availableMedicines.set(response),
        error: (error) => console.log('Available Medicines Error:', error),
      });
  }
}