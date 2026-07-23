import { Routes } from '@angular/router';
import { Dashboard } from './features/doctor/components/doctor/doctor';
import { AppointmentList } from './features/doctor/components/appointment-list/appointment-list';
import { PatientHistory } from './features/doctor/components/patient-history/patient-history';
import { ConsultationAdd } from './features/doctor/components/consultation-add/consultation-add';
import { ConsultationDetail } from './features/doctor/components/consultation-detail/consultation-detail';
import { LabTestOrder } from './features/doctor/components/lab-test-order/lab-test-order';

export const routes: Routes = [
  {
    // https://localhost:4200/doctor  -- landing page
    path: 'doctor',
    component: Dashboard,
  },
  {
    // https://localhost:4200/doctor/1/appointments
    path: 'doctor/:doctorId/appointments',
    component: AppointmentList,
  },
  {
    // https://localhost:4200/doctor/patients/5/history
    path: 'doctor/patients/:patientId/history',
    component: PatientHistory,
  },
  {
    // https://localhost:4200/doctor/consultations/add?appointmentId=..&doctorId=..&patientId=..
    path: 'doctor/consultations/add',
    component: ConsultationAdd,
  },
  {
    // https://localhost:4200/doctor/consultations/12
    path: 'doctor/consultations/:consultationId',
    component: ConsultationDetail,
  },
  {
    // https://localhost:4200/doctor/consultations/12/lab-tests
    path: 'doctor/consultations/:consultationId/lab-tests',
    component: LabTestOrder,
  },
  { path: '', redirectTo: 'pharmacy', pathMatch: 'full' },
  { path: 'pharmacy', loadChildren: () => import('./features/pharmacy/pharmacy.routes').then(m => m.PHARMACY_ROUTES) },
];
