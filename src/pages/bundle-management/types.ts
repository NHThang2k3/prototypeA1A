// src/pages/bundle-management/types.ts

export type Job = {
  jobNo: string;
  subNo: number;
  qrCode: string; // Thêm cột QR Code
  jobDate: string;
  requireDate: string;
  shipmentDate: string;
  orderType: number;
  recDate: string;
  brandCode: string;
  poNo: string;
  poDate: string;
  shipBy: string;
  sumQty: number;
  styleNo: string;
  styleDesc: string;
  season: string;
  country: string;
  plantCode: string;
  mer: string;
  unit: string;
  comboCode: string;
  comboDesc: string;
  seqColor: number;
  colorName: string;
  jobSize: string;
  extendTerm?: string;
  colorGroup: string;
};

// Kiểu dữ liệu cho các cột có thể cấu hình
export type ColumnConfig = {
  key: keyof Job;
  label: string;
};