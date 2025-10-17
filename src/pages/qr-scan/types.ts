// Path: src/pages/qr-scan/types.ts

// Chế độ hoạt động chính của màn hình
export type OperationMode = 'INBOUND' | 'OUTBOUND' | 'TRANSFER';

// NEW: Định nghĩa các loại vật tư có thể xuất kho
export type ItemCategory = 'FABRIC' | 'ACCESSORY' | 'PACKAGING';

// --- Types cho luồng Nhập Kho (Inbound) ---
export type InboundScanState = 'SCANNING_LOCATION' | 'AWAITING_ITEMS' | 'PROCESSING';

// --- Types cho luồng Chuyển Kho (Transfer) ---
export type TransferScanState = 'SCANNING_ITEM_TO_MOVE' | 'SCANNING_NEW_LOCATION' | 'PROCESSING';

// --- Types cho luồng Xuất Kho (Outbound) ---
// UPDATED: Thêm trạng thái 'SELECTING_CATEGORY'
export type OutboundScanState = 'SELECTING_CATEGORY' | 'SCANNING_REQUEST' | 'REQUEST_LOADED' | 'SCANNING_ITEM_FOR_ISSUE' | 'PROCESSING_ISSUE';

// --- Types chung không thay đổi nhiều ---

// ADD THIS TYPE: Định nghĩa các hành động có thể thực hiện sau khi quét 1 vật tư
export type ScanAction = 'PUT_AWAY' | 'TRANSFER';

export type PickingListItem = {
  sku: string;
  name: string;
  uom: 'Cây' | 'Th thùng' | 'Mét' | 'Cái';
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
  // NEW: Thêm category để có thể lọc phiếu yêu cầu sau này
  category: ItemCategory;
};

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