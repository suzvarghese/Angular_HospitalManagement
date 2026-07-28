import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LabService } from '../../services/lab-service';
import { LabOrder } from '../../models/lab-order';
import { LabTest } from '../../models/lab-test';
import { LabTestsModalComponent } from '../lab-tests-modal/lab-tests-modal';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, LabTestsModalComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class DashboardComponent implements OnInit {

  totalTests = signal(0);
  pendingOrders = signal(0);
  completedOrders = signal(0);
  reportsReady = signal(0);
  revenueTotal = signal(0);

  latestPendingOrder = signal<LabOrder | null>(null);
  latestCompletedOrder = signal<LabOrder | null>(null);

  showTestsModal = signal(false);

  loading = signal(false);

  constructor(private labService: LabService) {}

  openTestsModal(): void {
    this.showTestsModal.set(true);
  }

  closeTestsModal(): void {
    this.showTestsModal.set(false);
    // refresh the Total Tests count in case tests were added/edited/deleted
    this.loadDashboard();
  }

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {

    this.loading.set(true);

    this.labService.getLabTests().subscribe({
      next: (tests: LabTest[]) => this.totalTests.set(tests.length),
      error: (err) => console.log(err)
    });

    this.labService.getOrders().subscribe({

      next: (orders: LabOrder[]) => {

        // no 'Pending' status exists on LabOrder — pending means
        // anything still in progress (not yet Completed)
        this.pendingOrders.set(
          orders.filter(o => o.status !== 'Completed').length
        );

        const completed = orders.filter(o => o.status === 'Completed');
        this.completedOrders.set(completed.length);

        // "Reports ready" = same set the Lab Reports page shows
        this.reportsReady.set(completed.length);

        // Revenue = sum of paid bills attached to orders.
        // Note: LabOrder/labBills has no date field, so this is
        // total revenue from paid bills, not strictly "today".
        const revenue = orders
          .flatMap(o => o.labBills ?? [])
          .filter((b: any) => b.paymentStatus === 'Paid')
          .reduce((sum: number, b: any) => sum + (b.netAmount ?? 0), 0);

        this.revenueTotal.set(revenue);

        const pending = orders.filter(o => o.status !== 'Completed');
        this.latestPendingOrder.set(
          pending.length ? pending[pending.length - 1] : null
        );

        this.latestCompletedOrder.set(
          completed.length ? completed[completed.length - 1] : null
        );

        this.loading.set(false);
      },

      error: (err) => {
        console.log(err);
        this.loading.set(false);
      }

    });

  }

}