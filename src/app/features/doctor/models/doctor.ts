// Maps to the Doctor scaffolded entity on the backend
export class Doctor {
    doctorId: number = 0;
    userId: number = 0;
    doctorName: string = '';
    specialization: string | null = null;
    phone: string | null = null;
    consultationFee: number | null = null;
    isActive: boolean = true;
}

// Maps to the DoctorQualification scaffolded entity
export class DoctorQualification {
    qualificationId: number = 0;
    doctorId: number = 0;
    qualificationName: string | null = null;
    institution: string | null = null;
    experienceYears: number | null = null;
}

// Maps to AppointmentQueueDto (today/tomorrow appointment list)
export class AppointmentQueue {
    appointmentId: number = 0;
    patientId: number = 0;
    patientName: string = '';
    mmrid: string = '';
    age: number = 0;
    gender: string = '';
    phone: string = '';
    appointmentDate: string = '';
    timeSlot: string = '';
    tokenNumber: number | null = null;
    queuePosition: number | null = null;
    status: string | null = null;
}

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

// Maps to LabOrderSummaryDto (nested inside ConsultationDetail)
export class LabOrderSummary {
    labOrderId: number = 0;
    orderDate: string | null = null;
    status: string | null = null;
    testId: number = 0;
    testName: string = '';
    department: string | null = null;
    baseFee: number = 0;
}

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

// Maps to LabTest scaffolded entity (test catalog)
export class LabTest {
    testId: number = 0;
    testCode: string = '';
    testName: string = '';
    department: string | null = null;
    category: string | null = null;
    sampleType: string | null = null;
    parameterName: string | null = null;
    normalRange: string | null = null;
    unit: string | null = null;
    baseFee: number = 0;
    reportDurationHours: number | null = null;
    description: string | null = null;
}

// Maps to AvailableMedicineDto (stock-aware prescribing dropdown)
export class AvailableMedicine {
    inventoryId: number = 0;
    medicineName: string = '';
    batchNumber: string = '';
    expiryDate: string = '';
    availableStock: number = 0;
    unitPrice: number = 0;
}

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

// Maps to AddConsultationResult (response from POST /doctor/consultations)
export class AddConsultationResult {
    consultationId: number = 0;
    consultationFee: number = 0;
}

// Maps to OrderLabTestsRequest (POST body for /doctor/lab-tests/order)
export class OrderLabTestsRequest {
    consultationId: number = 0;
    testIds: number[] = [];
}
