export class Patient {
    patientId: number = 0;
    mmrid: string = '';
    patientName: string = '';
    dateOfBirth: string | null = null; // yyyy-MM-dd
    age: number = 0;
    gender: string = '';
    phone: string = '';
    address: string = '';
    bloodGroup: string = '';
    emergencyContact: string = '';
    isActive: boolean = true;
}