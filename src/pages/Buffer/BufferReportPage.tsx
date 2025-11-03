// src/pages/BufferReportPage/BufferReportPage.tsx

import React, { useState, useMemo } from "react";
import { Search, Filter, Clock } from "lucide-react";

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
  timeInStatus: number; // in hours
};

const mockBundles: Bundle[] = [
  {
    bundleId: "B-001",
    poId: "PO-001",
    styleId: "T-SHIRT-BLK",
    quantity: 50,
    color: "Black",
    status: "At Heat Press",
    timeInStatus: 26,
  },
  {
    bundleId: "B-002",
    poId: "PO-001",
    styleId: "T-SHIRT-BLK",
    quantity: 75,
    color: "Black",
    status: "In Temp WH",
    timeInStatus: 10,
  },
  {
    bundleId: "B-005",
    poId: "PO-001",
    styleId: "T-SHIRT-BLK",
    quantity: 60,
    color: "Black",
    status: "At Heat Press",
    timeInStatus: 15,
  },
  {
    bundleId: "B-003",
    poId: "PO-002",
    styleId: "HOODIE-RED",
    quantity: 120,
    color: "Red",
    status: "Returned from Embroidery",
    timeInStatus: 5,
  },
  {
    bundleId: "B-004",
    poId: "PO-002",
    styleId: "HOODIE-RED",
    quantity: 80,
    color: "Red",
    status: "At Bonding",
    timeInStatus: 48,
  },

  //... add more data
];

const OVERDUE_THRESHOLD_HOURS = 24;

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
              {/* 1. Đã di chuyển PO ID lên đầu */}
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
              <th scope="col" className="px-6 py-3">
                Time in Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredBundles.map((bundle) => {
              const isOverdue = bundle.timeInStatus > OVERDUE_THRESHOLD_HOURS;
              return (
                <tr
                  key={bundle.bundleId}
                  className={`border-b ${
                    isOverdue ? "bg-red-50" : "bg-white"
                  } hover:bg-gray-50`}
                >
                  {/* 2. Đã di chuyển PO ID lên đầu */}
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {bundle.poId}
                  </td>
                  <td className="px-6 py-4">{bundle.bundleId}</td>
                  <td className="px-6 py-4">{bundle.styleId}</td>
                  <td className="px-6 py-4">{bundle.color}</td>
                  <td className="px-6 py-4">{bundle.quantity}</td>
                  <td className="px-6 py-4">{bundle.status}</td>
                  <td
                    className={`px-6 py-4 font-semibold flex items-center ${
                      isOverdue ? "text-red-600" : "text-gray-700"
                    }`}
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    {bundle.timeInStatus} hours
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BufferReportPage;
