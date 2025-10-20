// Path: src/pages/inventory-list/types.ts

// Old types are no longer needed
// export type InventoryStatus = 'in-stock' | 'low-stock' | 'out-of-stock';
// export interface InventoryItem { ... }

export type QCStatus = 'Passed' | 'Failed' | 'Pending';

export interface FabricRoll {
  id: string; // Using QR Code as a unique ID
  poNumber: string;
  itemCode: string;
  factory: string;
  supplier: string;
  invoiceNo: string;
  colorCode: string;
  color: string;
  rollNo: string;
  lotNo: string;
  yards: number;
  netWeightKgs: number;
  grossWeightKgs: number;
  width: string;
  location: string;
  qrCode: string;
  dateInHouse: string;
  description: string;
  qcStatus: QCStatus;
  qcDate: string;
  qcBy: string;
  comment: string;
  printed: boolean;
  balanceYards: number;
  hourStandard: number;
  hourRelax: number;
  relaxDate: string;
  relaxTime: string;
  relaxBy: string;
  parentQrCode: string | null;
}