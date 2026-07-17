// Maps to LabOrderSummaryDto (nested inside ConsultationDetailDto)
export class LabOrderSummary {
    labOrderId: number = 0;
    orderDate: string | null = null;
    status: string | null = null;
    testId: number = 0;
    testName: string = '';
    department: string | null = null;
    baseFee: number = 0;
}