// import { Component } from '@angular/core';
// import { RouterLink } from '@angular/router';

// @Component({
//   selector: 'app-dashboard',
//   standalone: true,
//   imports: [RouterLink],
//   templateUrl: './dashboard.html',
//   styleUrl: './dashboard.scss',
// })
// export class Dashboard {

// }


import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Appointment } from '../../models/appointment';
import { Appointment as AppointmentService } from '../../services/appointment';
import { Patient as PatientService } from '../../services/patient';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],   // Remove RouterLink
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {

  totalPatients = signal<number>(0);
  todayAppointments = signal<number>(0);
  todaysQueue = signal<Appointment[]>([]);

  isLoading = signal<boolean>(true);

  constructor(
    private patientService: PatientService,
    private appointmentService: AppointmentService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  private loadDashboardData() {
    this.patientService.getAllPatients().subscribe({
      next: (patients: any[]) => this.totalPatients.set(patients?.length || 0),
      error: (err: any) => console.error('Patients error', err)
    });

    this.appointmentService.getAllAppointments().subscribe({
      next: (appointments: any[]) => {
        const today = new Date().toISOString().split('T')[0];
        const todayAppts = appointments.filter((a: any) => a.AppointmentDate === today);
        
        this.todayAppointments.set(todayAppts.length);
        this.todaysQueue.set(todayAppts.slice(0, 5));
        this.isLoading.set(false);
      },
      error: (err: any) => {
        console.error('Appointments error', err);
        this.isLoading.set(false);
      }
    });
  }
}