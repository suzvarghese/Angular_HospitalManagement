import { InventoryItem, InventoryCreate } from './inventory';

describe('Inventory models', () => {
  it('accepts a valid InventoryItem shape', () => {
    const item: InventoryItem = {
      inventoryId: 1,
      medicineName: 'Paracetamol 500mg',
      batchNumber: 'BATCH-01',
      expiryDate: '2027-01-01',
      quantityIn: 100,
      quantityOut: 10,
      availableQuantity: 90,
      unitPrice: 2.5,
      reorderLevel: 20,
      purchaseDate: '2026-06-01',
      supplierName: 'MedPlus',
      isLowStock: false,
      isExpired: false,
      isExpiringSoon: false,
    };
    expect(item.medicineName).toBe('Paracetamol 500mg');
  });

  it('accepts a valid InventoryCreate shape', () => {
    const dto: InventoryCreate = {
      medicineName: 'Amoxicillin 250mg',
      batchNumber: 'BATCH-02',
      expiryDate: '2027-01-01',
      quantityIn: 50,
      unitPrice: 6,
      reorderLevel: 10,
    };
    expect(dto.quantityIn).toBe(50);
  });
});
