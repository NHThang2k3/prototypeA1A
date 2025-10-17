// Path: src/pages/qr-scan/data.ts

import type { ScannedData, ScannedItem, ScannedLocation, IssueRequest } from './types';

// ... (MOCK_INVENTORY_DB không thay đổi) ...
const MOCK_INVENTORY_DB: { [key: string]: ScannedData } = {
  // Items - Mỗi QR code là duy nhất cho từng đơn vị (từng cây vải, từng thùng hàng)
  "ITEM_QR_FAB_001": {
    qrCode: "ITEM_QR_FAB_001", type: 'item', sku: 'FVN-102-BLUE', name: 'Vải Cotton Xanh Navy (Lô 1)',
    quantity: 150, uom: 'Mét', currentLocation: null, shipmentId: 'SH-001'
  },
  "ITEM_QR_FAB_002": {
    qrCode: "ITEM_QR_FAB_002", type: 'item', sku: 'FVN-102-BLUE', name: 'Vải Cotton Xanh Navy (Lô 1)',
    quantity: 148.5, uom: 'Mét', currentLocation: 'FBWH-A-01-A', shipmentId: 'SH-001'
  },
   "ITEM_QR_FAB_004_NEW": {
    qrCode: "ITEM_QR_FAB_004_NEW", type: 'item', sku: 'FVN-108-BLACK', name: 'Vải Kaki Đen',
    quantity: 200, uom: 'Mét', currentLocation: null, shipmentId: 'SH-003'
  },
  "ITEM_QR_ACC_003": {
    qrCode: "ITEM_QR_ACC_003", type: 'item', sku: 'BTN-005-WHITE', name: 'Thùng Nút Áo Trắng (5000 cái)',
    quantity: 5000, uom: 'Cái', currentLocation: 'ACCWH-C-05-D', shipmentId: 'SH-002'
  },
  // Locations
  "LOC_QR_A_01_B": {
    qrCode: "LOC_QR_A_01_B", type: 'location', locationCode: 'FBWH-A-01-B',
    description: 'Kho Vải, Khu A, Dãy 01, Kệ B',
  },
  "LOC_QR_C_05_D": {
    qrCode: "LOC_QR_C_05_D", type: 'location', locationCode: 'ACCWH-C-05-D',
    description: 'Kho Phụ Liệu, Khu C, Dãy 05, Kệ D',
  },
  // Issue Requests
  "ISSUE_REQ_001": {
    qrCode: "ISSUE_REQ_001", type: 'issue_request', id: 'YR-2024-001', destination: 'Bộ phận Cắt',
    status: 'new',
    pickingList: [
      { sku: 'FVN-102-BLUE', name: 'Vải Cotton Xanh Navy', uom: 'Mét', requiredQuantity: 250, pickedQuantity: 0, locations: ['FBWH-A-01-A'] },
      { sku: 'BTN-005-WHITE', name: 'Nút Áo Trắng', uom: 'Cái', requiredQuantity: 1000, pickedQuantity: 0, locations: ['ACCWH-C-05-D'] },
    ]
  }
};


// ... (fetchScannedData không thay đổi) ...
export const fetchScannedData = (qrCode: string): Promise<ScannedData> => {
  console.log(`Simulating API call for QR: ${qrCode}`);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = MOCK_INVENTORY_DB[qrCode];
      if (data) {
        resolve(JSON.parse(JSON.stringify(data)));
      } else {
        reject(new Error("Mã QR không hợp lệ hoặc không tìm thấy."));
      }
    }, 300);
  });
};


// NEW: Hàm giả lập API cất hàng (Nhập kho) được cập nhật
export const submitPutAwayAction = (items: ScannedItem[], location: ScannedLocation): Promise<{ success: boolean; message: string }> => {
    console.log(`Simulating ACTION [INBOUND]: Moving ${items.length} items to ${location.locationCode}`);
    return new Promise((resolve) => {
        setTimeout(() => {
            // Cập nhật DB giả cho từng item
            items.forEach(item => {
                const dbItem = MOCK_INVENTORY_DB[item.qrCode] as ScannedItem;
                if (dbItem) {
                    dbItem.currentLocation = location.locationCode;
                }
            });
            resolve({ success: true, message: `Đã cất thành công ${items.length} vật tư vào vị trí ${location.locationCode}!` });
        }, 500);
    });
}

// ... (submitIssueAction không thay đổi) ...
export const submitIssueAction = (request: IssueRequest, item: ScannedItem, issuedQuantity: number): Promise<{ success: boolean; message: string; updatedRequest: IssueRequest }> => {
  console.log(`Simulating ACTION [OUTBOUND]: Issuing ${issuedQuantity} ${item.uom} of ${item.sku} for request ${request.id}`);
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          const itemInPickingList = request.pickingList.find(p => p.sku === item.sku);
          const dbItem = MOCK_INVENTORY_DB[item.qrCode] as ScannedItem;

          if (!itemInPickingList || !dbItem) {
            return reject({ success: false, message: "Lỗi hệ thống: Không tìm thấy vật tư trong phiếu hoặc DB." });
          }

          itemInPickingList.pickedQuantity += issuedQuantity;
          dbItem.quantity -= issuedQuantity;

          const message = `Xuất thành công ${issuedQuantity} ${item.uom} của ${item.sku}. Tồn kho còn lại của cuộn/thùng: ${dbItem.quantity} ${item.uom}.`;
          resolve({ success: true, message: message, updatedRequest: request });
      }, 700);
  });
}