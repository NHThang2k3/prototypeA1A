// Path: src/pages/issue-fabric-form/data.ts

import type { AvailableRoll } from "./types";

// Danh sách các mã vải để gợi ý (autocomplete)
export const MOCK_FABRIC_SKUS = [
  { sku: "FVN-102-BLUE", name: "Vải Kate Ford", color: "Xanh Dương", width: "1.5m", availableQty: 1200 },
  { sku: "FVN-105-RED", name: "Vải Lụa Tơ Tằm", color: "Đỏ", width: "1.2m", availableQty: 850 },
  { sku: "FCT-201-BLK", name: "Vải Cotton 4 chiều", color: "Đen", width: "1.8m", availableQty: 2500 },
];

// Dữ liệu giả cho các cây vải có sẵn trong kho theo từng SKU
const MOCK_AVAILABLE_ROLLS: Record<string, AvailableRoll[]> = {
  "FVN-102-BLUE": [
    { id: "ROLL-001", location: "A-01-01", availableMeters: 150.5 },
    { id: "ROLL-002", location: "A-01-02", availableMeters: 80.0 },
    { id: "ROLL-003", location: "B-03-05", availableMeters: 125.2 },
  ],
  "FVN-105-RED": [
    { id: "ROLL-008", location: "C-02-01", availableMeters: 200.0 },
    { id: "ROLL-009", location: "C-02-02", availableMeters: 110.7 },
  ],
  "FCT-201-BLK": [
    { id: "ROLL-015", location: "D-05-08", availableMeters: 300.0 },
    { id: "ROLL-016", location: "D-05-09", availableMeters: 285.5 },
    { id: "ROLL-017", location: "D-05-10", availableMeters: 310.0 },
  ],
};

// Hàm giả lập việc gọi API để lấy danh sách cây vải
export const getAvailableRollsBySku = (sku: string): Promise<AvailableRoll[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_AVAILABLE_ROLLS[sku] || []);
    }, 500); // Giả lập độ trễ mạng
  });
};