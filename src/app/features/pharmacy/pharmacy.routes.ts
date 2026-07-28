import { Routes } from '@angular/router';

export const PHARMACY_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/layout/layout').then((m) => m.Layout),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'inventory',
        loadComponent: () => import('./components/inventory/inventory').then((m) => m.Inventory),
      },
      {
        path: 'prescriptions',
        loadComponent: () =>
          import('./components/prescriptions/prescriptions').then((m) => m.Prescriptions),
      },
      {
        path: 'billing',
        loadComponent: () => import('./components/billing/billing').then((m) => m.Billing),
      },
    ],
  },
];
