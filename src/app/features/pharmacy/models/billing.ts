// Mirrors the billing/payment/dashboard DTOs from the Pharmacy API.

export interface PharmacyBillLine {
  pharmacyBillId: number;
  pharmacyId: number;
  medicineName: string;
  quantityGiven: number;
  unitPrice: number;
  medicineCharge: number;
  totalAmount: number;
  billDate: string | null;
  paymentStatus: string | null;
}

export interface ConsultationInvoice {
  consultationId: number;
  patientName: string;
  doctorName: string;
  items: PharmacyBillLine[];
  grandTotal: number;
  fullyPaid: boolean;
}

export interface PayBillRequest {
  receptionistId: number;
  paymentMethod: string;
  paidAmount?: number | null;
}

export interface PaymentResponse {
  paymentId: number;
  pharmacyBillId: number | null;
  paidAmount: number;
  paymentMethod: string;
  paidAt: string | null;
  status: string | null;
}

export interface PayResponse {
  message: string;
  payments: PaymentResponse[];
}

export interface PharmacyDashboardStats {
  totalMedicines: number;
  lowStockCount: number;
  expiringSoonCount: number;
  expiredCount: number;
  dispensedToday: number;
  revenueToday: number;
  pendingPaymentsAmount: number;
}

export type BillStatusFilter = 'all' | 'Pending' | 'Paid';
