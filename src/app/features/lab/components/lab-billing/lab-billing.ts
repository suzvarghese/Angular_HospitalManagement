import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { LabService } from '../../services/lab-service';
import { LabOrder } from '../../models/lab-order';

@Component({
  selector: 'app-lab-billing',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './lab-billing.html',
  styleUrl: './lab-billing.scss'
})
export class LabBillingComponent implements OnInit {

  orders = signal<LabOrder[]>([]);
  loading = signal(false);
  discounts: { [orderId: number]: number } = {};
  generatingFor = signal<number | null>(null);

  completedOrders = computed(() =>
    this.orders().filter(o => this.labService.isReportReady(o.status))
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

      error: () => {
        this.loading.set(false);
      }

    });

  }

  hasBill(order: LabOrder): boolean {
    return !!(order.labBills && order.labBills.length > 0);
  }

  getBill(order: LabOrder): any {
    return this.hasBill(order) ? order.labBills![0] : null;
  }

  getDiscount(orderId: number): number {
    return this.discounts[orderId] ?? 0;
  }

  setDiscount(orderId: number, value: number): void {
    this.discounts[orderId] = value;
  }

  generateBill(order: LabOrder): void {

    this.generatingFor.set(order.labOrderId);

    this.labService.generateLabBill({
      labOrderId: order.labOrderId,
      discount: this.getDiscount(order.labOrderId)
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

  downloadBill(order: LabOrder): void {

    this.labService.downloadLabBill(order.labOrderId).subscribe({

      next: (blob: Blob) => {

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `LabBill_Order${order.labOrderId}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);

      },

      error: (err) => {
        console.log(err);
      }

    });

  }

  markingPaidFor = signal<number | null>(null);

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

}