// src/pages/damaged-goods-repair/RepairRequestListPage.tsx

import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Filter,
  PlusCircle,
  Download,
  Search,
  Eye,
  Edit,
  Trash2,
  PieChart,
} from "lucide-react";
import ReactECharts from "echarts-for-react";
import type { RepairRequest, RequestStatus } from "./types";

// --- Mock Data ---
const mockRequests: RepairRequest[] = [
  {
    id: "RR-001",
    creationDate: "2023-10-26",
    poCode: "PO-12345",
    productCode: "STY-ABC-01",
    process: "Embroidery",
    defectType: "Thêu sai chỉ",
    defectQty: 15,
    assignee: "Nguyễn Văn A",
    creator: "Trần Thị B",
    status: "In Progress",
  },
  {
    id: "RR-002",
    creationDate: "2023-10-26",
    poCode: "PO-12346",
    productCode: "STY-XYZ-02",
    process: "Heat Press",
    defectType: "Ép bong tróc",
    defectQty: 8,
    creator: "Lê Văn C",
    status: "Pending Approval",
  },
  {
    id: "RR-003",
    creationDate: "2023-10-25",
    poCode: "PO-12345",
    productCode: "STY-ABC-01",
    process: "Bonding",
    defectType: "Keo dán tràn",
    defectQty: 22,
    assignee: "Phạm Dũng",
    creator: "Trần Thị B",
    status: "Completed",
    successfullyRepairedQty: 22,
    unrepairableQty: 0,
  },
  {
    id: "RR-004",
    creationDate: "2023-10-24",
    poCode: "PO-12347",
    productCode: "STY-QWE-03",
    process: "Printing",
    defectType: "In lem màu",
    defectQty: 5,
    creator: "Lê Văn C",
    status: "Rejected",
    rejectionReason: "Chi phí sửa cao hơn giá trị SP.",
  },
  {
    id: "RR-005",
    creationDate: "2023-10-27",
    poCode: "PO-12348",
    productCode: "STY-RTY-04",
    process: "Embroidery",
    defectType: "Thêu lệch vị trí",
    defectQty: 12,
    creator: "Trần Thị B",
    status: "Approved",
    assignee: "Nguyễn Thị D",
  },
];

// --- Helper Components ---
const StatusBadge = ({ status }: { status: RequestStatus }) => {
  const statusStyles: Record<RequestStatus, string> = {
    "Pending Approval": "bg-yellow-100 text-yellow-800",
    Approved: "bg-blue-100 text-blue-800",
    "In Progress": "bg-indigo-100 text-indigo-800",
    Completed: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
  };
  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
};

const RepairRequestListPage = () => {
  const [requests, setRequests] = useState<RepairRequest[]>(mockRequests);
  const [filters, setFilters] = useState({
    dateRange: "",
    status: "All",
    poCode: "",
    process: "All",
    creator: "",
  });

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleCancelRequest = (requestId: string) => {
    if (
      window.confirm(
        "Are you sure you want to cancel this request? This action cannot be undone."
      )
    ) {
      setRequests((prevRequests) =>
        prevRequests.filter((req) => req.id !== requestId)
      );
    }
  };

  const filteredRequests = useMemo(() => {
    return requests.filter(
      (req) =>
        (filters.status === "All" || req.status === filters.status) &&
        (filters.process === "All" || req.process === filters.process) &&
        req.poCode.toLowerCase().includes(filters.poCode.toLowerCase())
    );
  }, [requests, filters]);

  const getChartOption = () => ({
    tooltip: { trigger: "item" },
    legend: { orient: "vertical", left: "left", top: "center" },
    series: [
      {
        name: "Request Status",
        type: "pie",
        radius: ["50%", "70%"],
        avoidLabelOverlap: false,
        label: { show: false, position: "center" },
        emphasis: { label: { show: true, fontSize: "20", fontWeight: "bold" } },
        labelLine: { show: false },
        data: Object.entries(
          filteredRequests.reduce((acc, req) => {
            acc[req.status] = (acc[req.status] || 0) + 1;
            return acc;
          }, {} as Record<RequestStatus, number>)
        ).map(([name, value]) => ({ value, name })),
      },
    ],
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Repair Request List
        </h1>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Export to Excel
          </button>
          <Link
            to="/decoration/productivity/create-data-entry"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <PlusCircle className="w-4 h-4" />
            Create New Request
          </Link>
        </div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-700 mb-2 flex items-center gap-2">
          <PieChart className="w-5 h-5 text-blue-600" />
          Overview by Status
        </h2>
        <ReactECharts option={getChartOption()} style={{ height: "250px" }} />
      </div>
      <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 space-y-4">
        <div className="flex items-center gap-2 font-semibold text-gray-700">
          <Filter className="w-5 h-5" />
          <span>Filters</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <input
            type="date"
            name="dateRange"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Date Range"
            onChange={handleFilterChange}
          />
          <select
            name="status"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            onChange={handleFilterChange}
          >
            <option value="All">All Statuses</option>
            <option value="Pending Approval">Pending Approval</option>
            <option value="Approved">Approved</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Rejected">Rejected</option>
          </select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              name="poCode"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pl-10"
              placeholder="Search by PO / Job Code..."
              onChange={handleFilterChange}
            />
          </div>
          <select
            name="process"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            onChange={handleFilterChange}
          >
            <option value="All">All Processes</option>
            <option value="Bonding">Bonding</option>
            <option value="Embroidery">Embroidery</option>
            <option value="Heat Press">Heat Press</option>
            <option value="Printing">Printing</option>
          </select>
          <input
            type="text"
            name="creator"
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Creator"
            onChange={handleFilterChange}
          />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Request ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Creation Date
                </th>
                <th scope="col" className="px-6 py-3">
                  PO / Job
                </th>
                <th scope="col" className="px-6 py-3">
                  Product Code
                </th>
                <th scope="col" className="px-6 py-3">
                  Process
                </th>
                <th scope="col" className="px-6 py-3">
                  Defect Type
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Defect Qty
                </th>
                <th scope="col" className="px-6 py-3">
                  Assignee
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => (
                <tr key={req.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {req.id}
                  </td>
                  <td className="px-6 py-4">{req.creationDate}</td>
                  <td className="px-6 py-4">{req.poCode}</td>
                  <td className="px-6 py-4">{req.productCode}</td>
                  <td className="px-6 py-4">{req.process}</td>
                  <td className="px-6 py-4">{req.defectType}</td>
                  <td className="px-6 py-4 text-center">{req.defectQty}</td>
                  <td className="px-6 py-4">{req.assignee || "N/A"}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={req.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        to={`/decoration/productivity/approve-data/${req.id}`}
                        title="View/Approve"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye className="w-5 h-5" />
                      </Link>
                      <Link
                        to={`/decoration/productivity/record-result-information/${req.id}`}
                        title="Edit/Record"
                        className="text-green-600 hover:text-green-800"
                      >
                        <Edit className="w-5 h-5" />
                      </Link>
                      <button
                        onClick={() => handleCancelRequest(req.id)}
                        title="Cancel"
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RepairRequestListPage;
