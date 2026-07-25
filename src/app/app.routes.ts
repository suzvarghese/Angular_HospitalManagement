import { Routes } from '@angular/router';

import { LabLayoutComponent } from './features/lab/components/lab-layout/lab-layout';
import { DashboardComponent } from './features/lab/components/dashboard/dashboard';
import { LabTestList } from './features/lab/components/lab-test-list/lab-test-list';
import { AddLabTestComponent } from './features/lab/components/add-lab-test/add-lab-test';
import { EditLabTestComponent } from './features/lab/components/edit-lab-test/edit-lab-test';
import { LabOrdersComponent } from './features/lab/components/lab-orders/lab-orders';
import { LabOrderDetailsComponent } from './features/lab/components/lab-order-details/lab-order-details';
import { LabBillingComponent } from './features/lab/components/lab-billing/lab-billing';
import { LabReports } from './features/lab/components/lab-report/lab-reports';


export const routes: Routes = [

  {
    path: 'lab',
    component: LabLayoutComponent,
    children: [

      { path: 'dashboard', component: DashboardComponent, title: 'Dashboard - Syntax Lab' },
      { path: 'manage-tests', component: LabTestList, title: 'Lab Tests - Syntax Lab' },
      { path: 'add-test', component: AddLabTestComponent, title: 'Add Test - Syntax Lab' },
      { path: 'edit-test/:id', component: EditLabTestComponent, title: 'Edit Test - Syntax Lab' },
      { path: 'orders', component: LabOrdersComponent, title: 'Lab Orders - Syntax Lab' },
      { path: 'order-details/:id', component: LabOrderDetailsComponent, title: 'Order Details - Syntax Lab' },
      { path: 'billing', component: LabBillingComponent, title: 'Billing - Syntax Lab' },
      { path: 'reports', component: LabReports, title: 'Lab Reports - Syntax Lab' },

      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }

    ]
  },

  {
    path: '',
    redirectTo: 'lab/dashboard',
    pathMatch: 'full'
  }

];
