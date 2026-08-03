// import { CommonModule } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { Doctor } from '../../../models/doctor';
// import { Doctor as DoctorService } from '../../../services/doctor';

// @Component({
//   selector: 'app-doctor-list',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './doctor-list.html',
//   styleUrl: './doctor-list.scss'
// })
// export class DoctorList implements OnInit {

//   doctors: Doctor[] = [];

//   constructor(private doctorService: DoctorService) { }

//   ngOnInit(): void {
//     console.log('DoctorList ngOnInit');
//     this.getDoctors();
//   }

//   getDoctors(): void {
//     this.doctorService.getAllDoctors().subscribe({
//       next: (response: Doctor[]) => {
//         console.log('Doctors:', response);
//         this.doctors = response;
//       },
//       error: (error: any) => {
//         console.error(error);
//       }
//     });
//   }
// }

import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Doctor } from '../../../models/doctor';
import { Doctor as DoctorService } from '../../../services/doctor';

@Component({
  selector: 'app-doctor-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctor-list.html',
  styleUrl: './doctor-list.scss'
})
export class DoctorList implements OnInit {

  doctors = signal<Doctor[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');

  constructor(private doctorService: DoctorService) { }

  ngOnInit(): void {
    this.getDoctors();
  }

  getDoctors(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.doctorService.getAllDoctors().subscribe({
      next: (response: Doctor[]) => {
        this.doctors.set(response || []);
        this.isLoading.set(false);
      },
      error: (error: any) => {
        console.error(error);
        this.isLoading.set(false);
        this.errorMessage.set('Failed to load doctors. Please try again.');
      }
    });
  }
}