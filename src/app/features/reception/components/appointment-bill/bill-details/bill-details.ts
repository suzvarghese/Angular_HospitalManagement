import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { AppointmentBill } from '../../../models/appointment-bill';
import { AppointmentBill as AppointmentBillService } from '../../../services/appointment-bill';
import { Appointment } from '../../../models/appointment';
import { Appointment as AppointmentService } from '../../../services/appointment';
import { Doctor } from '../../../models/doctor';
import { Doctor as DoctorService } from '../../../services/doctor';
import { Patient } from '../../../models/patient';
import { Patient as PatientService } from '../../../services/patient';

// Combined view model for the Details screen (BillDetailViewModel equivalent)
export interface BillDetailsViewModel {
  AppointmentBillId: number;
  AppointmentId: number;
  RegistrationFee: number;
  ConsultationFee: number;
  TotalAmount: number;
  BillDate: string;
  PaymentStatus: string;

  PatientName: string;
  MmrId: string;

  DoctorName: string;
  Specialization: string;

  AppointmentDate: string;
  TimeSlot: string;
  TokenNumber: number;
}

@Component({
  selector: 'app-bill-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './bill-details.html',
  styleUrl: './bill-details.scss',
})
export class BillDetails implements OnInit {

  billId: number = 0;
  bill: BillDetailsViewModel | null = null;

  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');

  constructor(
    private appointmentBillService: AppointmentBillService,
    private appointmentService: AppointmentService,
    private doctorService: DoctorService,
    private patientService: PatientService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.billId = Number(this.route.snapshot.paramMap.get('id')) || 0;

    if (!this.billId) {
      this.errorMessage.set('No bill selected.');
      return;
    }

    this.loadBillDetails();
  }

  // Details(id) : mirrors AppointmentBillsController.Details(id) / GetBillWithDetails(id)
  loadBillDetails(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.appointmentBillService.getAppointmentBillById(this.billId).subscribe({
      next: (bill: AppointmentBill | undefined) => {
        if (!bill) {
          this.isLoading.set(false);
          this.errorMessage.set('Bill not found.');
          return;
        }

        this.resolveRelatedDetails(bill);
      },
      error: (err: any) => {
        console.log(err);
        this.isLoading.set(false);
        this.errorMessage.set('Failed to load bill details.');
      }
    });
  }

  // Cross-reference the appointment (for Patient/Doctor/Date/Time/Token),
  // the doctor (for Specialization), and the patient (for MMR ID).
  // AppointmentBillDto itself carries no names, only ids and fee fields.
  private resolveRelatedDetails(bill: AppointmentBill): void {
    this.appointmentService.getAppointmentById(bill.AppointmentId).subscribe({
      next: (appt: Appointment) => {
        forkJoin({
          doctors: this.doctorService.getAllDoctors(),
          patients: this.patientService.getAllPatients()
        }).subscribe({
          next: ({ doctors, patients }: { doctors: Doctor[]; patients: Patient[] }) => {
            const doctor = doctors.find(d => d.DoctorId === appt.DoctorId);
            const patient = patients.find(p => p.PatientId === appt.PatientId);

            this.bill = {
              AppointmentBillId: bill.AppointmentBillId,
              AppointmentId: bill.AppointmentId,
              RegistrationFee: bill.RegistrationFee,
              ConsultationFee: bill.ConsultationFee,
              TotalAmount: bill.TotalAmount,
              BillDate: bill.BillDate,
              PaymentStatus: bill.PaymentStatus,

              PatientName: appt.PatientName,
              MmrId: patient?.Mmrid ?? '—',

              DoctorName: appt.DoctorName,
              Specialization: doctor?.Specialization ?? '—',

              AppointmentDate: appt.AppointmentDate,
              TimeSlot: appt.TimeSlot,
              TokenNumber: appt.TokenNumber
            };

            this.isLoading.set(false);
          },
          error: (err: any) => {
            console.log(err);
            this.isLoading.set(false);
            this.errorMessage.set('Failed to load related patient/doctor details.');
          }
        });
      },
      error: (err: any) => {
        console.log(err);
        this.isLoading.set(false);
        this.errorMessage.set('Failed to load the linked appointment.');
      }
    });
  }
}