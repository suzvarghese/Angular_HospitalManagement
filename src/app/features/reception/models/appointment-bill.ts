export class AppointmentBill { 
    AppointmentBillId: number = 0;
    AppointmentId: number = 0;
    RegistrationFee: number = 0;
    ConsultationFee: number = 0;
    TotalAmount: number = 0;
    BillDate: string = '';          // yyyy-MM-dd
    PaymentStatus: string = 'Pending';
}

