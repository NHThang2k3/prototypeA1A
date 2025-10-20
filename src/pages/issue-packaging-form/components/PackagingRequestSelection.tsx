// Path: src/pages/issue-packaging-form/components/PackagingRequestSelection.tsx

import React, { useState, useEffect, useMemo } from "react";
import { Loader2, Search } from "lucide-react";
import type { PackagingRequest } from "../types";
import { getPackagingRequests } from "../data";

interface Props {
  onRequestSelect: (request: PackagingRequest) => void;
}

const PackagingRequestSelection: React.FC<Props> = ({ onRequestSelect }) => {
  const [requests, setRequests] = useState<PackagingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [factoryFilter, setFactoryFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  useEffect(() => {
    getPackagingRequests().then((data) => {
      setRequests(data);
      setLoading(false);
    });
  }, []);

  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const jobMatch =
        req.JOB.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.ID.toLowerCase().includes(searchTerm.toLowerCase()) ||
        req.Style.toLowerCase().includes(searchTerm.toLowerCase());
      const factoryMatch =
        factoryFilter === "" || req.FactoryLine === factoryFilter;
      const dateMatch = dateFilter === "" || req.DateRequired === dateFilter;
      return jobMatch && factoryMatch && dateMatch;
    });
  }, [requests, searchTerm, factoryFilter, dateFilter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-700 mb-4">
        1. Select a Packaging Request
      </h2>
      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by Request ID, Style, JOB..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select
          value={factoryFilter}
          onChange={(e) => setFactoryFilter(e.target.value)}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Factory Lines</option>
          {[...new Set(requests.map((r) => r.FactoryLine))].map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Requests Table */}
      <div className="overflow-x-auto max-h-[60vh]">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 sticky top-0">
            <tr>
              <th className="p-3">Request ID</th>
              <th className="p-3">JOB</th>
              <th className="p-3">Style</th>
              <th className="p-3">Factory Line</th>
              <th className="p-3">Date Required</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((req) => (
              <tr key={req.ID} className="bg-white border-b hover:bg-gray-50">
                <td className="p-3 font-semibold text-indigo-600">{req.ID}</td>
                <td className="p-3">{req.JOB}</td>
                <td className="p-3">{req.Style}</td>
                <td className="p-3">{req.FactoryLine}</td>
                <td className="p-3">
                  {new Date(req.DateRequired).toLocaleDateString()}
                </td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800`}
                  >
                    {req.Status}
                  </span>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => onRequestSelect(req)}
                    className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-xs font-medium"
                  >
                    Select
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PackagingRequestSelection;
