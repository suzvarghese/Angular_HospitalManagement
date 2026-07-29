import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Patient } from '../../../models/patient';
import { Patient as PatientService } from '../../../services/patient';

@Component({
  selector: 'app-patient-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient-register.html',
  styleUrl: './patient-register.scss',
})
export class PatientRegister implements OnInit {

  patient: Patient = new Patient();

  today: string = new Date().toISOString().split('T')[0];

  private existingPatients: Patient[] = [];

  isLoading = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');

  constructor(
    private patientService: PatientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadPatientsAndGenerateMmrId();
  }

  loadPatientsAndGenerateMmrId(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.patientService.getAllPatients().subscribe({
      next: (response: Patient[]) => {
        this.existingPatients = response;
        this.patient.mmrid = this.generateNextMmrId(response);
        this.isLoading.set(false);
      },
      error: (err: any) => {
        console.log(err);
        this.isLoading.set(false);
        this.errorMessage.set('Failed to generate MMR ID. Please refresh and try again.');
      }
    });
  }

  private generateNextMmrId(patients: Patient[]): string {
    let maxNumber = 0;

    for (const p of patients) {
      const match = /^MMR(\d+)$/.exec(p.mmrid ?? '');
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNumber) {
          maxNumber = num;
        }
      }
    }

    const nextNumber = maxNumber + 1;
    return 'MMR' + String(nextNumber).padStart(4, '0');
  }

  onDateOfBirthChange(): void {
    if (!this.patient.dateOfBirth) {
      this.patient.age = 0;
      return;
    }

    const dob = new Date(this.patient.dateOfBirth);
    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();

    const birthdayNotYetHappened =
      today.getMonth() < dob.getMonth() ||
      (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate());

    if (birthdayNotYetHappened) {
      age--;
    }

    this.patient.age = age;
  }

  registerPatient(form: NgForm): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (!form.valid) {
      this.errorMessage.set('Please fill in all required fields.');
      return;
    }

    const phoneExists = this.existingPatients.some(
      p => p.phone === this.patient.phone
    );

    if (phoneExists) {
      this.errorMessage.set('A patient with this phone number already exists.');
      return;
    }

    if (!this.patient.dateOfBirth) {
      this.errorMessage.set('Date Of Birth is required.');
      return;
    }

    if (new Date(this.patient.dateOfBirth) > new Date(this.today)) {
      this.errorMessage.set('Date of Birth cannot be in the future.');
      return;
    }

    this.onDateOfBirthChange();

    if (this.patient.age < 0 || this.patient.age > 150) {
      this.errorMessage.set('Age must be between 0 and 150.');
      return;
    }

    this.patient.isActive = true;

    this.isSaving.set(true);

    this.patientService.addPatient(this.patient).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.router.navigate(['/reception/patients'], {
          state: {
            successMessage: `Patient '${this.patient.patientName}' registered successfully.`
          }
        });
      },
      error: (err: any) => {
        console.log(err);
        this.isSaving.set(false);
        this.errorMessage.set('Failed to register patient. Please try again.');
      }
    });
  }
}