// src/pages/import-packing-list/types.ts

// Định nghĩa cho một dòng hàng hóa trong file packing list excel
export interface PackingListItem {
  id: string; // ID tạm thời ở client để xử lý key trong list
  poNumber: string;
  itemCode: string;
  factory: string;      // Mới
  supplier: string;     // Mới
  invoiceNo: string;    // Mới
  colorCode: string;    // Mới
  color: string;
  rollNo: string;
  lotNo: string;
  yards: number;
  netWeight: number;
  grossWeight: number;
  width: string;
  location: string;
  qrCode: string;       // Mới
  dateInHouse: string;  // Mới
  description: string;  // Mới
}

// // Định nghĩa cho một dòng hàng hóa trong phiếu nhập
// export interface ShipmentItem {
//   id: string; // ID tạm thời ở client để xử lý key trong list
//   sku: string;
//   name: string;
//   quantity: number;
//   uom: string; // Unit of Measure - Đơn vị tính
//   batch?: string; // Số lô/batch, không bắt buộc
// }

// // Định nghĩa cho thông tin chung của phiếu nhập
// export interface ShipmentHeader {
//   supplier: string;
//   poNumber: string;
//   packingListNo: string;
//   etd: string; // Expected Time of Departure
//   eta: string; // Expected Time of Arrival
//   notes: string;
// }