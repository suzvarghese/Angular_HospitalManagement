export class Payment {
    paymentId: number = 0;
    appointmentBillId: number = 0;

    receptionistId: number = 1;

    paidAmount: number = 0;
    paymentMethod: string = '';
    paidAt: string = '';          // yyyy-MM-dd
    status: string = '';
}