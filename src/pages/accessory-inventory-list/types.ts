// Path: src/pages/accessory-inventory-list/types.ts

export type AccessoryStatus = "In Stock" | "Out of Stock" | "Low Stock";

export interface AccessoryItem {
  id: string; // Using ItemNumber as a unique ID
  qrCode: string;
  itemNumber: string;
  itemCategory: string;
  materialName: string;
  color: string;
  size: string;
  quantity: number;
  unit: string;
  location: string;
  requiredQuantity: number;
  status: AccessoryStatus;
  batchNumber: string;
  dateReceived: string;
  supplier: string;
  poNumber: string;
  reorderPoint: number;
  lastModifiedDate: string;
  lastModifiedBy: string;
  description: string;
}