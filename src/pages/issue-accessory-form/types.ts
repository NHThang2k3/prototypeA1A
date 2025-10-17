// Path: src/pages/issue-accessory-form/types.ts

// Đại diện cho một phụ liệu trong kho
export interface Accessory {
  sku: string;
  name: string;
  uom: 'Cái' | 'Cuộn' | 'Hộp' | 'Bộ';
  stock: number;
}

// Đại diện cho một dòng yêu cầu phụ liệu trong form
export interface AccessoryRequestItem {
  id: string; // ID tạm để xử lý trong UI
  sku: string;
  name: string;
  uom: string;
  stock: number;
  quantity: number;
}

// Đại diện cho toàn bộ dữ liệu của form
export interface AccessoryRequestFormState {
  productionOrder: string;
  requestor: string;
  department: string;
  requiredDate: string | null;
  notes: string;
  items: AccessoryRequestItem[];
}