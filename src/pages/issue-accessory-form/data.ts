// Path: src/pages/issue-accessory-form/data.ts

import type { AccessoryRequest, AccessoryInventoryItem } from "./types";

// DỮ LIỆU GIẢ CHO SEWING LINE - TRIMS REQUEST
const MOCK_ACCESSORY_REQUESTS: AccessoryRequest[] = [
  { ID: "KB-001", RequestName: "Yêu cầu vải chính JKT-0821", DateCreated: "2023-11-20T08:00:00", DateRequired: "2023-11-20", FactoryLine: "Chuyền 1", Style: "JKT-0821", JOB: "Cắt", Color: "Black", Size: "M", PONumber: "PO-23-US-5512", RequiredQuantity: 500, IssuedQuantity: 0, Status: "New", Priority: "High", BOMID: "BOM-JKT-0821-V2", CreatedBy: "Nguyễn Thị Lan", Remarks: "Cần gấp để kịp tiến độ cắt." },
  { ID: "KB-002", RequestName: "Cấp chỉ may PNT-5503", DateCreated: "2023-11-19T14:30:00", DateRequired: "2023-11-20", FactoryLine: "Chuyền 3", Style: "PNT-5503", JOB: "May", Color: "Navy", Size: "L", PONumber: "PO-23-EU-8904", RequiredQuantity: 1200, IssuedQuantity: 1200, Status: "Completed", Priority: "Medium", BOMID: "BOM-PNT-5503-V1", CreatedBy: "Trần Văn Hùng", Remarks: "Đã nhận đủ hàng." },
  { ID: "KB-003", RequestName: "Yêu cầu cúc áo SHRT-112A", DateCreated: "2023-11-20T09:15:00", DateRequired: "2023-11-21", FactoryLine: "Chuyền 5", Style: "SHRT-112A", JOB: "Hoàn thiện", Color: "White", Size: "S", PONumber: "PO-23-JP-7765", RequiredQuantity: 800, IssuedQuantity: 500, Status: "Partially Issued", Priority: "Medium", BOMID: "BOM-SHRT-112A-V1", CreatedBy: "Lê Thị Hoa", Remarks: "Kho báo sẽ cấp phần còn lại vào chiều nay." },
  { ID: "KB-004", RequestName: "Lấy vải lót cho JKT-0821", DateCreated: "2023-11-20T10:00:00", DateRequired: "2023-11-20", FactoryLine: "Chuyền 1", Style: "JKT-0821", JOB: "May", Color: "Black", Size: "M", PONumber: "PO-23-US-5512", RequiredQuantity: 500, IssuedQuantity: 0, Status: "Ready for Pickup", Priority: "Medium", BOMID: "BOM-JKT-0821-V2", CreatedBy: "Nguyễn Thị Lan", Remarks: "Kho đã soạn xong, chờ tổ trưởng nhận." },
  { ID: "KB-005", RequestName: "Yêu cầu dây kéo cho PNT-5503", DateCreated: "2023-11-20T11:25:00", DateRequired: "2023-11-21", FactoryLine: "Chuyền 3", Style: "PNT-5503", JOB: "May", Color: "Navy", Size: "L", PONumber: "PO-23-EU-8904", RequiredQuantity: 1200, IssuedQuantity: 0, Status: "New", Priority: "Medium", BOMID: "BOM-PNT-5503-V1", CreatedBy: "Trần Văn Hùng", Remarks: "" },
  { ID: "KB-007", RequestName: "Yêu cầu nhãn mác cho SHRT-112A", DateCreated: "2023-11-21T13:00:00", DateRequired: "2023-11-22", FactoryLine: "Chuyền 5", Style: "SHRT-112A", JOB: "Hoàn thiện", Color: "White", Size: "S, M, L", PONumber: "PO-23-JP-7765", RequiredQuantity: 2400, IssuedQuantity: 0, Status: "Picking", Priority: "Low", BOMID: "BOM-SHRT-112A-V1", CreatedBy: "Lê Thị Hoa", Remarks: "Kho đang tìm hàng." },
  { ID: "KB-010", RequestName: "Yêu cầu mex cổ cho SHRT-112A", DateCreated: "2023-11-23T08:10:00", DateRequired: "2023-11-24", FactoryLine: "Chuyền 5", Style: "SHRT-112A", JOB: "Cắt", Color: "White", Size: "All sizes", PONumber: "PO-23-JP-7765", RequiredQuantity: 1500, IssuedQuantity: 0, Status: "New", Priority: "Medium", BOMID: "BOM-SHRT-112A-V1", CreatedBy: "Lê Thị Hoa", Remarks: "" }
];

