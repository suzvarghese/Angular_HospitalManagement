import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DoctorService } from '../../services/doctor-service';

@Component({
  selector: 'app-doctor',
  imports: [RouterModule],
  templateUrl: './doctor.html',
  styleUrl: './doctor.scss',
})
export class Dashboard implements OnInit {
  // TODO: once auth is wired up, pull doctorId from the logged-in doctor's
  // token/session instead of hardcoding it here.
  doctorId: number = 1;

  constructor(public doctorService: DoctorService) {}

  ngOnInit(): void {
    this.doctorService.getTodayAppointments(this.doctorId);
    this.doctorService.getTomorrowAppointments(this.doctorId);
  }
}
