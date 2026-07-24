import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Appointment } from '../../../models/appointment';
import { Appointment as AppointmentService } from '../../../services/appointment';
import { generateTimeSlots, slotToDate, todayStr, tomorrowStr } from '../../../utils/appointment-slots';

@Component({
  selector: 'app-appointment-reschedule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointment-reschedule.html',
  styleUrl: './appointment-reschedule.scss',
})
export class AppointmentReschedule implements OnInit {

  appointmentId: number = 0;
  appointment: Appointment | null = null;

  today: string = todayStr();
  tomorrow: string = tomorrowStr();

  // Full-day slot list, 9:00 AM - 6:00 PM, matching the old MVC RescheduleAppointment view
  allDaySlots: string[] = generateTimeSlots('09:00', '18:15');

  private allAppointments: Appointment[] = [];

  isLoading = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  errorMessage = signal<string>('');

  constructor(
    private appointmentService: AppointmentService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.appointmentId = Number(this.route.snapshot.paramMap.get('id')) || 0;
    this.loadAppointment();
  }

  loadAppointment(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.appointmentService.getAppointmentById(this.appointmentId).subscribe({
      next: (response: Appointment) => {
        this.appointment = response;
        // Default the date choice to today if it's outside today/tomorrow
        if (this.appointment.AppointmentDate !== this.today && this.appointment.AppointmentDate !== this.tomorrow) {
          this.appointment.AppointmentDate = this.today;
        }
        this.loadAllAppointments();
      },
      error: (err: any) => {
        console.log(err);
        this.isLoading.set(false);
        this.errorMessage.set('Failed to load appointment details');
      }
    });
  }

  private loadAllAppointments(): void {
    this.appointmentService.getAllAppointments().subscribe({
      next: (response: Appointment[]) => {
        this.allAppointments = response;
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  get availableSlots(): string[] {
    if (!this.appointment) return [];

    const isToday = this.appointment.AppointmentDate === this.today;
    const now = new Date();

    const bookedSlots = this.allAppointments
      .filter(a =>
        a.AppointmentId !== this.appointmentId &&
        a.DoctorId === this.appointment!.DoctorId &&
        a.AppointmentDate === this.appointment!.AppointmentDate &&
        a.Status !== 'Cancelled'
      )
      .map(a => a.TimeSlot);

    return this.allDaySlots.filter(slot => {
      if (bookedSlots.includes(slot)) return false;
      if (isToday && slotToDate(this.appointment!.AppointmentDate, slot) <= now) return false;
      return true;
    });
  }

  onDateChange(date: string): void {
    if (this.appointment) {
      this.appointment.AppointmentDate = date;
      this.appointment.TimeSlot = '';
    }
  }

  reschedule(form: NgForm): void {
    if (!this.appointment) return;

    this.errorMessage.set('');

    if (this.appointment.AppointmentDate !== this.today && this.appointment.AppointmentDate !== this.tomorrow) {
      this.errorMessage.set('Appointments can only be rescheduled to Today or Tomorrow.');
      return;
    }
    if (!this.appointment.TimeSlot) {
      this.errorMessage.set('Please select a time slot.');
      return;
    }

    this.isSaving.set(true);

    this.appointmentService.updateAppointment(this.appointmentId, this.appointment).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.router.navigate(['/reception/appointments']);
      },
      error: (err: any) => {
        console.log(err);
        this.isSaving.set(false);
        this.errorMessage.set('That time slot is already booked for this doctor, or the update failed.');
      }
    });
  }
}