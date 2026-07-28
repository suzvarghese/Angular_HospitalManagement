import { LabOrderDetail } from "./lab-order-detail";
import { LabTechnician } from "./lab-technician";

export class LabOrder {

  labOrderId!: number;
  consultationId!: number;

  patientId?: number;
  patientName?: string;

  mmrid?: string;
  phone?: string;

  age?: number;
  gender?: string;

  orderDate?: string;

  assignedTechnicianId?: number;
  sampleCollected?: boolean;
  sampleCollectedDate?: string;

  status?: string;

  assignedTechnician?: LabTechnician;

  labOrderDetails!: LabOrderDetail[];

  labBills?: any[];

  doctorName?: string;
}