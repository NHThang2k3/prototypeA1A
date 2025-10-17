// path: src/pages/packing-list-management/types.ts

// Định nghĩa trạng thái in của một đơn vị vật tư
export type PrintStatus = 'NOT_PRINTED' | 'PRINTED';

// Dữ liệu của một đơn vị đã được phân rã (cuộn vải, thùng hàng)
export interface BreakdownUnit {
  id: string;
  parentItemId: string;
  name: string; // Tên định danh, vd: "Cuộn 1", "Thùng A-01"
  quantity: number;
  qrCode: string | null; // Dữ liệu QR code sẽ được sinh ra khi in
}

// Dữ liệu chi tiết của một mục vật tư trong Packing List
export interface PackingListItem {
  id: string;
  itemCode: string;
  description: string;
  color: string;
  lotNumber: string;
  quantity: number;
  unit: 'm' | 'kg' | 'cái' | 'thùng';
  printStatus: PrintStatus;
  breakdownUnits: BreakdownUnit[]; // Danh sách các đơn vị con sau khi phân rã
}

// Dữ liệu chi tiết của một Packing List, tương ứng với một PO
export interface PackingListDetails {
  id: string;
  poNumber: string;
  supplier: string;
  eta: string;
  items: PackingListItem[];
}