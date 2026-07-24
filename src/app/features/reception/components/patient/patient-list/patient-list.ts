// import { CommonModule } from '@angular/common';
// import { Component, OnInit, signal } from '@angular/core';
// import { Router, RouterLink } from '@angular/router';
// import { ChangeDetectorRef } from '@angular/core';
// import { Patient } from '../../../models/patient';
// import { Patient as PatientService } from '../../../services/patient';

// @Component({
//   selector: 'app-patient-list',
//   standalone: true,
//   imports: [CommonModule ], //RouterLink
//   templateUrl: './patient-list.html',
//   styleUrl: './patient-list.scss'
// })
// export class PatientList implements OnInit {

//   patients: Patient[] = [];
//   successMessage = signal<string>('');

//   constructor(
//     private patientService: PatientService,
//     private router: Router,
//     private cdr: ChangeDetectorRef
//   ) {}

//   ngOnInit(): void {
//     console.log('PatientList ngOnInit');

//     // Pick up the TempData["SuccessMessage"] equivalent passed from Register Patient
//     const state = history.state as any;
//     if (state && state['successMessage']) {
//       this.successMessage.set(state['successMessage']);
//     }

//     this.getPatients();
//   }

//   getPatients(): void {

//     console.log('getPatients() called');

//     this.patientService.getAllPatients().subscribe({

//       next: (response: Patient[]) => {

//         console.log(response);
      
//         this.patients = [...response];
      
//         this.cdr.detectChanges();
      
//       },

//       error: (error: any) => {

//         console.error('API Error:', error);

//       }

//     });

//   }
// }


import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Patient } from '../../../models/patient';
import { Patient as PatientService } from '../../../services/patient';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './patient-list.html',
  styleUrl: './patient-list.scss'
})
export class PatientList implements OnInit {

  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  searchTerm: string = '';
  
  successMessage = signal<string>('');
  errorMessage = signal<string>('');

  constructor(
    private patientService: PatientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const state = history.state as any;
    if (state?.successMessage) {
      this.successMessage.set(state.successMessage);
      setTimeout(() => history.replaceState({}, ''), 100);
    }

    this.loadPatients();
  }

  loadPatients(): void {
    this.patientService.getAllPatients().subscribe({
      next: (response: Patient[]) => {
        this.patients = response || [];
        this.filteredPatients = [...this.patients];
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set('Failed to load patients');
      }
    });
  }

  filterPatients(): void {
    if (!this.searchTerm?.trim()) {
      this.filteredPatients = [...this.patients];
      return;
    }
    const term = this.searchTerm.toLowerCase().trim();
    this.filteredPatients = this.patients.filter(p => 
      (p.Mmrid?.toLowerCase() || '').includes(term) ||
      (p.PatientName?.toLowerCase() || '').includes(term) ||
      (p.Phone || '').includes(term) ||
      (p.BloodGroup?.toLowerCase() || '').includes(term)
    );
  }

  viewPatient(patientId: number): void {
    alert(`Viewing patient ID: ${patientId}`);
  }

  bookAppointment(patient: Patient): void {
    this.router.navigate(['/reception/appointments/book'], { 
      queryParams: { patientId: patient.PatientId } 
    });
  }

  deletePatient(patientId: number): void {
    if (confirm('Delete this patient?')) {
      this.errorMessage.set('Delete not implemented yet.');
    }
  }
}