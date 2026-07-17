// Maps to AvailableMedicineDto (GET /doctor/medicines)
export class AvailableMedicine {
    inventoryId: number = 0;
    medicineName: string = '';
    batchNumber: string = '';
    expiryDate: string = '';
    availableStock: number = 0;
    unitPrice: number = 0;
}