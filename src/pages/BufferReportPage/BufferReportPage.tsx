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
  status: BundleStatus;
  timeInStatus: number; // in hours
};

// Mock data
const mockBundles: Bundle[] = [
  {
    bundleId: "B-001",
    poId: "PO-001",
    styleId: "T-SHIRT-BLK",
    status: "At Heat Press",
    timeInStatus: 26,
  },
  {
    bundleId: "B-002",
    poId: "PO-001",
    styleId: "T-SHIRT-BLK",
    status: "In Temp WH",
    timeInStatus: 10,
  },
  {
    bundleId: "B-003",
    poId: "PO-002",
    styleId: "HOODIE-RED",
    status: "Returned from Embroidery",
    timeInStatus: 5,
  },
  {
    bundleId: "B-004",
    poId: "PO-002",
    styleId: "HOODIE-RED",
    status: "At Bonding",
    timeInStatus: 48,
  },
  {
    bundleId: "B-005",
    poId: "PO-001",
    styleId: "T-SHIRT-BLK",
    status: "At Heat Press",
    timeInStatus: 15,
  },
  //... add more data
];
const OVERDUE_THRESHOLD_HOURS = 24;

const BufferReportPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [groupByPO, setGroupByPO] = useState(true);

  const filteredBundles = useMemo(() => {
    return mockBundles.filter(
      (bundle) =>
        (bundle.bundleId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bundle.poId.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (statusFilter === "All" || bundle.status === statusFilter)
    );
  }, [searchTerm, statusFilter]);

  const groupedBundles = useMemo(() => {
    if (!groupByPO) return { all_bundles: filteredBundles };

    return filteredBundles.reduce((acc, bundle) => {
      (acc[bundle.poId] = acc[bundle.poId] || []).push(bundle);
      return acc;
    }, {} as Record<string, Bundle[]>);
  }, [filteredBundles, groupByPO]);

  const uniqueStatuses = [
    "All",
    ...Array.from(new Set(mockBundles.map((b) => b.status))),
  ];

  return (
    <div className="p-4">
      {/* Translated title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Buffer Inventory & Status Report
      </h1>

      <div className="bg-white p-4 rounded-xl shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            {/* Translated placeholder */}
            <input
              type="text"
              placeholder="Search by Bundle ID, PO ID..."
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
          <div className="flex items-center justify-start md:justify-end">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={groupByPO}
                onChange={() => setGroupByPO(!groupByPO)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              {/* Translated label */}
              <span className="ml-2 text-gray-700">Group by PO</span>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {Object.keys(groupedBundles).map((poId) => (
          <div key={poId} className="mb-4 last:mb-0">
            {groupByPO && (
              <div className="bg-gray-100 p-3 border-b">
                {/* Translated group header */}
                <h2 className="font-bold text-lg text-gray-800">
                  PO: {poId} ({groupedBundles[poId].length} bundles)
                </h2>
              </div>
            )}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-600">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    {/* Translated table headers */}
                    <th scope="col" className="px-6 py-3">
                      Bundle ID
                    </th>
                    {!groupByPO && (
                      <th scope="col" className="px-6 py-3">
                        PO ID
                      </th>
                    )}
                    <th scope="col" className="px-6 py-3">
                      Current Status
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Time in Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {groupedBundles[poId].map((bundle) => {
                    const isOverdue =
                      bundle.timeInStatus > OVERDUE_THRESHOLD_HOURS;
                    return (
                      <tr
                        key={bundle.bundleId}
                        className={`border-b ${
                          isOverdue ? "bg-red-50" : "bg-white"
                        }`}
                      >
                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                          {bundle.bundleId}
                        </td>
                        {!groupByPO && (
                          <td className="px-6 py-4">{bundle.poId}</td>
                        )}
                        <td className="px-6 py-4">{bundle.status}</td>
                        <td
                          className={`px-6 py-4 font-semibold flex items-center ${
                            isOverdue ? "text-red-600" : "text-gray-700"
                          }`}
                        >
                          <Clock className="w-4 h-4 mr-2" />
                          {/* Translated unit */}
                          {bundle.timeInStatus} hours
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BufferReportPage;
