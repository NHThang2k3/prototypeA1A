// src/pages/BufferReportPage/BufferReportPage.tsx

import React, { useState, useMemo } from "react";
import { Search, Filter } from "lucide-react";

type BundleStatus =
  | "At Heat Press"
  | "In Temp WH"
  | "Returned from Embroidery"
  | "At Bonding";

type Bundle = {
  bundleId: string;
  poId: string;
  styleId: string;
  quantity: number;
  color: string;
  status: BundleStatus;
};

const mockBundles: Bundle[] = [
  {
    bundleId: "B-001",
    poId: "PO-001",
    styleId: "T-SHIRT-BLK",
    quantity: 50,
    color: "Black",
    status: "At Heat Press",
  },
  {
    bundleId: "B-002",
    poId: "PO-001",
    styleId: "T-SHIRT-BLK",
    quantity: 75,
    color: "Black",
    status: "In Temp WH",
  },
  {
    bundleId: "B-005",
    poId: "PO-001",
    styleId: "T-SHIRT-BLK",
    quantity: 60,
    color: "Black",
    status: "At Heat Press",
  },
  {
    bundleId: "B-003",
    poId: "PO-002",
    styleId: "HOODIE-RED",
    quantity: 120,
    color: "Red",
    status: "Returned from Embroidery",
  },
  {
    bundleId: "B-004",
    poId: "PO-002",
    styleId: "HOODIE-RED",
    quantity: 80,
    color: "Red",
    status: "At Bonding",
  },

  //... add more data
];

const BufferReportPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredBundles = useMemo(() => {
    return mockBundles.filter(
      (bundle) =>
        (bundle.bundleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bundle.poId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bundle.styleId.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter === "All" || bundle.status === statusFilter)
    );
  }, [searchTerm, statusFilter]);

  const uniqueStatuses = [
    "All",
    ...Array.from(new Set(mockBundles.map((b) => b.status))),
  ];

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Buffer Inventory & Status Report
      </h1>

      <div className="bg-white p-4 rounded-xl shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Bundle, PO, Style..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg appearance-none focus:ring-blue-500 focus:border-blue-500"
            >
              {uniqueStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                PO ID
              </th>
              <th scope="col" className="px-6 py-3">
                Bundle ID
              </th>
              <th scope="col" className="px-6 py-3">
                Style ID
              </th>
              <th scope="col" className="px-6 py-3">
                Color
              </th>
              <th scope="col" className="px-6 py-3">
                Quantity
              </th>
              <th scope="col" className="px-6 py-3">
                Current Status
              </th>
              {/* Cột Time in Status đã bị xóa */}
            </tr>
          </thead>
          <tbody>
            {filteredBundles.map((bundle) => (
              <tr
                key={bundle.bundleId}
                className="bg-white border-b hover:bg-gray-50"
              >
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                  {bundle.poId}
                </td>
                <td className="px-6 py-4">{bundle.bundleId}</td>
                <td className="px-6 py-4">{bundle.styleId}</td>
                <td className="px-6 py-4">{bundle.color}</td>
                <td className="px-6 py-4">{bundle.quantity}</td>
                <td className="px-6 py-4">{bundle.status}</td>
                {/* Cột Time in Status đã bị xóa */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BufferReportPage;
