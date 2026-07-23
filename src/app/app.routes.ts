import { Routes } from '@angular/router';
import { authGuard } from './features/auth/guards/auth-guard';
import { Login } from './features/auth/components/login/login';
import { Dashboard } from './features/doctor/components/doctor/doctor';
import { AppointmentList } from './features/doctor/components/appointment-list/appointment-list';
import { PatientHistory } from './features/doctor/components/patient-history/patient-history';
import { ConsultationAdd } from './features/doctor/components/consultation-add/consultation-add';
import { ConsultationDetail } from './features/doctor/components/consultation-detail/consultation-detail';
import { LabTestOrder } from './features/doctor/components/lab-test-order/lab-test-order';

export const routes: Routes = [
  {
    // https://localhost:4200/login
    path: 'login',
    component: Login,
  },
  {
    // https://localhost:4200/doctor  -- landing page
    path: 'doctor',
    component: Dashboard,
    canActivate: [authGuard],
    data: { role: 'Doctor' },
  },
  {
    // https://localhost:4200/doctor/1/appointments
    path: 'doctor/:doctorId/appointments',
    component: AppointmentList,
    canActivate: [authGuard],
    data: { role: 'Doctor' },
  },
  {
    // https://localhost:4200/doctor/patients/5/history
    path: 'doctor/patients/:patientId/history',
    component: PatientHistory,
    canActivate: [authGuard],
    data: { role: 'Doctor' },
  },
  {
    // https://localhost:4200/doctor/consultations/add?appointmentId=..&doctorId=..&patientId=..
    path: 'doctor/consultations/add',
    component: ConsultationAdd,
    canActivate: [authGuard],
    data: { role: 'Doctor' },
  },
  {
    // https://localhost:4200/doctor/consultations/12
    path: 'doctor/consultations/:consultationId',
    component: ConsultationDetail,
    canActivate: [authGuard],
    data: { role: 'Doctor' },
  },
  {
    // https://localhost:4200/doctor/consultations/12/lab-tests
    path: 'doctor/consultations/:consultationId/lab-tests',
    component: LabTestOrder,
    canActivate: [authGuard],
    data: { role: 'Doctor' },
  },
  {
    // Default: send unauthenticated visitors to login
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  { path: '', redirectTo: 'pharmacy', pathMatch: 'full' },
  { path: 'pharmacy', loadChildren: () => import('./features/pharmacy/pharmacy.routes').then(m => m.PHARMACY_ROUTES) },
];
