import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pharmacy } from '../../services/pharmacy';
import { BillStatusFilter, ConsultationInvoice, PayBillRequest, PharmacyBillLine } from '../../models/billing';

function emptyPayForm(): PayBillRequest {
  return { receptionistId: 0, paymentMethod: 'Cash', paidAmount: null };
}

@Component({
  selector: 'app-billing',
  imports: [FormsModule],
  templateUrl: './billing.html',
  styleUrl: './billing.scss',
})
export class Billing implements OnInit {
  private readonly pharmacyService = inject(Pharmacy);

  readonly bills = signal<PharmacyBillLine[]>([]);
  readonly statusFilter = signal<BillStatusFilter>('all');
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  readonly payingBillId = signal<number | null>(null);
  readonly payForm = signal<PayBillRequest>(emptyPayForm());

  readonly invoiceConsultationId = signal<number | null>(null);
  readonly invoice = signal<ConsultationInvoice | null>(null);
  readonly invoiceLoading = signal(false);
  readonly invoiceError = signal<string | null>(null);
  readonly payAllForm = signal<PayBillRequest>(emptyPayForm());
  readonly showPayAll = signal(false);
  readonly printedAt = signal('');


  ngOnInit(): void {
    this.load();
  }

  setStatusFilter(status: BillStatusFilter): void {
    this.statusFilter.set(status);
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);
    const status = this.statusFilter() === 'all' ? undefined : this.statusFilter();

    this.pharmacyService.getAllBills(status).subscribe({
      next: (data) => {
        this.bills.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load pharmacy bills. Confirm the pharmacy API is running.');
        this.loading.set(false);
      },
    });
  }

  openPay(bill: PharmacyBillLine): void {
    this.payingBillId.set(bill.pharmacyBillId);
    this.payForm.set(emptyPayForm());
  }

  cancelPay(): void {
    this.payingBillId.set(null);
  }

  submitPay(bill: PharmacyBillLine): void {
    const dto = this.payForm();
    if (!dto.receptionistId || !dto.paymentMethod) {
      this.error.set('Enter the receptionist ID and payment method.');
      return;
    }

    this.pharmacyService.payBill(bill.pharmacyBillId, dto).subscribe({
      next: (res) => {
        this.successMessage.set(res.message);
        this.payingBillId.set(null);
        this.load();
      },
      error: (err) => this.error.set(this.extractError(err, 'Could not record this payment.')),
    });
  }

  // ---------- Consultation invoice ----------

  loadInvoice(): void {
    const id = this.invoiceConsultationId();
    if (!id) {
      this.invoiceError.set('Enter a consultation ID.');
      return;
    }
    this.invoiceLoading.set(true);
    this.invoiceError.set(null);
    this.invoice.set(null);
    this.showPayAll.set(false);

    this.pharmacyService.getInvoiceByConsultation(id).subscribe({
      next: (data) => {
        this.invoice.set(data);
        this.invoiceLoading.set(false);
      },
      error: () => {
        this.invoiceError.set('No invoice found for that consultation.');
        this.invoiceLoading.set(false);
      },
    });
  }

  openPayAll(): void {
    this.payAllForm.set(emptyPayForm());
    this.showPayAll.set(true);
  }

  // Renders the invoice's letterhead timestamp, then opens the browser's
  // print dialog - choosing "Save as PDF" there produces the PDF bill.
  printInvoice(): void {
    this.printedAt.set(new Date().toLocaleString());
    setTimeout(() => window.print(), 0);
  }
  
  submitPayAll(): void {
    const inv = this.invoice();
    const dto = this.payAllForm();
    if (!inv) return;
    if (!dto.receptionistId || !dto.paymentMethod) {
      this.invoiceError.set('Enter the receptionist ID and payment method.');
      return;
    }

    this.pharmacyService.payConsultationBills(inv.consultationId, dto).subscribe({
      next: (res) => {
        this.successMessage.set(res.message);
        this.showPayAll.set(false);
        this.loadInvoice();
        this.load();
      },
      error: (err) => this.invoiceError.set(this.extractError(err, 'Could not pay these bills.')),
    });
  }

  private extractError(err: unknown, fallback: string): string {
    const httpErr = err as { error?: { message?: string } | string };
    if (typeof httpErr?.error === 'string') return httpErr.error;
    if (httpErr?.error?.message) return httpErr.error.message;
    return fallback;
    
  }
}
