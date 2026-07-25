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

  // Search box - matches PatientController.Search(string q)
  searchTerm: string = '';
  searched = signal<boolean>(false);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');

  // All patients loaded once, then filtered client-side - reuses the SAME
  // getAllPatients() API already used by Patient List / Book Appointment.
  // NOTE: the Web API only exposes GetAllPatients() and a single-record
  // SelectPatientByIdOrPhoneAsync (PatientId or Phone, exact match only -
  // it does NOT match MmrId or PatientName). There is no equivalent of the
  // MVC app's multi-result SearchPatients(q). To replicate "search by Name,
  // MMR ID, or Phone" without changing the backend, this filters the same
  // already-loaded patient list client-side - it does not duplicate the
  // Book Appointment search, it reuses its data source (getAllPatients).
  private allPatients: Patient[] = [];
  results: Patient[] = [];

  // Inline "View" details toggle - avoids needing a separate Patient
  // Details page/route for this feature
  expandedPatientId = signal<number>(0);

  // Inline "History" toggle - lazy loads this patient's appointments + bills
  // using the existing Appointment / AppointmentBill services (no new API)
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
  ) { }

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

  // GET: Patients/Search (q) equivalent
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
      (p.PatientName ?? '').toLowerCase().includes(term) ||
      (p.Mmrid ?? '').toLowerCase().includes(term) ||
      (p.Phone ?? '').toLowerCase().includes(term)
    );

    this.searched.set(true);
  }

  // Action: View - toggle inline details for this row
  toggleView(patient: Patient): void {
    this.historyPatientId.set(0);
    this.expandedPatientId.set(
      this.expandedPatientId() === patient.PatientId ? 0 : patient.PatientId
    );
  }

  // Action: Book Appointment - navigate to the existing Book Appointment page
  // with the selected PatientId, so it can be preselected there.
  bookAppointment(patient: Patient): void {
    this.router.navigate(['/reception/appointments/book'], {
      queryParams: { patientId: patient.PatientId }
    });
  }

  // Action: History - toggle inline appointment/billing history for this row
  toggleHistory(patient: Patient): void {
    this.expandedPatientId.set(0);

    if (this.historyPatientId() === patient.PatientId) {
      this.historyPatientId.set(0);
      return;
    }

    this.historyPatientId.set(patient.PatientId);
    this.loadHistory(patient.PatientId);
  }

  private loadHistory(patientId: number): void {
    this.historyLoading.set(true);
    this.historyAppointments = [];
    this.historyBills = [];

    // Appointments for this patient (Appointment model already has PatientId)
    this.appointmentService.getAllAppointments().subscribe({
      next: (response: Appointment[]) => {
        this.allAppointments = response;
        this.historyAppointments = response.filter(a => a.PatientId === patientId);
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

        const appointmentIds = this.historyAppointments.map(a => a.AppointmentId);

        this.historyBills = response.filter(b =>
          appointmentIds.includes(b.AppointmentId)
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