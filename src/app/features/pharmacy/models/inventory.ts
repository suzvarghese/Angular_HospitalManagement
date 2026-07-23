export interface InventoryItem {
  inventoryId: number;
  medicineName: string;
  batchNumber: string;
  expiryDate: string;   
  quantityIn: number;
  quantityOut: number;
  availableQuantity: number;
  unitPrice: number;
  reorderLevel: number;
  purchaseDate: string | null;
  supplierName: string | null;
  isLowStock: boolean;
  isExpired: boolean;
  isExpiringSoon: boolean;
}

export interface InventoryCreate {
  medicineName: string;
  batchNumber: string;
  expiryDate: string;
  quantityIn: number;
  unitPrice: number;
  reorderLevel: number;
  purchaseDate?: string | null;
  supplierName?: string | null;
}

export interface InventoryUpdate {
  medicineName: string;
  batchNumber: string;
  expiryDate: string;
  unitPrice: number;
  reorderLevel: number;
  supplierName?: string | null;
}

export interface InventoryRestock {
  quantity: number;
  supplierName?: string | null;
  purchaseDate?: string | null;
}

export type InventoryFilter = 'all' | 'low-stock' | 'expiring-soon' | 'expired';
