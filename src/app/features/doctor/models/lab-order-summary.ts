// Maps to LabOrderSummaryDto (nested inside ConsultationDetailDto)
export class LabOrderSummary {
    LabOrderId: number = 0;
    OrderDate: string | null = null;
    Status: string | null = null;
    TestId: number = 0;
    TestName: string = '';
    Department: string | null = null;
    BaseFee: number = 0;
}