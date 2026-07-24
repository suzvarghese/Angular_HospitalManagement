import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';

import { AppointmentBill } from '../../../models/appointment-bill';
import { AppointmentBill as AppointmentBillService } from '../../../services/appointment-bill';
import { Appointment } from '../../../models/appointment';
import { Appointment as AppointmentService } from '../../../services/appointment';
import { Patient } from '../../../models/patient';
import { Patient as PatientService } from '../../../services/patient';
import { Doctor } from '../../../models/doctor';
import { Doctor as DoctorService } from '../../../services/doctor';
import { Payment } from '../../../models/payment';
import { PaymentApiService as PaymentService } from '../../../services/payment';
import { slotToDate, SLOT_INTERVAL_MINUTES } from '../../../utils/appointment-slots';

// A Pending Appointment Bill, joined in-memory with its Appointment, Patient
// and Doctor - built once from the 4 existing services, no extra API calls.
interface PendingBillRow {
  AppointmentBillId: number;
  AppointmentId: number;
  PatientId: number;
  PatientName: string;
  Mmrid: string;
  DoctorId: number;
  DoctorName: string;
  AppointmentDate: string;
  TimeSlot: string;
  TimeRangeLabel: string;   // e.g. "11:15 AM - 11:30 AM"
  DateLabel: string;        // e.g. "23 Jul"
  TotalAmount: number;
  PaymentStatus: string;
  DisplayLabel: string;     // full dropdown row text
}

@Component({
  selector: 'app-collect-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './collect-payment.html',
  styleUrl: './collect-payment.scss',
})
export class CollectPayment implements OnInit {

  private static readonly MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Raw data (loaded once)
  private allBills: AppointmentBill[] = [];
  private allAppointments: Appointment[] = [];
  private allPatients: Patient[] = [];
  private allDoctors: Doctor[] = [];

  // Joined, Pending-only rows for the dropdown
  pendingBillRows: PendingBillRow[] = [];

  // Live search (Patient Name / MMR ID)
  searchTerm: string = '';

  // Selection
  selectedBillId: number = 0;
  selectedRow: PendingBillRow | null = null;

  // Payment fields
  paymentMethod: string = '';

  // State
  isLoadingBills = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  successMessage = signal<string>('');
  errorMessage = signal<string>('');

  // Completed payment + the joined row it was for (used to render the receipt)
  completedPayment = signal<Payment | null>(null);
  receiptRow: PendingBillRow | null = null;

  // billId to auto-select, passed in via ?billId= from the bill-generate page
  private preselectBillId: number = 0;

  constructor(
    private appointmentBillService: AppointmentBillService,
    private appointmentService: AppointmentService,
    private patientService: PatientService,
    private doctorService: DoctorService,
    private paymentService: PaymentService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.preselectBillId = Number(this.route.snapshot.queryParamMap.get('billId')) || 0;
    this.loadAll();
  }

