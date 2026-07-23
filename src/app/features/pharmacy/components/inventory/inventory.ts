import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Pharmacy } from '../../services/pharmacy';
import {
  InventoryCreate,
  InventoryFilter,
  InventoryItem,
  InventoryRestock,
  InventoryUpdate,
} from '../../models/inventory';

function emptyCreateForm(): InventoryCreate {
  return {
    medicineName: '',
    batchNumber: '',
    expiryDate: '',
    quantityIn: 0,
    unitPrice: 0,
    reorderLevel: 0,
    purchaseDate: '',
    supplierName: '',
  };
}

function emptyRestockForm(): InventoryRestock {
  return { quantity: 0, supplierName: '', purchaseDate: '' };
}

@Component({
  selector: 'app-inventory',
  imports: [FormsModule],
  templateUrl: './inventory.html',
  styleUrl: './inventory.scss',
})
export class Inventory implements OnInit {
  private readonly pharmacyService = inject(Pharmacy);
  private readonly route = inject(ActivatedRoute);

  readonly items = signal<InventoryItem[]>([]);
  readonly filter = signal<InventoryFilter>('all');
  readonly search = signal('');
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);

  readonly showAddForm = signal(false);
  readonly createForm = signal<InventoryCreate>(emptyCreateForm());

  readonly editingItem = signal<InventoryItem | null>(null);
  readonly editForm = signal<InventoryUpdate | null>(null);

  readonly restockingItem = signal<InventoryItem | null>(null);
  readonly restockForm = signal<InventoryRestock>(emptyRestockForm());

  readonly filteredItems = computed(() => {
    const term = this.search().trim().toLowerCase();
    if (!term) return this.items();
    return this.items().filter(
      (i) =>
        i.medicineName.toLowerCase().includes(term) ||
        i.batchNumber.toLowerCase().includes(term) ||
        (i.supplierName ?? '').toLowerCase().includes(term),
    );
  });

  ngOnInit(): void {
    const queryFilter = this.route.snapshot.queryParamMap.get('filter') as InventoryFilter | null;
    this.setFilter(queryFilter ?? 'all');
  }

  setFilter(filter: InventoryFilter): void {
    this.filter.set(filter);
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(null);

    const request$ =
      this.filter() === 'low-stock'
        ? this.pharmacyService.getLowStock()
        : this.filter() === 'expiring-soon'
          ? this.pharmacyService.getExpiringSoon(30)
          : this.filter() === 'expired'
            ? this.pharmacyService.getExpired()
            : this.pharmacyService.getAllInventory();

    request$.subscribe({
      next: (data) => {
        this.items.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Could not load inventory. Confirm the pharmacy API is running.');
        this.loading.set(false);
      },
    });
  }

  // ---------- Add ----------

  openAddForm(): void {
    this.createForm.set(emptyCreateForm());
    this.showAddForm.set(true);
    this.editingItem.set(null);
    this.restockingItem.set(null);
  }

  cancelAdd(): void {
    this.showAddForm.set(false);
  }

  submitAdd(): void {
    const dto = this.createForm();
    if (!dto.medicineName || !dto.batchNumber || !dto.expiryDate || dto.quantityIn <= 0 || dto.unitPrice <= 0) {
      this.error.set('Fill in medicine name, batch number, expiry date, quantity and price.');
      return;
    }

    this.pharmacyService.addInventory(dto).subscribe({
      next: () => {
        this.successMessage.set(`${dto.medicineName} added to inventory.`);
        this.showAddForm.set(false);
        this.load();
      },
      error: (err) => this.error.set(this.extractError(err, 'Could not add this medicine.')),
    });
  }

  // ---------- Edit ----------

  openEdit(item: InventoryItem): void {
    this.editingItem.set(item);
    this.editForm.set({
      medicineName: item.medicineName,
      batchNumber: item.batchNumber,
      expiryDate: item.expiryDate,
      unitPrice: item.unitPrice,
      reorderLevel: item.reorderLevel,
      supplierName: item.supplierName,
    });
    this.showAddForm.set(false);
    this.restockingItem.set(null);
  }

  cancelEdit(): void {
    this.editingItem.set(null);
    this.editForm.set(null);
  }

  submitEdit(): void {
    const item = this.editingItem();
    const dto = this.editForm();
    if (!item || !dto) return;

    this.pharmacyService.updateInventory(item.inventoryId, dto).subscribe({
      next: () => {
        this.successMessage.set(`${dto.medicineName} updated.`);
        this.cancelEdit();
        this.load();
      },
      error: (err) => this.error.set(this.extractError(err, 'Could not update this medicine.')),
    });
  }

  // ---------- Restock ----------

  openRestock(item: InventoryItem): void {
    this.restockingItem.set(item);
    this.restockForm.set(emptyRestockForm());
    this.showAddForm.set(false);
    this.editingItem.set(null);
  }

  cancelRestock(): void {
    this.restockingItem.set(null);
  }

  submitRestock(): void {
    const item = this.restockingItem();
    const dto = this.restockForm();
    if (!item || dto.quantity <= 0) {
      this.error.set('Enter a restock quantity greater than zero.');
      return;
    }

    this.pharmacyService.restock(item.inventoryId, dto).subscribe({
      next: (updated) => {
        this.successMessage.set(`Added ${dto.quantity} units to ${updated.medicineName}.`);
        this.cancelRestock();
        this.load();
      },
      error: (err) => this.error.set(this.extractError(err, 'Could not restock this medicine.')),
    });
  }

  // ---------- Delete ----------

  deleteItem(item: InventoryItem): void {
    if (!confirm(`Remove "${item.medicineName}" (batch ${item.batchNumber}) from inventory?`)) return;

    this.pharmacyService.deleteInventory(item.inventoryId).subscribe({
      next: () => {
        this.successMessage.set(`${item.medicineName} removed.`);
        this.load();
      },
      error: (err) => this.error.set(this.extractError(err, 'Could not remove this medicine.')),
    });
  }

  private extractError(err: unknown, fallback: string): string {
    const httpErr = err as { error?: { message?: string } | string };
    if (typeof httpErr?.error === 'string') return httpErr.error;
    if (httpErr?.error?.message) return httpErr.error.message;
    return fallback;
  }
}
