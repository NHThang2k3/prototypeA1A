import type { PackagingMaterial, ProductionOrder } from "./types";

// Dữ liệu giả cho các vật tư đóng gói có sẵn trong kho
export const availablePackagingMaterials: PackagingMaterial[] = [
  { id: 1, sku: 'HGT-001-S', name: 'Thẻ bài logo size S', uom: 'Cái', stock: 15000 },
  { id: 2, sku: 'HGT-001-M', name: 'Thẻ bài logo size M', uom: 'Cái', stock: 25000 },
  { id: 3, sku: 'POLY-30x40', name: 'Túi Poly 30x40cm', uom: 'Cái', stock: 8000 },
  { id: 4, sku: 'CTN-S-STD', name: 'Thùng carton size S', uom: 'Thùng', stock: 500 },
  { id: 5, sku: 'STICKER-SIZE-M', name: 'Nhãn dán size M', uom: 'Cái', stock: 18000 },
  { id: 6, sku: 'TAPE-CLEAR-5CM', name: 'Băng keo trong 5cm', uom: 'Cuộn', stock: 250 },
];

// Dữ liệu giả cho các lệnh sản xuất
export const productionOrders: ProductionOrder[] = [
    { id: 101, name: 'PO-2023-456 (Áo Sơ Mi Trắng)'},
    { id: 102, name: 'PO-2023-457 (Quần Jean Xanh)'},
    { id: 103, name: 'PO-2023-458 (Váy Hoa Mùa Hè)'},
]