// Path: src/pages/qr-scan/data.ts
import type {
  ScannedData,
  ScannedItem,
  ScannedLocation,
  IssueRequest,
} from "./types";

// --- DỮ LIỆU GIẢ LẬP ---
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
  },
  ITEM_QR_ACC_003: {
    qrCode: "ITEM_QR_ACC_003",
    type: "item",
    sku: "ACC-BTN-05",
    name: "Nút áo 4 lỗ màu trắng",
    quantity: 5000,
    uom: "Cái",
    currentLocation: "B-02-C",
    shipmentId: "SH-2023-102",
  },
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
    category: "picking" as IssueRequest["category"],
    pickingList: [
      { sku: "FAB-RED-02", name: "Vải Kate Đỏ", uom: "Mét", requiredQuantity: 200, pickedQuantity: 80, locations: ["A-01-B", "A-01-C"] },
      { sku: "ACC-BTN-05", name: "Nút áo 4 lỗ màu trắng", uom: "Cái", requiredQuantity: 10000, pickedQuantity: 5000, locations: ["B-02-C"] },
    ],
  },
};

// --- CÁC HÀM API GIẢ LẬP ---

export const fetchScannedData = (qrCode: string): Promise<ScannedData> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const data = MOCK_DATA[qrCode];
      if (data) {
        resolve(data);
      } else {
        reject(new Error(`Mã QR không hợp lệ hoặc không tìm thấy: ${qrCode}`));
      }
    }, 500);
  });
};

export const submitPutAwayAction = (items: ScannedItem[], location: ScannedLocation): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Đã cất ${items.length} vật tư vào vị trí ${location.locationCode}`);
      resolve({ success: true, message: `Thành công! Đã cất ${items.length} vật tư vào vị trí ${location.locationCode}.` });
    }, 1000);
  });
};

export const submitIssueAction = (request: IssueRequest, item: ScannedItem, quantity: number): Promise<{ success: boolean; message: string; updatedRequest: IssueRequest }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedPickingList = request.pickingList.map(p => {
        if (p.sku === item.sku) {
          return { ...p, pickedQuantity: p.pickedQuantity + quantity };
        }
        return p;
      });
      const updatedRequest = { ...request, pickingList: updatedPickingList };
      console.log(`Đã xuất ${quantity} ${item.uom} của ${item.name} cho phiếu ${request.id}`);
      resolve({
        success: true,
        message: `Đã xuất ${quantity.toLocaleString()} ${item.uom} của ${item.name}.`,
        updatedRequest: updatedRequest,
      });
    }, 1000);
  });
};

// **HÀM MỚI ĐƯỢC THÊM VÀO**
export const submitTransferAction = (item: ScannedItem, newLocation: ScannedLocation): Promise<{ success: boolean; message: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Chuyển ${item.name} từ ${item.currentLocation} đến ${newLocation.locationCode}`);
      resolve({ success: true, message: `Đã chuyển vật tư ${item.name} đến vị trí ${newLocation.locationCode} thành công.` });
    }, 1000);
  });
};