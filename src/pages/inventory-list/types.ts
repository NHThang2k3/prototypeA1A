// Path: src/pages/inventory-list/types.ts

export type InventoryStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  uom: string; // Unit of Measure (Đơn vị tính)
  warehouse: string;
  location: string;
  quantityInStock: number;
  quantityAvailable: number;
  status: InventoryStatus;
}