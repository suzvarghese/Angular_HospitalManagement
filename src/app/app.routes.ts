import { Routes } from '@angular/router';
import { authGuard } from './features/auth/guards/auth-guard';
import { Login } from './features/auth/components/login/login';

import { Doctor as DoctorDashboard } from './features/doctor/components/doctor/doctor';
import { AppointmentList } from './features/doctor/components/appointment-list/appointment-list';
import { PatientHistory } from './features/doctor/components/patient-history/patient-history';
import { ConsultationAdd } from './features/doctor/components/consultation-add/consultation-add';
import { ConsultationDetail } from './features/doctor/components/consultation-detail/consultation-detail';
import { LabTestOrder } from './features/doctor/components/lab-test-order/lab-test-order';

import { Dashboard as PharmacyDashboard } from './features/pharmacy/components/dashboard/dashboard';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
  },
  {
    path: 'doctor',
    component: DoctorDashboard,
    canActivate: [authGuard],
    data: { role: 'Doctor' },
  },
  {
    path: 'doctor/:doctorId/appointments',
    component: AppointmentList,
    canActivate: [authGuard],
    data: { role: 'Doctor' },
  },
  {
    path: 'doctor/patients/:patientId/history',
    component: PatientHistory,
    canActivate: [authGuard],
    data: { role: 'Doctor' },
  },
  {
    path: 'doctor/consultations/add',
    component: ConsultationAdd,
    canActivate: [authGuard],
    data: { role: 'Doctor' },
  },
  {
    path: 'doctor/consultations/:consultationId',
    component: ConsultationDetail,
    canActivate: [authGuard],
    data: { role: 'Doctor' },
  },
  {
    path: 'doctor/consultations/:consultationId/lab-tests',
    component: LabTestOrder,
    canActivate: [authGuard],
    data: { role: 'Doctor' },
  },
  {
    path: 'pharmacy',
    component: PharmacyDashboard,
    canActivate: [authGuard],
    data: { role: 'Pharmacist' },
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];