import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Appointment } from '../../../models/appointment';
import { Appointment as AppointmentService } from '../../../services/appointment';

@Component({
  selector: 'app-today-queue',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './today-queue.html',
  styleUrl: './today-queue.scss',
})
export class TodayQueue implements OnInit {

  appointments = signal<Appointment[]>([]);

  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');

  constructor(
    private appointmentService: AppointmentService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadTodayAppointments();
  }

  getTodayStr(): string {
    return new Date().toISOString().split('T')[0];
  }

  loadTodayAppointments(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    const todayStr = this.getTodayStr();

    this.appointmentService.getAllAppointments().subscribe({
      next: (response: Appointment[]) => {
        const todays = response
          .filter(a => a.AppointmentDate === todayStr)
          .sort((a, b) => (a.TokenNumber || 0) - (b.TokenNumber || 0));

        this.appointments.set(todays);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        console.log(err);
        this.isLoading.set(false);
        this.errorMessage.set('Failed to load today\'s queue');
      }
    });
  }

  refreshQueue(): void {
    this.loadTodayAppointments();
  }

  goToBookAppointment(): void {
    this.router.navigate(['/reception/appointments/book']);
  }

  reschedule(appointmentId: number): void {
    this.router.navigate(['/reception/appointments/reschedule', appointmentId]);
  }

  generateBill(appointmentId: number): void {
    this.router.navigate(['/reception/bills/generate', appointmentId]);
  }

  cancelAppointment(appt: Appointment): void {
    if (!confirm('Cancel this appointment?')) return;

    const updated: Appointment = { ...appt, Status: 'Cancelled' };

    this.appointmentService.updateAppointment(appt.AppointmentId, updated).subscribe({
      next: () => {
        this.successMessage.set('Appointment cancelled successfully.');
        this.refreshQueue();
      },
      error: (err: any) => {
        console.log(err);
        this.errorMessage.set('Failed to cancel appointment');
      }
    });
  }

  // Getters for dashboard cards
  get totalCount(): number {
    return this.appointments().length;
  }

  get scheduledCount(): number {
    return this.appointments().filter(a => a.Status === 'Scheduled').length;
  }

  get completedCount(): number {
    return this.appointments().filter(a => a.Status === 'Completed').length;
  }

  get cancelledCount(): number {
    return this.appointments().filter(a => a.Status === 'Cancelled').length;
  }
}