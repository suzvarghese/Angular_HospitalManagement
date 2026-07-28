// Maps to AddConsultationRequest (POST body for /doctor/consultations)
export class AddConsultationRequest {
    appointmentId: number = 0;
    doctorId: number = 0;
    patientId: number = 0;
    symptoms: string | null = null;
    diagnosis: string = '';
    notes: string | null = null;
    medicineName: string | null = null;
    dosage: string | null = null;
    frequency: string | null = null;
    duration: string | null = null;
    registrationFee: number = 100;
}