// DỮ LIỆU GIẢ CHO ACCESSORY INVENTORY
const MOCK_ACCESSORY_INVENTORY: AccessoryInventoryItem[] = [
  { QRCode: "ACC-BTN-001-BLK", ItemNumber: "BTN-001", ItemCategory: "BTN", MaterialName: "Cúc nhựa 4 lỗ", Color: "Đen", Size: "15mm", Quantity: 5000, Unit: "Cái", Location: "Kệ A-01-05", BatchNumber: "B20231001", DateReceived: "2023-10-01", Supplier: "Phụ liệu Phong Phú", PONumber: "PO23-115", Status: "In Stock", Description: "Cúc nhựa thông dụng cho áo sơ mi nam." },
  { QRCode: "ACC-ZIP-001-BRS", ItemNumber: "ZIP-001", ItemCategory: "ZIP", MaterialName: "Khóa kéo kim loại", Color: "Đồng", Size: "50cm", Quantity: 850, Unit: "Cái", Location: "Kệ B-03-01", BatchNumber: "Z20230915", DateReceived: "2023-09-15", Supplier: "Dệt may Thành Công", PONumber: "PO23-098", Status: "In Stock", Description: "Dùng cho áo khoác jean, loại răng 5." },
  { QRCode: "ACC-THR-001-WHT", ItemNumber: "THR-001", ItemCategory: "THR", MaterialName: "Chỉ may polyester", Color: "Trắng", Size: "40/2", Quantity: 150, Unit: "Cuộn", Location: "Kệ C-02-11", BatchNumber: "T20231010", DateReceived: "2023-10-10", Supplier: "Sợi Việt Thắng", PONumber: "PO23-121", Status: "In Stock", Description: "Chỉ may vắt sổ, độ bền cao." },
  { QRCode: "ACC-BTN-002-BRN", ItemNumber: "BTN-002", ItemCategory: "BTN", MaterialName: "Cúc gỗ 2 lỗ", Color: "Nâu", Size: "20mm", Quantity: 90, Unit: "Cái", Location: "Kệ A-01-06", BatchNumber: "B20230820", DateReceived: "2023-08-20", Supplier: "Phụ liệu Sài Gòn", PONumber: "PO23-075", Status: "Low Stock", Description: "Cúc trang trí cho áo khoác len." },
  { QRCode: "ACC-LBL-001-MLT", ItemNumber: "LBL-001", ItemCategory: "LBL", MaterialName: "Nhãn dệt logo", Color: "Nhiều màu", Size: "2cm x 5cm", Quantity: 0, Unit: "Cái", Location: "Kệ D-05-02", BatchNumber: "L20230701", DateReceived: "2023-07-01", Supplier: "Nhãn mác An Phát", PONumber: "PO23-050", Status: "Out of Stock", Description: "Nhãn dệt chính cho áo T-shirt." },
  { QRCode: "ACC-ELS-001-WHT", ItemNumber: "ELS-001", ItemCategory: "ELS", MaterialName: "Thun dệt kim", Color: "Trắng", Size: "2.5cm", Quantity: 2500, Unit: "Mét", Location: "Kệ C-04-08", BatchNumber: "E20230928", DateReceived: "2023-09-28", Supplier: "Phụ liệu Phong Phú", PONumber: "PO23-109", Status: "In Stock", Description: "Thun luồn lưng quần thể thao." },
  { QRCode: "ACC-INT-001-WHT", ItemNumber: "INT-001", ItemCategory: "INT", MaterialName: "Keo giấy dựng cổ", Color: "Trắng", Size: "90cm", Quantity: 800, Unit: "Mét", Location: "Kệ B-01-03", BatchNumber: "I20230905", DateReceived: "2023-09-05", Supplier: "Dệt may Thành Công", PONumber: "PO23-088", Status: "In Stock", Description: "Keo ủi dùng cho cổ và nẹp áo sơ mi." },
  { QRCode: "ACC-ZIP-002-RED", ItemNumber: "ZIP-002", ItemCategory: "ZIP", MaterialName: "Khóa kéo giọt nước", Color: "Đỏ", Size: "20cm", Quantity: 320, Unit: "Cái", Location: "Kệ B-03-09", BatchNumber: "Z20231005", DateReceived: "2023-10-05", Supplier: "Phụ liệu Sài Gòn", PONumber: "PO23-118", Status: "In Stock", Description: "Khóa kéo giấu, dùng cho đầm nữ." }
];

// --- CÁC HÀM API GIẢ ---

// Lấy danh sách yêu cầu phụ liệu
export const getAccessoryRequests = (): Promise<AccessoryRequest[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Chỉ trả về các yêu cầu chưa hoàn thành
      resolve(MOCK_ACCESSORY_REQUESTS.filter(req => req.Status !== 'Completed' && req.Status !== 'Cancelled'));
    }, 500);
  });
};

// Lấy danh sách phụ liệu trong kho
// Trong thực tế, có thể lọc theo BOMID của request đã chọn
export const getAccessoryInventory = (_bomId?: string): Promise<AccessoryInventoryItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // If a BOMID is provided, acknowledge it in the mock (no real mapping in mock data)
      if (_bomId) {
        // mock: no BOMID mapping available, returning items as-is
        // This reference prevents the '_bomId is defined but never used' warning
      }

      // Chỉ lấy các phụ liệu còn hàng
      const items = MOCK_ACCESSORY_INVENTORY.filter(
        (item) => item.Quantity > 0 && item.Status !== 'Out of Stock'
      );
      // NOTE: Logic lọc theo BOMID sẽ được thêm ở đây trong môi trường thật
      resolve(items);
    }, 800);
  });
};