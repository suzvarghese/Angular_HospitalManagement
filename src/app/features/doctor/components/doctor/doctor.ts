
import { DoctorService } from '../../services/doctor-service';
import { AuthService } from '../../../auth/services/auth';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';


@Component({
  selector: 'app-doctor',
  imports: [RouterModule],
  templateUrl: './doctor.html',
  styleUrl: './doctor.scss',
})
export class Doctor implements OnInit {
  constructor(
    public doctorService: DoctorService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const doctorId = this.authService.entityId();
    if (doctorId) {
      this.doctorService.getTodayAppointments(doctorId);
      this.doctorService.getTomorrowAppointments(doctorId);
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}