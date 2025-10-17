// Path: src/pages/qr-scan/data.ts
import type {
  ScannedData,
  ScannedItem,
  ScannedLocation,
  IssueRequest,
} from "./types";

// --- DỮ LIỆU GIẢ LẬP (CẬP NHẬT VỚI DỮ LIỆU CHI TIẾT) ---
const MOCK_DATA: Record<string, ScannedData> = {
  ITEM_QR_FAB_001: {
    qrCode: "ITEM_QR_FAB_001",
    type: "item",
    sku: "FAB-BLUE-01",
    name: "Vải Cotton Xanh Navy",
    quantity: 150,
    uom: "Mét",
    currentLocation: null,
    shipmentId: "SH-2023-101",
    color: "Xanh Navy",
    length: 100, // mét
    weight: 25.5, // kg
  },
  ITEM_QR_FAB_002: {
    qrCode: "ITEM_QR_FAB_002",
    type: "item",
    sku: "FAB-RED-02",
    name: "Vải Kate Đỏ",
    quantity: 120.5,
    uom: "Mét",
    currentLocation: "A-01-B",
    shipmentId: "SH-2023-101",
    color: "Đỏ",
    length: 80,
    weight: 22,
  },
  ITEM_QR_FAB_003: {
    qrCode: "ITEM_QR_FAB_003",
    type: "item",
    sku: "FAB-SILK-03",
    name: "Vải Lụa Trắng",
    quantity: 88,
    uom: "Mét",
    currentLocation: "B-02-C",
    shipmentId: "SH-2023-102",
    color: "Trắng",
    length: 110,
    weight: 15,
  },
  ITEM_QR_FAB_004: {
    qrCode: "ITEM_QR_FAB_004",
    type: "item",
    sku: "FAB-DENIM-04",
    name: "Vải Denim Xanh Đậm",
    quantity: 250,
    uom: "Mét",
    currentLocation: null,
    shipmentId: "SH-2023-103",
    color: "Xanh Đậm",
    length: 150,
    weight: 50,
  },
  // ... (Dữ liệu LOCATION và ISSUE_REQUEST giữ nguyên)
  LOC_QR_A_01_B: {
    qrCode: "LOC_QR_A_01_B",
    type: "location",
    locationCode: "A-01-B",
    description: "Kệ A, Tầng 1, Ngăn B",
  },
  LOC_QR_C_03_A: {
    qrCode: "LOC_QR_C_03_A",
    type: "location",
    locationCode: "C-03-A",
    description: "Kệ C, Tầng 3, Ngăn A",
  },
  ISSUE_REQ_001: {
    qrCode: "ISSUE_REQ_001",
    type: "issue_request",
    id: "PXK-2023-088",
    destination: "Bộ phận Cắt",
    status: "in_progress",
    pickingList: [
      { sku: "FAB-RED-02", name: "Vải Kate Đỏ", uom: "Mét", requiredQuantity: 200, pickedQuantity: 80, locations: ["A-01-B", "A-01-C"] },
      { sku: "FAB-SILK-03", name: "Vải Lụa Trắng", uom: "Mét", requiredQuantity: 88, pickedQuantity: 0, locations: ["B-02-C"] },
    ],
  },
};
// ... (Các hàm API giả lập giữ nguyên)
// ...
export const fetchScannedData = (qrCode: string): Promise<ScannedData> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const data = MOCK_DATA[qrCode];
        if (data) {
          resolve(JSON.parse(JSON.stringify(data)));
        } else {
          reject(new Error(`Mã QR không hợp lệ hoặc không tìm thấy: ${qrCode}`));
        }
      }, 500);
    });
  };
  
  export const submitPutAwayAction = (items: ScannedItem[], location: ScannedLocation): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Đã cất ${items.length} cuộn vải vào vị trí ${location.locationCode}`);
        resolve({ success: true, message: `Thành công! Đã cất ${items.length} cuộn vải vào vị trí ${location.locationCode}.` });
      }, 1000);
    });
  };
  
  export const submitIssueAction = (request: IssueRequest, item: ScannedItem, quantity: number): Promise<{ success: boolean; message: string; updatedRequest: IssueRequest }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const originalRequest = MOCK_DATA[request.qrCode] as IssueRequest;
        if (originalRequest) {
            const pickingItem = originalRequest.pickingList.find(p => p.sku === item.sku);
            if (pickingItem) {
                pickingItem.pickedQuantity += quantity;
            }
        }
        const updatedRequest = MOCK_DATA[request.qrCode] as IssueRequest;
        console.log(`Đã xuất ${quantity} ${item.uom} của ${item.name} cho phiếu ${request.id}`);
        resolve({
          success: true,
          message: `Đã tự động xuất ${quantity.toLocaleString()} ${item.uom} của ${item.name}.`,
          updatedRequest: JSON.parse(JSON.stringify(updatedRequest)),
        });
      }, 1000);
    });
  };
  
  export const submitTransferAction = (item: ScannedItem, newLocation: ScannedLocation): Promise<{ success: boolean; message: string }> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(`Chuyển ${item.name} từ ${item.currentLocation} đến ${newLocation.locationCode}`);
        resolve({ success: true, message: `Đã chuyển cuộn vải ${item.name} đến vị trí ${newLocation.locationCode} thành công.` });
      }, 1000);
    });
  };