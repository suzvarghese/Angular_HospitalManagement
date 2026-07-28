// Maps to ConsultationHistoryItemDto
export class ConsultationHistoryItem {
    consultationId: number = 0;
    appointmentId: number = 0;
    doctorId: number = 0;
    doctorName: string = '';
    symptoms: string | null = null;
    diagnosis: string | null = null;
    notes: string | null = null;
    medicineName: string | null = null;
    dosage: string | null = null;
    frequency: string | null = null;
    duration: string | null = null;
    visitDate: string | null = null;
    consultationStatus: string | null = null;
}