  // Live filter over the already-joined Pending rows - no API calls
  get filteredBillRows(): PendingBillRow[] {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      return this.pendingBillRows;
    }
    return this.pendingBillRows.filter(row =>
      row.PatientName.toLowerCase().includes(term) ||
      row.Mmrid.toLowerCase().includes(term)
    );
  }

  // Load Bills + Appointments + Patients + Doctors once, then join them.
  // These are the ONLY 4 services this component uses.
  loadAll(): void {
    this.isLoadingBills.set(true);
    this.errorMessage.set('');

    forkJoin({
      bills: this.appointmentBillService.getAllAppointmentBills(),
      appointments: this.appointmentService.getAllAppointments(),
      patients: this.patientService.getAllPatients(),
      doctors: this.doctorService.getAllDoctors(),
    }).subscribe({
      next: ({ bills, appointments, patients, doctors }) => {
        this.allBills = bills || [];
        this.allAppointments = appointments || [];
        this.allPatients = patients || [];
        this.allDoctors = doctors || [];

        this.buildPendingBillRows();
        this.isLoadingBills.set(false);

        // Auto-select the bill passed from the bill-generate page, if any
        if (this.preselectBillId) {
          this.selectedBillId = this.preselectBillId;
          this.onBillChange();
        }
      },
      error: (err: any) => {
        console.log(err);
        this.isLoadingBills.set(false);
        this.errorMessage.set('Failed to load appointment bills');
      }
    });
  }

  // Reload only the bill list after a payment (Appointments/Patients/Doctors
  // don't change here, so they are reused from memory - no duplicate calls).
  private reloadBillsOnly(): void {
    this.appointmentBillService.getAllAppointmentBills().subscribe({
      next: (bills: AppointmentBill[]) => {
        this.allBills = bills || [];
        this.buildPendingBillRows();
      },
      error: (err: any) => console.log(err)
    });
  }

  // Join: AppointmentBill -> Appointment -> Patient -> Doctor
  private buildPendingBillRows(): void {
    const appointmentsById = new Map(this.allAppointments.map(a => [a.AppointmentId, a]));
    const patientsById = new Map(this.allPatients.map(p => [p.PatientId, p]));
    const doctorsById = new Map(this.allDoctors.map(d => [d.DoctorId, d]));

    this.pendingBillRows = this.allBills
      .filter(bill => bill.PaymentStatus === 'Pending')
      .map(bill => {
        const appt = appointmentsById.get(bill.AppointmentId);
        const patient = appt ? patientsById.get(appt.PatientId) : undefined;
        const doctor = appt ? doctorsById.get(appt.DoctorId) : undefined;

        const patientName = patient?.PatientName || appt?.PatientName || 'Unknown Patient';
        const mmrid = patient?.Mmrid || '-';
        const doctorName = doctor?.DoctorName || appt?.DoctorName || 'Unknown Doctor';
        const appointmentDate = appt?.AppointmentDate || '';
        const timeSlot = appt?.TimeSlot || '';
        const timeRangeLabel = this.getSlotRangeLabel(appointmentDate, timeSlot);
        const dateLabel = this.formatShortDate(appointmentDate);
        const amountLabel = Number.isInteger(bill.TotalAmount)
          ? bill.TotalAmount.toString()
          : bill.TotalAmount.toFixed(2);

        const row: PendingBillRow = {
          AppointmentBillId: bill.AppointmentBillId,
          AppointmentId: bill.AppointmentId,
          PatientId: appt?.PatientId ?? patient?.PatientId ?? 0,
          PatientName: patientName,
          Mmrid: mmrid,
          DoctorId: appt?.DoctorId ?? doctor?.DoctorId ?? 0,
          DoctorName: doctorName,
          AppointmentDate: appointmentDate,
          TimeSlot: timeSlot,
          TimeRangeLabel: timeRangeLabel,
          DateLabel: dateLabel,
          TotalAmount: bill.TotalAmount,
          PaymentStatus: bill.PaymentStatus,
          DisplayLabel: `${patientName} | ${mmrid} | Dr. ${doctorName} | ${dateLabel} | ${timeRangeLabel} | \u20B9${amountLabel}`
        };

        return row;
      });
  }

  // "11:15 AM" -> "11:15 AM - 11:30 AM" (same fixed 15-min interval Booking/
  // Reschedule already use, reused here read-only from appointment-slots.ts)
  private getSlotRangeLabel(appointmentDate: string, timeSlot: string): string {
    if (!appointmentDate || !timeSlot) {
      return timeSlot || '';
    }
    const start = slotToDate(appointmentDate, timeSlot);
    const end = new Date(start.getTime() + SLOT_INTERVAL_MINUTES * 60000);
    return `${timeSlot} - ${this.formatTo12Hour(end)}`;
  }

  private formatTo12Hour(date: Date): string {
    let hour = date.getHours();
    const minute = date.getMinutes();
    const period = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    if (hour === 0) hour = 12;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${period}`;
  }

  // "yyyy-MM-dd" -> "23 Jul" (parsed manually to avoid timezone shifting)
  private formatShortDate(dateStr: string): string {
    if (!dateStr) return '';
    const [, m, d] = dateStr.split('-').map(Number);
    return `${d} ${CollectPayment.MONTHS[m - 1]}`;
  }

  // Select Appointment Bill
  // onBillChange(): void {
  //   this.errorMessage.set('');

  //   this.selectedRow = this.pendingBillRows.find(
  //     row => row.AppointmentBillId === Number(this.selectedBillId)
  //   ) ?? null;

  //   this.paymentMethod = '';
  // }
  onBillChange(): void {
    this.errorMessage.set('');
  
    const row = this.pendingBillRows.find(
      r => r.AppointmentBillId === Number(this.selectedBillId)
    );
  
    if (row) {
      this.selectBill(row);
    }
  }
  selectBill(row: PendingBillRow): void {
    this.selectedBillId = row.AppointmentBillId;
    this.selectedRow = row;
    this.paymentMethod = '';
  
    setTimeout(() => {
      document.getElementById('paymentSection')
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
    });
  }

  // Submit Payment
  collectPayment(paymentForm: NgForm): void {
    // Guard against duplicate submissions (double-click / double Enter)
    if (this.isSaving()) {
      return;
    }

    this.successMessage.set('');
    this.errorMessage.set('');

    if (!this.selectedRow) {
      this.errorMessage.set('Please select an appointment bill.');
      return;
    }

    // Duplicate-payment guard: re-check the bill is still Pending in case its
    // status changed since the dropdown was loaded (e.g. paid in another tab).
    if (this.selectedRow.PaymentStatus !== 'Pending') {
      this.errorMessage.set('This appointment bill has already been paid.');
      this.reloadBillsOnly();
      return;
    }

    if (paymentForm.invalid) {
      this.errorMessage.set('Please select a payment method.');
      Object.values(paymentForm.controls).forEach(control => control.markAsTouched());
      return;
    }

    if (!this.paymentMethod) {
      this.errorMessage.set('Please select a payment method.');
      return;
    }

    const payment: Payment = new Payment();
    payment.ReceptionistId = 1;
    payment.AppointmentBillId = this.selectedRow.AppointmentBillId;
    payment.PaidAmount = this.selectedRow.TotalAmount;   // not user-editable
    payment.PaymentMethod = this.paymentMethod;
    payment.PaidAt = new Date().toISOString();
    payment.Status = 'Paid';

    this.isSaving.set(true);

    const rowForReceipt = this.selectedRow;

    this.paymentService.addPayment(payment).subscribe({
      next: (response: Payment) => {
        this.isSaving.set(false);
        this.successMessage.set('Payment collected successfully!');

        this.completedPayment.set(response);
        this.receiptRow = rowForReceipt;

        // Refresh only the bill list (Appointments/Patients/Doctors unchanged)
        this.reloadBillsOnly();

        this.resetForm(paymentForm);
      },
      error: (err: any) => {
        console.log(err);
        this.isSaving.set(false);

        const backendMessage: string = err?.error?.message || err?.error?.title || '';

        if (backendMessage.toLowerCase().includes('already paid')) {
          this.errorMessage.set('This appointment bill has already been paid.');
          this.reloadBillsOnly();
        } else {
          this.errorMessage.set(backendMessage || 'Sorry! Failed to collect payment');
        }
      }
    });
  }

  // Receipt Number, e.g. "RCPT-000042"
  get receiptNumber(): string {
    const id = this.completedPayment()?.PaymentId ?? 0;
    return `RCPT-${id.toString().padStart(6, '0')}`;
  }

  // Print the receipt (see @media print rules in collect-payment.scss)
  printReceipt(): void {
    window.print();
  }

  // Start a fresh payment collection after printing / dismissing the receipt
  startNewPayment(): void {
    this.completedPayment.set(null);
    this.receiptRow = null;
    this.successMessage.set('');
  }

  

  // Clear the form
  resetForm(paymentForm?: NgForm): void {
    this.searchTerm = '';
    this.selectedBillId = 0;
    this.selectedRow = null;
    this.paymentMethod = '';

    if (paymentForm) {
      paymentForm.resetForm();
    }
  }
}