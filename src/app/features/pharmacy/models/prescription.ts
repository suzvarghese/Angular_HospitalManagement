export interface Prescription {

  prescriptionId:number;

  patientId:number;

  patientName:string;

  doctorName:string;

  medicineName:string;

  dosage:string;

  quantity:number;

  instructions:string;

  prescribedDate:Date;

  status:string;
}
// Mirrors the prescription/dispensing DTOs from the Pharmacy API.

export interface DispensedItem {
  pharmacyId: number;
  inventoryId: number;
  medicineName: string;
  pharmacistName: string;
  quantityGiven: number;
  unitPrice: number;
  totalPrice: number;
  dispenseStatus: string | null;
  dispensedDate: string | null;
  pharmacyBillId: number | null;
  paymentStatus: string | null;
}

export interface Prescription {
  consultationId: number;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  diagnosis: string | null;
  notes: string | null;
  prescribedMedicineName: string | null;
  prescribedDosage: string | null;
  prescribedFrequency: string | null;
  prescribedDuration: string | null;
  consultationStatus: string | null;
  dispensedItems: DispensedItem[];
  totalDispensedAmount: number;
}

export interface DispenseItemRequest {
  inventoryId: number | null;
  quantityGiven: number | null;
}

export interface DispenseBatch {
  consultationId: number;
  userId: number;
  pharmacistName: string;
  items: DispenseItemRequest[];
}

export interface DispenseResponse {
  message: string;
  items: DispensedItem[];
}
export interface PrescriptionQueueItem {
  consultationId: number;
  patientName: string;
  doctorName: string;
  prescribedMedicineName: string | null;
  prescribedDosage: string | null;
  visitDate: string | null;
  consultationStatus: string | null;
  isFulfilled: boolean;
}
