import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { LabService } from '../../services/lab-service';
import { LabOrder } from '../../models/lab-order';

export type LabOrderStatus =
  'Ordered' | 'BillGenerated' | 'Paid' | 'SampleCollected' | 'Processing' | 'Completed';

@Component({
  selector: 'app-lab-orders',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './lab-orders.html',
  styleUrl: './lab-orders.scss'
})
export class LabOrdersComponent implements OnInit {

  statuses: LabOrderStatus[] = [
    'Ordered', 'BillGenerated', 'Paid', 'SampleCollected', 'Processing', 'Completed'
  ];

  orders = signal<LabOrder[]>([]);
  loading = signal(false);
  activeFilter = signal<'All' | LabOrderStatus>('All');
  searchTerm = signal('');

  filteredOrders = computed(() => {

    const filter = this.activeFilter();
    const term = this.searchTerm().trim().toLowerCase();

    let result = this.orders();

    if (filter !== 'All') {
      result = result.filter(o => o.status === filter);
    }

    if (term) {
      result = result.filter(o =>
    String(o.labOrderId).includes(term) ||
    String(o.consultationId).includes(term) ||
    (o.patientName ?? '').toLowerCase().includes(term) ||
    (o.mmrid ?? '').toLowerCase().includes(term) ||
    (o.phone ?? '').toLowerCase().includes(term) ||
    (o.status ?? '').toLowerCase().includes(term) ||
    (o.labOrderDetails ?? []).some(d =>
        (d.test?.testName ?? '').toLowerCase().includes(term)
    )
    );
    }

    return result;

  });

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

        // keep the open modal's data fresh after any change
        const openId = this.billModalOrder()?.labOrderId;
        if (openId) {
          const fresh = orders.find(o => o.labOrderId === openId);
          this.billModalOrder.set(fresh ?? null);
        }
      },

      error: () => {
        this.loading.set(false);
      }

    });

  }

  setFilter(filter: 'All' | LabOrderStatus): void {
    this.activeFilter.set(filter);
  }

  markSampleCollected(order: LabOrder): void {

    this.labService.updateOrderStatus(order.labOrderId, {
      sampleCollected: true,
      status: 'SampleCollected'
    }).subscribe({

      next: () => {
        this.loadOrders();
      },

      error: (err) => {
        console.log(err);
      }

    });

  }

  // ===============================
  // Generate / View Bill modal
  // ===============================

  billModalOrder = signal<LabOrder | null>(null);
  discountInput = signal(0);

  generatingBill = signal(false);
  markingPaid = signal(false);
  downloadingBill = signal(false);
  downloadingReport = signal(false);

  openBillModal(order: LabOrder): void {
    this.discountInput.set(0);
    this.billModalOrder.set(order);
  }

  closeBillModal(): void {
    this.billModalOrder.set(null);
  }

  hasBill(order: LabOrder | null): boolean {
    return !!(order?.labBills && order.labBills.length > 0);
  }

  getBill(order: LabOrder | null): any {
    return this.hasBill(order) ? order!.labBills![0] : null;
  }

  generateBill(): void {

    const order = this.billModalOrder();
    if (!order) return;

    this.generatingBill.set(true);

    this.labService.generateLabBill({
      labOrderId: order.labOrderId,
      discount: this.discountInput()
    }).subscribe({

      next: () => {
        this.generatingBill.set(false);
        this.loadOrders();
      },

      error: (err) => {
        console.log(err);
        this.generatingBill.set(false);
      }

    });

  }

  markPaid(): void {

    const order = this.billModalOrder();
    const bill = this.getBill(order);
    if (!bill) return;

    this.markingPaid.set(true);

    this.labService.updateBillPaymentStatus(bill.labBillId, 'Paid').subscribe({

      next: () => {
        this.markingPaid.set(false);
        this.loadOrders();
      },

      error: (err) => {
        console.log(err);
        this.markingPaid.set(false);
      }

    });

  }

  downloadBillPdf(): void {

    const order = this.billModalOrder();
    if (!order) return;

    this.downloadingBill.set(true);

    this.labService.downloadLabBill(order.labOrderId).subscribe({

      next: (blob: Blob) => {

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `LabBill_Order${order.labOrderId}.pdf`;
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

  downloadReportPdf(): void {

    const order = this.billModalOrder();
    if (!order) return;

    this.downloadingReport.set(true);

    this.labService.downloadLabReport(order.labOrderId).subscribe({

      next: (blob: Blob) => {

        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `LabReport_Order${order.labOrderId}.pdf`;
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

}