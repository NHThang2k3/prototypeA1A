// Path: src/pages/inventory-list/InventoryListPage.tsx

import React, { useState, useEffect } from "react";
import { InventoryHeader } from "./components/InventoryHeader";
import { InventoryFilters } from "./components/InventoryFilters";
import { InventoryTable } from "./components/InventoryTable";
import type { InventoryItem } from "./types";
import { FilterSkeleton } from "./components/skeletons/FilterSkeleton";
import { TableSkeleton } from "./components/skeletons/TableSkeleton";

// Dữ liệu giả để demo
const DUMMY_DATA: InventoryItem[] = [
  {
    id: "1",
    sku: "FVN-102-BLUE",
    name: "Vải Kate Ford 1.5m",
    uom: "Mét",
    warehouse: "Fabric WH",
    location: "A-01-B",
    quantityInStock: 12500,
    quantityAvailable: 12000,
    status: "in-stock",
  },
  {
    id: "2",
    sku: "ACC-BTN-005",
    name: "Nút 4 lỗ 15mm",
    uom: "Cái",
    warehouse: "Accessory WH",
    location: "C-12-D",
    quantityInStock: 85000,
    quantityAvailable: 85000,
    status: "in-stock",
  },
  {
    id: "3",
    sku: "PAK-TAG-991",
    name: "Thẻ bài Brand X",
    uom: "Cái",
    warehouse: "Packing WH",
    location: "E-03-A",
    quantityInStock: 2200,
    quantityAvailable: 1800,
    status: "low-stock",
  },
  {
    id: "4",
    sku: "ACC-ZIP-YKK",
    name: "Dây kéo YKK 20cm",
    uom: "Sợi",
    warehouse: "Accessory WH",
    location: "C-15-F",
    quantityInStock: 0,
    quantityAvailable: 0,
    status: "out-of-stock",
  },
  {
    id: "5",
    sku: "FVN-DENIM-01",
    name: "Vải Denim Washed",
    uom: "Mét",
    warehouse: "Fabric WH",
    location: "A-02-C",
    quantityInStock: 800,
    quantityAvailable: 800,
    status: "low-stock",
  },
  {
    id: "6",
    sku: "PAK-BOX-L",
    name: "Thùng carton lớn",
    uom: "Thùng",
    warehouse: "Packing WH",
    location: "F-01-A",
    quantityInStock: 530,
    quantityAvailable: 530,
    status: "in-stock",
  },
];

const InventoryListPage = () => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Giả lập việc fetch data từ API
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setInventoryItems(DUMMY_DATA);
      setIsLoading(false);
    }, 1500); // Giả lập độ trễ mạng 1.5s

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-4 md:p-6 lg:p-8">
      {/* Layout chính của trang: grid 2 cột cho desktop, 1 cột cho mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-8">
        {/* Cột Filter (bên trái trên desktop) */}
        <aside className="lg:col-span-1 mb-8 lg:mb-0">
          {isLoading ? <FilterSkeleton /> : <InventoryFilters />}
        </aside>

        {/* Cột nội dung chính (bên phải trên desktop) */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <TableSkeleton />
          ) : (
            <>
              <InventoryHeader />
              {inventoryItems.length > 0 ? (
                <InventoryTable items={inventoryItems} />
              ) : (
                <div className="bg-white text-center p-12 rounded-lg shadow-sm">
                  <h3 className="text-xl font-medium text-gray-900">
                    Không tìm thấy vật tư
                  </h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Không có vật tư nào phù hợp với bộ lọc hiện tại.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryListPage;
