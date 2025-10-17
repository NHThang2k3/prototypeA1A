// D:\WATATECH\WH\src\pages\inbound-dashboard\InboundDashboardPage.tsx

import React, { useState, useEffect } from "react";
import { Inbox, ClipboardList, PackageCheck, Hourglass } from "lucide-react";
import type { Receipt, SummaryData } from "./types";
import { DashboardHeader } from "./components/DashboardHeader";
import { SummaryCard } from "./components/SummaryCard";
import { ShipmentFilters } from "./components/ShipmentFilters";
import { ShipmentsTable } from "./components/ShipmentsTable";
import { CardSkeleton } from "./components/skeletons/CardSkeleton";

// Dữ liệu giả lập mới, phản ánh quy trình nghiệp vụ kho
const MOCK_RECEIPTS: Receipt[] = [
  {
    id: "1",
    poNumber: "PO-11223",
    packingList: "PKL-A001",
    supplier: "Vải Sợi Miền Nam",
    arrivalDate: "2023-11-25",
    status: "pending_receipt",
    creator: "An Nguyễn",
    progress: { receivedItems: 0, totalItems: 50 },
  },
  {
    id: "2",
    poNumber: "PO-11224",
    packingList: "PKL-B002",
    supplier: "Phụ liệu An Phước",
    arrivalDate: "2023-11-28",
    status: "partially_received",
    creator: "Bình Trần",
    progress: { receivedItems: 35, totalItems: 100 },
  },
  {
    id: "3",
    poNumber: "PO-11220",
    packingList: "PKL-C003",
    supplier: "Global Weaving Co.",
    arrivalDate: "2023-11-26",
    status: "fully_received",
    creator: "Chi Phạm",
    progress: { receivedItems: 25, totalItems: 25 },
  },
  {
    id: "4",
    poNumber: "PO-11225",
    packingList: "PKL-D004",
    supplier: "Vải Sợi Miền Nam",
    arrivalDate: "2023-11-28",
    status: "processing",
    creator: "An Nguyễn",
    progress: { receivedItems: 5, totalItems: 80 },
  },
  {
    id: "5",
    poNumber: "PO-11219",
    packingList: "PKL-E005",
    supplier: "Supplier Z",
    arrivalDate: "2023-11-27",
    status: "pending_receipt",
    creator: "Dung Lê",
    progress: { receivedItems: 0, totalItems: 120 },
  },
];

// Dữ liệu tóm tắt mới
const MOCK_SUMMARY_DATA: SummaryData[] = [
  { title: "Chờ nhận hàng", value: 2, icon: Inbox, color: "bg-yellow-500" },
  { title: "Đang xử lý", value: 1, icon: ClipboardList, color: "bg-blue-500" },
  { title: "Nhận một phần", value: 1, icon: Hourglass, color: "bg-cyan-500" },
  {
    title: "Hoàn thành hôm nay",
    value: 8,
    icon: PackageCheck,
    color: "bg-green-500",
  },
];

const InboundDashboardPage = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setReceipts(MOCK_RECEIPTS);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {isLoading ? (
            <>
              <CardSkeleton /> <CardSkeleton /> <CardSkeleton />{" "}
              <CardSkeleton />
            </>
          ) : (
            MOCK_SUMMARY_DATA.map((item) => (
              <SummaryCard
                key={item.title}
                icon={item.icon}
                title={item.title}
                value={item.value}
                color={item.color}
              />
            ))
          )}
        </div>

        <ShipmentFilters />

        <ShipmentsTable receipts={receipts} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default InboundDashboardPage;
