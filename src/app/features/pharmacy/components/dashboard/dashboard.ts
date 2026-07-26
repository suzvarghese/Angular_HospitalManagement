import { Component, inject, OnInit, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Pharmacy } from '../../services/pharmacy';
import { PharmacyDashboardStats } from '../../models/billing';
import { InventoryItem } from '../../models/inventory';

@Component({
  selector: 'app-dashboard',
  imports: [DecimalPipe, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private readonly pharmacyService = inject(Pharmacy);

  readonly stats = signal<PharmacyDashboardStats | null>(null);
  readonly lowStock = signal<InventoryItem[]>([]);
  readonly expiringSoon = signal<InventoryItem[]>([]);
  readonly loading = signal(true);
  readonly loadError = signal(false);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.loadError.set(false);

    this.pharmacyService.getDashboard().subscribe({
      next: (data) => this.stats.set(data),
      error: () => this.loadError.set(true),
    });

    this.pharmacyService.getLowStock().subscribe({
      next: (data) => this.lowStock.set(data.slice(0, 5)),
    });

    this.pharmacyService.getExpiringSoon(30).subscribe({
      next: (data) => {
        this.expiringSoon.set(data.slice(0, 5));
        this.loading.set(false);
      },
      error: () => {
        this.loadError.set(true);
        this.loading.set(false);
      },
    });
  }
}
