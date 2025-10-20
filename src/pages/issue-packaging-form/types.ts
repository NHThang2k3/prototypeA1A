// Path: src/pages/issue-packaging-form/types.ts

// Dữ liệu cho một yêu cầu cấp phát bao bì từ chuyền may
export interface PackagingRequest {
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

// Dữ liệu cho một loại bao bì trong kho
export interface PackagingInventoryItem {
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

// Dữ liệu cho một bao bì đã được chọn để xuất kho
export interface SelectedPackagingItem extends PackagingInventoryItem {
  issuedQuantity: number; // Số lượng người dùng nhập để xuất
}
