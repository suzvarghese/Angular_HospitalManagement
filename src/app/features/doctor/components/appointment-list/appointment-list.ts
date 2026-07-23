import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DoctorService } from '../../services/doctor-service';

@Component({
  selector: 'app-appointment-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './appointment-list.html',
  styleUrl: './appointment-list.scss',
})
export class AppointmentList implements OnInit {
  doctorId: number = 0;
  activeTab: string = 'today';

  constructor(public doctorService: DoctorService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Expects route: doctor/:doctorId/appointments
    this.doctorId = Number(this.route.snapshot.paramMap.get('doctorId'));
    this.loadToday();
  }

  loadToday(): void {
    this.activeTab = 'today';
    this.doctorService.getTodayAppointments(this.doctorId);
  }

  loadTomorrow(): void {
    this.activeTab = 'tomorrow';
    this.doctorService.getTomorrowAppointments(this.doctorId);
  }
}
