import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LabService } from '../../services/lab-service';
import { LabOrder } from '../../models/lab-order';

@Component({
  selector: 'app-lab-reports',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './lab-reports.html',
  styleUrl: './lab-reports.scss'
})
export class LabReports implements OnInit {

  orders = signal<LabOrder[]>([]);
  loading = signal(false);

  generatingFor = signal<number | null>(null);
  markingPaidFor = signal<number | null>(null);
  downloadingReportFor = signal<number | null>(null);

  completedOrders = computed(() =>
    this.orders().filter(order => order.status === 'Completed')
  );

  constructor(private labService: LabService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {

    this.loading.set(true);

    this.labService.getOrders().subscribe({

      next: (orders: LabOrder[]) => {

        this.orders.set(orders);
        this.loading.set(false);

      },

      error: (error) => {

        console.error(error);
        this.loading.set(false);

      }

    });

  }

  // ===============================
  // Bill helpers
  // ===============================

  hasBill(order: LabOrder): boolean {
    return !!(order.labBills && order.labBills.length > 0);
  }

  getBill(order: LabOrder): any {
    return this.hasBill(order) ? order.labBills![0] : null;
  }

  generateBill(order: LabOrder): void {

    this.generatingFor.set(order.labOrderId);

    this.labService.generateLabBill({
      labOrderId: order.labOrderId,
      discount: 0
    }).subscribe({

      next: () => {
        this.generatingFor.set(null);
        this.loadOrders();
      },

      error: (err) => {
        console.log(err);
        this.generatingFor.set(null);
      }

    });

  }

  markPaid(order: LabOrder): void {

    const bill = this.getBill(order);
    if (!bill) return;

    this.markingPaidFor.set(order.labOrderId);

    this.labService.updateBillPaymentStatus(bill.labBillId, 'Paid').subscribe({

      next: () => {
        this.markingPaidFor.set(null);
        this.loadOrders();
      },

      error: (err) => {
        console.log(err);
        this.markingPaidFor.set(null);
      }

    });

  }

  downloadBillPdf(order: LabOrder): void {

    this.labService.downloadLabBill(order.labOrderId).subscribe({

      next: (blob: Blob) => {

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `LabBill_Order${order.labOrderId}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);

      },

      error: (err) => console.log(err)

    });

  }

  // ===============================
  // Report PDF
  // ===============================

  downloadReportPdf(order: LabOrder): void {

    this.downloadingReportFor.set(order.labOrderId);

    this.labService.downloadLabReport(order.labOrderId).subscribe({

      next: (blob: Blob) => {

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `LabReport_Order${order.labOrderId}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);

        this.downloadingReportFor.set(null);

      },

      error: (err) => {
        console.log(err);
        this.downloadingReportFor.set(null);
      }

    });

  }

}