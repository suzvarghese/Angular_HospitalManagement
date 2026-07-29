export class AppointmentBill {
    appointmentBillId: number = 0;
    appointmentId: number = 0;
    registrationFee: number = 0;
    consultationFee: number = 0;
    totalAmount: number = 0;
    billDate: string = '';          // yyyy-MM-dd
    paymentStatus: string = 'Pending';
}