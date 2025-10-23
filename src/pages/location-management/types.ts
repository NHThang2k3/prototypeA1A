// Path: src/pages/location-management/types.ts

// Cấu trúc một vị trí kho (dạng phẳng)
export interface LocationItem {
  id: string; // Ví dụ: 'F1-01-01'
  country: 'Vietnam' | 'Cambodia' | 'Thailand'; // Quốc gia
  factory: string; // Nhà máy
  warehouse: string;
  shelf: number;
  pallet: number;
  capacity: number;
  currentOccupancy: number;
  lastUpdated: string; // Giữ dạng string để đơn giản
  description: string;
  qrCode: string; // Mã QR Code định danh
  isQrPrinted: boolean; // Trạng thái đã in QR Code hay chưa
  purpose: 'fabric' | 'accessories' | 'packaging'; // Mục đích sử dụng của kho
  enabled: boolean; // Trạng thái hoạt động
}

// Cấu trúc một cuộn vải trong kho
export interface FabricRoll {
  id: string; // Mã cuộn vải (Item Code)
  locationId: string; // Mã vị trí kho đang chứa nó
  colorCode: string;
  yards: number; // Chiều dài
  rollNo: string;
  lotNo: string;
}