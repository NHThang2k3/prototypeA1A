// path: src/pages/packing-list-management/types.ts

// Định nghĩa trạng thái in của một đơn vị vật tư
export type PrintStatus = 'NOT_PRINTED' | 'PRINTED';

// Định nghĩa trạng thái QC của một đơn vị vật tư
export type QCStatus = 'Passed' | 'Failed' | 'Pending';


// Dữ liệu chi tiết của một cuộn vải trong danh sách (Item List)
export interface FabricRollItem {
  id: string;
  poNumber: string;
  itemCode: string;
  factory: string;
  supplier: string;
  invoiceNo: string;
  colorCode: string;
  color: string;
  description: string;
  rollNo: number;
  lotNo: string;
  yards: number;
  netWeightKgs: number;
  grossWeightKgs: number;
  width: string;
  location: string;
  qrCode: string;
  dateInHouse: string;
  qcStatus: QCStatus;
  qcDate: string;
  qcBy: string;
  comment: string;
  printStatus: PrintStatus;
}