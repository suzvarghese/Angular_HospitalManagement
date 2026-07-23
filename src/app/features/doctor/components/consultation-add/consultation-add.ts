import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DoctorService } from '../../services/doctor-service';
import { AddConsultationRequest, OrderLabTestsRequest } from '../../models/doctor';

@Component({
  selector: 'app-consultation-add',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './consultation-add.html',
  styleUrl: './consultation-add.scss',
})
export class ConsultationAdd implements OnInit {
  consultation: AddConsultationRequest = new AddConsultationRequest();
  selectedTestIds: number[] = [];
  saving: boolean = false;

  constructor(
    public doctorService: DoctorService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Expects navigation with queryParams: appointmentId, doctorId, patientId
    // (set by AppointmentList's "Add Consultation" link)
    this.route.queryParamMap.subscribe((params) => {
      this.consultation.appointmentId = Number(params.get('appointmentId'));
      this.consultation.doctorId = Number(params.get('doctorId'));
      this.consultation.patientId = Number(params.get('patientId'));
    });

    this.doctorService.getAvailableMedicines();
    this.doctorService.getLabTestsMaster();
  }

  toggleTest(testId: number, checked: boolean): void {
    if (checked) {
      if (!this.selectedTestIds.includes(testId)) {
        this.selectedTestIds.push(testId);
      }
    } else {
      this.selectedTestIds = this.selectedTestIds.filter((id) => id !== testId);
    }
  }

  isSelected(testId: number): boolean {
    return this.selectedTestIds.includes(testId);
  }

  // Saves the consultation, then (if any tests were checked) orders them
  // against the new consultationId, then goes to the detail page showing
  // diagnosis + prescription + lab orders all together.
  onSubmit(form: NgForm) {
    if (this.saving) return;
    this.saving = true;

    this.doctorService.addConsultation(this.consultation).subscribe({
      next: (result) => {
        if (this.selectedTestIds.length === 0) {
          this.router.navigate(['/doctor/consultations', result.consultationId]);
          return;
        }

        const labRequest: OrderLabTestsRequest = {
          consultationId: result.consultationId,
          testIds: this.selectedTestIds,
        };

        this.doctorService.orderLabTests(labRequest).subscribe({
          next: () => this.router.navigate(['/doctor/consultations', result.consultationId]),
          error: (error) => {
            console.log('Order Lab Tests Error:', error);
            // Consultation was already saved successfully -- still go to
            // detail page so the doctor doesn't lose that record; they can
            // retry ordering tests from there.
            this.router.navigate(['/doctor/consultations', result.consultationId]);
          },
        });
      },
      error: (error) => {
        console.log('Add Consultation Error:', error);
        this.saving = false;
      },
    });
  }

  cancel(): void {
    this.router.navigate(['/doctor', this.consultation.doctorId, 'appointments']);
  }
}