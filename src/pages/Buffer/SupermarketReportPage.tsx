// src/pages/SupermarketReportPage/SupermarketReportPage.tsx

import React, { useState, useMemo } from "react";
import {
  Search,
  PackageCheck,
  GitCommitHorizontal,
  Clock,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

// Định nghĩa các vị trí xử lý
type ProcessLocation =
  | "Supermarket"
  | "Bonding"
  | "Heat Press"
  | "Pad Print"
  | "Thêu"
  | "Buffer";

// Định nghĩa trạng thái của PO, suy ra từ các Bundle
type POStatus = "Complete" | "Partially Complete" | "In Progress";

// Cấu trúc dữ liệu cho một Bundle
type Bundle = {
  bundleId: string;
  quantity: number;
  currentLocation: ProcessLocation;
};

// Cấu trúc dữ liệu cho một PO, chứa danh sách các Bundle
type PO = {
  poId: string;
  styleId: string;
  color: string;
  bundles: Bundle[];
};

// Dữ liệu giả lập đã được cập nhật
const mockPOs: PO[] = [
  {
    // PO này đã Hoàn thành Toàn bộ
    poId: "PO-002",
    styleId: "HOODIE-RED",
    color: "Red",
    bundles: [
      { bundleId: "PO-002-B01", quantity: 50, currentLocation: "Supermarket" },
      { bundleId: "PO-002-B02", quantity: 50, currentLocation: "Supermarket" },
    ],
  },
  {
    // PO này Hoàn thành một phần
    poId: "PO-008",
    styleId: "T-SHIRT-WHT",
    color: "White",
    bundles: [
      { bundleId: "PO-008-B01", quantity: 70, currentLocation: "Supermarket" },
      { bundleId: "PO-008-B02", quantity: 30, currentLocation: "Bonding" },
      { bundleId: "PO-008-B03", quantity: 25, currentLocation: "Heat Press" },
    ],
  },
  {
    // PO này đang trong quá trình xử lý
    poId: "PO-011",
    styleId: "POLO-GRN",
    color: "Green",
    bundles: [
      { bundleId: "PO-011-B01", quantity: 18, currentLocation: "Heat Press" },
      { bundleId: "PO-011-B02", quantity: 22, currentLocation: "Buffer" },
    ],
  },
  {
    poId: "PO-015",
    styleId: "JACKET-BLK",
    color: "Black",
    bundles: [
      { bundleId: "PO-015-B01", quantity: 40, currentLocation: "Supermarket" },
    ],
  },
];

// Hàm trợ giúp để tính toán trạng thái và số lượng
const processPOData = (po: PO) => {
  const totalQuantity = po.bundles.reduce((sum, b) => sum + b.quantity, 0);
  const completedQuantity = po.bundles
    .filter((b) => b.currentLocation === "Supermarket")
    .reduce((sum, b) => sum + b.quantity, 0);

  let status: POStatus;
  if (completedQuantity === 0) {
    status = "In Progress";
  } else if (completedQuantity < totalQuantity) {
    status = "Partially Complete";
  } else {
    status = "Complete";
  }

  return { ...po, totalQuantity, completedQuantity, status };
};

const SupermarketReportPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"All" | POStatus>("All");
  const [expandedPOIds, setExpandedPOIds] = useState<Set<string>>(new Set());

  const processedPOs = useMemo(() => {
    return mockPOs
      .map(processPOData) // Thêm dữ liệu đã tính toán (status, quantities)
      .filter(
        (po) =>
          (po.poId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            po.styleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            po.color.toLowerCase().includes(searchTerm.toLowerCase())) &&
          (activeTab === "All" || po.status === activeTab)
      );
  }, [searchTerm, activeTab]);

  const handleToggleExpand = (poId: string) => {
    setExpandedPOIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(poId)) {
        newSet.delete(poId);
      } else {
        newSet.add(poId);
      }
      return newSet;
    });
  };

  const tabs: ("All" | POStatus)[] = [
    "All",
    "Complete",
    "Partially Complete",
    "In Progress",
  ];

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Supermarket Inventory & Status Report
      </h1>

      {/* Search and Filter UI */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by PO, Style, Color..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-4">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-2 py-3 w-12"></th>
              <th scope="col" className="px-6 py-3">
                PO ID
              </th>
              <th scope="col" className="px-6 py-3">
                Style ID
              </th>
              <th scope="col" className="px-6 py-3">
                Color
              </th>
              <th scope="col" className="px-6 py-3">
                Progress (Qty)
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {processedPOs.map((po) => {
              const isExpanded = expandedPOIds.has(po.poId);
              return (
                <React.Fragment key={po.poId}>
                  {/* Hàng PO chính */}
                  <tr className="bg-white border-b hover:bg-gray-50">
                    <td className="px-2 py-4">
                      <button
                        onClick={() => handleToggleExpand(po.poId)}
                        className="p-1 rounded-full hover:bg-gray-200"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-5 h-5" />
                        ) : (
                          <ChevronRight className="w-5 h-5" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {po.poId}
                    </td>
                    <td className="px-6 py-4">{po.styleId}</td>
                    <td className="px-6 py-4">{po.color}</td>
                    <td className="px-6 py-4 font-semibold text-center">
                      {po.completedQuantity} / {po.totalQuantity}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-x-1.5 py-1 px-2.5 rounded-md text-xs font-medium ${
                          po.status === "Complete"
                            ? "bg-green-100 text-green-800"
                            : po.status === "Partially Complete"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {po.status === "Complete" ? (
                          <PackageCheck className="w-4 h-4" />
                        ) : po.status === "Partially Complete" ? (
                          <GitCommitHorizontal className="w-4 h-4" />
                        ) : (
                          <Clock className="w-4 h-4" />
                        )}
                        {po.status}
                      </span>
                    </td>
                  </tr>

                  {/* Hàng chi tiết Bundle (chỉ hiển thị khi mở rộng) */}
                  {isExpanded && (
                    <tr className="bg-gray-50">
                      <td colSpan={6} className="p-0">
                        <div className="px-8 py-4">
                          <h4 className="text-md font-semibold text-gray-700 mb-2">
                            Bundle Details
                          </h4>
                          <table className="w-full text-sm">
                            <thead className="text-xs text-gray-600">
                              <tr>
                                <th className="text-left py-2 px-4">
                                  Bundle ID
                                </th>
                                <th className="text-left py-2 px-4">
                                  Quantity
                                </th>
                                <th className="text-left py-2 px-4">
                                  Current Location
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {po.bundles.map((bundle) => (
                                <tr key={bundle.bundleId} className="border-t">
                                  <td className="py-2 px-4">
                                    {bundle.bundleId}
                                  </td>
                                  <td className="py-2 px-4">
                                    {bundle.quantity}
                                  </td>
                                  <td className="py-2 px-4">
                                    <span
                                      className={`font-medium ${
                                        bundle.currentLocation === "Supermarket"
                                          ? "text-green-600"
                                          : "text-gray-600"
                                      }`}
                                    >
                                      {bundle.currentLocation}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupermarketReportPage;
