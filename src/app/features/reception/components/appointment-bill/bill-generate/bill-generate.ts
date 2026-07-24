import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Appointment } from '../../../models/appointment';
import { Appointment as AppointmentService } from '../../../services/appointment';
import { Doctor } from '../../../models/doctor';
import { Doctor as DoctorService } from '../../../services/doctor';
import { AppointmentBill } from '../../../models/appointment-bill';
import { AppointmentBill as AppointmentBillService } from '../../../services/appointment-bill';

@Component({
  selector: 'app-bill-generate',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './bill-generate.html',
  styleUrl: './bill-generate.scss',
})
export class BillGenerate implements OnInit {

  // The appointment this bill is being generated for (resolved directly by id,
  // matching AppointmentBillsController.GenerateBill(int id) - no dropdown)
  appointmentId: number = 0;
  appointment: Appointment | null = null;

  // Bill fields
  registrationFee: number = 0;
  consultationFee: number = 0;
  billDate: string = '';

  // State
  isLoading = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  loadingMessage = signal<string>('Loading...');
savingMessage = signal<string>('Generating...');
  successMessage = signal<string>('');
  errorMessage = signal<string>('');

  // True when no appointment id was supplied at all (direct nav with no context)
  noAppointmentSelected = signal<boolean>(false);

  // True when a bill already exists for this appointment (duplicate check)
  billAlreadyExists = signal<boolean>(false);

  // The bill that was just generated (shown after a successful save)
  generatedBill = signal<AppointmentBill | null>(null);

  constructor(
    private appointmentService: AppointmentService,
    private doctorService: DoctorService,
    private appointmentBillService: AppointmentBillService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.billDate = new Date().toISOString().split('T')[0];

    // Support both navigation styles used across the app:
    // - path param: ['/reception/bills/generate', appointmentId]  (appointment-list.ts, today-queue.ts)
    // - query param: queryParams: { appointmentId }                (appointment-book.ts)
    this.appointmentId =
      Number(this.route.snapshot.paramMap.get('appointmentId')) ||
      Number(this.route.snapshot.queryParamMap.get('appointmentId')) ||
      0;

    if (!this.appointmentId) {
      this.noAppointmentSelected.set(true);
      return;
    }

    this.loadAppointmentAndCheckDuplicate();
  }

  // GET : mirrors AppointmentBillsController.GenerateBill(id)
  loadAppointmentAndCheckDuplicate(): void {
    this.isLoading.set(true);
    this.loadingMessage.set('Loading appointment details...');
    this.errorMessage.set('');

    this.appointmentService.getAppointmentById(this.appointmentId).subscribe({
      next: (appt: Appointment) => {
        this.appointment = appt;
        this.checkDuplicateBill();
      },
      error: (err: any) => {
        console.log(err);
        this.isLoading.set(false);
        this.errorMessage.set('Appointment not found.');
      }
    });
  }

  // Duplicate check: no GET appointmentbills/{id} endpoint exists, so check against
  // the full bill list (same rule as _billServices.BillExistsForAppointment(id))
  private checkDuplicateBill(): void {
    this.loadingMessage.set('Checking for an existing bill...');
    this.appointmentBillService.getAllAppointmentBills().subscribe({
      next: (bills: AppointmentBill[]) => {
        const exists = bills.some(b => b.AppointmentId === this.appointmentId);

        if (exists) {
          this.billAlreadyExists.set(true);
          this.isLoading.set(false);
          return;
        }

        this.loadConsultationFee();
      },
      error: (err: any) => {
        console.log(err);
        this.isLoading.set(false);
        this.errorMessage.set('Failed to check existing bills.');
      }
    });
  }

  // Auto-fill fees: Registration Fee defaults to 100, Consultation Fee comes from
  // the appointment's doctor (mirrors _billServices.GetConsultationFeeByAppointment(id))
  private loadConsultationFee(): void {
    this.loadingMessage.set('Loading consultation fee...');
    this.doctorService.getAllDoctors().subscribe({
      next: (doctors: Doctor[]) => {
        const doctor = doctors.find(d => d.DoctorId === this.appointment?.DoctorId);

        this.registrationFee = 100;
        this.consultationFee = doctor?.ConsultationFee ?? 0;

        this.isLoading.set(false);
      },
      error: (err: any) => {
        console.log(err);
        // Still let the receptionist proceed and enter fees manually
        this.registrationFee = 100;
        this.consultationFee = 0;
        this.isLoading.set(false);
      }
    });
  }

  // Automatically calculate Total Amount
  get totalAmount(): number {
    return (Number(this.registrationFee) || 0) + (Number(this.consultationFee) || 0);
  }

  // POST : mirrors AppointmentBillsController.GenerateBill(AppointmentBill)
  generateBill(billForm: NgForm): void {
    this.successMessage.set('');
    this.errorMessage.set('');

    if (!this.appointment) {
      this.errorMessage.set('No appointment selected.');
      return;
    }
    if (!this.registrationFee || this.registrationFee <= 0) {
      this.errorMessage.set('Please enter a valid Registration Fee');
      return;
    }
    if (!this.consultationFee || this.consultationFee <= 0) {
      this.errorMessage.set('Please enter a valid Consultation Fee');
      return;
    }

    const bill: AppointmentBill = new AppointmentBill();
    bill.AppointmentId = this.appointmentId;
    bill.RegistrationFee = this.registrationFee;
    bill.ConsultationFee = this.consultationFee;
    bill.TotalAmount = this.totalAmount;
    bill.BillDate = this.billDate;        // set automatically
    bill.PaymentStatus = 'Pending';       // default

    this.isSaving.set(true);
    this.savingMessage.set('Checking for an existing bill...');
    this.savingMessage.set('Generating bill...');

    this.appointmentBillService.generateBill(bill).subscribe({


      // next: (response: AppointmentBill) => {
      //   this.isSaving.set(false);
      //   this.successMessage.set('Bill generated successfully!');

      //   // Show the generated bill instead of resetting immediately
      //   this.generatedBill.set(response);
      // },
      next: (response: AppointmentBill) => {

        this.isSaving.set(false);
    
        this.successMessage.set('Bill generated successfully!');
    
        this.generatedBill.set(response);
    
        // Open the generated bill directly
        this.router.navigate([
            '/reception/bills/details',
            response.AppointmentBillId
        ]);
    
    },


      error: (err: any) => {
        console.log(err);
        this.isSaving.set(false);
        this.errorMessage.set('Sorry! Failed to generate bill');
      }
    });
  }

  // Move on to collecting payment for the bill just generated
  goCollectPayment(): void {
    const billId = this.generatedBill()?.AppointmentBillId ?? 0;
    this.router.navigate(['/reception/payments/collect'], {
      queryParams: { billId }
    });
  }
}