// Path: src/pages/shipment-detail/data.ts

import type { Shipment } from "./types";

export const mockShipmentData: Shipment = {
  id: "7c3b9a1d",
  packingListNo: "PL-Vn-2023-11-001",
  poNumber: "PO-456-FABRIC",
  supplier: "Công ty TNHH Vải Sợi Miền Nam",
  etd: "2023-11-10",
  eta: "2023-11-12",
  status: "Mới tạo",
  items: [
    {
      id: 1,
      sku: "FVN-102-BLUE",
      name: "Vải Cotton 100% - Xanh Navy",
      quantity: 1500,
      uom: "M",
      printStatus: "printed",
      // Dữ liệu phân rã mẫu
      breakdown: [
        {
          uniqueId: "7c3b9a1d-1-1",
          parentId: 1,
          itemNumber: 1,
          quantity: 150.5,
          printStatus: "printed",
        },
        {
          uniqueId: "7c3b9a1d-1-2",
          parentId: 1,
          itemNumber: 2,
          quantity: 149.0,
          printStatus: "printed",
        },
        {
          uniqueId: "7c3b9a1d-1-3",
          parentId: 1,
          itemNumber: 3,
          quantity: 151.0,
          printStatus: "not_printed",
        },
      ],
    },
    {
      id: 2,
      sku: "FVN-103-WHT",
      name: "Vải Cotton 100% - Trắng",
      quantity: 2000,
      uom: "M",
      printStatus: "not_printed",
      breakdown: [], // Chưa phân rã
    },
    {
      id: 3,
      sku: "ACC-ZIP-05",
      name: "Khóa kéo YKK 5cm",
      quantity: 5000,
      uom: "Cái",
      printStatus: "not_printed",
    },
    {
      id: 4,
      sku: "ACC-BTN-12",
      name: "Nút nhựa 4 lỗ 12mm",
      quantity: 10000,
      uom: "Cái",
      printStatus: "not_printed",
    },
    {
      id: 5,
      sku: "PKG-TAG-L",
      name: "Thẻ bài logo size L",
      quantity: 1200,
      uom: "Cái",
      printStatus: "printed",
    },
    {
      id: 6,
      sku: "PKG-POLY-M",
      name: "Túi Poly size M",
      quantity: 1200,
      uom: "Cái",
      printStatus: "not_printed",
    },
  ],
};