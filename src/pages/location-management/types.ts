// Path: src/pages/location-management/types.ts

// Loại của một vị trí trong kho
export type LocationType = 'WAREHOUSE' | 'ZONE' | 'AISLE' | 'SHELF' | 'BIN';

// Trạng thái của vị trí
export type LocationStatus = 'ACTIVE' | 'LOCKED';

// Một mặt hàng tồn kho đơn giản
export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  quantity: number;
  uom: string; // Đơn vị tính
}

// Cấu trúc một node (vị trí) trong cây kho
export interface LocationNode {
  id: string;
  name: string;
  type: LocationType;
  status: LocationStatus;
  capacity?: number; // Sức chứa (tùy chọn)
  items: InventoryItem[]; // Các mặt hàng đang có tại vị trí này
  children: LocationNode[]; // Các vị trí con
}