// Maps to the LabTest scaffolded entity (as returned by GET /doctor/lab-tests)
export class LabTest {
    testId: number = 0;
    testCode: string = '';
    testName: string = '';
    department: string | null = null;
    category: string | null = null;
    sampleType: string | null = null;
    parameterName: string | null = null;
    normalRange: string | null = null;
    unit: string | null = null;
    baseFee: number = 0;
    reportDurationHours: number | null = null;
    description: string | null = null;
}