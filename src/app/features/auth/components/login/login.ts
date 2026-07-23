import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  username: string = '';
  password: string = '';
  doctorId: number | null = null;
  errorMessage: string = '';
  loading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(form: NgForm) {
    this.errorMessage = '';
    this.loading = true;

    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        this.authService.setSession(response);

        // NOTE: no backend lookup for this -- the login response doesn't
        // include DoctorId, and per project constraints no backend changes
        // are being made to add one. This is taken at face value from the
        // form, not verified server-side against the logged-in user.
        this.authService.setDoctorId(this.doctorId!);

        this.loading = false;
        this.router.navigate(['/doctor']);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Invalid username or password.';
      },
    });
  }
}
