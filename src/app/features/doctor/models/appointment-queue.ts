// Maps to AppointmentQueueDto
export class AppointmentQueue {
    appointmentId: number = 0;
    patientId: number = 0;
    patientName: string = '';
    mmrid: string = '';
    age: number = 0;
    gender: string = '';
    phone: string = '';
    appointmentDate: string = '';   // DateOnly -> ISO date string, e.g. "2026-07-17"
    timeSlot: string = '';
    tokenNumber: number | null = null;
    queuePosition: number | null = null;
    status: string | null = null;
}