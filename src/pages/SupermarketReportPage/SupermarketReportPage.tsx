import React, { useState, useMemo } from "react";
import { Search, PackageCheck, PackageX } from "lucide-react";

// Translated type for PO status
type POStatus = "Complete" | "Incomplete - Awaiting";
type SupermarketPO = {
  poId: string;
  styleId: string;
  totalBundles: number;
  status: POStatus;
  location: string;
  missingBundles?: string[];
};

// Mock data with translated status values
const mockSupermarketPOs: SupermarketPO[] = [
  {
    poId: "PO-002",
    styleId: "HOODIE-RED",
    totalBundles: 20,
    status: "Complete",
    location: "Rack A-01",
  },
  {
    poId: "PO-007",
    styleId: "JEANS-BLUE",
    totalBundles: 15,
    status: "Complete",
    location: "Rack A-02",
  },
  {
    poId: "PO-008",
    styleId: "T-SHIRT-WHT",
    totalBundles: 30,
    status: "Incomplete - Awaiting",
    location: "Floor B",
    missingBundles: ["PO-008-B012", "PO-008-B025"],
  },
  {
    poId: "PO-011",
    styleId: "POLO-GRN",
    totalBundles: 18,
    status: "Complete",
    location: "Rack C-05",
  },
];

const SupermarketReportPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"All" | POStatus>("All");

  const filteredPOs = useMemo(() => {
    return mockSupermarketPOs.filter(
      (po) =>
        (po.poId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          po.styleId.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (activeTab === "All" || po.status === activeTab)
    );
  }, [searchTerm, activeTab]);

  // Translated tabs array
  const tabs: ("All" | POStatus)[] = [
    "All",
    "Complete",
    "Incomplete - Awaiting",
  ];

  return (
    <div className="p-4">
      {/* Translated title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Supermarket Inventory & Status Report
      </h1>

      <div className="bg-white p-4 rounded-xl shadow-md mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          {/* Translated placeholder */}
          <input
            type="text"
            placeholder="Search by PO ID, Style ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6">
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

      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              {/* Translated table headers */}
              <th scope="col" className="px-6 py-3">
                PO ID
              </th>
              <th scope="col" className="px-6 py-3">
                Style ID
              </th>
              <th scope="col" className="px-6 py-3">
                Total Bundles
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Location
              </th>
              <th scope="col" className="px-6 py-3">
                Missing Details
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPOs.map((po) => (
              <tr key={po.poId} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {po.poId}
                </td>
                <td className="px-6 py-4">{po.styleId}</td>
                <td className="px-6 py-4 text-center">{po.totalBundles}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center gap-x-1.5 py-1 px-2.5 rounded-md text-xs font-medium ${
                      // Updated status check to use English value
                      po.status === "Complete"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {/* Updated status check to use English value */}
                    {po.status === "Complete" ? (
                      <PackageCheck className="w-4 h-4" />
                    ) : (
                      <PackageX className="w-4 h-4" />
                    )}
                    {po.status}
                  </span>
                </td>
                <td className="px-6 py-4">{po.location}</td>
                <td className="px-6 py-4">
                  {po.missingBundles ? po.missingBundles.join(", ") : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SupermarketReportPage;
