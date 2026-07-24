import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { AppointmentBill } from '../../../models/appointment-bill';
import { AppointmentBill as AppointmentBillService } from '../../../services/appointment-bill';
import { Appointment } from '../../../models/appointment';
import { Appointment as AppointmentService } from '../../../services/appointment';

import { FilterPipe } from '../../../../../shared/pipes/filter-pipe';

// View row shown in the bills table: bill fields + the Patient/Doctor names
// resolved from the appointment (AppointmentBillDto has no names of its own).
export interface BillListRow {
  AppointmentBillId: number;
  AppointmentId: number;
  PatientName: string;
  DoctorName: string;
  TotalAmount: number;
  PaymentStatus: string;
  BillDate: string;
}

@Component({
  selector: 'app-bill-list',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterPipe],
  templateUrl: './bill-list.html',
  styleUrl: './bill-list.scss'
})
export class BillList implements OnInit {

  searchTerm: string = '';

  rows = signal<BillListRow[]>([]);

  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');

  constructor(
    private appointmentBillService: AppointmentBillService,
    private appointmentService: AppointmentService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadBills();
  }

  // Index : mirrors AppointmentBillsController.Index() / GetAllBillsWithDetails()
  loadBills(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    forkJoin({
      bills: this.appointmentBillService.getAllAppointmentBills(),
      appointments: this.appointmentService.getAllAppointments()
    }).subscribe({
      next: ({ bills, appointments }: { bills: AppointmentBill[]; appointments: Appointment[] }) => {

        const rows: BillListRow[] = bills.map(bill => {
          const appt = appointments.find(a => a.AppointmentId === bill.AppointmentId);

          return {
            AppointmentBillId: bill.AppointmentBillId,
            AppointmentId: bill.AppointmentId,
            PatientName: appt?.PatientName ?? '—',
            DoctorName: appt?.DoctorName ?? '—',
            TotalAmount: bill.TotalAmount,
            PaymentStatus: bill.PaymentStatus,
            BillDate: bill.BillDate
          };
        });

        this.rows.set(rows);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        console.error(err);
        this.isLoading.set(false);
        this.errorMessage.set('Failed to load appointment bills');
      }
    });
  }

  // View : mirrors AppointmentBillsController.Details(id)
  view(billId: number): void {
    this.router.navigate(['/reception/bills/details', billId]);
  }
}