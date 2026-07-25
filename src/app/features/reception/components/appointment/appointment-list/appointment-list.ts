import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Appointment } from '../../../models/appointment';
import { Appointment as AppointmentService } from '../../../services/appointment';
import { FilterPipe } from '../../../../../shared/pipes/filter-pipe';

import { AppointmentBill as AppointmentBillService } from '../../../services/appointment-bill';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterPipe,RouterLink],
  templateUrl: './appointment-list.html',
  styleUrl: './appointment-list.scss',
})
export class AppointmentList implements OnInit {

  // declare
  searchTerm: string = '';
  appointments = signal<Appointment[]>([]);

  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');

  constructor(
    private appointmentService: AppointmentService,
    private appointmentBillService: AppointmentBillService,

    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadAppointments();
  }

  // Load All Appointments
  loadAppointments(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.appointmentService.getAllAppointments().subscribe({
      next: (response: Appointment[]) => {
        this.appointments.set(response);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        console.log(err);
        this.isLoading.set(false);
        this.errorMessage.set('Failed to load appointments');
      }
    });
  }

  // Navigate to Reschedule screen for a single appointment
  reschedule(appointmentId: number): void {
    this.router.navigate(['/reception/appointments/reschedule', appointmentId]);
  }

  // Navigate to Generate Bill for this appointment (AppointmentBillsController.GenerateBill)
  // generateBill(appointmentId: number): void {
  //   this.router.navigate(['/reception/bills/generate', appointmentId]);
  // }
  generateBill(appointmentId: number): void {

    this.appointmentBillService.getAllAppointmentBills().subscribe({
  
      next: (bills) => {
  
        const existingBill = bills.find(
          b => b.AppointmentId === appointmentId
        );
  
        if (existingBill) {
  
          // Bill already exists
          this.router.navigate([
            '/reception/bills/details',
            existingBill.AppointmentBillId
          ]);
  
        } else {
  
          // Generate new bill
          this.router.navigate([
            '/reception/bills/generate',
            appointmentId
          ]);
  
        }
  
      },
  
      error: () => {
        this.errorMessage.set('Unable to verify bill status.');
      }
  
    });
  
  }

  // Cancel Appointment (AppointmentsController.CancelAppointment)
  cancelAppointment(appt: Appointment): void {
    if (!confirm('Cancel this appointment?')) {
      return;
    }

    this.errorMessage.set('');
    this.successMessage.set('');

    const updated: Appointment = { ...appt, Status: 'Cancelled' };

    this.appointmentService.updateAppointment(appt.AppointmentId, updated).subscribe({
      next: () => {
        this.successMessage.set('Appointment cancelled successfully.');
        this.loadAppointments();
      },
      error: (err: any) => {
        console.log(err);
        this.errorMessage.set('Failed to cancel appointment');
      }
    });
  }
}