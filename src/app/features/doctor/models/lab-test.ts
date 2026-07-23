// Maps to the LabTest scaffolded entity (as returned by GET /doctor/lab-tests)
export class LabTest {
    TestId: number = 0;
    TestCode: string = '';
    TestName: string = '';
    Department: string | null = null;
    Category: string | null = null;
    SampleType: string | null = null;
    ParameterName: string | null = null;
    NormalRange: string | null = null;
    Unit: string | null = null;
    BaseFee: number = 0;
    ReportDurationHours: number | null = null;
    Description: string | null = null;
}