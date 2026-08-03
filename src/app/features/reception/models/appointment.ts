export class Appointment {
    appointmentId: number = 0;
    patientId: number = 0;
    patientName: string = '';
    doctorId: number = 0;
    doctorName: string = '';
    receptionistId: number = 1;   // Default value

    appointmentDate: string = '';   // yyyy-MM-dd
    timeSlot: string = '';
    tokenNumber: number = 0;
    status: string = 'Scheduled';
}