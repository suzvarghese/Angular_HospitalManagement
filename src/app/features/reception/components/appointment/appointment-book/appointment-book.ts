// import { CommonModule } from '@angular/common';
// import { Component, OnInit, signal } from '@angular/core';
// import { FormsModule, NgForm } from '@angular/forms';
// import { ActivatedRoute, Router, RouterLink } from '@angular/router';
// import { Patient } from '../../../models/patient';
// import { Doctor } from '../../../models/doctor';
// import { Appointment } from '../../../models/appointment';
// import { Patient as PatientService } from '../../../services/patient';
// import { Doctor as DoctorService } from '../../../services/doctor';
// import { Appointment as AppointmentService } from '../../../services/appointment';
// import {
//   Session,
//   getSlotsForSession,
//   slotToDate,
//   todayStr,
//   tomorrowStr,
// } from '../../../utils/appointment-slots';

// @Component({
//   selector: 'app-appointment-book',
//   standalone: true,
//   imports: [CommonModule, FormsModule,RouterLink],
//   templateUrl: './appointment-book.html',
//   styleUrl: './appointment-book.scss',
// })
// export class AppointmentBook implements OnInit {

//   // 1 - Search
//   searchValue: string = '';
//   searchError = signal<string>('');
//   isSearching = signal<boolean>(false);

//   // 2 - Patient
//   patient: Patient | null = null;

//   // 3/4 - Doctors
//   doctors: Doctor[] = [];
//   selectedDoctorId: number = 0;
//   selectedDoctor: Doctor | null = null;

//   // 5 - Date: only Today or Tomorrow, like the old MVC rule
//   today: string = todayStr();
//   tomorrow: string = tomorrowStr();
//   appointmentDate: string = '';

//   // 6 - Session + time slot
//   session: Session = 'FN';
//   availableSlots: string[] = [];
//   selectedSlot: string = '';
//   slotHint = signal<string>('Select doctor and date first to see availability');

//   // All appointments, used purely to know which slots are already booked
//   private allAppointments: Appointment[] = [];
//   private slotsLoaded = false;

//   // Messages
//   successMessage = signal<string>('');
//   errorMessage = signal<string>('');
//   isBooking = signal<boolean>(false);

//   // Post-booking "Generate Bill?" prompt (ConfirmBills.cshtml equivalent)
//   bookedAppointmentId = signal<number>(0);
//   askGenerateBill = signal<boolean>(false);

//   constructor(
//     private patientService: PatientService,
//     private doctorService: DoctorService,
//     private appointmentService: AppointmentService,
//     private router: Router,
//     private route: ActivatedRoute
//   ) { }

//   ngOnInit(): void {
//     this.appointmentDate = this.today;

//     // If arriving from Search Patient with ?patientId=..., preselect that
//     // patient using the SAME searchPatient() method/API already used by the
//     // manual search box above - no new API, no duplicate logic.
//     const patientId = this.route.snapshot.queryParamMap.get('patientId');
//     if (patientId) {
//       this.searchValue = patientId;
//       this.searchPatient();
//     }
//   }

//   // 1 - Search Patient (MMR ID or Phone)
//   searchPatient(): void {
//     this.searchError.set('');
//     this.successMessage.set('');
//     this.errorMessage.set('');
//     this.patient = null;

//     if (!this.searchValue || !this.searchValue.trim()) {
//       this.searchError.set('Please enter MMR ID or Phone Number');
//       return;
//     }

//     this.isSearching.set(true);

//     this.patientService.searchPatient(this.searchValue.trim()).subscribe({
//       next: (response: Patient) => {
//         this.isSearching.set(false);

//         if (!response) {
//           this.searchError.set('Patient not found');
//           return;
//         }

//         // 2 - Display patient details
//         this.patient = response;

//         // 3 - Load available doctors + all appointments (for slot conflicts)
//         this.loadDoctors();
//         this.loadAllAppointments();
//       },
//       error: (err: any) => {
//         console.log(err);
//         this.isSearching.set(false);
//         this.searchError.set('Patient not found');
//       }
//     });
//   }

//   // 3 - Load All Doctors
//   loadDoctors(): void {
//     if (this.doctors.length > 0) {
//       return;
//     }

//     this.doctorService.getAllDoctors().subscribe({
//       next: (response: Doctor[]) => {
//         this.doctors = response;
//       },
//       error: (err: any) => {
//         console.log(err);
//         this.errorMessage.set('Failed to load doctors');
//       }
//     });
//   }

//   // Load all appointments once, so we can exclude already-booked slots client-side
//   loadAllAppointments(): void {
//     this.appointmentService.getAllAppointments().subscribe({
//       next: (response: Appointment[]) => {
//         this.allAppointments = response;
//         this.slotsLoaded = true;
//         this.populateSlots();
//       },
//       error: (err: any) => {
//         console.log(err);
//         this.slotsLoaded = true;
//         this.populateSlots();
//       }
//     });
//   }

