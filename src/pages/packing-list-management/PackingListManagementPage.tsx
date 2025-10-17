// src/pages/packing-list-management/PackingListManagementPage.tsx

import React, { useState, useEffect } from "react";
import PageHeader from "./components/PageHeader";
import PackingListFilters from "./components/PackingListFilters";
import PackingListTable from "./components/PackingListTable";
import TableSkeleton from "./components/skeletons/TableSkeleton";
import BreakdownModal from "./components/BreakdownModal"; // Import modal
import { mockPackingList } from "./data";
import type {
  PackingListDetails,
  PackingListItem,
  BreakdownUnit,
} from "./types";

const PackingListManagementPage = () => {
  const [loading, setLoading] = useState(true);
  const [packingListDetails, setPackingListDetails] =
    useState<PackingListDetails | null>(null);

  // State cho modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<PackingListItem | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPackingListDetails(mockPackingList);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Hàm mở modal và set item hiện tại
  const handleOpenBreakdownModal = (item: PackingListItem) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  // Hàm đóng modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
  };

  // Hàm lưu dữ liệu từ modal
  const handleSaveBreakdown = (itemId: string, units: BreakdownUnit[]) => {
    setPackingListDetails((prevDetails) => {
      if (!prevDetails) return null;

      const newItems = prevDetails.items.map((item) => {
        if (item.id === itemId) {
          return { ...item, breakdownUnits: units };
        }
        return item;
      });

      return { ...prevDetails, items: newItems };
    });
  };

  // Hàm xử lý logic in
  const handlePrintItems = (itemIds: Set<string>) => {
    const unreadyItems: string[] = [];

    const newDetails = JSON.parse(
      JSON.stringify(packingListDetails)
    ) as PackingListDetails;

    itemIds.forEach((id) => {
      const item = newDetails.items.find((i) => i.id === id);
      if (item) {
        if (item.breakdownUnits.length === 0) {
          unreadyItems.push(item.itemCode);
        } else {
          item.printStatus = "PRINTED";
          item.breakdownUnits.forEach((unit) => {
            // Sinh QR Code nếu chưa có
            if (!unit.qrCode) {
              unit.qrCode = `QR_${item.itemCode}_${unit.name.replace(
                /\s/g,
                ""
              )}_${Date.now()}`;
            }
          });
        }
      }
    });

    if (unreadyItems.length > 0) {
      alert(
        `Các vật tư sau chưa được phân rã và không thể in: ${unreadyItems.join(
          ", "
        )}`
      );
    } else {
      setPackingListDetails(newDetails);
      const printedItemCodes = newDetails.items
        .filter((item) => itemIds.has(item.id))
        .map((item) => item.itemCode)
        .join(", ");
      alert(
        `Đã gửi lệnh in cho các vật tư: ${printedItemCodes}\n(Trong thực tế, đây là lúc gọi API in ấn và lưu dữ liệu QR vào DB).`
      );
    }
  };

  return (
    <div className="p-4 md:p-6 lg:p-8 bg-gray-50 min-h-full">
      <PageHeader
        poNumber={loading ? "..." : packingListDetails?.poNumber ?? ""}
      />

      <PackingListFilters />

      {loading ? (
        <TableSkeleton />
      ) : packingListDetails ? (
        <PackingListTable
          items={packingListDetails.items}
          onBreakdown={handleOpenBreakdownModal}
          onPrint={handlePrintItems}
        />
      ) : (
        <p>Không tìm thấy dữ liệu Packing List.</p>
      )}

      {/* Render Modal */}
      <BreakdownModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveBreakdown}
        item={currentItem}
      />
    </div>
  );
};

export default PackingListManagementPage;
