import { Component, OnInit, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { LabService } from '../../services/lab-service';
import { LabOrder } from '../../models/lab-order';
import { LabTest } from '../../models/lab-test';

@Component({
  selector: 'app-lab-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lab-layout.html',
  styleUrl: './lab-layout.scss'
})
export class LabLayoutComponent implements OnInit {

  totalTests = signal(0);
  pendingOrders = signal(0);
  completedOrders = signal(0);
  reportsReady = signal(0);
  revenueTotal = signal(0);

  constructor(
    private labService: LabService,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTopbarStats();
  }

  loadTopbarStats(): void {

    this.labService.getLabTests().subscribe({
      next: (tests: LabTest[]) => this.totalTests.set(tests.length),
      error: (err) => console.log(err)
    });

    this.labService.getOrders().subscribe({

      next: (orders: LabOrder[]) => {

        this.pendingOrders.set(
          orders.filter(o => o.status !== 'Completed').length
        );

        const completed = orders.filter(o => o.status === 'Completed');
        this.completedOrders.set(completed.length);
        this.reportsReady.set(completed.length);

        const revenue = orders
          .flatMap(o => o.labBills ?? [])
          .filter((b: any) => b.paymentStatus === 'Paid')
          .reduce((sum: number, b: any) => sum + (b.netAmount ?? 0), 0);

        this.revenueTotal.set(revenue);

      },

      error: (err) => console.log(err)

    });

  }

  goBack(): void {
    this.location.back();
  }

  logout(): void {

    // NOTE: this app has no login/authentication module yet.
    // This clears any locally stored session data and returns
    // to the dashboard. Wire this to a real auth service once
    // one exists in the project.
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/lab/dashboard']);
  }

}
