import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Pharmacy } from '../../services/pharmacy';
import { Prescription, DispenseItemRequest, DispenseBatch, PrescriptionQueueItem } from '../../models/prescription';
import { InventoryItem } from '../../models/inventory';

@Component({
  selector: 'app-prescriptions',
  imports: [FormsModule, DatePipe],
  templateUrl: './prescriptions.html',
  styleUrl: './prescriptions.scss',
})
export class Prescriptions implements OnInit {
  private readonly pharmacyService = inject(Pharmacy);

  readonly consultationIdInput = signal<number | null>(null);
  readonly prescription = signal<Prescription | null>(null);
  readonly loading = signal(false);
  readonly notFound = signal(false);
  readonly error = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  readonly inventoryOptions = signal<InventoryItem[]>([]);

  readonly userId = signal<number | null>(null);
  readonly pharmacistName = signal('');
  readonly dispenseItems = signal<DispenseItemRequest[]>([this.blankLine()]);

  readonly prescribedNoMatch = signal(false);

  readonly queue = signal<PrescriptionQueueItem[]>([]);
  readonly queueLoading = signal(true);
  readonly queueError = signal(false);
  readonly queuePendingOnly = signal(true);

  readonly prescribedFulfilled = computed(() => {
    const rx = this.prescription();
    const name = rx?.prescribedMedicineName?.trim().toLowerCase();
    if (!rx || !name) return true;
    return rx.dispensedItems.some((d) => d.medicineName.trim().toLowerCase() === name);
  });

  ngOnInit(): void {
    this.pharmacyService.getAllInventory().subscribe({
      next: (data) => this.inventoryOptions.set(data),
    });
    this.loadQueue();
  }

  loadQueue(): void {
    this.queueLoading.set(true);
    this.queueError.set(false);
    this.pharmacyService.getPrescriptionQueue(this.queuePendingOnly()).subscribe({
      next: (data) => {
        this.queue.set(data);
        this.queueLoading.set(false);
      },
      error: () => {
        this.queueError.set(true);
        this.queueLoading.set(false);
      },
    });
  }

  toggleQueueFilter(pendingOnly: boolean): void {
    this.queuePendingOnly.set(pendingOnly);
    this.loadQueue();
  }

  selectFromQueue(item: PrescriptionQueueItem): void {
    this.consultationIdInput.set(item.consultationId);
    this.loadPrescription();
  }

  private blankLine(): DispenseItemRequest {
    return { inventoryId: null, quantityGiven: null };
  }

  loadPrescription(): void {
    const id = this.consultationIdInput();
    if (!id) {
      this.error.set('Enter a consultation ID.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.notFound.set(false);
    this.successMessage.set(null);

    this.pharmacyService.getPrescription(id).subscribe({
      next: (data) => {
        this.prescription.set(data);
        this.loading.set(false);
        this.prefillFromPrescription(data);
      },
      error: (err) => {
        this.loading.set(false);
        this.prescription.set(null);
        if (err?.status === 404) {
          this.notFound.set(true);
        } else {
          this.error.set('Could not load this consultation. Confirm the pharmacy API is running.');
        }
      },
    });
  }

  private prefillFromPrescription(data: Prescription): void {
    this.prescribedNoMatch.set(false);

    const name = data.prescribedMedicineName?.trim();
    const alreadyDispensed = !!name && data.dispensedItems.some((d) => d.medicineName.trim().toLowerCase() === name.toLowerCase());

    if (!name || alreadyDispensed) {
      this.dispenseItems.set([this.blankLine()]);
      return;
    }

    const applyMatch = () => {
      const match = this.findInventoryMatch(name);
      if (match) {
        this.dispenseItems.set([{ inventoryId: match.inventoryId, quantityGiven: null }]);
      } else {
        this.prescribedNoMatch.set(true);
        this.dispenseItems.set([this.blankLine()]);
      }
    };

    if (this.inventoryOptions().length === 0) {
      this.pharmacyService.getAllInventory().subscribe({
        next: (options) => {
          this.inventoryOptions.set(options);
          applyMatch();
        },
      });
    } else {
      applyMatch();
    }
  }

  private findInventoryMatch(prescribedName: string): InventoryItem | undefined {
    const target = prescribedName.trim().toLowerCase();
    const options = this.inventoryOptions();
    return (
      options.find((i) => i.medicineName.trim().toLowerCase() === target) ??
      options.find((i) => i.medicineName.toLowerCase().includes(target) || target.includes(i.medicineName.toLowerCase()))
    );
  }

  addLine(): void {
    this.dispenseItems.update((lines) => [...lines, this.blankLine()]);
  }

  removeLine(index: number): void {
    this.dispenseItems.update((lines) => lines.filter((_, i) => i !== index));
  }

  availableFor(inventoryId: number | null): number | null {
    if (!inventoryId) return null;
    return this.inventoryOptions().find((i) => i.inventoryId === inventoryId)?.availableQuantity ?? null;
  }

  submitDispense(): void {
    const prescription = this.prescription();
    if (!prescription) return;

    const userId = this.userId();
    const pharmacistName = this.pharmacistName().trim();
    const items = this.dispenseItems().filter((l) => l.inventoryId && l.quantityGiven && l.quantityGiven > 0);

    if (!userId || !pharmacistName) {
      this.error.set('Enter the pharmacist name and user ID.');
      return;
    }
    if (items.length === 0) {
      this.error.set('Add at least one medicine with a quantity to dispense.');
      return;
    }

    const dto: DispenseBatch = {
      consultationId: prescription.consultationId,
      userId,
      pharmacistName,
      items: items.map((i) => ({ inventoryId: i.inventoryId, quantityGiven: i.quantityGiven })),
    };

    this.error.set(null);
    this.pharmacyService.dispenseMedicines(dto).subscribe({
      next: (res) => {
        this.successMessage.set(res.message);
        this.loadPrescription();
        this.loadQueue();
        this.pharmacyService.getAllInventory().subscribe({ next: (data) => this.inventoryOptions.set(data) });
      },
      error: (err) => this.error.set(this.extractError(err, 'Could not dispense these medicines.')),
    });
  }

  private extractError(err: unknown, fallback: string): string {
    const httpErr = err as { error?: { message?: string } | string };
    if (typeof httpErr?.error === 'string') return httpErr.error;
    if (httpErr?.error?.message) return httpErr.error.message;
    return fallback;
  }
}