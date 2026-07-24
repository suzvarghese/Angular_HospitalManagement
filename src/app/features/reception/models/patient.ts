export class Patient {
    PatientId: number = 0;
    Mmrid: string = '';
    PatientName: string = '';
    DateOfBirth: string | null = null; // yyyy-MM-dd, sent/received as DateOnly
    Age: number = 0;
    Gender: string = '';
    Phone: string = '';
    Address: string = '';
    BloodGroup: string = '';
    EmergencyContact: string = '';
    IsActive: boolean = true;
}

