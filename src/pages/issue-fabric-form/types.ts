// Path: src/pages/issue-fabric-form/types.ts

// Đại diện cho một cây vải cụ thể có trong kho
export interface AvailableRoll {
  id: string;
  location: string;
  availableMeters: number;
}

// Đại diện cho một cây vải đã được chọn để xuất, cùng với số lượng
export interface SelectedRoll {
  rollId: string;
  quantity: number;
  location: string;
  availableMeters: number;
}

// Đại diện cho một dòng yêu cầu vải trong form
export interface FabricRequestItem {
  id: string; // ID tạm thời ở client để quản lý
  sku: string;
  name: string;
  color: string;
  width: string;
  availableQty: number;
  requestedRolls: SelectedRoll[];
}

// Đại diện cho toàn bộ dữ liệu của form
export interface FabricIssueFormData {
  productionOrder: string;
  requiredDate: string;
  notes: string;
  items: FabricRequestItem[];
}