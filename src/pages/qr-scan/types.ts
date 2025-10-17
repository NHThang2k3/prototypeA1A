// Path: src/pages/qr-scan/types.ts

// Chế độ hoạt động chính của màn hình
export type OperationMode = 'INBOUND' | 'OUTBOUND';

// --- Types cho luồng Nhập Kho (Inbound) ---
// NEW: Cập nhật trạng thái cho luồng Nhập Kho mới
export type InboundScanState = 'SCANNING_LOCATION' | 'AWAITING_ITEMS' | 'PROCESSING' | 'SUCCESS' | 'ERROR';

// UPDATED: Bỏ 'STOCK_COUNT'
export type ScanAction = 'PUT_AWAY' | 'TRANSFER' | 'VIEW_DETAIL';

// --- Types cho luồng Xuất Kho (Outbound) ---
export type OutboundScanState = 'SCANNING_REQUEST' | 'REQUEST_LOADED' | 'SCANNING_ITEM_FOR_ISSUE' | 'AWAITING_QUANTITY' | 'PROCESSING_ISSUE' | 'ISSUE_SUCCESS' | 'ISSUE_ERROR';

export type PickingListItem = {
  sku: string;
  name: string;
  uom: 'Cây' | 'Thùng' | 'Mét' | 'Cái';
  requiredQuantity: number;
  pickedQuantity: number;
  locations: string[]; // Gợi ý vị trí lấy hàng
};

export type IssueRequest = {
  qrCode: string; // Mã QR của phiếu yêu cầu
  type: 'issue_request';
  id: string;
  destination: string; // Nơi nhận hàng (VD: Bộ phận Cắt)
  status: 'new' | 'in_progress' | 'completed';
  pickingList: PickingListItem[];
};


// --- Types chung ---
export type ScannedItem = {
  qrCode: string;
  type: 'item';
  sku:string;
  name: string;
  quantity: number; // Số lượng gốc của đơn vị này (vd: 150m vải)
  uom: string;
  currentLocation: string | null;
  shipmentId: string; // Thuộc lô hàng nào
};

export type ScannedLocation = {
  qrCode: string;
  type: 'location';
  locationCode: string;
  description: string;
};

// Dữ liệu trả về sau khi quét có thể là 1 trong 3 loại này
export type ScannedData = ScannedItem | ScannedLocation | IssueRequest;