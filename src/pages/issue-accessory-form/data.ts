// Path: src/pages/issue-accessory-form/data.ts

import type { Accessory } from "./types";

// Danh sách các phụ liệu có trong kho
export const mockAccessories: Accessory[] = [
  { sku: 'BTN-001', name: 'Nút áo 4 lỗ màu trắng', uom: 'Cái', stock: 15000 },
  { sku: 'BTN-002', name: 'Nút quần jean đồng', uom: 'Cái', stock: 8500 },
  { sku: 'ZIP-001', name: 'Dây kéo YKK 20cm màu đen', uom: 'Cái', stock: 4200 },
  { sku: 'THR-001', name: 'Chỉ may 5000m màu trắng', uom: 'Cuộn', stock: 350 },
  { sku: 'THR-002', name: 'Chỉ may 5000m màu đen', uom: 'Cuộn', stock: 410 },
  { sku: 'LBL-001', name: 'Nhãn size M', uom: 'Cái', stock: 22000 },
  { sku: 'LBL-002', name: 'Nhãn size L', uom: 'Cái', stock: 25000 },
];

// Danh sách các lệnh sản xuất
export const mockProductionOrders: string[] = ["PO-2023-001", "PO-2023-002", "PO-2023-003"];

// Định mức nguyên vật liệu (BOM) cho từng lệnh sản xuất
export const mockBOMs: Record<string, { sku: string; quantity: number }[]> = {
  "PO-2023-001": [
    { sku: "BTN-001", quantity: 5000 },
    { sku: "THR-001", quantity: 25 },
    { sku: "LBL-001", quantity: 2500 },
    { sku: "LBL-002", quantity: 2500 },
  ],
  "PO-2023-002": [
    { sku: "BTN-002", quantity: 1200 },
    { sku: "ZIP-001", quantity: 1200 },
    { sku: "THR-002", quantity: 15 },
  ],
  "PO-2023-003": [], // Lệnh SX này không có BOM định sẵn
};