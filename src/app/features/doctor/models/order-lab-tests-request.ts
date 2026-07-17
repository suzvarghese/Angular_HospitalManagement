// Maps to OrderLabTestsRequest (POST body for /doctor/lab-tests/order)
export class OrderLabTestsRequest {
    consultationId: number = 0;
    testIds: number[] = [];
}