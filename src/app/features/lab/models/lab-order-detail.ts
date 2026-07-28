import { LabResult } from "./lab-result";
import { LabTest } from "./lab-test";

export class LabOrderDetail {
  labOrderDetailId!: number;
  labOrderId!: number;
  testId!: number;
  test!: LabTest;
  labResults!: LabResult[];
}