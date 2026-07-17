import { LabOrderSummary } from './lab-order-summary';

// Maps to ConsultationDetailDto
export class ConsultationDetail {
    consultationId: number = 0;
    appointmentId: number = 0;
    doctorId: number = 0;
    doctorName: string = '';
    patientId: number = 0;
    patientName: string = '';
    mmrid: string = '';
    symptoms: string | null = null;
    diagnosis: string | null = null;
    notes: string | null = null;
    medicineName: string | null = null;
    dosage: string | null = null;
    frequency: string | null = null;
    duration: string | null = null;
    visitDate: string | null = null;
    consultationStatus: string | null = null;
    labOrders: LabOrderSummary[] = [];
}