// Maps to the DoctorQualification scaffolded entity (GET /doctor/{doctorId}/qualifications)
export class DoctorQualification {
    qualificationId: number = 0;
    doctorId: number = 0;
    qualificationName: string | null = null;
    institution: string | null = null;
    experienceYears: number | null = null;
}