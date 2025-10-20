// Path: src/pages/location-management/types.ts

// Cấu trúc một vị trí kho (dạng phẳng)
export interface LocationItem {
  id: string; // Ví dụ: 'F1-01-01'
  warehouse: string;
  shelf: number;
  pallet: number;
  capacity: number;
  currentOccupancy: number;
  lastUpdated: string; // Giữ dạng string để đơn giản
  description: string;
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