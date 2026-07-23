import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'pharmacy', pathMatch: 'full' },
  { path: 'pharmacy', loadChildren: () => import('./features/pharmacy/pharmacy.routes').then(m => m.PHARMACY_ROUTES) },
];
