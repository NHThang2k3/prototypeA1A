// Path: src/pages/inventory-list/types.ts

export type QCStatus = 'Passed' | 'Failed' | 'Pending';

export interface LocationHistoryEntry {
  dateTime: string; // ISO 8601 format string
  from: string;
  to: string;
  changedBy: string;
}

export interface FabricRoll {
  id: string; // Using QR Code as a unique ID
  poNumber: string;
  itemCode: string;
  factory: string;
  supplier: string;
  supplierCode: string;
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
  locationHistory: LocationHistoryEntry[];
}