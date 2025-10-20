// Path: src/pages/issue-transaction-reports/types.ts

// [NEW] Định nghĩa trạng thái QC
export type QcStatus = 'Passed' | 'Failed' | 'Pending';

// [NEW] Định nghĩa cấu trúc dữ liệu cho một cuộn vải, thay thế IssueTransaction
export interface FabricRoll {
  poNumber: string;
  itemCode: string;
  factory: string;
  supplier: string;
  invoiceNo: string;
  colorCode: string;
  color: string;
  rollNo: number;
  lotNo: string;
  yards: number;
  netWeightKgs: number;
  grossWeightKgs: number;
  width: string;
  location: string;
  qrCode: string; // Sử dụng làm ID duy nhất
  dateInHouse: string; // ISO date string or formatted string
  description: string;
  qcStatus: QcStatus;
  qcDate: string; // ISO date string or formatted string
  qcBy: string;
  comment: string;
  printed: boolean;
  balanceYards: number;
  hourStandard: number;
  hourRelax: number;
  relaxDate: string; // ISO date string or formatted string
  relaxTime: string;
  relaxBy: string;
  job: string;
  issuedDate: string; // ISO date string or formatted string
  issuedBy: string;
  destination: string;
  parentQrCode: string | null;
}

// [UPDATED] Cập nhật định nghĩa Filters để phù hợp với dữ liệu mới
export interface FabricRollFilters {
  query?: string; // Dùng để tìm kiếm PO Number hoặc Item Code
  supplier?: string;
  qcStatus?: QcStatus | '';
  dateFrom?: string; // Date In House from
  dateTo?: string; // Date In House to
}