//   // 4 - Select Doctor
//   onDoctorChange(): void {
//     this.selectedDoctor = this.doctors.find(
//       doc => doc.DoctorId === Number(this.selectedDoctorId)
//     ) ?? null;
//     this.populateSlots();
//   }

//   // 5 - Select Date (Today / Tomorrow only)
//   onDateChange(date: string): void {
//     this.appointmentDate = date;
//     this.populateSlots();
//   }

//   // 6 - Select Session (Forenoon / Afternoon)
//   onSessionChange(session: Session): void {
//     this.session = session;
//     this.populateSlots();
//   }

//   // Rebuild the time-slot dropdown: session slots minus already-booked slots
//   // for this doctor+date, minus past slots if the date is today.
//   populateSlots(): void {
//     this.selectedSlot = '';
//     this.availableSlots = [];

//     if (!this.selectedDoctor || !this.appointmentDate) {
//       this.slotHint.set('Select doctor and date first to see availability');
//       return;
//     }

//     const bookedSlots = this.allAppointments
//       .filter(a =>
//         a.DoctorId === this.selectedDoctor!.DoctorId &&
//         a.AppointmentDate === this.appointmentDate &&
//         a.Status !== 'Cancelled'
//       )
//       .map(a => a.TimeSlot);

//     const isToday = this.appointmentDate === this.today;
//     const now = new Date();

//     const slots = getSlotsForSession(this.session).filter(slot => {
//       if (bookedSlots.includes(slot)) return false;
//       if (isToday && slotToDate(this.appointmentDate, slot) <= now) return false;
//       return true;
//     });

//     this.availableSlots = slots;

//     if (!this.slotsLoaded) {
//       this.slotHint.set('Checking availability...');
//     } else if (slots.length === 0) {
//       this.slotHint.set('No available slots. Try another session or date.');
//     } else {
//       this.slotHint.set(`Available Slots: ${slots.length}`);
//     }
//   }

//   // 7 - Book Appointment
//   bookAppointment(bookingForm: NgForm): void {
//     this.successMessage.set('');
//     this.errorMessage.set('');

//     if (!this.patient) {
//       this.errorMessage.set('Please search and select a patient first');
//       return;
//     }
//     if (!this.selectedDoctor) {
//       this.errorMessage.set('Please select a doctor');
//       return;
//     }
//     if (!this.appointmentDate) {
//       this.errorMessage.set('Please select an appointment date');
//       return;
//     }
//     if (!this.selectedSlot) {
//       this.errorMessage.set('Please select a time slot');
//       return;
//     }

//     const appointment = new Appointment();

//     appointment.PatientId = this.patient.PatientId;
//     appointment.DoctorId = this.selectedDoctor.DoctorId;
//     appointment.ReceptionistId = 1;
//     appointment.AppointmentDate = this.appointmentDate;
//     appointment.TimeSlot = this.selectedSlot;
//     appointment.Status = 'Booked';

//     this.isBooking.set(true);

//     this.appointmentService.bookAppointment(appointment).subscribe({
//       next: (response: any) => {
//         this.isBooking.set(false);

//         // 8 - Show success + 9 - ask whether to generate a bill now
//         this.successMessage.set('Appointment booked successfully!');
//         this.bookedAppointmentId.set(response?.AppointmentId ?? 0);
//         this.askGenerateBill.set(true);

//         bookingForm.resetForm();
//       },
//       error: (err: any) => {

//         console.log('STATUS:', err.status);
//         console.log('ERROR:', err.error);
//         console.log('FULL:', err);
      
//         this.isBooking.set(false);
      
//         this.errorMessage.set(
//           err.error?.title ||
//           err.error?.message ||
//           JSON.stringify(err.error)
//         );
//       }
//     });
//   }

//   // "Yes" - go generate a bill for the appointment just booked (AppointmentBillsController.GenerateBill)
//   goGenerateBill(): void {

//     this.askGenerateBill.set(false);

//     this.router.navigate(
//       ['/reception/bills/generate'],
//       {
//         queryParams: {
//           appointmentId: this.bookedAppointmentId()
//         }
//       }
//     );
// }

//   // "No" - go to Today's Queue, matching ConfirmBills.cshtml's "Skip for Now" -> TodayAppointments
//   skipGenerateBill(): void {
//     this.askGenerateBill.set(false);
//     this.resetSearchAndDoctorState();
//     this.router.navigate(['/reception/token-queue']);
//   }

