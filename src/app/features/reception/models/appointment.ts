// export class Appointment {
//     AppointmentId: number = 0;
//     PatientId: number = 0;
//     PatientName: string = '';
//     DoctorId: number = 0;
//     DoctorName: string = '';
//     ReceptionistId: number = 0;   

//     AppointmentDate: string = '';   // yyyy-MM-dd
//     TimeSlot: string = '';
//     TokenNumber: number = 0;
//     Status: string = 'Scheduled';
// }



export class Appointment {
    AppointmentId: number = 0;
    PatientId: number = 0;
    PatientName: string = '';
    DoctorId: number = 0;
    DoctorName: string = '';
    ReceptionistId: number = 1;   // ← Important: Default value

    AppointmentDate: string = '';   // yyyy-MM-dd
    TimeSlot: string = '';
    TokenNumber: number = 0;
    Status: string = 'Scheduled';
}

