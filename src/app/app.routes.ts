import { Routes } from '@angular/router';
import { ReceptionLayout } from './features/reception/components/reception-layout/reception-layout';
import { Dashboard } from './features/reception/components/dashboard/dashboard';
import { PatientList } from './features/reception/components/patient/patient-list/patient-list';
import { PatientRegister } from './features/reception/components/patient/patient-register/patient-register';
import { PatientSearch } from './features/reception/components/patient/patient-search/patient-search';
import { PatientUpdate } from './features/reception/components/patient/patient-update/patient-update';
import { DoctorList } from './features/reception/components/doctor/doctor-list/doctor-list';
import { AppointmentList } from './features/reception/components/appointment/appointment-list/appointment-list';
import { AppointmentBook } from './features/reception/components/appointment/appointment-book/appointment-book';
import { BillList } from './features/reception/components/appointment-bill/bill-list/bill-list';
import { BillGenerate } from './features/reception/components/appointment-bill/bill-generate/bill-generate';
import { BillDetails } from './features/reception/components/appointment-bill/bill-details/bill-details';
import { PaymentHistory } from './features/reception/components/payment/payment-history/payment-history';
import { CollectPayment } from './features/reception/components/payment/collect-payment/collect-payment';
import { TodayQueue } from './features/reception/components/token-queue/today-queue/today-queue';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'reception',
        pathMatch: 'full'
    },
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
            { path: 'appointments', component: AppointmentList },
            { path: 'appointments/book', component: AppointmentBook },
            { path: 'bills', component: BillList },
            { path: 'bills/generate', component: BillGenerate },
            { path: 'bills/generate/:appointmentId', component: BillGenerate },
            // New: Bill Details page (AppointmentBillsController.Details(id) equivalent)
            { path: 'bills/details/:id', component: BillDetails },
            { path: 'payments', component: PaymentHistory },
            { path: 'payments/collect', component: CollectPayment },
            { path: 'token-queue', component: TodayQueue },
        ]
    },
];