import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';

import { LabService } from '../../services/lab-service';
import { LabOrder } from '../../models/lab-order';

@Component({
  selector: 'app-lab-order-details',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  templateUrl: './lab-order-details.html',
  styleUrl: './lab-order-details.scss'
})
export class LabOrderDetailsComponent implements OnInit {

  order = signal<LabOrder | null>(null);
  loading = signal(false);
  orderId!: number;

  resultsForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private labService: LabService
  ) {
    this.resultsForm = this.fb.group({
      rows: this.fb.array([])
    });
  }

  get rows(): FormArray {
    return this.resultsForm.get('rows') as FormArray;
  }

  ngOnInit(): void {

    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadOrder();

  }

  loadOrder(): void {

    this.loading.set(true);

    this.labService.getOrderById(this.orderId).subscribe({

      next: (order: LabOrder) => {

        this.order.set(order);
        this.buildForm(order);
        this.loading.set(false);

      },

      error: () => {
        this.loading.set(false);
      }

    });

  }

  buildForm(order: LabOrder): void {

    const rowGroups = (order.labOrderDetails || []).map(detail => {

      const existingResult = detail.labResults && detail.labResults.length > 0
        ? detail.labResults[0]
        : null;

      return this.fb.group({
        labOrderDetailId: [detail.labOrderDetailId],
        resultId: [existingResult ? existingResult.resultId : null],
        testName: [detail.test?.testName || ''],
        normalRange: [detail.test?.normalRange || ''],
        unit: [detail.test?.unit || ''],
        resultValue: [
          existingResult?.resultValue || '',
          Validators.required
        ],
        remarks: [existingResult?.remarks || '']
      });

    });

    this.resultsForm.setControl('rows', this.fb.array(rowGroups));

  }

  saveRow(index: number): void {

    const row = this.rows.at(index);

    if (row.invalid) {
      row.markAllAsTouched();
      return;
    }

    const value = row.value;

    if (value.resultId) {

      this.labService.updateLabResult(value.resultId, {
        resultValue: value.resultValue,
        remarks: value.remarks
      }).subscribe({
        next: () => this.loadOrder(),
        error: (err) => console.log(err)
      });

    } else {

      this.labService.addLabResult({
        labOrderDetailId: value.labOrderDetailId,
        resultValue: value.resultValue,
        remarks: value.remarks
      }).subscribe({
        next: () => this.loadOrder(),
        error: (err) => console.log(err)
      });

    }

  }

  markSampleCollected(): void {

    this.labService.updateOrderStatus(this.orderId, {
      sampleCollected: true
    }).subscribe({
      next: () => this.loadOrder(),
      error: (err) => console.log(err)
    });

  }

  markCompleted(): void {

    this.labService.updateOrderStatus(this.orderId, {
      status: 'Completed'
    }).subscribe({
      next: () => this.loadOrder(),
      error: (err) => console.log(err)
    });

  }

  allRowsSaved(): boolean {
    return this.rows.controls.every(r => r.get('resultId')?.value);
  }

  isReportReady(status?: string): boolean {
    return this.labService.isReportReady(status);
  }

  downloadingReport = signal(false);

  downloadReport(): void {

    this.downloadingReport.set(true);

    this.labService.downloadLabReport(this.orderId).subscribe({

      next: (blob: Blob) => {

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `LabReport_Order${this.orderId}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);

        this.downloadingReport.set(false);

      },

      error: (err) => {
        console.log(err);
        this.downloadingReport.set(false);
      }

    });

  }

  // ===============================
  // Billing (generate / download the bill PDF right from the report screen)
  // ===============================

  discount = signal<number>(0);
  generatingBill = signal(false);
  downloadingBill = signal(false);

  hasBill(): boolean {
    const ord = this.order();
    return !!(ord && ord.labBills && ord.labBills.length > 0);
  }

  getBill(): any {
    const ord = this.order();
    return this.hasBill() ? ord!.labBills![0] : null;
  }

  setDiscount(value: number): void {
    this.discount.set(value);
  }

  // One button does both: generates the bill if it doesn't exist yet,
  // then opens/downloads the PDF either way.
  handleBill(): void {

    if (this.hasBill()) {
      this.downloadBill();
      return;
    }

    this.generatingBill.set(true);

    this.labService.generateLabBill({
      labOrderId: this.orderId,
      discount: this.discount()
    }).subscribe({

      next: () => {
        this.generatingBill.set(false);
        this.loadOrder();
        this.downloadBill();
      },

      error: (err) => {
        console.log(err);
        this.generatingBill.set(false);
      }

    });

  }

  private downloadBill(): void {

    this.downloadingBill.set(true);

    this.labService.downloadLabBill(this.orderId).subscribe({

      next: (blob: Blob) => {

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `LabBill_Order${this.orderId}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);

        this.downloadingBill.set(false);

      },

      error: (err) => {
        console.log(err);
        this.downloadingBill.set(false);
      }

    });

  }

  // Goes back to whichever list screen the user actually came from
  // (Lab Orders or Lab Reports), instead of always forcing "Orders".
  backToOrders(): void {
    this.location.back();
  }

}