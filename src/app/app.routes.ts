import { Routes } from '@angular/router';
import { authGuard } from './features/auth/guards/auth-guard';
import { Login } from './features/auth/components/login/login';

// ================= Reception =================
import { ReceptionLayout } from './features/reception/components/reception-layout/reception-layout';
import { Dashboard } from './features/reception/components/dashboard/dashboard';
import { PatientList } from './features/reception/components/patient/patient-list/patient-list';
import { PatientRegister } from './features/reception/components/patient/patient-register/patient-register';
import { PatientSearch } from './features/reception/components/patient/patient-search/patient-search';
import { PatientUpdate } from './features/reception/components/patient/patient-update/patient-update';
import { DoctorList } from './features/reception/components/doctor/doctor-list/doctor-list';
import { AppointmentBook } from './features/reception/components/appointment/appointment-book/appointment-book';
import { BillList } from './features/reception/components/appointment-bill/bill-list/bill-list';
import { BillGenerate } from './features/reception/components/appointment-bill/bill-generate/bill-generate';
import { BillDetails } from './features/reception/components/appointment-bill/bill-details/bill-details';
import { PaymentHistory } from './features/reception/components/payment/payment-history/payment-history';
import { CollectPayment } from './features/reception/components/payment/collect-payment/collect-payment';
import { TodayQueue } from './features/reception/components/token-queue/today-queue/today-queue';
import { AppointmentList as ReceptionAppointmentList } from './features/reception/components/appointment/appointment-list/appointment-list';

// ================= Doctor =================
import { Doctor as DoctorDashboard } from './features/doctor/components/doctor/doctor';
import { AppointmentList as DoctorAppointmentList } from './features/doctor/components/appointment-list/appointment-list';
import { PatientHistory } from './features/doctor/components/patient-history/patient-history';
import { ConsultationAdd } from './features/doctor/components/consultation-add/consultation-add';
import { ConsultationDetail } from './features/doctor/components/consultation-detail/consultation-detail';
import { LabTestOrder } from './features/doctor/components/lab-test-order/lab-test-order';

// ================= Lab =================
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
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: Login
  },

  // ================= Reception =================
  {
    path: 'reception',
    component: ReceptionLayout,
    children: [
      { path: '', component: Dashboard },
      { path: 'patients', component: PatientList },
      { path: 'patients/register', component: PatientRegister },
      { path: 'patients/search', component: PatientSearch },
      { path: 'patients/edit/:id', component: PatientUpdate },
      { path: 'doctors', component: DoctorList },
      { path: 'appointments', component: ReceptionAppointmentList },
      { path: 'appointments/book', component: AppointmentBook },
      { path: 'bills', component: BillList },
      { path: 'bills/generate', component: BillGenerate },
      { path: 'bills/generate/:appointmentId', component: BillGenerate },
      { path: 'bills/details/:id', component: BillDetails },
      { path: 'payments', component: PaymentHistory },
      { path: 'payments/collect', component: CollectPayment },
      { path: 'token-queue', component: TodayQueue }
    ]
  },

  // ================= Doctor =================
  {
    path: 'doctor',
    component: DoctorDashboard,
    canActivate: [authGuard],
    data: { role: 'Doctor' }
  },
  {
    path: 'doctor/:doctorId/appointments',
    component: DoctorAppointmentList,
    canActivate: [authGuard],
    data: { role: 'Doctor' }
  },
  {
    path: 'doctor/patients/:patientId/history',
    component: PatientHistory,
    canActivate: [authGuard],
    data: { role: 'Doctor' }
  },
  {
    path: 'doctor/consultations/add',
    component: ConsultationAdd,
    canActivate: [authGuard],
    data: { role: 'Doctor' }
  },
  {
    path: 'doctor/consultations/:consultationId',
    component: ConsultationDetail,
    canActivate: [authGuard],
    data: { role: 'Doctor' }
  },
  {
    path: 'doctor/consultations/:consultationId/lab-tests',
    component: LabTestOrder,
    canActivate: [authGuard],
    data: { role: 'Doctor' }
  },

  // ================= Pharmacy =================
  {
    path: 'pharmacy',
    canActivate: [authGuard],
    data: { role: 'Pharmacist' },
    loadChildren: () =>
      import('./features/pharmacy/pharmacy.routes').then(
        m => m.PHARMACY_ROUTES
      )
  },

  // ================= Lab =================
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
  }
];