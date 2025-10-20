// Path: src/pages/issue-fabric-form/types.ts

// Dữ liệu cho một JOB trong kế hoạch cắt
export interface CuttingPlanJob {
  ID: string;
  PlanName: string;
  Factory: string;
  PlanDate: string; // Sử dụng string cho đơn giản, có thể dùng Date
  Style: string;
  JOB: string;
  ItemCode: string;
  Color: string;
  RequestQuantity: number;
  IssuedQuantity: number;
  Status: "Planned" | "In Progress" | "Completed";
  CreatedBy: string;
  Remarks: string;
}

// Dữ liệu cho một cuộn vải trong kho
export interface InventoryRoll {
  PONumber: string;
  ItemCode: string;
  Factory: string;
  Supplier: string;
  InvoiceNo: string;
  ColorCode: string;
  Color: string;
  RollNo: string;
  LotNo: string;
  Yards: number; // Tổng số yards ban đầu
  NetWeightKgs: number;
  GrossWeightKgs: number;
  Width: string;
  Location: string;
  QRCode: string;
  DateInHouse: string;
  Description: string;
  QCStatus: "Passed" | "Failed" | "Pending";
  QCDate: string;
  QCBy: string;
  Comment: string;
  Printed: boolean;
  BalanceYards: number; // Số yards còn lại
  HourStandard: number;
  HourRelax: number;
  RelaxDate: string;
  RelaxTime: string;
  RelaxBy: string;
  ParentQRCode: string | null;
}

// Dữ liệu cho một cuộn vải đã được chọn để xuất
export interface SelectedInventoryRoll extends InventoryRoll {
  issuedYards: number; // Số yards người dùng nhập để xuất
}