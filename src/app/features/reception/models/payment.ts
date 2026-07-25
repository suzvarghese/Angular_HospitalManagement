// export interface Payment {
  //     paymentId: number;
  //     appointmentBillId?: number;
  //     pharmacyBillId?: number;
  //     labBillId?: number;
  //     receptionistId: number;
  //     paidAmount: number;
  //     paymentMethod: string;
  //     paidAt?: Date;
  //     status?: string;
  //   }
  
  
  
  export class Payment {
    PaymentId: number = 0;
    AppointmentBillId: number = 0;

    ReceptionistId: number = 1;   

    PaidAmount: number = 0;
    PaymentMethod: string = '';
    PaidAt: string = '';          // yyyy-MM-dd
    Status: string = '';
  }