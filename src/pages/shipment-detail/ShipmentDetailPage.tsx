// Path: src/pages/shipment-detail/ShipmentDetailPage.tsx

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { mockShipmentData } from "./data";
import type { Shipment, ShipmentItem, BreakdownItem } from "./types";
import PageHeader from "./components/PageHeader";
import ShipmentSummary from "./components/ShipmentSummary";
import PrintToolbar from "./components/PrintToolbar";
import ItemsToPrintTable from "./components/ItemsToPrintTable";
import BreakdownModal from "./components/BreakdownModal"; // Import modal
import { Edit, Trash2 } from "lucide-react";

const ShipmentDetailPage = () => {
  const { shipmentId } = useParams<{ shipmentId: string }>();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedItemIds, setSelectedItemIds] = useState<(number | string)[]>(
    []
  );

  // State for breakdown modal
  const [isBreakdownModalOpen, setIsBreakdownModalOpen] = useState(false);
  const [currentItemForBreakdown, setCurrentItemForBreakdown] =
    useState<ShipmentItem | null>(null);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      if (shipmentId === mockShipmentData.id) {
        setShipment(mockShipmentData);
      } else {
        setShipment(null);
      }
      setLoading(false);
    }, 500);
  }, [shipmentId]);

  const handleOpenBreakdownModal = (item: ShipmentItem) => {
    setCurrentItemForBreakdown(item);
    setIsBreakdownModalOpen(true);
  };

  const handleCloseBreakdownModal = () => {
    setIsBreakdownModalOpen(false);
    setCurrentItemForBreakdown(null);
  };

  const handleSaveBreakdown = (breakdownData: BreakdownItem[]) => {
    if (!shipment || !currentItemForBreakdown) return;

    // Update the shipment state with the new breakdown data
    const updatedItems = shipment.items.map((item) => {
      if (item.id === currentItemForBreakdown.id) {
        return { ...item, breakdown: breakdownData };
      }
      return item;
    });

    setShipment({ ...shipment, items: updatedItems });
    handleCloseBreakdownModal();
    alert("Đã lưu thông tin phân rã!");
  };

  const handlePrintSelected = () => {
    if (selectedItemIds.length === 0) return;
    alert(`Đang in ${selectedItemIds.length} tem đã chọn...`);
    console.log("Printing items with IDs:", selectedItemIds);
  };

  const handlePrintAll = () => {
    const allItemCount =
      shipment?.items.reduce(
        (acc, item) => acc + (item.breakdown?.length || 1),
        0
      ) || 0;
    alert(`Đang in tất cả ${allItemCount} tem...`);
    console.log("Printing all items for shipment:", shipment?.id);
  };

  if (loading) {
    return <div className="p-8">Đang tải dữ liệu lô hàng...</div>;
  }

  if (!shipment) {
    return (
      <div className="p-8">Không tìm thấy lô hàng với ID: {shipmentId}</div>
    );
  }

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Chi tiết lô hàng", href: `/shipments/${shipment.id}` },
  ];

  return (
    <>
      <div className="p-4 sm:p-6 lg:p-8">
        <PageHeader
          title={`Chi tiết: ${shipment.packingListNo}`}
          breadcrumbItems={breadcrumbItems}
        >
          <div className="flex space-x-3">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              <Edit className="-ml-1 mr-2 h-5 w-5 text-gray-500" />
              Sửa
            </button>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none"
            >
              <Trash2 className="-ml-1 mr-2 h-5 w-5" />
              Xóa
            </button>
          </div>
        </PageHeader>

        <ShipmentSummary shipment={shipment} />

        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Danh sách vật tư & In tem
          </h2>
          <PrintToolbar
            selectedCount={selectedItemIds.length}
            onPrintSelected={handlePrintSelected}
            onPrintAll={handlePrintAll}
          />
          <ItemsToPrintTable
            items={shipment.items}
            selectedItems={selectedItemIds}
            onSelectionChange={setSelectedItemIds}
            onBreakdown={handleOpenBreakdownModal}
          />
        </div>
      </div>

      {/* Render the modal */}
      {currentItemForBreakdown && (
        <BreakdownModal
          isOpen={isBreakdownModalOpen}
          item={currentItemForBreakdown}
          onClose={handleCloseBreakdownModal}
          onSave={handleSaveBreakdown}
        />
      )}
    </>
  );
};

export default ShipmentDetailPage;
