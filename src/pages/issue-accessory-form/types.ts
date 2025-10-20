// Path: src/pages/issue-accessory-form/types.ts

// Dữ liệu cho một yêu cầu cấp phát phụ liệu từ chuyền may
export interface AccessoryRequest {
  ID: string;
  RequestName: string;
  DateCreated: string;
  DateRequired: string;
  FactoryLine: string;
  Style: string;
  JOB: string; // Có thể là "Cắt", "May", "Hoàn thiện", etc.
  Color: string;
  Size: string;
  PONumber: string;
  RequiredQuantity: number;
  IssuedQuantity: number;
  Status: "New" | "Picking" | "Ready for Pickup" | "Partially Issued" | "Completed" | "Cancelled";
  Priority: "High" | "Medium" | "Low";
  BOMID: string;
  CreatedBy: string;
  Remarks: string;
}

// Dữ liệu cho một loại phụ liệu trong kho
export interface AccessoryInventoryItem {
  QRCode: string;
  ItemNumber: string;
  ItemCategory: string;
  MaterialName: string;
  Color: string;
  Size: string;
  Quantity: number; // Số lượng tồn kho (Balance)
  Unit: string;
  Location: string;
  BatchNumber: string;
  DateReceived: string;
  Supplier: string;
  PONumber: string;
  Status: "In Stock" | "Low Stock" | "Out of Stock";
  Description: string;
}

// Dữ liệu cho một phụ liệu đã được chọn để xuất kho
export interface SelectedAccessoryItem extends AccessoryInventoryItem {
  issuedQuantity: number; // Số lượng người dùng nhập để xuất
}