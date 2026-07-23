import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { DoctorService } from '../../services/doctor-service';
import { AuthService } from '../../../auth/services/auth';

@Component({
  selector: 'app-doctor',
  imports: [RouterModule],
  templateUrl: './doctor.html',
  styleUrl: './doctor.scss',
})
export class Dashboard implements OnInit {
  doctorId: number = 1;

  constructor(
    public doctorService: DoctorService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.doctorService.getTodayAppointments(this.doctorId);
    this.doctorService.getTomorrowAppointments(this.doctorId);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}