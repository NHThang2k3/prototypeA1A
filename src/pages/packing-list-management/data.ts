// path: src/pages/packing-list-management/data.ts

import type { PackingListDetails } from "./types";

// Dữ liệu mẫu cho một Packing List chi tiết của một PO cụ thể
export const mockPackingList: PackingListDetails = {
  id: '1',
  poNumber: 'PO-2023-00123',
  supplier: 'Vải Sợi Miền Nam',
  eta: '2023-11-15',
  items: [
    {
      id: 'item-1',
      itemCode: 'VCM-001',
      description: 'Vải Cotton 100%',
      color: 'Trắng',
      lotNumber: 'LOT-2311-01',
      quantity: 1500,
      unit: 'm',
      printStatus: 'NOT_PRINTED',
      breakdownUnits: [], // Ban đầu chưa được phân rã
    },
    {
      id: 'item-2',
      itemCode: 'VK-005',
      description: 'Vải Kate Silk',
      color: 'Xanh Navy',
      lotNumber: 'LOT-2311-02',
      quantity: 850,
      unit: 'm',
      printStatus: 'NOT_PRINTED',
      breakdownUnits: [],
    },
    {
      id: 'item-3',
      itemCode: 'PL-BTN-02',
      description: 'Nút áo 4 lỗ',
      color: 'Đen',
      lotNumber: 'LOT-2311-03',
      quantity: 50,
      unit: 'thùng',
      printStatus: 'PRINTED', // Giả sử mục này đã được phân rã và in
      breakdownUnits: [
        { id: 'unit-3-1', parentItemId: 'item-3', name: 'Thùng 1', quantity: 10000, qrCode: 'QR_CODE_DATA_FOR_BOX_1' },
        { id: 'unit-3-2', parentItemId: 'item-3', name: 'Thùng 2', quantity: 10000, qrCode: 'QR_CODE_DATA_FOR_BOX_2' },
        // ... 48 thùng khác
      ],
    },
     {
      id: 'item-4',
      itemCode: 'CH-ZIP-18',
      description: 'Dây kéo 18cm',
      color: 'Trắng',
      lotNumber: 'LOT-2311-04',
      quantity: 20,
      unit: 'thùng',
      printStatus: 'NOT_PRINTED',
      breakdownUnits: [],
    },
  ],
};