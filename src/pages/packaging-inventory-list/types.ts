// Path: src/pages/Packaging-inventory-list/types.ts

export type PackagingStatus = "In Stock" | "Out of Stock" | "Low Stock";

export interface PackagingItem {
  id: string; // Using a unique ID for each item
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
  status: PackagingStatus;
  batchNumber: string;
  dateReceived: string;
  supplier: string;
  poNumber: string;
  reorderPoint: number;
  lastModifiedDate: string;
  lastModifiedBy: string;
  description: string;
}