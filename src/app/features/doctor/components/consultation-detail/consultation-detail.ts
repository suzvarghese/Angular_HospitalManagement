import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { DoctorService } from '../../services/doctor-service';
import { ConsultationDetail as ConsultationDetailModel } from '../../models/doctor';

@Component({
  selector: 'app-consultation-detail',
  imports: [CommonModule, RouterModule],
  templateUrl: './consultation-detail.html',
  styleUrl: './consultation-detail.scss',
})
export class ConsultationDetail implements OnInit {
  consultationId: number = 0;
  consultation = signal<ConsultationDetailModel | null>(null);

  constructor(public doctorService: DoctorService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Expects route: doctor/consultations/:consultationId
    this.consultationId = Number(this.route.snapshot.paramMap.get('consultationId'));
    this.load();
  }

 
load(): void {
  this.doctorService.getConsultationDetails(this.consultationId).subscribe({
    next: (response) => this.consultation.set(response),
    error: (error) => console.log('Consultation Detail Error:', error),
  });
}
}
