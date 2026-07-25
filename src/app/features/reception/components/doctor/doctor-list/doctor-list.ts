import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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

  doctors: Doctor[] = [];

  constructor(private doctorService: DoctorService) { }

  ngOnInit(): void {
    console.log('DoctorList ngOnInit');
    this.getDoctors();
  }

  getDoctors(): void {
    this.doctorService.getAllDoctors().subscribe({
      next: (response: Doctor[]) => {
        console.log('Doctors:', response);
        this.doctors = response;
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }
}