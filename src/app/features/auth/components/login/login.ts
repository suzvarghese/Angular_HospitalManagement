import { AuthService } from '../../../auth/services/auth';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';


interface RoleOption {
  value: string;
  label: string;
  idLabel: string;
  route: string;
}

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  username: string = '';
  password: string = '';
  selectedRole: string = 'Doctor';
  entityId: number | null = null;
  errorMessage: string = '';
  loading: boolean = false;

  roleOptions: RoleOption[] = [
    { value: 'Doctor', label: 'Doctor', idLabel: 'Doctor ID', route: '/doctor' },
    { value: 'Pharmacist', label: 'Pharmacist', idLabel: 'Pharmacist ID', route: '/pharmacy' },
  ];

  constructor(private authService: AuthService, private router: Router) {}

  get currentIdLabel(): string {
    return this.roleOptions.find((r) => r.value === this.selectedRole)?.idLabel ?? 'ID';
  }

  onSubmit(form: NgForm) {
    this.errorMessage = '';
    this.loading = true;

    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        this.authService.setSession(response);
        this.authService.setRole(this.selectedRole, this.entityId!);
        this.loading = false;

        const target = this.roleOptions.find((r) => r.value === this.selectedRole)?.route ?? '/login';
        this.router.navigate([target]);
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Invalid username or password.';
      },
    });
  }
}
