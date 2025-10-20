// Path: src/pages/issue-packaging-form/data.ts

import type { PackagingRequest, PackagingInventoryItem } from "./types";

// DỮ LIỆU GIẢ CHO YÊU CẦU BAO BÌ
const MOCK_PACKAGING_REQUESTS: PackagingRequest[] = [
  { ID: "PKGR-001", RequestName: "Yêu cầu thùng carton JKT-0821", DateCreated: "2023-11-21T08:00:00", DateRequired: "2023-11-22", FactoryLine: "Chuyền 1", Style: "JKT-0821", JOB: "Đóng gói", Color: "Black", Size: "M", PONumber: "PO-23-US-5512", RequiredQuantity: 500, IssuedQuantity: 0, Status: "New", Priority: "High", BOMID: "BOM-JKT-0821-V2", CreatedBy: "Nguyễn Thị Lan", Remarks: "Cần gấp để đóng gói hàng xuất." },
  { ID: "PKGR-002", RequestName: "Cấp túi poly PNT-5503", DateCreated: "2023-11-20T14:30:00", DateRequired: "2023-11-21", FactoryLine: "Chuyền 3", Style: "PNT-5503", JOB: "Đóng gói", Color: "Navy", Size: "L", PONumber: "PO-23-EU-8904", RequiredQuantity: 1200, IssuedQuantity: 1200, Status: "Completed", Priority: "Medium", BOMID: "BOM-PNT-5503-V1", CreatedBy: "Trần Văn Hùng", Remarks: "Đã nhận đủ hàng." },
  { ID: "PKGR-003", RequestName: "Yêu cầu nhãn dán SHRT-112A", DateCreated: "2023-11-21T09:15:00", DateRequired: "2023-11-22", FactoryLine: "Chuyền 5", Style: "SHRT-112A", JOB: "Hoàn thiện", Color: "White", Size: "S", PONumber: "PO-23-JP-7765", RequiredQuantity: 800, IssuedQuantity: 500, Status: "Partially Issued", Priority: "Medium", BOMID: "BOM-SHRT-112A-V1", CreatedBy: "Lê Thị Hoa", Remarks: "Kho báo sẽ cấp phần còn lại vào chiều nay." },
];

// DỮ LIỆU GIẢ CHO KHO BAO BÌ
const MOCK_PACKAGING_INVENTORY: PackagingInventoryItem[] = [
  { QRCode: "PKG-BOX-001-BRN", ItemNumber: "BOX-001", ItemCategory: "BOX", MaterialName: "Thùng carton 5 lớp", Color: "Nâu", Size: "60x40x40 cm", Quantity: 1200, Unit: "Thùng", Location: "Khu C-01-02", BatchNumber: "B20231005", DateReceived: "2023-10-05", Supplier: "Bao bì Toàn Quốc", PONumber: "PO23-118", Status: "In Stock", Description: "Thùng carton đựng sản phẩm áo jacket." },
  { QRCode: "PKG-BAG-002-CLR", ItemNumber: "BAG-002", ItemCategory: "BAG", MaterialName: "Túi poly trong", Color: "Trong suốt", Size: "30x45 cm", Quantity: 8000, Unit: "Túi", Location: "Khu C-02-05", BatchNumber: "T20230920", DateReceived: "2023-09-20", Supplier: "Bao bì Việt Hưng", PONumber: "PO23-101", Status: "In Stock", Description: "Túi poly đựng áo sơ mi đã ủi." },
  { QRCode: "PKG-TP-001-CLR", ItemNumber: "TP-001", ItemCategory: "TAPE", MaterialName: "Băng keo trong", Color: "Trong suốt", Size: "4.8cm x 100m", Quantity: 300, Unit: "Cuộn", Location: "Khu C-01-08", BatchNumber: "K20231015", DateReceived: "2023-10-15", Supplier: "Băng keo Minh Long", PONumber: "PO23-125", Status: "In Stock", Description: "Băng keo dán thùng carton." },
  { QRCode: "PKG-LBL-005-WHT", ItemNumber: "LBL-005", ItemCategory: "LABEL", MaterialName: "Nhãn dán thùng", Color: "Trắng", Size: "10x15 cm", Quantity: 2500, Unit: "Nhãn", Location: "Khu D-01-01", BatchNumber: "L20231002", DateReceived: "2023-10-02", Supplier: "In ấn An An", PONumber: "PO23-116", Status: "Low Stock", Description: "Nhãn thông tin sản phẩm dán ngoài thùng." },
  { QRCode: "PKG-PAP-003-WHT", ItemNumber: "PAP-003", ItemCategory: "PAPER", MaterialName: "Giấy nến", Color: "Trắng", Size: "75x100 cm", Quantity: 0, Unit: "Tờ", Location: "Khu C-03-04", BatchNumber: "P20230925", DateReceived: "2023-09-25", Supplier: "Giấy Hải Tiến", PONumber: "PO23-105", Status: "Out of Stock", Description: "Giấy lót giữa các lớp áo trong thùng." },
];

// --- CÁC HÀM API GIẢ ---

// Lấy danh sách yêu cầu bao bì
export const getPackagingRequests = (): Promise<PackagingRequest[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Chỉ trả về các yêu cầu chưa hoàn thành
      resolve(MOCK_PACKAGING_REQUESTS.filter(req => req.Status !== 'Completed' && req.Status !== 'Cancelled'));
    }, 500);
  });
};

// Lấy danh sách bao bì trong kho
export const getPackagingInventory = (_bomId?: string): Promise<PackagingInventoryItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (_bomId) {
        // mock: no BOMID mapping available, returning items as-is
        // This reference prevents the '_bomId is defined but never used' warning
      }
      // Chỉ lấy các bao bì còn hàng
      const items = MOCK_PACKAGING_INVENTORY.filter(
        (item) => item.Quantity > 0 && item.Status !== 'Out of Stock'
      );
      resolve(items);
    }, 800);
  });
};