//   // Reset the search/patient/doctor state (form fields already reset on submit)
//   resetSearchAndDoctorState(): void {
//     this.searchValue = '';
//     this.searchError.set('');
//     this.patient = null;
//     this.doctors = [];
//     this.allAppointments = [];
//     this.slotsLoaded = false;
//     this.selectedDoctorId = 0;
//     this.selectedDoctor = null;
//     this.appointmentDate = this.today;
//     this.session = 'FN';
//     this.availableSlots = [];
//     this.selectedSlot = '';
//   }
// }



import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Appointment } from '../../../models/appointment';
import { Appointment as AppointmentService } from '../../../services/appointment';
import { Doctor } from '../../../services/doctor';
import { Patient as PatientService } from '../../../services/patient';

import { generateTimeSlots,slotToDate} from '../../../utils/appointment-slots';

// A small in-app confirm dialog (replaces the plain browser confirm()) so
// warnings look like part of the app instead of a system popup.
interface ConfirmModalState {
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
}

@Component({
  selector: 'app-appointment-book',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './appointment-book.html',
  styleUrl: './appointment-book.scss'
})
export class AppointmentBook implements OnInit {

  appointment: Appointment = new Appointment();
  doctors: any[] = [];
  patients: any[] = [];
  timeSlots: string[] = [];

  // All appointments (excluding cancelled) - used to filter out slots the
  // selected doctor is already booked for, and to count how many times the
  // selected patient has already booked on the selected date.
  private allAppointments: Appointment[] = [];
  
  todayDate: string = new Date().toISOString().split('T')[0];
  tomorrowDate: string = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  selectedPatientName: string = '';   

  isLoading = false;
  successMessage = '';
  errorMessage = '';

  // --- Same-patient conflict awareness (updates live as the receptionist fills the form) ---
  // Every non-cancelled appointment this patient already has on the selected date.
  patientTodayAppointments: Appointment[] = [];
  // Set when the patient already has an appointment with the SAME doctor on this date.
  sameDoctorConflict: Appointment | null = null;
  // Set when the patient already has an appointment at the exact same time slot (any doctor).
  duplicateSlotConflict: Appointment | null = null;

  // Custom confirm dialog state - null means hidden.
  confirmModal: ConfirmModalState | null = null;

  constructor(
    private appointmentService: AppointmentService,
    private doctorService: Doctor,
    private patientService: PatientService,
    public router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadDoctors();
    this.loadPatients();
    this.loadAllAppointments();
    // this.generateTimeSlots();
    this.populateAvailableSlots();

    this.route.queryParams.subscribe(params => {
      if (params['patientId']) {
        this.appointment.patientId = +params['patientId'];
        this.preFillPatientName(+params['patientId']);
        this.refreshPatientConflicts();
      }
    });
  }

  // Load all appointments once, so we can filter out doctor slot conflicts
  // and count same-day patient bookings client-side (no new API needed).
  loadAllAppointments(): void {
    this.appointmentService.getAllAppointments().subscribe({
      next: (data) => {
        this.allAppointments = data || [];
        this.populateAvailableSlots();
        this.refreshPatientConflicts();
      },
      error: (err) => console.error('Appointment load error', err)
    });
  }

  // Recomputes what (if anything) this patient already has booked on the
  // selected date, so the template can show a live warning banner and the
  // submit handler can block/confirm real conflicts. Called whenever the
  // patient, doctor, date, or time slot changes.
  refreshPatientConflicts(): void {
    this.patientTodayAppointments = [];
    this.sameDoctorConflict = null;
    this.duplicateSlotConflict = null;

    const patientId = +this.appointment.PatientId;
    if (!patientId || !this.appointment.AppointmentDate) {
      return;
    }

    this.patientTodayAppointments = this.allAppointments.filter(a =>
      a.PatientId === patientId &&
      a.AppointmentDate === this.appointment.AppointmentDate &&
      a.Status !== 'Cancelled'
    );

    const doctorId = +this.appointment.DoctorId;
    if (doctorId) {
      this.sameDoctorConflict = this.patientTodayAppointments.find(a => a.DoctorId === doctorId) ?? null;
    }

    if (this.appointment.TimeSlot) {
      this.duplicateSlotConflict = this.patientTodayAppointments.find(a => a.TimeSlot === this.appointment.TimeSlot) ?? null;
    }
  }

  // Fired from the Patient <select> on change.
  onPatientChange(): void {
    this.refreshPatientConflicts();
  }

  // Fired from the Time Slot <select> on change.
  onTimeSlotChange(): void {
    this.refreshPatientConflicts();
  }

  // Best-effort doctor name lookup, used when an appointment record from the
  // API doesn't already carry a DoctorName.
  doctorNameFor(appt: Appointment | null): string {
    if (!appt) return '';
    if (appt.DoctorName) return appt.DoctorName;
    const doc = this.doctors.find((d: any) => d.DoctorId === appt.DoctorId);
    return doc ? (doc.DoctorName || doc.Name || '') : `Doctor #${appt.DoctorId}`;
  }

