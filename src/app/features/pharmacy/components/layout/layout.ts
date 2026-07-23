import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { Pharmacy } from '../../services/pharmacy';
import { PharmacyDashboardStats } from '../../models/billing';

@Component({
  selector: 'app-pharmacy-layout',
  imports: [RouterLink, RouterLinkActive, RouterOutlet, DecimalPipe],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout implements OnInit {
  private readonly pharmacyService = inject(Pharmacy);

  readonly stats = signal<PharmacyDashboardStats | null>(null);
  readonly statsError = signal(false);

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.statsError.set(false);
    this.pharmacyService.getDashboard().subscribe({
      next: (data: any) => this.stats.set(data),
      error: () => this.statsError.set(true),
    });
  }
}
