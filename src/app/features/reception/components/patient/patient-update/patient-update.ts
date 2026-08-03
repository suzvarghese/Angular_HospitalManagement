import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Patient } from '../../../models/patient';
import { Patient as PatientService } from '../../../services/patient';
import { calculateAge } from '../../../utils/patient-validators';

@Component({
  selector: 'app-patient-update',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './patient-update.html',
  styleUrl: './patient-update.scss',
})
export class PatientUpdate implements OnInit {

  // Route param - which patient we're editing
  patientId: number = 0;

  // Form model - loaded from the API before the form is shown
  patient: Patient = new Patient();

  today: string = new Date().toISOString().split('T')[0];

  // All existing patients - used for the duplicate-phone check, same as
  // Register (the Web API has no IsPhoneExists endpoint of its own).
  private existingPatients: Patient[] = [];

  isLoading = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  errorMessage = signal<string>('');
  successMessage = signal<string>('');

  constructor(
    private patientService: PatientService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.patientId = Number(this.route.snapshot.paramMap.get('id')) || 0;

    if (!this.patientId) {
      this.errorMessage.set('No patient selected.');
      return;
    }

    this.loadPatient();
  }

  // GET: Patients/Edit(id) equivalent - loads the patient to edit, plus the
  // full patient list for the duplicate-phone check below. Reuses the same
  // SelectPatientByIdOrPhoneAsync endpoint (via searchPatient) already used
  // by Book Appointment's MMR/Phone search, since the Web API has no
  // separate GetPatientById endpoint.
  loadPatient(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.patientService.searchPatient(String(this.patientId)).subscribe({
      next: (response: Patient) => {
        if (!response) {
          this.isLoading.set(false);
          this.errorMessage.set('Patient not found.');
          return;
        }

        // DateOfBirth comes back as DateOnly (yyyy-MM-dd) - keep as-is so
        // the <input type="date"> can bind to it directly.
        this.patient = response;
        this.loadExistingPatients();
      },
      error: (err: any) => {
        console.log(err);
        this.isLoading.set(false);
        this.errorMessage.set('Failed to load patient. Please try again.');
      }
    });
  }

  private loadExistingPatients(): void {
    this.patientService.getAllPatients().subscribe({
      next: (response: Patient[]) => {
        this.existingPatients = response;
        this.isLoading.set(false);
      },
      error: (err: any) => {
        console.log(err);
        this.isLoading.set(false);
        this.errorMessage.set('Failed to load patients. Please try again.');
      }
    });
  }

  // Recompute Age whenever DateOfBirth changes - same rule as Register.
  onDateOfBirthChange(): void {
    this.patient.Age = calculateAge(this.patient.DateOfBirth);
  }

  // PUT: Patients/Edit(id) equivalent
  updatePatient(form: NgForm): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (!form.valid) {
      this.errorMessage.set('Please fill in all required fields.');
      return;
    }

    // Duplicate phone check - same rule as Register, but exclude this
    // patient's own record so re-saving with the same phone doesn't fail.
    const phoneExists = this.existingPatients.some(
      p => p.Phone === this.patient.Phone && p.PatientId !== this.patientId
    );

    if (phoneExists) {
      this.errorMessage.set('A patient with this phone number already exists.');
      return;
    }

    if (!this.patient.DateOfBirth) {
      this.errorMessage.set('Date Of Birth is required.');
      return;
    }

    if (new Date(this.patient.DateOfBirth) > new Date(this.today)) {
      this.errorMessage.set('Date of Birth cannot be in the future.');
      return;
    }

    this.onDateOfBirthChange();

    if (this.patient.Age < 0 || this.patient.Age > 150) {
      this.errorMessage.set('Age must be between 0 and 150.');
      return;
    }

    this.isSaving.set(true);

    this.patientService.updatePatient(this.patientId, this.patient).subscribe({
      next: () => {
        this.isSaving.set(false);
        this.router.navigate(['/reception/patients'], {
          state: { successMessage: `Patient '${this.patient.PatientName}' updated successfully.` }
        });
      },
      error: (err: any) => {
        console.log(err);
        this.isSaving.set(false);
        this.errorMessage.set('Failed to update patient. Please try again.');
      }
    });
  }
}
