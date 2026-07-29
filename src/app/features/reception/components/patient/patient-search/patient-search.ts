import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Patient } from '../../../models/patient';
import { Patient as PatientService } from '../../../services/patient';
import { Appointment } from '../../../models/appointment';
import { Appointment as AppointmentService } from '../../../services/appointment';
import { AppointmentBill } from '../../../models/appointment-bill';
import { AppointmentBill as AppointmentBillService } from '../../../services/appointment-bill';

@Component({
  selector: 'app-patient-search',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './patient-search.html',
  styleUrl: './patient-search.scss',
})
export class PatientSearch implements OnInit {

  searchTerm: string = '';
  searched = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');

  private allPatients: Patient[] = [];
  results: Patient[] = [];

  expandedPatientId = signal<number>(0);

  historyPatientId = signal<number>(0);
  historyLoading = signal<boolean>(false);
  historyAppointments: Appointment[] = [];
  historyBills: AppointmentBill[] = [];
  private allAppointments: Appointment[] = [];
  private allBills: AppointmentBill[] = [];

  constructor(
    private patientService: PatientService,
    private appointmentService: AppointmentService,
    private appointmentBillService: AppointmentBillService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading.set(true);

    this.patientService.getAllPatients().subscribe({
      next: (response: Patient[]) => {
        this.allPatients = response;
        this.isLoading.set(false);
      },
      error: (err: any) => {
        console.log(err);
        this.isLoading.set(false);
        this.errorMessage.set('Failed to load patients. Please try again.');
      }
    });
  }

  onSearch(): void {
    this.expandedPatientId.set(0);
    this.historyPatientId.set(0);

    const term = (this.searchTerm ?? '').trim().toLowerCase();

    if (!term) {
      this.results = [];
      this.searched.set(false);
      return;
    }

    this.results = this.allPatients.filter(p =>
      (p.patientName ?? '').toLowerCase().includes(term) ||
      (p.mmrid ?? '').toLowerCase().includes(term) ||
      (p.phone ?? '').toLowerCase().includes(term)
    );

    this.searched.set(true);
  }

  toggleView(patient: Patient): void {
    this.historyPatientId.set(0);
    this.expandedPatientId.set(
      this.expandedPatientId() === patient.patientId ? 0 : patient.patientId
    );
  }

  bookAppointment(patient: Patient): void {
    this.router.navigate(['/reception/appointments/book'], {
      queryParams: { patientId: patient.patientId }
    });
  }

  toggleHistory(patient: Patient): void {
    this.expandedPatientId.set(0);

    if (this.historyPatientId() === patient.patientId) {
      this.historyPatientId.set(0);
      return;
    }

    this.historyPatientId.set(patient.patientId);
    this.loadHistory(patient.patientId);
  }

  private loadHistory(patientId: number): void {
    this.historyLoading.set(true);
    this.historyAppointments = [];
    this.historyBills = [];

    this.appointmentService.getAllAppointments().subscribe({
      next: (response: Appointment[]) => {
        this.allAppointments = response;
        this.historyAppointments = response.filter(a => a.patientId === patientId);
        this.loadBillsForHistory();
      },
      error: (err: any) => {
        console.log(err);
        this.historyLoading.set(false);
      }
    });
  }

  private loadBillsForHistory(): void {
    this.appointmentBillService.getAllAppointmentBills().subscribe({
      next: (response: AppointmentBill[]) => {
        this.allBills = response;

        const appointmentIds = this.historyAppointments.map(a => a.appointmentId);

        this.historyBills = response.filter(b =>
          appointmentIds.includes(b.appointmentId)
        );

        this.historyLoading.set(false);
      },
      error: (err: any) => {
        console.log(err);
        this.historyLoading.set(false);
      }
    });
  }
}