  private preFillPatientName(patientId: number) {
    this.patientService.getAllPatients().subscribe({
      next: (allPatients) => {
        const patient = allPatients.find(p => p.patientId === patientId);
        if (patient) {
          this.selectedPatientName = `${patient.patientName} (${patient.mmrid})`;
        }
      }
    });
  }

  loadDoctors(): void {
    this.doctorService.getAllDoctors().subscribe({
      next: (data) => this.doctors = data || [],
      error: (err) => console.error('Doctor load error', err)
    });
  }
  // For Available Slots
  populateAvailableSlots(): void {

    this.timeSlots = generateTimeSlots('09:00', '18:00');

    // Today's bookings only
    if (this.appointment.appointmentDate === this.todayDate) {

        const now = new Date();

        this.timeSlots = this.timeSlots.filter(slot => {

            const slotTime = slotToDate(this.todayDate, slot);

            return slotTime > now;

        });

    }

    // Remove slots the selected doctor is already booked for on the
    // selected date, so two receptionists can't double-book the same
    // doctor at the same time (Status !== 'Cancelled' - a cancelled
    // appointment frees the slot back up).
    if (this.appointment.DoctorId && this.appointment.AppointmentDate) {

        const bookedSlots = this.allAppointments
            .filter(a =>
                a.DoctorId === +this.appointment.DoctorId &&
                a.AppointmentDate === this.appointment.AppointmentDate &&
                a.Status !== 'Cancelled'
            )
            .map(a => a.TimeSlot);

        this.timeSlots = this.timeSlots.filter(slot => !bookedSlots.includes(slot));

        // The previously-selected slot may no longer be valid (doctor/date changed) - clear it.
        if (this.appointment.TimeSlot && !this.timeSlots.includes(this.appointment.TimeSlot)) {
            this.appointment.TimeSlot = '';
        }
    }

    this.refreshPatientConflicts();
}

  loadPatients(): void {
    this.patientService.getAllPatients().subscribe({
      next: (data) => this.patients = data || [],
      error: (err) => console.error('Patient load error', err)
    });
  }

  // generateTimeSlots(): void {
  //   this.timeSlots = [
  //     '09:00 AM','09:15 AM','09:30 AM','09:45 AM','10:00 AM','10:15 AM','10:30 AM','10:45 AM',
  //     '11:00 AM','11:15 AM','11:30 AM','11:45 AM','12:00 PM','12:15 PM','12:30 PM','12:45 PM',
  //     '02:00 PM','02:15 PM','02:30 PM','02:45 PM','03:00 PM','03:15 PM','03:30 PM','03:45 PM',
  //     '04:00 PM','04:15 PM','04:30 PM','04:45 PM','05:00 PM','05:15 PM','05:30 PM','05:45 PM','06:00 PM'
  //   ];
  // }
  


  bookAppointment(form: NgForm): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.confirmModal = null;

    if (!form.valid) {
      this.errorMessage = 'Please fill all required fields';
      return;
    }

    // Ensure required fields
    this.appointment.receptionistId = 1;
    this.appointment.status = 'Scheduled';
    console.log("Sending JSON:", JSON.stringify(this.appointment));
    this.isLoading = true;

    
    this.appointmentService.bookAppointment(this.appointment).subscribe({
      next: (response: any) => {
        this.isLoading = false;
        this.successMessage = `✅ Appointment booked successfully!`;

        // Keep the local conflict/count checks accurate if the receptionist
        // books again in the same session without reloading the page.
        this.allAppointments.push({ ...this.appointment });
        this.refreshPatientConflicts();

        // Optional: Go to bill generation
        const appointmentId = response?.AppointmentId || response?.appointmentId;
        if (appointmentId) {
          setTimeout(() => {
            this.router.navigate(['/reception/bills/generate', appointmentId]);
          }, 1500);
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        console.error('Booking error:', err);
        this.errorMessage = err?.error?.message || 'Failed to book appointment. Please try again.';
      }
    });
  }

  // Cancel button on the custom confirm dialog.
  cancelConfirmModal(): void {
    this.confirmModal = null;
  }

  clearPatientSelection(e: Event) {
    e.preventDefault();
    this.selectedPatientName = '';
    this.appointment.patientId = 0;
  }

  // setDate(type: string) {
  //   if (type === 'today') {
  //     this.appointment.AppointmentDate = this.todayDate;
  //   } else {
  //     this.appointment.AppointmentDate = this.tomorrowDate;
  //   }
  // }
  setDate(type: string): void {

    if (type === 'today') {
      this.appointment.appointmentDate = this.todayDate;
    } else {
      this.appointment.appointmentDate = this.tomorrowDate;
    }
  
    this.populateAvailableSlots();
  }

}