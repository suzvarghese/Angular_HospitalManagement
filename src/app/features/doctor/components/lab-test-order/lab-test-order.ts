import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { DoctorService } from '../../services/doctor-service';
import { OrderLabTestsRequest } from '../../models/doctor';

@Component({
  selector: 'app-lab-test-order',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './lab-test-order.html',
  styleUrl: './lab-test-order.scss',
})
export class LabTestOrder implements OnInit {
  consultationId: number = 0;
  selectedTestIds: number[] = [];

  constructor(
    public doctorService: DoctorService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Expects route: doctor/consultations/:consultationId/lab-tests
    this.consultationId = Number(this.route.snapshot.paramMap.get('consultationId'));
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

  submitOrder(): void {
    if (this.selectedTestIds.length === 0) {
      console.log('Select at least one test.');
      return;
    }

    const request: OrderLabTestsRequest = {
      consultationId: this.consultationId,
      testIds: this.selectedTestIds,
    };

    this.doctorService.orderLabTests(request).subscribe({
      next: () => this.router.navigate(['/doctor/consultations', this.consultationId]),
      error: (error) => console.log('Order Lab Tests Error:', error),
    });
  }
}
