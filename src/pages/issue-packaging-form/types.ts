// Định nghĩa cho một vật tư đóng gói có trong kho
export interface PackagingMaterial {
  id: number;
  sku: string;
  name: string;
  uom: 'Cái' | 'Bộ' | 'Cuộn' | 'Thùng'; // Đơn vị tính
  stock: number;
}

// Định nghĩa cho một dòng yêu cầu trong form
export interface RequestItem {
  id: string; // ID tạm thời ở client để làm key
  materialId: number | null;
  sku: string;
  name: string;
  uom: string;
  stock: number;
  quantity: number;
}

// Định nghĩa cho một lệnh sản xuất
export interface ProductionOrder {
  id: number;
  name: string;
}