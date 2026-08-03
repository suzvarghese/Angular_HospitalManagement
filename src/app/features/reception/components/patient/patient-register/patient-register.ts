// import { CommonModule } from '@angular/common';
// import { Component, OnInit, signal } from '@angular/core';
// import { FormsModule, NgForm } from '@angular/forms';
// import { Router, RouterLink } from '@angular/router';
// import { Patient } from '../../../models/patient';
// import { Patient as PatientService } from '../../../services/patient';

// @Component({
//   selector: 'app-patient-register',
//   standalone: true,
//   imports: [CommonModule, FormsModule],  //RouterLink
//   templateUrl: './patient-register.html',
//   styleUrl: './patient-register.scss',
// })
// export class PatientRegister implements OnInit {

//   // Form model - MMRID is pre-filled + readonly, like PatientController.Create (GET)
//   patient: Patient = new Patient();

//   today: string = new Date().toISOString().split('T')[0];

//   // All existing patients - used to generate the next MMR ID and check for duplicate phone,
//   // since the Web API has no GenerateMMRID / IsPhoneExists endpoints (those lived in the
//   // MVC app's PatientServices, which wasn't part of the uploaded files).
//   private existingPatients: Patient[] = [];

//   isLoading = signal<boolean>(false);
//   isSaving = signal<boolean>(false);
//   errorMessage = signal<string>('');
//   successMessage = signal<string>('');

//   constructor(
//     private patientService: PatientService,
//     private router: Router
//   ) { }

//   ngOnInit(): void {
//     this.loadPatientsAndGenerateMmrId();
//   }

//   // Load all patients, then assign the next sequential MMR ID (MMR0001, MMR0002, ...)
//   // based on the highest existing MMR ID - equivalent to PatientController.Create (GET)
//   // calling _patientServices.GenerateMMRID().
//   loadPatientsAndGenerateMmrId(): void {
//     this.isLoading.set(true);
//     this.errorMessage.set('');

//     this.patientService.getAllPatients().subscribe({
//       next: (response: Patient[]) => {
//         this.existingPatients = response;
//         this.patient.Mmrid = this.generateNextMmrId(response);
//         this.isLoading.set(false);
//       },
//       error: (err: any) => {
//         console.log(err);
//         this.isLoading.set(false);
//         this.errorMessage.set('Failed to generate MMR ID. Please refresh and try again.');
//       }
//     });
//   }

//   private generateNextMmrId(patients: Patient[]): string {
//     let maxNumber = 0;

//     for (const p of patients) {
//       const match = /^MMR(\d+)$/.exec(p.Mmrid ?? '');
//       if (match) {
//         const num = parseInt(match[1], 10);
//         if (num > maxNumber) {
//           maxNumber = num;
//         }
//       }
//     }

//     const nextNumber = maxNumber + 1;
//     return 'MMR' + String(nextNumber).padStart(4, '0');
//   }

//   // Recompute Age whenever DateOfBirth changes - same rule as
//   // PatientController.Create: Age = Today.Year - DOB.Year, minus 1 if the
//   // birthday hasn't occurred yet this year.
//   onDateOfBirthChange(): void {
//     if (!this.patient.DateOfBirth) {
//       this.patient.Age = 0;
//       return;
//     }

//     const dob = new Date(this.patient.DateOfBirth);
//     const today = new Date();

//     let age = today.getFullYear() - dob.getFullYear();

//     const birthdayNotYetHappened =
//       today.getMonth() < dob.getMonth() ||
//       (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate());

//     if (birthdayNotYetHappened) {
//       age--;
//     }

//     this.patient.Age = age;
//   }

//   // POST: Patients/Create equivalent
//   registerPatient(form: NgForm): void {
//     this.errorMessage.set('');
//     this.successMessage.set('');

//     if (!form.valid) {
//       this.errorMessage.set('Please fill in all required fields.');
//       return;
//     }

//     // Duplicate phone check (PatientController.Create -> IsPhoneExists)
//     const phoneExists = this.existingPatients.some(
//       p => p.Phone === this.patient.Phone
//     );

//     if (phoneExists) {
//       this.errorMessage.set('A patient with this phone number already exists.');
//       return;
//     }

//     // Validate DOB (PatientController.Create)
//     if (!this.patient.DateOfBirth) {
//       this.errorMessage.set('Date Of Birth is required.');
//       return;
//     }

//     if (new Date(this.patient.DateOfBirth) > new Date(this.today)) {
//       this.errorMessage.set('Date of Birth cannot be in the future.');
//       return;
//     }

//     this.onDateOfBirthChange();

//     if (this.patient.Age < 0 || this.patient.Age > 150) {
//       this.errorMessage.set('Age must be between 0 and 150.');
//       return;
//     }

//     this.patient.IsActive = true;

//     this.isSaving.set(true);

//     this.patientService.addPatient(this.patient).subscribe({
//       next: () => {
//         this.isSaving.set(false);
//         // TempData["SuccessMessage"] equivalent, then redirect to Patients/Index
//         this.router.navigate(['/reception/patients'], {
//           state: { successMessage: `Patient '${this.patient.PatientName}' registered successfully.` }
//         });
//       },
//       error: (err: any) => {
//         console.log(err);
//         this.isSaving.set(false);
//         this.errorMessage.set('Failed to register patient. Please try again.');
//       }
//     });
//   }
// }

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

  // Live "check existing patients" search box - same synchronous, filter-
  // as-you-type behaviour as Patient List / Patient Search. Filters the
  // SAME existingPatients array already loaded for the duplicate-phone
  // check below, so no extra API call is made.
  searchTerm: string = '';
  searchResults: Patient[] = [];

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

  // Live search - filters the already-loaded existingPatients client-side,
  // same pattern as Patient List's filterPatients() / Patient Search's
  // onSearch(). Lets the receptionist quickly check whether a patient is
  // already registered before filling out the form below.
  filterExisting(): void {
    const term = (this.searchTerm ?? '').trim().toLowerCase();

    if (!term) {
      this.searchResults = [];
      return;
    }

    this.searchResults = this.existingPatients.filter(p =>
      (p.PatientName ?? '').toLowerCase().includes(term) ||
      (p.Mmrid ?? '').toLowerCase().includes(term) ||
      (p.Phone ?? '').toLowerCase().includes(term)
    );
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