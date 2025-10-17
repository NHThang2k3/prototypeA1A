// Định nghĩa cho một dòng hàng hóa trong phiếu nhập
export interface ShipmentItem {
  id: string; // ID tạm thời ở client để xử lý key trong list
  sku: string;
  name: string;
  quantity: number;
  uom: string; // Unit of Measure - Đơn vị tính
  batch?: string; // Số lô/batch, không bắt buộc
}

// Định nghĩa cho thông tin chung của phiếu nhập
export interface ShipmentHeader {
  supplier: string;
  poNumber: string;
  packingListNo: string;
  etd: string; // Expected Time of Departure
  eta: string; // Expected Time of Arrival
  notes: string;
}