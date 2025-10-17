// D:\WATATECH\WH\src\pages\inbound-dashboard\types.ts

// Định nghĩa các trạng thái nghiệp vụ tại kho
export type WarehouseReceiptStatus =
  | "pending_receipt" // Chờ nhận hàng
  | "processing" // Đang xử lý nhập (đã bắt đầu quét)
  | "partially_received" // Đã nhận một phần
  | "fully_received"; // Đã nhận đủ

// Kiểu dữ liệu cho một lô hàng cần nhập kho
export interface Receipt {
  id: string;
  poNumber: string;
  packingList: string;
  supplier: string;
  arrivalDate: string; // Ngày hàng về đến kho
  status: WarehouseReceiptStatus;
  creator: string;
  progress?: { // Dữ liệu tiến độ, quan trọng cho việc theo dõi
    receivedItems: number;
    totalItems: number;
  };
}

// Kiểu dữ liệu cho các thẻ tóm tắt
export interface SummaryData {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
}