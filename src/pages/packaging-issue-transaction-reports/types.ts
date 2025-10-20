// Path: src/pages/packaging-issue-transaction-reports/types.ts

// Định nghĩa trạng thái xuất kho bao bì
export type PackagingStatus = 'Complete' | 'Partially' | 'Pending';

// Định nghĩa cấu trúc dữ liệu cho một bao bì
export interface Packaging {
  qrCode: string; // Sử dụng làm ID duy nhất
  itemNumber: string;
  itemCategory: string;
  materialName: string;
  color: string;
  size: string;
  quantity: number;
  unit: string;
  location: string;
  batchNumber: string;
  dateReceived: string; // ISO date string (e.g., '2023-10-01')
  supplier: string;
  poNumber: string;
  reorderPoint: number;
  lastModifiedDate: string; // ISO date string
  lastModifiedBy: string;
  description: string;
  job: string;
  issuedQuantity: number;
  issuedDate: string; // ISO date string
  issuedBy: string;
  destination: string;
  status: PackagingStatus;
  remark: string | null;
}

// Định nghĩa các trường filter cho báo cáo bao bì
export interface PackagingFilters {
  query?: string; // Dùng để tìm kiếm Item Number hoặc PO Number
  supplier?: string;
  status?: PackagingStatus | '';
  dateFrom?: string; // Date Received from
  dateTo?: string; // Date Received to
}
