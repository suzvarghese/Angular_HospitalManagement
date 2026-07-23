// Maps to OrderLabTestsRequest (POST body for /doctor/lab-tests/order)
export class OrderLabTestsRequest {
    ConsultationId: number = 0;
    TestIds: number[] = [];
}