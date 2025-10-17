// Path: src/pages/shipment-detail/types.ts

export type PrintStatus = "printed" | "not_printed";

// MỚI: Định nghĩa cho một đơn vị đã được phân rã (cuộn vải, thùng hàng)
export interface BreakdownItem {
  uniqueId: string; // Sẽ dùng để tạo QR Code, vd: 'item-1-roll-1'
  parentId: number; // ID của ShipmentItem cha
  itemNumber: number; // Số thứ tự, vd: 1, 2, 3...
  quantity: number; // Số lượng thực tế của đơn vị này (vd: 148.5m)
  printStatus: PrintStatus;
}

export interface ShipmentItem {
  id: number;
  sku: string;
  name: string;
  quantity: number; // Tổng số lượng
  uom: string; // Unit of Measure
  printStatus: PrintStatus;
  // MỚI: Mảng chứa các đơn vị con sau khi phân rã
  breakdown?: BreakdownItem[];
}

export interface Shipment {
  id: string;
  packingListNo: string;
  poNumber: string;
  supplier: string;
  etd: string; // Expected Time of Departure
  eta: string; // Expected Time of Arrival
  status: "Mới tạo" | "Đã nhập kho";
  items: ShipmentItem[];
}