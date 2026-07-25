import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DoctorService } from '../../services/doctor-service';

@Component({
  selector: 'app-patient-history',
  imports: [CommonModule, RouterModule],
  templateUrl: './patient-history.html',
  styleUrl: './patient-history.scss',
})
export class PatientHistory implements OnInit {
  patientId: number = 0;

  constructor(public doctorService: DoctorService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Expects route: doctor/patients/:patientId/history
    this.patientId = Number(this.route.snapshot.paramMap.get('patientId'));
    this.doctorService.getPatientHistory(this.patientId);
  }
}
